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
