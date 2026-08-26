# -*- coding: utf-8 -*-
"""README — sınırlar, Google yorumları ve bakım bölümü."""
import io

P = 'README.md'
s = io.open(P, encoding='utf-8').read()
orj = s


def degis(a, y):
    global s
    assert a in s, 'BULUNAMADI:\n' + a[:130]
    s = s.replace(a, y, 1)


# ---------------------------------------------------------------- 11. sınırlar
degis("""3. **Yorumlar yer tutucu** — üç kart açıkça "YER TUTUCU" etiketli. Sadece
   4,5 puan ve 117 sayısı gerçek. Yayına almadan önce değiştirin.""",
"""3. **Yorumlar yer tutucu** — üç kart açıkça "YER TUTUCU" etiketli. Sadece
   4,5 puan ve 117 sayısı gerçek. Yayına almadan önce değiştirin.
   **117 yorumun metnini hiçbir servis dışarıya toplu vermez** ve uydurulmadı;
   siteye taşımanın üç yolu için "14. Google yorumlarını siteye taşıma"ya bakın.""")

degis("""11. **Ürün fotoğrafları Instagram ekran görüntüsü** — 470–850 px. Yarım günlük
    bir ürün çekimi siteyi bir kademe yukarı taşır; şu anki kırpma/optimizasyon
    kaynak sınırının izin verdiği en iyisi.""",
"""11. **Ürün fotoğrafları Instagram ekran görüntüsü** — 470–850 px. Yarım günlük
    bir ürün çekimi siteyi bir kademe yukarı taşır; şu anki kırpma/optimizasyon
    kaynak sınırının izin verdiği en iyisi. **Bu madde yazılımla çözülemez** —
    fiziksel çekim gerekiyor. Sistem hazır: yeni fotoğrafları `DATA/` klasörüne
    koyup `build_img.py → gen_media.py → build_avif.py` çalıştırmak yeterli.
12. **Vitrin ve story arşivi boş** — `config.js` → `vitrin` ve `storyArsivi`
    doldurulana kadar o iki bölüm sitede görünmez. Uydurma içerik konmadı.
13. **Kargo tarifesi tahmini** — `kargoTarife.onayli: false`. Anlaşmalı kargo
    fiyatlarınızı yazıp `true` yapın.
14. **Supabase ve Google Places anahtarları boş** — girilene kadar yorumlar
    yalnızca `config.js` içindeki listeden okunur. İkisi de isteğe bağlı.""")

# ---------------------------------------------------------------- yeni bölüm 14
YENI = """
---

## 14. Google yorumlarını siteye taşıma

Google Haritalar'daki **117 yorumun metnini** hiçbir servis üçüncü taraflara
toplu olarak vermez. Google'ın kendi Places API'si bile **en fazla 5 yorum**
döndürür. Bu yüzden yorumlar uydurulmadı; siteye taşımanın üç yolu var.

### Yol 1 — Toplu kopyala-yapıştır (önerilen, 117 yorumun tamamı)

```bash
python _work/yorum_ekle.py
```

1. Betik ilk çalıştırmada `_work/yorumlar_ham.txt` dosyasını oluşturur.
2. Google Haritalar'da işletme sayfası → **Yorumlar** sekmesi. Sayfayı sonuna
   kadar kaydırın (yorumlar kaydırdıkça yüklenir), sonra hepsini seçip kopyalayın.
3. Kopyaladığınızı `_work/yorumlar_ham.txt` içine yapıştırın, kaydedin.
4. Betiği yeniden çalıştırın. Ad, yıldız, tarih ve metni ayıklar, size gösterir,
   onayınızla `config.js → yorumlar` listesine yazar.

Google Business Profile'dan CSV indirdiyseniz:

```bash
python _work/yorum_ekle.py --csv yorumlar.csv     # sütunlar: ad, puan, tarih, metin
```

Yorumlar `config.js`'e yazıldığı an: yorum bölümündeki "yer tutucu" uyarısı
kaybolur, "Tüm yorumları oku" paneli dolar ve `Review` yapısal verisi
(schema.org) sayfaya eklenir.

### Yol 2 — Google Places API (otomatik, ama en fazla 5 yorum)

```js
googlePlaces: { apiKey: 'AIza…', placeId: 'ChIJ…' }
```

Anahtar girilince site açılışta puanı, değerlendirme sayısını ve Google'ın verdiği
**5 yorumu** çeker; `config.js` içindekilerle birleştirir, tekrarları eler.
Ücretsiz kotayı aşarsanız Google ücret alır — bu yüzden varsayılan olarak boştur.

### Yol 3 — Supabase (site üzerinden gelen yorumlar anında yayında)

```js
supabase: { url: 'https://xxxx.supabase.co', anonKey: 'eyJ…', tablo: 'yorumlar' }
```

Tablo şeması:

| sütun | tip | not |
|---|---|---|
| `ad` | text | |
| `puan` | int2 | 1–5 |
| `metin` | text | |
| `tarih` | date | |
| `onayli` | bool | **varsayılan `false`** |

Ziyaretçi "Yorum yaz" formunu doldurduğunda kayıt `onayli: false` olarak tabloya
düşer **ve** aynı anda WhatsApp'ta açılır. Siz Supabase panelinden `onayli: true`
yaptığınızda yorum sitede görünür. RLS politikası: `anon` rolüne `insert` ve
`select … where onayli = true`.

Üçü aynı anda açık olabilir; site hepsini birleştirir ve tekrarları eler.

---
"""

anchor = '\n---\n\n## 12. Bakım'
assert anchor in s
s = s.replace(anchor, YENI + '\n## 12. Bakım', 1)

# ---------------------------------------------------------------- bakım adımları
degis("""### Medya değişecekse""",
"""### Yeni özellik verisi girecekseniz

| Ne | Nerede |
|---|---|
| Bugün vitrinde | `config.js` → `vitrin` |
| Story arşivi | `config.js` → `storyArsivi` (görseller `assets/img/story/`) |
| Sipariş takibi | `config.js` → `takip.siparisler` |
| Kargo tarifesi | `config.js` → `kargoTarife` |
| Hediye paketi | `config.js` → `hediye.secenekler` |
| Yeni blog yazısı | `config.js` → `yazilar` (`kapak` bir medya anahtarı, örn. `'p45'`) |
| Bülten adresi | `config.js` → `bulten.formUrl` |

### Medya değişecekse""")

io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
print('README guncellendi:', len(orj), '->', len(s))
