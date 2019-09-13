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
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Screen } from 'lib/Components';
import { Heading, Text } from 'lib/styles';
import { Buttons, MessageContainer } from './Error.Styles';

const Error = ({ navigation: { goBack, getParam } }) => {
  const { t } = useTranslation();
  const message = getParam('message');
  const detail = getParam('detail');
  return (
    <Screen>
      <MessageContainer>
        <Heading>{message}</Heading>
        {
          detail ? <Text>{detail}</Text> : null
        }
      </MessageContainer>
      <Buttons>
        <Button featured title={t('OK')} onPress={() => goBack()} />
      </Buttons>
    </Screen>
  );
};

Error.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default Error;
