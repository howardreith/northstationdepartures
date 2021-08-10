import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import MbtaBoardPage from './MbtaBoardPage';
import { waitForComponentToPaint } from '../../utils/testUtils';
import { mockMbtaResponse } from '../../utils/mockJson';

configure({ adapter: new Adapter() });
describe('MbtaBoardPage', () => {
  let props;
  function sutFactory() {
    return mount(<MbtaBoardPage {...props} />);
  }

  beforeEach(() => {
    props = {};
    const response = { ...mockMbtaResponse };
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(response),
    });
  });

  it('should render the MbtaBoardPage', async () => {
    const sut = sutFactory();
    await waitForComponentToPaint(sut);
    expect(sut.find(MbtaBoardPage).exists()).toBeTruthy();
    sut.unmount();
  });
});
