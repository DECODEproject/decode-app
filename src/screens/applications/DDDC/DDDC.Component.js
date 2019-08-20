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

import React, { useEffect } from 'react';
import { View, Linking, Dimensions, Button, FlatList, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';
import { useTranslation } from 'react-i18next';
import HTML from 'react-native-render-html';
import Spinner from 'react-native-loading-spinner-overlay';
import { getDisplayValue } from 'lib/utils';
import { Screen, Heading, Line as Text } from './DDDC.Styles';
import VerificationCode from './VerificationCode';

const DDDC = ({
  navigation: { getParam },
  sharedAttributes,
  fetchPetition,
  callCredentialIssuer,
  petition,
  certificates,
  loading,
  error,
  verification,
}) => {
  const dddcUrl = getParam('dddcUrl') || 'https://dddc.decodeproject.eu/api';
  const petitionId = getParam('petitionId') || '2';
  const { t } = useTranslation('applications');
  const { t: attributesT } = useTranslation('attributes');
  useEffect(
    () => {
      fetchPetition(dddcUrl, petitionId);
    },
    [petitionId],
  );
  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="position">
        <Screen>
          <Spinner visible={loading} />
          <Heading>{t('activated')}</Heading>
          {
            petition ? (
              <HTML
                id="description-text"
                html={petition.description}
                imagesMaxWidth={Dimensions.get('window').width}
                onLinkPress={(event, href) => { Linking.openURL(href); }}
              />
            ) : null
          }
          {
            isEmpty(certificates) ? (
              <View>
                <Text>{t('certificateRequired')}</Text>
                <Button title={t('more')} onPress={Function.prototype} />
                {
                  isEmpty(petition.verificationCodes) ? null : (
                    <FlatList
                      data={petition.verificationCodes}
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
                <Button
                  title={t('certificateRequestButton')}
                  onPress={() => callCredentialIssuer(
                    verification,
                    {},
                    petition.credentialIssuerUrl,
                    petition.attributeId,
                  )}
                />
              </View>
            ) : null
          }
          {
            error ? <Text>{error}</Text> : null
          }
        </Screen>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

DDDC.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('applications:dddcName'),
});

DDDC.defaultProps = {
  error: null,
};

DDDC.propTypes = {
  sharedAttributes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
  }).isRequired,
  fetchPetition: PropTypes.func.isRequired,
  callCredentialIssuer: PropTypes.func.isRequired,
  petition: PropTypes.shape({
    description: PropTypes.string.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  certificates: PropTypes.object.isRequired,
  verification: PropTypes.object.isRequired,
};

export default DDDC;
