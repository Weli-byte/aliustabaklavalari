# -*- coding: utf-8 -*-
"""
KALİTE İYİLEŞTİRMESİNİ TÜM MEDYAYA UYGULA
=========================================

Dosya adları, kadrajlar, sıralar ve sitedeki yerleri DEĞİŞMEZ.
Yalnızca çözünürlük ve netlik artar.

Yöntem (ayrıntı uydurulmaz, sıkıştırma hasarı temizlenir):
  Fotoğraf : nlmeans gürültü temizliği + unsharp + Lanczos 2× + ince unsharp
  Video    : hqdn3d + nlmeans + unsharp + Lanczos büyütme + daha yüksek bitrate
  Hero     : profesyonel çekim — yalnızca hafif temizlik, büyütme yok

Kullanım:
    python _work/kalite_uygula.py yedek
    python _work/kalite_uygula.py foto
    python _work/kalite_uygula.py video
    python _work/kalite_uygula.py hero
"""
import glob
import io
import json
import os
import re
import shutil
import subprocess
import sys
import time

from PIL import Image
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()

OUT_L = 'assets/img'
OUT_T = 'assets/img/thumb'
OUT_V = 'assets/video'
OUT_P = 'assets/video/poster'
GEC = '_work/_gecici'

# --- fotoğraf ayarları -------------------------------------------------
TRIM = dict(l=0.085, r=0.085, t=0.020, b=0.050)
TRIM_SOFT = dict(l=0.030, r=0.030, t=0.018, b=0.040)
SOFT = {20, 21, 47, 50, 60, 61}
FOTO_VF = ('nlmeans=s=1.4:p=5:r=11,'
           'unsharp=5:5:1.0:5:5:0.0,'
           'scale=%d:-2:flags=lanczos,'
           'unsharp=3:3:0.5:3:3:0.0')
BIG_MAX = 1500
BIG_Q = 76
TH_ORAN = 0.58
TH_Q = 70

# --- video ayarları ----------------------------------------------------
FEATURE = {0, 4, 5, 8, 13}          # tam genişlik / öne çıkan kullanımlar
EXTRA_TOP = {13: 0.15}
VID_DEN = 'hqdn3d=3:2:6:4,nlmeans=s=1.5:p=3:r=7,unsharp=5:5:0.8:5:5:0.0'
SESLI = True                         # tezgâh videolarının sesi korunur


def mb(p):
    return os.path.getsize(p) / 1048576.0


def kos(args):
    r = subprocess.run(args, capture_output=True, text=True, errors='ignore')
    if r.returncode != 0:
        print(r.stderr[-1600:])
        raise SystemExit('ffmpeg hatasi')


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
def yedek():
    hedef = '_yedek_medya'
    if os.path.isdir(hedef):
        print('yedek zaten var:', hedef)
        return
    os.makedirs(hedef)
    for k in ('assets/img', 'assets/video'):
        shutil.copytree(k, os.path.join(hedef, k.replace('/', os.sep)))
    print('yedek alindi ->', hedef)


