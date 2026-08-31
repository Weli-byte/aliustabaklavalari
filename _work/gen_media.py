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
    src='assets/video/hero.mp4',
    srcSmall='assets/video/hero-sm.mp4',
    poster='assets/video/poster/hero.webp',
    w=1280, h=720, dur=10.0,
    file='Hero - Ali Usta tanitim filmi.mp4',
)

# ---------------------------------------------------------------- MIRAS
MIRAS   = [P(12), P(18), P(19), P(33), P(60)]
MIRAS_V = V(5)

# ---------------------------------------------------------------- URUNLER
RAIL = [
 ("Normal Baklava","Kırk kat yufka, tereyağı, Antep fıstığı. Ustanın el açtığı klasik.",[22,45]),
 ("Kare Baklava","Kalın fıstık dolgusu, kare kesim. Tepside dizilişiyle bile iddialı.",[28,4]),
 ("Yuvarlak Tepsi Baklava","Yuvarlak tepside dilim kesim. Bayram ve ikram sofralarının klasik sunumu.",[55,30]),
 ("Midye Baklava","İnce yufkanın kıvrılıp kapanmasıyla açılan sedef formu.",[26,42]),
 ("Kuru Baklava","Az şerbetli, uzun ömürlü. Kargoya en dayanıklısı.",[1,8]),
 ("Şöbiyet","Kaymak ve fıstığın yufka arasında buluştuğu tepsi klasiği.",[27,2]),
 ("Yaprak Şöbiyet","Katmanları yaprak gibi ayrılan, üstü baştan aşağı fıstıklı.",[17,31]),
 ("Dolama","Fıstığın etrafına sarılan ince yufka. Sarma tekniğinin ustalık sınavı.",[25,44]),
 ("Fıstık Ezmesi","Taş değirmende çekilmiş Antep fıstığı, şekerle yoğrulup tepsiye basılır.",[49,16]),
 ("Bülbül Yuvası","Yuva biçiminde kıvrılmış yufka, göbeği fıstıkla doldurulmuş.",[6,10]),
 ("Special Karışım","Tek tepside bütün çeşitler. Misafir ağırlamanın kestirme yolu.",[63,11]),
 ("Çiğ İç Fıstık","Baklavanın içine giren fıstığın kendisi — kabuğu alınmış, mor zarlı, kavrulmamış.",[53,7]),
]

# ---------------------------------------------------------------- TEZGAH
# Uretim kayitlari. Kullanicinin istegi uzerine kategorilere ayrilmadi.
TEZGAH = [V(0), V(1), V(3), V(6), V(9), V(11)]
TEZGAH_CAP = {
 'v00':'Kadayıf tezgâhı — telin açılışı',
 'v01':'Şerbetin kazanda kaynatılması',
 'v03':'Vitrin dizilişi ve günlük kesim',
 'v06':'Şerbetin ocakta kıvama gelmesi',
 'v09':'Antep fıstığının çekilmesi',
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
  kapak=P(48),
  fotograflar=[P(13), P(24), P(32), P(40), P(41), P(43), P(46), P(48)],
  videolar=[V(4), V(7), V(8), V(13),
            V(17), V(18), V(19), V(20), V(21), V(22), V(23), V(24)]),

 dict(id="kunefe", ad="Künefe", kicik="Sıcak servis",
  ozet="Tel kadayıf iki kat hâlinde bakır tepsiye yayılır, arasına tuzsuz tel peynir konur, "
       "ocakta iki yüzü de kızarana kadar çevrilir. Sıcakken şerbetlenir, üstüne fıstık, "
       "yanına kaymak. Künefe beklemez — tezgâhtan tabağa gider, peynir uzarken yenir.",
  kapak=P(37),
  fotograflar=[P(37), P(56), P(57)],
  videolar=[V(2), V(12), V(14), V(15)]),

 dict(id="dondurma", ad="Dondurma & Fıstık Ezmesi", kicik="Soğuk taraf",
  ozet="Antep fıstığı taş değirmende çekilir, şekerle yoğrulur; ortaya kaymak ya da dondurma "
       "girer. Yazın en çok istenen çeşit budur: sıcak baklavanın yanında soğuk bir kaşık. "
       "Fıstık ezmesi ayrıca tepsiyle de satılır, kesilip porsiyon hâlinde servis edilir.",
  kapak=P(34),
  fotograflar=[P(34), P(36), P(38), P(54)],
  videolar=[V(10)]),

 dict(id="fistik", ad="Antep Fıstığı", kicik="Her sabah kavrulur",
  ozet="Gaziantep'in fıstık kuşağının tam ortasındayız; fıstık aynı gün geliyor, aynı gün "
       "kavruluyor. Baklavanın içine giren fıstık ile tepside satılan fıstık aynı fıstıktır. "
       "Kavrulmuş fıstık, karışık kuruyemiş ve çiğ iç fıstık ayrı ayrı bulunur.",
  kapak=P(65),
  fotograflar=[P(65), P(51), P(52), P(64)],
  videolar=[]),

 dict(id="ozel", ad="Özel Tatlılar", kicik="Mevsimlik ve özel gün",
  ozet="Kaymaklı katmanlar, çikolata kaplı dilimler, hindistan cevizli kare kesim, mevsiminde "
       "çilekli tepsiler ve Ramazan'da güllaç. Vitrinin klasik baklava dışında kalan tarafı — "
       "her biri aynı tezgâhta, aynı malzemeyle yapılır.",
  kapak=P(62),
  fotograflar=[P(5), P(9), P(29), P(35), P(62)],
  videolar=[]),

 dict(id="dukkan", ad="Dükkân & Vitrin", kicik="Nizip'teki tezgâh",
  ozet="Yavuz Sultan Selim Bulvarı'ndaki dükkân, her sabah 10:00'da sıfırdan dolan vitrin "
       "ve açık hava oturma bölümü. Akşama kalan tepsi ertesi güne devretmez — vitrinde "
       "gördüğünüz her şey o gün yapılmıştır.",
  kapak=P(3),
  fotograflar=[P(3), P(15), P(21), P(50)],
  videolar=[]),
]

