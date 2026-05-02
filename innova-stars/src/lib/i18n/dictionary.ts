/**
 * Hand-rolled translations dictionary. Add a new entry per phrase, with a
 * key that's used everywhere in the codebase. When a translation is
 * missing the English fallback is used.
 *
 * If/when we outgrow this, swap for `next-intl`. For now this keeps the
 * surface area tiny and avoids a router rewrite.
 */

export type Locale = 'en' | 'ar';

export const LOCALES: Locale[] = ['en', 'ar'];
export const DEFAULT_LOCALE: Locale = 'en';

type Dict = Record<string, Record<Locale, string>>;

export const dictionary: Dict = {
  'nav.home': { en: 'Home', ar: 'الرئيسية' },
  'nav.services': { en: 'Services', ar: 'الخدمات' },
  'nav.work': { en: 'Our Work', ar: 'أعمالنا' },
  'nav.about': { en: 'About', ar: 'من نحن' },
  'nav.careers': { en: 'Careers', ar: 'وظائف' },
  'nav.contact': { en: 'Contact', ar: 'اتصل بنا' },

  'hero.tagline': {
    en: 'Lead your business to the stars',
    ar: 'نقود أعمالك إلى النجوم',
  },
  'hero.subtitle': {
    en: 'Innovation meets imagination',
    ar: 'الابتكار يلتقي بالخيال',
  },
  'hero.cta': { en: 'Start Your Mission', ar: 'ابدأ مهمتك' },

  'cta.headline': {
    en: 'Ready to reach the stars?',
    ar: 'مستعد للوصول إلى النجوم؟',
  },
  'cta.subline': {
    en: "Let's build something extraordinary together.",
    ar: 'دعنا نبني شيئاً استثنائياً معاً.',
  },

  'whatsapp.tooltip': { en: 'Chat on WhatsApp', ar: 'تحدث على واتساب' },
  'cookies.message': {
    en: 'Essential cookies keep the site running, and anonymous analytics help us understand what works.',
    ar: 'نستخدم ملفات تعريف ارتباط أساسية لتشغيل الموقع وإحصاءات مجهولة لفهم تجربة المستخدم.',
  },
  'cookies.accept': { en: 'Accept', ar: 'موافق' },
  'cookies.reject': { en: 'Reject', ar: 'رفض' },
};

export function t(key: string, locale: Locale = DEFAULT_LOCALE): string {
  return dictionary[key]?.[locale] ?? dictionary[key]?.[DEFAULT_LOCALE] ?? key;
}
