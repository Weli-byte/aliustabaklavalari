# -*- coding: utf-8 -*-
"""
DATA/ KLASÖRÜNE SONRADAN EKLENEN MEDYAYI SİTEYE HAZIRLA

Bu dosyalar Instagram ekran görüntüsü/kaydı DEĞİL — doğrudan işletmeden
gelen WhatsApp dosyaları. Arayüz kalıntısı taşımadıkları için kırpma
uygulanmaz; yalnızca hafif temizlik, keskinleştirme ve kodlama yapılır.

Mevcut v00–v16 ve p00–p64 dosyalarına dokunulmaz; yeni anahtarlar eklenir.

Kullanım:  python _work/yeni_medya.py
"""
import glob
import io
import json
import os
import re
import subprocess
import sys

from PIL import Image
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()

OUT_L, OUT_T = 'assets/img', 'assets/img/thumb'
OUT_V, OUT_P = 'assets/video', 'assets/video/poster'
GEC = '_work/_gecici'

# Instagram kaynaklarına göre çok daha temiz geldikleri için hafif zincir
VID_VF = 'hqdn3d=2:1:4:3,unsharp=5:5:0.6:5:5:0.0'
FOTO_VF = 'unsharp=5:5:0.7:5:5:0.0'


def kos(args, ad):
    r = subprocess.run(args, capture_output=True, text=True, errors='ignore')
    if r.returncode != 0:
        print('HATA (%s):' % ad)
        print(r.stderr[-1200:])
        sys.exit(1)


def probe(p):
    o = subprocess.run([FF, '-hide_banner', '-i', p],
                       capture_output=True, text=True, errors='ignore').stderr
    d = re.search(r'Duration: (\d+):(\d+):([\d.]+)', o)
    dur = int(d.group(1)) * 3600 + int(d.group(2)) * 60 + float(d.group(3))
    s = re.search(r'Video: .*?, (\d+)x(\d+)', o)
    return dur, int(s.group(1)), int(s.group(2))


def dominant(im):
    import colorsys
    small = im.convert('RGB').resize((48, 48))
    px = list(small.getdata())
    r = sum(p[0] for p in px) // len(px)
    g = sum(p[1] for p in px) // len(px)
    b = sum(p[2] for p in px) // len(px)
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    l = min(0.42, max(0.10, l * 0.55))
    s = min(0.55, s)
    r2, g2, b2 = colorsys.hls_to_rgb(h, l, s)
    return '#%02x%02x%02x' % (int(r2 * 255), int(g2 * 255), int(b2 * 255))


# =====================================================================
def videolar():
    vm = json.load(io.open('_work/vid_manifest.json', encoding='utf-8'))
    var = {m['src'] for m in vm}
    yeni = [p for p in sorted(glob.glob('DATA/*.mp4'))
            if os.path.basename(p) not in var
            and not os.path.basename(p).lower().startswith('hero')]
    if not yeni:
        print('yeni video yok')
        return vm

    n = max(int(m['key'][1:]) for m in vm) + 1
    print('%d yeni video, v%02d ten itibaren' % (len(yeni), n))

    for p in yeni:
        key = 'v%02d' % n
        dur, W, H = probe(p)
        hedef = min(W * 2, 900)
        hedef -= hedef % 2
        vf = '%s,scale=%d:-2:flags=lanczos' % (VID_VF, hedef)

        out = '%s/%s.mp4' % (OUT_V, key)
        kos([FF, '-hide_banner', '-loglevel', 'error', '-y', '-i', p,
             '-vf', vf, '-an',
             '-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p',
             '-crf', '29', '-preset', 'slow', '-g', '60',
             '-movflags', '+faststart', out], key)

        ps = '%s/%s.webp' % (OUT_P, key)
        kos([FF, '-hide_banner', '-loglevel', 'error', '-y',
             '-ss', str(round(dur * 0.35, 2)), '-i', p,
             '-frames:v', '1', '-vf', vf, '-quality', '80', ps], key + ' poster')
        pw, ph = Image.open(ps).size

        vm.append(dict(key=key, src=os.path.basename(p), dur=round(dur, 1),
                       w=pw, h=ph, kb=os.path.getsize(out) // 1024,
                       poster_kb=os.path.getsize(ps) // 1024))
        print('  %s  %dx%d  %.1f sn  %.2f MB' % (key, pw, ph, dur, os.path.getsize(out) / 1048576))
        n += 1

    json.dump(vm, io.open('_work/vid_manifest.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    return vm


# =====================================================================
def fotograflar():
    im_m = json.load(io.open('_work/img_manifest.json', encoding='utf-8'))
    var = {m['src'] for m in im_m}
    yeni = [p for p in sorted(glob.glob('DATA/*.jpeg')) + sorted(glob.glob('DATA/*.jpg'))
            if os.path.basename(p) not in var]
    if not yeni:
        print('yeni fotograf yok')
        return im_m

    os.makedirs(GEC, exist_ok=True)
    n = max(int(m['key'][1:]) for m in im_m) + 1
    print('%d yeni fotograf, p%02d ten itibaren' % (len(yeni), n))

    for p in yeni:
        key = 'p%02d' % n
        im = Image.open(p).convert('RGB')
        w, h = im.size
        gi, go = os.path.join(GEC, '_fi.png'), os.path.join(GEC, '_fo.png')
        im.save(gi)

        buyuk = min(w, 1400)
        kos([FF, '-hide_banner', '-loglevel', 'error', '-y', '-i', gi,
             '-vf', '%s,scale=%d:-2:flags=lanczos' % (FOTO_VF, buyuk),
             '-frames:v', '1', go], key)
        E = Image.open(go).convert('RGB')
        E.save('%s/%s.webp' % (OUT_L, key), 'WEBP', quality=78, method=6)

        tw = int(E.size[0] * 0.58)
        TH = E.resize((tw, round(E.size[1] * tw / E.size[0])), Image.LANCZOS)
        TH.save('%s/%s.webp' % (OUT_T, key), 'WEBP', quality=72, method=6)

        im_m.append(dict(key=key, src=os.path.basename(p),
                         w=E.size[0], h=E.size[1], tw=TH.size[0], th=TH.size[1],
                         bg=dominant(E),
                         kb_large=os.path.getsize('%s/%s.webp' % (OUT_L, key)) // 1024,
                         kb_thumb=os.path.getsize('%s/%s.webp' % (OUT_T, key)) // 1024))
        print('  %s  %dx%d -> %dx%d  %d/%d KB' %
              (key, w, h, E.size[0], E.size[1],
               im_m[-1]['kb_large'], im_m[-1]['kb_thumb']))
        n += 1

    json.dump(im_m, io.open('_work/img_manifest.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    return im_m


if __name__ == '__main__':
    if not os.path.isdir('DATA'):
        print('DATA klasoru yok. Betigi proje kokunden calistirin.')
        sys.exit(1)
    fotograflar()
    print()
    videolar()
    print('\nSira: gen_media.py icindeki yerlestirmeleri guncelle, sonra')
    print('  python _work/build_avif.py')
    print('  python _work/gen_media.py')
    print('  python _work/build_langs.py')
