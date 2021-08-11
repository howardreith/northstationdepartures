/* eslint-disable */
import React from 'react';
import {configure, mount} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import MbtaBoardPage from './MbtaBoardPage';
import {waitForComponentToPaint} from '../../utils/testUtils';
import {mockPredictionsResponse, mockSchedulesResponse} from '../../utils/mockJson';
import {when} from "jest-when";

configure({adapter: new Adapter()});
describe('MbtaBoardPage', () => {
  const OLD_ENV = process.env;
  const schedulesFetch = "https://api-v3.mbta.com/schedules/?api_key=aHappyApiKey&sort=departure_time&direction_id=0&stop=place-north&route=CR-Fitchburg,CR-Haverhill,CR-Lowell,CR-Newburyport,CR-Greenbush,CR-Middleborough,CR-Kingston,CR-Fairmount,CR-Franklin,CR-Worcester,CR-Providence,CR-Needham";
  const predictionsFetch = "https://api-v3.mbta.com/predictions/?api_key=undefined&sort=departure_time&direction_id=0&stop=place-north&route=CR-Fitchburg,CR-Haverhill,CR-Lowell,CR-Newburyport,CR-Greenbush,CR-Middleborough,CR-Kingston,CR-Fairmount,CR-Franklin,CR-Worcester,CR-Providence,CR-Needham";
  let props;

  function sutFactory() {
    return mount(<MbtaBoardPage {...props} />);
  }

  beforeAll(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.REACT_APP_API_KEY = 'aHappyApiKey';
  });

  beforeEach(() => {

    props = {};
    global.fetch = jest.fn();
    when(global.fetch).calledWith(schedulesFetch).mockResolvedValue( {json: () => ({...mockSchedulesResponse})});
    when(global.fetch).calledWith(predictionsFetch).mockResolvedValue( {json: () => ({...mockPredictionsResponse})});
  });

  afterAll(() => {
    process.env = OLD_ENV
  });

  it('should render the MbtaBoardPage', async () => {
    const sut = sutFactory();
    await waitForComponentToPaint(sut);
    expect(sut.find(MbtaBoardPage).exists()).toBeTruthy();
    sut.unmount();
  });

  it('should fetch the schedule on mount', async () => {
    const sut = sutFactory();
    await waitForComponentToPaint(sut);
    expect(global.fetch).toHaveBeenCalledWith(schedulesFetch);
    sut.unmount();
  });

  it('should fetch the predictions on mount', async () => {
    const sut = sutFactory();
    await waitForComponentToPaint(sut);
    expect(global.fetch).toHaveBeenCalledWith(predictionsFetch);
    sut.unmount();
  });

  it('should display the departures', async () => {
    const sut = sutFactory();
    await waitForComponentToPaint(sut);
    const numberOfItems = sut.find('tr[data-test-type="departureRow"]').length;
    expect(numberOfItems).toEqual(13);
    console.log(sut.debug())
    expect(sut.find('td[data-test-id="CR-479172-117-MRRockport-BNT-0000-04-0-departureTime"]').exists()).toBeTruthy();
    expect(sut.find('td[data-test-id="CR-479172-117-MRRockport-BNT-0000-04-0-departureTime"]').text()).toEqual('5:05 PM');
    expect(sut.find('td[data-test-id="CR-479172-117-MRRockport-BNT-0000-04-0-destination"]').exists()).toBeTruthy();
    expect(sut.find('td[data-test-id="CR-479172-117-MRRockport-BNT-0000-04-0-destination"]').text()).toEqual('Newburyport');
    expect(sut.find('td[data-test-id="CR-479172-117-MRRockport-BNT-0000-04-0-trainNumber"]').exists()).toBeTruthy();
    expect(sut.find('td[data-test-id="CR-479172-117-MRRockport-BNT-0000-04-0-trainNumber"]').text()).toEqual('1650');
    expect(sut.find('td[data-test-id="CR-479172-117-MRRockport-BNT-0000-04-0-trackNumber"]').exists()).toBeTruthy();
    expect(sut.find('td[data-test-id="CR-479172-117-MRRockport-BNT-0000-04-0-trackNumber"]').text()).toEqual('04');
    expect(sut.find('td[data-test-id="CR-479172-117-MRRockport-BNT-0000-04-0-status"]').exists()).toBeTruthy();
    expect(sut.find('td[data-test-id="CR-479172-117-MRRockport-BNT-0000-04-0-status"]').text()).toEqual('Now boarding');
    sut.unmount()
  })
});
