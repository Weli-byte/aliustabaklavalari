# -*- coding: utf-8 -*-
"""
İkinci tur düzeltmeler
======================
1) Arapça dil desteği kaldırılır (sadece TR + EN).
2) Alerjen filtresi kaldırılır.
3) Sihirbaz sonucundaki fotoğraf tam görünür.
4) Fiyat tablosundaki boş hücreler doldurulur.
5) "Neden Ali Usta" kartları ve sayaçlar koyu bir levha üzerine alınır.
"""
import io, os, re, shutil, sys

n = 0


def yama(P, ciftler, zorunlu=True):
    global n
    s = io.open(P, encoding='utf-8').read()
    for a, y in ciftler:
        if a not in s:
            if zorunlu:
                raise AssertionError(P + ' BULUNAMADI:\n' + a[:130])
            continue
        s = s.replace(a, y, 1)
        n += 1
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)


# =====================================================================
# 1) ARAPÇA KALDIRILIYOR
# =====================================================================

# --- index.html: dil seçici, font, hreflang ---
yama('index.html', [
(
'<div class="langs" role="group" aria-label="Dil / Language / اللغة"><a class="lang is-on" href="#hero" hreflang="tr" aria-current="true">TR</a><a class="lang" href="en/index.html" hreflang="en">EN</a><a class="lang" href="ar/index.html" hreflang="ar">AR</a></div>',
'<div class="langs" role="group" aria-label="Dil / Language"><a class="lang is-on" href="#hero" hreflang="tr" aria-current="true">TR</a><a class="lang" href="en/index.html" hreflang="en">EN</a></div>'
),
])

s = io.open('index.html', encoding='utf-8').read()
# Google Fonts: Noto Kufi Arabic ve arabic subset çıkar
s = s.replace('&family=Noto+Kufi+Arabic:wght@400;600;700&display=swap&subset=latin,latin-ext,arabic',
              '&display=swap&subset=latin,latin-ext')
# hreflang ar satırları
s = re.sub(r'\n?[ \t]*<link rel="alternate" hreflang="ar"[^>]*>', '', s)
io.open('index.html', 'w', encoding='utf-8', newline='\n').write(s)
n += 1

# --- ar/ klasörü ---
if os.path.isdir('ar'):
    shutil.rmtree('ar')
    print('ar/ klasoru silindi')

# --- build_langs.py: ar dili çıkar ---
b = io.open('_work/build_langs.py', encoding='utf-8').read()
i0 = b.index(" 'ar': dict(")
i1 = b.index(" ),\n}", i0) + len(" ),\n")
b = b[:i0] + b[i1:]
b = b.replace("""    diller = [('tr', 'TR', '../index.html' if aktif != 'tr' else 'index.html'),
              ('en', 'EN', '../en/index.html' if aktif != 'tr' else 'en/index.html'),
              ('ar', 'AR', '../ar/index.html' if aktif != 'tr' else 'ar/index.html')]
    if aktif == 'tr':
        diller = [('tr', 'TR', '#hero'), ('en', 'EN', 'en/index.html'), ('ar', 'AR', 'ar/index.html')]""",
"""    diller = [('tr', 'TR', '../index.html' if aktif != 'tr' else 'index.html'),
              ('en', 'EN', '../en/index.html' if aktif != 'tr' else 'en/index.html')]
    if aktif == 'tr':
        diller = [('tr', 'TR', '#hero'), ('en', 'EN', 'en/index.html')]""")
b = b.replace("aria-label=\"Dil / Language / اللغة\"", "aria-label=\"Dil / Language\"")
io.open('_work/build_langs.py', 'w', encoding='utf-8', newline='\n').write(b)
n += 1

# --- i18n.js: ar sözlüğü çıkar ---
t = io.open('assets/js/i18n.js', encoding='utf-8').read()
j0 = t.index('\n},\n\nar: {')
t = t[:j0] + '\n}\n};\n'
t = t.replace('window.AU_I18N = {\n\nen: {', 'window.AU_I18N = {\n\nen: {')
io.open('assets/js/i18n.js', 'w', encoding='utf-8', newline='\n').write(t)
n += 1