CAP = {
 # baklava
 'p13':'Fırından çıkan fıstıklı tepsiler','p24':'Kuru baklava, yakın plan',
 'p32':'Yuvarlak tepside radyal kesim','p40':'Yeşil midye baklava sırası',
 'p41':'Altın rengi tepsi, fıstık şeridi','p43':'Midye baklava makro',
 'p46':'Cevizli yuvarlak tepsi','p48':'Midye baklava dizilişi',
 'v04':'Tepsiye fıstık dökülüşü','v07':'Tezgâhta şöbiyet servisi',
 'v08':'Fırından çıkan tepsilerin dizilişi','v13':'Katmanlı baklavanın kesilişi',
 # 29 Ağustos 2026'da işletmeden gelen tepsi sunumları
 'v17':'Kare kesim tepsi — fıstık şeridiyle','v18':'Tezgâhta kare baklava tepsisi',
 'v19':'Şöbiyet tepsisi — fıstıkla kaplı','v20':'Yuvarlak tepside dilim kesim',
 'v21':'Kare baklava — üstten kadraj','v22':'Kare tepsi ve midye tepsisi yan yana',
 'v23':'Sarma dilimler, tepsiye dizilmiş','v24':'Yuvarlak tepside fıstıklı dizilim',
 # kunefe
 'p37':'Künefe — peynirin uzayışı','p56':'Künefe, fıstıkla taçlandırılmış',
 'p57':'Künefe — fıstık tepesi',
 'v02':'Ocakta künefe — bakır tepside çevirme','v12':'Künefe ve kaymak servisi',
 'v14':'Künefenin tabakta açılışı','v15':'Tel kadayıfın çekişi',
 # dondurma & fistik ezmesi
 'p34':'Fıstık ezmesi ve dondurmalı sunum','p36':'Fıstık ezmesi dolama, içi kaymaklı',
 'p38':'Fıstık ezmesi tepsisi','p54':'Fıstık ezmesi — üstü iri fıstıklı',
 'v10':'Fıstık ezmeli tepsinin kesimi',
 # fistik
 'p51':'Fıstık dokusunun yakın planı','p52':'Karışık kuruyemiş tepsisi',
 'p64':'Günlük kavrulmuş Antep fıstığı',
 'p65':'Çiğ iç fıstık — mor zarlı, yuvarlak tepside',
 # ozel
 'p05':'Hindistan cevizli & kakaolu kare dilim','p09':'Kaymaklı soğuk sunum',
 'p29':'Çikolatalı özel tepsi','p35':'Çikolata kaplı özel çeşit',
 'p62':'Kaymaklı tepsi kesimi',
 # dukkan
 'p03':'Vitrinde günün tepsileri','p15':'Vitrin — çeşit çeşit dizilim',
 'p21':'Ali Usta ürün koleksiyonu','p50':'Ali Usta çekiliş duyurusu',
}

# ---------------------------------------------------------------- DIGER BOLUMLER
OZEL   = [P(61), P(58), P(14), P(20)]
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
  rail     = [dict(name=n, desc=d, photos=[im(P(x)) for x in ns]) for n, d, ns in RAIL],
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
