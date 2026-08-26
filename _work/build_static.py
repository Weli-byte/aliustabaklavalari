# -*- coding: utf-8 -*-
"""
robots.txt + sitemap.xml üretici.

Alan adını aşağıdaki SITE değişkenine yazıp çalıştırın:
    python _work/build_static.py https://alanadiniz.com

Alan adı verilmezse yer tutucu yazılır ve dosyalar açıkça
"yayına almadan önce düzeltin" uyarısı taşır.
"""
import io, sys, datetime, os

SITE = (sys.argv[1] if len(sys.argv) > 1 else '').rstrip('/')
PLACEHOLDER = not SITE
if PLACEHOLDER:
    SITE = 'https://ALANADINIZ.com'

BUGUN = datetime.date.today().isoformat()

SAYFALAR = [
    ('/',            '1.0', 'weekly'),
    ('/#urunler',    '0.9', 'monthly'),
    ('/#fiyat',      '0.9', 'weekly'),
    ('/#tatlilar',   '0.8', 'monthly'),
    ('/#siparis',    '0.9', 'monthly'),
    ('/#kargo',      '0.7', 'monthly'),
    ('/#sss',        '0.7', 'monthly'),
    ('/#iletisim',   '0.8', 'monthly'),
    ('/en/',         '0.8', 'monthly'),
]

uyari = ''
if PLACEHOLDER:
    uyari = ('# !!! ALAN ADI HENÜZ YAZILMADI !!!\n'
             '# Yayına almadan önce şunu çalıştırın:\n'
             '#   python _work/build_static.py https://gercek-alan-adiniz.com\n')

robots = uyari + """# Ali Usta Baklavaları — Nizip
User-agent: *
Allow: /
Disallow: /_work/
Disallow: /DATA/

Sitemap: %s/sitemap.xml
""" % SITE
io.open('robots.txt', 'w', encoding='utf-8').write(robots)

parcalar = ['<?xml version="1.0" encoding="UTF-8"?>']
if PLACEHOLDER:
    parcalar.append('<!-- ALAN ADI YER TUTUCU. python _work/build_static.py https://alanadi.com ile yeniden üretin. -->')
parcalar.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
                'xmlns:xhtml="http://www.w3.org/1999/xhtml">')
for yol, oncelik, sik in SAYFALAR:
    parcalar.append('  <url>')
    parcalar.append('    <loc>%s%s</loc>' % (SITE, yol))
    parcalar.append('    <lastmod>%s</lastmod>' % BUGUN)
    parcalar.append('    <changefreq>%s</changefreq>' % sik)
    parcalar.append('    <priority>%s</priority>' % oncelik)
    if yol in ('/', '/en/'):
        parcalar.append('    <xhtml:link rel="alternate" hreflang="tr" href="%s/"/>' % SITE)
        parcalar.append('    <xhtml:link rel="alternate" hreflang="en" href="%s/en/"/>' % SITE)
        parcalar.append('    <xhtml:link rel="alternate" hreflang="x-default" href="%s/"/>' % SITE)
    parcalar.append('  </url>')
parcalar.append('</urlset>')
io.open('sitemap.xml', 'w', encoding='utf-8').write('\n'.join(parcalar) + '\n')

print('robots.txt + sitemap.xml yazildi. Alan adi:', SITE, '(YER TUTUCU)' if PLACEHOLDER else '')
