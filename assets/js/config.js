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

  adres:      'Sultan Abdülhamit Mah., Kanuni Sultan Süleyman Bulvarı 25/A',
  adresAlt:   '27700 Nizip / Gaziantep',
  haritaLink: 'https://www.google.com/maps/search/?api=1&query=Ali+Usta+Baklavalar%C4%B1+Kanuni+Sultan+S%C3%BCleyman+Bulvar%C4%B1+25%2FA+Nizip+Gaziantep',

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
  fiyatDurum: 'tahmini',
  fiyatGuncelleme: 'Ağustos 2026',
  fiyatNotu: 'Fiyatlar mevsime, fıstık rekoltesine ve çeşit karışımına göre değişir. Kesin tutar için WhatsApp\'tan yazın.',
  /* Tepsi sütunlarının bazı ürünlerde ne anlama geldiğini açıklar. */
  fiyatBirimNotu: 'Kavrulmuş fıstık ve dondurmada “yarım tepsi” 500 g, “tam tepsi” 1 kg paketi gösterir. Künefe ve güllaçta ise 4 ve 8 kişilik tepsidir; porsiyon fiyatı künefede 190 ₺, güllaçta 160 ₺, dondurmada top başına 70 ₺’dir.',

  /* Kilo fiyatı ana ölçüdür. Yarım tepsi ≈ 1 kg, tam tepsi ≈ 2 kg;
     tepsi alımında kilo fiyatına göre küçük bir avantaj uygulanır. */
  fiyatlar: [
    { urun: 'Normal Baklava',    kg: '1.150 ₺', yarim: '1.150 ₺', tam: '2.250 ₺' },
    { urun: 'Kare Baklava',      kg: '1.200 ₺', yarim: '1.200 ₺', tam: '2.350 ₺' },
    { urun: 'Havuç Dilimi',      kg: '1.200 ₺', yarim: '1.200 ₺', tam: '2.350 ₺' },
    { urun: 'Midye Baklava',     kg: '1.300 ₺', yarim: '1.300 ₺', tam: '2.550 ₺' },
    { urun: 'Kuru Baklava',      kg: '1.100 ₺', yarim: '1.100 ₺', tam: '2.150 ₺' },
    { urun: 'Şöbiyet',           kg: '1.350 ₺', yarim: '1.350 ₺', tam: '2.650 ₺' },
    { urun: 'Yaprak Şöbiyet',    kg: '1.400 ₺', yarim: '1.400 ₺', tam: '2.750 ₺' },
    { urun: 'Dolama',            kg: '1.350 ₺', yarim: '1.350 ₺', tam: '2.650 ₺' },
    { urun: 'Kuşgözü',           kg: '1.300 ₺', yarim: '1.300 ₺', tam: '2.550 ₺' },
    { urun: 'Bülbül Yuvası',     kg: '1.300 ₺', yarim: '1.300 ₺', tam: '2.550 ₺' },
    { urun: 'Special Karışım',   kg: '1.350 ₺', yarim: '1.350 ₺', tam: '2.650 ₺' },
    { urun: 'Fıstık Ezmesi',     kg: '1.650 ₺', yarim: '1.650 ₺', tam: '3.250 ₺' },
    /* Aşağıdaki dört üründe tepsi yerine paket/porsiyon ölçüsü geçerlidir;
       tablonun altındaki not bunu açıklar.                                    */
    { urun: 'Kavrulmuş Fıstık',  kg: '1.450 ₺', yarim: '760 ₺',   tam: '1.450 ₺' },
    { urun: 'Künefe (porsiyon)', kg: '780 ₺',   yarim: '720 ₺',   tam: '1.380 ₺' },
    { urun: 'Güllaç (porsiyon)', kg: '720 ₺',   yarim: '680 ₺',   tam: '1.300 ₺' },
    { urun: 'Dondurma (top)',    kg: '560 ₺',   yarim: '300 ₺',   tam: '560 ₺' }
  ],
  gramajlar: [
    { olcu: 'Kilo ile',    gram: '250 g’dan itibaren', kisi: '2–3 kişi / 250 g' },
    { olcu: 'Yarım tepsi', gram: '≈ 1 kg',             kisi: '8–10 kişi' },
    { olcu: 'Tam tepsi',   gram: '≈ 2 kg',             kisi: '16–20 kişi' },
    { olcu: 'Büyük tepsi', gram: '≈ 4 kg',             kisi: '30–40 kişi' }
  ],
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
     4b) SEPET VE HESAPLAYICI
     ------------------------------------------------------------------ */
  sepet: {
    acik: true,
    /* Gramaj çarpanları: kilo fiyatına göre. Tepside küçük avantaj vardır. */
    olculer: [
      { ad: '250 g',       kg: 0.25, carpan: 0.27 },
      { ad: '500 g',       kg: 0.50, carpan: 0.52 },
      { ad: '1 kg',        kg: 1.00, carpan: 1.00 },
      { ad: 'Yarım tepsi', kg: 1.00, carpan: 1.00 },
      { ad: 'Tam tepsi',   kg: 2.00, carpan: 1.96 },
      { ad: 'Büyük tepsi', kg: 4.00, carpan: 3.85 }
    ],
    porsiyonlu: ['Künefe (porsiyon)', 'Güllaç (porsiyon)', 'Dondurma (top)'],
    not: 'Tutarlar tahminidir; kesin fiyat WhatsApp’ta teyit edilir.'
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
    tarih: '',                  // örn: '2026-08-26'
    gorsel: '',                 // örn: 'vitrin-2026-08-26.webp'
    not: '',                    // örn: 'Bugün fıstık ezmesi ve şöbiyet bol.'
    cesitler: []                // örn: ['Midye baklava','Şöbiyet','Künefe']
  },

  /* ------------------------------------------------------------------
     4f) INSTAGRAM STORY ARŞİVİ
     Haftalık seçilmiş kareler. Görselleri assets/img/story/ klasörüne koyun.
     ------------------------------------------------------------------ */
  storyArsivi: [],              // { gorsel:'...', baslik:'...', tarih:'2026-08-20' }

  /* ------------------------------------------------------------------
     4g) BLOG / HİKÂYELER
     ------------------------------------------------------------------ */
  yazilar: [
    { slug: 'kirk-kat-yufka',
      baslik: 'Yufka neden kırk kat?',
      ozet: 'Kırk sayısı gelenekten mi geliyor, fizikten mi? Katman sayısı baklavanın çıtırlığını nasıl belirliyor?',
      tarih: '2026-08-10', okuma: 4, kapak: 'p45',
      icerik: [
        'Antep baklavasında “kırk kat” bir süsleme değil, ölçü. Yufka ne kadar inceyse o kadar çok kat açılabilir; her kat arasına giren tereyağı fırında buharlaşırken katmanları birbirinden ayırır. Çıtırlığın kaynağı bu ayrışmadır.',
        'Ustanın oklava altında yufkayı ne kadar inceltebildiği, kaç kat açabileceğini belirler. Otuz katın altına düşen baklava hamurumsu kalır; elliyi geçen baklava ise dağılır. Kırk civarı, yüzyıllar içinde deneme yanılmayla bulunmuş denge noktasıdır.',
        'Ali Usta’nın tezgâhında yufka elde açılır. Makineyle açılan yufkanın kalınlığı sabittir; el, hamurun o günkü nemine göre kalınlığı değiştirir. Aynı tarif, aynı un, farklı gün — farklı kalınlık. Ölçü değil, sezgi.'
      ] },
    { slug: 'antep-fistigi-neden-yesil',
      baslik: 'Antep fıstığı neden bu kadar yeşil?',
      ozet: 'Rengin sırrı toprakta mı, hasat zamanında mı? Gerçek Antep fıstığını taklidinden ayıran işaretler.',
      tarih: '2026-07-28', okuma: 5, kapak: 'p64',
      icerik: [
        'Fıstığın yeşilliği klorofil ve antosiyanin dengesinden gelir. Hasat erken yapılırsa iç fıstık koyu yeşil, geç yapılırsa sarımsı olur. Baklavalık fıstık bilerek erken toplanır — hem daha yeşil hem daha aromatiktir.',
        'Gaziantep’in fıstık kuşağı, kireçli toprak ve sert kışlarıyla bu rengi destekler. Aynı ağaç başka toprakta daha soluk ürün verir. Coğrafi işaret tescilinin sebebi de budur.',
        'Boyalı fıstığı ayırt etmek kolay: avucunuzda ovun. Gerçek fıstık elinizi boyamaz, kırıldığında iç kısmı da dışı kadar yeşildir. Kokusu tereyağımsıdır; boyalı olan kokusuzdur.'
      ] },
    { slug: 'serbet-nasil-kaynatilir',
      baslik: 'Şerbetin kıvamı nasıl tutturulur?',
      ozet: 'Bir derece fark, baklavayı ya sünger yapar ya cam. Ustanın gözle ölçtüğü kıvam noktası.',
      tarih: '2026-07-12', okuma: 4, kapak: 'p41',
      icerik: [
        'Şerbet, su ile şekerin belli bir yoğunluğa gelene kadar kaynatılmasıdır. Fazla kaynarsa şeker kristalleşir, baklava cam gibi sertleşir; az kaynarsa yufkaya işlemez, tepsi dibinde birikir.',
        'Doğru kıvam, kaşıktan akarken ipliğe benzer bir iz bırakır. Termometre 104–106 °C gösterir ama usta termometreye bakmaz; kaşığın kenarındaki akışa bakar.',
        'Bir kural daha var: sıcak baklavaya soğuk şerbet, soğuk baklavaya sıcak şerbet. İkisi de sıcak olursa yufka yumuşar, ikisi de soğuk olursa şerbet emilmez.'
      ] },
    { slug: 'baklava-nasil-saklanir',
      baslik: 'Baklava buzdolabında saklanır mı?',
      ozet: 'En sık sorulan soru ve en sık yapılan hata. Çeşide göre doğru saklama yöntemi.',
      tarih: '2026-06-30', okuma: 3, kapak: 'p24',
      icerik: [
        'Kısa cevap: sade fıstıklı baklava buzdolabına girmez. Soğuk, tereyağını katılaştırır ve yufkayı sertleştirir. Oda sıcaklığında, ağzı kapalı bir kutuda 3–4 gün tazeliğini korur.',
        'İstisna kaymaklı çeşitlerdir. Şöbiyet, yaprak şöbiyet ve kaymaklı sunumlar buzdolabında saklanmalı ve iki gün içinde tüketilmelidir — kaymak bozulur.',
        'Kuru baklava en dayanıklısıdır: az şerbetli olduğu için oda sıcaklığında 10–15 gün durur. Kargoya bu yüzden kuru baklava tercih edilir.'
      ] },
    { slug: 'kunefe-mi-baklava-mi',
      baslik: 'Künefe mi, baklava mı?',
      ozet: 'İki tatlının hangi durumda birbirinden daha iyi olduğuna dair dürüst bir kılavuz.',
      tarih: '2026-06-14', okuma: 3, kapak: 'p37',
      icerik: [
        'Künefe sıcak yenir, baklava beklemeyi kaldırır. Misafirlik, ikram ve hediye için baklava; oturup yemek için künefe.',
        'Künefe kargoya gitmez — tel kadayıf ve peynir soğuyunca dokusunu kaybeder. Uzağa gönderilecekse baklava, özellikle kuru baklava tercih edilmeli.',
        'Kalabalık sofralarda ikisini birden koymak en iyisidir: baklava tepside bekler, künefe sırayla tezgâhtan gelir.'
      ] }
  ],

  /* ------------------------------------------------------------------
     4h) KARŞILAŞTIRMA TABLOSU
     ------------------------------------------------------------------ */
  karsilastirma: [
    { konu: 'Yağ',            biz: 'Gerçek tereyağı',              onlar: 'Margarin / karışım yağ' },
    { konu: 'Tatlandırıcı',   biz: 'Doğal pancar şekeri',          onlar: 'Glikoz şurubu' },
    { konu: 'Fıstık',         biz: 'Aynı sabah kavrulmuş Antep',   onlar: 'Aylar önce kavrulmuş, boyalı olabilir' },
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
  supabase: { url: '', anonKey: '', tablo: 'yorumlar' },


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
    urunler: ['Kuru Baklava', 'Dondurma', 'Künefe'],
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
    'Normal Baklava':   { icindekiler: 'Un, su, tereyağı, Antep fıstığı, pancar şekeri, nişasta', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 4–5 dilim' },
    'Kare Baklava':     { icindekiler: 'Un, su, tereyağı, Antep fıstığı, pancar şekeri, nişasta', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 3–4 dilim' },
    'Havuç Dilimi':     { icindekiler: 'Un, su, tereyağı, Antep fıstığı, pancar şekeri, nişasta', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 2–3 dilim' },
    'Midye Baklava':    { icindekiler: 'Un, su, tereyağı, Antep fıstığı, pancar şekeri, nişasta', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 4–5 adet' },
    'Kuru Baklava':     { icindekiler: 'Un, su, tereyağı, Antep fıstığı, pancar şekeri, nişasta', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kuru yerde', raf: '10–15 gün — kargoya en uygunu', porsiyon: '100 g ≈ 4 dilim' },
    'Şöbiyet':          { icindekiler: 'Un, su, tereyağı, kaymak, Antep fıstığı, pancar şekeri', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Buzdolabında', raf: '2 gün — kaymaklı olduğu için', porsiyon: '100 g ≈ 3 adet' },
    'Yaprak Şöbiyet':   { icindekiler: 'Un, su, tereyağı, kaymak, Antep fıstığı, pancar şekeri', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Buzdolabında', raf: '2 gün', porsiyon: '100 g ≈ 3 adet' },
    'Dolama':           { icindekiler: 'Un, su, tereyağı, Antep fıstığı, pancar şekeri', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 3 adet' },
    'Kuşgözü':          { icindekiler: 'Un, su, tereyağı, Antep fıstığı, pancar şekeri', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 8–10 adet' },
    'Bülbül Yuvası':    { icindekiler: 'Un, su, tereyağı, Antep fıstığı, pancar şekeri', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Oda sıcaklığında, kapalı kutuda', raf: '3–4 gün', porsiyon: '100 g ≈ 4 adet' },
    'Special Karışım':  { icindekiler: 'Tepsideki bütün çeşitlerin karışımı', alerjen: ['Gluten','Süt','Sert kabuklu yemiş (fıstık)'], saklama: 'Kaymaklı çeşit varsa buzdolabında', raf: '2–4 gün', porsiyon: '1 kg ≈ 8–10 kişi' },
    'Kavrulmuş Fıstık': { icindekiler: 'Antep fıstığı, tuz (isteğe bağlı)', alerjen: ['Sert kabuklu yemiş (fıstık)'], saklama: 'Ağzı kapalı kavanozda, serin ve kuru yerde', raf: '1 ay', porsiyon: '100 g ≈ 2 avuç' }
  },

  /* ------------------------------------------------------------------
     12) SIKÇA SORULANLAR
     ------------------------------------------------------------------ */
  sss: [
    { s: 'Kargo kaç günde gelir?',
      c: 'Siparişiniz kargoya verileceği sabah üretilir. Teslimat Türkiye genelinde 1–3 iş günü sürer. Yola çıkacak tepsiler az şerbetli hazırlanır, sarsıntıya dayanıklı kutuya konur.' },
    { s: 'Baklava kaç gün dayanır?',
      c: 'Kuru baklava oda sıcaklığında 10–15 gün, normal fıstıklı baklava 3–4 gün tazeliğini korur. Şöbiyet ve kaymaklı çeşitler buzdolabında 2 gün içinde tüketilmelidir.' },
    { s: 'Koruyucu madde kullanıyor musunuz?',
      c: 'Hayır. Şerbet doğal pancar şekerinden kaynatılır; raf ömrünü uzatan hiçbir katkı, koruyucu veya glikoz şurubu kullanılmaz. Bu yüzden baklavamız günlük üretilir.' },
    { s: 'Margarin mi tereyağı mı kullanıyorsunuz?',
      c: 'Yalnızca gerçek tereyağı. Margarin, hidrojenize yağ veya karışım yağ kullanılmaz.' },
    { s: 'Düğün ve toplu sipariş alıyor musunuz?',
      c: 'Evet. Düğün, nişan, doğum günü, bayram ve kurumsal ikram siparişleri alınır. Tepsi ölçüsü, çeşit dağılımı ve teslim saati siparişe göre ayarlanır. Yoğun günler için birkaç gün önceden haber vermek yeterlidir.' },
    { s: 'Rezervasyon yapabilir miyim?',
      c: 'Evet. Açık hava oturma bölümü ve iç salon için rezervasyon alıyoruz. Kalabalık gruplar için en az bir gün önceden haber vermenizi rica ederiz. Rezervasyon formu doğrudan WhatsApp hattımıza düşer.' },
    { s: 'Alerjen bilgisi var mı?',
      c: 'Bütün ürünlerimiz Antep fıstığı (sert kabuklu yemiş), gluten ve süt ürünü içerir. Aynı tezgâhta üretildikleri için çapraz bulaşma ihtimali vardır. Ürün kartlarındaki "Detay" bağlantısından her ürünün alerjen listesine ulaşabilirsiniz.' },
    { s: 'Açık hava oturma bölümü var mı?',
      c: 'Evet. Baklavanızı dükkânda, çayla birlikte açık havada yiyebilirsiniz.' }
  ]
};
