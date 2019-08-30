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

import { Text as RNText, TextInput as RNTextInput, Dimensions } from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import styled from 'styled-components/native';

export const Heading = styled(RNText)(({ theme: { primaryColor, fontFamily } }) => ({
  color: primaryColor,
  fontSize: 20,
  textAlign: 'center',
  fontFamily,
  fontWeight: 'bold',
}));

export const Text = styled(RNText)(({ theme: { primaryColor, fontFamily, fontSize } }) => ({
  color: primaryColor,
  textAlign: 'left',
  fontFamily,
  fontSize,
  fontWeight: 'normal',
}));

export const Icon = styled(FAIcon)((
  { theme: { fontSize, primaryColor } },
) => ({
  fontSize,
  color: primaryColor,
}));

export const ApplicationImage = styled.Image({
  marginVertical: 10,
  maxWidth: '95%',
  maxHeight: Dimensions.get('window').height / 4,
});

export const TextInput = styled(RNTextInput)(({ theme: { colors, fontFamily, fontSize } }) => ({
  fontFamily,
  fontSize,
  borderColor: colors.blueGreen,
  borderWidth: 1,
  padding: 10,
}));
