import "dotenv/config";

import argon2 from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../lib/generated/prisma/client";
import { Role } from "../lib/generated/prisma/enums";

import en from "../app/[lang]/dictionaries/en.json";
import tr from "../app/[lang]/dictionaries/tr.json";
import ku from "../app/[lang]/dictionaries/ku.json";
import ar from "../app/[lang]/dictionaries/ar.json";
import { SEO } from "../lib/seo";

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set. Add it to your .env file.`);
  }

  return value;
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = requireEnv("ADMIN_PASSWORD");
const DATABASE_URL = requireEnv("DATABASE_URL");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: DATABASE_URL }),
});

/* ------------------------------------------------------------------ */
/* Demo catalog pricing                                               */
/* ------------------------------------------------------------------ */

const DEMO_PRICING: Record<
  string,
  { priceTry: number; discountPercent?: number }
> = {
  "intake-manifolds": { priceTry: 18500, discountPercent: 15 },
  "cold-air-intakes": { priceTry: 12500 },
  "carbon-airboxes": { priceTry: 24000, discountPercent: 10 },
  "air-intake-piping": { priceTry: 9500 },
  "exhaust-manifolds": { priceTry: 32000, discountPercent: 20 },
  "headlight-intakes": { priceTry: 14000 },
  "brake-cooling-ducts": { priceTry: 7800 },
  "carbon-fiber-steering-wheels": { priceTry: 45000, discountPercent: 12 },
  "racing-seats": { priceTry: 38000 },
  "shift-knobs": { priceTry: 2400, discountPercent: 25 },
  "carbon-fiber-interior-trims": { priceTry: 16500 },
  "carbon-fiber-hoods": { priceTry: 42000, discountPercent: 18 },
  "trunks-tailgates": { priceTry: 35000 },
  "lightweight-doors": { priceTry: 52000, discountPercent: 15 },
  "spoilers-wings": { priceTry: 27500 },
};

const TRY_PER_USD = 40;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

async function seedDemoPricing() {
  const products = await prisma.product.findMany({
    where: { OR: [{ priceTry: null }, { priceUsd: null }] },
    select: { id: true, category: true, priceTry: true, priceUsd: true },
  });

  let updated = 0;

  for (const product of products) {
    const demo = DEMO_PRICING[product.category];

    if (!demo) continue;

    const percent = demo.discountPercent ?? 0;
    const data: {
      priceTry?: number;
      discountedPriceTry?: number;
      discountPercentTry?: number;
      priceUsd?: number;
      discountedPriceUsd?: number;
      discountPercentUsd?: number;
    } = {};

    if (product.priceTry === null) {
      data.priceTry = demo.priceTry;

      if (percent > 0) {
        data.discountedPriceTry = round2(demo.priceTry * (1 - percent / 100));
        data.discountPercentTry = percent;
      }
    }

    if (product.priceUsd === null) {
      const priceUsd = round2(demo.priceTry / TRY_PER_USD);
      data.priceUsd = priceUsd;

      if (percent > 0) {
        data.discountedPriceUsd = round2(priceUsd * (1 - percent / 100));
        data.discountPercentUsd = percent;
      }
    }

    if (Object.keys(data).length === 0) continue;

    await prisma.product.update({ where: { id: product.id }, data });

    updated += 1;
  }

  console.log(`Seeded demo pricing on ${updated} product(s).`);
}

/* ------------------------------------------------------------------ */
/* CMS pages                                                          */
/* ------------------------------------------------------------------ */

type Dict = typeof en;
type SeedLocale = "en" | "tr" | "ku" | "ar";

const DICTS: Record<SeedLocale, Dict> = { en, tr, ku, ar };
const SEED_LOCALES: SeedLocale[] = ["en", "tr", "ku", "ar"];

type SeedItem = { title: string; body: string; href?: string };

type SeedSectionText = {
  eyebrow?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  items?: SeedItem[];
};

type SeedSection = {
  key: string;
  type: string;
  image?: string;
  href?: string;
  text: (dict: Dict, locale: SeedLocale) => SeedSectionText;
};

type SeedPage = {
  key: string;
  label: string;
  /** SEO title/description per locale. */
  seo: (dict: Dict, locale: SeedLocale) => { title: string; subtitle: string };
  sections: SeedSection[];
};

const lines = (value: readonly string[]) => value.join("\n");
const paragraphs = (value: readonly string[]) => value.join("\n\n");

const HOME_BANNER = "/assets/homebannerimg.jpg";
const SHARED_IMAGE = "/assets/739d6f87-00fc-4c94-aa88-213a021c47a8.jpg";

/** SEO copy for the static pages, reused from `lib/seo.ts` per locale. */
function staticSeo(locale: SeedLocale, page: "home" | "about" | "contact") {
  return SEO[locale].pages[page];
}

const CONTENT_PAGES: SeedPage[] = [
  {
    key: "home",
    label: "Home",
    seo: (_dict, locale) => {
      const seo = staticSeo(locale, "home");
      return { title: seo.title, subtitle: seo.description };
    },
    sections: [
      {
        key: "hero",
        type: "home-hero",
        image: HOME_BANNER,
        text: (dict) => ({ body: dict.home.subtitle }),
      },
      {
        key: "approach",
        type: "home-approach",
        image: SHARED_IMAGE,
        text: (dict) => ({
          title: lines(dict.home.approach.titleLines),
          body: dict.home.approach.body,
        }),
      },
    ],
  },
  {
    key: "about",
    label: "About",
    seo: (_dict, locale) => {
      const seo = staticSeo(locale, "about");
      return { title: seo.title, subtitle: seo.description };
    },
    sections: [
      {
        key: "hero",
        type: "about-hero",
        text: (dict) => ({
          eyebrow: dict.about.hero.label,
          title: lines(dict.about.hero.titleLines),
          body: dict.about.hero.body,
        }),
      },
      {
        key: "story",
        type: "about-story",
        text: (dict) => ({
          title: lines(dict.about.story.titleLines),
          body: paragraphs(dict.about.story.paragraphs),
        }),
      },
      {
        key: "values",
        type: "about-values",
        text: (dict) => ({
          items: dict.about.values.map((value) => ({
            title: value.title,
            body: value.body,
          })),
        }),
      },
      {
        key: "image",
        type: "about-image",
        image: SHARED_IMAGE,
        text: (dict) => ({
          title: dict.about.image.brand,
          body: dict.about.image.caption,
        }),
      },
      {
        key: "closing",
        type: "about-closing",
        text: (dict) => ({
          eyebrow: dict.about.closing.brand,
          title: lines(dict.about.closing.titleLines),
          body: dict.about.closing.body,
          ctaLabel: dict.about.closing.established,
        }),
      },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    seo: (_dict, locale) => {
      const seo = staticSeo(locale, "contact");
      return { title: seo.title, subtitle: seo.description };
    },
    sections: [
      {
        key: "hero",
        type: "contact-hero",
        text: (dict) => ({
          eyebrow: dict.contact.hero.label,
          title: lines(dict.contact.hero.titleLines),
          body: dict.contact.hero.body,
        }),
      },
      {
        key: "info",
        type: "contact-info",
        text: (dict) => ({
          items: [
            {
              title: dict.contact.info.email,
              body: dict.contact.info.emailValue,
              href: `mailto:${dict.contact.info.emailValue}`,
            },
            {
              title: dict.contact.info.location,
              body: dict.contact.info.locationValue,
            },
            {
              title: dict.contact.info.instagram,
              body: dict.contact.info.instagramValue,
              href: "#",
            },
          ],
        }),
      },
      { key: "form", type: "contact-form", text: () => ({}) },
      {
        key: "closing",
        type: "contact-closing",
        text: (dict) => ({
          eyebrow: dict.contact.closing.brand,
          title: lines(dict.contact.closing.titleLines),
          ctaLabel: dict.contact.closing.label,
        }),
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Legal pages                                                        */
/* ------------------------------------------------------------------ */

type LegalEntry = {
  key: string;
  label: string;
  slug: string;
  docs: Record<SeedLocale, { title: string; body: string }>;
};

const COMPANY = "Ronas Corduene";
const EMAIL = "hello@ronascorduene.com";
const LOCATION = "Corduene / Turkey";

const LEGAL_PAGES: LegalEntry[] = [
  {
    key: "legal/privacy",
    label: "Privacy Policy",
    slug: "privacy",
    docs: {
      en: {
        title: "Privacy Policy",
        body: [
          `## Who we are\n${COMPANY} designs and manufactures automotive equipment at ${LOCATION}. This policy explains what personal data we collect through ronascorduene.com and how we use it.`,
          `## What we collect\nWe collect the details you give us through our contact form and parts list, such as your name, email address, phone number and the products you are interested in. We also store basic technical data such as the language you select.`,
          `## How we use it\nWe use your data only to answer enquiries, prepare quotations and fulfil orders. We do not sell personal data to third parties.`,
          `## Your rights\nYou can ask us to access, correct or delete your data at any time by writing to ${EMAIL}.`,
        ].join("\n\n"),
      },
      tr: {
        title: "Gizlilik Politikası",
        body: [
          `${COMPANY}, ${LOCATION} adresinde otomotiv ekipmanı tasarlar ve üretir. Bu politika, ronascorduene.com üzerinden hangi kişisel verileri topladığımızı ve bunları nasıl kullandığımızı açıklar.`,
          `## Neleri topluyoruz\nİletişim formu ve parça listesi aracılığıyla bize verdiğiniz ad, e-posta, telefon ve ilgilendiğiniz ürünler gibi bilgileri toplarız. Seçtiğiniz dil gibi temel teknik verileri de saklarız.`,
          `## Nasıl kullanıyoruz\nVerilerinizi yalnızca sorularınızı yanıtlamak, teklif hazırlamak ve siparişleri yerine getirmek için kullanırız. Kişisel verileri üçüncü taraflara satmayız.`,
          `## Haklarınız\nVerilerinize erişmek, düzeltmek veya silmek için ${EMAIL} adresine yazabilirsiniz.`,
        ].join("\n\n"),
      },
      ku: {
        title: "Polîtîkaya Nepenîtiyê",
        body: [
          `${COMPANY} li ${LOCATION} alavên otomotîvê çêdike. Ev polîtîka rave dike ku em bi riya ronascorduene.com kîjan daneyên kesane kom dikin û çawa bi kar tînin.`,
          `## Em çi kom dikin\nEm agahdariya ku hûn bi forma têkilî û lîsta parçeyan didin kom dikin: nav, e-name, telefon û hilberên ku hûn bala xwe didinê. Em daneyên teknîkî yên bingehîn jî diparêzin.`,
          `## Em çawa bi kar tînin\nEm daneyên we tenê ji bo bersivdana pirsan, amadekirina texmîn û bicihanîna fermanan bi kar tînin. Em daneyên kesane li aliyên sêyem na firotin.`,
          `## Mafên we\nHûn dikarin her dem li ${EMAIL} binivîsin da ku daneyên xwe bigihîjin, rast bikin an jêbirin.`,
        ].join("\n\n"),
      },
      ar: {
        title: "سياسة الخصوصية",
        body: [
          `تصمم ${COMPANY} وتصنع معدات السيارات في ${LOCATION}. توضح هذه السياسة البيانات الشخصية التي نجمعها عبر ronascorduene.com وكيفية استخدامها.`,
          `## ما الذي نجمعه\nنجمع التفاصيل التي تقدمها عبر نموذج التواصل وقائمة القطع، مثل الاسم والبريد الإلكتروني والهاتف والمنتجات التي تهتم بها. كما نخزّن بيانات تقنية أساسية مثل اللغة التي تختارها.`,
          `## كيف نستخدمها\nنستخدم بياناتك فقط للرد على الاستفسارات وإعداد العروض وتنفيذ الطلبات. لا نبيع البيانات الشخصية لأطراف ثالثة.`,
          `## حقوقك\nيمكنك مراسلتنا على ${EMAIL} للوصول إلى بياناتك أو تصحيحها أو حذفها في أي وقت.`,
        ].join("\n\n"),
      },
    },
  },
  {
    key: "legal/kvkk",
    label: "KVKK",
    slug: "kvkk",
    docs: {
      en: {
        title: "KVKK Disclosure",
        body: [
          `## Data controller\nUnder Turkish Law No. 6698 on the Protection of Personal Data (KVKK), the data controller is ${COMPANY}, ${LOCATION}.`,
          `## Purpose of processing\nPersonal data collected through this website is processed to respond to requests, prepare quotations, process orders and meet legal obligations.`,
          `## Transfer\nData may be shared with service providers that host our website and process payments, only as far as required to deliver our services.`,
          `## Your rights\nYou may request information, correction or deletion of your data by contacting ${EMAIL}.`,
        ].join("\n\n"),
      },
      tr: {
        title: "KVKK Aydınlatma Metni",
        body: [
          `## Veri sorumlusu\n6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu ${COMPANY}, ${LOCATION} adresindedir.`,
          `## İşleme amacı\nBu web sitesi üzerinden toplanan kişisel veriler; talepleri yanıtlamak, teklif hazırlamak, siparişleri işlemek ve yasal yükümlülükleri yerine getirmek amacıyla işlenir.`,
          `## Aktarım\nVeriler, hizmetlerimizi sunmak için gerekli olduğu ölçüde, web sitemizi barındıran ve ödeme işleyen hizmet sağlayıcılarla paylaşılabilir.`,
          `## Haklarınız\n${EMAIL} adresine başvurarak verileriniz hakkında bilgi, düzeltme veya silme talep edebilirsiniz.`,
        ].join("\n\n"),
      },
      ku: {
        title: "Daxuyaniya KVKK",
        body: [
          `## Berpirsiyarê daneyan\nLi gorî Zagona Tirkiyeyê ya jimare 6698 (KVKK), berpirsiyarê daneyan ${COMPANY}, ${LOCATION} e.`,
          `## Armanca pêvajoyê\nDaneyên kesane yên ku bi vê malperê têne kom kirin ji bo bersivdana daxwazan, amadekirina texmînan, pêvajoya fermanan û bicihanîna berpirsiyariyên qanûnî têne pêvajokirin.`,
          `## Veguhestin\nDaneyên bi qasî ku ji bo pêşkêşkirina xizmetan pêwîst e, dikarin bi pêşkêşkerên ku malpera me dihêlin re bêne parve kirin.`,
          `## Mafên we\nHûn dikarin bi têkiliya ${EMAIL} agahdarî, rastkirin an jêbirina daneyên xwe daxwaz bikin.`,
        ].join("\n\n"),
      },
      ar: {
        title: "إفصاح KVKK",
        body: [
          `## المسؤول عن البيانات\nبموجب القانون التركي رقم 6698 لحماية البيانات الشخصية (KVKK)، فإن المسؤول عن البيانات هو ${COMPANY}، ${LOCATION}.`,
          `## الغرض من المعالجة\nتتم معالجة البيانات الشخصية التي تُجمع عبر هذا الموقع للرد على الطلبات وإعداد العروض ومعالجة الطلبات والوفاء بالالتزامات القانونية.`,
          `## المشاركة\nقد تُشارك البيانات مع مزوّدي الخدمات الذين يستضيفون موقعنا ومعالجي الدفع، بالقدر اللازم لتقديم خدماتنا فقط.`,
          `## حقوقك\nيمكنك طلب المعلومات أو التصحيح أو الحذف عبر مراسلتنا على ${EMAIL}.`,
        ].join("\n\n"),
      },
    },
  },
  {
    key: "legal/cookies",
    label: "Cookie Policy",
    slug: "cookies",
    docs: {
      en: {
        title: "Cookie Policy",
        body: [
          `## What cookies are\nCookies are small text files stored by your browser. We use them to remember your language and to keep the site working correctly.`,
          `## What we use\n- Essential cookies: language selection and session security.\n- Analytics cookies: only where enabled, to understand how the site is used.`,
          `## Managing cookies\nYou can block or delete cookies in your browser settings. Essential cookies are required for the site to function.`,
        ].join("\n\n"),
      },
      tr: {
        title: "Çerez Politikası",
        body: [
          `## Çerez nedir\nÇerezler tarayıcınız tarafından saklanan küçük metin dosyalarıdır. Dilinizi hatırlamak ve sitenin doğru çalışmasını sağlamak için kullanırız.`,
          `## Neler kullanıyoruz\n- Zorunlu çerezler: dil seçimi ve oturum güvenliği.\n- Analiz çerezleri: yalnızca etkin olduğunda, site kullanımını anlamak için.`,
          `## Çerezleri yönetme\nTarayıcı ayarlarınızdan çerezleri engelleyebilir veya silebilirsiniz. Zorunlu çerezler sitenin çalışması için gereklidir.`,
        ].join("\n\n"),
      },
      ku: {
        title: "Polîtîkaya Kûkîyan",
        body: [
          `## Kûkî çi ne\nKûkî pelên piçûk in ku geroka we diparêze. Em wan bikar tînin da ku zimanê we bi bîr bînin û malper baş bixebite.`,
          `## Em çi bi kar tînin\n- Kûkîyên pêwîst: hilbijartina ziman û ewlehiya danişînê.\n- Kûkîyên analîzê: tenê dema çalak be, ji bo fêmkirina bikaranîna malperê.`,
          `## Rêvebirina kûkîyan\nHûn dikarin di mîhengên geroka xwe de kûkîyan asteng bikin an jêbirin. Kûkîyên pêwîst ji bo xebata malperê pêwîst in.`,
        ].join("\n\n"),
      },
      ar: {
        title: "سياسة ملفات تعريف الارتباط",
        body: [
          `## ما هي ملفات تعريف الارتباط\nهي ملفات نصية صغيرة يخزّنها متصفحك. نستخدمها لتذكّر لغتك ولضمان عمل الموقع بشكل صحيح.`,
          `## ما الذي نستخدمه\n- ملفات ضرورية: اختيار اللغة وأمان الجلسة.\n- ملفات تحليلية: فقط عند تفعيلها، لفهم كيفية استخدام الموقع.`,
          `## إدارة الملفات\nيمكنك حظر الملفات أو حذفها من إعدادات المتصفح. الملفات الضرورية مطلوبة لعمل الموقع.`,
        ].join("\n\n"),
      },
    },
  },
  {
    key: "legal/terms",
    label: "Terms of Use",
    slug: "terms",
    docs: {
      en: {
        title: "Terms of Use",
        body: [
          `## Acceptance\nBy using ronascorduene.com you agree to these terms. The site and its content belong to ${COMPANY}.`,
          `## Content\nThe information on this site, including product specifications and prices, is provided for general information and may change without notice.`,
          `## Liability\nWe work to keep the site accurate and available, but we do not guarantee uninterrupted access and are not liable for indirect damages arising from its use.`,
        ].join("\n\n"),
      },
      tr: {
        title: "Kullanım Koşulları",
        body: [
          `## Kabul\nronascorduene.com sitesini kullanarak bu koşulları kabul etmiş olursunuz. Site ve içeriği ${COMPANY} firmasına aittir.`,
          `## İçerik\nÜrün özellikleri ve fiyatlar dâhil bu sitedeki bilgiler genel bilgilendirme amacıyla sunulur ve önceden bildirilmeksizin değişebilir.`,
          `## Sorumluluk\nSitenin doğru ve erişilebilir kalması için çalışırız; ancak kesintisiz erişimi garanti etmeyiz ve kullanımından doğan dolaylı zararlardan sorumlu değiliz.`,
        ].join("\n\n"),
      },
      ku: {
        title: "Mercên Bikaranînê",
        body: [
          `## Qebûlkirin\nBi bikaranîna ronascorduene.com hûn van mercan qebûl dikin. Malper û naveroka wê ya ${COMPANY} ye.`,
          `## Naverok\nAgahdariya li vê malperê, tevî taybetmendiyên hilberan û bihayan, ji bo agahdariya giştî ye û bê agahdarî dikare biguhere.`,
          `## Berpirsiyarî\nEm dixebitin ku malper rast û berdest be, lê em gihîştina bê navber garantî nakin û ji ziyanên nerasterast berpirsiyar nînin.`,
        ].join("\n\n"),
      },
      ar: {
        title: "شروط الاستخدام",
        body: [
          `## القبول\nباستخدامك ronascorduene.com فإنك توافق على هذه الشروط. الموقع ومحتواه ملك لـ ${COMPANY}.`,
          `## المحتوى\nالمعلومات في هذا الموقع، بما في ذلك مواصفات المنتجات والأسعار، مقدمة للإعلام العام وقد تتغير دون إشعار.`,
          `## المسؤولية\nنعمل على إبقاء الموقع دقيقًا ومتاحًا، لكننا لا نضمن الوصول دون انقطاع ولسنا مسؤولين عن الأضرار غير المباشرة الناتجة عن استخدامه.`,
        ].join("\n\n"),
      },
    },
  },
  {
    key: "legal/distance-sales",
    label: "Distance Sales Agreement",
    slug: "distance-sales",
    docs: {
      en: {
        title: "Distance Sales Agreement",
        body: [
          `## Parties\nThis agreement is made between ${COMPANY}, ${LOCATION} (the seller) and the customer who places an order through ronascorduene.com.`,
          `## Subject\nOrders are prepared as individual quotations. The seller confirms availability, price, fitment and delivery before the order is finalised.`,
          `## Payment and delivery\nPrices are shown in the selected currency. Delivery times are confirmed per order and depend on the product and destination.`,
          `## Right of withdrawal\nWhere applicable, the customer may withdraw within 14 days of delivery, provided the product is unused and in its original condition.`,
        ].join("\n\n"),
      },
      tr: {
        title: "Mesafeli Satış Sözleşmesi",
        body: [
          `## Taraflar\nBu sözleşme, ${COMPANY}, ${LOCATION} (satıcı) ile ronascorduene.com üzerinden sipariş veren müşteri arasında yapılır.`,
          `## Konu\nSiparişler bireysel teklifler olarak hazırlanır. Satıcı, sipariş kesinleşmeden önce stok, fiyat, uyum ve teslimatı teyit eder.`,
          `## Ödeme ve teslimat\nFiyatlar seçilen para biriminde gösterilir. Teslim süreleri siparişe göre teyit edilir; ürüne ve varış noktasına bağlıdır.`,
          `## Cayma hakkı\nYürürlükteki mevzuata göre, ürün kullanılmamış ve orijinal durumunda olmak kaydıyla, teslimden itibaren 14 gün içinde cayma hakkı kullanılabilir.`,
        ].join("\n\n"),
      },
      ku: {
        title: "Peymana Firotina Dûr",
        body: [
          `## Alî\nEv peyman di navbera ${COMPANY}, ${LOCATION} (firoşkar) û xerîdarê ku bi riya ronascorduene.com fermanê dide de tê çêkirin.`,
          `## Mijar\nFerman wek texmînên takekesî têne amadekirin. Firoşkar berî bicihanîna fermanê hebûn, biha, lihevhatin û şandinê piştrast dike.`,
          `## Dayîn û şandin\nBiha bi pereyê hatî hilbijartin têne nîşandan. Demên şandinê li gorî fermanê têne piştrast kirin.`,
          `## Mafê vekişînê\nLi gorî qanûnê, xerîdar dikare di nav 14 rojan de ji şandinê, ger hilber nehatibe bikaranîn, vekişe.`,
        ].join("\n\n"),
      },
      ar: {
        title: "عقد البيع عن بعد",
        body: [
          `## الأطراف\nيُعقد هذا العقد بين ${COMPANY}، ${LOCATION} (البائع) والعميل الذي يقدّم طلبًا عبر ronascorduene.com.`,
          `## الموضوع\nتُعدّ الطلبات كعروض أسعار فردية. ويؤكد البائع التوفر والسعر والتوافق والتسليم قبل إتمام الطلب.`,
          `## الدفع والتسليم\nتُعرض الأسعار بالعملة المختارة. ويُؤكَّد وقت التسليم لكل طلب بحسب المنتج والوجهة.`,
          `## حق الانسحاب\nحيث ينطبق، يحق للعميل الانسحاب خلال 14 يومًا من التسليم بشرط أن يكون المنتج غير مستخدم وبحالته الأصلية.`,
        ].join("\n\n"),
      },
    },
  },
  {
    key: "legal/pre-information",
    label: "Pre-Information Form",
    slug: "pre-information",
    docs: {
      en: {
        title: "Pre-Information Form",
        body: [
          `## Seller\n${COMPANY}, ${LOCATION}. Contact: ${EMAIL}.`,
          `## Product and price\nThe essential characteristics of the product, the total price and the delivery conditions are confirmed in the quotation sent before the order.`,
          `## Delivery\nThe delivery address and estimated delivery time are agreed per order. Import duties, where applicable, are the customer's responsibility.`,
          `## Complaints\nFor any complaint or question, contact ${EMAIL}.`,
        ].join("\n\n"),
      },
      tr: {
        title: "Ön Bilgilendirme Formu",
        body: [
          `## Satıcı\n${COMPANY}, ${LOCATION}. İletişim: ${EMAIL}.`,
          `## Ürün ve fiyat\nÜrünün temel özellikleri, toplam fiyat ve teslimat koşulları, sipariş öncesi gönderilen teklifte teyit edilir.`,
          `## Teslimat\nTeslimat adresi ve tahmini teslim süresi her sipariş için kararlaştırılır. Varsa ithalat vergileri müşteriye aittir.`,
          `## Şikâyetler\nHer türlü şikâyet veya soru için ${EMAIL} adresine başvurabilirsiniz.`,
        ].join("\n\n"),
      },
      ku: {
        title: "Forma Agahdariya Pêşîn",
        body: [
          `## Firoşkar\n${COMPANY}, ${LOCATION}. Têkilî: ${EMAIL}.`,
          `## Hilber û biha\nTaybetmendiyên bingehîn, bihaya giştî û mercên şandinê di texmîna berî fermanê de têne piştrast kirin.`,
          `## Şandin\nNavnîşana şandinê û dema texmînkirî ji bo her fermanê têne li hev kirin. Baca îthalatê, heke hebe, ya xerîdar e.`,
          `## Gilî\nJi bo her gilî an pirsê bi ${EMAIL} re têkilî daynin.`,
        ].join("\n\n"),
      },
      ar: {
        title: "نموذج المعلومات المسبقة",
        body: [
          `## البائع\n${COMPANY}، ${LOCATION}. التواصل: ${EMAIL}.`,
          `## المنتج والسعر\nتُؤكَّد الخصائص الجوهرية للمنتج والسعر الإجمالي وشروط التسليم في عرض السعر المُرسل قبل الطلب.`,
          `## التسليم\nيُتفَّق على عنوان التسليم ووقته التقديري لكل طلب. رسوم الاستيراد، إن وُجدت، على العميل.`,
          `## الشكاوى\nلأي شكوى أو استفسار تواصل معنا على ${EMAIL}.`,
        ].join("\n\n"),
      },
    },
  },
  {
    key: "legal/returns",
    label: "Returns & Cancellation",
    slug: "returns",
    docs: {
      en: {
        title: "Returns & Cancellation",
        body: [
          `## Right of withdrawal\nUnless the product is custom-made to your specification, you may cancel within 14 days of delivery. Custom and made-to-order parts are excluded.`,
          `## Returning an item\nContact ${EMAIL} before returning anything. Products must be unused, undamaged and in their original packaging.`,
          `## Refunds\nApproved returns are refunded with the original payment method. Return shipping may be the customer's responsibility.`,
          `## Faulty items\nIf a product arrives damaged or faulty, contact us with photos and we will repair, replace or refund it.`,
        ].join("\n\n"),
      },
      tr: {
        title: "İade ve İptal",
        body: [
          `## Cayma hakkı\nÜrün siparişinize özel üretilmediği sürece, teslimden itibaren 14 gün içinde iptal edebilirsiniz. Kişiye özel ve siparişe göre üretilen parçalar hariçtir.`,
          `## Ürün iadesi\nHerhangi bir iade öncesinde ${EMAIL} ile iletişime geçin. Ürünler kullanılmamış, hasarsız ve orijinal ambalajında olmalıdır.`,
          `## Geri ödeme\nOnaylanan iadeler, ödemenin yapıldığı yöntemle geri ödenir. İade kargo bedeli müşteriye ait olabilir.`,
          `## Ayıplı ürün\nÜrün hasarlı veya hatalı gelirse fotoğraflarla bize ulaşın; onarır, değiştirir veya ücretini iade ederiz.`,
        ].join("\n\n"),
      },
      ku: {
        title: "Vegerandin û Betalkirin",
        body: [
          `## Mafê vekişînê\nHeke hilber ji bo taybetmendiya we nehatibe çêkirin, hûn dikarin di nav 14 rojan de ji şandinê betal bikin. Parçeyên taybet têne derxistin.`,
          `## Vegerandina hilberê\nBerî vegerandinê bi ${EMAIL} re têkilî daynin. Hilber divê nehatibe bikaranîn, bi zirar nebe û di pakêta xwe ya orîjînal de be.`,
          `## Pereyê vegerê\nVegerandinên pejirandî bi rêbaza dayîna orîjînal têne vegerandin. Mesrefa veguhastinê dibe ya xerîdar be.`,
          `## Hilberên xerab\nHeke hilber xerab an kêmasiyek hat, bi wêneyan bi me re têkilî daynin; em wê rast bikin, biguhezînin an pere vegerînin.`,
        ].join("\n\n"),
      },
      ar: {
        title: "الإرجاع والإلغاء",
        body: [
          `## حق الانسحاب\nما لم يكن المنتج مصنوعًا حسب مواصفاتك، يحق لك الإلغاء خلال 14 يومًا من التسليم. وتُستثنى القطع المخصصة.`,
          `## إرجاع المنتج\nتواصل مع ${EMAIL} قبل إرجاع أي منتج. يجب أن يكون المنتج غير مستخدم وغير تالف وفي عبواته الأصلية.`,
          `## المبالغ المستردة\nتُرد المبالغ المعتمدة بوسيلة الدفع الأصلية. وقد تكون تكلفة إرجاع الشحن على العميل.`,
          `## المنتجات المعيبة\nإذا وصل المنتج تالفًا أو معيبًا، تواصل معنا مع صور وسنقوم بإصلاحه أو استبداله أو استرداد قيمته.`,
        ].join("\n\n"),
      },
    },
  },
];

