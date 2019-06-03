import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

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
});

const DummyNext = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>{t('second')}</Text>
    </View>
  );
};

DummyNext.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('next'),
});

export default DummyNext;
