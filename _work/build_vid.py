# -*- coding: utf-8 -*-
import os, io, glob, json, subprocess, re, sys
import imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
SRC = sorted(glob.glob('DATA/*.mp4'))
OUT='assets/video'; POS='assets/video/poster'
os.makedirs(OUT,exist_ok=True); os.makedirs(POS,exist_ok=True)

# videos that get a higher bitrate / wider render (hero + feature use)
FEATURE = {5, 13, 0, 4}
EXTRA_TOP = {13: 0.15}   # yanmis filigrani kesmek icin

def probe(p):
    o = subprocess.run([FF,'-hide_banner','-i',p], capture_output=True, text=True, errors='ignore').stderr
    d = re.search(r'Duration: (\d+):(\d+):([\d.]+)', o)
    dur = int(d.group(1))*3600+int(d.group(2))*60+float(d.group(3))
    s = re.search(r'Video: .*?, (\d+)x(\d+)', o)
    return dur, int(s.group(1)), int(s.group(2))

def detect_crop(p, dur, W, H):
    """Find black bars only; reject implausible crops."""
    o = subprocess.run([FF,'-hide_banner','-ss',str(round(dur*0.4,2)),'-i',p,'-t','4',
                        '-vf','cropdetect=16:2:0','-f','null','-'],
                       capture_output=True, text=True, errors='ignore').stderr
    m = re.findall(r'crop=(\d+):(\d+):(\d+):(\d+)', o)
    if not m: return None
    from collections import Counter
    cw,ch,cx,cy = map(int, Counter(m).most_common(1)[0][0])
    if cw < W*0.6 or ch < H*0.6: return None
    if cw >= W and ch >= H: return None
    return cw,ch,cx,cy

manifest=[]
for i,p in enumerate(SRC):
    key='v%02d'%i
    dur,W,H = probe(p)
    filters=[]
    c = detect_crop(p,dur,W,H)
    if c:
        cw,ch,cx,cy = c
        filters.append(f'crop={cw}:{ch}:{cx}:{cy}')
        W,H = cw,ch
    # Instagram arayuz kirpmasi: yan oklar ve alt kosedeki ses ikonu icin asimetrik inset.
    # v13 ustte yanmis "Ali Usta" filigrani tasidigi icin fazladan tepe kirpmasi alir.
    L, R, T, B = 0.04, 0.04, 0.03, 0.06
    T += EXTRA_TOP.get(i, 0.0)
    x0 = (int(W*L)//2)*2
    y0 = (int(H*T)//2)*2
    nw = W - x0 - int(W*R); nh = H - y0 - int(H*B)
    nw -= nw % 2; nh -= nh % 2
    filters.append(f'crop={nw}:{nh}:{x0}:{y0}')

    target = 960 if i in FEATURE else 620
    if nw > target:
        filters.append(f'scale={target}:-2:flags=lanczos')
    crf = '28' if i in FEATURE else '31'
    vf = ','.join(filters)

    out=f'{OUT}/{key}.mp4'
    subprocess.run([FF,'-hide_banner','-loglevel','error','-y','-i',p,
        '-vf',vf,'-an','-c:v','libx264','-profile:v','main','-pix_fmt','yuv420p',
        '-crf',crf,'-preset','slow','-g','60','-movflags','+faststart', out], check=True)

    ps=f'{POS}/{key}.webp'
    subprocess.run([FF,'-hide_banner','-loglevel','error','-y','-ss',str(round(dur*0.25,2)),
        '-i',p,'-frames:v','1','-vf',vf,'-quality','76', ps], check=True)

    from PIL import Image
    pw,ph = Image.open(ps).size
    manifest.append(dict(key=key, src=os.path.basename(p), dur=round(dur,1),
        w=pw, h=ph, kb=os.path.getsize(out)//1024, poster_kb=os.path.getsize(ps)//1024))
    print(key, f'{pw}x{ph}', manifest[-1]['kb'],'KB', flush=True)

json.dump(manifest, io.open('_work/vid_manifest.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
print('TOTAL VID', sum(m['kb'] for m in manifest)//1024,'MB')
