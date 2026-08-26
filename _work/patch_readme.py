# -*- coding: utf-8 -*-
"""README'yi yeni bölümler, betikler ve ölçümlerle günceller."""
import io, re, sys

P = 'README.md'
s = io.open(P, encoding='utf-8').read()
orj = s


def degis(a, y, zorunlu=True):
    global s
    if a not in s:
        if zorunlu:
            raise AssertionError('BULUNAMADI:\n' + a[:120])
        return
    s = s.replace(a, y, 1)


# ---------------------------------------------------------------- dosya ağacı
degis("""  js/media.js           ← medya haritası (otomatik üretilir)
  js/site.js            ← etkileşim ve scroll koreografisi
  img/ · img/thumb/     ← 65 fotoğraf, iki boy (WebP)
  video/ · video/poster/← 17 kısa video + tanıtım filmi + 18 poster""",
"""  js/media.js           ← medya haritası (otomatik üretilir)
  js/site.js            ← etkileşim ve scroll koreografisi
  js/shop.js            ← sepet, hesaplayıcılar, filtre, karşılaştırma, sihirbaz, takip
  js/extras.js          ← tema, ses, vitrin, story, yazılar, bülten, uzak yorumlar
  img/ · img/thumb/     ← 65 fotoğraf, iki boy (WebP + AVIF)
  video/ · video/poster/← 17 kısa video + tanıtım filmi + 18 poster (WebP + AVIF)""")

# ---------------------------------------------------------------- yeni bölüm
YENI = """
---

## 2b. Satış ve deneyim modülleri

Hepsi `assets/js/config.js` üzerinden beslenir. Bir alan boş bırakılırsa ilgili
bölüm siteye **hiç çıkmaz** — yer tutucuyla dolmaz.

| # | Özellik | Nerede görünür | Hangi ayar |
|---|---|---|---|
| 1 | **Sepetli sipariş** | Sağ altta yüzen sepet düğmesi + panel | `sepet.acik` |
| 2 | **Canlı fiyat hesaplayıcı** | Sepet panelinde ürün+ölçü seçilince | `fiyatlar`, `sepet.olculer` |
| 3 | **Kargo ücreti hesaplayıcı** | Kargo bölümü, il + kg | `kargoTarife` |
| 4 | **Bugün vitrinde** | Ürünlerden sonra ayrı bölüm | `vitrin.cesitler` |
| 5 | **Hediye paketi** | Sepet panelinde onay kutuları | `hediye.secenekler` |
| 6 | **Story arşivi** | Tatlı Dünyası'ndan sonra | `storyArsivi` |
| 7 | **Alerjen filtresi** | Ürün rayının başlığında çipler | `urunDetay[*].alerjen` |
| 8 | **Sipariş takibi** | Kargo bölümü + `?siparis=KOD` | `takip.siparisler` |
| 9 | **"Neden bizden" tablosu** | Neden Ali Usta'dan sonra | `karsilastirma` |
| 10 | **Ürün karşılaştırma** | Kartlardaki "Karşılaştır" (en fazla 3) | `urunDetay` |
| 11 | **"Bana bir tatlı seç"** | Ürünlerden sonra, 3 soruluk sihirbaz | kod içi kılavuz |
| 12 | **Yazılar (blog)** | SSS'den sonra; `?yazi=slug` ile doğrudan | `yazilar` |
| 13 | **Ses tasarımı** | Üst menü hoparlör düğmesi | `sesTasarimi` |
| 14 | **Açık / koyu tema** | Üst menü ay–güneş düğmesi | `tema` |
| 16 | **AVIF** | Bütün görseller `<picture>` ile | `_work/build_avif.py` |
| 17 | **Supabase** | Yorumlar anında yayınlanır | `supabase` |
| 18 | **E-posta bülteni** | Alt bilgi (footer) | `bulten` |

### Sepet nasıl çalışıyor

Sunucu yok. Sepet tarayıcının `localStorage`'ında durur (`aliusta.sepet.v2`),
sekme kapansa da kalır. "WhatsApp'tan sipariş ver" düğmesi bütün satırları,
hediye paketini, kargo tutarını ve yaklaşık ağırlığı **tek mesaja** yazıp
işletmenin hattında açar. Müşteri gönder'e basar.

Satırlar ürün *adıyla* değil, `config.js → fiyatlar` dizisindeki **sırasıyla**
saklanır. Böylece müşteri sepeti Türkçe doldurup İngilizce sayfaya geçse bile
fiyatlar ve ürün adları doğru kalır.

### Kargo tarifesi

`kargoTarife` üç bölge (81 il) ve beş desi kademesi içerir; son kademenin
üstünde kilo başına ek ücret uygulanır. `ucretsizUstu` tutarını geçen
siparişlerde kargo ücretsiz gösterilir.

> ⚠️ Tarife **piyasa ortalamasına göre tahminidir.** Anlaşmalı kargo
> fiyatlarınızı `kademeler` içine yazıp `onayli: true` yapın.

### Sipariş takibi

Müşteriye WhatsApp'ta bir kod verirsiniz (örn. `AU-2601`), sonra
`config.js → takip.siparisler` listesine bir satır eklersiniz:

```js
{ kod: 'AU-2601', ad: 'Mehmet K.', durum: 'kargoda',
  urun: '2 kg midye baklava', tarih: '2026-08-24',
  kargoFirma: 'Aras Kargo', takipNo: '1234567890' }
```

`durum` şunlardan biri: `alindi` · `hazirlaniyor` · `kargoda` · `teslim`.
Müşteri `siteniz.com/?siparis=AU-2601` adresine girerse durum kendiliğinden açılır.

### Bugün vitrinde

Sabah bir fotoğraf çekip `assets/img/vitrin/` klasörüne koyun, sonra:

```js
vitrin: {
  tarih: '2026-08-26',
  gorsel: 'assets/img/vitrin/2026-08-26.webp',
  not: 'Bugün fıstık ezmesi ve şöbiyet bol.',
  cesitler: ['Midye baklava', 'Şöbiyet', { ad: 'Künefe', durum: 'tükendi' }]
}
```

`cesitler` boş kalırsa bölüm görünmez. `durum` alanında "tükendi" geçen çeşitler
üstü çizili gösterilir.

### Tema ve ses

Tema seçimi `localStorage`'da kalır (`aliusta.tema`). Açık temada okuma
bölümleri günışığına döner; hero, "Neden Ali Usta", tezgâh, lightbox ve alt bilgi
**bilerek koyu kalır** — arkalarında video var, metin kontrastı böyle korunuyor.

Ses tasarımı **varsayılan olarak kapalıdır** ve ses dosyası indirmez: kısa tıklar
WebAudio ile üretilir. `prefers-reduced-motion` açıksa hiç çalmaz.

---
"""

anchor = '## 3. WhatsApp akışları'
assert anchor in s
s = s.replace('\n---\n\n' + anchor, YENI + '\n' + anchor, 1) if ('\n---\n\n' + anchor) in s \
    else s.replace(anchor, YENI.lstrip('\n') + anchor, 1)

# ---------------------------------------------------------------- yorumlar
degis("""## 3. WhatsApp akışları""", """## 3. WhatsApp akışları""")

io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
print('README bolum eklendi:', len(orj), '->', len(s))
