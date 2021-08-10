import React, { useEffect, useState } from 'react';

export default function MbtaBoardPage() {
  const [data, setData] = useState(null);
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
                formattedData[key].status = datum.attributes.status;
                formattedData[key].trainNumber = datum.relationships.vehicle.data
                && datum.relationships.vehicle.data.id;
                formattedData[key].tracknumber = stopData.length > 2 ? stopData[2] : null;
              }
            });
          });
        // TODO fix this linter silliness
        // eslint-disable-next-line max-len
        const sorted = Object.values(formattedData).sort((a, b) => (new Date(a.departureTime)) - (new Date(b.departureTime)));
        setData(sorted);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('An error occurred fetching data from MBTA API: ', err);
      });
  }, []);

  console.log('===> data', data);

  return <div>I am here</div>;
}
