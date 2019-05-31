import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet, Text, View, Button,
} from 'react-native';

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
  total, refresh, t, date,
}) => (
  <View style={styles.container}>
    <Text style={styles.welcome}>{t('greeting')}</Text>
    <Text style={styles.instructions}>{t('refreshStats')}</Text>
    <Button title={t('refresh')} onPress={refresh} />
    <Text style={styles.instructions}>{t('total', { total })}</Text>
    <Text style={styles.instructions}>{t('refreshDate', { date })}</Text>
  </View>
);

Dummy.propTypes = {
  total: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  refresh: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
};

export default Dummy;
