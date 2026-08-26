# -*- coding: utf-8 -*-
"""
GOOGLE YORUMLARINI SİTEYE AKTARMA ARACI
=======================================

Google Haritalar'daki 117 yorumun metnini hiçbir servis dışarıya toplu
olarak vermez (Places API üçüncü taraflara en fazla 5 yorum döner).
Bu yüzden yorumlar Google'ın sayfasından kopyalanıp bu araçla
config.js dosyasına aktarılır. Uydurma yorum ÜRETİLMEZ.

KULLANIM
--------
1) Google Haritalar'da işletme sayfasını açın → "Yorumlar" sekmesi.
2) Yorumları fareyle seçip kopyalayın (sayfayı aşağı kaydırdıkça yenileri
   yüklenir; hepsini yükledikten sonra tek seferde seçin).
3) Kopyaladığınızı _work/yorumlar_ham.txt dosyasına yapıştırıp kaydedin.
4) Bu klasörde şunu çalıştırın:
       python _work/yorum_ekle.py
5) Betik yorumları ayıklar, gösterir ve onayınızla config.js içindeki
   yorumlar[] listesine yazar.

Alternatif: Google Takeout / Business Profile'dan indirdiğiniz CSV'yi
       python _work/yorum_ekle.py --csv yorumlar.csv
komutuyla da aktarabilirsiniz (sütunlar: ad, puan, tarih, metin).

Betik hiçbir yorumu kendisi yazmaz; yalnızca sizin verdiğiniz metni
biçimlendirir.
"""
import io, os, re, sys, csv, json, argparse, unicodedata

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(KOK, 'assets', 'js', 'config.js')
HAM = os.path.join(KOK, '_work', 'yorumlar_ham.txt')

AY = {
    'ocak': '01', 'şubat': '02', 'subat': '02', 'mart': '03', 'nisan': '04',
    'mayıs': '05', 'mayis': '05', 'haziran': '06', 'temmuz': '07',
    'ağustos': '08', 'agustos': '08', 'eylül': '09', 'eylul': '09',
    'ekim': '10', 'kasım': '11', 'kasim': '11', 'aralık': '12', 'aralik': '12',
}

# "3 ay önce" / "bir yıl önce" gibi göreli tarihler
GORECELI = re.compile(r'^(bir|\d+)\s+(gün|hafta|ay|yıl|yil)\s+önce', re.I)


def yildiz_say(satir):
    """'5 yıldız', '★★★★★', '4/5' biçimlerinden puanı çıkarır."""
    yil = satir.count('★') or satir.count('⭐')
    if 1 <= yil <= 5:
        return yil
    m = re.search(r'(\d)\s*(?:yıldız|yildiz|/\s*5)', satir, re.I)
    if m:
        n = int(m.group(1))
        if 1 <= n <= 5:
            return n
    return None


def tarih_coz(satir):
    # yıldızlar ve "5 yıldız" ifadesi tarihten önce gelebilir — temizle
    s = re.sub(r'[★⭐]|\d\s*(?:yıldız|yildiz)|/\s*5', ' ', satir).strip().lower()
    m = re.match(r'(\d{1,2})\s+([a-zçğıöşü]+)\s+(\d{4})', s)
    if m and m.group(2) in AY:
        return '%s-%s-%02d' % (m.group(3), AY[m.group(2)], int(m.group(1)))
    if GORECELI.match(s):
        return ''          # göreli tarih — boş bırakılır, sitede gösterilmez
    return None


def ham_coz(metin):
    """Google'dan kopyalanan bloğu yorum kayıtlarına ayırır.

    Beklenen kalıp (Google'ın kopyalama düzeni):
        Ad Soyad
        Yerel Rehber · 12 yorum
        ★★★★★  3 ay önce
        Yorum metni ...
    """
    satirlar = [l.rstrip() for l in metin.splitlines()]
    kayitlar, i, n = [], 0, len(satirlar)

    while i < n:
        ad = satirlar[i].strip()
        i += 1
        if not ad or len(ad) > 60 or yildiz_say(ad):
            continue

        # araya giren "Yerel Rehber · N yorum · N fotoğraf" satırlarını atla
        while i < n and re.search(r'(yerel rehber|yorum|fotoğraf|fotograf)', satirlar[i], re.I) \
                and not yildiz_say(satirlar[i]):
            i += 1

        if i >= n:
            break
        puan = yildiz_say(satirlar[i])
        if puan is None:
            continue
        tarih = tarih_coz(satirlar[i]) or ''
        i += 1
        if i < n and tarih == '' and tarih_coz(satirlar[i]) is not None:
            tarih = tarih_coz(satirlar[i]) or ''
            i += 1

        # yorum metni: bir sonraki boş satıra kadar
        parca = []
        while i < n and satirlar[i].strip():
            t = satirlar[i].strip()
            if re.match(r'^(Beğen|Paylaş|Yanıtla|Daha fazla|Tümünü oku)$', t, re.I):
                i += 1
                continue
            parca.append(t)
            i += 1
        metin_y = ' '.join(parca).strip()
        while i < n and not satirlar[i].strip():
            i += 1

        if metin_y:
            kayitlar.append({'ad': ad, 'puan': puan, 'metin': metin_y, 'tarih': tarih})
    return kayitlar