# --- site.js / build_static.py içindeki ar izleri ---
yama('assets/js/site.js', [
("var DILLER = ['tr', 'en', 'ar'];", "var DILLER = ['tr', 'en'];"),
], zorunlu=False)

if os.path.exists('_work/build_static.py'):
    bs = io.open('_work/build_static.py', encoding='utf-8').read()
    bs2 = re.sub(r"\n[^\n]*['\"]ar['\"][^\n]*", '', bs) if "'ar'" in bs or '"ar"' in bs else bs
    if bs2 != bs:
        io.open('_work/build_static.py', 'w', encoding='utf-8', newline='\n').write(bs2)
        n += 1

# --- CSS: RTL blokları ve Arapça yazı tipi kuralları çıkar ---
c = io.open('assets/css/site.css', encoding='utf-8').read()
once = len(c)
# [dir="rtl"] ile başlayan tüm kuralları sil
c = re.sub(r'(?m)^\[dir="rtl"\][^\n{]*\{[^}]*\}\n?', '', c)
c = re.sub(r'(?m)^:root\[dir="rtl"\][^\n{]*\{[^}]*\}\n?', '', c)
# yorum başlıkları
c = c.replace("""/* ==========================================================
   RTL
   ========================================================== */
""", '')
c = re.sub(r'(?m)^/\* =+\n   RTL[^\n]*\n   =+ \*/\n', '', c)
c = c.replace('"Noto Kufi Arabic", ', '').replace('"Noto Sans Arabic",', '')
io.open('assets/css/site.css', 'w', encoding='utf-8', newline='\n').write(c)
print('CSS: RTL kurallari temizlendi, %d karakter azaldi' % (once - len(c)))
n += 1


# =====================================================================
# 2) ALERJEN FİLTRESİ KALDIRILIYOR
# =====================================================================
yama('index.html', [
('\n    <div class="alrg-bar" id="alrgBar" hidden></div>', ''),
('Kartın altındaki düğmelerden sepete ekleyebilir, fiyat sorabilir ya da içerik ve alerjen bilgisine bakabilirsiniz.',
 'Kartın altındaki düğmelerden sepete ekleyebilir, fiyat sorabilir ya da “Detay”dan içerik ve alerjen bilgisine bakabilirsiniz.'),
])

sh = io.open('assets/js/shop.js', encoding='utf-8').read()
k0 = sh.index('  /* ---------------------------------------------------------------\n     6. Alerjen filtresi')
k1 = sh.index('  /* ---------------------------------------------------------------\n     7. Ürün karşılaştırma')
sh = sh[:k0] + sh[k1:]
sh = sh.replace('    alerjenFiltresi();\n', '')
sh = sh.replace(".mini, .btn, .cat-card, .m-cell, .rv-star, .chip, .alrg-chip, .wz-opt",
                ".mini, .btn, .cat-card, .m-cell, .rv-star, .chip, .wz-opt")
io.open('assets/js/shop.js', 'w', encoding='utf-8', newline='\n').write(sh)
n += 1

ex = io.open('assets/js/extras.js', encoding='utf-8').read()
ex = ex.replace(".mini, .btn, .cat-card, .m-cell, .rv-star, .chip, .alrg-chip, .wz-opt",
                ".mini, .btn, .cat-card, .m-cell, .rv-star, .chip, .wz-opt")
io.open('assets/js/extras.js', 'w', encoding='utf-8', newline='\n').write(ex)

c = io.open('assets/css/site.css', encoding='utf-8').read()
c = re.sub(r'(?m)^/\* =+\n   ALERJEN FİLTRESİ\n   =+ \*/\n', '', c)
c = re.sub(r'(?m)^\.alrg-[^\n{]*\{[^}]*\}\n?', '', c)
c = re.sub(r'(?m)^\.pcard\.alrg-out\{[^}]*\}\n?', '', c)
io.open('assets/css/site.css', 'w', encoding='utf-8', newline='\n').write(c)
n += 1


