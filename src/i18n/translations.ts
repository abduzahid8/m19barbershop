export type Lang = 'RU' | 'UZ' | 'EN';

export interface Translations {
  tabBar: { home: string; about: string };
  home: {
    location: string;
    locationAddress: string;
    phone: string;
    call: string;
    cancel: string;
    telegram: string;
    instagram: string;
    website: string;
    reviewsTitle: string;
    reviewsLoading: string;
    reviewsUnavailable: string;
    viewAllReviews: string;
    writeReview: string;
    locationCta: string;
    heroLabel: string;
    heroTitle: string;
    heroSub: string;
    ctaBtn: string;
  };
  about: {
    headerTitle: string;
    eyebrow: string;
    title: string;
    paragraph1: string;
    founderPrefix: string;
    founderName: string;
    paragraph2: string;
    paragraph3: string;
    servicesTitle: string;
    services: string[];
    bookingMethodsTitle: string;
    bookingMethods: string[];
    closing1: string;
    closing2: string;
  };
  booking: {
    errorText: string;
    retryText: string;
  };
}

export const translations: Record<Lang, Translations> = {
  RU: {
    tabBar: { home: 'Главная', about: 'О нас' },
    home: {
      location: 'ЛОКАЦИЯ',
      locationAddress: 'Ташкент, Мирабадский район, ул. Авлиё-Ота, 36, метро «Айбек»',
      phone: 'Телефон',
      call: 'Позвонить',
      cancel: 'Отмена',
      telegram: 'Telegram',
      instagram: 'Instagram',
      website: 'Сайт',
      reviewsTitle: 'ОТЗЫВЫ КЛИЕНТОВ',
      reviewsLoading: 'Загружаем отзывы…',
      reviewsUnavailable: 'Отзывы временно недоступны. Посмотрите их на Яндекс Картах.',
      viewAllReviews: 'Смотреть все отзывы',
      writeReview: 'Написать отзыв',
      locationCta: 'Жми на локацию',
      heroLabel: 'M19  BARBERSHOP',
      heroTitle: 'ЗАПИСАТЬСЯ ОНЛАЙН',
      heroSub: 'Записывайтесь онлайн — быстро и удобно, без ожидания ответа администратора',
      ctaBtn: 'Онлайн-запись',
    },
    about: {
      headerTitle: 'О НАС',
      eyebrow: 'M19 BARBERSHOP',
      title: 'СТИЛЬ. КАЧЕСТВО.\nВНИМАНИЕ К ДЕТАЛЯМ.',
      paragraph1: 'M19 Barbershop — современный барбершоп в самом центре Ташкента, рядом с метро «Айбек». Мы открылись в 2022 году и за это время заслужили доверие тысяч клиентов благодаря высокому качеству работы, внимательному сервису и уютной атмосфере.',
      founderPrefix: 'Основатель — ',
      founderName: 'Zayd Makhmud',
      paragraph2: 'Наша цель — чтобы каждый гость чувствовал себя комфортно и уходил полностью довольным результатом. Поэтому мы уделяем внимание не только качеству стрижек, но и чистоте, сервису и атмосфере.',
      paragraph3: 'В нашей команде работают опытные барберы со стажем от 10 до 16 лет. Мы постоянно совершенствуем качество обслуживания, следим за современными тенденциями и используем только профессиональные материалы.',
      servicesTitle: 'У НАС ДОСТУПНЫ ВСЕ ОСНОВНЫЕ УСЛУГИ',
      services: [
        'Стрижки',
        'Оформление бороды',
        'Бритьё',
        'Окрашивание волос и бороды',
        'Уход за лицом',
        'Биозавивка и другие услуги',
      ],
      bookingMethodsTitle: 'ЗАПИСАТЬСЯ МОЖНО ЛЮБЫМ УДОБНЫМ СПОСОБОМ',
      bookingMethods: [
        'По телефону',
        'Через Telegram',
        'Самостоятельно через онлайн-запись в приложении',
      ],
      closing1: 'Мы находимся в удобной локации — в центре города, рядом с метро «Айбек», поэтому до нас легко добраться из любой части Ташкента.',
      closing2: 'Спасибо каждому гостю за доверие. Мы продолжаем развиваться и уже работаем над открытием второго филиала M19 Barbershop. До встречи!',
    },
    booking: {
      errorText: 'Не удалось загрузить страницу',
      retryText: 'Повторить',
    },
  },
  UZ: {
    tabBar: { home: 'Bosh sahifa', about: 'Biz haqimizda' },
    home: {
      location: 'JOYLASHUV',
      locationAddress: 'Toshkent, Mirobod tumani, Avliyo-Ota ko‘chasi, 36, «Oybek» metro bekati',
      phone: 'Telefon',
      call: 'Qo‘ng‘iroq qiling',
      cancel: 'Bekor qilish',
      telegram: 'Telegram',
      instagram: 'Instagram',
      website: 'Sayt',
      reviewsTitle: 'MIJOZLAR SHARHLARI',
      reviewsLoading: 'Sharhlar yuklanmoqda…',
      reviewsUnavailable: 'Sharhlar vaqtincha mavjud emas. Ularni Yandex Xaritalarda ko‘ring.',
      viewAllReviews: 'Barcha sharhlarni ko‘rish',
      writeReview: 'Sharh qoldirish',
      locationCta: 'Manzil uchun bosing',
      heroLabel: 'M19  BARBERSHOP',
      heroTitle: 'ONLAYN YOZILING',
      heroSub: 'Onlayn yoziling — tez va qulay, administrator javobini kutmasdan',
      ctaBtn: 'Onlayn yozilish',
    },
    about: {
      headerTitle: 'BIZ HAQIMIZDA',
      eyebrow: 'M19 BARBERSHOP',
      title: 'STIL. SIFAT.\nDETALLARGA E’TIBOR.',
      paragraph1: 'M19 Barbershop — Toshkent markazida, «Oybek» metro bekati yaqinida joylashgan zamonaviy barbershop. Biz 2022-yilda ochilganmiz va shu vaqt ichida yuqori sifatli xizmat, mijozlarga e’tiborli munosabat va qulay muhit tufayli minglab mijozlarning ishonchini qozondik.',
      founderPrefix: 'Asoschisi — ',
      founderName: 'Zayd Makhmud',
      paragraph2: 'Bizning maqsadimiz — har bir mehmon o‘zini qulay his qilishi va natijadan to‘liq mamnun bo‘lib ketishi. Shuning uchun biz nafaqat soch turmaklash sifatiga, balki tozalik, xizmat va muhitga ham e’tibor qaratamiz.',
      paragraph3: 'Jamoamizda 10 dan 16 yilgacha tajribaga ega mohir barberlar ishlaydi. Biz doimiy ravishda xizmat sifatini oshiramiz, zamonaviy tendensiyalarni kuzatib boramiz va faqat professional materiallardan foydalanamiz.',
      servicesTitle: 'BIZDA BARCHA ASOSIY XIZMATLAR MAVJUD',
      services: [
        'Soch turmaklash',
        'Soqol dizayni',
        'Soqol olish',
        'Soch va soqolni bo‘yash',
        'Yuzga parvarish',
        'Ondulyatsiya va boshqa xizmatlar',
      ],
      bookingMethodsTitle: 'SIZGA QULAY BO‘LGAN USULDA YOZILISHINGIZ MUMKIN',
      bookingMethods: [
        'Telefon orqali',
        'Telegram orqali',
        'Ilovadagi onlayn yozilish orqali mustaqil',
      ],
      closing1: 'Biz shahar markazida, «Oybek» metro bekatiga yaqin qulay joyda joylashganmiz, shuning uchun Toshkentning istalgan nuqtasidan bizga yetib kelish oson.',
      closing2: 'Har bir mehmonga ishonchi uchun rahmat. Biz rivojlanishda davom etyapmiz va allaqachon M19 Barbershopning ikkinchi filialini ochish ustida ishlayapmiz. Ko‘rishguncha!',
    },
    booking: {
      errorText: 'Sahifani yuklab bo‘lmadi',
      retryText: 'Qayta urinish',
    },
  },
  EN: {
    tabBar: { home: 'Home', about: 'About' },
    home: {
      location: 'LOCATION',
      locationAddress: 'Tashkent, Mirabad district, Avliyo-Ota St. 36, Oybek metro station',
      phone: 'Phone',
      call: 'Call',
      cancel: 'Cancel',
      telegram: 'Telegram',
      instagram: 'Instagram',
      website: 'Website',
      reviewsTitle: 'CUSTOMER REVIEWS',
      reviewsLoading: 'Loading reviews…',
      reviewsUnavailable: 'Reviews are temporarily unavailable. See them on Yandex Maps.',
      viewAllReviews: 'View all reviews',
      writeReview: 'Write a review',
      locationCta: 'Tap for location',
      heroLabel: 'M19  BARBERSHOP',
      heroTitle: 'BOOK ONLINE',
      heroSub: 'Book online — fast and easy, no waiting for an admin reply',
      ctaBtn: 'Book online',
    },
    about: {
      headerTitle: 'ABOUT US',
      eyebrow: 'M19 BARBERSHOP',
      title: 'STYLE. QUALITY.\nATTENTION TO DETAIL.',
      paragraph1: 'M19 Barbershop is a modern barbershop right in the center of Tashkent, near Oybek metro station. We opened in 2022, and since then we’ve earned the trust of thousands of clients thanks to high-quality work, attentive service, and a cozy atmosphere.',
      founderPrefix: 'Founder — ',
      founderName: 'Zayd Makhmud',
      paragraph2: 'Our goal is for every guest to feel comfortable and leave fully satisfied with the result. That’s why we pay attention not only to the quality of haircuts, but also to cleanliness, service, and atmosphere.',
      paragraph3: 'Our team includes experienced barbers with 10 to 16 years of experience. We constantly improve our service quality, follow modern trends, and use only professional materials.',
      servicesTitle: 'ALL MAIN SERVICES ARE AVAILABLE',
      services: [
        'Haircuts',
        'Beard styling',
        'Shaving',
        'Hair and beard coloring',
        'Facial care',
        'Perms and other services',
      ],
      bookingMethodsTitle: 'BOOK IN WHATEVER WAY SUITS YOU',
      bookingMethods: [
        'By phone',
        'Via Telegram',
        'On your own, via online booking in the app',
      ],
      closing1: 'We’re located in a convenient spot in the city center, near Oybek metro station, so it’s easy to reach us from anywhere in Tashkent.',
      closing2: 'Thank you to every guest for your trust. We keep growing, and we’re already working on opening a second M19 Barbershop location. See you soon!',
    },
    booking: {
      errorText: 'Failed to load the page',
      retryText: 'Retry',
    },
  },
};