def csv_coz(yol):
    kayitlar = []
    with io.open(yol, encoding='utf-8-sig', newline='') as f:
        for r in csv.DictReader(f):
            alt = {(k or '').strip().lower(): (v or '').strip() for k, v in r.items()}
            ad = alt.get('ad') or alt.get('isim') or alt.get('name') or alt.get('reviewer')
            metin = alt.get('metin') or alt.get('yorum') or alt.get('text') or alt.get('comment')
            puan = alt.get('puan') or alt.get('yıldız') or alt.get('rating') or alt.get('star')
            tarih = alt.get('tarih') or alt.get('date') or ''
            if not (ad and metin):
                continue
            try:
                p = int(float(re.sub(r'[^\d.]', '', puan or '5')))
            except ValueError:
                p = 5
            kayitlar.append({'ad': ad, 'puan': max(1, min(5, p)),
                             'metin': metin, 'tarih': tarih[:10]})
    return kayitlar


def js_str(s):
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ') + "'"


def yaz(kayitlar):
    s = io.open(CONFIG, encoding='utf-8').read()
    m = re.search(r'(\n\s*yorumlar:\s*\[)(.*?)(\n\s*\],)', s, re.S)
    if not m:
        print('HATA: config.js icinde yorumlar[] bulunamadi.')
        return False

    satirlar = []
    for y in kayitlar:
        alan = ["ad: %s" % js_str(y['ad']), "puan: %d" % y['puan'], "metin: %s" % js_str(y['metin'])]
        if y.get('tarih'):
            alan.append("tarih: %s" % js_str(y['tarih']))
        alan.append("kaynak: 'Google'")
        satirlar.append('    { ' + ', '.join(alan) + ' }')

    yeni = m.group(1) + '\n' + ',\n'.join(satirlar) + m.group(3)
    s = s[:m.start()] + '\n' + yeni.lstrip('\n') + s[m.end():]
    io.open(CONFIG, 'w', encoding='utf-8', newline='\n').write(s)
    return True


def main():
    ap = argparse.ArgumentParser(description='Google yorumlarini config.js dosyasina aktarir.')
    ap.add_argument('--csv', help='CSV dosyasi (sutunlar: ad, puan, tarih, metin)')
    ap.add_argument('--dosya', default=HAM, help='Kopyala-yapistir metin dosyasi')
    ap.add_argument('--evet', action='store_true', help='Onay sormadan yaz')
    a = ap.parse_args()

    if a.csv:
        if not os.path.exists(a.csv):
            print('Dosya yok:', a.csv); sys.exit(1)
        kayit = csv_coz(a.csv)
    else:
        if not os.path.exists(a.dosya):
            io.open(a.dosya, 'w', encoding='utf-8').write(
                '# Google Haritalar yorumlarini buraya yapistirin, sonra:\n'
                '#   python _work/yorum_ekle.py\n')
            print('Bos dosya olusturuldu:', a.dosya)
            print('Google yorumlarini bu dosyaya yapistirip betigi tekrar calistirin.')
            sys.exit(0)
        ham = io.open(a.dosya, encoding='utf-8').read()
        ham = '\n'.join(l for l in ham.splitlines() if not l.startswith('#'))
        kayit = ham_coz(ham)

    if not kayit:
        print('Hic yorum ayiklanamadi. Dosya bos ya da bicim taninmadi.')
        print('Ipucu: her yorum bloğu "Ad" / "yıldız + tarih" / "metin" satirlarindan olusmali,')
        print('       bloklar arasinda bir bos satir birakilmali.')
        sys.exit(1)

    print('%d yorum ayiklandi. Ornek:' % len(kayit))
    for y in kayit[:5]:
        print('  %-22s %d/5  %-10s %s' % (y['ad'][:22], y['puan'], y['tarih'] or '-', y['metin'][:60]))
    ort = sum(y['puan'] for y in kayit) / float(len(kayit))
    print('Ortalama: %.2f / 5' % ort)

    if not a.evet:
        try:
            c = raw_input('config.js dosyasina yazilsin mi? (e/h) ')  # noqa: F821
        except NameError:
            c = input('config.js dosyasina yazilsin mi? (e/h) ')
        if c.strip().lower() not in ('e', 'evet', 'y', 'yes'):
            print('Vazgecildi.'); sys.exit(0)

    if yaz(kayit):
        print('config.js guncellendi. Siteyi yenileyin — yorumlar bolumu dolacak.')
        print('NOT: Google verisini siteye tasimak icin isletmenin onayi yeterlidir;')
        print('     yorum sahiplerinin adlari Google\'da zaten aleni olarak yayindadir.')


if __name__ == '__main__':
    main()
