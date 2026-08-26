# -*- coding: utf-8 -*-
"""README — medya kalite iyileştirmesi uygulandı."""
import io

P = 'README.md'
s = io.open(P, encoding='utf-8').read()
orj = s


def degis(a, y):
    global s
    assert a in s, 'BULUNAMADI:\n' + a[:140]
    s = s.replace(a, y, 1)


degis("""### Medyaya yapılan işlem
Ham dosyalar Instagram ekran kaydı/görüntüsü olduğu için arayüz kalıntısı taşıyordu.
Yapılan tek müdahale **kırpma, yeniden boyutlandırma ve sıkıştırma**:""",
"""### Medyaya yapılan işlem
Ham dosyalar Instagram ekran kaydı/görüntüsü olduğu için arayüz kalıntısı taşıyordu.
Yapılan müdahale **kırpma, sıkıştırma hasarının temizlenmesi ve yeniden
boyutlandırma**. İçerik değiştirilmedi, rötuşlanmadı, üretilmedi:""")

degis("""- **Videolar:** siyah bant tespiti + yanlardan %4, üstten %3, alttan %6 kırpma
  → H.264, sessiz, `+faststart`.""",
"""- **Videolar:** siyah bant tespiti + yanlardan %4, üstten %3, alttan %6 kırpma
  → H.264, `+faststart`.""")

# yeni bölüm
YENI = """
### Kalite iyileştirmesi (Ağustos 2026)

Kaynaklar Instagram ekran görüntüsü/kaydı olduğu için sıkıştırma hasarı
taşıyordu: düz alanlarda "yağlı boya" lekeleri, fıstık tanelerinin birbirine
karışması, kenarların erimesi. Ayrıca dosyalar ekranda gösterildikleri
boyuttan küçüktü; tarayıcı onları büyütüyor ve bulanıklaştırıyordu.

**Uygulanan zincir — ayrıntı UYDURULMAZ, yalnızca hasar giderilir:**

| | Filtre zinciri |
|---|---|
| Fotoğraf | `nlmeans=s=1.4:p=5:r=11` → `unsharp=5:5:1.0` → `scale 2× lanczos` → `unsharp=3:3:0.5` |
| Video | `hqdn3d=3:2:6:4` → `nlmeans=s=1.5:p=3:r=7` → `unsharp=5:5:0.8` → `scale lanczos` |
| Hero filmi | `hqdn3d=2:1:4:3` → `unsharp=5:5:0.5` — profesyonel çekim, büyütme yok |

**Çıktı ölçüleri**

| | Önce | Sonra |
|---|---|---|
| Fotoğraf (büyük) | ~560 px, 4,9 MB toplam | **~1.130 px**, 11,2 MB toplam |
| Fotoğraf (küçük) | ~560 px, 3,6 MB toplam | **~650 px**, 5,6 MB toplam |
| Video | 434–780 px, 28,7 MB | **820–980 px**, ~55 MB |

**Yapılmayanlar:** yapay zekâ ile piksel üretilmedi (Topaz / Real-ESRGAN gibi
büyütücüler kullanılmadı — olmayan ayrıntıyı uydururlar). Renk, kontrast,
doygunluk değiştirilmedi. Kadraj, sıra ve dosya adları aynı kaldı.

**Sınır:** bu zincir sıkıştırma hasarını siler, olmayan ayrıntıyı geri
getiremez. Gerçek 4K için işletmenin telefonundaki orijinal dosyalar ya da
yeni çekim gerekir.

**Yeniden üretmek için:**

```bash
python _work/kalite_uygula.py yedek     # mevcut medyayı _yedek_medya/ içine kopyalar
python _work/kalite_uygula.py foto      # 65 fotoğraf
python _work/kalite_uygula.py video     # 17 video + posterler
python _work/kalite_uygula.py hero      # tanıtım filmi
python _work/build_avif.py --hepsi      # AVIF sürümleri
python _work/gen_media.py               # medya haritası
python _work/build_langs.py             # en/ sayfası
```

Geri dönmek için `_yedek_medya/assets/` içeriğini `assets/` üzerine kopyalayın.
"""

anchor = "\nİçerik değiştirilmedi, rötuşlanmadı, üretilmedi. Stok görsel yok.\n"
assert anchor in s
s = s.replace(anchor, "\nStok görsel yok, AI görsel yok.\n" + YENI, 1)

io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
print('README guncellendi:', len(orj), '->', len(s))
