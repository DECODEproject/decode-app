/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Dummy from './screens/Dummy';

export default () => (
  <Provider store={store}>
    <Dummy />
  </Provider>
);
