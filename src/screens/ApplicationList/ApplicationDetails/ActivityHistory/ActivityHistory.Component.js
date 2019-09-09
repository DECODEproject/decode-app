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
import { map } from 'ramda';
import { Text } from 'lib/styles';
import { Screen, Header } from 'lib/Components';
import CheckList from 'lib/Components/CheckList';
import { Section, Label } from './ActivityHistory.Styles';

const ActivityHistory = ({ navigation: { getParam } }) => {
  const { usageCount, firstUse, lastUse, averageUse, sharedData } = getParam('stats');
  const { t } = useTranslation('applications');
  return (
    <Screen topJustified image={getParam('image')}>
      <Section>
        <Label>
          {`${t('usageCount')}: `}
          <Text>{usageCount}</Text>
        </Label>
        <Label>
          {`${t('firstUse')}: `}
          <Text>{moment(firstUse).format('L')}</Text>
        </Label>
        <Label>
          {`${t('lastUse')}: `}
          <Text>{moment(lastUse).format('L')}</Text>
        </Label>
        <Label>
          {`${t('averageUse')}: `}
          <Text>
            {t('times_interval', {
              postProcess: 'interval',
              count: averageUse[0],
              unit: t(averageUse[1]),
            })}
          </Text>
        </Label>
      </Section>
      <Section>
        <Label>{`${t('sharedData')}: `}</Label>
        <CheckList items={map(({ id, shared }) => ({
          label: t(`attributes:${id}`),
          checked: shared,
        }), sharedData)}
        />
      </Section>
    </Screen>
  );
};

ActivityHistory.displayName = 'ActivityHistory';

ActivityHistory.navigationOptions = ({ screenProps: { t } }) => ({
  headerTitle: <Header title={t('applications:history')} icon="th-large" />,
});

ActivityHistory.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};

export default ActivityHistory;
