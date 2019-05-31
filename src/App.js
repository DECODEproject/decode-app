/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import store from './redux/store';
import Dummy from './screens/Dummy';
import i18n from './i18n';

export default () => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Dummy />
    </Provider>
  </I18nextProvider>
);
