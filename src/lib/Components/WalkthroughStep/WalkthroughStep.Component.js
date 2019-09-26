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
import { withNavigation } from 'react-navigation';

const WalkthroughStep = ({
  application, screen, id, placement, children, showTooltip, onTooltipClose, onCloseAction,
}) => {
  const { t } = useTranslation();
  const onClose = () => {
    onTooltipClose(screen, id);
    if (onCloseAction) onCloseAction();
  };
  const translationKey = application ? `${application}.walkthrough.${id}` : `walkthrough.${id}`;
  return (
    <Tooltip
      placement={placement}
      isVisible={showTooltip === id}
      content={<Text>{t(translationKey)}</Text>}
      showChildInTooltip={false}
      onClose={onClose}
      onChildPress={onClose}
      backgroundColor="rgba(0,0,0,0.3)'"
      arrowSize={{ width: 8, height: 4 }}
      displayInsets={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      { children }
    </Tooltip>
  );
};

WalkthroughStep.defaultProps = {
  application: null,
  placement: 'bottom',
  children: null,
  onCloseAction: null,
};

WalkthroughStep.propTypes = {
  application: PropTypes.string,
  screen: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placement: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  showTooltip: PropTypes.string.isRequired,
  onTooltipClose: PropTypes.func.isRequired,
  onCloseAction: PropTypes.func,
};

export default withNavigation(WalkthroughStep);
