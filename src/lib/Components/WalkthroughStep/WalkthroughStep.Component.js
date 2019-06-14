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
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useTranslation } from 'react-i18next';

const WalkthroughStep = ({
  screen, id, children, showTooltip, onTooltipClose,
}) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      isVisible={showTooltip === id}
      content={<Text>{t(`walkthrough.${id}`)}</Text>}
      onClose={() => onTooltipClose(screen, id)}
      onChildPress={() => onTooltipClose(screen, id)}
    >
      { children }
    </Tooltip>
  );
};

WalkthroughStep.propTypes = {
  screen: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  showTooltip: PropTypes.string.isRequired,
  onTooltipClose: PropTypes.func.isRequired,
};

export default WalkthroughStep;
