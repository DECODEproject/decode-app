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

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/ca';
import en from './en';
import es from './es';
import ca from './ca';

const languageDetector = {
  type: 'languageDetector',
  async: false,
  init: Function.prototype,
  cacheUserLanguage: Function.prototype,
  detect: () => {
    const deviceLocale = DeviceInfo.getDeviceLocale();
    moment.locale(deviceLocale);
    return deviceLocale;
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
      format: (value, format) => {
        if (value instanceof Date) return moment(value).format(format);
        return value;
      },
    },
    resources: {
      en,
      es,
      ca,
    },
  });

export default i18n;
