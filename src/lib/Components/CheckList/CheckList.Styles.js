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
import { Icon } from 'lib/styles';

export const Wrapper = styled.View({
  paddingVertical: 10,
});

export const RowWrapper = styled.View(({ first, theme }) => ({
  borderWidth: 1,
  borderTopWidth: first ? 1 : 0,
  borderColor: theme.colors.blueGreen,
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'stretch',
}));

export const LabelWrapper = styled.View({
  flex: 0.9,
  padding: 10,
  justifyContent: 'center',
  alignItems: 'stretch',
});

export const SwitchWrapper = styled.View(({ theme }) => ({
  flex: 0.2,
  paddingHorizontal: 5,
  borderLeftWidth: 1,
  borderColor: theme.colors.blueGreen,
  justifyContent: 'center',
  alignItems: 'center',
}));

export const CheckWrapper = styled.View(({ theme }) => ({
  flex: 0.1,
  padding: 10,
  borderLeftWidth: 1,
  borderColor: theme.colors.blueGreen,
  justifyContent: 'center',
  alignItems: 'center',
}));

export const Check = styled(Icon)(({ theme }) => ({
  color: theme.colors.green,
}));
