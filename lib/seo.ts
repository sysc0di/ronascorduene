import type { Metadata } from "next";

import {
  defaultLocale,
  localeTags,
  locales,
  ogLocales,
  type Locale,
} from "@/lib/i18n";
import type { LegalSlug } from "@/lib/legal";

/** Canonical origin. Override with NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ronascorduene.com"
).replace(/\/+$/, "");

export const SITE_NAME = "Ronas Corduene";

export const OG_IMAGE = "/og-image.png";
/** Brand mark at `/icon.png` (512x512, opaque) — the Organization logo needs
 *  a solid background so it stays visible on light surfaces. */
export const LOGO_IMAGE = "/icon.png";
export const OG_ALT = `${SITE_NAME} — performance parts and body kits`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const BUSINESS = {
  email: "info@ronascorduene.com",
  instagram: "https://www.instagram.com/ronas_corduene",
  locality: "Corduene",
  country: "TR",
} as const;

export type PageKey =
  | "home"
  | "about"
  | "store"
  | "contact"
  | "list";

type PageSeo = {
  /** Path after the locale segment, "" for the home page. */
  path: string;
  title: string;
  description: string;
};

type LocaleSeo = {
  keywords: string[];
  pages: Record<PageKey, PageSeo>;
};

/**
 * Localised, keyword-focused SEO copy for a performance & body-kit workshop
 * based in Turkey and serving the Middle East.
 */
