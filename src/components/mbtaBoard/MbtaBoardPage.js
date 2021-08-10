import React, { useEffect, useState } from 'react';
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, makeStyles, Box,
} from '@material-ui/core';

const useStyles = makeStyles({
  boxContainer: {
    backgroundColor: 'black',
    marginLeft: '20px',
    marginRight: '20px',
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

    fetch('https://api-v3.mbta.com/schedules/?sort=departure_time&direction_id=0&stop=place-north&route=CR-Fitchburg,CR-Haverhill,CR-Lowell,CR-Newburyport,CR-Greenbush,CR-Middleborough,CR-Kingston,CR-Fairmount,CR-Franklin,CR-Worcester,CR-Providence,CR-Needham')
      .then((res) => res.json())
      .then((res) => {
        // TODO fix this linter silliness
        // eslint-disable-next-line max-len
        const scheduledAfterNow = res.data.filter((datum) => new Date(datum.attributes.departure_time) > new Date()).slice(0, 15);
        scheduledAfterNow.forEach((datum) => {
          const key = datum.id.replace('schedule-', '');
          formattedData[key] = {};
          formattedData[key].departureTime = datum.attributes.departure_time;
          formattedData[key].destination = datum.relationships.route.data.id.replace('CR-', '');
          formattedData[key].trackNumber = 'TBD';
          formattedData[key].trainNumber = 'TBD';
          formattedData[key].status = 'On time';
        });
      })
      .then(() => {
        fetch('https://api-v3.mbta.com/predictions/?sort=departure_time&direction_id=0&stop=place-north&route=CR-Fitchburg,CR-Haverhill,CR-Lowell,CR-Newburyport,CR-Greenbush,CR-Middleborough,CR-Kingston,CR-Fairmount,CR-Franklin,CR-Worcester,CR-Providence,CR-Needham')
          .then((res) => res.json())
          .then((res) => {
            res.data.forEach((datum) => {
              const key = datum.id.replace('prediction-', '');
              const stopData = datum.relationships.stop.data.id.split('-');
              if (formattedData[key]) {
                if (datum.attributes.departure_time) {
                  formattedData[key].departureTime = datum.attributes.departure_time;
                }
                formattedData[key].name = key;
                formattedData[key].status = datum.attributes.status;
                formattedData[key].trainNumber = (datum.relationships.vehicle.data
                  && datum.relationships.vehicle.data.id) || 'TBD';
                formattedData[key].trackNumber = stopData.length > 2 ? stopData[2] : 'TBD';
              }
            });
            // TODO fix this linter silliness
            // eslint-disable-next-line max-len
            const sorted = Object.values(formattedData).sort((a, b) => (new Date(a.departureTime)) - (new Date(b.departureTime)));
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
      <Box align="left">
        {/* <h2></h2> */}
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
