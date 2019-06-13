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
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { useTranslation } from 'react-i18next';
import Carousel from '../../lib/Components/Carousel';
import Dummy from '../Dummy';
import DummyNext from '../DummyNext';

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

const RootScreen = ({ firstRun, firstRunDone }) => {
  const { t } = useTranslation();
  return (firstRun ? <Carousel onDone={() => firstRunDone()} /> : <Navigation screenProps={{ t }} />);
};

RootScreen.propTypes = {
  firstRun: PropTypes.bool.isRequired,
  firstRunDone: PropTypes.func.isRequired,
};

export default RootScreen;
