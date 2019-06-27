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
import { Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Container } from './Settings.Styles';

const Settings = ({ onReviewWalkthrough, onReset }) => {
  const { t } = useTranslation('settings');
  return (
    <Container>
      <Button title={t('review')} onPress={onReviewWalkthrough} />
      <Button title={t('reset')} onPress={onReset} />
    </Container>
  );
};

Settings.propTypes = {
  onReviewWalkthrough: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

Settings.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('Settings'),
});

export default Settings;
