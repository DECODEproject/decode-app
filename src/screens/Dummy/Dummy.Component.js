import React from 'react';
import PropTypes from 'prop-types';
import { View, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View as AnimatedView } from 'react-native-animatable';
import { Container, Greeting, Line } from './Dummy.Styles';

const Dummy = ({
  total, refresh, date, navigation, loading,
}) => {
  const { t } = useTranslation();
  return (
    <Container>
      <Greeting>{t('greeting')}</Greeting>
      <Line>{t('refreshStats')}</Line>
      <Button title={t('refresh')} onPress={refresh} />
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
      <Button
        title={t('next')}
        onPress={() => navigation.navigate('DummyNext')}
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
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default Dummy;
