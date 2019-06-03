jest.mock('react-native-device-info', () => ({
  getDeviceLocale: () => 'en',
}));

jest.mock('NativeAnimatedHelper');
