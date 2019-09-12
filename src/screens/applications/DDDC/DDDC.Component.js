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
import { SafeAreaView, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { isEmpty, compose, filter, prop, indexBy, pluck, all, values } from 'ramda';
import { useTranslation } from 'react-i18next';
import Spinner from 'react-native-loading-spinner-overlay';
import { Header, Button, CertificateList, Message, ProgressBar } from 'lib/Components';
import { ApplicationImage } from 'lib/styles';
import { getApplication, getImage } from 'api/atlas-client';
import { Wrapper, Heading, Text, ActionSection } from './DDDC.Styles';
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
  progress: { step, steps },
}) => {
  const dddcApi = getParam('dddcUrl');
  const petitionId = getParam('petitionId');
  const { t } = useTranslation('applications');
  const { image, activationMsg, actionMsg, link: dddcUrl, name: dddcName } = getApplication('dddc');
  const { link: bcnnowUrl, name: bcnnowName } = getApplication('bcnnow');
  useEffect(
    () => {
      fetchPetition(dddcApi, petitionId);
    },
    [petitionId],
  );
  let innerComponent = null;
  if (signed) innerComponent = (
    <React.Fragment>
      <Message msg={t('dddcSuccess')} />
      <ActionSection>
        <Button title={t(dddcName)} icon="external-link" onPress={() => Linking.openURL(dddcUrl)} />
        <Button title={t(bcnnowName)} icon="external-link" onPress={() => Linking.openURL(bcnnowUrl)} />
      </ActionSection>
    </React.Fragment>
  );
  else if (isEmpty(certificates)) innerComponent = (
    <ActionSection>
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
    </ActionSection>
  );
  else innerComponent = (
    <ActionSection>
      <CertificateList certificates={certificates} />
      <Button featured icon="pencil-square-o" title={t(actionMsg)} onPress={() => signPetition(petition, certificates[petition.id])} />
    </ActionSection>
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Spinner visible={loading} />
      <Wrapper nestedScrollEnabled={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }} extraScrollHeight={20}>
        <ApplicationImage source={getImage(image)} resizeMode="contain" />
        <ProgressBar step={step} of={steps} />
        <Text>{t(activationMsg)}</Text>
        {
          petition ? <Heading>{petition.title}</Heading> : null
        }
        {
          error ? <Message error msg={t('error')} detail={error} /> : null
        }
        {
          innerComponent
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
  progress: PropTypes.shape({
    step: PropTypes.number.isRequired,
    steps: PropTypes.number.isRequired,
  }).isRequired,
};

export default DDDC;
