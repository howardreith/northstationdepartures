import React, { useEffect, useState } from 'react';
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, makeStyles, Box,
} from '@material-ui/core';
import Clock from './Clock';

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
  const classes = useStyles();
  // Carrier, time, destination, train#, track#, status
  // Also displays date in the upper left, time in the upper right
  useEffect(() => {
    const formattedData = {};
    const scheduleData = {};

    fetch('https://api-v3.mbta.com/schedules/?sort=departure_time&direction_id=0&stop=place-north&route=CR-Fitchburg,CR-Haverhill,CR-Lowell,CR-Newburyport,CR-Greenbush,CR-Middleborough,CR-Kingston,CR-Fairmount,CR-Franklin,CR-Worcester,CR-Providence,CR-Needham')
      .then((res) => res.json())
      .then((res) => {
        res.data.forEach((datum) => {
          const key = datum.id.replace('schedule-', '');
          scheduleData[key] = {};
          scheduleData[key].departureTime = datum.attributes.departure_time;
          scheduleData[key].destination = datum.relationships.route.data.id.replace('CR-', '');
        });
      })
      .then(() => {
        fetch('https://api-v3.mbta.com/predictions/?sort=departure_time&direction_id=0&stop=place-north&route=CR-Fitchburg,CR-Haverhill,CR-Lowell,CR-Newburyport,CR-Greenbush,CR-Middleborough,CR-Kingston,CR-Fairmount,CR-Franklin,CR-Worcester,CR-Providence,CR-Needham')
          .then((res) => res.json())
          .then((res) => {
            res.data.forEach((datum) => {
              const key = datum.id.replace('prediction-', '');
              formattedData[key] = {};
              const stopData = datum.relationships.stop.data.id.split('-');
              if (datum.attributes.departure_time) {
                formattedData[key].departureTime = datum.attributes.departure_time;
              } else if (scheduleData[key]) {
                formattedData[key].departureTime = scheduleData[key].departureTime;
              } else {
                // The train has departed and/or is not on the schedule
                delete formattedData[key];
              }
              if (formattedData[key]) {
                formattedData[key].name = key;
                formattedData[key].destination = datum.relationships.route.data.id.replace('CR-', '');
                formattedData[key].status = datum.attributes.status;
                formattedData[key].trainNumber = (datum.relationships.vehicle.data
                  && datum.relationships.vehicle.data.id) || 'TBD';
                formattedData[key].trackNumber = stopData.length > 2 ? stopData[2] : 'TBD';
              }
            });
            const sorted = Object.values(formattedData).sort((a, b) => (
              new Date(a.departureTime)) - (new Date(b.departureTime)));
            setData(sorted);
          });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('An error occurred fetching data from MBTA API: ', err);
      });
  }, []);

  return (
    <Box className={classes.boxContainer}>
      <Box display="flex" width="100%" paddingTop="15px">
        <Box paddingLeft="15px">
          <Clock isTime />
        </Box>
        <Box marginLeft="auto" textAlign="center">
          <h1 className={classes.mainHeading}>North Station Information</h1>
        </Box>
        <Box paddingRight="15px" marginLeft="auto">
          <Clock isTime={false} />
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
                <TableRow key={row.name}>
                  <TableCell className={classes.tableCell} align="left">MBTA</TableCell>
                  <TableCell className={classes.tableCell} align="left">{time}</TableCell>
                  <TableCell className={classes.tableCell} align="left">{row.destination}</TableCell>
                  <TableCell className={classes.tableCell} align="left">{row.trainNumber}</TableCell>
                  <TableCell className={classes.tableCell} align="left">{row.trackNumber}</TableCell>
                  <TableCell className={classes.tableCell} align="left">{row.status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
