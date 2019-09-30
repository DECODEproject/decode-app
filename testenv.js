jest.mock('react-native-device-info', () => ({
  getDeviceLocale: () => 'en',
}));

jest.mock('NativeAnimatedHelper');

jest.mock('lib/utils', () => {
  const utils = jest.requireActual('./src/lib/utils');
  return {
    ...utils,
    debugLog: jest.fn(),
    debugPipe: jest.fn(),
  };
});
