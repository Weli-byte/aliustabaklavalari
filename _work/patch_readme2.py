# -*- coding: utf-8 -*-
"""README — medya, performans, sınırlar ve bakım bölümlerini güncelle."""
import io

P = 'README.md'
s = io.open(P, encoding='utf-8').read()
orj = s


def degis(a, y):
    global s
    assert a in s, 'BULUNAMADI:\n' + a[:130]
    s = s.replace(a, y, 1)


# ---------------------------------------------------------------- medya: AVIF
degis("""| | Ham | Web |
|---|---|---|
| Fotoğraf (65) | ~64 MB PNG | **~7 MB** WebP |
| Kısa video (17) | ~117 MB | **~26 MB** MP4 |
| Tanıtım filmi | 2,4 MB | **2,9 MB** (iki boy) |
| **Toplam** | **~183 MB** | **~36 MB** |

Açılışta bunun çok küçük bir kısmı iniyor; gerisi `IntersectionObserver` ile.""",
"""| | Ham | Web (WebP) | Web (AVIF) |
|---|---|---|---|
| Fotoğraf (65) | ~64 MB PNG | ~7 MB | **~3 MB** |
| Video posterleri (18) | — | 0,5 MB | **0,25 MB** |
| Kısa video (17) | ~117 MB | **~26 MB** MP4 | — |
| Tanıtım filmi | 2,4 MB | **2,9 MB** (iki boy) | — |
| **Toplam** | **~183 MB** | **~36 MB** | **~32 MB** |

Açılışta bunun çok küçük bir kısmı iniyor; gerisi `IntersectionObserver` ile.

### AVIF

Her `.webp` görselin yanında aynı adla bir `.avif` durur — ortalama **%57 daha
küçük**. Site `<picture>` kullanır:

```html
<picture>
  <source type="image/avif" srcset="…/p22.avif">
  <img src="…/p22.webp" width="…" height="…" alt="…">
</picture>
```

AVIF destekleyen tarayıcı AVIF'i, desteklemeyen WebP'yi indirir — **ikisini
birden değil**. `.avif` dosyası eksik ya da bozuksa `site.js` içindeki hata
yakalayıcı `<source>` etiketini atıp WebP'ye döner; görsel kaybolmaz.
Lightbox ve ürün detayı tek `<img>` kullandığı için orada 1×1'lik gömülü bir
AVIF ile bir kereye mahsus destek yoklaması yapılır.

> **Yeni fotoğraf eklerseniz** `python _work/build_avif.py` çalıştırmayı unutmayın —
> yalnızca eksikleri üretir, mevcutlara dokunmaz.""")

# ---------------------------------------------------------------- performans
degis("""### Core Web Vitals — mobil (390×844), Slow 4G + 4× CPU yavaşlatma
| Metrik | Ölçüm | Eşik | Durum |
|---|---|---|---|
| **LCP** | **734 ms** | < 2.500 ms | ✅ |
| **CLS** | **0,00** | < 0,1 | ✅ |
| **INP** | **88 ms** | < 200 ms | ✅ |""",
"""### Core Web Vitals — mobil (390×844), Slow 4G + 4× CPU yavaşlatma
| Metrik | Ölçüm | Eşik | Durum |
|---|---|---|---|
| **LCP** | **563 ms** | < 2.500 ms | ✅ |
| **CLS** | **0,00** | < 0,1 | ✅ |
| **INP** | **64 ms** | < 200 ms | ✅ |""")

degis("""**INP iyileştirmesi:** kategori değiştirme ilk sürümde 232 ms sürüyordu.
36 karonun görünürlük değişimi, metin yazımı ve animasyon
`requestAnimationFrame + setTimeout(0)` kalıbıyla ilk boyamadan sonraya alındı:
**232 ms → 88 ms**.""",
"""**INP iyileştirmeleri — ölçülen üç tur:**

| Ne | Önce | Sonra | Nasıl |
|---|---|---|---|
| Kategori değiştirme | 296 ms | 56 ms | ağır iş ilk boyamadan sonraya |
| Kategori değiştirme (2. tur) | 232 ms | 88 ms | `requestAnimationFrame` tek başına yetmedi, `+ setTimeout(0)` eklendi |
| Sihirbaz / alerjen filtresi | 848 ms | **64 ms** | `ScrollTrigger.refresh()` etkileşim karesinden çıkarıldı, 260 ms'lik tek çağrıda birleştirildi |

Son değer bütün yeni modüller (sepet, filtre, sihirbaz, hesaplayıcı) sırayla
tetiklenerek ölçüldü.

**CLS:** tema ve ses düğmeleri ilk sürümde JavaScript ile üst menüye ekleniyordu;
menü kayıyor ve CLS 0,02'ye çıkıyordu. Düğmeler `index.html` içine sabitlendi,
JavaScript yalnızca `hidden` özniteliğini kaldırıyor: **0,02 → 0,00**.""")

# ---------------------------------------------------------------- bilinen sınırlar
degis("""## 11. Bilinen sınırlar""", """## 11. Bilinen sınırlar""")

io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
print('README guncellendi:', len(orj), '->', len(s))
