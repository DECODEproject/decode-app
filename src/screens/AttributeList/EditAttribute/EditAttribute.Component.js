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
import { Picker } from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-native-date-picker';
import i18n from 'i18n';
import { Screen, Header, Button, Picker as EnumPicker } from 'lib/Components';
import { Text, TextInput } from 'lib/styles';
import { Wrapper } from './EditAttribute.Styles';

const getEditor = (type, value, setValue, getParam) => {
  const { t } = useTranslation('attributes');
  const enumValues = getParam('values');
  if (type === 'enum') return (
    <EnumPicker
      selectedValue={value}
      onValueChange={newValue => setValue(newValue)}
    >
      {enumValues.map(enumValue => (
        <Picker.Item label={t(enumValue)} value={enumValue} key={enumValue} />
      ))}
    </EnumPicker>
  );
  if (type === 'date') return (
    <DatePicker
      mode="date"
      locale={i18n.language}
      date={value ? new Date(+value) : new Date()}
      minimumDate={new Date('1900-01-01')}
      maximumDate={new Date()}
      onDateChange={date => setValue(+date)}
      fadeToColor="none"
      style={{ fontFamily: 'Montserrat' }}
    />
  );
  return (
    <TextInput
      placeholder={t('enterValue')}
      autoCapitalize="none"
      autoCorrect={false}
      autoCompleteType="off"
      autoFocus
      underlineColorAndroid="transparent"
      value={value}
      onChangeText={text => setValue(text)}
      multiline
    />
  );
};

const EditAttribute = ({
  navigation: { navigate, getParam }, validationError, onSave,
}) => {
  const { t } = useTranslation('attributes');
  const type = getParam('type');
  const name = getParam('name');
  const valueParam = getParam('value');
  const [value, setValue] = useState(valueParam);
  return (
    <Screen>
      <Wrapper>
        { getEditor(type, value, setValue, getParam) }
        <Button
          featured
          icon="check"
          disabled={value === valueParam}
          title={t('save')}
          onPress={() => {
            onSave(name, value);
            navigate('AttributeList');
          }
        }
        />
        { validationError ? <Text>{validationError}</Text> : null }
      </Wrapper>
    </Screen>
  );
};

EditAttribute.navigationOptions = (
  {
    screenProps: { t },
    navigation: { state: { params: { name } } },
  },
) => ({
  headerTitle: <Header title={t(`attributes:${name}`)} icon="user" />,
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
