import React from 'react';
import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider, withTranslation } from 'react-i18next';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { ThemeProvider } from 'styled-components';
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

const App = ({ t }) => (
  <I18nextProvider i18n={i18n}>
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <Navigation screenProps={{ t }} />
      </ThemeProvider>
    </ReduxProvider>
  </I18nextProvider>
);

App.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(App);
