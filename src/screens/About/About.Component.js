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
import { Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { split, map, addIndex } from 'ramda';
import { Screen } from 'lib/styles';
import { Paragraph } from './About.Styles';

const formatText = (text) => {
  const splits = split(/<\/?b>/i)(text);
  return addIndex(map)(
    (item, index) => (<Paragraph key={index} bold={index % 2}>{item}</Paragraph>),
  )(splits);
};

const About = () => {
  const { t } = useTranslation('about');
  return (
    <Screen centerAligned>
      <Paragraph>{formatText(t('text1'))}</Paragraph>
      <Paragraph>{formatText(t('text2'))}</Paragraph>
      <Button title={t('more')} onPress={Function.prototype} />
    </Screen>
  );
};

About.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('about:title'),
});

export default About;
