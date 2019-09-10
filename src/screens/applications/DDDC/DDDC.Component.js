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
import { SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { isEmpty, compose, filter, prop, indexBy, pluck, all, values } from 'ramda';
import { useTranslation } from 'react-i18next';
import Spinner from 'react-native-loading-spinner-overlay';
import { Header, Button, CertificateList } from 'lib/Components';
import { ApplicationImage } from 'lib/styles';
import { getApplication, getImage } from 'api/atlas-client';
import { Wrapper, Heading, Text, Section } from './DDDC.Styles';
import CertificateRequest from './CertificateRequest';

const prepare = compose(
  pluck('value'),
  indexBy(prop('name')),
  filter(attr => attr.selected === true),
);

const DDDC = ({
  navigation: { getParam, navigate },
  sharedAttributes,
  fetchPetition,
  callCredentialIssuer,
  signPetition,
  petition,
  certificates,
  loading,
  signed,
  error,
  verification,
  toggleSelectedAttribute,
}) => {
  const dddcUrl = getParam('dddcUrl') || 'https://dddc.decodeproject.eu/api';
  const petitionId = getParam('petitionId') || '2';
  const { t } = useTranslation('applications');
  const { image, activationMsg, actionMsg } = getApplication('dddc');
  useEffect(
    () => {
      fetchPetition(dddcUrl, petitionId);
    },
    [petitionId],
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Spinner visible={loading} />
      <Wrapper nestedScrollEnabled={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }} extraScrollHeight={20}>
        <ApplicationImage source={getImage(image)} resizeMode="contain" />
        <Text>{t(activationMsg)}</Text>
        {
          petition ? (
            <Heading>{petition.title}</Heading>
          ) : null
        }
        {
          isEmpty(certificates) ? (
            <CertificateRequest
              verificationCodes={petition.verificationCodes}
              sharedAttributes={sharedAttributes}
              onManageAttributes={() => navigate('AttributeList')}
              onSubmit={() => callCredentialIssuer(
                verification,
                prepare(sharedAttributes),
                petition,
              )}
              toggleSelected={toggleSelectedAttribute}
              empty={all(isEmpty)(values(verification))}
            />
          ) : (
            <Section>
              <CertificateList certificates={certificates} />
              <Button featured icon="pencil-square-o" title={t(actionMsg)} onPress={() => signPetition(petition, certificates[petition.id])} />
            </Section>
          )
        }
        {
          error ? <Text>{error}</Text> : null
        }
        {
          signed ? <Text>Signed!</Text> : null
        }
      </Wrapper>
    </SafeAreaView>
  );
};

DDDC.navigationOptions = ({ screenProps: { t } }) => ({
  headerTitle: <Header title={t('applications:dddcName')} icon="th-large" />,
});

DDDC.defaultProps = {
  error: null,
};

DDDC.propTypes = {
  sharedAttributes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
  }).isRequired,
  fetchPetition: PropTypes.func.isRequired,
  callCredentialIssuer: PropTypes.func.isRequired,
  signPetition: PropTypes.func.isRequired,
  petition: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  signed: PropTypes.bool.isRequired,
  error: PropTypes.string,
  certificates: PropTypes.object.isRequired,
  verification: PropTypes.object.isRequired,
  toggleSelectedAttribute: PropTypes.func.isRequired,
};

export default DDDC;
