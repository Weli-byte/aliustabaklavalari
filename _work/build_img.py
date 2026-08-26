# -*- coding: utf-8 -*-
import os, io, glob, json, colorsys
from PIL import Image

SRC = sorted(glob.glob('DATA/*.png'))
OUT_L = 'assets/img'
OUT_T = 'assets/img/thumb'
os.makedirs(OUT_L, exist_ok=True)
os.makedirs(OUT_T, exist_ok=True)

# Instagram chrome trim (fractions).
# Carousel arrows sit ~8% in from the left/right edges, so photos get a wide side trim.
# Branded graphics keep a narrow trim so their own logos/labels survive.
TRIM      = dict(l=0.085, r=0.085, t=0.020, b=0.050)
TRIM_SOFT = dict(l=0.030, r=0.030, t=0.018, b=0.040)
SOFT = {20, 21, 47, 50, 60, 61}

def dominant(im):
    small = im.convert('RGB').resize((48,48))
    px = list(small.getdata())
    # average in a perceptually-ok way, then push toward warm mid
    r = sum(p[0] for p in px)//len(px)
    g = sum(p[1] for p in px)//len(px)
    b = sum(p[2] for p in px)//len(px)
    h,l,s = colorsys.rgb_to_hls(r/255,g/255,b/255)
    l = min(0.42, max(0.10, l*0.55))   # darken so it reads as a placeholder on dark ground
    s = min(0.55, s)
    r2,g2,b2 = colorsys.hls_to_rgb(h,l,s)
    return '#%02x%02x%02x' % (int(r2*255), int(g2*255), int(b2*255))

manifest = []
for i, p in enumerate(SRC):
    im = Image.open(p).convert('RGB')
    W,H = im.size
    T = TRIM_SOFT if i in SOFT else TRIM
    box = (int(W*T['l']), int(H*T['t']), int(W*(1-T['r'])), int(H*(1-T['b'])))
    im = im.crop(box)
    W,H = im.size
    key = 'p%02d' % i

    big = im.copy()
    if W > 1280:
        big = big.resize((1280, round(H*1280/W)), Image.LANCZOS)
    big.save(f'{OUT_L}/{key}.webp', 'WEBP', quality=80, method=5)

    th = im.copy()
    if W > 620:
        th = th.resize((620, round(H*620/W)), Image.LANCZOS)
    th.save(f'{OUT_T}/{key}.webp', 'WEBP', quality=70, method=5)

    manifest.append(dict(
        key=key, src=os.path.basename(p),
        w=big.size[0], h=big.size[1],
        tw=th.size[0], th=th.size[1],
        bg=dominant(im),
        kb_large=os.path.getsize(f'{OUT_L}/{key}.webp')//1024,
        kb_thumb=os.path.getsize(f'{OUT_T}/{key}.webp')//1024,
    ))
    print(key, manifest[-1]['w'], 'x', manifest[-1]['h'], manifest[-1]['kb_large'], 'KB', manifest[-1]['bg'])

json.dump(manifest, io.open('_work/img_manifest.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
tot = sum(m['kb_large']+m['kb_thumb'] for m in manifest)
print('TOTAL IMG', tot//1024, 'MB for', len(manifest), 'photos')
