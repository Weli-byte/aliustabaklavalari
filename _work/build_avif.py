# -*- coding: utf-8 -*-
"""
AVIF ÜRETİCİ
============

Mevcut .webp görsellerin yanına aynı adla .avif üretir. Site <picture>
kullanır: tarayıcı AVIF destekliyorsa onu, desteklemiyorsa WebP'yi indirir.
Kaynak dosyalar silinmez — AVIF üretilemezse site aynen çalışmaya devam eder.

Kullanım:
    python _work/build_avif.py            # eksikleri üretir
    python _work/build_avif.py --hepsi    # hepsini yeniden üretir
"""
import io, os, sys, time

from PIL import Image, features

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KLASORLER = [
    ('assets/img',            42),   # tam boy görseller
    ('assets/img/thumb',      45),   # kart/ray küçük görselleri
    ('assets/video/poster',   45),   # video kapakları
]
HEPSI = '--hepsi' in sys.argv


def main():
    if not features.check('avif'):
        print('Bu Pillow surumunde AVIF destegi yok. Kurulum:')
        print('    pip install --upgrade "pillow>=11.3"')
        sys.exit(1)

    top_webp = top_avif = 0
    uretilen = atlanan = 0
    t0 = time.time()

    for goreli, kalite in KLASORLER:
        klasor = os.path.join(KOK, goreli.replace('/', os.sep))
        if not os.path.isdir(klasor):
            continue
        for ad in sorted(os.listdir(klasor)):
            if not ad.lower().endswith('.webp'):
                continue
            kaynak = os.path.join(klasor, ad)
            hedef = kaynak[:-5] + '.avif'

            if os.path.exists(hedef) and not HEPSI \
               and os.path.getmtime(hedef) >= os.path.getmtime(kaynak):
                atlanan += 1
                top_webp += os.path.getsize(kaynak)
                top_avif += os.path.getsize(hedef)
                continue

            with Image.open(kaynak) as im:
                im = im.convert('RGB')
                im.save(hedef, format='AVIF', quality=kalite,
                        speed=4, subsampling='4:2:0')

            w = os.path.getsize(kaynak)
            a = os.path.getsize(hedef)
            # AVIF beklenmedik şekilde büyükse tutmanın anlamı yok
            if a >= w:
                os.remove(hedef)
                print('  %-28s AVIF daha buyuk, atlandi' % ad)
                top_webp += w
                continue
            top_webp += w
            top_avif += a
            uretilen += 1
            print('  %-28s %6.1f KB -> %6.1f KB  (%%%d)'
                  % (ad, w / 1024.0, a / 1024.0, 100 - int(a * 100.0 / w)))

    print('')
    print('Uretilen: %d   Guncel (atlanan): %d   Sure: %.1f sn'
          % (uretilen, atlanan, time.time() - t0))
    if top_webp:
        print('Toplam: WebP %.1f MB -> AVIF %.1f MB  (%%%d kucuk)'
              % (top_webp / 1048576.0, top_avif / 1048576.0,
                 100 - int(top_avif * 100.0 / top_webp)))


if __name__ == '__main__':
    main()
