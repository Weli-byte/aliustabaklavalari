# -*- coding: utf-8 -*-
"""config.js'e yeni özelliklerin ayarlarını ekler."""
import io

s = io.open('assets/js/config.js', encoding='utf-8').read()

# --------------------------------------------------------------- kargo ucreti
s = s.replace(
  "  kargoUcreti: '',                // teyit edilince yazın, örn: '₺250 — 5 kg’a kadar'\n"
  "  kargoSure:   '1–3 iş günü',",
  """  kargoUcreti: '≈ 250 ₺ (5 kg’a kadar)',
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
""")

io.open('assets/js/config.js', 'w', encoding='utf-8').write(s)
print('config.js genisletildi:', len(s), 'karakter')
