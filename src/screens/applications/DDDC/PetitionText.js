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

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import HTML from 'react-native-render-html';
import { ThemeContext } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Screen, Button } from 'lib/Components';
import { Section, Heading } from 'lib/styles';

const PetitionText = (
  { navigation: { getParam, goBack } },
) => {
  const html = getParam('html');
  const title = getParam('title');
  const { fontFamily, fontSizeText: fontSize } = useContext(ThemeContext);
  const { t } = useTranslation();
  return (
    <Screen scroll>
      <Section>
        <Heading>{title}</Heading>
        <HTML html={html} tagsStyles={{ p: { fontFamily, fontSize, marginVertical: 10 } }} />
        <Button title={t('back')} featured onPress={() => goBack()} />
      </Section>
    </Screen>
  );
};

PetitionText.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};

export default PetitionText;
