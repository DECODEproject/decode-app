
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

import styled from 'styled-components/native';
import { Text, Icon as CommonIcon } from 'lib/styles';

export const Container = styled.View(({ theme: { secondaryColor } }) => ({
  flexDirection: 'row',
  borderColor: secondaryColor,
  borderWidth: 1,
}));

export const Info = styled.View({
  paddingVertical: 16,
  paddingHorizontal: 8,
  flex: 0.8,
  flexDirection: 'column',
});

export const Buttons = styled.View({
  paddingVertical: 16,
  paddingHorizontal: 8,
  flex: 0.2,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const Icon = styled(CommonIcon)(({ theme: { primaryColor } }) => ({
  color: primaryColor,
  fontSize: 20,
}));

export const Name = styled(Text)(({ theme: { primaryColor, fontSizeText } }) => ({
  color: primaryColor,
  fontSize: fontSizeText,
  fontWeight: 'bold',
}));

export const Value = styled(Text)(({ theme: { primaryColor, fontSizeText } }) => ({
  color: primaryColor,
  fontSize: fontSizeText,
}));
