# -*- coding: utf-8 -*-
"""
Dördüncü tur düzeltmeler
========================
1) Adres, işletmenin kendi ambalaj kâğıdına göre düzeltilir.
2) Yanlış tatlı adları düzeltilir:
     Havuç Dilimi     → Yuvarlak Tepsi Baklava
     Kuşgözü          → Fıstık Ezmesi   (fiyat tablosunda birleşir)
     Kavrulmuş Fıstık → Çiğ İç Fıstık
3) DATA'ya sonradan eklenen 8 video ve 1 fotoğraf siteye yerleştirilir.
"""
import io
import re
import sys

n = 0


def yama(P, ciftler):
    global n
    s = io.open(P, encoding='utf-8').read()
    for a, y in ciftler:
        assert a in s, P + ' BULUNAMADI:\n' + a[:140]
        s = s.replace(a, y, 1)
        n += 1
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)


# =====================================================================
# 1) ADRES — kaynak: işletmenin ambalaj kâğıdı
# =====================================================================
YENI_ADRES = 'Sultan Abdülhamid Mah., Yavuz Sultan Selim Bulvarı, Özdemir Apt. Altı 25/A'
HARITA = ('https://www.google.com/maps/search/?api=1&query='
          'Ali+Usta+Baklavalar%C4%B1+Yavuz+Sultan+Selim+Bulvar%C4%B1+25%2FA+Nizip+Gaziantep')

yama('assets/js/config.js', [
("  adres:      'Sultan Abdülhamit Mah., Kanuni Sultan Süleyman Bulvarı 25/A',",
 "  /* Adres işletmenin kendi ambalaj kâğıdından alındı (Ağustos 2026). */\n"
 "  adres:      '" + YENI_ADRES + "',"),
("  haritaLink: 'https://www.google.com/maps/search/?api=1&query=Ali+Usta+Baklavalar%C4%B1+Kanuni+Sultan+S%C3%BCleyman+Bulvar%C4%B1+25%2FA+Nizip+Gaziantep',",
 "  haritaLink: '" + HARITA + "',"),
])

yama('index.html', [
('    "streetAddress": "Sultan Abdülhamit Mah., Kanuni Sultan Süleyman Bulvarı 25/A",',
 '    "streetAddress": "' + YENI_ADRES + '",'),
])

# googleLink de aynı bulvarı kullansın
s = io.open('assets/js/config.js', encoding='utf-8').read()
s = s.replace("googleLink:  'https://www.google.com/maps/search/?api=1&query=Ali+Usta+Baklavalar%C4%B1+Nizip'",
              "googleLink:  'https://www.google.com/maps/search/?api=1&query=Ali+Usta+Baklavalar%C4%B1+Nizip'")
io.open('assets/js/config.js', 'w', encoding='utf-8', newline='\n').write(s)


# =====================================================================
# 2) TATLI ADLARI
# =====================================================================
yama('_work/gen_media.py', [
(' ("Havuç Dilimi","Geniş tabanlı üçgen dilim. Her lokmada artan fıstık oranı.",[55,30]),',
 ' ("Yuvarlak Tepsi Baklava","Yuvarlak tepside dilim kesim. Bayram ve ikram sofralarının klasik sunumu.",[55,30]),'),
(' ("Kuşgözü","Küçük, yuvarlak, tek lokmalık. Ortasında iri fıstık tanesi.",[49,16]),',
 ' ("Fıstık Ezmesi","Taş değirmende çekilmiş Antep fıstığı, şekerle yoğrulup tepsiye basılır.",[49,16]),'),
(' ("Kavrulmuş Fıstık","Baklavanın içine giren fıstığın kendisi. Günlük kavrulur, ayrıca satılır.",[53,7]),',
 ' ("Çiğ İç Fıstık","Baklavanın içine giren fıstığın kendisi — kabuğu alınmış, mor zarlı, kavrulmamış.",[53,7]),'),
# baklava kategorisinin özetinde de eski ad geçiyordu
('"kaynatılmış şerbet dökülür. Kesim biçimi çeşidi belirler: kare, midye, havuç dilimi, "\n       "dolama, şöbiyet. Hepsi aynı hamurdan, ayıran tek şey ustanın elindeki bıçak açısı.",',
 '"kaynatılmış şerbet dökülür. Kesim biçimi çeşidi belirler: kare, midye, yuvarlak tepsi, "\n       "dolama, şöbiyet. Hepsi aynı hamurdan, ayıran tek şey ustanın elindeki bıçak açısı.",'),
("  ozet=\"Kanuni Sultan Süleyman Bulvarı'ndaki dükkân, her sabah 10:00'da sıfırdan dolan vitrin \"",
 "  ozet=\"Yavuz Sultan Selim Bulvarı'ndaki dükkân, her sabah 10:00'da sıfırdan dolan vitrin \""),
])

# --- config.js: fiyat tablosu ve ürün detayları ---
c = io.open('assets/js/config.js', encoding='utf-8').read()

# Havuç Dilimi → Yuvarlak Tepsi Baklava
c = c.replace("{ urun: 'Havuç Dilimi',      kg: '1.200 ₺', yarim: '1.200 ₺', tam: '2.350 ₺' },",
              "{ urun: 'Yuvarlak Tepsi Baklava', kg: '1.200 ₺', yarim: '1.200 ₺', tam: '2.350 ₺' },")
# Kuşgözü satırı kalkar (Fıstık Ezmesi satırı zaten var)
c = re.sub(r"\n *\{ urun: 'Kuşgözü',[^\n]*\},", "", c)
# Kavrulmuş Fıstık → Çiğ İç Fıstık
c = c.replace("{ urun: 'Kavrulmuş Fıstık',  kg: '1.450 ₺', yarim: '760 ₺',   tam: '1.450 ₺' },",
              "{ urun: 'Çiğ İç Fıstık',     kg: '1.450 ₺', yarim: '760 ₺',   tam: '1.450 ₺' },")
c = c.replace("Kavrulmuş fıstık ve dondurmada", "Çiğ iç fıstık ve dondurmada")

# ürün detayları: anahtar adları
c = c.replace("'Havuç Dilimi':", "'Yuvarlak Tepsi Baklava':")
c = c.replace("'Kuşgözü':", "'Fıstık Ezmesi':")
c = c.replace("'Kavrulmuş Fıstık':", "'Çiğ İç Fıstık':")
io.open('assets/js/config.js', 'w', encoding='utf-8', newline='\n').write(c)
n += 1


# =====================================================================
# 3) YENİ MEDYANIN YERLEŞİMİ
# =====================================================================
yama('_work/gen_media.py', [
# Antep Fıstığı: yeni yüksek çözünürlüklü fotoğraf kapak olur
("  kapak=P(64),\n  fotograflar=[P(51), P(52), P(64)],\n  videolar=[]),",
 "  kapak=P(65),\n  fotograflar=[P(65), P(51), P(52), P(64)],\n  videolar=[]),"),
# Baklava: işletmeden 29 Ağustos'ta gelen 8 tepsi sunumu videosu
("  videolar=[V(4), V(7), V(8), V(13)]),",
 "  videolar=[V(4), V(7), V(8), V(13),\n"
 "            V(17), V(18), V(19), V(20), V(21), V(22), V(23), V(24)]),"),
])

print('v4 yamalari uygulandi:', n)
