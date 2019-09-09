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
import { FlatList, Linking } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty, prop } from 'ramda';
import { parseQRCode } from 'lib/utils';
import { EmptyList, ListItem, Header, Screen, Button } from 'lib/Components';
import { Wrapper, Separator } from './ApplicationList.Styles';

const ApplicationList = ({ applications, navigation: { navigate, dispatch } }) => {
  const { t } = useTranslation('applications');
  const handleUrl = ({ url }) => {
    const { application, ...rest } = parseQRCode(url);
    if (application) dispatch(StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({
          routeName: 'ApplicationList',
        }),
        NavigationActions.navigate({
          routeName: application,
          params: { application, ...rest },
        }),
      ],
      key: 'ApplicationStack',
    }));
  };
  const removeUrlListener = () => {
    Linking.removeEventListener('url', handleUrl);
  };
  useEffect(() => {
    const initialNavigation = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        const { application, ...rest } = parseQRCode(initialUrl);
        if (application) navigate(application, { application, ...rest });
      }
    };
    Linking.addEventListener('url', handleUrl);
    initialNavigation();
    return removeUrlListener;
  },
  []);
  return (
    <Screen>
      {isEmpty(applications) ? (<EmptyList text={t('empty')} />) : (
        <Wrapper>
          <FlatList
            data={applications}
            ItemSeparatorComponent={Separator}
            renderItem={
            ({
              item:
              {
                id, name, title, description, link, image, usageCount, numCertificates,
                firstUse, lastUse, averageUse, sharedData,
              },
            }) => (
              <ListItem
                disabled={usageCount === 0}
                id={id}
                name={t(title)}
                description={`uses: ${usageCount}, certificates: ${numCertificates}`}
                onPress={
                  () => navigate(
                    'ApplicationDetails', {
                      id,
                      name: t(name),
                      image,
                      description: t(description),
                      link,
                      showHistory: (usageCount > 0),
                      stats: { usageCount, firstUse, lastUse, averageUse, sharedData },
                    },
                  )}
              />
            )
          }
            keyExtractor={prop('id')}
          />
          <Button
            title={t('activate')}
            featured
            onPress={() => navigate('Scanner')}
            icon="qrcode"
          />
        </Wrapper>
      )}
    </Screen>
  );
};

ApplicationList.displayName = 'ApplicationList';

ApplicationList.propTypes = {
  applications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    usageCount: PropTypes.number.isRequired,
    firstUse: PropTypes.number,
    lastUse: PropTypes.number,
    averageUse: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ])).isRequired,
    sharedData: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      shared: PropTypes.bool.isRequired,
    })),
    numCertificates: PropTypes.number.isRequired,
  })).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

ApplicationList.navigationOptions = ({ screenProps: { t } }) => ({
  headerTitle: <Header title={t('applications:available')} icon="th-large" />,
});

export default ApplicationList;
