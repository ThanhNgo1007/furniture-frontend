import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // 1. Import Detector
import { initReactI18next } from 'react-i18next';

import enJSON from './locales/en.json';
import viJSON from './locales/vi.json';

const resources = {
  en: { translation: enJSON },
  vi: { translation: viJSON },
};

i18n
  .use(LanguageDetector) // 2. Kích hoạt Detector
  .use(initReactI18next)
  .init({
    resources,

    // 3. QUAN TRỌNG: XÓA hoặc Comment dòng dưới đây
    // lng: 'en', 

    // Thay vào đó, dùng fallbackLng (ngôn ngữ dự phòng nếu không tìm thấy ngôn ngữ đã lưu)
    fallbackLng: 'en',

    // 4. Cấu hình phát hiện ngôn ngữ
    detection: {
      // Thứ tự ưu tiên: Tìm trong localStorage trước -> rồi đến cookie -> rồi đến cài đặt trình duyệt
      order: ['localStorage', 'cookie', 'navigator'],

      // Nơi lưu giữ ngôn ngữ khi người dùng thay đổi
      caches: ['localStorage', 'cookie'],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;