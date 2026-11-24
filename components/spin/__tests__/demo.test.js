import demoTest from '../../../tests/shared/demoTest';

beforeEach(() => {
  jest.useFakeTimers({ doNotFake: ['Date'] });
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

demoTest('spin');