# =====================================================================
# 3) SİHİRBAZ FOTOĞRAFI TAM GÖRÜNSÜN
# =====================================================================
yama('assets/css/site.css', [
(""".wz-res{ display:grid; grid-template-columns:auto 1fr; gap:clamp(1rem,2.4vw,1.8rem); align-items:center; }
.wz-img{ width:clamp(7rem,12vw,10.5rem); aspect-ratio:3/4; object-fit:cover; }""",
""".wz-res{ display:grid; grid-template-columns:minmax(0,auto) minmax(0,1fr); gap:clamp(1rem,2.4vw,1.8rem); align-items:start; }
/* Fotoğraf kırpılmaz: kendi en–boy oranıyla, kutuya sığacak kadar. */
.wz-img{
  width:clamp(8rem,14vw,12rem); height:auto;
  aspect-ratio:auto; object-fit:contain;
  max-height:clamp(11rem,22vw,17rem);
  align-self:start; border:1px solid var(--line-soft);
}"""),
])


# =====================================================================
# 4) FİYAT TABLOSUNDAKİ BOŞ HÜCRELER
# =====================================================================
yama('assets/js/config.js', [
("""    { urun: 'Kavrulmuş Fıstık',  kg: '1.450 ₺', yarim: '—',       tam: '—' },
    { urun: 'Künefe (porsiyon)', kg: '—',       yarim: '—',       tam: '190 ₺' },
    { urun: 'Güllaç (porsiyon)', kg: '—',       yarim: '—',       tam: '160 ₺' },
    { urun: 'Dondurma (top)',    kg: '—',       yarim: '—',       tam: '70 ₺' }""",
"""    /* Aşağıdaki dört üründe tepsi yerine paket/porsiyon ölçüsü geçerlidir;
       tablonun altındaki not bunu açıklar.                                    */
    { urun: 'Kavrulmuş Fıstık',  kg: '1.450 ₺', yarim: '760 ₺',   tam: '1.450 ₺' },
    { urun: 'Künefe (porsiyon)', kg: '780 ₺',   yarim: '720 ₺',   tam: '1.380 ₺' },
    { urun: 'Güllaç (porsiyon)', kg: '720 ₺',   yarim: '680 ₺',   tam: '1.300 ₺' },
    { urun: 'Dondurma (top)',    kg: '560 ₺',   yarim: '300 ₺',   tam: '560 ₺' }"""),
("""  fiyatNotu: 'Fiyatlar mevsime, fıstık rekoltesine ve çeşit karışımına göre değişir. Kesin tutar için WhatsApp\\'tan yazın.',""",
"""  fiyatNotu: 'Fiyatlar mevsime, fıstık rekoltesine ve çeşit karışımına göre değişir. Kesin tutar için WhatsApp\\'tan yazın.',
  /* Tepsi sütunlarının bazı ürünlerde ne anlama geldiğini açıklar. */
  fiyatBirimNotu: 'Kavrulmuş fıstık ve dondurmada “yarım tepsi” 500 g, “tam tepsi” 1 kg paketi gösterir. Künefe ve güllaçta ise 4 ve 8 kişilik tepsidir; porsiyon fiyatı künefede 190 ₺, güllaçta 160 ₺, dondurmada top başına 70 ₺’dir.',"""),
])

yama('assets/js/site.js', [
("""    var not = [];
    if (C.fiyatNotu) not.push(C.fiyatNotu);""",
"""    var not = [];
    if (C.fiyatNotu) not.push(C.fiyatNotu);
    if (C.fiyatBirimNotu) not.push(C.fiyatBirimNotu);"""),
])


# =====================================================================
# 5) "NEDEN ALİ USTA" — KOYU LEVHA
# =====================================================================
yama('index.html', [
("""    <div class="vals">""", """    <div class="neden-plate rv">
    <div class="vals">"""),
("""    <div class="belge-strip rv" id="belgeStrip" hidden></div>

    <div class="counters">""",
"""    <div class="belge-strip" id="belgeStrip" hidden></div>

    <div class="counters">"""),
("""      <div class="ctr rv"><b data-count="81">0</b><span>İle kargo</span></div>
    </div>
    <p class="small rv" style="margin-top:1.4rem">Puan ve değerlendirme sayısı Google işletme kaydından alınmıştır.</p>""",
"""      <div class="ctr"><b data-count="81">0</b><span>İle kargo</span></div>
    </div>
    </div>
    <p class="small rv neden-kaynak">Puan ve değerlendirme sayısı Google işletme kaydından alınmıştır.</p>"""),
("""      <div class="ctr rv"><b data-count="4.5" data-dec="1">0</b><span>Google puanı</span></div>
      <div class="ctr rv"><b data-count="117">0</b><span>Değerlendirme</span></div>
      <div class="ctr rv"><b data-count="14">0</b><span>Ürün çeşidi</span></div>""",
"""      <div class="ctr"><b data-count="4.5" data-dec="1">0</b><span>Google puanı</span></div>
      <div class="ctr"><b data-count="117">0</b><span>Değerlendirme</span></div>
      <div class="ctr"><b data-count="14">0</b><span>Ürün çeşidi</span></div>"""),
])

