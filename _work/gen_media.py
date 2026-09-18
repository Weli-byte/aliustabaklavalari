# -*- coding: utf-8 -*-
"""
Ali Usta Baklavaları — medya haritasi ureticisi.

DATA/ klasorundeki her fotograf ve video sitede tam olarak bir yerde kullanilir.
Betik, kullanilmadan kalan dosya varsa assert ile durur.
"""
import json, io, os

img = {m['key']: m for m in json.load(io.open('_work/img_manifest.json', encoding='utf-8'))}
vid = {m['key']: m for m in json.load(io.open('_work/vid_manifest.json', encoding='utf-8'))}

def P(n): return 'p%02d' % n
def V(n): return 'v%02d' % n

# ---------------------------------------------------------------- HERO
# Isletmenin profesyonel tanitim filmi. Tek basina, tam ekran.
HERO = dict(
    src='assets/video/hero.mp4?v=48',
    srcSmall='assets/video/hero-sm.mp4?v=48',
    poster='assets/video/poster/hero.webp?v=48',
    w=1280, h=720, dur=10.0,
    file='Hero - Ali Usta dukkan ve kunefe tanitim.mp4',
)

# ---------------------------------------------------------------- MIRAS
MIRAS   = [P(12), P(33), P(60), P(19)]
MIRAS_V = V(5)

# ---------------------------------------------------------------- URUNLER
RAIL = [
 ("Klasik Baklava","Kırk kat yufka, tereyağı, Antep fıstığı. Ustanın el açtığı klasik.",[22,45]),
 ("Dürüm Baklava","Kalın fıstık dolgusu, kare kesim. Tepside dizilişiyle bile iddialı.",[28,4]),
 ("Hasır Künefe","Yuvarlak tepside dilim kesim. Bayram ve ikram sofralarının klasik sunumu.",[55,32]),
 ("Midye Baklava","İnce yufkanın kıvrılıp kapanmasıyla açılan sedef formu.",[26,42]),
 ("Burma Kadayıf","Az şerbetli, uzun ömürlü. Kargoya en dayanıklısı.",[1]),
 ("Yeşil Şöbiyet","Katmanları yaprak gibi ayrılan, üstü baştan aşağı fıstıklı.",[66]),
 ("Dolama","Fıstığın etrafına sarılan ince yufka. Sarma tekniğinin ustalık sınavı.",[8]),
 ("Antep Özel","Taş değirmende çekilmiş Antep fıstığı, şekerle yoğrulup tepsiye basılır.",[49]),
 ("Bülbül Yuvası","Yuva biçiminde kıvrılmış yufka, göbeği fıstıkla doldurulmuş.",[6]),
 ("Havuç Dilimi","Tek tepside bütün çeşitler. Misafir ağırlamanın kestirme yolu.",[63]),
 ("Fıstıkzade Künefe ve Yarı Fıstıkzade Yarı Billuriye","Baklavanın içine giren fıstığın kendisi — kabuğu alınmış, mor zarlı, kavrulmamış.",[53,7]),
 ("Saray Sarması","Fıstığın etrafına sarılan ince yufka, rulo kesim. Tezgâhın en zarif işi.",[44]),
]

# ---------------------------------------------------------------- TEZGAH
# Uretim kayitlari. Kullanicinin istegi uzerine kategorilere ayrilmadi.
TEZGAH = [V(0), V(1), V(3), V(6), V(9), V(11)]
TEZGAH_CAP = {
 'v00':'Kadayıf tezgâhı — telin açılışı',
 'v01':'Ustanın elinden dondurma yapımı',
 'v03':'Vitrin dizilişi ve günlük kesim',
 'v06':'Şerbetin ocakta kıvama gelmesi',
 'v09':'',
 'v11':'Dilimleme — bıçak açısı ustalık işi',
}

