import type { Locale } from "@/lib/i18n";

/**
 * Storefront page content, embedded in code.
 *
 * This file is the single source of truth for the copy that used to live in the
 * `pages`/`page_sections` tables and was edited in the admin panel. The database
 * is no longer read for pages; edit the values here and commit them. Each
 * translation carries an explicit `locale`; `getPage` in `lib/pages.ts` picks
 * the active locale and falls back to English.
 */

export type SectionItemData = {
  title: string;
  body: string;
  href: string;
};

type Localized<T> = T & { locale: Locale };

export type SectionText = {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  items: SectionItemData[];
};

export type PageText = {
  title: string;
  subtitle: string;
};

export type PageSectionData = {
  key: string;
  type: string;
  position: number;
  image: string;
  href: string;
  translations: Localized<SectionText>[];
};

export type PageData = {
  key: string;
  label: string;
  translations: Localized<PageText>[];
  sections: PageSectionData[];
};

export const PAGES: Record<string, PageData> = {
  "home": {
    "key": "home",
    "label": "Home",
    "translations": [
      {
        "locale": "en",
        "title": "Ronas Corduene — Performance Parts & Body Kits in Turkey & the Middle East",
        "subtitle": "Performance parts, carbon fibre aero and body kits engineered in Turkey and shipped across the Middle East. Air intakes, exhaust manifolds, forged wheels and styling built for the drive."
      },
      {
        "locale": "tr",
        "title": "Ronas Corduene — Türkiye ve Orta Doğu için Performans Parçaları ve Body Kit",
        "subtitle": "Türkiye'de üretilen performans parçaları, karbon fiber aero ve body kitler; Orta Doğu'ya sunulur. Hava emiş, egzoz manifoldu, dövme jant ve stil çözümleri."
      },
      {
        "locale": "ku",
        "title": "Ronas Corduene — Parçeyên Performansê û Body Kit ji bo Tirkiye û Rojhilata Navîn",
        "subtitle": "Parçeyên performansê, aero karbonfayber û body kitên li Tirkiyeyê têne çêkirin û ji Rojhilata Navîn re têne şandin. Kirina hewayê, manîfold, dirûv û firseyên duristkirî."
      },
      {
        "locale": "ar",
        "title": "روناس كوردوين — قطع أداء وهياكل سيارات في تركيا والشرق الأوسط",
        "subtitle": "قطع أداء وأيرو من ألياف الكربون وهياكل سيارات مصممة في تركيا ومشحونة إلى الشرق الأوسط. مداخل هواء ومجمعات عادم وجنوط مطروقة وتصميمات مصنوعة للقيادة."
      }
    ],
    "sections": [
      {
        "key": "hero",
        "type": "home-hero",
        "position": 0,
        "image": "/assets/homebannerimg.jpg",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "",
            "title": "",
            "body": "Born in the Rough. Built to Lead.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "tr",
            "eyebrow": "",
            "title": "",
            "body": "Zorlu koşullarda doğdu. Liderlik için üretildi.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ku",
            "eyebrow": "",
            "title": "",
            "body": "Di dijwariyê de çêbû. Ji bo pêşengiyê hat avakirin.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ar",
            "eyebrow": "",
            "title": "",
            "body": "وُلد في الصعاب. صُنع للقيادة.",
            "ctaLabel": "",
            "items": []
          }
        ]
      },
      {
        "key": "approach",
        "type": "home-approach",
        "position": 1,
        "image": "/assets/739d6f87-00fc-4c94-aa88-213a021c47a8.jpg",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "",
            "title": "Every Detail,\nA Purpose.",
            "body": "Every component is built on the same idea: precise engineering, purposeful form, and a character born of the road. Today we personalize driving with carbon fiber details; tomorrow we will shape the future with mid‑engine sports cars.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "tr",
            "eyebrow": "",
            "title": "Her Detay,\nBir Amaç.",
            "body": "Her bileşen aynı fikir üzerine kurulur: hassas mühendislik, amaçlı form ve yola ait karakter. Bugün karbon fiber detaylarla sürüşü kişiselleştiriyoruz; yarın ortadan motorlu şasi mimarisine sahip spor otomobillerle geleceği şekillendireceğiz.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ku",
            "eyebrow": "",
            "title": "Her Hûrgul,\nYek Armanc",
            "body": "Her parçeyek li ser heman fikir hate avakirin: mühendisiyê bi rastî, formê bi armanc û karaktera rê. Îro bi hûrguliyên karbonî ajotinê taybet dikin; sibê bi şasiyên nav‑motorî otombîlên sportî pêşerojê wê em şêkil bidin.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ar",
            "eyebrow": "",
            "title": "كل تفصيلة، هدف.",
            "body": "كل مكون مبني على نفس الفكرة: هندسة دقيقة، شكل هادف، وشخصية تنتمي إلى الطريق. اليوم نخصص تجربة القيادة بتفاصيل من ألياف الكربون؛ وغداً سنشكل المستقبل بسيارات رياضية بهيكل ومحرك وسطي",
            "ctaLabel": "",
            "items": []
          }
        ]
      }
    ]
  },
  "about": {
    "key": "about",
    "label": "About",
    "translations": [
      {
        "locale": "en",
        "title": "About Ronas Corduene | Performance & Body Kit Workshop",
        "subtitle": "Ronas Corduene is a performance and body-kit workshop in Turkey serving the Middle East. Discover the engineering, design and character behind every component we build."
      },
      {
        "locale": "tr",
        "title": "Ronas Corduene Hakkında | Performans ve Body Kit Atölyesi",
        "subtitle": "Ronas Corduene, Orta Doğu'ya hizmet veren Türkiye merkezli bir performans ve body kit atölyesidir. Ürettiğimiz her parçanın mühendisliğini ve tasarımını keşfedin."
      },
      {
        "locale": "ku",
        "title": "Derbarê Ronas Corduene | Atolyeya Performans û Body Kit",
        "subtitle": "Ronas Corduene atolyeyeke performans û body kit a Tirkiyeyê ye ku ji Rojhilata Navîn re kar dike. Mîhendisî, sêwiran û karaktera her parçeyekê binêre."
      },
      {
        "locale": "ar",
        "title": "من نحن | ورشة أداء وهياكل سيارات — روناس كوردوين",
        "subtitle": "روناس كوردوين ورشة أداء وهياكل سيارات في تركيا تخدم الشرق الأوسط. تعرّف على الهندسة والتصميم والشخصية خلف كل قطعة نصنعها."
      }
    ],
    "sections": [
      {
        "key": "hero",
        "type": "about-hero",
        "position": 0,
        "image": "",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "AUTOMOTIVE EQUIPMENT",
            "title": "Between Machine\nand Soul",
            "body": "RONAS CORDUENE manufactures carbon fiber body kits, aerodynamic spoilers, driver interface components, air intake and cooling ducts, brake cooling systems, intake and exhaust systems, and ITB (Individual Throttle Body) components. Our products are built on precise engineering, functional design, and performance‑driven character. In addition to current production, our future goal is to develop a mid‑engine chassis sports car.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "tr",
            "eyebrow": "OTOMOTİV EKİPMANLARI",
            "title": "Makine ile Ruh\nArasında.",
            "body": "RONAS CORDUENE; karbon fiber body kit, aerodinamik spoiler, sürücü arayüzü bileşenleri, hava giriş ve soğutma kanalları, fren soğutma sistemleri, emme ve egzoz sistemleri ile ITB (Individual Throttle Body) parçaları üretmektedir. Ürünlerimiz hassas mühendislik, fonksiyonel tasarım ve performans odaklı karakter üzerine inşa edilmiştir. Mevcut üretimimizin yanı sıra, gelecekte ortadan motorlu şasi mimarisine sahip spor otomobil geliştirmeyi hedeflemekteyiz.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ku",
            "eyebrow": "EKÎPMANA OTOMOTÎVÊ",
            "title": "Di Navbera Makîne\nû Ruhê de",
            "body": "RONAS CORDUENE body kitên karbonî, spoilerên aerodinamîk, parçeyên arayûza ajotkar, kanalên têketina hewayê û kanalên sarbûna motora, sistemên sarbûna frenan, sistemên em û egzoz û parçeyên ITB (Throttle Body yên taybetî) çêdike. Berhemên me li ser mühendisiyê rast, dizayna karî û karaktera performans hate avakirin. Li ser hilberên niha, armanca me ew e ku otombîlên sportî yên bi şasiyên nav‑motorî pêşve bixin.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ar",
            "eyebrow": "معدات السيارات",
            "title": "بين الآلة والروح",
            "body": "روناس كوردوين تصنع مجموعات هيكل من ألياف الكربون، المفسدات الهوائية، مكونات واجهة السائق، قنوات سحب الهواء والتبريد، أنظمة تبريد الفرامل، أنظمة السحب والعادم، وأجزاء ITB (خنق فردي). منتجاتنا مبنية على هندسة دقيقة، تصميم وظيفي وشخصية قائمة على الأداء. بالإضافة إلى الإنتاج الحالي، هدفنا المستقبلي هو تطوير سيارة رياضية بهيكل ومحرك وسطي.",
            "ctaLabel": "",
            "items": []
          }
        ]
      },
      {
        "key": "story",
        "type": "about-story",
        "position": 1,
        "image": "",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "",
            "title": "An Ancient Philosophy",
            "body": "The fierce nature and rugged geography of Corduene inspire RONAS CORDUENE’s design and engineering approach. Each component is developed with a philosophy where function defines form; built upon simplicity, precision, and performance.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "tr",
            "eyebrow": "",
            "title": "Kadim Bir Felsefe.",
            "body": "Corduene’nin hırçın doğası ve sert coğrafyası, RONAS CORDUENE’nin tasarım ve mühendislik yaklaşımına ilham verir. Her bileşen, işlevin formu belirlediği bir anlayışla geliştirilir; sadelik, hassasiyet ve performans odaklıdır.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ku",
            "eyebrow": "",
            "title": "Felsefeyek Kadîm",
            "body": "Xuyabûna hırçîn û coğrafyayê sert a Corduene ilhamê dide dizayn û mühendisiyê RONAS CORDUENE. Her parçeyek bi felsefeyek tê pêşve xistin ku işlev formê diyar dike; li ser sadebûn, rastî û performans hate avakirin.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ar",
            "eyebrow": "",
            "title": "فلسفة قديمة",
            "body": "الطبيعة العاصفة والجغرافيا القاسية لكوردوين تلهم نهج روناس كوردوين في التصميم والهندسة. كل مكوّن يُطوَّر وفق فلسفة حيث الوظيفة تحدد الشكل؛ قائم على البساطة والدقة والأداء.",
            "ctaLabel": "",
            "items": []
          }
        ]
      },
      {
        "key": "values",
        "type": "about-values",
        "position": 2,
        "image": "",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "",
            "title": "",
            "body": "",
            "ctaLabel": "",
            "items": [
              {
                "title": "DESIGN",
                "body": "Surfaces that reflect the sharp lines and resilient structure of Corduene’s fierce nature. Carbon fiber body kits and aerodynamic spoilers integrate seamlessly with the vehicle’s identity.",
                "href": ""
              },
              {
                "title": "ENGINEERING",
                "body": "Systems developed with durability and precision born from harsh conditions. Air intakes, cooling channels, brake cooling solutions, intake–exhaust systems, and ITB components are built on functionality and engineering accuracy.",
                "href": ""
              },
              {
                "title": "CHARACTER",
                "body": "Corduene’s untamed essence enhances performance while preserving the vehicle’s original identity. Each component deepens the bond between driver and road; not an addition, but a natural part of the whole.",
                "href": ""
              }
            ]
          },
          {
            "locale": "tr",
            "eyebrow": "",
            "title": "",
            "body": "",
            "ctaLabel": "",
            "items": [
              {
                "title": "TASARIM",
                "body": "Hırçın coğrafyanın keskin hatlarını ve güçlü yapısını yansıtan yüzeyler. Karbon fiber body kitler ve aerodinamik spoilerler, aracın kimliğine doğal uyum sağlar.",
                "href": ""
              },
              {
                "title": "MÜHENDİSLİK",
                "body": "Sert doğadan doğan dayanıklılık ve hassasiyet anlayışıyla geliştirilen sistemler. Hava giriş ve soğutma kanalları, fren soğutma çözümleri, emme–egzoz sistemleri ve ITB parçaları; fonksiyonellik ve mühendislik doğruluğu üzerine kuruludur.",
                "href": ""
              },
              {
                "title": "KARAKTER",
                "body": "Corduene’nin hırçın yapısı, aracın özgün kimliğini koruyarak performansını artırır. Her ekipman, sürücü ile yol arasındaki bağı derinleştirir; sadece eklenmiş değil, doğal bir bütünün parçası gibi hissedilir.",
                "href": ""
              }
            ]
          },
          {
            "locale": "ku",
            "eyebrow": "",
            "title": "",
            "body": "",
            "ctaLabel": "",
            "items": [
              {
                "title": "DÎZAN",
                "body": "Sathên ku xêzên tîr û çarçoveya hêzdar a xuyabûna hırçîn a Corduene nîşan dide. Body kitên karbonî û spoilerên aerodynamîk bi nasnameya araban re bi awayekî xweş têkildar dibin.",
                "href": ""
              },
              {
                "title": "ENJÎNERYA",
                "body": "Sîstemên ku bi têkildariya ji şertên dijwar hatine pêşve xistin, bi rastî û bi hûrgulî. Kanalan hûra, kanalan sarbûnê, çareseriyên sarbûna frenan, sîstemên emme–egzoz û parçeyên ITB li ser fonksiyon û rastiya enjîneryê hate avakirin.",
                "href": ""
              },
              {
                "title": "KARAKTER",
                "body": "Xuyabûna hırçîn a Corduene performansê zêde dike lê nasnameya orjînal a araban diparêze. Her parçeyek girêdana ajoker û rê derindtir dike; ne zêdekirin, lê beşekî xweş a tevahî ye.",
                "href": ""
              }
            ]
          },
          {
            "locale": "ar",
            "eyebrow": "",
            "title": "",
            "body": "",
            "ctaLabel": "",
            "items": [
              {
                "title": "التصميم",
                "body": "أسطح تعكس الخطوط الحادة والبنية القوية لطبيعة كوردوين العاصفة. أطقم الهيكل من ألياف الكربون والسبويلر الهوائي تندمج بسلاسة مع هوية السيارة.",
                "href": ""
              },
              {
                "title": "الهندسة",
                "body": "أنظمة طُوِّرت بمتانة ودقة وُلدت من الظروف القاسية. مداخل الهواء، قنوات التبريد، حلول تبريد المكابح، أنظمة السحب والعادم، ومكوّنات ITB قائمة على الوظيفة والدقة الهندسية.",
                "href": ""
              },
              {
                "title": "الشخصية",
                "body": "جوهر كوردوين العاصف يعزز الأداء مع الحفاظ على الهوية الأصلية للمركبة. كل مكوّن يعمّق الرابط بين السائق والطريق؛ ليس إضافة، بل جزء طبيعي من الكل.",
                "href": ""
              }
            ]
          }
        ]
      },
      {
        "key": "image",
        "type": "about-image",
        "position": 3,
        "image": "https://res.cloudinary.com/oicho8mb/image/upload/v1791551079/ronas-admin/content/file_ogcs2k.png",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "",
            "title": "RONAS CORDUENE AUTOMOTİVE",
            "body": "Born in the Rough. Built to Lead.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "tr",
            "eyebrow": "",
            "title": "RONAS CORDUENE AUTOMOTİVE",
            "body": "Born in the Rough. Built to Lead.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ku",
            "eyebrow": "",
            "title": "RONAS CORDUENE AUTOMOTİVE",
            "body": "Born in the Rough. Built to Lead.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ar",
            "eyebrow": "",
            "title": "RONAS CORDUENE AUTOMOTİVE",
            "body": "Born in the Rough. Built to Lead.",
            "ctaLabel": "",
            "items": []
          }
        ]
      }
    ]
  },
  "contact": {
    "key": "contact",
    "label": "Contact",
    "translations": [
      {
        "locale": "en",
        "title": "Contact Ronas Corduene | Performance Workshop in Turkey",
        "subtitle": "Get in touch with Ronas Corduene for performance parts, body kits and custom builds. Based in Turkey and serving the Middle East."
      },
      {
        "locale": "tr",
        "title": "İletişim | Türkiye'de Performans Atölyesi",
        "subtitle": "Performans parçaları, body kitler ve özel projeler için Ronas Corduene ile iletişime geçin. Türkiye merkezli, Orta Doğu'ya hizmet verir."
      },
      {
        "locale": "ku",
        "title": "Têkildarî | Atolyeya Performans li Tirkiyeyê",
        "subtitle": "Ji bo parçeyên performansê, body kit û projeyên taybet bi Ronas Corduene re têkiliyê daynin. Li Tirkiyeyê, ji Rojhilata Navîn re."
      },
      {
        "locale": "ar",
        "title": "اتصل بنا | ورشة أداء في تركيا — روناس كوردوين",
        "subtitle": "تواصل مع روناس كوردوين لقطع الأداء وهياكل السيارات والتعديلات المخصصة. مقرنا تركيا ونخدم الشرق الأوسط."
      }
    ],
    "sections": [
      {
        "key": "hero",
        "type": "contact-hero",
        "position": 0,
        "image": "",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "TIME TO DOMINATE THE ASPHALT",
            "title": "UNLEASH\nTHE POWER.",
            "body": "Have a project that rejects the ordinary and redefines performance? We are here to merge pure power with flawless design. Share your vision with us, and let's push the boundaries together.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "tr",
            "eyebrow": "ASFALTA HÜKMETME VAKTİ",
            "title": "GÜCÜ\nSERBEST BIRAKIN.",
            "body": "Sıradanlığı reddeden, performansı yeniden tanımlayan bir projeniz mi var? Saf gücü kusursuz bir tasarımla buluşturmak için buradayız. Fikrinizi bizimle paylaşın, sınırları birlikte aşalım.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ku",
            "eyebrow": "DEMA SERWERIYA ASFALTÊ YE",
            "title": "HÊZÊ\nAZAD BIKIN.",
            "body": "Projeyeke we heye ku ji asayîbûnê re dibêje na û performansê ji nû ve pênase dike? Em li vir in da ku hêza xwerû bi sêwiraneke bêkêmasî re bikin yek. Fikra xwe bi me re parve bikin, em bi hev re sînoran derbas bikin.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ar",
            "eyebrow": "حان وقت الهيمنة على الأسفلت",
            "title": "أطلق العنان للقوة",
            "body": "هل لديك مشروع يرفض المألوف ويعيد تعريف الأداء؟ نحن هنا لدمج القوة الخالصة مع التصميم المثالي. شاركنا فكرتك، ولنتجاوز الحدود معاً",
            "ctaLabel": "",
            "items": []
          }
        ]
      },
      {
        "key": "info",
        "type": "contact-info",
        "position": 1,
        "image": "",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "",
            "title": "",
            "body": "",
            "ctaLabel": "",
            "items": [
              {
                "title": "EMAIL",
                "body": "info@ronascorduene.com",
                "href": "mailto:info@ronascorduene.com"
              },
              {
                "title": "LOCATION",
                "body": "VAN / TURKIYE",
                "href": ""
              },
              {
                "title": "INSTAGRAM",
                "body": "@RONASCORDUENE",
                "href": "https://instagram.com/ronas_corduene"
              }
            ]
          },
          {
            "locale": "tr",
            "eyebrow": "",
            "title": "",
            "body": "",
            "ctaLabel": "",
            "items": [
              {
                "title": "E-POSTA",
                "body": "İnfo@ronascorduene.com",
                "href": "mailto:info@ronascorduene.com"
              },
              {
                "title": "KONUM",
                "body": "VAN / TÜRKİYE",
                "href": ""
              },
              {
                "title": "INSTAGRAM",
                "body": "@RONASCORDUENE",
                "href": "https://instagram.com/ronas_corduene"
              }
            ]
          },
          {
            "locale": "ku",
            "eyebrow": "",
            "title": "",
            "body": "",
            "ctaLabel": "",
            "items": [
              {
                "title": "E-POSTA",
                "body": "info@ronascorduene.com",
                "href": "mailto:info@ronascorduene.com"
              },
              {
                "title": "TEWAND",
                "body": "WAN / TIRKIYE",
                "href": ""
              },
              {
                "title": "INSTAGRAM",
                "body": "@ronascorduene",
                "href": "https://instagram.com/ronas_corduene"
              }
            ]
          },
          {
            "locale": "ar",
            "eyebrow": "",
            "title": "",
            "body": "",
            "ctaLabel": "",
            "items": [
              {
                "title": "البريد الإلكتروني",
                "body": "hello@ronascorduene.com",
                "href": "mailto:hello@ronascorduene.com"
              },
              {
                "title": "الموقع",
                "body": "كوردوين / تركيا",
                "href": ""
              },
              {
                "title": "إنستغرام",
                "body": "@RONASCORDUENE",
                "href": "https://instagram.com/ronas_corduene"
              }
            ]
          }
        ]
      },
      {
        "key": "form",
        "type": "contact-form",
        "position": 2,
        "image": "",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "",
            "title": "",
            "body": "",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "tr",
            "eyebrow": "",
            "title": "",
            "body": "",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ku",
            "eyebrow": "",
            "title": "",
            "body": "",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ar",
            "eyebrow": "",
            "title": "",
            "body": "",
            "ctaLabel": "",
            "items": []
          }
        ]
      }
    ]
  },
  "legal/cookies": {
    "key": "legal/cookies",
    "label": "Cookie Policy",
    "translations": [
      {
        "locale": "en",
        "title": "Cookie Policy",
        "subtitle": "What cookies are\nCookies are small text files stored by your browser. We use them to remember your language and to keep the site working correctly."
      },
      {
        "locale": "tr",
        "title": "Çerez Politikası",
        "subtitle": "Çerez nedir\nÇerezler tarayıcınız tarafından saklanan küçük metin dosyalarıdır. Dilinizi hatırlamak ve sitenin doğru çalışmasını sağlamak için kullanırız."
      },
      {
        "locale": "ku",
        "title": "Polîtîkaya Kûkîyan",
        "subtitle": "Kûkî çi ne\nKûkî pelên piçûk in ku geroka we diparêze. Em wan bikar tînin da ku zimanê we bi bîr bînin û malper baş bixebite."
      },
      {
        "locale": "ar",
        "title": "سياسة ملفات تعريف الارتباط",
        "subtitle": "ما هي ملفات تعريف الارتباط\nهي ملفات نصية صغيرة يخزّنها متصفحك. نستخدمها لتذكّر لغتك ولضمان عمل الموقع بشكل صحيح."
      }
    ],
    "sections": [
      {
        "key": "document",
        "type": "legal-document",
        "position": 0,
        "image": "",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "LEGAL",
            "title": "Cookie Policy",
            "body": "## What cookies are\nCookies are small text files stored by your browser. We use them to remember your language and to keep the site working correctly.\n\n## What we use\n- Essential cookies: language selection and session security.\n- Analytics cookies: only where enabled, to understand how the site is used.\n\n## Managing cookies\nYou can block or delete cookies in your browser settings. Essential cookies are required for the site to function.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "tr",
            "eyebrow": "LEGAL",
            "title": "Çerez Politikası",
            "body": "## Çerez nedir\nÇerezler tarayıcınız tarafından saklanan küçük metin dosyalarıdır. Dilinizi hatırlamak ve sitenin doğru çalışmasını sağlamak için kullanırız.\n\n## Neler kullanıyoruz\n- Zorunlu çerezler: dil seçimi ve oturum güvenliği.\n- Analiz çerezleri: yalnızca etkin olduğunda, site kullanımını anlamak için.\n\n## Çerezleri yönetme\nTarayıcı ayarlarınızdan çerezleri engelleyebilir veya silebilirsiniz. Zorunlu çerezler sitenin çalışması için gereklidir.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ku",
            "eyebrow": "LEGAL",
            "title": "Polîtîkaya Kûkîyan",
            "body": "## Kûkî çi ne\nKûkî pelên piçûk in ku geroka we diparêze. Em wan bikar tînin da ku zimanê we bi bîr bînin û malper baş bixebite.\n\n## Em çi bi kar tînin\n- Kûkîyên pêwîst: hilbijartina ziman û ewlehiya danişînê.\n- Kûkîyên analîzê: tenê dema çalak be, ji bo fêmkirina bikaranîna malperê.\n\n## Rêvebirina kûkîyan\nHûn dikarin di mîhengên geroka xwe de kûkîyan asteng bikin an jêbirin. Kûkîyên pêwîst ji bo xebata malperê pêwîst in.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ar",
            "eyebrow": "LEGAL",
            "title": "سياسة ملفات تعريف الارتباط",
            "body": "## ما هي ملفات تعريف الارتباط\nهي ملفات نصية صغيرة يخزّنها متصفحك. نستخدمها لتذكّر لغتك ولضمان عمل الموقع بشكل صحيح.\n\n## ما الذي نستخدمه\n- ملفات ضرورية: اختيار اللغة وأمان الجلسة.\n- ملفات تحليلية: فقط عند تفعيلها، لفهم كيفية استخدام الموقع.\n\n## إدارة الملفات\nيمكنك حظر الملفات أو حذفها من إعدادات المتصفح. الملفات الضرورية مطلوبة لعمل الموقع.",
            "ctaLabel": "",
            "items": []
          }
        ]
      }
    ]
  },
  "legal/distance-sales": {
    "key": "legal/distance-sales",
    "label": "Distance Sales Agreement",
    "translations": [
      {
        "locale": "en",
        "title": "Distance Sales Agreement",
        "subtitle": "Parties\nThis agreement is made between Ronas Corduene, Corduene / Turkey (the seller) and the customer who places an order through ronascorduene.com."
      },
      {
        "locale": "tr",
        "title": "Mesafeli Satış Sözleşmesi",
        "subtitle": "Taraflar\nBu sözleşme, Ronas Corduene, Corduene / Turkey (satıcı) ile ronascorduene.com üzerinden sipariş veren müşteri arasında yapılır."
      },
      {
        "locale": "ku",
        "title": "Peymana Firotina Dûr",
        "subtitle": "Alî\nEv peyman di navbera Ronas Corduene, Corduene / Turkey (firoşkar) û xerîdarê ku bi riya ronascorduene.com fermanê dide de tê çêkirin."
      },
      {
        "locale": "ar",
        "title": "عقد البيع عن بعد",
        "subtitle": "الأطراف\nيُعقد هذا العقد بين Ronas Corduene، Corduene / Turkey (البائع) والعميل الذي يقدّم طلبًا عبر ronascorduene.com."
      }
    ],
    "sections": [
      {
        "key": "document",
        "type": "legal-document",
        "position": 0,
        "image": "",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "LEGAL",
            "title": "Distance Sales Agreement",
            "body": "## Parties\nThis agreement is made between Ronas Corduene, Corduene / Turkey (the seller) and the customer who places an order through ronascorduene.com.\n\n## Subject\nOrders are prepared as individual quotations. The seller confirms availability, price, fitment and delivery before the order is finalised.\n\n## Payment and delivery\nPrices are shown in the selected currency. Delivery times are confirmed per order and depend on the product and destination.\n\n## Right of withdrawal\nWhere applicable, the customer may withdraw within 14 days of delivery, provided the product is unused and in its original condition.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "tr",
            "eyebrow": "LEGAL",
            "title": "Mesafeli Satış Sözleşmesi",
            "body": "## Taraflar\nBu sözleşme, Ronas Corduene, Corduene / Turkey (satıcı) ile ronascorduene.com üzerinden sipariş veren müşteri arasında yapılır.\n\n## Konu\nSiparişler bireysel teklifler olarak hazırlanır. Satıcı, sipariş kesinleşmeden önce stok, fiyat, uyum ve teslimatı teyit eder.\n\n## Ödeme ve teslimat\nFiyatlar seçilen para biriminde gösterilir. Teslim süreleri siparişe göre teyit edilir; ürüne ve varış noktasına bağlıdır.\n\n## Cayma hakkı\nYürürlükteki mevzuata göre, ürün kullanılmamış ve orijinal durumunda olmak kaydıyla, teslimden itibaren 14 gün içinde cayma hakkı kullanılabilir.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ku",
            "eyebrow": "LEGAL",
            "title": "Peymana Firotina Dûr",
            "body": "## Alî\nEv peyman di navbera Ronas Corduene, Corduene / Turkey (firoşkar) û xerîdarê ku bi riya ronascorduene.com fermanê dide de tê çêkirin.\n\n## Mijar\nFerman wek texmînên takekesî têne amadekirin. Firoşkar berî bicihanîna fermanê hebûn, biha, lihevhatin û şandinê piştrast dike.\n\n## Dayîn û şandin\nBiha bi pereyê hatî hilbijartin têne nîşandan. Demên şandinê li gorî fermanê têne piştrast kirin.\n\n## Mafê vekişînê\nLi gorî qanûnê, xerîdar dikare di nav 14 rojan de ji şandinê, ger hilber nehatibe bikaranîn, vekişe.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ar",
            "eyebrow": "LEGAL",
            "title": "عقد البيع عن بعد",
            "body": "## الأطراف\nيُعقد هذا العقد بين Ronas Corduene، Corduene / Turkey (البائع) والعميل الذي يقدّم طلبًا عبر ronascorduene.com.\n\n## الموضوع\nتُعدّ الطلبات كعروض أسعار فردية. ويؤكد البائع التوفر والسعر والتوافق والتسليم قبل إتمام الطلب.\n\n## الدفع والتسليم\nتُعرض الأسعار بالعملة المختارة. ويُؤكَّد وقت التسليم لكل طلب بحسب المنتج والوجهة.\n\n## حق الانسحاب\nحيث ينطبق، يحق للعميل الانسحاب خلال 14 يومًا من التسليم بشرط أن يكون المنتج غير مستخدم وبحالته الأصلية.",
            "ctaLabel": "",
            "items": []
          }
        ]
      }
    ]
  },
  "legal/kvkk": {
    "key": "legal/kvkk",
    "label": "KVKK",
    "translations": [
      {
        "locale": "en",
        "title": "KVKK Disclosure",
        "subtitle": "Data controller\nUnder Turkish Law No. 6698 on the Protection of Personal Data (KVKK), the data controller is Ronas Corduene, Corduene / Turkey."
      },
      {
        "locale": "tr",
        "title": "KVKK Aydınlatma Metni",
        "subtitle": "Veri sorumlusu\n6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu Ronas Corduene, Corduene / Turkey adresindedir."
      },
      {
        "locale": "ku",
        "title": "Daxuyaniya KVKK",
        "subtitle": "Berpirsiyarê daneyan\nLi gorî Zagona Tirkiyeyê ya jimare 6698 (KVKK), berpirsiyarê daneyan Ronas Corduene, Corduene / Turkey e."
      },
      {
        "locale": "ar",
        "title": "إفصاح KVKK",
        "subtitle": "المسؤول عن البيانات\nبموجب القانون التركي رقم 6698 لحماية البيانات الشخصية (KVKK)، فإن المسؤول عن البيانات هو Ronas Corduene، Corduene / Turkey."
      }
    ],
    "sections": [
      {
        "key": "document",
        "type": "legal-document",
        "position": 0,
        "image": "",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "LEGAL",
            "title": "KVKK Disclosure",
            "body": "## Data controller\nUnder Turkish Law No. 6698 on the Protection of Personal Data (KVKK), the data controller is Ronas Corduene, Corduene / Turkey.\n\n## Purpose of processing\nPersonal data collected through this website is processed to respond to requests, prepare quotations, process orders and meet legal obligations.\n\n## Transfer\nData may be shared with service providers that host our website and process payments, only as far as required to deliver our services.\n\n## Your rights\nYou may request information, correction or deletion of your data by contacting hello@ronascorduene.com.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "tr",
            "eyebrow": "LEGAL",
            "title": "KVKK Aydınlatma Metni",
            "body": "## Veri sorumlusu\n6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu Ronas Corduene, Corduene / Turkey adresindedir.\n\n## İşleme amacı\nBu web sitesi üzerinden toplanan kişisel veriler; talepleri yanıtlamak, teklif hazırlamak, siparişleri işlemek ve yasal yükümlülükleri yerine getirmek amacıyla işlenir.\n\n## Aktarım\nVeriler, hizmetlerimizi sunmak için gerekli olduğu ölçüde, web sitemizi barındıran ve ödeme işleyen hizmet sağlayıcılarla paylaşılabilir.\n\n## Haklarınız\nhello@ronascorduene.com adresine başvurarak verileriniz hakkında bilgi, düzeltme veya silme talep edebilirsiniz.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ku",
            "eyebrow": "LEGAL",
            "title": "Daxuyaniya KVKK",
            "body": "## Berpirsiyarê daneyan\nLi gorî Zagona Tirkiyeyê ya jimare 6698 (KVKK), berpirsiyarê daneyan Ronas Corduene, Corduene / Turkey e.\n\n## Armanca pêvajoyê\nDaneyên kesane yên ku bi vê malperê têne kom kirin ji bo bersivdana daxwazan, amadekirina texmînan, pêvajoya fermanan û bicihanîna berpirsiyariyên qanûnî têne pêvajokirin.\n\n## Veguhestin\nDaneyên bi qasî ku ji bo pêşkêşkirina xizmetan pêwîst e, dikarin bi pêşkêşkerên ku malpera me dihêlin re bêne parve kirin.\n\n## Mafên we\nHûn dikarin bi têkiliya hello@ronascorduene.com agahdarî, rastkirin an jêbirina daneyên xwe daxwaz bikin.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ar",
            "eyebrow": "LEGAL",
            "title": "إفصاح KVKK",
            "body": "## المسؤول عن البيانات\nبموجب القانون التركي رقم 6698 لحماية البيانات الشخصية (KVKK)، فإن المسؤول عن البيانات هو Ronas Corduene، Corduene / Turkey.\n\n## الغرض من المعالجة\nتتم معالجة البيانات الشخصية التي تُجمع عبر هذا الموقع للرد على الطلبات وإعداد العروض ومعالجة الطلبات والوفاء بالالتزامات القانونية.\n\n## المشاركة\nقد تُشارك البيانات مع مزوّدي الخدمات الذين يستضيفون موقعنا ومعالجي الدفع، بالقدر اللازم لتقديم خدماتنا فقط.\n\n## حقوقك\nيمكنك طلب المعلومات أو التصحيح أو الحذف عبر مراسلتنا على hello@ronascorduene.com.",
            "ctaLabel": "",
            "items": []
          }
        ]
      }
    ]
  },
  "legal/pre-information": {
    "key": "legal/pre-information",
    "label": "Pre-Information Form",
    "translations": [
      {
        "locale": "en",
        "title": "Pre-Information Form",
        "subtitle": "Seller\nRonas Corduene, Corduene / Turkey. Contact: hello@ronascorduene.com."
      },
      {
        "locale": "tr",
        "title": "Ön Bilgilendirme Formu",
        "subtitle": "Satıcı\nRonas Corduene, Corduene / Turkey. İletişim: hello@ronascorduene.com."
      },
      {
        "locale": "ku",
        "title": "Forma Agahdariya Pêşîn",
        "subtitle": "Firoşkar\nRonas Corduene, Corduene / Turkey. Têkilî: hello@ronascorduene.com."
      },
      {
        "locale": "ar",
        "title": "نموذج المعلومات المسبقة",
        "subtitle": "البائع\nRonas Corduene، Corduene / Turkey. التواصل: hello@ronascorduene.com."
      }
    ],
    "sections": [
      {
        "key": "document",
        "type": "legal-document",
        "position": 0,
        "image": "",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "LEGAL",
            "title": "Pre-Information Form",
            "body": "## Seller\nRonas Corduene, Corduene / Turkey. Contact: hello@ronascorduene.com.\n\n## Product and price\nThe essential characteristics of the product, the total price and the delivery conditions are confirmed in the quotation sent before the order.\n\n## Delivery\nThe delivery address and estimated delivery time are agreed per order. Import duties, where applicable, are the customer's responsibility.\n\n## Complaints\nFor any complaint or question, contact hello@ronascorduene.com.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "tr",
            "eyebrow": "LEGAL",
            "title": "Ön Bilgilendirme Formu",
            "body": "## Satıcı\nRonas Corduene, Corduene / Turkey. İletişim: hello@ronascorduene.com.\n\n## Ürün ve fiyat\nÜrünün temel özellikleri, toplam fiyat ve teslimat koşulları, sipariş öncesi gönderilen teklifte teyit edilir.\n\n## Teslimat\nTeslimat adresi ve tahmini teslim süresi her sipariş için kararlaştırılır. Varsa ithalat vergileri müşteriye aittir.\n\n## Şikâyetler\nHer türlü şikâyet veya soru için hello@ronascorduene.com adresine başvurabilirsiniz.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ku",
            "eyebrow": "LEGAL",
            "title": "Forma Agahdariya Pêşîn",
            "body": "## Firoşkar\nRonas Corduene, Corduene / Turkey. Têkilî: hello@ronascorduene.com.\n\n## Hilber û biha\nTaybetmendiyên bingehîn, bihaya giştî û mercên şandinê di texmîna berî fermanê de têne piştrast kirin.\n\n## Şandin\nNavnîşana şandinê û dema texmînkirî ji bo her fermanê têne li hev kirin. Baca îthalatê, heke hebe, ya xerîdar e.\n\n## Gilî\nJi bo her gilî an pirsê bi hello@ronascorduene.com re têkilî daynin.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ar",
            "eyebrow": "LEGAL",
            "title": "نموذج المعلومات المسبقة",
            "body": "## البائع\nRonas Corduene، Corduene / Turkey. التواصل: hello@ronascorduene.com.\n\n## المنتج والسعر\nتُؤكَّد الخصائص الجوهرية للمنتج والسعر الإجمالي وشروط التسليم في عرض السعر المُرسل قبل الطلب.\n\n## التسليم\nيُتفَّق على عنوان التسليم ووقته التقديري لكل طلب. رسوم الاستيراد، إن وُجدت، على العميل.\n\n## الشكاوى\nلأي شكوى أو استفسار تواصل معنا على hello@ronascorduene.com.",
            "ctaLabel": "",
            "items": []
          }
        ]
      }
    ]
  },
  "legal/privacy": {
    "key": "legal/privacy",
    "label": "Privacy Policy",
    "translations": [
      {
        "locale": "en",
        "title": "Privacy Policy",
        "subtitle": "Who we are\nRonas Corduene designs and manufactures automotive equipment at Corduene / Turkey. This policy explains what personal data we collect through ronasco"
      },
      {
        "locale": "tr",
        "title": "Gizlilik Politikası",
        "subtitle": "Ronas Corduene, Corduene / Turkey adresinde otomotiv ekipmanı tasarlar ve üretir. Bu politika, ronascorduene.com üzerinden hangi kişisel verileri topladığımızı "
      },
      {
        "locale": "ku",
        "title": "Polîtîkaya Nepenîtiyê",
        "subtitle": "Ronas Corduene li Corduene / Turkey alavên otomotîvê çêdike. Ev polîtîka rave dike ku em bi riya ronascorduene.com kîjan daneyên kesane kom dikin û çawa bi kar "
      },
      {
        "locale": "ar",
        "title": "سياسة الخصوصية",
        "subtitle": "تصمم Ronas Corduene وتصنع معدات السيارات في Corduene / Turkey. توضح هذه السياسة البيانات الشخصية التي نجمعها عبر ronascorduene.com وكيفية استخدامها."
      }
    ],
    "sections": [
      {
        "key": "document",
        "type": "legal-document",
        "position": 0,
        "image": "",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "LEGAL",
            "title": "Privacy Policy",
            "body": "## Who we are\nRonas Corduene designs and manufactures automotive equipment at Corduene / Turkey. This policy explains what personal data we collect through ronascorduene.com and how we use it.\n\n## What we collect\nWe collect the details you give us through our contact form and parts list, such as your name, email address, phone number and the products you are interested in. We also store basic technical data such as the language you select.\n\n## How we use it\nWe use your data only to answer enquiries, prepare quotations and fulfil orders. We do not sell personal data to third parties.\n\n## Your rights\nYou can ask us to access, correct or delete your data at any time by writing to hello@ronascorduene.com.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "tr",
            "eyebrow": "LEGAL",
            "title": "Gizlilik Politikası",
            "body": "Ronas Corduene, Corduene / Turkey adresinde otomotiv ekipmanı tasarlar ve üretir. Bu politika, ronascorduene.com üzerinden hangi kişisel verileri topladığımızı ve bunları nasıl kullandığımızı açıklar.\n\n## Neleri topluyoruz\nİletişim formu ve parça listesi aracılığıyla bize verdiğiniz ad, e-posta, telefon ve ilgilendiğiniz ürünler gibi bilgileri toplarız. Seçtiğiniz dil gibi temel teknik verileri de saklarız.\n\n## Nasıl kullanıyoruz\nVerilerinizi yalnızca sorularınızı yanıtlamak, teklif hazırlamak ve siparişleri yerine getirmek için kullanırız. Kişisel verileri üçüncü taraflara satmayız.\n\n## Haklarınız\nVerilerinize erişmek, düzeltmek veya silmek için hello@ronascorduene.com adresine yazabilirsiniz.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ku",
            "eyebrow": "LEGAL",
            "title": "Polîtîkaya Nepenîtiyê",
            "body": "Ronas Corduene li Corduene / Turkey alavên otomotîvê çêdike. Ev polîtîka rave dike ku em bi riya ronascorduene.com kîjan daneyên kesane kom dikin û çawa bi kar tînin.\n\n## Em çi kom dikin\nEm agahdariya ku hûn bi forma têkilî û lîsta parçeyan didin kom dikin: nav, e-name, telefon û hilberên ku hûn bala xwe didinê. Em daneyên teknîkî yên bingehîn jî diparêzin.\n\n## Em çawa bi kar tînin\nEm daneyên we tenê ji bo bersivdana pirsan, amadekirina texmîn û bicihanîna fermanan bi kar tînin. Em daneyên kesane li aliyên sêyem na firotin.\n\n## Mafên we\nHûn dikarin her dem li hello@ronascorduene.com binivîsin da ku daneyên xwe bigihîjin, rast bikin an jêbirin.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ar",
            "eyebrow": "LEGAL",
            "title": "سياسة الخصوصية",
            "body": "تصمم Ronas Corduene وتصنع معدات السيارات في Corduene / Turkey. توضح هذه السياسة البيانات الشخصية التي نجمعها عبر ronascorduene.com وكيفية استخدامها.\n\n## ما الذي نجمعه\nنجمع التفاصيل التي تقدمها عبر نموذج التواصل وقائمة القطع، مثل الاسم والبريد الإلكتروني والهاتف والمنتجات التي تهتم بها. كما نخزّن بيانات تقنية أساسية مثل اللغة التي تختارها.\n\n## كيف نستخدمها\nنستخدم بياناتك فقط للرد على الاستفسارات وإعداد العروض وتنفيذ الطلبات. لا نبيع البيانات الشخصية لأطراف ثالثة.\n\n## حقوقك\nيمكنك مراسلتنا على hello@ronascorduene.com للوصول إلى بياناتك أو تصحيحها أو حذفها في أي وقت.",
            "ctaLabel": "",
            "items": []
          }
        ]
      }
    ]
  },
  "legal/returns": {
    "key": "legal/returns",
    "label": "Returns & Cancellation",
    "translations": [
      {
        "locale": "en",
        "title": "Returns & Cancellation",
        "subtitle": "Right of withdrawal\nUnless the product is custom-made to your specification, you may cancel within 14 days of delivery. Custom and made-to-order parts are exclu"
      },
      {
        "locale": "tr",
        "title": "İade ve İptal",
        "subtitle": "Cayma hakkı\nÜrün siparişinize özel üretilmediği sürece, teslimden itibaren 14 gün içinde iptal edebilirsiniz. Kişiye özel ve siparişe göre üretilen parçalar har"
      },
      {
        "locale": "ku",
        "title": "Vegerandin û Betalkirin",
        "subtitle": "Mafê vekişînê\nHeke hilber ji bo taybetmendiya we nehatibe çêkirin, hûn dikarin di nav 14 rojan de ji şandinê betal bikin. Parçeyên taybet têne derxistin."
      },
      {
        "locale": "ar",
        "title": "الإرجاع والإلغاء",
        "subtitle": "حق الانسحاب\nما لم يكن المنتج مصنوعًا حسب مواصفاتك، يحق لك الإلغاء خلال 14 يومًا من التسليم. وتُستثنى القطع المخصصة."
      }
    ],
    "sections": [
      {
        "key": "document",
        "type": "legal-document",
        "position": 0,
        "image": "",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "LEGAL",
            "title": "Returns & Cancellation",
            "body": "## Right of withdrawal\nUnless the product is custom-made to your specification, you may cancel within 14 days of delivery. Custom and made-to-order parts are excluded.\n\n## Returning an item\nContact hello@ronascorduene.com before returning anything. Products must be unused, undamaged and in their original packaging.\n\n## Refunds\nApproved returns are refunded with the original payment method. Return shipping may be the customer's responsibility.\n\n## Faulty items\nIf a product arrives damaged or faulty, contact us with photos and we will repair, replace or refund it.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "tr",
            "eyebrow": "LEGAL",
            "title": "İade ve İptal",
            "body": "## Cayma hakkı\nÜrün siparişinize özel üretilmediği sürece, teslimden itibaren 14 gün içinde iptal edebilirsiniz. Kişiye özel ve siparişe göre üretilen parçalar hariçtir.\n\n## Ürün iadesi\nHerhangi bir iade öncesinde hello@ronascorduene.com ile iletişime geçin. Ürünler kullanılmamış, hasarsız ve orijinal ambalajında olmalıdır.\n\n## Geri ödeme\nOnaylanan iadeler, ödemenin yapıldığı yöntemle geri ödenir. İade kargo bedeli müşteriye ait olabilir.\n\n## Ayıplı ürün\nÜrün hasarlı veya hatalı gelirse fotoğraflarla bize ulaşın; onarır, değiştirir veya ücretini iade ederiz.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ku",
            "eyebrow": "LEGAL",
            "title": "Vegerandin û Betalkirin",
            "body": "## Mafê vekişînê\nHeke hilber ji bo taybetmendiya we nehatibe çêkirin, hûn dikarin di nav 14 rojan de ji şandinê betal bikin. Parçeyên taybet têne derxistin.\n\n## Vegerandina hilberê\nBerî vegerandinê bi hello@ronascorduene.com re têkilî daynin. Hilber divê nehatibe bikaranîn, bi zirar nebe û di pakêta xwe ya orîjînal de be.\n\n## Pereyê vegerê\nVegerandinên pejirandî bi rêbaza dayîna orîjînal têne vegerandin. Mesrefa veguhastinê dibe ya xerîdar be.\n\n## Hilberên xerab\nHeke hilber xerab an kêmasiyek hat, bi wêneyan bi me re têkilî daynin; em wê rast bikin, biguhezînin an pere vegerînin.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ar",
            "eyebrow": "LEGAL",
            "title": "الإرجاع والإلغاء",
            "body": "## حق الانسحاب\nما لم يكن المنتج مصنوعًا حسب مواصفاتك، يحق لك الإلغاء خلال 14 يومًا من التسليم. وتُستثنى القطع المخصصة.\n\n## إرجاع المنتج\nتواصل مع hello@ronascorduene.com قبل إرجاع أي منتج. يجب أن يكون المنتج غير مستخدم وغير تالف وفي عبواته الأصلية.\n\n## المبالغ المستردة\nتُرد المبالغ المعتمدة بوسيلة الدفع الأصلية. وقد تكون تكلفة إرجاع الشحن على العميل.\n\n## المنتجات المعيبة\nإذا وصل المنتج تالفًا أو معيبًا، تواصل معنا مع صور وسنقوم بإصلاحه أو استبداله أو استرداد قيمته.",
            "ctaLabel": "",
            "items": []
          }
        ]
      }
    ]
  },
  "legal/terms": {
    "key": "legal/terms",
    "label": "Terms of Use",
    "translations": [
      {
        "locale": "en",
        "title": "Terms of Use",
        "subtitle": "Acceptance\nBy using ronascorduene.com you agree to these terms. The site and its content belong to Ronas Corduene."
      },
      {
        "locale": "tr",
        "title": "Kullanım Koşulları",
        "subtitle": "Kabul\nronascorduene.com sitesini kullanarak bu koşulları kabul etmiş olursunuz. Site ve içeriği Ronas Corduene firmasına aittir."
      },
      {
        "locale": "ku",
        "title": "Mercên Bikaranînê",
        "subtitle": "Qebûlkirin\nBi bikaranîna ronascorduene.com hûn van mercan qebûl dikin. Malper û naveroka wê ya Ronas Corduene ye."
      },
      {
        "locale": "ar",
        "title": "شروط الاستخدام",
        "subtitle": "القبول\nباستخدامك ronascorduene.com فإنك توافق على هذه الشروط. الموقع ومحتواه ملك لـ Ronas Corduene."
      }
    ],
    "sections": [
      {
        "key": "document",
        "type": "legal-document",
        "position": 0,
        "image": "",
        "href": "",
        "translations": [
          {
            "locale": "en",
            "eyebrow": "LEGAL",
            "title": "Terms of Use",
            "body": "## Acceptance\nBy using ronascorduene.com you agree to these terms. The site and its content belong to Ronas Corduene.\n\n## Content\nThe information on this site, including product specifications and prices, is provided for general information and may change without notice.\n\n## Liability\nWe work to keep the site accurate and available, but we do not guarantee uninterrupted access and are not liable for indirect damages arising from its use.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "tr",
            "eyebrow": "LEGAL",
            "title": "Kullanım Koşulları",
            "body": "## Kabul\nronascorduene.com sitesini kullanarak bu koşulları kabul etmiş olursunuz. Site ve içeriği Ronas Corduene firmasına aittir.\n\n## İçerik\nÜrün özellikleri ve fiyatlar dâhil bu sitedeki bilgiler genel bilgilendirme amacıyla sunulur ve önceden bildirilmeksizin değişebilir.\n\n## Sorumluluk\nSitenin doğru ve erişilebilir kalması için çalışırız; ancak kesintisiz erişimi garanti etmeyiz ve kullanımından doğan dolaylı zararlardan sorumlu değiliz.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ku",
            "eyebrow": "LEGAL",
            "title": "Mercên Bikaranînê",
            "body": "## Qebûlkirin\nBi bikaranîna ronascorduene.com hûn van mercan qebûl dikin. Malper û naveroka wê ya Ronas Corduene ye.\n\n## Naverok\nAgahdariya li vê malperê, tevî taybetmendiyên hilberan û bihayan, ji bo agahdariya giştî ye û bê agahdarî dikare biguhere.\n\n## Berpirsiyarî\nEm dixebitin ku malper rast û berdest be, lê em gihîştina bê navber garantî nakin û ji ziyanên nerasterast berpirsiyar nînin.",
            "ctaLabel": "",
            "items": []
          },
          {
            "locale": "ar",
            "eyebrow": "LEGAL",
            "title": "شروط الاستخدام",
            "body": "## القبول\nباستخدامك ronascorduene.com فإنك توافق على هذه الشروط. الموقع ومحتواه ملك لـ Ronas Corduene.\n\n## المحتوى\nالمعلومات في هذا الموقع، بما في ذلك مواصفات المنتجات والأسعار، مقدمة للإعلام العام وقد تتغير دون إشعار.\n\n## المسؤولية\nنعمل على إبقاء الموقع دقيقًا ومتاحًا، لكننا لا نضمن الوصول دون انقطاع ولسنا مسؤولين عن الأضرار غير المباشرة الناتجة عن استخدامه.",
            "ctaLabel": "",
            "items": []
          }
        ]
      }
    ]
  }
};
