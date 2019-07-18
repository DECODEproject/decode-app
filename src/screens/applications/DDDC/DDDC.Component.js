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
import { Screen } from 'lib/styles';
import { getDisplayValue } from 'lib/utils';
import { Heading, Line as Text } from './DDDC.Styles';

const DDDC = ({ navigation: { getParam }, sharedAttributes }) => {
  const dddcUrl = getParam('dddcUrl');
  const petitionId = getParam('petitionId');
  const { t } = useTranslation('attributes');
  return (
    <Screen>
      <Heading>DDDC petition signing starts here</Heading>
      <Text>{`DDDC URL: ${dddcUrl}`}</Text>
      <Text>{`Petition id: ${petitionId}`}</Text>
      <Heading>Will share this data</Heading>
      {
        sharedAttributes.map(({ name, value, type }) => (
          <Text key={name}>{`${name}: ${getDisplayValue(type, value, t)}`}</Text>
        ))
      }
    </Screen>
  );
};

DDDC.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('applications:dddcName'),
});

DDDC.propTypes = {
  sharedAttributes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};

export default DDDC;
