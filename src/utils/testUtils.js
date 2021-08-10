import { act } from 'react-dom/test-utils';

export async function waitForComponentToPaint(wrapper) {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve));
    wrapper.update();
  });
}

export default {
  waitForComponentToPaint,
};
