const apiKey = process.env.REACT_APP_API_KEY;

export default async function fetchAndFormatPredictionData(scheduleData) {
  const data = {};
  const response = await fetch(`https://api-v3.mbta.com/predictions/?api_key=${apiKey}&sort=departure_time&direction_id=0&stop=place-north&route=CR-Fitchburg,CR-Haverhill,CR-Lowell,CR-Newburyport,CR-Greenbush,CR-Middleborough,CR-Kingston,CR-Fairmount,CR-Franklin,CR-Worcester,CR-Providence,CR-Needham`);
  const responseJson = await response.json();
  responseJson.data.forEach((datum) => {
    const key = datum.id.replace('prediction-', '');
    data[key] = {};
    const stopData = datum.relationships.stop.data.id.split('-');
    if (datum.attributes.departure_time) {
      data[key].departureTime = datum.attributes.departure_time;
    } else if (scheduleData && scheduleData[key]) {
      data[key].departureTime = scheduleData[key].departureTime;
    } else {
      // The train has departed, probably quite a while ago
      delete data[key];
    }
    if (data[key]) {
      data[key].name = key;
      data[key].destination = datum.relationships.route.data.id.replace('CR-', '');
      data[key].status = datum.attributes.status;
      data[key].trainNumber = (datum.relationships.vehicle.data
            && datum.relationships.vehicle.data.id) || 'TBD';
      data[key].trackNumber = stopData.length > 2 ? stopData[2] : 'TBD';
    }
  });
  return Object.values(data).sort((a, b) => (
    new Date(a.departureTime)) - (new Date(b.departureTime)));
}
