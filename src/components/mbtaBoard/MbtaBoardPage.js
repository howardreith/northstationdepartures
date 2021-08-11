import React, { useEffect, useState, useRef } from 'react';
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, makeStyles, Box,
} from '@material-ui/core';
import Clock from './Clock';
import fetchAndFormatPredictionData from '../../utils/fetchAndFormatPredictionData';

const useStyles = makeStyles({
  boxContainer: {
    backgroundColor: 'black',
    marginLeft: '20px',
    marginRight: '20px',
    marginTop: '20px',
  },
  table: {
    minWidth: 650,
  },
  tableHeading: {
    color: 'gray',
    paddingTop: '2px',
    paddingBottom: '2px',
    borderBottom: '1px solid darkgray',
  },
  mainHeading: {
    color: 'gray',
    marginTop: 0,
    marginBottom: 0,
  },
  tableCell: {
    color: 'gold',
    fontFamily: 'Lucida Console',
    fontSize: '16px',
    paddingTop: '2px',
    paddingBottom: '2px',
    borderBottom: '1px solid darkgray',
  },
});

export default function MbtaBoardPage() {
  const [data, setData] = useState(null);
  const scheduleData = useRef({});
  const classes = useStyles();
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    // Prediction data is missing some info. Retrieve schedule data so it is there if necessary
    fetch(`https://api-v3.mbta.com/schedules/?api_key=${apiKey}&sort=departure_time&direction_id=0&stop=place-north&route=CR-Fitchburg,CR-Haverhill,CR-Lowell,CR-Newburyport,CR-Greenbush,CR-Middleborough,CR-Kingston,CR-Fairmount,CR-Franklin,CR-Worcester,CR-Providence,CR-Needham`)
      .then((res) => res.json())
      .then((res) => {
        res.data.forEach((datum) => {
          const key = datum.id.replace('schedule-', '');
          scheduleData.current[key] = {};
          scheduleData.current[key].departureTime = datum.attributes.departure_time;
          scheduleData.current[key].destination = datum.relationships.route.data.id.replace('CR-', '');
        });
      })
      .then(() => {
        fetchAndFormatPredictionData(scheduleData.current).then((res) => {
          setData(res);
        });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('An error occurred fetching data from MBTA API: ', err);
      });
  }, []);

  useEffect(() => {
    // MBTA has a streaming API for real-time detailed updates, but it's far more data
    // than we need. Periodically polling the relevant endpoint is sufficient. For info on
    // streaming, see https://www.mbta.com/developers/v3-api/streaming
    const interval = setInterval(
      async () => {
        const res = await fetchAndFormatPredictionData(scheduleData.current);
        return setData(res);
      }, 10000,
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Box className={classes.boxContainer}>
      <Box display="flex" width="100%" paddingTop="15px">
        <Box paddingLeft="15px">
          <Clock isTime={false} />
        </Box>
        <Box marginLeft="auto" textAlign="center">
          <h1 className={classes.mainHeading}>North Station Information</h1>
        </Box>
        <Box paddingRight="15px" marginLeft="auto">
          <Clock isTime />
        </Box>
      </Box>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeading} align="center">Carrier</TableCell>
              <TableCell className={classes.tableHeading} align="center">Time</TableCell>
              <TableCell className={classes.tableHeading} align="center">Destination</TableCell>
              <TableCell className={classes.tableHeading} align="center">Train#</TableCell>
              <TableCell className={classes.tableHeading} align="center">Track</TableCell>
              <TableCell className={classes.tableHeading} align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.map((row) => {
              let time = new Date(row.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              if (time[0] === '0') {
                time = time.replace('0', '');
              }
              return (
                <TableRow key={row.name} data-test-id={`${row.name}-row`} data-test-type="departureRow">
                  <TableCell key={`${row.name}-carrier`} data-test-id={`${row.name}-carrier`} className={classes.tableCell} align="left">MBTA</TableCell>
                  <TableCell key={`${row.name}-departureTime`} data-test-id={`${row.name}-departureTime`} className={classes.tableCell} align="left">{time}</TableCell>
                  <TableCell key={`${row.name}-destination`} data-test-id={`${row.name}-destination`} className={classes.tableCell} align="left">{row.destination}</TableCell>
                  <TableCell key={`${row.name}-trainNumber`} data-test-id={`${row.name}-trainNumber`} className={classes.tableCell} align="left">{row.trainNumber}</TableCell>
                  <TableCell key={`${row.name}-trackNumber`} data-test-id={`${row.name}-trackNumber`} className={classes.tableCell} align="left">{row.trackNumber}</TableCell>
                  <TableCell key={`${row.name}-status`} data-test-id={`${row.name}-status`} className={classes.tableCell} align="left">{row.status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
