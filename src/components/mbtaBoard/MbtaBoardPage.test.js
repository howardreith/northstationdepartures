import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import MbtaBoardPage from './MbtaBoardPage';
import { waitForComponentToPaint } from '../../utils/testUtils';

configure({ adapter: new Adapter() });
describe('MbtaBoardPage', () => {
  let props;
  function sutFactory() {
    return mount(<MbtaBoardPage {...props} />);
  }

  beforeEach(() => {
    props = {};
  });

  it('should render the MbtaBoardPage', async () => {
    const sut = sutFactory();
    await waitForComponentToPaint(sut);
    expect(sut.find(MbtaBoardPage).exists()).toBeTruthy();
    sut.unmount();
  });
});
