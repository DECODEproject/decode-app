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
import { useTranslation } from 'react-i18next';
import Screen from 'lib/Components/Screen';
import Header from 'lib/Components/Header';
import { getDisplayValue } from 'lib/utils';
import { Heading, Line as Text } from './BCNNow.Styles';


const BCNNow = ({ navigation: { getParam }, sharedAttributes }) => {
  const bcnnowUrl = getParam('bcnnowUrl');
  const sessionId = getParam('sessionId');
  const { t } = useTranslation('attributes');
  return (
    <Screen>
      <Heading>BCNNow login starts here</Heading>
      <Text>{`BCNNow URL: ${bcnnowUrl}`}</Text>
      <Text>{`Session id: ${sessionId}`}</Text>
      <Heading>Will share this data</Heading>
      {
        sharedAttributes.map(({ name, value, type }) => (
          <Text key={name}>{`${name}: ${getDisplayValue(type, value, t)}`}</Text>
        ))
      }
    </Screen>
  );
};

BCNNow.navigationOptions = ({ screenProps: { t } }) => ({
  headerTitle: <Header title={t('applications:bcnnowName')} icon="th-large" />,
});

BCNNow.propTypes = {
  sharedAttributes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};

export default BCNNow;
