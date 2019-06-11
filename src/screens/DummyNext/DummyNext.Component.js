import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Title } from './DummyNext.Styles';

const DummyNext = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Title>{t('second')}</Title>
    </Container>
  );
};

DummyNext.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('next'),
});

export default DummyNext;
