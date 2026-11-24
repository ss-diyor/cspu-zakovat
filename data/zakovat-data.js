/**
 * Universitet Zakovat Klubi — Statik ma'lumotlar bazasi
 * Versiya: 1.0.0
 * Yangilangan sana: 2026-11-24T18:00:00+05:00
 * Qayta deploy qilish uchun ushbu faylni data/zakovat-data.js o'rniga joylashtiring.
 */
window.ZAKOVAT_DATA = {
  version: "1.0.0",
  releaseNote: "2026-yil Kuzgi mavsum dastlabki 3 ta tur va Rektor kubogi savollari joylandi",
  updatedAt: "2026-11-24T18:00:00+05:00",
  adminPasscodeHash: "c72e907f3d0116444f0dab6c22dd78bcf23961ffa3f607dc02e51354b9dcacb7",
  site: {
    universityName: "Universitet Zakovat Klubi",
    shortLabel: "Oliy ta'lim ligasi",
    heroTitle: "Universitet Zakovat turniri savollar va javoblar arxivi",
    heroSubtitle:
      "Har bir musobaqa va turda o'ynalgan rasmiy savollar, javoblar, izohlar hamda tayyor savol paketlari — barchasi bitta ochiq bazada.",
    quote:
      "Ilm tufayli inson o'zi sevgan ish bilan shug'ullanishi, xohlagan narsasiga erishishi mumkin. Bilimga intilish insonning asosiy xususiyatlaridan biridir.",
    announcementText: "Yangi: Kuzgi mavsum 2-tur savollari va javoblari e'lon qilindi",
    email: "zakovat@universitet.uz",
    phone: "+998 (71) 200-00-00",
    telegramUrl: "https://t.me/",
    instagramUrl: "https://instagram.com/",
    youtubeUrl: "https://youtube.com/",
    categories: [
      "Oliy liga",
      "Fakultetlararo",
      "Rektor kubogi",
      "Yangi avlod",
      "Blitz",
      "Maxsus o'yin"
    ],
    topics: [
      "Mantiq",
      "Tarix",
      "Adabiyot",
      "Fan va texnika",
      "San'at",
      "Geografiya",
      "Sport",
      "Umumiy"
    ]
  },
  tournaments: [
    {
      id: "tour_kuz2026",
      code: "101",
      name: "Universitet Zakovat Ligasi — 2026 Kuzgi mavsum",
      season: "2026 Kuz",
      category: "Oliy liga",
      startDate: "2026-10-03",
      endDate: "2026-12-19",
      location: "Bosh bino, Katta faollar zali",
      teamsCount: 28,
      status: "active",
      description:
        "Universitetning barcha fakultet jamoalari o'rtasida har ikki haftada o'tkaziladigan muntazam chempionat."
    },
    {
      id: "tour_rektor2026",
      code: "102",
      name: "Rektor kubogi — 2026",
      season: "2026 Kuz",
      category: "Rektor kubogi",
      startDate: "2026-11-07",
      endDate: "2026-11-07",
      location: "Axborot-resurs markazi",
      teamsCount: 36,
      status: "finished",
      description:
        "Bir kunlik yirik kubok bahsi: 24 ta saralash savoli va final bosqichi."
    },
    {
      id: "tour_fakultet2026",
      code: "103",
      name: "Birinchi kurslar «Yangi avlod» turniri",
      season: "2026 Kuz",
      category: "Yangi avlod",
      startDate: "2026-09-19",
      endDate: "2026-10-10",
      location: "2-o'quv binosi",
      teamsCount: 22,
      status: "finished",
      description:
        "Yangi qabul qilingan talabalar uchun mo'ljallangan ochiq Zakovat turniri."
    }
  ],
  games: [
    {
      id: "game_kuz_t1",
      tournamentId: "tour_kuz2026",
      roundNumber: 1,
      title: "Kuzgi mavsum 1-tur savollari",
      date: "2026-10-03",
      host: "A. Karimov",
      editor: "Universitet Zakovat tahririyati",
      teamsPlayed: 28,
      winnerTeam: "Al-Xorazmiy vorislari",
      category: "Oliy liga",
      language: "O'zbek",
      description:
        "Mavsumning ochilish o'yini: mantiq, tarix va fan yo'nalishidagi 1-tur savollari to'plami.",
      published: true
    },
    {
      id: "game_kuz_t2",
      tournamentId: "tour_kuz2026",
      roundNumber: 2,
      title: "Kuzgi mavsum 2-tur savollari",
      date: "2026-10-17",
      host: "D. Rustamova",
      editor: "M. Sobirov, Sh. Alimov",
      teamsPlayed: 26,
      winnerTeam: "Renassans",
      category: "Oliy liga",
      language: "O'zbek",
      description:
        "Ikkinchi tur bahslari: badiiy adabiyot, tarqatma materiallar va mantiqiy bog'liqliklarga asoslangan paket.",
      published: true
    },
    {
      id: "game_rektor_final",
      tournamentId: "tour_rektor2026",
      roundNumber: 1,
      title: "Rektor kubogi — Final paketi",
      date: "2026-11-07",
      host: "A. Karimov",
      editor: "Klub ekspertlar kengashi",
      teamsPlayed: 36,
      winnerTeam: "Tafakkur",
      category: "Rektor kubogi",
      language: "O'zbek",
      description:
        "Rektor kubogi hal qiluvchi bosqichida berilgan sara savollar va ularning batafsil sharhlari.",
      published: true
    },
    {
      id: "game_yangi_t1",
      tournamentId: "tour_fakultet2026",
      roundNumber: 1,
      title: "Yangi avlod — Ochilish o'yini",
      date: "2026-09-19",
      host: "S. Tursunov",
      editor: "Talabalar ligasi",
      teamsPlayed: 22,
      winnerTeam: "Yangi ufq",
      category: "Yangi avlod",
      language: "O'zbek",
      description:
        "1-kurs talabalari uchun qiziqarli va tezkor fikrlashga chorlovchi debyut o'yini savollari.",
      published: true
    }
  ],
  questions: [
    {
      id: "q_01",
      gameId: "game_kuz_t1",
      number: 1,
      topic: "Mantiq",
      difficulty: "Oson",
      question:
        "Yapon madaniyatida «Midzaru», «Kikadzaru» va «Ivadzaru» ismli uch maymun tasviri mashhur: biri ko'rmaydi, biri eshitmaydi, biri gapirmaydi. Zamonaviy karikaturalardan birida to'rtinchi maymun ham chizilgan bo'lib, unda bu uch xususiyatning barchasi jamlangan — u hech narsani ko'rmaydi, eshitmaydi va gapirmaydi.\nDiqqat savol: To'rtinchi maymunning qo'lida nima bor?",
      handoutText: "",
      handoutImage: "",
      answer: "Telefon (smartfon).",
      accepted: "Smartfon, uyali telefon, mobil telefon.",
      comment:
        "Karikatura zamonaviy insonlarning smartfon ekraniga berilib ketib, atrofdagi voqealarga e'tibor bermay qo'yganini kinoyali tarzda ko'rsatadi.",
      author: "Klub arxivi",
      source: "Ochiq Zakovat bazasi",
      solvedBy: "24 / 28",
      likes: 18,
      published: true
    },
    {
      id: "q_02",
      gameId: "game_kuz_t1",
      number: 2,
      topic: "Tarix",
      difficulty: "O'rta",
      question:
        "XV asrda Samarqandda bunyod etilgan mashhur inshootning yer osti qismi bugungi kungacha deyarli asl holida saqlanib qolgan. Qizig'i shundaki, bu yerdagi ulkan yoy shaklidagi qurilma orqali olimlar osmon jismlarini kunning ma'lum vaqtida juda yuqori aniqlik bilan kuzatganlar.\nDiqqat savol: Ushbu inshootdagi radiusi 40 metrdan ortiq bo'lgan asosiy astronomik asbob nima deb ataladi?",
      handoutText: "",
      handoutImage: "",
      answer: "Sekstant (Faxriy sekstanti).",
      accepted: "Kvadrant (tarixiy manbalarda ko'pincha sekstant yoki kvadrant sifatida keltiriladi).",
      comment:
        "Mirzo Ulug'bek rasadxonasidagi ulkan marmar sekstant yordamida 1018 ta yulduzning aniq koordinatalari — «Ziji jadidi Ko'ragoniy» jadvali tuzilgan.",
      author: "A. Karimov",
      source: "Samarqand tarixi va astronomiya merosi",
      solvedBy: "19 / 28",
      likes: 25,
      published: true
    },
    {
      id: "q_03",
      gameId: "game_kuz_t1",
      number: 3,
      topic: "Fan va texnika",
      difficulty: "O'rta",
      question:
        "1947-yilda Garvard universitetida ishlayotgan muhandislar Mark II hisoblash mashinasida kutilmagan nosozlik sababini qidirib, rele kontaktlari orasidan kichik bir mavjudotni topib olishadi va uni ish jurnaliga skotch bilan yopishtirib, «birinchi haqiqiy holat» deb yozib qo'yishadi.\nDiqqat savol: Shu voqeadan so'ng dasturlash olamida qaysi atama keng ommalashib ketgan?",
      handoutText: "",
      handoutImage: "",
      answer: "Bag (Bug) — yoki «Debugging».",
      accepted: "Bug, debag, debugging (xatoni tuzatish).",
      comment:
        "Rele ichiga tushib qolgan kapalak (moth) tufayli Greys Xopper jamoasi qayd qilgan «First actual case of bug being found» yozuvi dasturlash tarixidagi eng mashhur iboraga aylandi.",
      author: "Sh. Alimov",
      source: "Smithsonian National Museum of American History",
      solvedBy: "22 / 28",
      likes: 31,
      published: true
    },
    {
      id: "q_04",
      gameId: "game_kuz_t1",
      number: 4,
      topic: "Adabiyot",
      difficulty: "Qiyin",
      question:
        "Alisher Navoiy o'zining mashhur asarida turkiy tilning boyligini isbotlash uchun yuzlab misollar keltiradi. Jumladan, u birgina «yig'lamoq» ma'nosini ifodalovchi o'ndan ortiq so'zni — ingramoq, singramoq, siqtamoq, o'kurmak kabilarni sanab o'tadi.\nDiqqat savol: Alisher Navoiyning 1499-yilda yozilgan ushbu ilmiy-tilshunoslik asari qanday nomlanadi?",
      handoutText: "",
      handoutImage: "",
      answer: "«Muhokamat ul-lug'atayn».",
      accepted: "Muhokamatul lug'atayn.",
      comment:
        "«Ikki til muhokamasi» ma'nosini anglatuvchi ushbu risola Navoiy umrining so'nggi yillarida yozilgan bo'lib, turkiy (eski o'zbek) va forsiy tillarning imkoniyatlarini qiyosiy tahlil qiladi.",
      author: "D. Rustamova",
      source: "Alisher Navoiy, Mukammal asarlar to'plami",
      solvedBy: "25 / 28",
      likes: 22,
      published: true
    },
    {
      id: "q_05",
      gameId: "game_kuz_t2",
      number: 1,
      topic: "Mantiq",
      difficulty: "O'rta",
      question:
        "Tarqatma materialga e'tibor bering. Ushbu mashhur shior qadimgi Rimdan emas, balki 1894-yilda Parijda o'tgan kongressdan boshlab butun dunyoga tanilgan. 2021-yilda Tokiodagi yig'ilishda esa uning oxiriga tire orqali to'rtinchi so'z ham qo'shildi.\nDiqqat savol: 2021-yilda qo'shilgan o'sha to'rtinchi so'zni ayting.",
      handoutText: "Citius, Altius, Fortius — ...?",
      handoutImage: "",
      answer: "Birgalikda (Communiter).",
      accepted: "Birga, Communiter, Together.",
      comment:
        "Olimpiya o'yinlarining «Tezroq, balandroq, kuchliroq» shioriga 2021-yilda Xalqaro Olimpiya Qo'mitasi tomonidan birdamlik ramzi sifatida «Birgalikda» (lotincha «Communiter») so'zi qo'shildi.",
      author: "M. Sobirov",
      source: "International Olympic Committee, 2021",
      solvedBy: "15 / 26",
      likes: 27,
      published: true
    },
    {
      id: "q_06",
      gameId: "game_kuz_t2",
      number: 2,
      topic: "Geografiya",
      difficulty: "O'rta",
      question:
        "Dunyoda atigi ikki davlat «ikki karra dengizga chiqish imkoniga ega bo'lmagan» (doubly landlocked) mamlakat hisoblanadi — ya'ni ularning fuqarosi okeanga yetib borish uchun kamida ikki davlat chegarasini kesib o'tishi kerak.\nDiqqat savol: Ulardan biri O'zbekiston bo'lsa, Yevropada joylashgan ikkinchisi qaysi davlat?",
      handoutText: "",
      handoutImage: "",
      answer: "Lixtenshteyn.",
      accepted: "Lixtenshteyn knyazligi.",
      comment:
        "Lixtenshteyn faqat Shveysariya va Avstriya bilan chegaradosh bo'lib, ularning ikkalasi ham dengizga to'g'ridan-to'g'ri chiqishga ega emas.",
      author: "S. Tursunov",
      source: "Jahon siyosiy geografiyasi",
      solvedBy: "23 / 26",
      likes: 19,
      published: true
    },
    {
      id: "q_07",
      gameId: "game_kuz_t2",
      number: 3,
      topic: "San'at",
      difficulty: "Qiyin",
      question:
        "Mashhur rassom Leonardo da Vinchi o'z kundaliklarida yozuvlarni o'ngdan chapga, harflarni esa teskari ko'rinishda yozishni odat qilgan. Tadqiqotchilarning fikricha, buning asosiy sababi sir saqlash emas, balki chapaqay rassomning siyohga qo'lini tekkizib yubormasligi bo'lgan.\nDiqqat savol: Leonardo da Vinchining bu yozuvlarini oson o'qish uchun qaysi oddiy buyumdan foydalanish kifoya?",
      handoutText: "",
      handoutImage: "",
      answer: "Ko'zgu (oyna).",
      accepted: "Oyna, ko'zgu.",
      comment:
        "Bu usul «ko'zguli yozuv» (mirror writing) deb ataladi; matnni ko'zguga tutganda barcha harflar odatiy tartibda o'qiladi.",
      author: "D. Rustamova",
      source: "Uyg'onish davri san'ati ensiklopediyasi",
      solvedBy: "21 / 26",
      likes: 16,
      published: true
    },
    {
      id: "q_08",
      gameId: "game_kuz_t2",
      number: 4,
      topic: "Fan va texnika",
      difficulty: "Qiyin",
      question:
        "Bu kimyoviy elementning nomi yunoncha «yangi» ma'nosini beruvchi so'zdan olingan. 1898-yilda Uilyam Ramzay va Morris Travers uni kashf qilganlarida, uning elektr razryadi ta'sirida yorqin qizil-to'q sariq rangda yonishini ko'rib hayratga tushishgan. XX asrda esa u yirik shaharlarning tungi ko'chalariga butunlay yangicha qiyofa bag'ishladi.\nDiqqat savol: Ushbu inert gazni ayting.",
      handoutText: "",
      handoutImage: "",
      answer: "Neon.",
      accepted: "Neon (Ne).",
      comment:
        "Yunoncha «neos» — «yangi» degani. Neon lampalari va reklama chiroqlari XX asr shahar madaniyatining ajralmas ramziga aylandi.",
      author: "Sh. Alimov",
      source: "Kimyoviy elementlar tarixi",
      solvedBy: "17 / 26",
      likes: 14,
      published: true
    },
    {
      id: "q_09",
      gameId: "game_rektor_final",
      number: 1,
      topic: "Tarix",
      difficulty: "Qiyin",
      question:
        "Bag'dodda IX asrda faoliyat yuritgan «Bayt ul-Hikma» ilm maskanida ishlagan yurtdoshimizning «Al-jabr val-muqobala» asari nafaqat butun bir matematika sohasiga nom berdi, balki uning o'z ismining lotincha talaffuzi bugun har bir kompyuter dasturining asosini tashkil etuvchi atamaga aylandi.\nDiqqat savol: Biz tilga olgan ikki atamani ham ketma-ketlikda ayting.",
      handoutText: "",
      handoutImage: "",
      answer: "Algebra va algoritm.",
      accepted: "Al-jabr / algebra va algoritm.",
      comment:
        "Muhammad ibn Muso al-Xorazmiyning asaridan «algebra», uning «Algoritmi» deb lotinlashtirilgan ismidan esa «algoritm» atamasi kelib chiqqan.",
      author: "Ekspertlar kengashi",
      source: "Fan tarixi ocherklari",
      solvedBy: "33 / 36",
      likes: 42,
      published: true
    },
    {
      id: "q_10",
      gameId: "game_rektor_final",
      number: 2,
      topic: "Sport",
      difficulty: "O'rta",
      question:
        "Shaxmat o'yinida biror katakda turgan donani harakatlantirish orqali raqib shohiga bevosita emas, balki boshqa donaning yo'lini ochib berish orqali kish berish usuli mavjud. Ba'zan bu holatda bir vaqtning o'zida ikki dona kish beradi va raqib shohini qutqarishning yagona yo'li faqat shohning o'zini yurish bo'lib qoladi.\nDiqqat savol: Ikki dona birvarakayiga kish beradigan ushbu taktik holat shaxmatda nima deb ataladi?",
      handoutText: "",
      handoutImage: "",
      answer: "Qo'shaloq kish (ikki tomonlama kish).",
      accepted: "Ikkiyoqlama kish, qo'sh kish, double check.",
      comment:
        "Qo'shaloq kishda ikkala hujum qiluvchi donani bir yurishda urib olish yoki to'sish imkonsiz, shuning uchun shoh albatta xavfsiz katakka chekinishi shart.",
      author: "A. Karimov",
      source: "FIDE shaxmat qoidalari",
      solvedBy: "26 / 36",
      likes: 15,
      published: true
    },
    {
      id: "q_11",
      gameId: "game_rektor_final",
      number: 3,
      topic: "Mantiq",
      difficulty: "Qiyin",
      question:
        "Qadimgi yunon faylasufi Diogen kunduz kuni qo'lida yonib turgan fonus bilan Afina bozorini aylanib yurganini ko'rgan odamlar undan nega bunday qilayotganini so'rashadi. Shunda faylasuf ikki so'zdan iborat mashhur javobni beradi.\nDiqqat savol: Diogen kimni (yoki nimani) qidirayotganini aytgan?",
      handoutText: "",
      handoutImage: "",
      answer: "Insonni qidiryapman («Odam izlayapman»).",
      accepted: "Insonni, haqiqiy insonni, odamni.",
      comment:
        "Diogen bu harakati orqali jamiyatda haqiqiy halol, adolatli va erkin fikrli insonni topish naqadar mushkul ekaniga ishora qilgan.",
      author: "M. Sobirov",
      source: "Diogen Laertskiy, «Mashhur faylasuflar hayoti»",
      solvedBy: "29 / 36",
      likes: 34,
      published: true
    },
    {
      id: "q_12",
      gameId: "game_yangi_t1",
      number: 1,
      topic: "Umumiy",
      difficulty: "Oson",
      question:
        "O'zbekistonning barcha viloyatlari va Qoraqalpog'iston Respublikasi orasida qaysi hududning nomi ikki so'zdan iborat emas, balki faqat bitta so'zdan tashkil topgan hamda o'sha hudud hududida qadimiy Ichan-qal'a joylashgan?",
      handoutText: "",
      handoutImage: "",
      answer: "Xorazm (Xorazm viloyati).",
      accepted: "Xorazm.",
      comment:
        "Xiva shahridagi Ichan-qal'a 1990-yilda Markaziy Osiyoda birinchi bo'lib YuNESKOning Butunjahon merosi ro'yxatiga kiritilgan.",
      author: "S. Tursunov",
      source: "O'zbekiston madaniy merosi",
      solvedBy: "21 / 22",
      likes: 12,
      published: true
    }
  ]
};
