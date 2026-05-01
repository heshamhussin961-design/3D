# Innova Stars — قائمة التحسينات والمتبقي

> آخر تحديث: 2026-05-01
> معظم البنود الكودية اتعملت. الباقي محتاج قرارات (دومين، حسابات، API keys).

---

## 🔴 محتاج قرار/حساب (لا يقدر يتعمل من الكود)

### 1. تفعيل الإيميل الحقيقي ⚠️ نص-مكتمل
- [x] الـ API endpoint جاهز ومربوط بـ Resend في الكود
- [ ] **محتاج:** `RESEND_API_KEY` في `.env.local` (شوف `.env.example`)
- [ ] **محتاج:** verify domain في Resend dashboard
- [ ] **محتاج:** تعديل `CONTACT_TO_EMAIL` و `CONTACT_FROM_EMAIL` لإيميلات حقيقية
- **الملفات:** `src/app/api/contact/route.ts`, `src/app/api/newsletter/route.ts`

### 2. الدومين الفعلي
- [ ] حجز `innovastars.ae` (أو دومين بديل)
- [ ] لو دومين تاني، عدل `SITE_CONFIG.url` في `src/lib/constants/index.ts`

### 3. الإيميل الحقيقي
- [ ] إعداد `hello@innovastars.ae` (أو إيميل تاني)
- [ ] تعديل `SITE_CONFIG.email` في الـ constants

### 4. حسابات السوشيال الحقيقية
- [ ] التأكد من حسابات: Instagram, LinkedIn, TikTok, Twitter, YouTube
- [ ] لو الأسماء مختلفة، تعديل `SITE_CONFIG.social`
- ✅ **WhatsApp** متضاف بـ +971 54 318 0337

### 5. بيانات الفريم الحقيقية
- [ ] استبدال أعضاء الفريم الوهميين (Marwan H, Nora A, Yusuf K, Lina R)
- **الملف:** `src/app/about/page.tsx`

### 6. صور Case Studies حقيقية
- [ ] استبدال `cs.visual` paths بصور حقيقية للأعمال
- **الملف:** `src/lib/constants/work.ts`

### 7. AI Demo بـ مفتاح حقيقي ⚠️ نص-مكتمل
- [x] الـ API endpoint جاهز ومربوط بـ Anthropic Claude
- [x] الفرونت ينده الـ API ويعرض الرد
- [ ] **محتاج:** `ANTHROPIC_API_KEY` في `.env.local`
- **الملفات:** `src/app/api/ai-demo/route.ts`, `src/app/ai-demo/page.tsx`

---

## ✅ اللي اتعمل خلاص (Done)

### الأمان
- ✅ **Security Headers** كامل (CSP, HSTS, X-Frame-Options, Permissions-Policy, Referrer-Policy, X-Content-Type-Options) في `next.config.mjs`
- ✅ **Rate Limiting** على API routes (5 req / 10min للـ contact، 3 للـ newsletter، 10/min للـ AI)
- ✅ **Honeypot fields** على Contact + Newsletter forms (هتوقف 80% من البوتات)
- ✅ **Input validation** + max length على كل الحقول
- ✅ **`reactStrictMode: true`** + `poweredByHeader: false`
- ✅ **`.env.example`** موثق بكل المتغيرات اللازمة

### الصفحات القانونية + Compliance
- ✅ صفحة [Privacy Policy](src/app/privacy/page.tsx) كاملة (GDPR + UAE PDPL)
- ✅ صفحة [Terms of Service](src/app/terms/page.tsx)
- ✅ صفحة [Cookie Policy](src/app/cookies/page.tsx) مع جدول الـ cookies
- ✅ **Cookie consent banner** يظهر مرة واحدة، يحفظ الاختيار في localStorage
- ✅ Footer links بتوصل للصفحات القانونية

