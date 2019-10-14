/**
 * @format
 */

import { AppRegistry } from 'react-native';
import * as Sentry from '@sentry/react-native';
import App from 'App';
import { SENTRY_DSN } from 'react-native-dotenv';
import { name as appName } from './app.json';

if (process.env.NODE_ENV === 'production') Sentry.init({
  dsn: SENTRY_DSN,
});

AppRegistry.registerComponent(appName, () => App);
