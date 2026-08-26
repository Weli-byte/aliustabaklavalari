# -*- coding: utf-8 -*-
"""
LOGOYU SİTE İÇİN HAZIRLA

Kaynak logo koyu yeşil/siyah bir zemin üzerinde duruyor. Site zaten koyu
olduğu için o zemin gereksiz; dikdörtgen bir kutu gibi görünüyor.

Yapılan: parlaklığa göre alfa maskesi. Koyu zemin şeffaflaşır, altın çerçeve
ve fıstık öğeleri olduğu gibi kalır. Renklere dokunulmaz.

Çıktılar:
    assets/img/logo.webp        640 px  — alt bilgi / büyük kullanım
    assets/img/logo-sm.webp     160 px  — üst menü
    (+ aynı adlarla .avif)

Kullanım:  python _work/logo_hazirla.py "<kaynak.png>"
"""
import io
import os
import sys

import numpy as np
from PIL import Image, features

KAYNAK = (sys.argv[1] if len(sys.argv) > 1 else
          os.path.join(os.path.expanduser('~'), 'OneDrive', 'Resimler',
                       'Ekran Görüntüleri', 'Ekran görüntüsü 2026-08-26 231112.png'))

OUT = 'assets/img'

# Alfa eşikleri: bu parlaklığın altı tamamen şeffaf, üstü tamamen opak.
ALT = 30.0
UST = 80.0


def main():
    if not os.path.exists(KAYNAK):
        print('Kaynak bulunamadi:', KAYNAK)
        sys.exit(1)

    im = Image.open(KAYNAK).convert('RGB')
    a = np.asarray(im).astype(np.float32)
    lum = 0.2126 * a[:, :, 0] + 0.7152 * a[:, :, 1] + 0.0722 * a[:, :, 2]

    # yumuşak geçişli alfa (smoothstep)
    t = np.clip((lum - ALT) / (UST - ALT), 0.0, 1.0)
    alfa = t * t * (3.0 - 2.0 * t)

    # çok soluk kalan altın detaylar kaybolmasın: tabanı biraz yukarı çek
    alfa = np.where(lum > UST, 1.0, alfa)
    alfa = (alfa * 255.0).astype(np.uint8)

    rgba = np.dstack([np.asarray(im), alfa])
    logo = Image.fromarray(rgba, 'RGBA')

    # içeriğe göre kırp (şeffaf kenar boşluklarını at)
    kutu = logo.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    if kutu:
        logo = logo.crop(kutu)
    print('kirpma sonrasi:', logo.size)

    os.makedirs(OUT, exist_ok=True)
    for ad, gen, kal in (('logo', 640, 88), ('logo-sm', 160, 86)):
        k = logo.copy()
        if k.size[0] > gen:
            k = k.resize((gen, round(k.size[1] * gen / k.size[0])), Image.LANCZOS)
        yol = '%s/%s.webp' % (OUT, ad)
        k.save(yol, 'WEBP', quality=kal, method=6, lossless=False, exact=False)
        print('%-9s %sx%s  %.0f KB' % (ad, k.size[0], k.size[1],
                                       os.path.getsize(yol) / 1024))
        if features.check('avif'):
            ya = '%s/%s.avif' % (OUT, ad)
            k.save(ya, 'AVIF', quality=kal - 6, speed=4)
            if os.path.getsize(ya) >= os.path.getsize(yol):
                os.remove(ya)
                print('          AVIF daha buyuk, atlandi')
            else:
                print('          avif %.0f KB' % (os.path.getsize(ya) / 1024))


if __name__ == '__main__':
    main()
