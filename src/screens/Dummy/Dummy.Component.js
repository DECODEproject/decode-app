import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet, Text, View, Button,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View as AnimatedView } from 'react-native-animatable';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    margin: 5,
  },
});

const Dummy = ({
  total, refresh, date, navigation, loading,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>{t('greeting')}</Text>
      <Text style={styles.instructions}>{t('refreshStats')}</Text>
      <Button title={t('refresh')} onPress={refresh} />
      <View style={styles.instructions}>
        {loading ? (
          <AnimatedView
            animation="rotate"
            easing="linear"
            iterationCount="infinite"
            useNativeDriver
          >
            <Icon name="spinner" />
          </AnimatedView>
        ) : <Text>{total}</Text>}
      </View>
      <Text style={styles.instructions}>{t('refreshDate', { date })}</Text>
      <Button
        title={t('next')}
        onPress={() => navigation.navigate('DummyNext')}
      />
    </View>
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
