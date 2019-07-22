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

import React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';
import { useTranslation } from 'react-i18next';
import Carousel from 'lib/Components/Carousel';
import MenuIcon from 'lib/Components/MenuIcon';
import Warning from 'lib/Components/Warning';
import Dummy from 'screens/Dummy';
import DummyNext from 'screens/DummyNext';
import AtlasList from 'screens/AttributeList/AtlasList';
import AttributeList from 'screens/AttributeList';
import EditAttribute from 'screens/AttributeList/EditAttribute';
import ApplicationList from 'screens/ApplicationList';
import ApplicationDetails from 'screens/ApplicationList/ApplicationDetails';
import ActivityHistory from 'screens/ApplicationList/ApplicationDetails/ActivityHistory';
import Settings from 'screens/Settings';
import About from 'screens/About';
import Scanner from 'screens/Scanner';
import DDDC from 'screens/applications/DDDC';
import BCNNow from 'screens/applications/BCNNow';

const AttributeStack = createStackNavigator({
  AttributeList: {
    screen: AttributeList,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuIcon onPress={() => navigation.toggleDrawer()} />,
    }),
  },
  AtlasList,
  EditAttribute,
}, {
  defaultNavigationOptions: ({ screenProps: { t } }) => ({
    headerBackTitle: t('back'),
  }),
});

const ApplicationStack = createStackNavigator({
  ApplicationList: {
    screen: ApplicationList,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuIcon onPress={() => navigation.toggleDrawer()} />,
    }),
  },
  ApplicationDetails,
  ActivityHistory,
  Scanner,
  dddc: {
    screen: DDDC,
  },
  bcnnow: {
    screen: BCNNow,
  },
}, {
  initialRouteName: 'ApplicationList',
  defaultNavigationOptions: ({ screenProps: { t } }) => ({
    headerBackTitle: t('back'),
  }),
});

const SettingsStack = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuIcon onPress={() => navigation.toggleDrawer()} />,
    }),
  },
}, {
  defaultNavigationOptions: ({ screenProps: { t } }) => ({
    headerBackTitle: t('back'),
  }),
});

const ScannerStack = createStackNavigator({
  Scanner: {
    screen: Scanner,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuIcon onPress={() => navigation.toggleDrawer()} />,
    }),
  },
  dddc: {
    screen: DDDC,
  },
  bcnnow: {
    screen: BCNNow,
  },
}, {
  defaultNavigationOptions: ({ screenProps: { t } }) => ({
    headerBackTitle: t('back'),
  }),
});

const AboutStack = createStackNavigator({
  About: {
    screen: About,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuIcon onPress={() => navigation.toggleDrawer()} />,
    }),
  },
}, {
  defaultNavigationOptions: ({ screenProps: { t } }) => ({
    headerBackTitle: t('back'),
  }),
});

const DummyStack = createStackNavigator({
  Dummy: {
    screen: Dummy,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuIcon onPress={() => navigation.toggleDrawer()} />,
    }),
  },
  DummyNext,
}, {
  defaultNavigationOptions: ({ screenProps: { t } }) => ({
    headerBackTitle: t('back'),
  }),
});

const DDDCTestStack = createStackNavigator({
  dddc: {
    screen: DDDC,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuIcon onPress={() => navigation.toggleDrawer()} />,
    }),
  },
});

const DrawerNavigator = createDrawerNavigator({
  AttributeStack: {
    screen: AttributeStack,
    navigationOptions: ({ screenProps: { t } }) => ({
      drawerLabel: t('attributes:my'),
    }),
  },
  ApplicationStack: {
    screen: ApplicationStack,
    navigationOptions: ({ screenProps: { t } }) => ({
      drawerLabel: t('applications:available'),
    }),
  },
  SettingsStack: {
    screen: SettingsStack,
    navigationOptions: ({ screenProps: { t } }) => ({
      drawerLabel: t('settings:title'),
    }),
  },
  AboutStack: {
    screen: AboutStack,
    navigationOptions: ({ screenProps: { t } }) => ({
      drawerLabel: t('about:title'),
    }),
  },
  ScannerStack: {
    screen: ScannerStack,
    navigationOptions: ({ screenProps: { t } }) => ({
      drawerLabel: t('scanner:title'),
    }),
  },
  DummyStack: {
    screen: DummyStack,
    navigationOptions: () => ({
      drawerLabel: 'Test Dummy Screen',
    }),
  },
  DDDCStack: {
    screen: DDDCTestStack,
    navigationOptions: () => ({
      drawerLabel: 'Test DDDC',
    }),
  },
},
{
  defaultNavigationOptions: () => ({
    drawerLockMode: 'locked-closed',
  }),
  initialRouteName: 'ApplicationStack',
});

const RootNavigation = createStackNavigator({
  Main: {
    screen: DrawerNavigator,
  },
  Warning: {
    screen: Warning,
  },
},
{
  initialRouteName: 'Main',
  mode: 'modal',
  headerMode: 'none',
});

const AppContainer = createAppContainer(RootNavigation);

const RootScreen = ({ firstRun, firstRunDone }) => {
  const { t } = useTranslation();
  return (
    firstRun
      ? <Carousel onDone={() => firstRunDone()} />
      : <AppContainer screenProps={{ t }} />
  );
};

RootScreen.propTypes = {
  firstRun: PropTypes.bool.isRequired,
  firstRunDone: PropTypes.func.isRequired,
};

export default RootScreen;