### Analytics & Errors
- ✅ **Vercel Analytics** متركبة وشغالة
- ✅ **Vercel Speed Insights** متركبة (Core Web Vitals)
- ✅ **Global error boundary** (`src/app/error.tsx`) لأي runtime error
- ✅ **Global loading state** (`src/app/loading.tsx`)

### UX
- ✅ صفحة [Thank You](src/app/thank-you/page.tsx) لما يبعت contact form بنجاح
- ✅ Loading states على كل الـ forms (spinner داخل الزرار)
- ✅ **Apple Touch Icon** (programmatic، 180×180) في `src/app/apple-icon.tsx`
- ✅ Sitemap محدث بكل الصفحات الجديدة
- ✅ Cookie banner برسالة واضحة وزرارين Accept/Reject

### Tests
- ✅ **Vitest** متركبة + jsdom + RTL
- ✅ Unit tests لـ rateLimit (3 tests passing)
- ✅ Scripts: `npm test`, `npm run test:watch`

### اللوجو والـ Branding
- ✅ Innova Stars SVG logo (3 أحجام)
- ✅ Favicon SVG محدث
- ✅ زرار WhatsApp عائم بالرقم +971 54 318 0337
- ✅ Open Graph image programmatic

### الفيديو الكامل
- ✅ `Innova.mp4` (28MB) كـ scroll-scrubbed backdrop على الموقع كله
- ✅ Frame-by-frame seek (intra-only encoded, 728 keyframe)
- ✅ Poster image لتجنب black flash
- ✅ Smooth scroll بـ Lenis

### الصفحات الموجودة
- ✅ Home, About, Work, Services [slug]
- ✅ AI Demo
- ✅ Privacy, Terms, Cookies (جديد)
- ✅ Thank You (جديد)
- ✅ 404 page

---

## 🟡 تحسينات اختيارية (Nice-to-have)

### 8. ترقية Next.js لـ v16
- [ ] حالياً `14.2.x`، فيه CVEs known في الـ image optimizer
- [ ] الترقية breaking change — لازم اختبار شامل
- **الأمر:** `npm audit fix --force` (سيرقى لـ Next 16)

### 9. ترجمة عربي/إنجليزي (i18n)
- [ ] إضافة دعم العربية (المستهدف الإمارات)
- **الحل:** next-intl أو next-i18next

### 10. CMS بسيط
- [ ] Sanity / Contentlayer / Notion للمحتوى
- [ ] حالياً hardcoded في `src/lib/constants/`

### 11. Sentry Integration
- [ ] Setup لو المتغيرات `NEXT_PUBLIC_SENTRY_DSN` متضافة
- [ ] الـ error boundary موجود ومستعد

### 12. E2E Tests
- [ ] Playwright لـ contact form, scroll behavior, navigation
- [ ] حالياً عندنا unit tests بس

### 13. Email Confirmation
- [ ] إيميل تأكيد للمستخدم بعد ما يبعت contact form
- [ ] دلوقتي بيوصل إيميل للأدمن بس

### 14. صفحة Careers حقيقية
- [ ] لو فيه وظائف، صفحة `/careers` بـ open roles

---

## 📊 الأولويات للإطلاق

اشتغل بالترتيب:

1. ✅ **الأمان** — اتعمل
2. ✅ **القانوني** — اتعمل
3. ✅ **Analytics** — اتعمل
4. **#2 الدومين** — احجز innovastars.ae
5. **#1 RESEND_API_KEY** — وقت دقايق على resend.com
6. **#3 الإيميل** — أعد إيميل hello@innovastars.ae
7. **#4 السوشيال** — عدل الروابط للحسابات الحقيقية
8. **#5 الفريم** — استبدل البيانات الوهمية
9. **#6 الأعمال** — صور حقيقية للـ case studies

---

## 🛠️ Commands

```bash
npm run dev        # تشغيل local dev
npm run build      # build للـ production
npm test           # تشغيل الـ tests
npm run typecheck  # تحقق من TypeScript
npm run lint       # ESLint
```
