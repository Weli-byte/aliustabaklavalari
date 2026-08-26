# -*- coding: utf-8 -*-
"""
index.html'den en/index.html üretir.

Aynı assets/ klasörünü kullanırlar (../assets/...), böylece medya tek kopya
kalır. Sayfa içi metinler çalışma anında assets/js/i18n.js sözlüğünden çevrilir.

Kullanım:  python _work/build_langs.py
"""
import io, os, re, sys

# Mutlak alan adı verilirse hreflang etiketleri yazılır; verilmezse atlanır
# (göreli hreflang arama motorlarınca geçersiz sayılır).
SITE = (sys.argv[1] if len(sys.argv) > 1 else '').rstrip('/')

TR = io.open('index.html', encoding='utf-8').read()

DILLER = {
 'en': dict(
   dir='ltr',
   title='Ali Usta Baklavaları — Nizip, Gaziantep | Baklava, Künefe, Antep Pistachio',
   desc='Ali Usta Baklavaları in Nizip: made fresh daily, no preservatives, 100% natural. '
        'Baklava, künefe, pistachio paste, roasted Antep pistachios. Nationwide shipping, '
        'bookings and bulk orders.',
   ogtitle='Ali Usta Baklavaları — Nizip, Gaziantep',
   ogdesc='Forty layers of pastry, pistachios roasted each morning, natural beet sugar. '
          'From Nizip to everywhere in Türkiye.',
   locale='en_US',
 ),
}

# dil seçici (her sayfada aynı; aktif dil işaretlenir)
def dil_secici(aktif):
    diller = [('tr', 'TR', '../index.html' if aktif != 'tr' else 'index.html'),
              ('en', 'EN', '../en/index.html' if aktif != 'tr' else 'en/index.html')]
    if aktif == 'tr':
        diller = [('tr', 'TR', '#hero'), ('en', 'EN', 'en/index.html')]
    ic = ''.join(
        '<a class="lang%s" href="%s" hreflang="%s"%s>%s</a>' % (
            ' is-on' if k == aktif else '', yol, k,
            ' aria-current="true"' if k == aktif else '', ad)
        for k, ad, yol in diller)
    return '<div class="langs" role="group" aria-label="Dil / Language">%s</div>' % ic


def hreflang(aktif):
    """hreflang mutlak adres ister; alan adı verilmediyse hiç yazılmaz."""
    if not SITE:
        return ('<!-- hreflang etiketleri mutlak alan adı gerektirir. Yayına alırken: '
                'python _work/build_langs.py https://alanadiniz.com -->')
    return ('<link rel="alternate" hreflang="tr" href="{0}/">\n'
            '<link rel="alternate" hreflang="en" href="{0}/en/">\n'
            '<link rel="alternate" hreflang="x-default" href="{0}/">').format(SITE)


def hreflang_temizle(h):
    h = re.sub(r'<link rel="alternate" hreflang[^>]*>\n?', '', h)
    h = re.sub(r'<!-- hreflang etiketleri[^>]*-->\n?', '', h)
    return h


# --- Türkçe sayfaya dil seçici ve hreflang ekle ---
def enjekte(html, aktif):
    # dil seçici: nav-tools içine, hareket düğmesinden önce
    if 'class="langs"' not in html:
        html = html.replace('<div class="nav-tools">',
                            '<div class="nav-tools">\n    ' + dil_secici(aktif), 1)
    else:
        html = re.sub(r'<div class="langs".*?</div>', dil_secici(aktif), html, count=1, flags=re.S)
    # hreflang
    html = hreflang_temizle(html)
    html = html.replace('<link rel="manifest"', hreflang(aktif) + '\n<link rel="manifest"', 1)
    # i18n sözlüğü config'den önce yüklenmeli
    if 'assets/js/i18n.js' not in html:
        html = html.replace('<script src="assets/js/config.js"></script>',
                            '<script src="assets/js/i18n.js"></script>\n'
                            '<script src="assets/js/config.js"></script>', 1)
    return html

TR = enjekte(TR, 'tr')
io.open('index.html', 'w', encoding='utf-8').write(TR)
print('index.html: dil secici + hreflang + i18n eklendi')

for kod, m in DILLER.items():
    h = TR
    # kök yolları bir üst klasöre çevir
    h = h.replace('href="assets/', 'href="../assets/').replace('src="assets/', 'src="../assets/')
    h = h.replace('content="assets/', 'content="../assets/')
    h = h.replace('poster="assets/', 'poster="../assets/')
    h = h.replace('data-src="assets/', 'data-src="../assets/')
    h = h.replace('imagesrcset="assets/', 'imagesrcset="../assets/')
    h = h.replace('href="manifest.webmanifest"', 'href="../manifest.webmanifest"')
    h = h.replace("'assets/", "'../assets/")
    # <html>
    h = h.replace('<html lang="tr">', '<html lang="%s" dir="%s">' % (kod, m['dir']), 1)
    # başlık ve açıklamalar
    h = re.sub(r'<title>.*?</title>', '<title>%s</title>' % m['title'], h, count=1, flags=re.S)
    h = re.sub(r'<meta name="description" content="[^"]*">',
               '<meta name="description" content="%s">' % m['desc'], h, count=1)
    h = re.sub(r'<meta property="og:locale" content="[^"]*">',
               '<meta property="og:locale" content="%s">' % m['locale'], h, count=1)
    h = re.sub(r'<meta property="og:title" content="[^"]*">',
               '<meta property="og:title" content="%s">' % m['ogtitle'], h, count=1)
    h = re.sub(r'<meta property="og:description" content="[^"]*">',
               '<meta property="og:description" content="%s">' % m['ogdesc'], h, count=1)
    # dil seçici ve hreflang
    h = re.sub(r'<div class="langs".*?</div>', dil_secici(kod), h, count=1, flags=re.S)
    h = hreflang_temizle(h)
    h = h.replace('<link rel="../manifest.webmanifest"', '<link rel="manifest"')  # güvenlik
    h = h.replace('<link rel="manifest"', hreflang(kod) + '\n<link rel="manifest"', 1)
    # service worker kapsam dışı kalmasın diye alt klasörde kaydı atlanır
    h = h.replace("navigator.serviceWorker.register('sw.js')", "navigator.serviceWorker.register('../sw.js')")

    os.makedirs(kod, exist_ok=True)
    io.open(os.path.join(kod, 'index.html'), 'w', encoding='utf-8').write(h)
    print('%s/index.html yazildi' % kod)
