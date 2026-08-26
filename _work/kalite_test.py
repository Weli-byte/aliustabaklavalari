# -*- coding: utf-8 -*-
"""
KALİTE İYİLEŞTİRME — DENEME
===========================

Siteye HİÇBİR ŞEY yazmaz. Tek bir fotoğraf ve tek bir video üzerinde
"önce / sonra" dosyaları üretip İndirilenler klasörüne koyar.

Yöntem — ayrıntı UYDURULMAZ, yalnızca hasar giderilir:
  Fotoğraf : Lanczos 2× büyütme + ölçülü unsharp mask
  Video    : hqdn3d + nlmeans (sıkıştırma bulanıklığını temizler)
             + unsharp + Lanczos 2× + yüksek bitrate (CRF 18)

AI yok, uydurma piksel yok. Orijinaller DATA/ içinde duruyor.

Kullanım:  python _work/kalite_test.py
"""
import glob
import io
import os
import re
import shutil
import subprocess
import sys
import time

from PIL import Image, ImageFilter

import imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()

HEDEF = os.path.join(os.path.expanduser('~'), 'Downloads', 'aliusta-kalite-testi')
os.makedirs(HEDEF, exist_ok=True)

FOTO_KEY = 'p26'          # Midye Baklava
FOTO_IDX = 26
VIDEO_KEY = 'v08'         # "Neden Ali Usta" arka planındaki kayıt
VIDEO_IDX = 8
SANIYE = 8                # video örneğinin uzunluğu


def kb(p):
    return os.path.getsize(p) / 1024.0


# =====================================================================
# FOTOĞRAF
# =====================================================================
def foto():
    print('\n--- FOTOGRAF ---')
    src = sorted(glob.glob('DATA/*.png'))[FOTO_IDX]
    print('kaynak:', os.path.basename(src))

    # build_img.py ile birebir aynı kırpma
    TRIM = dict(l=0.085, r=0.085, t=0.020, b=0.050)
    im = Image.open(src).convert('RGB')
    W, H = im.size
    im = im.crop((int(W * TRIM['l']), int(H * TRIM['t']),
                  int(W * (1 - TRIM['r'])), int(H * (1 - TRIM['b']))))
    w, h = im.size
    print('kirpma sonrasi kaynak: %dx%d' % (w, h))

    hedef_w = w * 2
    hedef_h = h * 2

    # --- A: BUGÜNKÜ HÂLİ ---------------------------------------------
    # Sitedeki dosya kaynak boyutunda (562x788). Masaüstünde tarayıcı onu
    # iki katına çıkarıyor. Ekranda görülen bulanıklık tam olarak budur.
    a = Image.open('assets/img/%s.webp' % FOTO_KEY).convert('RGB')
    a = a.resize((hedef_w, hedef_h), Image.BICUBIC)
    pa = os.path.join(HEDEF, '1-FOTOGRAF-SIMDIKI.png')
    a.save(pa, 'PNG')
    print('A (simdiki)      : %dx%d  %.0f KB' % (a.size[0], a.size[1], kb(pa)))

    # --- B: İYİLEŞTİRİLMİŞ -------------------------------------------
    b = im.resize((hedef_w, hedef_h), Image.LANCZOS)
    # Ölçülü keskinleştirme: radius küçük, percent orta, threshold gürültüyü korur
    b = b.filter(ImageFilter.UnsharpMask(radius=1.4, percent=95, threshold=3))
    pb = os.path.join(HEDEF, '2-FOTOGRAF-IYILESTIRILMIS.png')
    b.save(pb, 'PNG')
    print('B (iyilestirilmis): %dx%d  %.0f KB' % (b.size[0], b.size[1], kb(pb)))

    # siteye girecek hâli (WebP) — boyut fikri versin diye
    pw = os.path.join(HEDEF, '2b-FOTOGRAF-IYILESTIRILMIS-webp-hali.webp')
    b.save(pw, 'WEBP', quality=84, method=6)
    eski_kb = kb('assets/img/%s.webp' % FOTO_KEY)
    print('   siteye girecek WebP: %.0f KB  (bugunku dosya %.0f KB)' % (kb(pw), eski_kb))

    # --- yan yana ----------------------------------------------------
    yan = Image.new('RGB', (hedef_w * 2 + 24, hedef_h), (18, 12, 6))
    yan.paste(a, (0, 0))
    yan.paste(b, (hedef_w + 24, 0))
    py = os.path.join(HEDEF, '3-FOTOGRAF-YANYANA-sol-simdiki-sag-yeni.png')
    yan.save(py, 'PNG')
    print('yan yana         : %s' % os.path.basename(py))

    # --- %100 kırpma (detay) -----------------------------------------
    # Ortadan 620x620'lik bir parça: fark en net burada görülür.
    cx, cy = hedef_w // 2, hedef_h // 2
    kutu = (cx - 310, cy - 310, cx + 310, cy + 310)
    da, db = a.crop(kutu), b.crop(kutu)
    det = Image.new('RGB', (620 * 2 + 24, 620), (18, 12, 6))
    det.paste(da, (0, 0))
    det.paste(db, (620 + 24, 0))
    pd = os.path.join(HEDEF, '4-FOTOGRAF-DETAY-100x-sol-simdiki-sag-yeni.png')
    det.save(pd, 'PNG')
    print('detay kirpma     : %s' % os.path.basename(pd))


