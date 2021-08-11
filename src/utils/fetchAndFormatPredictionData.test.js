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
    // TODO There is something amiss with this test, there should be more
    const result = await fetchAndFormatPredictionData(mockSchedulesResponse);
    const expected = [
      {
        departureTime: '2021-08-11T17:05:00-04:00',
        name: 'CR-479172-117-MRRockport-BNT-0000-04-0',
        destination: 'Newburyport',
        status: 'Now boarding',
        trainNumber: '1650',
        trackNumber: '04',
      },
    ];
    expect(result).toEqual(expected);
  });
});