export const SEO: Record<Locale, LocaleSeo> = {
  en: {
    keywords: [
      "performance parts",
      "body kits Middle East",
      "car tuning workshop",
      "carbon fiber aero",
      "cold air intake",
      "exhaust manifold",
      "forged wheels",
      "custom car parts",
      "Ronas Corduene",
    ],
    pages: {
      home: {
        path: "",
        title:
          "Ronas Corduene I Born in the Rough. Built to lead.",
        description:
          "Pure engineering, forged in its rugged origins and built to dominate the asphalt. Advanced aerodynamics channeling power with a flawless flow, uncompromising carbon fiber components, and boundary-pushing mechanical performance.",
      },
      about: {
        path: "/about",
        title: "About Ronas Corduene | Performance & Body Kit Workshop",
        description:
          " Discover the engineering, design and character behind every component we build.",
      },
      store: {
        path: "/store",
        title: "Store — Performance Parts & Body Kits | Ronas Corduene",
        description:
          "Browse the Ronas Corduene catalog: cold air intakes, exhaust manifolds, carbon fibre aero, body kits and forged wheels engineered for the road.",
      },
      contact: {
        path: "/contact",
        title: "Contact Ronas Corduene | Performance Workshop",
        description:
          "Get in touch with Ronas Corduene for performance parts, body kits and custom builds. ",
      },
      list: {
        path: "/list",
        title: "Your Cart | Ronas Corduene",
        description:
          "Build your cart and send it to Ronas Corduene. We confirm availability, fitment and delivery for performance parts and body kits.",
      },
    },
  },
  tr: {
    keywords: [
      "performans parçaları",
      "body kit Orta Doğu",
      "araç modifiye atölyesi",
      "karbon fiber aero",
      "soğuk hava emiş",
      "egzoz manifoldu",
      "dövme jant",
      "özel araç parçaları",
      "Ronas Corduene",
    ],
    pages: {
      home: {
        path: "",
        title:
          "Ronas Corduene | Zorlu koşullarda doğdu. Liderlik için üretildi.",
        description:
          "Zorlu doğasında şekillenen ve asfalta hükmeden saf mühendislik. Gücü kusursuz bir akışla yöneten üst düzey hava dinamiği, tavizsiz karbon fiber donanımlar ve sınırları aşan mekanik",
      },
      about: {
        path: "/about",
        title: "Ronas Corduene Hakkında | Performans ve Body Kit Atölyesi",
        description:
          "Ürettiğimiz her parçanın mühendisliğini ve tasarımını keşfedin.",
      },
      store: {
        path: "/store",
        title: "Mağaza — Performans Parçaları ve Body Kit | Ronas Corduene",
        description:
          "Ronas Corduene kataloğunu keşfedin: soğuk hava emişleri, egzoz manifoldları, karbon fiber aero, body kitler ve dövme jantlar.",
      },
      contact: {
        path: "/contact",
        title: "İletişim | Ronas Corduene ",
        description:
          "Performans parçaları, body kitler ve özel projeler için Ronas Corduene ile iletişime geçin.",
      },
      list: {
        path: "/list",
        title: "Sepetiniz | Ronas Corduene",
        description:
          "Sepetinizi oluşturun ve Ronas Corduene'e gönderin. Stok, uyum ve teslimatı sizin için teyit ediyoruz.",
      },
    },
  },
  ku: {
    keywords: [
      "parçeyên performansê",
      "body kit Rojhilata Navîn",
      "atolyeya modîfîkasyonê",
      "aero karbonfayber",
      "kirina hewaya sar",
      "manîfolda derxistinê",
      "firseyên duristkirî",
      "parçeyên taybet",
      "Ronas Corduene",
    ],
    pages: {
      home: {
        path: "",
        title:
          "Ronas Corduene I Di dijwariyê de çêbû. Ji bo pêşengiyê hat avakirin.",
        description:
          "​Endezyariya xwerû, di koka xwe ya dijwar de hatiye şikilandin û ji bo serweriya li ser asfaltê hatiye avakirin. Aerodînamîka pêşketî ya ku hêzê bi herikînek bêkêmasî araste dike, pêkhateyên fîbera karbonê yên bêtawîz û performansa mekanîkî ya ku sînoran derbas dike.",
      },
      about: {
        path: "/about",
        title: "Derbarê Ronas Corduene | Atolyeya Performans û Body Kit",
        description:
          " Mîhendisî, sêwiran û karaktera her parçeyekê binêre.",
      },
      store: {
        path: "/store",
        title: "Dîkan — Parçeyên Performans û Body Kit | Ronas Corduene",
        description:
          "Kataloga Ronas Corduene binêre: kirina hewaya sar, manîfolda derxistinê, aero karbonfayber, body kit û firseyên duristkirî.",
      },
      contact: {
        path: "/contact",
        title: "Têkildarî | Atolyeya Performans",
        description:
          "Ji bo parçeyên performansê, body kit û projeyên taybet bi Ronas Corduene re têkiliyê daynin.",
      },
      list: {
        path: "/list",
        title: "Sepet | Ronas Corduene",
        description:
          "Sepeta xwe ava bikin û ji Ronas Corduene re bişînin. Em hebûn, uyandin û şandinê ji bo we piştrast dikin.",
      },
    },
  },
  ar: {
    keywords: [
      "قطع أداء",
      "هياكل سيارات",
      "ورشة تعديل سيارات",
      "أيرو ألياف الكربون",
      "مدخل هواء بارد",
      "مجمع عادم",
      "جنوط مطروقة",
      "قطع سيارات مخصصة",
      "روناس كوردوين",
    ],
    pages: {
      home: {
        path: "",
        title: "Ronas Corduene | وُلد في الصعاب. صُنع للقيادة.",
        description:
          "هندسة خالصة، صِيغت في أصولها القاسية وبُنيت لتهيمن على الأسفلت. ديناميكية هوائية متقدمة توجه القوة بتدفق مثالي، مكونات من ألياف الكربون لا تقبل المساومة، وأداء ميكانيكي يتجاوز الحدود.",
      },
      about: {
        path: "/about",
        title: "من نحن | روناس كوردوين",
        description:
          "تعرّف على الهندسة والتصميم والشخصية خلف كل قطعة نصنعها في روناس كوردوين.",
      },
      store: {
        path: "/store",
        title: "المتجر — قطع الأداء وهياكل السيارات | روناس كوردوين",
        description:
          "تصفّح كتالوج روناس كوردوين: مداخل هواء باردة، مجمعات عادم، أيرو من ألياف الكربون، هياكل سيارات وجنوط مطروقة مصممة للأداء.",
      },
      contact: {
        path: "/contact",
        title: "اتصل بنا | روناس كوردوين",
        description:
          "تواصل مع روناس كوردوين للاستفسار عن قطع الأداء وهياكل السيارات والتعديلات المخصصة.",
      },
      list: {
        path: "/list",
        title: "قائمة قطعك | روناس كوردوين",
        description:
          "أنشئ قائمة قطعك وأرسلها إلى روناس كوردوين لتأكيد التوفر والتوافق وتفاصيل التسليم.",
      },
    },
  },
};

export function getPageSeo(locale: Locale, page: PageKey): PageSeo {
  return SEO[locale].pages[page];
}

