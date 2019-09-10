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
import { Linking, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen, Header, Button } from 'lib/Components';
import { Description, Line, Actions } from './ApplicationDetails.Styles';

const ApplicationDetails = ({ navigation: { navigate, getParam } }) => {
  const { t } = useTranslation('applications');
  return (
    <Screen topJustified image={getParam('image')}>
      <ScrollView>
        <Description>
          <Line>{getParam('description')}</Line>
          <Button icon="external-link" title={t('more')} onPress={() => Linking.openURL(getParam('link'))}>{t('more')}</Button>
        </Description>
      </ScrollView>
      <Actions>
        <Button featured icon="qrcode" title={t('activate')} onPress={() => navigate('Scanner')} />
        { getParam('showHistory')
          ? (
            <Button
              icon="history"
              title={t('history')}
              onPress={() => navigate('ActivityHistory', {
                stats: getParam('stats'),
                image: getParam('image'),
              })}
            />
          )
          : null}
      </Actions>
    </Screen>
  );
};

ApplicationDetails.navigationOptions = ({ navigation: { getParam } }) => ({
  headerTitle: <Header title={getParam('name')} icon="th-large" />,
});

ApplicationDetails.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};

export default ApplicationDetails;