# =====================================================================
def foto():
    os.makedirs(GEC, exist_ok=True)
    SRC = sorted(glob.glob('DATA/*.png'))
    manifest = []
    t0 = time.time()
    top_b = top_t = 0.0

    for i, p in enumerate(SRC):
        key = 'p%02d' % i
        im = Image.open(p).convert('RGB')
        W, H = im.size
        T = TRIM_SOFT if i in SOFT else TRIM
        im = im.crop((int(W * T['l']), int(H * T['t']),
                      int(W * (1 - T['r'])), int(H * (1 - T['b']))))
        w, h = im.size

        gec_in = os.path.join(GEC, '_in.png')
        gec_out = os.path.join(GEC, '_out.png')
        im.save(gec_in)

        w2 = min((w * 2) - (w * 2) % 2, BIG_MAX)
        kos([FF, '-hide_banner', '-loglevel', 'error', '-y', '-i', gec_in,
             '-vf', FOTO_VF % w2, '-frames:v', '1', gec_out])
        E = Image.open(gec_out).convert('RGB')

        E.save('%s/%s.webp' % (OUT_L, key), 'WEBP', quality=BIG_Q, method=6)

        tw = int(E.size[0] * TH_ORAN)
        TH = E.resize((tw, round(E.size[1] * tw / E.size[0])), Image.LANCZOS)
        TH.save('%s/%s.webp' % (OUT_T, key), 'WEBP', quality=TH_Q, method=6)

        kb_b = os.path.getsize('%s/%s.webp' % (OUT_L, key)) // 1024
        kb_t = os.path.getsize('%s/%s.webp' % (OUT_T, key)) // 1024
        top_b += kb_b
        top_t += kb_t

        manifest.append(dict(key=key, src=os.path.basename(p),
                             w=E.size[0], h=E.size[1],
                             tw=TH.size[0], th=TH.size[1],
                             bg=dominant(E),
                             kb_large=kb_b, kb_thumb=kb_t))
        print('%s  %dx%d -> %dx%d   %d/%d KB' %
              (key, w, h, E.size[0], E.size[1], kb_b, kb_t), flush=True)

    json.dump(manifest, io.open('_work/img_manifest.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    print('\nFOTOGRAF BITTI  %d dosya  buyuk %.1f MB + kucuk %.1f MB  (%.0f sn)'
          % (len(manifest), top_b / 1024, top_t / 1024, time.time() - t0))


# =====================================================================
def probe(p):
    o = subprocess.run([FF, '-hide_banner', '-i', p],
                       capture_output=True, text=True, errors='ignore').stderr
    d = re.search(r'Duration: (\d+):(\d+):([\d.]+)', o)
    dur = int(d.group(1)) * 3600 + int(d.group(2)) * 60 + float(d.group(3))
    s = re.search(r'Video: .*?, (\d+)x(\d+)', o)
    ses = 'Audio:' in o
    return dur, int(s.group(1)), int(s.group(2)), ses


def detect_crop(p, dur, W, H):
    o = subprocess.run([FF, '-hide_banner', '-ss', str(round(dur * 0.4, 2)), '-i', p, '-t', '4',
                        '-vf', 'cropdetect=16:2:0', '-f', 'null', '-'],
                       capture_output=True, text=True, errors='ignore').stderr
    m = re.findall(r'crop=(\d+):(\d+):(\d+):(\d+)', o)
    if not m:
        return None
    from collections import Counter
    cw, ch, cx, cy = map(int, Counter(m).most_common(1)[0][0])
    if cw < W * 0.6 or ch < H * 0.6:
        return None
    if cw >= W and ch >= H:
        return None
    return cw, ch, cx, cy


def video():
    SRC = [p for p in sorted(glob.glob('DATA/*.mp4'))
           if not os.path.basename(p).lower().startswith('hero')]
    manifest = []
    t0 = time.time()
    top = 0.0

    for i, p in enumerate(SRC):
        key = 'v%02d' % i
        dur, W, H, ses = probe(p)
        filtre = []
        c = detect_crop(p, dur, W, H)
        if c:
            cw, ch, cx, cy = c
            filtre.append('crop=%d:%d:%d:%d' % (cw, ch, cx, cy))
            W, H = cw, ch
        L, R, T, B = 0.04, 0.04, 0.03, 0.06
        T += EXTRA_TOP.get(i, 0.0)
        x0 = (int(W * L) // 2) * 2
        y0 = (int(H * T) // 2) * 2
        nw = W - x0 - int(W * R)
        nh = H - y0 - int(H * B)
        nw -= nw % 2
        nh -= nh % 2
        filtre.append('crop=%d:%d:%d:%d' % (nw, nh, x0, y0))

        one_cikan = i in FEATURE
        hedef = min(nw * 2, 980 if one_cikan else 820)
        hedef -= hedef % 2
        crf = '32' if one_cikan else '33'

        filtre.append(VID_DEN)
        if hedef != nw:
            filtre.append('scale=%d:-2:flags=lanczos' % hedef)
        vf = ','.join(filtre)

        out = '%s/%s.mp4' % (OUT_V, key)
        arg = [FF, '-hide_banner', '-loglevel', 'error', '-y', '-i', p, '-vf', vf]
        if ses and SESLI:
            arg += ['-c:a', 'aac', '-b:a', '96k']
        else:
            arg += ['-an']
        arg += ['-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p',
                '-crf', crf, '-preset', 'slow', '-g', '60',
                '-movflags', '+faststart', out]
        kos(arg)

        ps = '%s/%s.webp' % (OUT_P, key)
        kos([FF, '-hide_banner', '-loglevel', 'error', '-y',
             '-ss', str(round(dur * 0.25, 2)), '-i', p,
             '-frames:v', '1', '-vf', vf, '-quality', '80', ps])
        pw, ph = Image.open(ps).size

        kb = os.path.getsize(out) // 1024
        top += kb
        manifest.append(dict(key=key, src=os.path.basename(p), dur=round(dur, 1),
                             w=pw, h=ph, kb=kb,
                             poster_kb=os.path.getsize(ps) // 1024))
        print('%s  %dx%d  %.1f sn  %.2f MB%s' %
              (key, pw, ph, dur, kb / 1024.0, '  (sesli)' if ses and SESLI else ''),
              flush=True)

    json.dump(manifest, io.open('_work/vid_manifest.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    print('\nVIDEO BITTI  %d dosya  %.1f MB  (%.0f sn)'
          % (len(manifest), top / 1024, time.time() - t0))


# =====================================================================
def hero():
    """Profesyonel çekim: büyütme yok, yalnızca hafif temizlik + daha iyi bitrate."""
    p = [q for q in glob.glob('DATA/*.mp4')
         if os.path.basename(q).lower().startswith('hero')][0]
    dur, W, H, ses = probe(p)
    print('hero kaynak: %dx%d  %.1f sn' % (W, H, dur))
    den = 'hqdn3d=2:1:4:3,unsharp=5:5:0.5:5:5:0.0'

    for ad, gen, crf in (('hero', 1280, '21'), ('hero-sm', 854, '23')):
        out = '%s/%s.mp4' % (OUT_V, ad)
        kos([FF, '-hide_banner', '-loglevel', 'error', '-y', '-i', p,
             '-vf', '%s,scale=%d:-2:flags=lanczos' % (den, gen), '-an',
             '-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p',
             '-crf', crf, '-preset', 'slow', '-g', '60',
             '-movflags', '+faststart', out])
        print('  %-8s %4d px  %.2f MB' % (ad, gen, mb(out)))

    ps = '%s/hero.webp' % OUT_P
    kos([FF, '-hide_banner', '-loglevel', 'error', '-y', '-ss', str(round(dur * 0.2, 2)),
         '-i', p, '-frames:v', '1',
         '-vf', '%s,scale=1280:-2:flags=lanczos' % den, '-quality', '82', ps])
    print('  poster   %s  %.0f KB' % (Image.open(ps).size, os.path.getsize(ps) / 1024))


if __name__ == '__main__':
    ne = sys.argv[1] if len(sys.argv) > 1 else ''
    if ne == 'yedek':
        yedek()
    elif ne == 'foto':
        foto()
    elif ne == 'video':
        video()
    elif ne == 'hero':
        hero()
    else:
        print(__doc__)
