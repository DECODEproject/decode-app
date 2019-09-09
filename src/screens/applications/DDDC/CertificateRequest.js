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
import { View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { isEmpty, map, isNil } from 'ramda';
import { Button, CheckList } from 'lib/Components';
import { getDisplayValue } from 'lib/utils';
import { Subheading, Text, Container, Section } from './DDDC.Styles';
import VerificationCode from './VerificationCode';

const CertificateRequest = (
  {
    empty,
    verificationCodes,
    sharedAttributes,
    onManageAttributes,
    onSubmit,
    toggleSelected,
  },
) => {
  const { t } = useTranslation('applications');
  const { t: attributesT } = useTranslation('attributes');
  return (
    <View>
      <Section>
        <Text>{t('certificateRequired')}</Text>
        <Button icon="external-link" title={t('more')} onPress={Function.prototype} />
      </Section>
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
      <Container>
        <Subheading>{t('sharedData')}</Subheading>
        {
          <CheckList items={map(({ name, type, value, selected }) => ({
            label: isNil(value) ? attributesT(name) : `${attributesT(name)}: ${getDisplayValue(type, value, attributesT)}`,
            checked: selected,
            onSwitch: () => toggleSelected(name),
          }), sharedAttributes)}
          />
        }
        <Section>
          <Button title={t('manageData')} onPress={onManageAttributes} />
          <Button featured title={t('certificateRequestButton')} onPress={onSubmit} disabled={empty} />
        </Section>
      </Container>
    </View>
  );
};

CertificateRequest.propTypes = {
  empty: PropTypes.bool.isRequired,
  verificationCodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  sharedAttributes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onManageAttributes: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  toggleSelected: PropTypes.func.isRequired,
};

export default CertificateRequest;
