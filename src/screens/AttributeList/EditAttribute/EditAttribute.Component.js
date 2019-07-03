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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from 'lib/styles';
import { AttributeInput } from './EditAttribute.Styles';

const EditAttribute = ({
  navigation: { navigate, getParam }, validationError, onSave,
}) => {
  const { t } = useTranslation('attributes');
  const name = getParam('name');
  const valueParam = getParam('value');
  const [value, setValue] = useState(valueParam);
  return (
    <Screen centerAligned>
      <AttributeInput
        placeholder={t('enterValue')}
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="off"
        autoFocus
        underlineColorAndroid="transparent"
        value={value}
        onChangeText={text => setValue(text)}
      />
      <Button
        disabled={value === valueParam}
        title={t('save')}
        onPress={
        () => {
          onSave(name, value);
          navigate('AttributeList');
        }
      }
      />
      {
        validationError ? <Text>{validationError}</Text> : null
      }
    </Screen>
  );
};

EditAttribute.navigationOptions = (
  {
    screenProps: { t },
    navigation: { state: { params: { name } } },
  },
) => ({
  title: t(`attributes:${name}`),
});

EditAttribute.defaultProps = {
  validationError: null,
};

EditAttribute.propTypes = {
  validationError: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

EditAttribute.displayName = 'EditAttribute';

export default EditAttribute;
