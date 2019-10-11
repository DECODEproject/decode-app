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
import { SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty, values, head, map, isNil, compose, pluck, indexBy, prop, filter } from 'ramda';
import Spinner from 'react-native-loading-spinner-overlay';
import { Header, Button, CertificateList, CheckList, Message, ProgressBar } from 'lib/Components';
import { ApplicationImage, Section, ActionSection } from 'lib/styles';
import { getDisplayValue } from 'lib/utils';
import { getApplication, getImage } from 'api/atlas-client';
import { Wrapper, Subheading, Text, Bottom } from './Example.Styles';

const prepare = compose(
  pluck('value'),
  indexBy(prop('name')),
  filter(attr => attr.selected === true),
);

const Example = ({
  navigation: { getParam, navigate },
  sharedAttributes,
  certificates,
  login,
  loading,
  error,
  loggedIn,
  toggleSelectedAttribute,
  progress: { step, steps },
}) => {
  const backendUrl = getParam('callback');
  const sessionId = getParam('sessionId');
  const { t } = useTranslation('applications');
  const { t: attributesT } = useTranslation('attributes');
  const { image, activationMsg, actionMsg } = getApplication('example');
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Spinner visible={loading} />
      <Wrapper contentContainerStyle={{ flexGrow: 1 }}>
        <ApplicationImage source={getImage(image)} resizeMode="contain" />
        <ProgressBar step={step} of={steps} />
        <Section>
          <Text>{t(activationMsg)}</Text>
          {
            error ? (
              <Message
                error
                msg={error === 'timeout' ? t('example.timeout') : t('error')}
                detail={error === 'timeout' ? null : error}
              />
            ) : null
          }
          {
            loggedIn ? <Message msg={t('example.success')} detail={t('example.refresh')} /> : null
          }
        </Section>
        {
// eslint-disable-next-line no-nested-ternary
          loggedIn ? null
            : isEmpty(certificates) ? (
              <Section>
                <Message error msg={t('example.empty')} />
              </Section>
            ) : (
              <ActionSection>
                <CertificateList certificates={certificates} />
                <Subheading>{t('sharedData')}</Subheading>
                <CheckList items={map(({
                  name,
                  type,
                  value,
                  selected,
                  baseAttribute,
                  ...rest
                }) => ({
                  label: isNil(value) ? attributesT(name) : `${attributesT(name)}: ${getDisplayValue(type, value, attributesT)}`,
                  checked: selected,
                  onSwitch: () => toggleSelectedAttribute(name),
                  onEdit: () => navigate('EditAttribute', baseAttribute || { name, type, value, ...rest }),
                }), sharedAttributes)}
                />
                <Text>{t('sharedDataDesc')}</Text>
              </ActionSection>
            )
        }
      </Wrapper>
      {
        (loggedIn || isEmpty(certificates)) ? null : (
          <Bottom>
            <Button
              featured
              icon="sign-in"
              title={t(actionMsg)}
              onPress={() => login(
                backendUrl,
                sessionId,
                head(values(certificates)),
                prepare(sharedAttributes),
              )}
            />
          </Bottom>
        )
      }
    </SafeAreaView>
  );
};

Example.navigationOptions = ({ screenProps: { t } }) => ({
  headerTitle: <Header title={t('applications:example.name')} icon="th-large" />,
});

Example.defaultProps = {
  error: null,
  sharedAttributes: [],
};

Example.propTypes = {
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
  progress: PropTypes.shape({
    step: PropTypes.number.isRequired,
    steps: PropTypes.number.isRequired,
  }).isRequired,
};

export default Example;
