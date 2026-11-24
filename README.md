# Universitet Zakovat Klubi — Statik Savollar va Javoblar Portali

Universitet Zakovat turnirlarida berilgan savollar, javoblar, izohlar va tayyor savol paketlarini e'lon qilib borish uchun **100% statik** (backend va ma'lumotlar bazasi talab qilmaydigan) veb-sayt. Dizayni `zakovatklubi.uz` uslubiga asoslangan: bosh sahifada tungi qora-oltin (dark luxury) ko'rinish, savollar va turnirlar bo'limida esa o'qishga qulay yorug' (light) interfeys.

## Tuzilishi

```
zakovat-universitet/
├── index.html             # Asosiy sahifa
├── css/
│   ├── styles.css         # Asosiy sayt dizayn tizimi (zakovatklubi.uz uslubi)
│   └── admin.css          # Yashirin admin panel dizayni
├── data/
│   └── zakovat-data.js    # Barcha turnirlar, turlar, savollar va sozlamalar fayli
└── js/
    ├── utils.js           # SHA-256, eksport, ommaviy savol parseri, taymer ovozi
    ├── ui-icons.js        # Zakovat gerbi, oltin qum soati va ikonkalar
    ├── store.js           # Ma'lumotlar va qoralama boshqaruvi
    ├── public-app.js      # Bosh sahifa, Savollar bazasi, Paketlar, Turnirlar, Mashq rejimi
    └── admin-app.js       # Yashirin admin panel va deploy fayli eksporti
```

## Yashirin Admin Panelga kirish

Oddiy tashrif buyuruvchilar uchun saytda hech qanday «Admin» tugmasi ko'rinmaydi. Panelni quyidagi **3 ta yashirin usuldan** biri orqali ochishingiz mumkin:

1. **Manzil (URL) orqali:** sayt manzili oxiriga `#admin` qo'shing (masalan: `https://sizning-saytingiz.uz/#admin` yoki `index.html#admin`).
2. **Klaviatura orqali:** `Ctrl + Shift + A` (yoki `Alt + Shift + Z`) tugmalarini bosing.
3. **Logotip orqali (telefonlar uchun ham qulay):** yuqori chap burchakdagi **ZAKOVAT** logotipiga ketma-ket **5 marta** tez bosing.

- **Boshlang'ich admin paroli:** `zakovat2026`
- Parolni **Admin panel -> Sozlamalar** bo'limidan istalgan vaqtda o'zgartirishingiz mumkin.

## Yangi savollarni kiritish va qayta Deploy qilish tartibi

1. Yashirin admin panelni oching va parolni kiriting.
2. **Turnirlar va turlar** bo'limida yangi tur (o'yin) yarating.
3. **Savollar** bo'limidan bittalab yoki **Ommaviy kiritish** bo'limidan butun bir tur savollarini (12–24 ta savolni Telegram/Word matnidan nusxalab) bir zumda qo'shing.
4. **Saytda ko'rish** tugmasi orqali o'zgarishlarni jonli tekshiring.
5. **Versiya va Deploy** bo'limiga o'tib, **`zakovat-data.js` yuklab olish** tugmasini bosing (yoki **GitHub uchun kodni nusxalash** tugmasidan foydalaning).
6. Loyihangizdagi `data/zakovat-data.js` faylini yangi yuklab olingan fayl bilan almashtiring va qayta deploy qiling:
   - **GitHub Pages:** repodagi `data/zakovat-data.js` faylini yangilab `Commit` qiling.
   - **Netlify Drop:** butun `zakovat-universitet` papkasini `app.netlify.com/drop` sahifasiga tashlang.
   - **Vercel / Cloudflare Pages:** repoga `git push` qiling.

## Asosiy imkoniyatlar

- **Bosh sahifa:** tungi oltin dizayn, qum soati bezagi, tezkor qidiruv paneli, so'nggi o'yinlar, savol namunalari, turnirlar va mavzular statistikasi.
- **Ochiq savollar bazasi va Savollar paketi:** `zakovatklubi.uz` uslubidagi toifa plitkalari, filtrlar, har bir savolda «Javobni ko'rish / yopish», «Barcha javoblarni ko'rish», tarqatma material (matn va rasm), xatcho'p (saqlash), layk, nusxalash va chop etishga tayyor HTML paket yuklab olish.
- **60 soniyalik Mashq rejimi:** real Zakovat taymeri (ovozli signal bilan) va o'zini baholash tizimi.
- **Yashirin Admin panel:** to'liq CRUD, ommaviy savol parseri, versiya boshqaruvi, `.js` / `.json` eksport va import, universitet brendini sozlash.
