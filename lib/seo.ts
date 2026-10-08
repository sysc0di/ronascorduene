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
  email: "hello@ronascorduene.com",
  instagram: "https://www.instagram.com/ronascorduene",
  locality: "Corduene",
  country: "TR",
} as const;

export type PageKey =
  | "home"
  | "about"
  | "initiative"
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
      "performance parts Turkey",
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
          "Ronas Corduene — Performance Parts & Body Kits in Turkey & the Middle East",
        description:
          "Performance parts, carbon fibre aero and body kits engineered in Turkey and shipped across the Middle East. Air intakes, exhaust manifolds, forged wheels and styling built for the drive.",
      },
      about: {
        path: "/about",
        title: "About Ronas Corduene | Performance & Body Kit Workshop",
        description:
          "Ronas Corduene is a performance and body-kit workshop in Turkey serving the Middle East. Discover the engineering, design and character behind every component we build.",
      },
      store: {
        path: "/store",
        title: "Store — Performance Parts & Body Kits | Ronas Corduene",
        description:
          "Browse the Ronas Corduene catalog: cold air intakes, exhaust manifolds, carbon fibre aero, body kits and forged wheels engineered for the road.",
      },
      contact: {
        path: "/contact",
        title: "Contact Ronas Corduene | Performance Workshop in Turkey",
        description:
          "Get in touch with Ronas Corduene for performance parts, body kits and custom builds. Based in Turkey and serving the Middle East.",
      },
      list: {
        path: "/list",
        title: "Your Parts List | Ronas Corduene",
        description:
          "Build your parts list and send it to Ronas Corduene. We confirm availability, fitment and delivery for performance parts and body kits.",
      },
      initiative: {
        path: "/impact",
        title:
          "Our Initiative | Leftover Materials into Animal Mobility — Ronas Corduene",
        description:
          "Ronas Corduene turns production leftovers and material scraps into mobility equipment for stray animals — animal wheelchairs, mobility aids and custom support built with the same engineering as our performance parts.",
      },
    },
  },
  tr: {
    keywords: [
      "performans parçaları Türkiye",
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
          "Ronas Corduene — Türkiye ve Orta Doğu için Performans Parçaları ve Body Kit",
        description:
          "Türkiye'de üretilen performans parçaları, karbon fiber aero ve body kitler; Orta Doğu'ya sunulur. Hava emiş, egzoz manifoldu, dövme jant ve stil çözümleri.",
      },
      about: {
        path: "/about",
        title: "Ronas Corduene Hakkında | Performans ve Body Kit Atölyesi",
        description:
          "Ronas Corduene, Orta Doğu'ya hizmet veren Türkiye merkezli bir performans ve body kit atölyesidir. Ürettiğimiz her parçanın mühendisliğini ve tasarımını keşfedin.",
      },
      store: {
        path: "/store",
        title: "Mağaza — Performans Parçaları ve Body Kit | Ronas Corduene",
        description:
          "Ronas Corduene kataloğunu keşfedin: soğuk hava emişleri, egzoz manifoldları, karbon fiber aero, body kitler ve dövme jantlar.",
      },
      contact: {
        path: "/contact",
        title: "İletişim | Türkiye'de Performans Atölyesi",
        description:
          "Performans parçaları, body kitler ve özel projeler için Ronas Corduene ile iletişime geçin. Türkiye merkezli, Orta Doğu'ya hizmet verir.",
      },
      list: {
        path: "/list",
        title: "Parça Listeniz | Ronas Corduene",
        description:
          "Parça listenizi oluşturun ve Ronas Corduene'e gönderin. Stok, uyum ve teslimatı sizin için teyit ediyoruz.",
      },
      initiative: {
        path: "/impact",
        title:
          "İnisiyatifimiz | Üretim Artıklarından Hayvan Hareket Ekipmanı — Ronas Corduene",
        description:
          "Ronas Corduene üretim artıklarını ve malzeme kalıntılarını sokak hayvanları için hareket ekipmanına dönüştürür — performans parçalarımızla aynı mühendislikle üretilen hayvan tekerlekli sandalyeleri, hareket yardımcıları ve özel destekler.",
      },
    },
  },
  ku: {
    keywords: [
      "parçeyên performansê Tirkiye",
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
          "Ronas Corduene — Parçeyên Performansê û Body Kit ji bo Tirkiye û Rojhilata Navîn",
        description:
          "Parçeyên performansê, aero karbonfayber û body kitên li Tirkiyeyê têne çêkirin û ji Rojhilata Navîn re têne şandin. Kirina hewayê, manîfold, dirûv û firseyên duristkirî.",
      },
      about: {
        path: "/about",
        title: "Derbarê Ronas Corduene | Atolyeya Performans û Body Kit",
        description:
          "Ronas Corduene atolyeyeke performans û body kit a Tirkiyeyê ye ku ji Rojhilata Navîn re kar dike. Mîhendisî, sêwiran û karaktera her parçeyekê binêre.",
      },
      store: {
        path: "/store",
        title: "Dîkan — Parçeyên Performans û Body Kit | Ronas Corduene",
        description:
          "Kataloga Ronas Corduene binêre: kirina hewaya sar, manîfolda derxistinê, aero karbonfayber, body kit û firseyên duristkirî.",
      },
      contact: {
        path: "/contact",
        title: "Têkildarî | Atolyeya Performans li Tirkiyeyê",
        description:
          "Ji bo parçeyên performansê, body kit û projeyên taybet bi Ronas Corduene re têkiliyê daynin. Li Tirkiyeyê, ji Rojhilata Navîn re.",
      },
      list: {
        path: "/list",
        title: "Lîsta Parçeyên We | Ronas Corduene",
        description:
          "Lîsta parçeyên xwe ava bikin û ji Ronas Corduene re bişînin. Em hebûn, uyandin û şandinê ji bo we piştrast dikin.",
      },
      initiative: {
        path: "/impact",
        title:
          "Înîsyatîfa Me | Ji Bermayiyên Hilberînê bo Alavên Livîna Sewalan — Ronas Corduene",
        description:
          "Ronas Corduene bermayiyên hilberînê û qutikên madeyan vedigerîne alavên livînê ji bo sewalan — kursiyên çerx, alîkarên livînê û palpişta taybet, bi heman mîhendisiyê wekî parçeyên performansê têne çêkirin.",
      },
    },
  },
  ar: {
    keywords: [
      "قطع أداء تركيا",
      "هياكل سيارات الشرق الأوسط",
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
        title:
          "روناس كوردوين — قطع أداء وهياكل سيارات في تركيا والشرق الأوسط",
        description:
          "قطع أداء وأيرو من ألياف الكربون وهياكل سيارات مصممة في تركيا ومشحونة إلى الشرق الأوسط. مداخل هواء ومجمعات عادم وجنوط مطروقة وتصميمات مصنوعة للقيادة.",
      },
      about: {
        path: "/about",
        title: "من نحن | ورشة أداء وهياكل سيارات — روناس كوردوين",
        description:
          "روناس كوردوين ورشة أداء وهياكل سيارات في تركيا تخدم الشرق الأوسط. تعرّف على الهندسة والتصميم والشخصية خلف كل قطعة نصنعها.",
      },
      store: {
        path: "/store",
        title: "المتجر — قطع أداء وهياكل سيارات | روناس كوردوين",
        description:
          "تصفّح كتالوج روناس كوردوين: مداخل هواء باردة، مجمعات عادم، أيرو من ألياف الكربون، هياكل سيارات وجنوط مطروقة مصنوعة للطريق.",
      },
      contact: {
        path: "/contact",
        title: "اتصل بنا | ورشة أداء في تركيا — روناس كوردوين",
        description:
          "تواصل مع روناس كوردوين لقطع الأداء وهياكل السيارات والتعديلات المخصصة. مقرنا تركيا ونخدم الشرق الأوسط.",
      },
      list: {
        path: "/list",
        title: "قائمة قطعك | روناس كوردوين",
        description:
          "أنشئ قائمة قطعك وأرسلها إلى روناس كوردوين. نؤكد التوفر والتوافق والتسليم لقطع الأداء وهياكل السيارات.",
      },
      initiative: {
        path: "/impact",
        title:
          "مبادرتنا | من بقايا الإنتاج إلى معدات حركة الحيوانات — روناس كوردوين",
        description:
          "تحوّل روناس كوردوين بقايا الإنتاج وخُرَد المواد إلى معدات حركة للحيوانات الضالة — كراسي متحركة ومساعدات حركة ودعم مخصص بالهندسة نفسها التي نصنع بها قطع الأداء.",
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
 * Per-locale SEO copy for the legal documents. The CMS holds the document
 * itself, but its `seoTitle`/`seoDescription` fields are optional and currently
 * empty, so without these every legal page would publish the site name as its
 * title and no description at all. Nothing here adds a legal claim: each line
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
        "The agreement accepted when a parts list is sent online, covering the seller, the buyer, the goods, payment and delivery.",
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
        "Parça listesi online gönderildiğinde kabul edilen sözleşme: satıcı, alıcı, ürünler, ödeme ve teslimat.",
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
        "Peymana ku dibe qeydekirin lîsta parçeyên biçûyî werejîn: firoşkar, muşterî, mal, pere û şandin.",
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
        "الاتفاقية التي تُقبل عند إرسال قائمة قطع عبر الإنترنت، وتشمل البائع والمشتري والبضائع والدفع والتسليم.",
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