# ---------------------------------------------------------------- KATEGORILER
# Tatli turune gore duzenli galeri. Her karo ayni oranda.
CATS = [
 dict(id="baklava", ad="Baklava", kicik="Tezgâhın ana işi",
  ozet="Kırk kat yufka elde açılır, arasına günlük kavrulmuş Antep fıstığı serpilir, "
       "gerçek tereyağıyla fırına girer. Fırından çıktığı anda doğal pancar şekerinden "
       "kaynatılmış şerbet dökülür. Kesim biçimi çeşidi belirler: kare, midye, yuvarlak tepsi, "
       "dolama, şöbiyet. Hepsi aynı hamurdan, ayıran tek şey ustanın elindeki bıçak açısı.",
  kapak=P(13),
  fotograflar=[P(13), P(40), P(41), P(43), P(25), P(10)],
  videolar=[V(4), V(7), V(8), V(13),
            V(17), V(19), V(20), V(23), V(24)]),

 dict(id="kunefe", ad="Künefe", kicik="Sıcak servis",
  ozet="Tel kadayıf iki kat hâlinde bakır tepsiye yayılır, arasına tuzsuz tel peynir konur, "
       "ocakta iki yüzü de kızarana kadar çevrilir. Sıcakken şerbetlenir, üstüne fıstık, "
       "yanına kaymak. Künefe beklemez — tezgâhtan tabağa gider, peynir uzarken yenir.",
  kapak=P(37),
  fotograflar=[P(37), P(56), P(57), P(62), P(24), P(30), P(46), P(38),
               P(65), P(51), P(52), P(64), P(58)],
  videolar=[V(2), V(12), V(14), V(15)]),

 dict(id="dondurma", ad="Dondurma & Fıstık Ezmesi", kicik="Soğuk taraf",
  ozet="Antep fıstığı taş değirmende çekilir, şekerle yoğrulur; ortaya kaymak ya da dondurma "
       "girer. Yazın en çok istenen çeşit budur: sıcak baklavanın yanında soğuk bir kaşık. "
       "Fıstık ezmesi ayrıca tepsiyle de satılır, kesilip porsiyon hâlinde servis edilir.",
  kapak=P(34),
  fotograflar=[P(34), P(36)],
  videolar=[]),

 dict(id="ozel", ad="Özel Tatlılar", kicik="Mevsimlik ve özel gün",
  ozet="Kaymaklı katmanlar, çikolata kaplı dilimler, hindistan cevizli kare kesim, mevsiminde "
       "çilekli tepsiler ve Ramazan'da güllaç. Vitrinin klasik baklava dışında kalan tarafı — "
       "her biri aynı tezgâhta, aynı malzemeyle yapılır.",
  kapak=P(5),
  fotograflar=[P(5), P(9), P(29), P(35), P(20)],
  videolar=[]),

 dict(id="dukkan", ad="Dükkân & Vitrin", kicik="Nizip'teki tezgâh",
  ozet="Yavuz Sultan Selim Bulvarı'ndaki dükkân, her sabah 10:00'da sıfırdan dolan vitrin "
       "ve açık hava oturma bölümü. Akşama kalan tepsi ertesi güne devretmez — vitrinde "
       "gördüğünüz her şey o gün yapılmıştır.",
  kapak=P(3),
  fotograflar=[P(3), P(15), P(21), P(50), P(18)],
  videolar=[]),
]

CAP = {
 # baklava
 'p13':'Bülbül Yuvası','p40':'Dolama',
 'p41':'Altın Rengi Tepsi','p43':'Yeşil Midye',
 'p25':'Şöbiyet','p10':'Midye',
 'v04':'','v07':'',
 'v08':'','v13':'',
 'v17':'Antep Özel',
 'v19':'','v20':'',
 'v23':'','v24':'',
 # kunefe
 'p37':'Künefe — peynirin uzayışı','p56':'Künefe, fıstıkla taçlandırılmış',
 'p57':'Künefe — fıstık tepesi',
 'p24':'Fıstıklı burma kadayıf','p30':'Fıstıklı kadayıf','p46':'Cevizli künefe',
 'p38':'Billuriye',
 'v02':'Ocakta künefe — bakır tepside çevirme','v12':'Künefe ve kaymak servisi',
 'v14':'Künefenin tabakta açılışı','v15':'Tel kadayıfın çekişi',
 'p65':'Fıstıkzade Künefe','p51':'Hasır kadayıf',
 'p52':'Dördü bir arada','p64':'Yarı fıstıkzade yarı billuriye',
 'p58':'Fıstıklı künefe ve meyve tabağı sunumu',
 # dondurma & fistik ezmesi
 'p34':'','p36':'',
 # ozel
 'p05':'Sütlü kadayıf','p09':'Sütlü kadayıf',
 'p29':'Soğuk baklava','p35':'Soğuk baklava',
 'p20':'Sütlaç',
 'p62':'Kaymaklı tepsi kesimi',
 # dukkan
 'p03':'Vitrinde günün tepsileri','p15':'Vitrin — çeşit çeşit dizilim',
 'p18':'Tezgâhta tepsi düzeni',
 'p21':'Ali Usta ürün koleksiyonu','p50':'Ali Usta\'dan bir kare',
}

# ---------------------------------------------------------------- DIGER BOLUMLER
OZEL   = [P(61), P(11), P(14)]
OZEL_V = V(16)
KARGO  = [P(47), P(59)]
ILETIS = [P(0), P(23), P(39)]

