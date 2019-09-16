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
import { useTranslation } from 'react-i18next';
import { isEmpty, values, head, map, isNil, compose, pluck, indexBy, prop, filter } from 'ramda';
import Spinner from 'react-native-loading-spinner-overlay';
import { Header, Button, CertificateList, CheckList, Message } from 'lib/Components';
import { ApplicationImage } from 'lib/styles';
import { getDisplayValue } from 'lib/utils';
import { getApplication, getImage } from 'api/atlas-client';
import { Wrapper, Section, Subheading, Text, Buttons } from './BCNNow.Styles';

const prepare = compose(
  pluck('value'),
  indexBy(prop('name')),
  filter(attr => attr.selected === true),
);

const BCNNow = ({
  navigation: { getParam, navigate, addListener },
  sharedAttributes,
  certificates,
  login,
  loading,
  error,
  loggedIn,
  toggleSelectedAttribute,
  cleanupState,
}) => {
  const bcnnowUrl = getParam('bcnnowUrl') || 'http://bcnnow.decodeproject.eu:9530/oauth/iot_login_callback';
  const sessionId = getParam('sessionId') || '7d9f3fa8a57911e9b12a005056833c52';
  const { t } = useTranslation('applications');
  const { t: attributesT } = useTranslation('attributes');
  const { image, activationMsg, actionMsg } = getApplication('bcnnow');
  useEffect(
    () => {
      cleanupState();
      const listener = addListener('willFocus', () => cleanupState());
      return () => {
        listener.remove();
      };
    },
    [],
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Spinner visible={loading} />
      <Wrapper nestedScrollEnabled={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
        <ApplicationImage source={getImage(image)} resizeMode="contain" />
        <Text>{t(activationMsg)}</Text>
        {
          error ? (
            <Message
              error
              msg={error === 'timeout' ? t('bcnnowTimeout') : t('error')}
              detail={error === 'timeout' ? null : error}
            />
          ) : null
        }
        {
          loggedIn ? <Message msg={t('bcnnowSuccess')} detail={t('bcnnowRefresh')} /> : null
        }
        {
          isEmpty(certificates) ? (
            <Message error msg={t('bcnnowEmpty')} />
          ) : (
            <Section>
              <CertificateList certificates={certificates} />
              <Subheading>{t('sharedData')}</Subheading>
              <CheckList items={map(({ name, type, value, selected }) => ({
                label: isNil(value) ? attributesT(name) : `${attributesT(name)}: ${getDisplayValue(type, value, attributesT)}`,
                checked: selected,
                onSwitch: () => toggleSelectedAttribute(name),
              }), sharedAttributes)}
              />
              <Buttons>
                <Button title={t('manageData')} onPress={() => navigate('AttributeList')} />
                <Button
                  featured
                  icon="sign-in"
                  title={t(actionMsg)}
                  onPress={() => login(
                    bcnnowUrl,
                    sessionId,
                    head(values(certificates)),
                    prepare(sharedAttributes),
                  )}
                />
              </Buttons>
            </Section>
          )
        }
      </Wrapper>
    </SafeAreaView>
  );
};

BCNNow.navigationOptions = ({ screenProps: { t } }) => ({
  headerTitle: <Header title={t('applications:bcnnowName')} icon="th-large" />,
});

BCNNow.defaultProps = {
  error: null,
  sharedAttributes: [],
};

BCNNow.propTypes = {
  sharedAttributes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
  })),
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
  }).isRequired,
  certificates: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  loggedIn: PropTypes.bool.isRequired,
  toggleSelectedAttribute: PropTypes.func.isRequired,
  cleanupState: PropTypes.func.isRequired,
};

export default BCNNow;
