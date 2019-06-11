/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { Sentry } from 'react-native-sentry';
import App from './src/App';
import { name as appName } from './app.json';

Sentry.config('https://5a76aa6c59eb4adfa4d4b7ec26ec393b@sentry.io/1479545').install();

AppRegistry.registerComponent(appName, () => App);