/**
 * Meta descriptions are truncated by the search results, and a CMS field that
 * holds a whole paragraph would otherwise be published in full. Legal pages in
 * particular keep their entire document in `subtitle`, so this runs on every
 * description rather than trusting the editor to stay inside the limit.
 */
export function truncateDescription(value: string, max = 158): string {
  const text = value.replace(/\s+/g, " ").trim();

  if (text.length <= max) return text;

  const clipped = text.slice(0, max);
  const lastSpace = clipped.lastIndexOf(" ");

  return `${(lastSpace > max * 0.6 ? clipped.slice(0, lastSpace) : clipped).replace(/[,;:.\-–—]+$/, "")}…`;
}

/**
 * Per-locale SEO copy for the legal documents. Metadata is code-owned, so this
 * is the single source for each legal page's title and description; the CMS
 * only holds the document body. Nothing here adds a legal claim: each line
 * only says what the document is.
 */
const LEGAL_SEO: Record<
  Locale,
  Record<LegalSlug, { title: string; description: string }>
> = {
  en: {
    privacy: {
      title: "Privacy Policy | Ronas Corduene",
      description:
        "How Ronas Corduene collects, uses and protects personal data across this website, in line with Turkish data protection law.",
    },
    kvkk: {
      title: "KVKK Disclosure | Ronas Corduene",
      description:
        "Data controller identity, processing purposes and your rights under Turkish KVKK no. 6698, published by Ronas Corduene.",
    },
    cookies: {
      title: "Cookie Policy | Ronas Corduene",
      description:
        "Which cookies ronascorduene.com uses, what each one does and how to control them from your browser.",
    },
    terms: {
      title: "Terms of Use | Ronas Corduene",
      description:
        "The terms that apply when you browse ronascorduene.com, including acceptable use of the site and its content.",
    },
    "distance-sales": {
      title: "Distance Sales Agreement | Ronas Corduene",
      description:
        "The agreement accepted when an order is sent online, covering the seller, the buyer, the goods, payment and delivery.",
    },
    "pre-information": {
      title: "Pre-Information Form | Ronas Corduene",
      description:
        "The pre-contract information form shown before an online order, with the seller details, pricing and withdrawal rights.",
    },
    returns: {
      title: "Returns & Cancellation | Ronas Corduene",
      description:
        "How to return or cancel an order, the withdrawal period and the condition requirements for returned products.",
    },
  },
  tr: {
    privacy: {
      title: "Gizlilik Politikası | Ronas Corduene",
      description:
        "Ronas Corduene bu web sitesinde kişisel verileri nasıl toplar, kullanır ve korur: Türk veri koruma mevzuatına uygun bilgilendirme.",
    },
    kvkk: {
      title: "KVKK Aydınlatma Metni | Ronas Corduene",
      description:
        "Veri sorumlusu kimliği, işleme amaçları ve 6698 sayılı KVKK kapsamındaki haklarınız: Ronas Corduene aydınlatması.",
    },
    cookies: {
      title: "Çerez Politikası | Ronas Corduene",
      description:
        "ronascorduene.com hangi çerezleri kullanıyor, her birinin işlevi nedir ve tarayıcınızdan nasıl yönetilir.",
    },
    terms: {
      title: "Kullanım Koşulları | Ronas Corduene",
      description:
        "ronascorduene.com sitesini ziyaret ettiğinizde geçerli olan koşullar ve site içeriğinin kabul edilebilir kullanımı.",
    },
    "distance-sales": {
      title: "Mesafeli Satış Sözleşmesi | Ronas Corduene",
      description:
        "Sipariş online gönderildiğinde kabul edilen sözleşme: satıcı, alıcı, ürünler, ödeme ve teslimat.",
    },
    "pre-information": {
      title: "Ön Bilgilendirme Formu | Ronas Corduene",
      description:
        "Online sipariş öncesinde gösterilen sözleşme öncesi bilgilendirme formu: satıcı bilgileri, fiyatlandırma ve cayma hakları.",
    },
    returns: {
      title: "İade ve İptal | Ronas Corduene",
      description:
        "Siparişi nasıl iade edeceğiniz ve iptal edeceğiniz, cayma süresi ve iade edilen ürünler için koşul gereklilikleri.",
    },
  },
  ku: {
    privacy: {
      title: "Polîtîkaya Nepenîtiyê | Ronas Corduene",
      description:
        "Ronas Corduene diçe malikên kesî yê ronascorduene.com çawa bicihêye, çawa bişiklên dike û çawa diparêze.",
    },
    kvkk: {
      title: "Daxuyaniya KVKK | Ronas Corduene",
      description:
        "Navbername berpirsiyariya daneyan, armancên bicihêkirinê û mafên we di bin qanûna 6698 de Ronas Corduene.",
    },
    cookies: {
      title: "Polîtîkaya Kûkîyan | Ronas Corduene",
      description:
        "ronascorduene.com çi kûkî bişiklên dike, her yekî çi dike û çawa bi navberguzarê birêveberîn.",
    },
    terms: {
      title: "Mercên Bikaranînê | Ronas Corduene",
      description:
        "Di ser ronascorduene.com de biçûyî derbasdar Mercên Bikaranînê û çawa naverokê bişiklên.",
    },
    "distance-sales": {
      title: "Peymana Firotina Dûr | Ronas Corduene",
      description:
        "Peymana ku dibe qeydekirin siparişa werejîn: firoşkar, muşterî, mal, pere û şandin.",
    },
    "pre-information": {
      title: "Forma Agahdariya Pêşîn | Ronas Corduene",
      description:
        "Forma agahdariya berî pymanê ku berî firotina biçûyî tê nîşandan: agahiyên firoşkar, nirxandin û mafên vekişînê.",
    },
    returns: {
      title: "Vegerandin û Betalkirin | Ronas Corduene",
      description:
        "Çawa dikekorderê vegerinne an betal bike, demoka vekişînê û şertên hilberan ji bo malên vedigerîn.",
    },
  },
  ar: {
    privacy: {
      title: "سياسة الخصوصية | روناس كوردوين",
      description:
        "كيف تجمع روناس كوردوين البيانات الشخصية عبر هذا الموقع وتستخدمها وتحميها وفقاً لقوانين حماية البيانات التركية.",
    },
    kvkk: {
      title: "إفصاح KVKK | روناس كوردوين",
      description:
        "هوية المسؤول عن البيانات وأغراض المعالجة وحقوقك بموجب القانون土耳其 6698، صادر عن روناس كوردوين.",
    },
    cookies: {
      title: "سياسة ملفات تعريف الارتباط | روناس كوردوين",
      description:
        "ملفات تعريف الارتباط التي يستخدمها ronascorduene.com ووظيفة كل منها وكيفية التحكم بها من المتصفح.",
    },
    terms: {
      title: "شروط الاستخدام | روناس كوردوين",
      description:
        "الشروط التي تسري عند تصفحك ronascorduene.com، بما في ذلك الاستخدام المقبول للموقع ومحتواه.",
    },
    "distance-sales": {
      title: "عقد البيع عن بعد | روناس كوردوين",
      description:
        "الاتفاقية التي تُقبل عند إرسال الطلب عبر الإنترنت، وتشمل البائع والمشتري والبضائع والدفع والتسليم.",
    },
    "pre-information": {
      title: "نموذج المعلومات المسبقة | روناس كوردوين",
      description:
        "نموذج المعلومات السابقة للعقد المعروض قبل الطلب عبر الإنترنت، مع بيانات البائع والتسعير وحقوق الانسحاب.",
    },
    returns: {
      title: "الإرجاع والإلغاء | روناس كوردوين",
      description:
        "كيفية إرجاع طلب أو إلغائه، ومدة الانسحاب، وشروط المنتجات المُعادة.",
    },
  },
};

