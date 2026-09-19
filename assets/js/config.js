/* =========================================================================
   ALİ USTA BAKLAVALARI — İŞLETME AYARLARI

   ★★★ SİTEYİ GÜNCELLEMEK İÇİN SADECE BU DOSYAYI DÜZENLEYİN. ★★★
   Kod bilmeye gerek yok. Tırnak içindeki yazıları değiştirin, kaydedin, bitti.

   Boş bırakılan alanlar ("") sitede hiç görünmez — uydurma bilgi çıkmaz.
   ========================================================================= */
window.AU_CONFIG = {

  /* ------------------------------------------------------------------
     1) İLETİŞİM
     ------------------------------------------------------------------ */
  isim: 'Ali Usta Baklavaları',
  sube: 'Nizip Şubesi',

  telefon:        '(0342) 517 70 73',       // ekranda görünen hâli
  telefonLink:    '+903425177073',          // tıklanınca aranan numara

  /* WhatsApp numarası — ülke kodu ile, boşluksuz, + işaretsiz.
     ⚠️ AŞAĞIDAKİ NUMARA İŞLETMENİN KENDİ TANITIM VİDEOLARINDAN ALINDI
        ("Siparişleriniz için 0532 480 59 24").
        YAYINA ALMADAN ÖNCE MUTLAKA DOĞRULAYIN.
        Farklıysa sadece bu satırı değiştirin — sitedeki bütün WhatsApp
        düğmeleri, sipariş formu ve rezervasyon otomatik ona bağlanır.      */
  whatsapp:       '905324805924',
  whatsappGorunen:'0532 480 59 24',

  eposta:         '',                       // varsa yazın: 'siparis@...'

  /* Adres işletmenin kendi ambalaj kâğıdından alındı (Ağustos 2026). */
  adres:      'Sultan Abdülhamid Mah., Yavuz Sultan Selim Bulvarı, Özdemir Apt. Altı 25/A',
  adresAlt:   '27700 Nizip / Gaziantep',
  haritaLink: 'https://www.google.com/maps/search/?api=1&query=Ali+Usta+Baklavalar%C4%B1+Yavuz+Sultan+Selim+Bulvar%C4%B1+25%2FA+Nizip+Gaziantep',

  saatler:    "Her gün 10:00'da açılır",
  saatlerNot: 'Akşam saatlerine kadar açığız. Kesin kapanış saati için telefonla teyit alın.',

  /* ------------------------------------------------------------------
     2) SOSYAL MEDYA
     Hesap adresleri elimizde yok. Doğru adresi yazdığınız an düğme
     kendiliğinden siteye çıkar; boş kalırsa hiç görünmez.
     Örnek: 'https://www.instagram.com/kullaniciadi/'
     ------------------------------------------------------------------ */
  instagram: 'https://www.instagram.com/aliustabaklavalari',
  facebook:  '',                       // hesap yok — boş kalırsa düğme çıkmaz
  tiktok:    '',
  youtube:   '',

  /* ------------------------------------------------------------------
     3) FİYAT LİSTESİ
     guncelleme: fiyatların en son ne zaman kontrol edildiği.
     ⚠️ AŞAĞIDAKİ FİYATLAR YER TUTUCUDUR — gerçek fiyatlarla değiştirin.
        Değiştirmezseniz sitede "fiyatlar teyit edilmedi" uyarısı görünür.
     ------------------------------------------------------------------ */
  /* Durum: 'tahmini' | 'onayli'
     'tahmini'  → tablo gösterilir, üstünde "piyasa ortalamasına göre tahmini" uyarısı çıkar
     'onayli'   → uyarı kaybolur                                                        */
  fiyatDurum: 'onayli',
  fiyatGuncelleme: 'Eylül 2026',
  fiyatNotu: '',
  fiyatBirimNotu: '',

  /* Kilo fiyatı ve tepsi fiyatı ana ölçüdür. */
  fiyatlar: [
    { urun: 'Klasik Baklava', kg: '1.000 ₺', tam: '2.250 ₺', tepsi: '2.250 ₺' },
    { urun: 'Havuç Dilimi',   kg: '1.000 ₺', tam: '2.250 ₺', tepsi: '2.250 ₺' },
    { urun: 'Midye Baklava',  kg: '1.000 ₺', tam: '2.450 ₺', tepsi: '2.450 ₺' },
    { urun: 'Şöbiyet',        kg: '1.000 ₺', tam: '2.250 ₺', tepsi: '2.250 ₺' },
    { urun: 'Yeşil Şöbiyet',  kg: '1.800 ₺', tam: '3.850 ₺', tepsi: '3.850 ₺' },
    { urun: 'Dolama',         kg: '1.800 ₺', tam: '3.850 ₺', tepsi: '3.850 ₺' },
    { urun: 'Bülbül Yuvası',  kg: '1.000 ₺', tam: '2.250 ₺', tepsi: '2.250 ₺' },
    { urun: 'Fıstıkzade',     detay: '2 Kişilik: 400 ₺ · 3 Kişilik: 600 ₺ · 4 Kişilik: 800 ₺ · 6 Kişilik: 1.000 ₺', kg: '400 ₺’den', tam: '1.000 ₺', porsiyon: true },
    { urun: 'Dondurma',       detay: 'Sade: 500 ₺ · Karışık: 700 ₺ · Fıstıklı: 800 ₺', kg: '500 ₺', tam: '800 ₺', porsiyon: true }
  ],
  gramajlar: [],
  kargoUcreti: '≈ 250 ₺ (5 kg’a kadar)',
  kargoSure:   '1–3 iş günü',

  /* KARGO TARİFESİ — hesaplayıcı bunu kullanır.
     Bölgeler Türkiye kargo firmalarının tipik desi kademelerine göre kuruldu.
     ⚠️ Tahminidir; anlaşmalı kargo fiyatınızı yazınca kesinleşir.          */
  kargoTarife: {
    onayli: false,
    ucretsizUstu: 4000,          // bu tutarın üstünde kargo bedava (₺). 0 = kapalı
    kademeler: [                 // kg üst sınırı → temel ücret (₺)
      { kg: 1,  ucret: 180 },
      { kg: 2,  ucret: 230 },
      { kg: 4,  ucret: 300 },
      { kg: 8,  ucret: 420 },
      { kg: 15, ucret: 640 }
    ],
    kgBasiEk: 45,                // son kademenin üstünde her ek kg
    bolgeler: [
      { ad: 'Gaziantep ve çevre iller', carpan: 1.00, gun: '1 iş günü',
        iller: ['Gaziantep','Kilis','Şanlıurfa','Adıyaman','Kahramanmaraş','Osmaniye','Hatay','Adana','Mersin','Malatya','Diyarbakır','Mardin'] },
      { ad: 'Batı ve İç Anadolu', carpan: 1.15, gun: '1–2 iş günü',
        iller: ['İstanbul','Ankara','İzmir','Bursa','Kocaeli','Antalya','Konya','Kayseri','Eskişehir','Sakarya','Balıkesir','Manisa','Aydın','Denizli','Muğla','Tekirdağ','Yalova','Bilecik','Kütahya','Afyonkarahisar','Isparta','Burdur','Karaman','Aksaray','Nevşehir','Kırşehir','Niğde','Yozgat','Çankırı','Kırıkkale','Uşak','Çanakkale','Edirne','Kırklareli','Bolu','Düzce','Zonguldak','Bartın','Karabük','Kastamonu','Sinop','Çorum','Amasya','Tokat','Sivas'] },
      { ad: 'Karadeniz ve Doğu', carpan: 1.30, gun: '2–3 iş günü',
        iller: ['Samsun','Ordu','Giresun','Trabzon','Rize','Artvin','Gümüşhane','Bayburt','Erzincan','Erzurum','Kars','Ardahan','Iğdır','Ağrı','Van','Muş','Bitlis','Bingöl','Tunceli','Elazığ','Batman','Siirt','Şırnak','Hakkâri' ] }
    ]
  },

  /* ------------------------------------------------------------------
     4a-1) "TATLI DÜNYASINA FOTOĞRAF/VİDEO EKLE" ŞİFRESİ
     Yalnızca işletme sahibi/çalışanları eklesin diye. ⚠️ Bu gerçek bir
     sunucu güvenliği DEĞİLDİR — site tamamen tarayıcıda çalıştığı için
     kaynak kodu (bu dosya dahil) herkese açıktır. Sıradan ziyaretçiyi
     durdurur, kaynak kodu okuyabilen birini durdurmaz.
     Şifre burada TERS ÇEVRİLMİŞ tutulur (ilk bakışta görünmesin diye,
     şifreleme değildir). Değiştirmek için: yeni şifreyi ters çevirip
     yazın. Örn. şifre "ABC123" ise buraya "321CBA" yazılır.
     Şu anki şifre: ALİUSTA2727
     ------------------------------------------------------------------ */
  catEkleSifreTers: '7272ATSUİLA',

  /* ------------------------------------------------------------------
     4b) SEPET VE HESAPLAYICI
     ------------------------------------------------------------------ */
  sepet: {
    acik: true,
    /* Gramaj seçenekleri: yarım ve büyük tepsi kaldırıldı */
    olculer: [
      { ad: '250 g',       kg: 0.25, carpan: 0.27 },
      { ad: '500 g',       kg: 0.50, carpan: 0.52 },
      { ad: '1 kg',        kg: 1.00, carpan: 1.00 },
      { ad: 'Tepsi',       kg: 2.00, carpan: 2.00 }
    ],
    porsiyonlu: ['Fıstıkzade', 'Dondurma'],
    not: 'Kesin tutar WhatsApp’ta teyit edilir.'
  },

  /* ------------------------------------------------------------------
     4c) HEDİYE PAKETİ
     ------------------------------------------------------------------ */
  hediye: {
    acik: true,
    secenekler: [
      { ad: 'Kurdeleli hediye ambalajı', ucret: 60 },
      { ad: 'El yazısı hediye kartı',    ucret: 25 },
      { ad: 'Ahşap hediye kutusu',       ucret: 180 }
    ],
    not: 'Kimden–kime notunuzu sipariş formundaki “Not” alanına yazın.'
  },

  /* ------------------------------------------------------------------
     4d) SİPARİŞ TAKİBİ
     Kod WhatsApp’tan müşteriye verilir. Aşağıdaki listeye eklemek yeterli;
     müşteri site.com/?siparis=KOD adresinden durumu görür.
     durum: 'alindi' | 'hazirlaniyor' | 'kargoda' | 'teslim'
     ------------------------------------------------------------------ */
  takip: {
    acik: true,
    siparisler: [
      /* örnek — gerçek siparişte kopyalayıp doldurun:
      { kod: 'AU-2601', ad: 'Mehmet K.', durum: 'kargoda',
        urun: '2 kg midye baklava', tarih: '2026-08-24',
        kargoFirma: 'Aras Kargo', takipNo: '1234567890' }
      */
    ]
  },

  /* ------------------------------------------------------------------
     4e) BUGÜN VİTRİNDE
     İşletme sabah bir fotoğraf gönderir; dosyayı assets/img/vitrin/
     klasörüne koyup adını buraya yazın. Boşsa bölüm görünmez.
     ------------------------------------------------------------------ */
  vitrin: {
    tarih: '2026-09-09',
    gorsel: 'assets/img/p00.webp',
    not: 'Fıstık ezmesi öğleden sonra tükenebilir, erken gelin.',
    cesitler: [
      'Dürüm Baklava', 'Midye Baklava', 'Yeşil Şöbiyet',
      'Burma Kadayıf', 'Künefe', { ad: 'Fıstık Ezmesi', durum: 'az kaldı' }
    ]
  },

  /* ------------------------------------------------------------------
     4h) KARŞILAŞTIRMA TABLOSU
     ------------------------------------------------------------------ */
  karsilastirma: [
    { konu: 'Yağ',            biz: 'Sade yağ',                     onlar: 'Margarin / karışım yağ' },
    { konu: 'Tatlandırıcı',   biz: 'Doğal pancar şekeri',          onlar: 'Glikoz şurubu' },
    { konu: 'Fıstık',         biz: 'Doğal Antep fıstığı',          onlar: 'Aylar önce kavrulmuş, boyalı olabilir' },
    { konu: 'Yufka',          biz: 'Elde açılmış, kırk kat',       onlar: 'Makine yufkası, sabit kalınlık' },
    { konu: 'Koruyucu',       biz: 'Yok',                          onlar: 'Raf ömrü uzatıcı katkı' },
    { konu: 'Üretim',         biz: 'Her sabah, o günlük',          onlar: 'Haftalık parti üretim' },
    { konu: 'Raf ömrü',       biz: '3–4 gün (kuru: 10–15)',        onlar: '30+ gün' },
    { konu: 'Vitrin',         biz: 'Akşam boşalır',                onlar: 'Ertesi güne devreder' }
  ],

  /* ------------------------------------------------------------------
     4i) TEMA VE SES
     ------------------------------------------------------------------ */
  tema: { varsayilan: 'koyu', secilebilir: true },

  /* ------------------------------------------------------------------
     FISTIK YAĞMURU
     Boş bölümlerde, içeriğin arkasında süzülen fıstık taneleri.
     Görsel dosya kullanılmaz; taneler sitenin kendi renkleriyle çizilir.
     Kapatmak için: acik: false  (tek satır, başka hiçbir şey gerekmez)
     yogunluk: 1 normal, 0.6 seyrek, 1.5 yoğun
     ------------------------------------------------------------------ */
  fistikYagmuru: { acik: true, yogunluk: 1 },

  /* ------------------------------------------------------------------
     ÖZEL İMLEÇ
     Altın baklava elması + gecikmeli halka + fıstık kırıntısı izi.
     Sistem oku gizlenir; form alanlarında ve metin seçerken geri gelir.
     Dokunmatik cihazlarda hiç kurulmaz.
     acik: false  → sistemin standart oku kullanılır
     iz:   false  → kırıntı izi kapanır, elmas ve halka kalır
     ------------------------------------------------------------------ */
  imlec: { acik: true, iz: true },
  sesTasarimi: { acik: true, varsayilanAcik: false, seviye: 0.22 },

  /* ------------------------------------------------------------------
     4j) BÜLTEN
     Buttondown / Mailchimp form adresini yazın. Boşsa WhatsApp kullanılır.
     ------------------------------------------------------------------ */
  bulten: {
    acik: true,
    formUrl: '',               // örn: 'https://buttondown.email/api/emails/embed-subscribe/aliusta'
    baslik: 'Bayram ve sezon duyuruları',
    metin: 'Yılda birkaç mesaj — bayram siparişleri açıldığında, güllaç mevsimi geldiğinde haber veririz. Reklam yok.'
  },

  /* ------------------------------------------------------------------
     4k) GOOGLE YORUMLARI — otomatik çekme (isteğe bağlı)
     Google Maps JavaScript API anahtarı + Place ID girilirse yorumlar
     otomatik gelir. ⚠️ Google üçüncü taraflara EN FAZLA 5 yorum verir;
     kalanı için Google sayfanızdan kopyalayıp
     `python _work/yorum_ekle.py` ile aktarın.
     ------------------------------------------------------------------ */
  googlePlaces: { apiKey: '', placeId: '' },

  /* ------------------------------------------------------------------
     4l) SUPABASE (isteğe bağlı) — yorumlar anında yayınlansın
     supabase.com’da ücretsiz proje açıp URL ve anon anahtarını yazın.
     Kurulum adımları README bölüm 14’te.
     ------------------------------------------------------------------ */
  supabase: { url: 'https://npmvfwmzeluxkyzanjyk.supabase.co', anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbXZmd216ZWx1eGt5emFuanlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3OTcyNjgsImV4cCI6MjEwNTM3MzI2OH0.uuq32_ZAXKvgg7kmYdPK7GFF8LrEG6Yg-bUNOUxUYTU', tablo: 'yorumlar' },


  /* ------------------------------------------------------------------
     4) FORMLAR
     Siparişler ve rezervasyonlar doğrudan WhatsApp'a gider — kayıt olmak,
     sunucu kurmak, ücret ödemek gerekmez. Mesaj işletme WhatsApp'ında
     görünür, oradan cevaplanır.

     İsterseniz ayrıca e-postaya da düşsün: web3forms.com adresinden
     ücretsiz bir "Access Key" alıp aşağıya yapıştırın. Boş bırakırsanız
     yalnızca WhatsApp kullanılır.
     ------------------------------------------------------------------ */
  web3formsKey: '',

  /* ------------------------------------------------------------------
     5) REZERVASYON
     ------------------------------------------------------------------ */
  rezervasyon: {
    acik: true,
    minKisi: 1,
    maxKisi: 60,
    enErkenSaat: '10:00',
    enGecSaat:   '22:00',
    not: 'Açık hava bölümü ve iç salon için rezervasyon alınır. 15 kişi üstü gruplarda en az 1 gün önceden haber verin.'
  },

  /* ------------------------------------------------------------------
     6) GOOGLE DEĞERLENDİRMELERİ
     Gerçek Google verisi: 4,5 puan / 117 değerlendirme.
     yorumlar[] dizisi BOŞ olduğu sürece sitede "yer tutucu" uyarısı çıkar.
     Gerçek yorumları eklediğinizde uyarı kendiliğinden kaybolur ve
     arama motorlarına Review yapısal verisi gönderilir.

     Örnek:
     { ad: 'Mehmet K.', puan: 5, tarih: '2026-06-14',
       metin: 'Antep’te yediğim en iyi midye baklava.' },
     ------------------------------------------------------------------ */
  googlePuan:  4.5,
  googleAdet:  117,
  googleLink:  'https://www.google.com/maps/search/?api=1&query=Ali+Usta+Baklavalar%C4%B1+Nizip',

  /* ------------------------------------------------------------------
     DEĞERLENDİRME KAYNAKLARI
     Bunlar uydurma değildir; herkese açık listeleme sayfalarından
     alınmıştır. Yorum METİNLERİ hiçbir servisten toplu alınamıyor
     (Google API'si üçüncü taraflara en fazla 5 yorum verir), o yüzden
     buraya yalnızca doğrulanabilir sayılar yazıldı.
     Yorum metinlerini eklemek için: python _work/yorum_ekle.py
     ------------------------------------------------------------------ */
  degerlendirmeler: [
    { kaynak: 'Google', puan: 4.5, adet: 117,
      link: 'https://www.google.com/maps/search/?api=1&query=Ali+Usta+Baklavalar%C4%B1+Nizip',
      not: 'İşletme kaydındaki güncel ortalama.' }
  ],
  /* Ziyaretçi değerlendirmelerinde en çok tekrar eden çeşitler. */
  oneCikan: {
    urunler: ['Burma Kadayıf', 'Dondurma', 'Şöbiyet'],
    kisiBasi: '₺100–200',
    kaynak: ''
  },

  /* Ziyaretçi yorumu geldiğinde ne olsun?
     'whatsapp' → yorum işletmenin WhatsApp hattına düşer, siz onaylayıp
                  aşağıdaki yorumlar[] listesine eklersiniz.                     */
  yorumGonderim: 'whatsapp',

  /* SİTEDE GÖSTERİLEN YORUMLAR
     Bu liste boş olduğu sürece "yer tutucu" uyarısı görünür.
     Google'daki gerçek yorumları buraya kopyalayın:
       { ad: 'Mehmet K.', puan: 5, tarih: '2026-06-14',
         metin: 'Antep’te yediğim en iyi midye baklava.' },                      */
  yorumlar: [  ],

  /* ------------------------------------------------------------------
     11) ÜRÜN DETAYLARI — alerjen, saklama, raf ömrü
     Ürün adları "Ürünler" bölümündeki adlarla birebir aynı olmalı.
     ------------------------------------------------------------------ */
  urunDetay: {
    'Klasik Baklava':   { icindekiler: 'Un, su, tereyağı, Antep fıstığı, pancar şekeri, nişasta', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 4–5 dilim' },
    'Dürüm Baklava':    { icindekiler: 'Un, su, tereyağı, Antep fıstığı, pancar şekeri, nişasta', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 3–4 dilim' },
    'Hasır Künefe':     { icindekiler: 'Tel kadayıf, sade yağ / tereyağı, tuzsuz künefe peyniri, Antep fıstığı, şeker şerbeti', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Taze ve sıcak tüketilmesi önerilir', raf: 'Aynı gün', porsiyon: '1 tepsi ≈ 2–3 kişilik' },
    'Midye Baklava':    { icindekiler: 'Un, su, tereyağı, Antep fıstığı, pancar şekeri, nişasta', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 4–5 adet' },
    'Burma Kadayıf':    { icindekiler: 'Tel kadayıf, sade yağ / tereyağı, bol Antep fıstığı, pancar şekeri şerbeti', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '7–10 gün', porsiyon: '100 g ≈ 2–3 adet' },
    'Şöbiyet':          { icindekiler: 'Un, su, tereyağı, kaymak, Antep fıstığı, pancar şekeri', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Buzdolabında', raf: '2 gün — kaymaklı olduğu için', porsiyon: '100 g ≈ 3 adet' },
    'Yeşil Şöbiyet':    { icindekiler: 'Un, su, tereyağı, kaymak, Antep fıstığı, pancar şekeri', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Buzdolabında', raf: '2 gün', porsiyon: '100 g ≈ 3 adet' },
    'Yaprak Şöbiyet':   { icindekiler: 'Un, su, tereyağı, kaymak, Antep fıstığı, pancar şekeri', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Buzdolabında', raf: '2 gün', porsiyon: '100 g ≈ 3 adet' },
    'Dolama':           { icindekiler: 'Un, su, tereyağı, Antep fıstığı, pancar şekeri', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 3 adet' },
    'Saray Dolması':    { icindekiler: 'Un, su, tereyağı, Antep fıstığı (%60+), pancar şekeri', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 3 adet' },
    'Fıstık Ezmesi':          { icindekiler: 'Antep fıstığı, pancar şekeri', alerjen: ['Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '10–15 gün', porsiyon: '100 g ≈ 4–5 dilim' },
    'Antep Özel':             { icindekiler: 'Un, su, tereyağı, bol Antep fıstığı, pancar şekeri, nişasta', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 4 dilim' },
    'Bülbül Yuvası':    { icindekiler: 'Un, su, tereyağı, Antep fıstığı, pancar şekeri', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 4 adet' },
    'Havuç Dilimi':     { icindekiler: 'Un, su, tereyağı, bol Antep fıstığı, pancar şekeri, nişasta', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 2–3 dilim' },
    'Fıstıkzade Künefe ve Yarı Fıstıkzade Yarı Billuriye': { icindekiler: 'Tel kadayıf, sade yağ, tuzsuz künefe peyniri, bol Antep fıstığı, şeker şerbeti', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Taze ve sıcak tüketilmesi önerilir', raf: 'Aynı gün', porsiyon: '2, 3, 4 ve 6 kişilik' },
    'Fıstıkzade Künefe': { icindekiler: 'Tel kadayıf, sade yağ, tuzsuz künefe peyniri, bol Antep fıstığı, şeker şerbeti', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Taze ve sıcak tüketilmesi önerilir', raf: 'Aynı gün', porsiyon: '2, 3, 4 ve 6 kişilik' },
    'Saray Sarması':    { icindekiler: 'Un, su, tereyağı, Antep fıstığı, pancar şekeri', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 3 adet' },
    'Fıstıkzade':        { icindekiler: 'Tel kadayıf, sade yağ, tuzsuz künefe peyniri, bol Antep fıstığı, şeker şerbeti', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Taze ve sıcak tüketilmesi önerilir', raf: 'Aynı gün', porsiyon: '2, 3, 4 ve 6 kişilik' },
  }
};
