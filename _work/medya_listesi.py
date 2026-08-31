# -*- coding: utf-8 -*-
"""
MEDYA-LISTESI.md dosyasini uretir.

gen_media.py her calistiginda _work/coverage.md tablosunu yaziyor; bu betik
o tabloya basligi ekleyip kok dizindeki MEDYA-LISTESI.md dosyasina koyar.
Sayilar manifestlerden okundugu icin elle guncelleme gerekmez.

Kullanim:  python _work/medya_listesi.py
"""
import io
import json
import os
import sys

if not os.path.exists('_work/coverage.md'):
    print('_work/coverage.md yok. Once: python _work/gen_media.py')
    sys.exit(1)

img = json.load(io.open('_work/img_manifest.json', encoding='utf-8'))
vid = json.load(io.open('_work/vid_manifest.json', encoding='utf-8'))
tablo = io.open('_work/coverage.md', encoding='utf-8').read()

baslik = (
    '# Medya kullanim listesi\n'
    '\n'
    'DATA/ klasorundeki **{f} fotograf + {v} video + 1 tanitim filmi = {t} dosyanin '
    'tamami** sitede kullaniliyor.\n'
    'Asagidaki tablo her kaynak dosyanin hangi bolumde gorundugunu listeler.\n'
    'Bu dosya `_work/gen_media.py` + `_work/medya_listesi.py` tarafindan uretilir; '
    'kullanilmayan dosya kalirsa gen_media hata verir.\n'
    '\n'
).format(f=len(img), v=len(vid), t=len(img) + len(vid) + 1)

# Turkce karakterleri geri koy (kaynak dosyada ASCII yazildi)
baslik = (baslik
          .replace('kullanim listesi', 'kullanım listesi')
          .replace('klasorundeki', 'klasöründeki')
          .replace('fotograf +', 'fotoğraf +')
          .replace('tanitim filmi', 'tanıtım filmi')
          .replace('dosyanin', 'dosyanın')
          .replace('tamami', 'tamamı')
          .replace('kullaniliyor', 'kullanılıyor')
          .replace('Asagidaki', 'Aşağıdaki')
          .replace('hangi bolumde gorundugunu', 'hangi bölümde göründüğünü')
          .replace('tarafindan uretilir', 'tarafından üretilir')
          .replace('kullanilmayan', 'kullanılmayan'))
baslik = baslik.replace('# Medya kullanım listesi',
                        '# Medya kullanım listesi — Ali Usta Baklavaları')

io.open('MEDYA-LISTESI.md', 'w', encoding='utf-8', newline='\n').write(baslik + tablo)
print('MEDYA-LISTESI.md yazildi: %d fotograf, %d video, %d satir'
      % (len(img), len(vid), tablo.count('\n| `')))