async function seedPages() {
  const existing = new Set(
    (await prisma.page.findMany({ select: { key: true } })).map(
      (page) => page.key,
    ),
  );

  let created = 0;

  for (const page of CONTENT_PAGES) {
    if (existing.has(page.key)) continue;

    await prisma.page.create({
      data: {
        key: page.key,
        label: page.label,
        translations: {
          create: SEED_LOCALES.map((locale) => {
            const dict = DICTS[locale];
            const seo = page.seo(dict, locale);

            return {
              locale,
              title: seo.title,
              subtitle: seo.subtitle,
            };
          }),
        },
        sections: {
          create: page.sections.map((section, position) => ({
            key: section.key,
            type: section.type,
            position,
            image: section.image ?? "",
            href: section.href ?? "",
            translations: {
              create: SEED_LOCALES.map((locale) => {
                const text = section.text(DICTS[locale], locale);

                return {
                  locale,
                  eyebrow: text.eyebrow ?? "",
                  title: text.title ?? "",
                  body: text.body ?? "",
                  ctaLabel: text.ctaLabel ?? "",
                  items: text.items ?? [],
                };
              }),
            },
          })),
        },
      },
    });

    created += 1;
  }

  for (const legal of LEGAL_PAGES) {
    if (existing.has(legal.key)) continue;

    await prisma.page.create({
      data: {
        key: legal.key,
        label: legal.label,
        translations: {
          create: SEED_LOCALES.map((locale) => {
            const doc = legal.docs[locale];
            const firstParagraph = doc.body.split("\n\n")[0].replace(/^##\s*/, "");

            return {
              locale,
              title: doc.title,
              subtitle: firstParagraph.slice(0, 160),
              seoDescription: firstParagraph.slice(0, 160),
            };
          }),
        },
        sections: {
          create: [
            {
              key: "document",
              type: "legal-document",
              position: 0,
              translations: {
                create: SEED_LOCALES.map((locale) => ({
                  locale,
                  eyebrow: "LEGAL",
                  title: legal.docs[locale].title,
                  body: legal.docs[locale].body,
                })),
              },
            },
          ],
        },
      },
    });

    created += 1;
  }

  console.log(`Seeded ${created} CMS page(s).`);
}

async function main() {
  const passwordHash = await argon2.hash(ADMIN_PASSWORD);

  const admin = await prisma.user.upsert({
    where: { username: ADMIN_USERNAME },
    update: { passwordHash, role: Role.ADMIN },
    create: { username: ADMIN_USERNAME, passwordHash, role: Role.ADMIN },
    select: { id: true, username: true, role: true, createdAt: true },
  });

  console.log("Seeded admin user:", admin);

  await seedDemoPricing();
  await seedPages();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
