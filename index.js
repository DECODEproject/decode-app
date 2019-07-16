/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { Sentry } from 'react-native-sentry';
import App from 'App';
import { SENTRY_DSN } from 'react-native-dotenv';
import { name as appName } from './app.json';

if (process.env.NODE_ENV === 'production') Sentry.config(SENTRY_DSN).install();

AppRegistry.registerComponent(appName, () => App);
