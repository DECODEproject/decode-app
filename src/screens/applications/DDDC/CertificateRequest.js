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
import { withNavigation } from 'react-navigation';
import { Button, CheckList } from 'lib/Components';
import { getDisplayValue } from 'lib/utils';
import { Subheading, Text, Section } from './DDDC.Styles';
import VerificationCode from './VerificationCode';

const CertificateRequest = (
  {
    verificationCodes,
    sharedAttributes,
    toggleSelected,
    navigation,
  },
) => {
  const { t } = useTranslation('applications');
  const { t: attributesT } = useTranslation('attributes');
  const { navigate } = navigation;
  return (
    <View>
      {
        isEmpty(verificationCodes) ? null : (
          <View style={{ flex: 1 }}>
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
          </View>
        )
      }
      <Section>
        <Text>{t('certificateRequired')}</Text>
        <Button icon="external-link" title={t('more')} onPress={Function.prototype} />
      </Section>
      <View>
        <Subheading>{t('sharedData')}</Subheading>
        <CheckList items={map(({ name, type, value, selected, baseAttribute, ...rest }) => ({
          label: isNil(value) ? attributesT(name) : `${attributesT(name)}: ${getDisplayValue(type, value, attributesT)}`,
          checked: selected,
          onSwitch: () => toggleSelected(name),
          onEdit: () => navigate('EditAttribute', baseAttribute || { name, type, value, ...rest }),
        }), sharedAttributes)}
        />
        <Text>{t('sharedDataDesc')}</Text>
      </View>
    </View>
  );
};

CertificateRequest.propTypes = {
  verificationCodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  sharedAttributes: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleSelected: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default withNavigation(CertificateRequest);
