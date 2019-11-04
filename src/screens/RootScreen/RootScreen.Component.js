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

import React, { useContext } from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';
import { Carousel, MenuIcon, Warning, WalkthroughStep } from 'lib/Components';
import { Icon, MenuItem } from 'lib/styles';
import commonTheme from 'lib/theme';
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
import dddcScreens from 'screens/applications/DDDC';
import bcnnowScreens from 'screens/applications/BCNNow';

const defaultNavigationOptions = ({ screenProps: { theme } }) => ({
  headerBackTitle: null,
  headerTintColor: theme.headerPrimaryColor,
  headerStyle: {
    backgroundColor: theme.headerSecondaryColor,
  },
});

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
  initialRouteName: 'AttributeList',
  defaultNavigationOptions,
});

const ApplicationStack = createStackNavigator({
  ApplicationList: {
    screen: ApplicationList,
    navigationOptions: ({ navigation }) => ({
      headerLeft: (
        <WalkthroughStep screen="home" id="menuIcon" placement="bottom" onCloseAction={navigation.openDrawer}>
          <MenuIcon onPress={() => navigation.toggleDrawer()} />
        </WalkthroughStep>
      ),
    }),
  },
  ApplicationDetails,
  ActivityHistory,
  Scanner,
  ...dddcScreens,
  ...bcnnowScreens,
  AttributeList,
  AtlasList,
  EditAttribute,
}, {
  initialRouteName: 'ApplicationList',
  defaultNavigationOptions,
});

const SettingsStack = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuIcon onPress={() => navigation.toggleDrawer()} />,
    }),
  },
}, {
  defaultNavigationOptions,
});

const ScannerStack = createStackNavigator({
  Scanner: {
    screen: Scanner,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuIcon onPress={() => navigation.toggleDrawer()} />,
    }),
  },
  ...dddcScreens,
  ...bcnnowScreens,
}, {
  defaultNavigationOptions,
});

const AboutStack = createStackNavigator({
  About: {
    screen: About,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuIcon onPress={() => navigation.toggleDrawer()} />,
    }),
  },
}, {
  defaultNavigationOptions,
});

// eslint-disable-next-line no-unused-vars
const DummyStack = createStackNavigator({
  Dummy: {
    screen: Dummy,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <MenuIcon onPress={() => navigation.toggleDrawer()} />,
    }),
  },
  DummyNext,
}, {
  defaultNavigationOptions,
});

const DrawerNavigator = createDrawerNavigator({
  AttributeStack: {
    screen: AttributeStack,
    navigationOptions: ({ screenProps: { t } }) => ({
      drawerLabel: (
        <WalkthroughStep screen="home" id="attributes">
          <MenuItem>{t('attributes:my')}</MenuItem>
        </WalkthroughStep>
      ),
      drawerIcon: <Icon name="user" />,
    }),
  },
  ApplicationStack: {
    screen: ApplicationStack,
    navigationOptions: ({ screenProps: { t } }) => ({
      drawerLabel: (
        <WalkthroughStep screen="home" id="applications">
          <MenuItem>{t('applications:available')}</MenuItem>
        </WalkthroughStep>
      ),
      drawerIcon: <Icon name="th-large" />,
    }),
  },
  SettingsStack: {
    screen: SettingsStack,
    navigationOptions: ({ screenProps: { t } }) => ({
      drawerLabel: (
        <WalkthroughStep screen="home" id="settings">
          <MenuItem>{t('settings:title')}</MenuItem>
        </WalkthroughStep>
      ),
      drawerIcon: <Icon name="cog" />,
    }),
  },
  AboutStack: {
    screen: AboutStack,
    navigationOptions: ({ screenProps: { t } }) => ({
      drawerLabel: (
        <WalkthroughStep screen="home" id="about">
          <MenuItem>{t('about:title')}</MenuItem>
        </WalkthroughStep>
      ),
      drawerIcon: <Icon name="info" />,
    }),
  },
  ScannerStack: {
    screen: ScannerStack,
    navigationOptions: ({ navigation, screenProps: { t } }) => ({
      drawerLabel: (
        <WalkthroughStep screen="home" id="scanner" onCloseAction={navigation.closeDrawer}>
          <MenuItem>{t('scanner:title')}</MenuItem>
        </WalkthroughStep>
      ),
      drawerIcon: <Icon name="qrcode" />,
    }),
  },
  // Uncomment to have a testing screen on the menu
  // DummyStack: {
  //   screen: DummyStack,
  //   navigationOptions: () => ({
  //     drawerLabel: 'Test Dummy Screen',
  //   }),
  // },
},
{
  defaultNavigationOptions: () => ({
    drawerLockMode: 'locked-closed',
  }),
  initialRouteName: 'ApplicationStack',
  hideStatusBar: Platform.OS === 'ios',
  drawerBackgroundColor: commonTheme.menuBackgroundColor,
  contentOptions: {
    activeTintColor: commonTheme.headerSecondaryColor,
    inactiveTintColor: commonTheme.headerSecondaryColor,
    itemStyle: {
      borderBottomWidth: 1,
      borderBottomColor: commonTheme.headerSecondaryColor,
    },
    labelStyle: {
      fontFamily: commonTheme.fontFamily,
    },
    iconContainerStyle: {
      marginRight: 0,
    },
  },
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
  const theme = useContext(ThemeContext);
  return (
    firstRun
      ? <Carousel onDone={() => firstRunDone()} />
      : <AppContainer screenProps={{ t, theme }} />
  );
};

RootScreen.propTypes = {
  firstRun: PropTypes.bool.isRequired,
  firstRunDone: PropTypes.func.isRequired,
};

export default RootScreen;
