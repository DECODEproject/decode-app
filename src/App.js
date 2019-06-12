/*
 * DECODE App – A mobile app to control your personal data
 *
 * Copyright (C) 2019 – DRIBIA Data Research S.L.
 *
 * DECODE App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DECODE App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * email: info@dribia.com
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider, withTranslation } from 'react-i18next';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { ThemeProvider } from 'styled-components';
import SplashScreen from 'react-native-splash-screen';
import i18n from './i18n';
import store from './redux/store';
import theme from './lib/theme';
import Dummy from './screens/Dummy';
import DummyNext from './screens/DummyNext';

const RootStack = createStackNavigator({
  Dummy,
  DummyNext,
}, {
  initialRouteName: 'Dummy',
  defaultNavigationOptions: ({ screenProps: { t } }) => ({
    headerBackTitle: t('back'),
  }),
});

const Navigation = createAppContainer(RootStack);

const App = ({ t }) => {
  useEffect(() => SplashScreen.hide());
  return (
    <I18nextProvider i18n={i18n}>
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <Navigation screenProps={{ t }} />
        </ThemeProvider>
      </ReduxProvider>
    </I18nextProvider>
  );
};

App.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(App);
