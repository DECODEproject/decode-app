import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { I18nextProvider, withTranslation } from 'react-i18next';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import store from './redux/store';
import Dummy from './screens/Dummy';
import DummyNext from './screens/DummyNext';
import i18n from './i18n';

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
    <Provider store={store}>
      <Navigation screenProps={{ t }} />
    </Provider>
  </I18nextProvider>
);

App.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(App);
