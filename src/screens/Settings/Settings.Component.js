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
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Button from 'lib/Components/Button';
import Screen from 'lib/Components/Screen';
import Header from 'lib/Components/Header';

const Settings = ({ onReviewWalkthrough, onReset, navigation: { navigate } }) => {
  const { t } = useTranslation('settings');
  return (
    <Screen centerAligned>
      <Button title={t('review')} onPress={onReviewWalkthrough} />
      <Button
        title={t('reset')}
        onPress={() => navigate('Warning', {
          message: t('warning'),
          onConfirm: onReset,
        })}
      />
    </Screen>
  );
};

Settings.propTypes = {
  onReviewWalkthrough: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

Settings.navigationOptions = ({ screenProps: { t } }) => ({
  headerTitle: <Header title={t('settings:title')} icon="cog" />,
});

export default Settings;
