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
import { View, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import Onboarding from 'react-native-onboarding-swiper';
import { useTranslation } from 'react-i18next';
import { Title, Subtitle, CarouselImage } from './Carousel.Styles';

const img1 = require('./images/image01.png');
const img2 = require('./images/image02.png');
const img3 = require('./images/image03.png');
const img4 = require('./images/image04.png');

const Carousel = ({ onDone }) => {
  const { t } = useTranslation('carousel');
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <Onboarding
        onSkip={onDone}
        onDone={onDone}
        containerStyles={{
          alignItems: 'center',
        }}
        imageContainerStyles={{
          paddingBottom: 0,
        }}
        skipLabel={t('skip')}
        nextLabel={t('next')}
        pages={[
          {
            backgroundColor: '#0575e5',
            image: <CarouselImage source={img1} resizeMode="contain" />,
            title: <Title>{t('title')}</Title>,
            subtitle: <Subtitle>{t('txt1')}</Subtitle>,
          },
          {
            backgroundColor: '#fd56ac',
            image: <CarouselImage source={img2} resizeMode="contain" />,
            title: '',
            subtitle: <Subtitle>{t('txt2')}</Subtitle>,
          },
          {
            backgroundColor: '#37bdc2',
            image: <CarouselImage source={img3} resizeMode="contain" />,
            title: '',
            subtitle: <Subtitle>{t('txt3')}</Subtitle>,
          },
          {
            backgroundColor: '#0475e5',
            image: <CarouselImage source={img4} resizeMode="contain" />,
            title: '',
            subtitle: <Subtitle>{t('txt4')}</Subtitle>,
          },
        ]}
        bottomBarHighlight={false}
        controlStatusBar={false}
      />
    </View>
  );
};

Carousel.propTypes = {
  onDone: PropTypes.func.isRequired,
};

export default Carousel;