# ---------------------------------------------------------------- DOGRULAMA
RAIL_IMGS = [P(n) for _, _, ns in RAIL for n in ns]
CAT_IMGS  = [k for c in CATS for k in c['fotograflar']]
CAT_VIDS  = [k for c in CATS for k in c['videolar']]
for c in CATS:
    assert c['kapak'] in c['fotograflar'], 'kapak kendi kategorisinden olmali: %s' % c['id']

used_img = MIRAS + RAIL_IMGS + CAT_IMGS + OZEL + KARGO + ILETIS
assert len(used_img) == len(set(used_img)), 'fotograf iki kez kullanilmis'
assert set(used_img) == set(img), 'kullanilmayan fotograf: %s' % (set(img) - set(used_img))

used_vid = [MIRAS_V] + TEZGAH + CAT_VIDS + [OZEL_V]
assert len(used_vid) == len(set(used_vid)), 'video iki kez kullanilmis'
assert set(used_vid) == set(vid), 'kullanilmayan video: %s' % (set(vid) - set(used_vid))

for k in CAT_IMGS + CAT_VIDS:
    assert k in CAP, 'aciklama eksik: %s' % k

# ---------------------------------------------------------------- CIKTI
def im(k):
    m = img[k]
    return dict(k=k, t='img', w=m['w'], h=m['h'],
                tw=m.get('tw', m['w']), th=m.get('th', m['h']), bg=m['bg'])

def vd(k):
    m = vid[k]
    return dict(k=k, t='vid', w=m['w'], h=m['h'], dur=m['dur'])

def cell(k):
    d = im(k) if k.startswith('p') else vd(k)
    d['cap'] = CAP[k]
    return d

data = dict(
  hero     = HERO,
  miras    = dict(photos=[im(k) for k in MIRAS], video=vd(MIRAS_V)),
  # tek fotoğraflı ürünlerde kart hover'ı için aynı görsel iki kez konur
  # (arka planda boş kalmasın); fotoğraf verisinde tekrar sayılmaz.
  rail     = [dict(name=n, desc=d, photos=([im(P(x)) for x in ns] * 2 if len(ns) == 1 else [im(P(x)) for x in ns]))
              for n, d, ns in RAIL],
  tezgah   = [dict(**vd(k), cap=TEZGAH_CAP[k]) for k in TEZGAH],
  cats     = [dict(id=c['id'], name=c['ad'], kicker=c['kicik'], desc=c['ozet'],
                   cover=im(c['kapak']),
                   nPhoto=len(c['fotograflar']), nVideo=len(c['videolar']),
                   items=[cell(k) for k in (c['fotograflar'] + c['videolar'])])
              for c in CATS],
  ozel     = dict(photos=[im(k) for k in OZEL], video=vd(OZEL_V)),
  kargo    = [im(k) for k in KARGO],
  iletisim = [im(k) for k in ILETIS],
)

os.makedirs('assets/js', exist_ok=True)
with io.open('assets/js/media.js', 'w', encoding='utf-8') as f:
    f.write('/* Ali Usta Baklavaları — medya haritası. Otomatik üretildi: _work/gen_media.py\n')
    f.write('   %d fotoğraf + %d video + 1 tanıtım filmi. Hepsi sitede kullanılıyor. */\n'
            % (len(img), len(vid)))
    f.write('window.AU_MEDIA = ')
    json.dump(data, f, ensure_ascii=False, indent=1)
    f.write(';\n')

# ---------------------------------------------------------------- RAPOR
rep = [('hero', HERO['file'], 'Hero — tanıtım filmi (tam ekran)')]
# v08 ayrıca "Neden Ali Usta" bölümünde karartılmış arka plan dokusu olarak
# ikinci kez kullanılır (index.html içinde sabit). Envanterde tek satır sayılır.
def add(sec, keys):
    for k in keys:
        rep.append((k, (img.get(k) or vid[k])['src'], sec))

add('Miras', MIRAS)
add('Miras — video', [MIRAS_V])
add('Ürünler rayı', RAIL_IMGS)
add('Tezgâh — üretim kayıtları', TEZGAH)
for c in CATS:
    add('Tatlı dünyası · %s' % c['ad'], c['fotograflar'] + c['videolar'])
add('Özel Sipariş', OZEL)
add('Özel Sipariş — video', [OZEL_V])
add('Kargo', KARGO)
add('İletişim', ILETIS)

with io.open('_work/coverage.md', 'w', encoding='utf-8') as f:
    f.write('| # | Kaynak dosya | Kullanıldığı bölüm |\n|---|---|---|\n')
    for k, s, sec in sorted(rep):
        f.write('| `%s` | %s | %s |\n' % (k, s, sec))

print('media.js yazildi. foto: %d  video: %d  galeri karosu: %d  kayit: %d'
      % (len(img), len(vid), len(CAT_IMGS) + len(CAT_VIDS), len(rep)))
