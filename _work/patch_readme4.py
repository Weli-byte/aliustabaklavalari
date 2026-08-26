# -*- coding: utf-8 -*-
"""README — Arapça kaldırıldı, alerjen filtresi kaldırıldı, yorum bölümü değişti."""
import io, re

P = 'README.md'
s = io.open(P, encoding='utf-8').read()
orj = s


def degis(a, y, zorunlu=True):
    global s
    if a not in s:
        if zorunlu:
            raise AssertionError('BULUNAMADI:\n' + a[:130])
        return
    s = s.replace(a, y, 1)


# ---------------------------------------------------------------- dosya ağacı
degis("""index.html              ← Türkçe (ana sayfa)
en/index.html           ← İngilizce
ar/index.html           ← Arapça (sağdan sola)""",
"""index.html              ← Türkçe (ana sayfa)
en/index.html           ← İngilizce""")

degis("""  js/i18n.js            ← EN/AR çeviri sözlüğü""",
"""  js/i18n.js            ← İngilizce çeviri sözlüğü""")

# ---------------------------------------------------------------- bölüm tablosu
degis("""| **Ürünler** (devam) | Ayrıca "Sepete ekle", "Karşılaştır" ve alerjen filtresi |""",
"""| **Ürünler** (devam) | Ayrıca "Sepete ekle" ve "Karşılaştır"; alerjen bilgisi "Detay" panelinde |""")

degis("""| **Yorumlar** | Google 4,5 / 117 rozeti + site içi yorum paneli ve yorum yazma formu |""",
"""| **Yorumlar** | Google 4,5 / 117 + Restaurant Guru 4,4 / 116 kaynak kartları, site içi yorum paneli ve yorum yazma formu |""")

# ---------------------------------------------------------------- modül tablosu
degis("""| 7 | **Alerjen filtresi** | Ürün rayının başlığında çipler | `urunDetay[*].alerjen` |
""", "")

degis("""| 14 | **Açık / koyu tema** | Üst menü ay–güneş düğmesi | `tema` |""",
"""| 14 | **Açık / koyu tema** | Üst menü ay–güneş düğmesi | `tema` |
| — | **Alerjen bilgisi** | Ürün kartı → "Detay" paneli | `urunDetay[*].alerjen` |""")

# ---------------------------------------------------------------- çoklu dil bölümü
i = s.index('## 8. Çoklu dil')
j = s.index('## 9. PWA ve çevrimdışı')
s = s[:i] + """## 8. Çoklu dil

**Türkçe (ana) + İngilizce.** Arapça sürüm kaldırıldı; sözlüğü, sağdan sola CSS
bloğu ve Noto Kufi Arabic yazı tipi de projeden çıkarıldı (CSS ~6 KB, i18n
sözlüğü yarı yarıya küçüldü).

`en/index.html` ayrı bir kopya değil: `index.html`'den `_work/build_langs.py`
ile üretilir, aynı `assets/` klasörünü kullanır (`../assets/...`). Sayfa
metinleri çalışma anında `assets/js/i18n.js` sözlüğünden çevrilir.

- Sözlük anahtarı **sitedeki Türkçe metnin birebir kendisi**dir.
- Karşılığı olmayan metin Türkçe kalır; sayfa bozulmaz.
- Çeviri yalnızca DOM metin düğümlerini değil `alt`, `title`, `placeholder`
  ve `aria-label` özniteliklerini de kapsar; `config.js` ve `media.js`
  içindeki veriler de derin olarak çevrilir.

Yeni bir Türkçe metin eklerseniz karşılığını `i18n.js` içindeki `en` bloğuna
yazın, sonra:

```bash
python _work/build_langs.py https://alanadiniz.com
```

---

""" + s[j:]

# ---------------------------------------------------------------- sınırlar
degis("""3. **Yorumlar yer tutucu** — üç kart açıkça "YER TUTUCU" etiketli. Sadece
   4,5 puan ve 117 sayısı gerçek. Yayına almadan önce değiştirin.
   **117 yorumun metnini hiçbir servis dışarıya toplu vermez** ve uydurulmadı;
   siteye taşımanın üç yolu için "12. Google yorumlarını siteye taşıma"ya bakın.""",
"""3. **Yorum metinleri yok, ama uydurma da yok** — bölümde artık sahte alıntı
   kartı yerine **doğrulanabilir değerlendirme verisi** duruyor: Google 4,5 / 117
   ve Restaurant Guru 4,4 / 116 (Nizip'te tatlı kategorisinde 8./46), her biri
   kaynak bağlantısıyla. **117 yorumun metnini hiçbir servis dışarıya toplu
   vermez**; siteye taşımanın üç yolu için "12. Google yorumlarını siteye
   taşıma"ya bakın. Metinler eklendiği an kaynak kartları yerini gerçek
   yorumlara bırakır.""")

degis("""4. **Instagram bağlı, Facebook yok**""",
"""4. **Instagram bağlı, Facebook yok**""")

# ---------------------------------------------------------------- performans notu
degis("""**Toplam: 0,0155 → 0,0006** (yerel ölçüm), Lighthouse mobilde **0,00**.""",
"""**Toplam: 0,0155 → 0,0006** (yerel ölçüm), Lighthouse mobilde **0,00**.

> Yan not: `<picture>` etiketine `display:contents` verilince `<source>` de
> ızgara/esnek kutuda bir öğe sayılıyor ve düzeni kaydırıyordu. Sıfırlamaya
> `source{ display:none }` eklendi.""")

# ---------------------------------------------------------------- betikler
degis("""Sıra önemli: `build_img` → `build_avif` → `gen_media` → `build_langs`.""",
"""Sıra önemli: `build_img` → `build_avif` → `gen_media` → `build_langs`.

`build_langs.py` yalnızca `en/` üretir; Arapça çıkarıldı.""")

if s == orj:
    raise SystemExit('DEGISIKLIK YOK')
io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
print('README guncellendi:', len(orj), '->', len(s))
