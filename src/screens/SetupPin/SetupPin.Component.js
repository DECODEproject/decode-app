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
import { Button, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Container, PinInput } from './SetupPin.Styles';

const SetupPin = ({
  pin1, pin2, onPin1Changed, onPin2Changed, onSetupDone, validationError,
}) => {
  const { t } = useTranslation('pin');
  return (
    <Container>
      <PinInput
        placeholder={t('pin1')}
        keyboardType="numeric"
        secureTextEntry
        underlineColorAndroid="transparent"
        value={pin1}
        onChangeText={pin => onPin1Changed(pin)}
      />
      <PinInput
        placeholder={t('pin2')}
        keyboardType="numeric"
        secureTextEntry
        underlineColorAndroid="transparent"
        value={pin2}
        onChangeText={pin => onPin2Changed(pin)}
      />
      <Button title={t('setupPin')} onPress={onSetupDone} />
      {
        validationError ? <Text>{validationError}</Text> : null
      }
    </Container>
  );
};

SetupPin.defaultProps = {
  validationError: null,
};

SetupPin.propTypes = {
  pin1: PropTypes.string.isRequired,
  pin2: PropTypes.string.isRequired,
  validationError: PropTypes.string,
  onPin1Changed: PropTypes.func.isRequired,
  onPin2Changed: PropTypes.func.isRequired,
  onSetupDone: PropTypes.func.isRequired,
};

SetupPin.displayName = 'SetupPin';

export default SetupPin;
