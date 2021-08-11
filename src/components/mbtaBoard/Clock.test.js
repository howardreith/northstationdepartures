/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Clock from './Clock';

configure({ adapter: new Adapter() });
describe('Clock', () => {
  let props;
  function sutFactory() {
    return mount(<Clock {...props} />);
  }

  beforeEach(() => {
    props = {
      isTime: true,
    };
  });

  it('should render the clock', () => {
    const sut = sutFactory();
    expect(sut.find(Clock).exists()).toBeTruthy();
    sut.unmount();
  });

  it('should display current time when isTime is true', () => {
    const sut = sutFactory();
    expect(sut.find('[data-test-id="currentTimeHeader"]').exists()).toBeTruthy();
    expect(sut.find('[data-test-id="time"]').exists()).toBeTruthy();
    sut.unmount();
  });

  it('should display current date when isTime is false', () => {
    props.isTime = false;
    const sut = sutFactory();
    expect(sut.find('[data-test-id="dateOfWeek"]').exists()).toBeTruthy();
    expect(sut.find('[data-test-id="currentDate"]').exists()).toBeTruthy();
    sut.unmount();
  });
});