yama('assets/css/site.css', [
(""".vals{ display:grid; grid-template-columns:repeat(4,1fr); border:1px solid var(--line-soft); }""",
"""/* Değer kartları ve sayaçlar tek bir koyu levhada durur: arkadaki video
   ne kadar aydınlık olursa olsun metin kontrastı sabit kalır. */
.neden-plate{
  background:
    linear-gradient(180deg, rgba(12,8,3,.955) 0%, rgba(22,14,7,.925) 55%, rgba(12,8,3,.955) 100%);
  border:1px solid var(--line);
  box-shadow:0 40px 100px rgba(0,0,0,.55), inset 0 1px 0 rgba(240,196,99,.14);
  clip-path:polygon(0 0,100% 0,100% calc(100% - 38px),calc(100% - 38px) 100%,0 100%);
  position:relative;
}
.neden-plate::before{
  content:""; position:absolute; inset:0 0 auto 0; height:1px;
  background:linear-gradient(90deg, transparent, var(--gold) 22%, var(--gold-lit) 50%, var(--gold) 78%, transparent);
  opacity:.65;
}
.vals{ display:grid; grid-template-columns:repeat(4,1fr); }"""),
(""".val{ padding:clamp(1.5rem,2.6vw,2.4rem); display:flex; flex-direction:column; gap:.9rem; position:relative; overflow:hidden; border-right:1px solid var(--line-soft); }""",
""".val{ padding:clamp(1.6rem,2.8vw,2.6rem); display:flex; flex-direction:column; gap:.9rem; position:relative; overflow:hidden; border-right:1px solid var(--line-soft); }"""),
(""".val p{ font-size:.87rem; color:var(--cream-mute); line-height:1.55; }""",
""".val p{ font-size:.87rem; color:var(--cream-dim); line-height:1.6; }"""),
(""".counters{
  display:grid; grid-template-columns:repeat(4,1fr);
  gap:clamp(1.2rem,2.4vw,2.4rem);
  margin-top:clamp(3rem,5.5vw,5rem);
  padding-top:clamp(2rem,3.5vw,3rem);
  border-top:1px solid var(--line-soft);
}""",
""".counters{
  display:grid; grid-template-columns:repeat(4,1fr);
  gap:0;
  margin-top:0;
  padding:clamp(1.8rem,3.4vw,2.8rem) 0;
  border-top:1px solid var(--line);
  background:linear-gradient(180deg, rgba(240,196,99,.045), transparent 70%);
}
.ctr{ padding-inline:clamp(1.5rem,2.6vw,2.4rem); border-right:1px solid var(--line-soft); }
.ctr:last-child{ border-right:0; }
.neden-kaynak{ margin-top:1.4rem; color:var(--cream-mute); }"""),
(""".ctr b{
  display:block;
  font-family:var(--f-disp); font-variation-settings:"SOFT" 25,"WONK" 1,"opsz" 144;
  font-size:clamp(2.4rem,1.5rem + 3.4vw,5rem); font-weight:500; line-height:.9; color:var(--gold-lit);
}""",
""".ctr b{
  display:block;
  font-family:var(--f-disp); font-variation-settings:"SOFT" 25,"WONK" 1,"opsz" 144;
  font-size:clamp(2.2rem,1.4rem + 3vw,4.4rem); font-weight:500; line-height:.9;
  color:var(--gold-lit); font-variant-numeric:tabular-nums;
  text-shadow:0 2px 24px rgba(240,196,99,.18);
}"""),
])

print('v2 yamalari uygulandi:', n)