# =====================================================================
# VİDEO
# =====================================================================
def probe(p):
    o = subprocess.run([FF, '-hide_banner', '-i', p],
                       capture_output=True, text=True, errors='ignore').stderr
    d = re.search(r'Duration: (\d+):(\d+):([\d.]+)', o)
    dur = int(d.group(1)) * 3600 + int(d.group(2)) * 60 + float(d.group(3))
    s = re.search(r'Video: .*?, (\d+)x(\d+)', o)
    return dur, int(s.group(1)), int(s.group(2))


def kos(args, ad):
    t = time.time()
    r = subprocess.run(args, capture_output=True, text=True, errors='ignore')
    if r.returncode != 0:
        print('HATA (%s):' % ad)
        print(r.stderr[-1500:])
        raise SystemExit(1)
    print('   %s bitti (%.0f sn)' % (ad, time.time() - t))


def video():
    print('\n--- VIDEO ---')
    src = sorted(glob.glob('DATA/*.mp4'))[VIDEO_IDX]
    print('kaynak:', os.path.basename(src))
    dur, W, H = probe(src)
    print('kaynak: %dx%d  %.1f sn' % (W, H, dur))

    # build_vid.py ile aynı Instagram arayüz kırpması
    L, R, T, B = 0.04, 0.04, 0.03, 0.06
    x0 = (int(W * L) // 2) * 2
    y0 = (int(H * T) // 2) * 2
    nw = W - x0 - int(W * R)
    nh = H - y0 - int(H * B)
    nw -= nw % 2
    nh -= nh % 2
    crop = 'crop=%d:%d:%d:%d' % (nw, nh, x0, y0)
    print('kirpma sonrasi: %dx%d' % (nw, nh))

    bas = max(0.0, min(dur * 0.35, max(0.0, dur - SANIYE)))
    ss = '%.2f' % bas

    hedef_w = (nw * 2) - ((nw * 2) % 2)

    # --- A: BUGÜNKÜ HÂLİ ---------------------------------------------
    # Sitedeki dosyayı alıp tarayıcının yaptığı gibi 2× büyütüyoruz.
    pa = os.path.join(HEDEF, '5-VIDEO-SIMDIKI.mp4')
    kos([FF, '-hide_banner', '-loglevel', 'error', '-y',
         '-ss', ss, '-t', str(SANIYE), '-i', 'assets/video/%s.mp4' % VIDEO_KEY,
         '-vf', 'scale=%d:-2:flags=bicubic' % hedef_w,
         '-c:v', 'libx264', '-crf', '18', '-preset', 'medium',
         '-pix_fmt', 'yuv420p', '-movflags', '+faststart', pa], 'A (simdiki)')

    # --- B: İYİLEŞTİRİLMİŞ -------------------------------------------
    #   hqdn3d  : zamansal + uzamsal gürültü/blok temizliği
    #   nlmeans : sıkıştırmanın bıraktığı "yağlı boya" dokusunu çözer (yavaş)
    #   unsharp : temizlik sonrası kenarları geri getirir
    #   scale   : Lanczos 2×
    vf = ','.join([
        crop,
        'hqdn3d=3:2:6:4',
        'nlmeans=s=1.6:p=5:r=11',
        'unsharp=5:5:0.9:5:5:0.0',
        'scale=%d:-2:flags=lanczos' % hedef_w,
    ])
    pb = os.path.join(HEDEF, '6-VIDEO-IYILESTIRILMIS.mp4')
    kos([FF, '-hide_banner', '-loglevel', 'error', '-y',
         '-ss', ss, '-t', str(SANIYE), '-i', src,
         '-vf', vf,
         '-c:v', 'libx264', '-crf', '18', '-preset', 'slow',
         '-pix_fmt', 'yuv420p', '-movflags', '+faststart', pb], 'B (iyilestirilmis)')

    print('A: %.0f KB   B: %.0f KB' % (kb(pa), kb(pb)))

    # --- yan yana ----------------------------------------------------
    py = os.path.join(HEDEF, '7-VIDEO-YANYANA-sol-simdiki-sag-yeni.mp4')
    kos([FF, '-hide_banner', '-loglevel', 'error', '-y',
         '-i', pa, '-i', pb,
         '-filter_complex', '[0:v][1:v]hstack=inputs=2',
         '-c:v', 'libx264', '-crf', '18', '-preset', 'medium',
         '-pix_fmt', 'yuv420p', '-movflags', '+faststart', py], 'yan yana')


OKU = """ALİ USTA — KALİTE İYİLEŞTİRME DENEMESİ
======================================

Bu klasördeki dosyalar SİTEYE EKLENMEDİ. Sadece deneme.

DOSYALAR
--------
1-FOTOGRAF-SIMDIKI.png ................ Sitedeki hâli (tarayıcının büyüttüğü gibi)
2-FOTOGRAF-IYILESTIRILMIS.png ......... Yeni yöntemle
2b-...-webp-hali.webp ................. Siteye girecek dosya biçimi (boyut fikri)
3-FOTOGRAF-YANYANA-....png ............ Solda şimdiki, sağda yeni
4-FOTOGRAF-DETAY-100x-....png ......... Ortadan %100 kırpma — fark en net burada

5-VIDEO-SIMDIKI.mp4 ................... Sitedeki hâli (tarayıcının büyüttüğü gibi)
6-VIDEO-IYILESTIRILMIS.mp4 ............ Yeni yöntemle
7-VIDEO-YANYANA-....mp4 ............... Solda şimdiki, sağda yeni

NASIL BAKMALI
-------------
* Fotoğrafta önce 4 numaralı DETAY dosyasına bakın. Fıstık taneleri,
  yufkanın kat çizgileri ve şerbetin parlaması sağda daha ayrık olmalı.
* Videoda 7 numaralı yan yana dosyayı tam ekran açın. Soldaki görüntüde
  düz alanlarda "yağlı boya" gibi lekeler var; sağda o lekeler temiz,
  kenarlar daha belirgin.
* Ekranı büyütmeden, %100 boyutta bakın. Telefonda değil bilgisayarda.

NE YAPILDI
----------
Fotoğraf : Lanczos 2× büyütme + ölçülü unsharp mask (radius 1.4, %95, eşik 3)
Video    : hqdn3d + nlmeans ile sıkıştırma hasarının temizlenmesi,
           ardından unsharp, Lanczos 2× ve yüksek bitrate (CRF 18)

NE YAPILMADI
------------
* AI ile piksel üretilmedi. Yapay zekâ büyütücü (Topaz, Real-ESRGAN vb.)
  kullanılmadı — bunlar olmayan ayrıntıyı uydurur, fıstığı plastik gösterir.
* Renk, kontrast, doygunluk değiştirilmedi. Görüntü "makyajlanmadı".
* Kırpma değiştirilmedi; kadraj sitedekiyle birebir aynı.

SINIR
-----
Kaynak dosyalar Instagram ekran görüntüsü/kaydı: fotoğraflar ~680 piksel,
videolar ~470 piksel. Bu yöntem SIKIŞTIRMA HASARINI siler, ama olmayan
ayrıntıyı geri getiremez. Gerçek 4K için işletmenin telefonundaki orijinal
dosyalar ya da yeni çekim gerekir.

BEĞENİRSENİZ
------------
Sitedeki 65 fotoğraf ve 17 videonun tamamına aynı işlem uygulanır;
yerleri, kadrajları ve sıraları değişmez — yalnızca kalite artar.
"""


def main():
    if not os.path.isdir('DATA'):
        print('DATA klasoru bulunamadi. Betigi proje kokunden calistirin.')
        sys.exit(1)
    print('Hedef klasor:', HEDEF)
    foto()
    video()
    io.open(os.path.join(HEDEF, '0-OKU-BENI.txt'), 'w',
            encoding='utf-8-sig', newline='\r\n').write(OKU)
    print('\nBitti. Klasor:', HEDEF)
    for f in sorted(os.listdir(HEDEF)):
        print('   %-52s %7.0f KB' % (f, kb(os.path.join(HEDEF, f))))


if __name__ == '__main__':
    main()
