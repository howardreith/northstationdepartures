import { mockPredictionsResponse, mockSchedulesResponse } from './mockJson';
import fetchAndFormatPredictionData from './fetchAndFormatPredictionData';

describe('fetchAndFormatPredictionData', () => {
  const predictionsEndpoint = 'https://api-v3.mbta.com/predictions/?api_key=undefined&sort=departure_time&direction_id=0&stop=place-north&route=CR-Fitchburg,CR-Haverhill,CR-Lowell,CR-Newburyport,CR-Greenbush,CR-Middleborough,CR-Kingston,CR-Fairmount,CR-Franklin,CR-Worcester,CR-Providence,CR-Needham';

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ json: () => ({ ...mockPredictionsResponse }) });
  });

  it('should call the predictions endpoint', async () => {
    await fetchAndFormatPredictionData(mockSchedulesResponse);
    expect(global.fetch).toHaveBeenCalledWith(predictionsEndpoint);
  });

  it('should sort and format the data', async () => {
    const scheduleData = {};
    mockSchedulesResponse.data.forEach((datum) => {
      const key = datum.id.replace('schedule-', '');
      scheduleData[key] = {};
      scheduleData[key].departureTime = datum.attributes.departure_time;
      scheduleData[key].destination = datum.relationships.route.data.id.replace('CR-', '');
    });
    const result = await fetchAndFormatPredictionData(scheduleData);
    const expected = [{
      departureTime: '2021-08-11T17:05:00-04:00', name: 'CR-479172-117-MRRockport-BNT-0000-04-0', destination: 'Newburyport', status: 'Now boarding', trainNumber: '1650', trackNumber: '04',
    }, {
      departureTime: '2021-08-11T17:10:00-04:00', name: 'CR-479277-295-BNT-0000-0', destination: 'Haverhill', status: 'On time', trainNumber: 'TBD', trackNumber: 'TBD',
    }, {
      departureTime: '2021-08-11T17:25:00-04:00', name: 'CR-479309-329-BNT-0000-0', destination: 'Lowell', status: 'On time', trainNumber: 'TBD', trackNumber: 'TBD',
    }, {
      departureTime: '2021-08-11T17:30:00-04:00', name: 'CR-479347-425-BNT-0000-0', destination: 'Fitchburg', status: 'On time', trainNumber: 'TBD', trackNumber: 'TBD',
    }, {
      departureTime: '2021-08-11T17:35:00-04:00', name: 'CR-479228-159-MRRockport-BNT-0000-0', destination: 'Newburyport', status: 'On time', trainNumber: 'TBD', trackNumber: 'TBD',
    }, {
      departureTime: '2021-08-11T17:40:00-04:00', name: 'CR-479255-217-BNT-0000-0', destination: 'Haverhill', status: 'On time', trainNumber: 'TBD', trackNumber: 'TBD',
    }, {
      departureTime: '2021-08-11T17:55:00-04:00', name: 'CR-479279-297-BNT-0000-0', destination: 'Haverhill', status: 'On time', trainNumber: 'TBD', trackNumber: 'TBD',
    }, {
      departureTime: '2021-08-11T18:05:00-04:00', name: 'CR-479205-119-MRRockport-BNT-0000-0', destination: 'Newburyport', status: 'On time', trainNumber: 'TBD', trackNumber: 'TBD',
    }, {
      departureTime: '2021-08-11T18:10:00-04:00', name: 'CR-479311-331-BNT-0000-0', destination: 'Lowell', status: 'On time', trainNumber: 'TBD', trackNumber: 'TBD',
    }, {
      departureTime: '2021-08-11T18:30:00-04:00', name: 'CR-479348-427-BNT-0000-0', destination: 'Fitchburg', status: 'On time', trainNumber: 'TBD', trackNumber: 'TBD',
    }, {
      departureTime: '2021-08-11T18:35:00-04:00', name: 'CR-479230-161-MRRockport-BNT-0000-0', destination: 'Newburyport', status: 'On time', trainNumber: 'TBD', trackNumber: 'TBD',
    }, {
      departureTime: '2021-08-11T18:40:00-04:00', name: 'CR-479257-219-BNT-0000-0', destination: 'Haverhill', status: 'On time', trainNumber: 'TBD', trackNumber: 'TBD',
    }, {
      departureTime: '2021-08-11T18:55:00-04:00', name: 'CR-479313-333-BNT-0000-0', destination: 'Lowell', status: 'On time', trainNumber: 'TBD', trackNumber: 'TBD',
    }];
    expect(result).toEqual(expected);
  });
});
