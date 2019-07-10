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
import moment from 'moment';
import { map, addIndex, length, dec } from 'ramda';
import { Screen } from 'lib/styles';
import { Section, SharedData, Label, Value } from './ActivityHistory.Styles';

const ActivityHistory = ({ navigation: { getParam } }) => {
  const { usageCount, firstUse, lastUse, averageUse, sharedData } = getParam('stats');
  const { t } = useTranslation('applications');
  return (
    <Screen>
      <Section>
        <Label>
          {`${t('usageCount')}: `}
          <Value>{usageCount}</Value>
        </Label>
        <Label>
          {`${t('firstUse')}: `}
          <Value>{moment(firstUse).format('L')}</Value>
        </Label>
        <Label>
          {`${t('lastUse')}: `}
          <Value>{moment(lastUse).format('L')}</Value>
        </Label>
        <Label>
          {`${t('averageUse')}: `}
          <Value>
            {t('times_interval', {
              postProcess: 'interval',
              count: averageUse[0],
              unit: t(averageUse[1]),
            })}
          </Value>
        </Label>
      </Section>
      <Section>
        <Label>{`${t('sharedData')}: `}</Label>
        <SharedData>
          {(addIndex(map)(({ id, shared }, index) => (
            <Value key={id} shared={shared}>{`${t(`attributes:${id}`)}${index < dec(length(sharedData)) ? ', ' : ''}`}</Value>
          ))(sharedData))}
        </SharedData>
      </Section>
    </Screen>
  );
};

ActivityHistory.displayName = 'ActivityHistory';

ActivityHistory.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('applications:history'),
});

ActivityHistory.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};

export default ActivityHistory;