export function getLegalSeo(
  locale: Locale,
  slug: LegalSlug,
): { title: string; description: string } {
  return LEGAL_SEO[locale][slug];
}

/** `hreflang` map covering every locale plus `x-default`. */
export function alternateLanguages(path: string): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[locale] = `/${locale}${path}`;
  }

  languages["x-default"] = `/${defaultLocale}${path}`;

  return languages;
}

export function localizedPath(locale: Locale, path: string): string {
  return `/${locale}${path}`;
}

export function buildMetadata({
  locale,
  page,
  title,
  description,
  keywords = [],
  type = "website",
}: {
  locale: Locale;
  page: PageKey;
  title?: string;
  description?: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  const seo = SEO[locale].pages[page];
  const resolvedTitle = title ?? seo.title;
  const resolvedDescription = truncateDescription(description ?? seo.description);
  const url = localizedPath(locale, seo.path);

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: resolvedTitle },
    description: resolvedDescription,
    keywords: [...keywords, ...SEO[locale].keywords],
    applicationName: SITE_NAME,
    alternates: {
      canonical: url,
      languages: alternateLanguages(seo.path),
    },
    openGraph: {
      type,
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: SITE_NAME,
      locale: ogLocales[locale],
      alternateLocale: locales
        .filter((item) => item !== locale)
        .map((item) => ogLocales[item]),
      images: [
        {
          url: OG_IMAGE,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: OG_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [{ url: OG_IMAGE, alt: OG_ALT }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

/**
 * Metadata for a CMS-managed page: the title/description come from the
 * database, with an optional static fallback while the page is still empty.
 * `image` overrides the share image, which products pass as their own photo.
 */
export function buildContentMetadata({
  locale,
  path,
  title,
  description,
  image,
  fallbackPage,
}: {
  locale: Locale;
  path: string;
  title?: string;
  description?: string;
  image?: string;
  fallbackPage?: PageKey;
}): Metadata {
  const fallback = fallbackPage ? SEO[locale].pages[fallbackPage] : undefined;
  const resolvedTitle = title || fallback?.title || SITE_NAME;
  const resolvedDescription = truncateDescription(
    description || fallback?.description || "",
  );
  const url = localizedPath(locale, path);
  const shareImage = image || OG_IMAGE;

  /* Only the bundled OG image has known dimensions; a product photo does not. */
  const images = shareImage === OG_IMAGE
    ? [
        {
          url: OG_IMAGE,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: OG_ALT,
        },
      ]
    : [{ url: shareImage, alt: resolvedTitle }];

  /* Twitter gets the same image objects, so `twitter:image:alt` is never
     dropped even though the tag only renders url + alt. */
  const twitterImages = images.map(({ url, alt }) => ({ url, alt }));

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: resolvedTitle },
    description: resolvedDescription,
    keywords: SEO[locale].keywords,
    applicationName: SITE_NAME,
    alternates: {
      canonical: url,
      languages: alternateLanguages(path),
    },
    openGraph: {
      type: "website",
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: SITE_NAME,
      locale: ogLocales[locale],
      alternateLocale: locales
        .filter((item) => item !== locale)
        .map((item) => ogLocales[item]),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: twitterImages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

/** One step of a visible breadcrumb trail; the last one is the current page. */
export type BreadcrumbItem = {
  name: string;
  /** Locale-prefixed path, relative to the site root. */
  href: string;
};

/**
 * `BreadcrumbList` for the same trail the page renders visibly. Only the steps
 * that are real pages carry an `item` URL; the last one is the current page.
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

/** Schema.org graph for the workshop, served as JSON-LD. */
export function structuredData(locale: Locale) {
  const home = SEO[locale].pages.home;
  const businessId = `${SITE_URL}/#business`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["AutoRepair", "AutoPartsStore"],
        "@id": businessId,
        name: SITE_NAME,
        description: home.description,
        url: `${SITE_URL}/${locale}`,
        image: `${SITE_URL}${OG_IMAGE}`,
        logo: `${SITE_URL}${LOGO_IMAGE}`,
        email: BUSINESS.email,
        sameAs: [BUSINESS.instagram],
        address: {
          "@type": "PostalAddress",
          addressLocality: BUSINESS.locality,
          addressCountry: BUSINESS.country,
        },
        areaServed: [
          { "@type": "Country", name: "Turkey" },
          { "@type": "Country", name: "Iraq" },
          { "@type": "Country", name: "United Arab Emirates" },
          { "@type": "Country", name: "Saudi Arabia" },
          { "@type": "Country", name: "Qatar" },
          { "@type": "Country", name: "Kuwait" },
          { "@type": "Country", name: "Oman" },
          { "@type": "Country", name: "Bahrain" },
          { "@type": "Country", name: "Jordan" },
          { "@type": "Country", name: "Lebanon" },
        ],
        knowsLanguage: locales.map((item) => localeTags[item]),
        makesOffer: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Performance parts",
              description:
                "Cold air intakes, exhaust manifolds, intake piping and engine performance components.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Body kits and aero",
              description:
                "Carbon fibre hoods, spoilers, splitters, diffusers and complete body kits.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Wheels and interior",
              description:
                "Forged wheels, steering wheels, racing seats and interior trim.",
            },
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/${locale}`,
        name: SITE_NAME,
        inLanguage: localeTags[locale],
        publisher: { "@id": businessId },
      },
    ],
  };
}
