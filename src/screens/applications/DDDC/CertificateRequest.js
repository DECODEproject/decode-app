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
import { View, Button, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'ramda';
import { getDisplayValue } from 'lib/utils';
import { Heading, Line as Text } from './DDDC.Styles';
import VerificationCode from './VerificationCode';

const CertificateRequest = ({ verificationCodes, sharedAttributes, onSubmit }) => {
  const { t } = useTranslation('applications');
  const { t: attributesT } = useTranslation('attributes');
  return (
    <View>
      <Text>{t('certificateRequired')}</Text>
      <Button title={t('more')} onPress={Function.prototype} />
      {
        isEmpty(verificationCodes) ? null : (
          <FlatList
            data={verificationCodes}
            keyExtractor={code => code.id}
            renderItem={
              ({ item: { id, name } }) => (
                <VerificationCode
                  id={id}
                  name={name}
                />
              )
            }
          />
        )
      }
      <Heading>Will share this data</Heading>
      {
        sharedAttributes.map(({ name, value, type }) => (
          <Text key={name}>{`${name}: ${getDisplayValue(type, value, attributesT)}`}</Text>
        ))
      }
      <Button title={t('certificateRequestButton')} onPress={onSubmit} />
    </View>
  );
};

CertificateRequest.propTypes = {
  verificationCodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  sharedAttributes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CertificateRequest;
