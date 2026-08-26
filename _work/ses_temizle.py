# -*- coding: utf-8 -*-
"""
Ses yalnızca tezgâh videolarında kalsın.

Sitede yalnızca tezgâh karolarında hoparlör düğmesi var; diğer videolar hiçbir
zaman sesli çalmıyor. Onlardaki ses parçası boşuna yer kaplıyor.

Yeniden kodlama YOK — görüntü akışı olduğu gibi kopyalanır (saniyeler sürer).
"""
import glob
import os
import subprocess

import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()

# gen_media.py -> TEZGAH listesi
SESLI_KALSIN = {'v00', 'v01', 'v03', 'v06', 'v09', 'v11'}

top_once = top_sonra = 0
for p in sorted(glob.glob('assets/video/v*.mp4')):
    key = os.path.splitext(os.path.basename(p))[0]
    once = os.path.getsize(p)
    top_once += once
    if key in SESLI_KALSIN:
        top_sonra += once
        print('%s  ses korundu   %.2f MB' % (key, once / 1048576))
        continue

    o = subprocess.run([FF, '-hide_banner', '-i', p],
                       capture_output=True, text=True, errors='ignore').stderr
    if 'Audio:' not in o:
        top_sonra += once
        print('%s  zaten sessiz  %.2f MB' % (key, once / 1048576))
        continue

    gec = p + '.tmp.mp4'
    r = subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y', '-i', p,
                        '-c:v', 'copy', '-an', '-movflags', '+faststart', gec],
                       capture_output=True, text=True, errors='ignore')
    if r.returncode != 0:
        print('%s  HATA, dokunulmadi' % key)
        print(r.stderr[-500:])
        top_sonra += once
        continue
    os.replace(gec, p)
    sonra = os.path.getsize(p)
    top_sonra += sonra
    print('%s  ses cikarildi %.2f -> %.2f MB' % (key, once / 1048576, sonra / 1048576))

print('\nTOPLAM %.1f -> %.1f MB' % (top_once / 1048576, top_sonra / 1048576))
