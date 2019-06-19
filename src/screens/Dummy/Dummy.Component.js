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
import { View, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View as AnimatedView } from 'react-native-animatable';
import WalkthroughStep from 'lib/Components/WalkthroughStep';
import { Container, Greeting, Line } from './Dummy.Styles';

const Dummy = ({
  total, refresh, date, navigation, loading, onReviewWalkthrough,
}) => {
  const { t } = useTranslation();
  return (
    <Container>
      <Greeting>{t('greeting')}</Greeting>
      <Line>{t('refreshStats')}</Line>
      <WalkthroughStep screen="dummy" id="refresh">
        <Button title={t('refresh')} onPress={refresh} />
      </WalkthroughStep>
      <View>
        {loading ? (
          <AnimatedView
            animation="rotate"
            easing="linear"
            iterationCount="infinite"
            useNativeDriver
          >
            <Icon name="spinner" />
          </AnimatedView>
        ) : <Line>{total}</Line>}
      </View>
      <Line>{t('refreshDate', { date })}</Line>
      <Button title={t('review')} onPress={onReviewWalkthrough} />
      <WalkthroughStep screen="dummy" id="next">
        <Button
          title={t('next')}
          onPress={() => navigation.navigate('DummyNext')}
        />
      </WalkthroughStep>
      <Button
        title={t('attributes:add')}
        onPress={() => navigation.navigate('ListAtlas')}
      />
    </Container>
  );
};

Dummy.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('home'),
});

Dummy.propTypes = {
  total: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  loading: PropTypes.bool.isRequired,
  refresh: PropTypes.func.isRequired,
  onReviewWalkthrough: PropTypes.func.isRequired,
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default Dummy;
