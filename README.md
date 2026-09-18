# Ali Usta Baklavaları — Nizip · Web Sitesi

Düz HTML/CSS/JS. **Build sistemi yok.** Klasörü olduğu gibi herhangi bir statik
hosting'e (Netlify sürükle-bırak, cPanel `public_html`, GitHub Pages, Vercel static)
yükleyin — çalışır.

```
index.html              ← Türkçe (ana sayfa)
en/index.html           ← İngilizce
manifest.webmanifest    ← telefona uygulama olarak eklenir
sw.js                   ← çevrimdışı önbellek
robots.txt · sitemap.xml
assets/
  css/site.css
  js/config.js          ← ★ İŞLETME BİLGİLERİ — SADECE BU DOSYAYI DÜZENLEYİN
  js/i18n.js            ← İngilizce çeviri sözlüğü
  js/media.js           ← medya haritası (otomatik üretilir)
  js/site.js            ← etkileşim ve scroll koreografisi
  js/shop.js            ← sepet, hesaplayıcılar, filtre, karşılaştırma, sihirbaz, takip
  js/extras.js          ← tema, ses, vitrin, story, yazılar, bülten, uzak yorumlar
  js/fistik.js          ← fıstık yağmuru (boş bölümlerde süzülen taneler)
  js/imlec.js           ← özel imleç (elmas + halka + kırıntı izi)
  img/ · img/thumb/     ← 65 fotoğraf, iki boy (WebP + AVIF)
  img/logo.webp         ← marka amblemi (şeffaf zemin, + logo-sm ve .avif)
  video/ · video/poster/← 17 kısa video + tanıtım filmi + 18 poster (WebP + AVIF)
  icons/                ← PWA ikonları
```

`DATA/` (ham dosyalar) ve `_work/` (üretim betikleri) **yüklenmez**, arşiv olarak durur.

---

## ⚡ Yayına almadan önce — 5 şey

| # | Ne | Nerede |
|---|---|---|
| 1 | **WhatsApp numarasını doğrulayın** | `assets/js/config.js` → `whatsapp` |
| 2 | **Fiyatları ustadan teyit edin** | `config.js` → `fiyatlar` + `fiyatDurum: 'onayli'` |
| 3 | **Google yorumlarını siteye taşıyın** | `python _work/yorum_ekle.py` — bkz. bölüm 12 |
| 4 | **Kargo tarifesini teyit edin** | `config.js` → `kargoTarife` + `onayli: true` |
| 5 | **Alan adını yazıp betikleri çalıştırın** | `python _work/build_static.py https://alanadi.com`<br>`python _work/build_langs.py https://alanadi.com` |

Bunlar yapılmadan site yine çalışır — ama fiyat, kargo ve yorum alanlarında
sitede görünen "tahmini / yer tutucu" uyarıları durur. Uyarılar bilinçli: sahte
bilgi gerçekmiş gibi sunulmasın diye.

> **WhatsApp numarası hakkında:** `config.js` içindeki `905324805924` numarası
> işletmenin kendi tanıtım videolarından alındı ("Siparişleriniz için
> 0532 480 59 24"). **Doğrulamadan yayına almayın.** Farklıysa tek satır
> değiştirmek yeterli — sitedeki bütün WhatsApp düğmeleri, sipariş formu,
> rezervasyon ve ürün "sor" bağlantıları otomatik ona bağlanır.

---

## 1. Sanat yönü

**Tez:** Baklava, ateşle şekerin buluştuğu bir zanaat. Site de öyle — karanlık bir
fırın içi, içinden altın sızıyor.

### Palet
| Token | Hex | Kullanım |
|---|---|---|
| `--ink` | `#120C06` | Ana zemin |
| `--ink-2` | `#1C1309` | İkincil bölüm zemini |
| `--ink-3` | `#271A0D` | Kart / medya yüzeyi |
| `--pitch` | `#0B0704` | Footer, preloader, lightbox |
| `--gold` | `#C9922E` | Ana altın — çizgiler, etiketler |
| `--gold-lit` | `#F0C463` | Vurgu, başlık aksanı, sayaçlar |
| `--copper` / `--copper-dp` | `#8C4A24` / `#5A2C13` | Bakır ara tonlar |
| `--pist` | `#7E9236` | Antep fıstığı yeşili (aksan) |
| `--cream` / `--cream-dim` / `--cream-mute` | `#F5E8CF` / `#C7B18B` / `#9C8969` | Metin kademeleri |
| WhatsApp | `#25D366` | Yalnızca WhatsApp öğeleri |

Mor–mavi gradyan, glassmorphism kart, düz `#fff` zemin yok.

### Tipografi
- **Fraunces** (variable, `WONK` açık) — başlıklar
- **Karla** — gövde ve arayüz
- Yasak listedeki hiçbir font kullanılmadı.

### Geometri
Marka geometrisi **baklava dilimi** — eşkenar dörtgen ve 60°'lik eğik kesim.
`--rhomb` clip-path'i madde imlerinde, favicon'da, PWA ikonunda ve preloader'da
tekrar ediyor. Kartlar köşesiz.

### Hareket
Lenis smooth scroll · baklava-eşkenar dörtgen çizen preloader · tam ekran hero
filminde `scale 1.14 → 1` açılış ve film greni · pinlenmiş yatay ürün rayı ·
kategori kartlarında açılan özet · Ken Burns · yön değiştiren marka şeridi ·
magnetic butonlar · 3D tilt · custom cursor · sayaçlar · yıldız dolma ·
scroll progress · nabız atan WhatsApp balonu.

### Spotlight — medya etkileşimi
Sitedeki **her** fotoğraf ve video aynı karo bileşenini (`.m-cell`) kullanır:

| Durum | Etki |
|---|---|
| Dokunulmamış | `brightness(.80)` — hafif sinematik karanlık |
| Aynı gruptan başka kare seçili | `brightness(.34)` — geri çekilir |
| Üstüne gelinen / dokunulan / odaklanan | `brightness(1.06)` + `scale(1.045)` + altın çerçeve + açıklama |

Fare: hover. Dokunmatik: ilk dokunuş öne çıkarır, ikinci dokunuş büyütür.
Klavye: `Tab` ile odaklanan kare de öne çıkar. Ölçek CSS değişkeniyle (`--sc`)
sürüldüğü için GSAP'ın paralaks/reveal transform'larıyla çakışmaz.

---

## 2. Bölümler

| Bölüm | İçerik |
|---|---|
| **Hero** | İşletmenin profesyonel tanıtım filmi, tam ekran, **sessiz** (ses düğmesi yok) |
| **Miras** | Usta hikâyesi + 5 fotoğraf, 1 video, paralaks |
| **Ürünler** | Pinlenmiş yatay ray, 12 çeşit. Her kartta "Bu ürünü sor" (WhatsApp) ve "Detay" |
| **Ürünler** (devam) | Ayrıca "Sepete ekle" ve "Karşılaştır"; alerjen bilgisi "Detay" panelinde |
| **Bugün vitrinde** | O günün çeşitleri — veri girilmezse görünmez |
| **Bana bir tatlı seç** | 3 soruluk sihirbaz, sonunda öneri + sepete ekle |
| **Fiyat & gramaj** | Kilo/tepsi fiyat tablosu, tepsi ölçüleri, kargo |
| **Tatlı Dünyası** | 6 tatlı türü — önce özet kartları, tıklayınca o türün ızgarası |
| **Story arşivi** | Instagram hikâyelerinden seçmeler — veri girilmezse görünmez |
| **Neden Ali Usta** | 4 değer, sertifika rozetleri, sayaçlar |
| **Neden bizden** | Ali Usta ↔ endüstriyel üretim karşılaştırma tablosu (8 ölçüt) |
| **Tezgâh** | 6 üretim videosu, **sesli** (her karoda hoparlör düğmesi) |
| **Özel gün siparişi** | Medya + teklif düğmesi |
| **Sipariş & Rezervasyon** | 3 sekmeli form — hepsi WhatsApp'a gider |
| **Yorumlar** | Google 4,5 / 117 + Restaurant Guru 4,4 / 116 kaynak kartları, site içi yorum paneli ve yorum yazma formu |
| **Kargo** | 4 adımlı süreç + kargo ücreti hesaplayıcı + sipariş takibi |
| **SSS** | 8 soru + `FAQPage` yapısal verisi |
| **Yazılar** | 5 uzun yazı, site içi okuma paneli (`?yazi=slug` ile doğrudan) |
| **İletişim** | Adres, telefon, WhatsApp, saatler, harita, sosyal medya |
| **Her ekranda** | Yeşil WhatsApp düğmesi (sağ alt) + sepet düğmesi (üstünde) |

### Yorumlar — nasıl çalışıyor
"Google'da tümünü oku" düğmesi kaldırıldı; ziyaretçi siteden çıkmıyor.

- **Tüm yorumları oku** → site içinde bir panel açılır: Google puanı özeti +
  `config.js` → `yorumlar` listesindeki bütün yorumlar (avatar, yıldız, tarih).
- **Yorum yaz** → aynı panelin ikinci sekmesi. Yıldızla puan verilir, ad ve
  yorum yazılır; mesaj işletmenin WhatsApp hattına düşer. Onaylandıktan sonra
  `config.js` listesine eklenip sitede yayınlanır.
- Liste boşken panel bunu açıkça söyler ve ziyaretçiyi ilk yorumu yazmaya davet eder.

> **Not:** Google'daki 117 yorumun metinleri elimizde yok — Google Places API'si
> anahtar ve ücret istiyor. Yorumları Google işletme sayfasından kopyalayıp
> `config.js` → `yorumlar` listesine yapıştırmanız yeterli; panel, kartlar ve
> `Review` yapısal verisi kendiliğinden dolar.

### Tatlı Dünyası — nasıl çalışıyor
"Tümü" görünümü kaldırıldı. Varsayılan olarak **6 kategori kartı** duruyor;
her kart kendi kapak görseli ve 2–4 cümlelik özet metniyle. Karta gelince
(ya da dokununca) özet açılıyor. Karta basınca o türün bütün fotoğraf ve
videoları uniform `4/5` ızgarada açılıyor; üstte "Bütün türler" dönüş düğmesi
ve diğer türlere geçiş çipleri var.

| Kategori | İçerik | Adet |
|---|---|---|
| Baklava | 8 foto + 4 video | 12 |
| Künefe | 3 foto + 4 video | 7 |
| Dondurma & Fıstık Ezmesi | 4 foto + 1 video | 5 |
| Antep Fıstığı | 3 foto | 3 |
| Özel Tatlılar | 5 foto | 5 |
| Dükkân & Vitrin | 4 foto | 4 |

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
| 8 | **Sipariş takibi** | Kargo bölümü + `?siparis=KOD` | `takip.siparisler` |
| 9 | **"Neden bizden" tablosu** | Neden Ali Usta'dan sonra | `karsilastirma` |
| 10 | **Ürün karşılaştırma** | Kartlardaki "Karşılaştır" (en fazla 3) | `urunDetay` |
| 11 | **"Bana bir tatlı seç"** | Ürünlerden sonra, 3 soruluk sihirbaz | kod içi kılavuz |
| 12 | **Yazılar (blog)** | SSS'den sonra; `?yazi=slug` ile doğrudan | `yazilar` |
| 13 | **Ses tasarımı** | Üst menü hoparlör düğmesi | `sesTasarimi` |
| 14 | **Açık / koyu tema** | Üst menü ay–güneş düğmesi | `tema` |
| — | **Alerjen bilgisi** | Ürün kartı → "Detay" paneli | `urunDetay[*].alerjen` |
| — | **Fıstık yağmuru** | Boş bölümlerin arkasında süzülen taneler | `fistikYagmuru` |
| 16 | **AVIF** | Bütün görseller `<picture>` ile | `_work/build_avif.py` |
| 17 | **Supabase** | Yorumlar anında yayınlanır | `supabase` |
| 18 | **E-posta bülteni** | Alt bilgi (footer) | `bulten` |
| 19 | **İşletme paneli** | Ali Usta / çalışanlar foto-video yayınlar | `panel.html` (bkz. bölüm 12) |

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


### Özel imleç

Sistem oku tamamen gizlenir, yerine üç parçalı bir imleç gelir:

| Parça | Davranış |
|---|---|
| **Elmas** | Dolu altın eşkenar dörtgen — markanın baklava geometrisi. Gecikmesiz. |
| **Halka** | İnce altın çember, ~320 ms yumuşak gecikmeyle takip eder (GSAP `quickTo`). |
| **İz** | Hızlı harekette (>260 px/sn) arkada kalan fıstık kırıntıları, ~0,5 sn'de söner. |

**Bağlama göre kelime.** Halka büyür ve içine ne yapılacağını yazar:

| Nerede | Kelime |
|---|---|
| Fotoğraf karosu | BÜYÜT |
| Video karosu | OYNAT |
| Düğme, çip, sekme | AÇ |
| WhatsApp bağlantıları | YAZ |
| `tel:` bağlantısı | ARA |
| Ürün "Detay" / "Sepete ekle" / "Karşılaştır" | DETAY / SEPETE / KARŞILAŞTIR |
| Sihirbaz seçeneği | SEÇ |
| Form gönder | GÖNDER |
| Kategori kartı | GÖR |
| Menü ve alt bilgi bağlantıları | GİT |

Kelimeler `i18n.js` üzerinden İngilizceye de çevriliyor (ENLARGE, PLAY, OPEN…).

**Sistem oku nerede geri gelir:**

- form alanlarında (`input`, `textarea`, `select`, `contenteditable`) — yazı imleci
- metin seçerken (`selectstart` → `pointerup` arası)
- video oynatıcı kontrolleri üzerinde
- dokunmatik cihazlarda (`pointer: coarse`) hiç kurulmaz
- `prefers-reduced-motion` açıkken ve hareket düğmesi kapalıyken

**Kaldırmak için:**

```js
// assets/js/config.js
imlec: { acik: false }       // sistemin standart oku kullanılır
imlec: { acik: true, iz: false }   // yalnızca kırıntı izi kapanır
```

### Marka amblemi

İşletmenin kendi logosu iki yerde duruyor:

| Yer | Boy | Dosya |
|---|---|---|
| Üst menü, en solda | 2,35 rem yükseklik | `logo-sm.webp` / `.avif` (160 px) |
| Alt bilgi, marka bloğunun başında | 9–12,5 rem genişlik | `logo.webp` / `.avif` (611 px) |

Kaynak logo koyu yeşil bir zemin üzerindeydi; site zaten koyu olduğu için o
zemin dikdörtgen bir kutu gibi görünüyordu. **Parlaklığa göre alfa maskesi**
uygulanıp zemin şeffaflaştırıldı — altın çerçeve ve fıstık öğeleri olduğu gibi
kaldı, renklere hiç dokunulmadı.

```bash
python _work/logo_hazirla.py "<kaynak-logo.png>"
```

Betik eşikleri (`ALT = 30`, `UST = 80`) yumuşak geçişli bir maske kurar,
içeriğe göre kırpar, iki boyda WebP + AVIF üretir.

Dar ekranda (< 600 px) üst menüde yalnızca amblem kalır, "Ali Usta" yazısı
görsel olarak gizlenir ama erişilebilir adda durur — yer kazanmak için.
Amblem geldiği için markanın yanındaki eski elmas işareti kaldırıldı.

### Fıstık yağmuru

Yazı, tablo ve form bölümlerinin arkasında dökülen Antep fıstığı: iri taneler (yeşil gövde, ucunda mor kabuk
zarı, ince çatlak ve ışık kenarı) ve ince fıstık tozu. Taneler düştükçe
bölümün altında **birikiyor**; kenarlarda yoğun, ortada seyrek kalıyor ki
metin nefes alsın.

**Görsel dosya yok:** her şey canvas'a sitenin kendi `--pist`, `--pist-lit`
renk ailesiyle çiziliyor, palet bozulmuyor.

İki katman kullanılıyor:

| Katman | İş |
|---|---|
| `.fistik-cv--yer` | Yerdeki birikinti. Bir kez çizilir, hiç silinmez. |
| `.fistik-cv--yagmur` | Düşen taneler. Yalnızca tanelerin küçük kutuları silinir. |

**Hangi bölümlerde var (11 bölüm):** Tatlı Seç · Fiyat & gramaj · Değerler ·
Neden bizden · Sipariş & Rezervasyon · Yorumlar · Kargo · SSS · Yazılar ·
İletişim · alt bilgi.

**Hangilerinde yok:** fotoğraf ve videoların taşıdığı bölümler — Hero, Miras,
Ürünler, Bugün vitrinde, Tatlı Dünyası, Story arşivi, Neden Ali Usta
(arka plan videosu), Tezgâh, Özel gün siparişi.

Zaten katman içeriğin *arkasında* olduğu için bir fotoğrafın üstüne hiçbir
zaman tane düşmez; medya bölümlerinde tamamen kapalı tutulmasının sebebi
kadrajların kalabalıklaşmaması.

Kendini frenleyen bir katman:

- yalnızca `.fistik-zone` sınıfı olan bölümlerde çalışır
- içerik her zaman üstte kalır (`canvas` z-index 0, `.shell` z-index 1)
- `pointer-events:none` ve `aria-hidden` — tıklamayı da ekran okuyucuyu da engellemez
- yalnızca ekrandaki bölümler çizilir; ekranda bölüm kalmayınca döngü kendini durdurur
- sekme arka plandayken durur
- `prefers-reduced-motion` veya üst menüdeki hareket düğmesi kapalıysa hiç çizmez
- tam canvas silmek yerine **kirli dikdörtgen** yöntemi: her karede yalnızca
  tanelerin bir önceki kareki küçük kutuları siliniyor
- dar ekranda piksel yoğunluğu 1×, tane sayısı daha az

**Kaldırmak için tek satır:**

```js
// assets/js/config.js
fistikYagmuru: { acik: false }
```

Dosyayı da silmek isterseniz: `assets/js/fistik.js`, `index.html` içindeki
`<script src="assets/js/fistik.js" defer>` satırı, `site.css` içindeki
"FISTIK YAĞMURU" bloğu ve beş bölümdeki `fistik-zone` sınıfı. Başka hiçbir
yere dokunmaz.

---

## 3. WhatsApp akışları

Sitedeki **her** WhatsApp bağlantısı `config.js`'teki tek numaradan üretilir.

| Yer | Ne gönderir |
|---|---|
| Yorum paneli → "Yorum yaz" | Puan, ad, telefon, yorum metni |
| Sağ alt sabit yeşil balon | Genel bilgi mesajı — hero'dan sonra her sayfada görünür |
| Ürün kartı → "Bu ürünü sor" | `Merhaba, *Midye Baklava* fiyatı nedir?` |
| Ürün detay paneli → "Bu ürünü sor" | Aynı, ürün adıyla |
| Sipariş formu | Ad, telefon, ürün, miktar, teslim şekli, tarih, adres, not |
| **Rezervasyon formu** | Ad, telefon, tarih, saat, kişi sayısı, bölüm, not |
| Toplu/kurumsal form | Firma, yetkili, telefon, tür, miktar, tarih, detay |
| Mevsimsel şerit | Dönemin ürünüyle ilgili mesaj |
| İletişim bölümü | Genel mesaj |

**Rezervasyonlar işletmenin WhatsApp hesabında görünür.** Sunucu, üyelik ve ücret
yok: form doldurulunca mesaj hazır hâlde WhatsApp'ta açılır, müşteri "gönder"e
basar, mesaj işletmeye düşer.

İsteğe bağlı e-posta kopyası: [web3forms.com](https://web3forms.com) üzerinden
ücretsiz anahtar alıp `config.js` → `web3formsKey` alanına yazın.

---

## 4. Medya — tam envanter

**66 fotoğraf + 25 kısa video + 1 tanıtım filmi = 92 dosyanın tamamı kullanılıyor.**
Eşleme `_work/gen_media.py` içinde; betik kullanılmayan dosya kalırsa `assert` ile durur.

| Bölüm | Fotoğraf | Video |
|---|---|---|
| Hero | — | 1 (tanıtım filmi, sessiz) |
| Miras | 5 | 1 |
| Ürünler rayı | 24 (12 çeşit × 2) | — |
| Tatlı Dünyası | 28 | 17 |
| Tezgâh | — | 6 |
| Özel Sipariş | 4 | 1 |
| Kargo | 2 | — |
| İletişim | 3 | — |
| **Toplam** | **66** | **26** |

Dosya bazında liste: **[`MEDYA-LISTESI.md`](MEDYA-LISTESI.md)**.
`v08` ayrıca "Neden Ali Usta" bölümünde %14 opaklıkta arka plan dokusu olarak
ikinci kez kullanılır.

### Medyaya yapılan işlem
Ham dosyalar Instagram ekran kaydı/görüntüsü olduğu için arayüz kalıntısı taşıyordu.
Yapılan müdahale **kırpma, sıkıştırma hasarının temizlenmesi ve yeniden
boyutlandırma**. İçerik değiştirilmedi, rötuşlanmadı, üretilmedi:

- **Fotoğraflar:** yanlardan %8,5, üstten %2, alttan %5 kırpma → WebP, iki boy.
  Markanın kendi grafiklerinde (`p20`, `p21`, `p47`, `p50`, `p60`, `p61`)
  logolar kesilmesin diye dar kırpma.
- **Videolar:** siyah bant tespiti + yanlardan %4, üstten %3, alttan %6 kırpma
  → H.264, `+faststart`.
- **Hero filmi:** iki boy (1280 px masaüstü / 854 px mobil), **sesi çıkarılmış**.
- **Tezgâh videoları:** 6 üretim kaydı **sesli** kodlandı; karodaki hoparlör düğmesiyle açılır.

Stok görsel yok, AI görsel yok.

### Ağustos 2026 — düzeltmeler ve yeni medya

**Yanlış tatlı adları düzeltildi.** Ürün rayındaki üç ad, atanan fotoğraflarla
uyuşmuyordu:

| Eski ad | Yeni ad | Neden |
|---|---|---|
| Havuç Dilimi | **Yuvarlak Tepsi Baklava** | Fotoğraflar yuvarlak tepside dilim kesim gösteriyordu, üçgen havuç dilimi değil |
| Kuşgözü | **Fıstık Ezmesi** | Fotoğraflar baskı fıstıkla kaplı düz tepsi gösteriyordu; fiyat tablosundaki mevcut Fıstık Ezmesi satırıyla birleşti |
| Kavrulmuş Fıstık | **Çiğ İç Fıstık** | Fotoğraflarda mor zarlı çiğ iç fıstık var, kavrulmuş değil |

Adlarla birlikte açıklamalar, `urunDetay` içerikleri, fiyat tablosu ve İngilizce
sözlük de güncellendi.

**Adres düzeltildi.** İşletmenin kendi ambalaj kâğıdı (29 Ağustos'ta gelen
fotoğrafta okunuyor) şunu yazıyor:

> Sultan Abdülhamid Mh. **Yavuz Sultan Selim Blv.** Özdemir Apt. Altı 25/A Nizip

Sitede "Kanuni Sultan Süleyman Bulvarı" yazıyordu. `config.js`, harita
bağlantısı ve `LocalBusiness` yapısal verisi ambalaja göre düzeltildi.

**Yeni medya eklendi.** İşletmeden 29 Ağustos'ta gelen dosyalar:

- **8 video** (v17–v24) — markalı kâğıt üzerinde tepsi sunumları, dükkânda
  çekilmiş. Tatlı Dünyası → Baklava kategorisine girdi.
- **1 fotoğraf** (p65) — yuvarlak tepside çiğ iç fıstık, **1200×1600**.
  Projedeki en yüksek çözünürlüklü fotoğraf; Antep Fıstığı kategorisinin
  kapağı oldu.

Bu dosyalar Instagram ekran kaydı değil, doğrudan WhatsApp'tan geldiği için
arayüz kırpması uygulanmadı — yalnızca hafif temizlik ve keskinleştirme
(`_work/yeni_medya.py`).

**Ayrıca düzeltilen bir hata:** `build_langs.py`, `srcset="assets/..."`
yollarını `../assets/` olarak yeniden yazmıyordu; İngilizce sayfada logonun
AVIF sürümü 404 veriyordu (WebP yedeğine düştüğü için görünürde sorun yoktu).

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
| Fotoğraf (büyük) | ~560 px, 4,9 MB toplam | **1.074–1.500 px**, 11.2 MB toplam |
| Fotoğraf (küçük) | ~560 px, 3,6 MB toplam | **~650 px**, 5.6 MB toplam |
| Video | 434–780 px, 28,7 MB | **820–980 px**, 56.7 MB |

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

| | Ham | Web (WebP) | Web (AVIF) |
|---|---|---|---|
| Fotoğraf (65 × 2 boy) | ~64 MB PNG | ~17 MB | **~8 MB** |
| Video posterleri (18) | — | ~1,2 MB | **~0,6 MB** |
| Kısa video (17) | ~117 MB | **57 MB** MP4 | — |
| Tanıtım filmi | 2,4 MB | **3,9 MB** (iki boy) | — |
| **Toplam** | **~183 MB** | **~85 MB** | — |

Kalite iyileştirmesinden önce toplam 45 MB idi; çözünürlük iki katına çıkınca
85 MB'a yükseldi. Açılışta bunun yalnızca birkaç yüz kilobaytı iniyor: görseller
`loading="lazy"`, videolar `preload="none"` ve `IntersectionObserver` ile
yalnızca ekrana geldiklerinde yükleniyor.

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
> yalnızca eksikleri üretir, mevcutlara dokunmaz.

---

## 5. Ölçülen performans

Chrome DevTools, yerel sunucu üzerinden.

### Core Web Vitals — mobil (390×844), Slow 4G + 4× CPU yavaşlatma
| Metrik | Ölçüm | Eşik | Durum |
|---|---|---|---|
| **LCP** | **827 ms** | < 2.500 ms | ✅ |
| **CLS** | **0,00** | < 0,1 | ✅ |
| **INP** | **32 ms** | < 200 ms | ✅ |

LCP öğesi hero filminin posteri (`hero.webp`, `fetchpriority="high"` ile preload).
Film `preload="metadata"` ile bekliyor, poster boyandıktan sonra oynamaya başlıyor.
Ölçüm sırasında service worker etkindi (tekrar ziyaret senaryosu); ilk ziyaret
ölçümü aynı koşullarda 1.655 ms idi — o da eşiğin altında.

**INP iyileştirmeleri — ölçülen üç tur:**

| Ne | Önce | Sonra | Nasıl |
|---|---|---|---|
| Kategori değiştirme | 296 ms | 56 ms | ağır iş ilk boyamadan sonraya |
| Kategori değiştirme (2. tur) | 232 ms | 88 ms | `requestAnimationFrame` tek başına yetmedi, `+ setTimeout(0)` eklendi |
| Sihirbaz / alerjen filtresi | 848 ms | 64 ms | `ScrollTrigger.refresh()` etkileşim karesinden çıkarıldı, 260 ms'lik tek çağrıda birleştirildi |
| Alerjen + sepet + karşılaştır (son ölçüm) | — | **32 ms** | düğmeler ilk çizimde geldiği için basışta düzen yeniden hesaplanmıyor |

Son değer bütün yeni modüller (sepet, filtre, sihirbaz, hesaplayıcı) sırayla
tetiklenerek ölçüldü.

### CLS — üç ayrı kaynak kapatıldı

| Kaynak | Katkı | Çözüm |
|---|---|---|
| Tema ve ses düğmelerinin JS ile menüye eklenmesi | 0,020 | Düğmeler `index.html`'e sabitlendi; JS yalnızca `hidden`'ı kaldırıyor |
| Fiyat, "Sepete ekle" ve alerjen çubuğunun sonradan eklenmesi | ~0,005 | Kart şablonuna ve HTML'e taşındı; `shop.js` yalnızca davranışı bağlıyor |
| Yazı tipi takası (Karla geç gelince satır sayısı değişiyordu) | 0,0155 | Ölçü uyumlu yedek yüzler: `@font-face … size-adjust` (Karla %104,8 · Fraunces %85,9) |

**Toplam: 0,0155 → 0,0006** (yerel ölçüm), Lighthouse mobilde **0,00**.

> Yan not: `<picture>` etiketine `display:contents` verilince `<source>` de
> ızgara/esnek kutuda bir öğe sayılıyor ve düzeni kaydırıyordu. Sıfırlamaya
> `source{ display:none }` eklendi.

### Lighthouse — masaüstü ve mobil, ikisi de
| Kategori | Puan |
|---|---|
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |
| Agentic Browsing | **100** |

---

## 6. Erişilebilirlik (WCAG 2.2 AA)

- **Kontrast:** `--cream`/`--ink` ≈ 15:1, `--gold`/`--ink` ≈ 7:1. Koyu bakır zeminde
  altın metin kullanılmadı.
- **Klavye:** her etkileşimli öğe sekmeyle gezilebilir. Lightbox ve ürün detay
  panelinde odak tuzağı, `Esc` ile kapanma, `←`/`→` ile gezinme, kapanışta odağın
  tetikleyen öğeye dönmesi.
- **Sekmeler:** `role="tablist"`, ok tuşları, `Home`/`End`, `aria-selected`.
- **Formlar:** her alanın etiketi var; hata mesajları alanın altında,
  `aria-invalid` ile işaretli, ilk hatalı alana odak veriliyor.
- **Video kontrolü (WCAG 2.2.2):** nav'daki global durdurma düğmesi + tezgâh
  videolarının tek tek oynat/duraklat ve ses düğmeleri. Hero filmi sessizdir.
- **`prefers-reduced-motion`:** preloader atlanıyor, Lenis kurulmuyor, custom
  cursor kaldırılıyor, GSAP sahneleri oluşturulmuyor, videolar otomatik oynamıyor,
  film greni ve nabız animasyonları kapanıyor. Sayfa tamamen statik ve okunur.
- **Alternatif metin:** her fotoğraf ve videoda içeriği anlatan `alt` / `aria-label`.
- **JS olmadan:** GSAP CDN'den gelmezse 3 saniyede preloader kaldırılıyor ve sayfa
  statik olarak okunur kalıyor.

---

## 7. SEO ve yapısal veri

- `Bakery` JSON-LD: ad, adres, telefon, `priceRange`, açık hava oturma,
  `acceptsReservations`, 14 ürünlük `OfferCatalog`,
  `aggregateRating` **4,5 / 5 — 117 değerlendirme** (gerçek Google verisi).
- `FAQPage` yapısal verisi — 8 soru, `config.js` → `sss` listesinden üretilir.
- `Review` yapısal verisi — **yalnızca gerçek yorumlar eklendiğinde** yazılır.
- `openingHoursSpecification`: her gün `opens: "10:00"`. **`closes` bilinçli boş** —
  kapanış saati teyit edilmemiş.
- `hreflang` (tr/en + `x-default`) — alan adı `build_langs.py`'ye verilince yazılır.
- `sitemap.xml` + `robots.txt` — `build_static.py` üretir.

---

## 8. Çoklu dil

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

## 9. PWA ve çevrimdışı

- `manifest.webmanifest` — telefona uygulama olarak eklenir, kısayolları var
  (Sipariş, Rezervasyon, Yol tarifi).
- `sw.js` — kabuk (HTML/CSS/JS/ikon/hero posteri) önbelleğe alınır; **videolar
  alınmaz**. HTML için önce ağ, varlıklar için önce önbellek.
- Sürüm yükseltmek için `sw.js` içindeki `SURUM` değerini artırın
  (`aliusta-v2` → `aliusta-v3`); eski önbellek otomatik silinir.

---

## 10. Analitik (isteğe bağlı)

Çerezsiz, KVKK dostu. `config.js` içine alan adınızı yazın:

```js
plausibleDomain: 'aliustabaklavalari.com',   // veya
umamiSrc: 'https://.../script.js', umamiId: '...'
```

Boş bırakılırsa hiçbir izleme kodu yüklenmez. Ölçülen olaylar: WhatsApp balonu,
telefon düğmesi, ürün sorma, ürün detayı, form gönderimleri.

---

## 11. Bilinen sınırlar

1. **WhatsApp numarası teyit edilmedi** — videolardan alındı, doğrulanmalı.
2. **Fiyatlar tahmini** — tablo piyasa ortalamasına göre dolduruldu (Ağustos 2026).
   Ustadan gerçek fiyatları alınca `config.js` → `fiyatlar` listesini güncelleyip
   `fiyatDurum: 'onayli'` yapın; üstteki tahmin uyarısı kaybolur.
3. **Yorum metinleri yok, ama uydurma da yok** — bölümde artık sahte alıntı
   kartı yerine **doğrulanabilir değerlendirme verisi** duruyor: Google 4,5 / 117
   ve Restaurant Guru 4,4 / 116 (Nizip'te tatlı kategorisinde 8./46), her biri
   kaynak bağlantısıyla. **117 yorumun metnini hiçbir servis dışarıya toplu
   vermez**; siteye taşımanın üç yolu için "12. Google yorumlarını siteye
   taşıma"ya bakın. Metinler eklendiği an kaynak kartları yerini gerçek
   yorumlara bırakır.
4. **Instagram bağlı, Facebook yok** — Instagram adresi `config.js` içinde tanımlı
   ve nav + footer'da görünüyor. Facebook hesabı olmadığı için boş bırakıldı;
   ileride açılırsa `config.js` → `facebook` alanına yazmak yeterli.
   `tiktok` ve `youtube` alanları da aynı şekilde çalışır.
5. **Sertifikalar gizli** — `config.js` → `belgeler` listesinde `dogrulandi: false`
   olan rozetler **sitede görünmez**. Belgeyi teyit edip `true` yapın; görselini
   `assets/img/belge/` klasörüne koyup `gorsel` alanına dosya adını yazın.
6. **Kapanış saati eksik** — metin ve JSON-LD teyit bekliyor.
7. **Alan adı yazılmadı** — `hreflang`, `sitemap.xml` ve `robots.txt` yer tutucu.
   "⚡ Yayına almadan önce" bölümündeki 4. maddeye bakın.
8. **Instagram beslemesi eklenmedi** — resmi API'si erişim tokenı ve düzenli
   yenileme gerektiriyor; statik hosting'de sunucu olmadan sürdürülebilir değil.
   Alternatif: hesap adresi verilince footer'a bağlantı, öne çıkan gönderiler elle.
9. **Usta röportaj videosu yok** — çekim gerekiyor. Geldiğinde Miras bölümüne
   `M.miras.video` yerine konur (tek satır).
10. **Kaynak çözünürlükleri ölçüldü — 4K mümkün değil** — `DATA/` içindeki
    65 fotoğrafın **tamamı 1080 px'in altında** (ortanca genişlik 680 px,
    en büyüğü 853×845). 17 kısa videonun tamamı **"Ekran Kaydı" dosyası**,
    470–850 px, 1,8–3,0 Mbit/s. Hero filmi 1280×720.
    Bunlar Instagram ekran görüntüsü/kaydı; yani zaten bir kez sıkıştırılmış
    kopyalar. **Gerçek 4K için tek yol işletmenin telefonundaki orijinal
    dosyalar ya da yeni çekim** — büyütme işlemi ayrıntı üretmez, uydurur.
11. **Ürün fotoğrafları Instagram ekran görüntüsü** — 470–850 px. Yarım günlük
    bir ürün çekimi siteyi bir kademe yukarı taşır; şu anki kırpma/optimizasyon
    kaynak sınırının izin verdiği en iyisi. **Bu madde yazılımla çözülemez** —
    fiziksel çekim gerekiyor. Sistem hazır: yeni fotoğrafları `DATA/` klasörüne
    koyup `build_img.py → gen_media.py → build_avif.py` çalıştırmak yeterli.
12. **Vitrin ve story arşivi boş** — `config.js` → `vitrin` ve `storyArsivi`
    doldurulana kadar o iki bölüm sitede görünmez. Uydurma içerik konmadı.
13. **Kargo tarifesi tahmini** — `kargoTarife.onayli: false`. Anlaşmalı kargo
    fiyatlarınızı yazıp `true` yapın.
14. **Supabase ve Google Places anahtarları boş** — girilene kadar yorumlar
    yalnızca `config.js` içindeki listeden okunur. İkisi de isteğe bağlı.

---

## 12. Google yorumlarını siteye taşıma

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

### İşletme paneli (`panel.html`) — Ali Usta ve çalışanlar kendi fotoğraf/videosunu yayınlasın

Aynı Supabase projesini kullanır (yukarıdaki `url`/`anonKey` yeterli, ikinci bir
hesap gerekmez). `panel.html` sitenin menüsünde **hiçbir yere bağlı değildir** —
şifre yok, linki bilen açar. Kurulum:

1. Supabase panelinde **Table editor** → yeni tablo: `hikayeler`

   | sütun | tip | not |
   |---|---|---|
   | `id` | int8 | otomatik (primary key, identity) |
   | `baslik` | text | |
   | `medya_url` | text | |
   | `medya_tip` | text | `'image'` ya da `'video'` |
   | `medya_url2` | text | boş olabilir |
   | `olusturma` | timestamptz | varsayılan `now()` |

   RLS açın, `anon` rolüne şu policy'i ekleyin:
   - **INSERT**: `true` (herkes yayınlayabilir — panelde şifre olmadığı için)
   - **SELECT**: `true` (site herkese açık okur)

2. **Storage** → yeni bucket: `hikaye-medya`, **Public bucket** işaretli.
   Bucket policy'nde `anon` rolüne:
   - **INSERT** (upload): `true`
   - **SELECT** (okuma): `true`

3. Kaydedin. `panel.html`'i açın (`https://siteniz/panel.html`), dosya seçip
   ürün adını yazıp "Yayınla" deyin — kayıt aynı anda ana sayfadaki
   "Tezgâhtan haftalık kareler" (Story Arşivi) bölümünde görünür.

### "Türüne göre, tek tek" (Tatlı dünyası) — anasayfanın içinde fotoğraf/video ekleme

Bu, `panel.html`'den ayrı bir özellik: ayrı sayfası yok, doğrudan anasayfada
"Türüne göre, tek tek" bölümünün içinde. Ziyaretçi bir türe basıp ızgarayı
açtığında, üstte **"Fotoğraf/video ekle"** düğmesi çıkar; tıklayınca küçük bir
form açılır (dosya seç, kısa açıklama yaz, "Ekle" de) — kayıt o anda o türün
ızgarasına ve sayaçlarına işler, sayfa yenilenmeden.

Kurulum: Supabase panelinde **Table editor** → yeni tablo: `tur_medya`

| sütun | tip | not |
|---|---|---|
| `id` | int8 | otomatik (primary key, identity) |
| `tur` | text | `baklava` · `kunefe` · `dondurma` · `fistik` · `ozel` · `dukkan` |
| `baslik` | text | |
| `medya_url` | text | |
| `medya_tip` | text | `'image'` ya da `'video'` |
| `olusturma` | timestamptz | varsayılan `now()` |

RLS açın, `anon` rolüne `hikayeler` tablosundaki aynı iki policy'i ekleyin
(**INSERT**: `true`, **SELECT**: `true`). Ayrı bir Storage bucket'ı gerekmez,
aynı `hikaye-medya` bucket'ı kullanılır.

**Önemli fark:** `panel.html`'in linki gizli (şifre yok ama linki bilmeyen
bulamaz). Bu özellik anasayfanın içinde olduğu için **herkes** — siteye giren
her ziyaretçi — bir türe fotoğraf/video ekleyebilir; gizli bir link değil.
Supabase kurulu değilse "Fotoğraf/video ekle" düğmesi hiç görünmez, o yüzden
riski istemiyorsanız `tur_medya`'yı kurmayın.

Panel linkini yalnızca Ali Usta ve çalışanlarla paylaşın (SMS/WhatsApp'tan
gönderin) — sitede hiçbir düğme ona bağlanmaz, bulmak için linki bilmek gerekir.
Şifre olmadığı için biri linki ele geçirirse yayın yapabilir; büyük bir risk
değildir (yalnızca yeni bir kart eklenir, mevcut hiçbir şey silinmez/değişmez)
ama linki gereksiz yere paylaşmayın.

---

## 13. Bakım

### Sadece metin/fiyat/yorum değişecekse
`assets/js/config.js` dosyasını açın, tırnak içindeki yazıları değiştirin, kaydedin.
Başka hiçbir şey gerekmez.

### Yeni özellik verisi girecekseniz

| Ne | Nerede |
|---|---|
| Bugün vitrinde | `config.js` → `vitrin` |
| Story arşivi | `config.js` → `storyArsivi` (görseller `assets/img/story/`) — ya da `panel.html`'den canlı ekleyin |
| Sipariş takibi | `config.js` → `takip.siparisler` |
| Kargo tarifesi | `config.js` → `kargoTarife` |
| Hediye paketi | `config.js` → `hediye.secenekler` |
| Yeni blog yazısı | `config.js` → `yazilar` (`kapak` bir medya anahtarı, örn. `'p45'`) |
| Bülten adresi | `config.js` → `bulten.formUrl` |

### Medya değişecekse
```bash
pip install pillow imageio-ffmpeg
python _work/build_img.py     # DATA/*.png  → assets/img/**
python _work/build_vid.py     # DATA/*.mp4  → assets/video/**
python _work/gen_media.py     # manifestler → assets/js/media.js + MEDYA-LISTESI.md
python _work/build_langs.py   # en/ ve ar/ sayfalarını yeniden üret
```
Kategori dağılımı `_work/gen_media.py` içindeki `CATS` tablosunda; bir kare yanlış
kategorideyse tek satır taşıyıp betiği yeniden çalıştırmak yeterli.

### Türkçe sayfada HTML değişecekse
Değişiklikten sonra mutlaka `python _work/build_langs.py` çalıştırın —
`en/` ve `ar/` sayfaları `index.html`'den türetilir.

---

## 14. Üçüncü taraf bağımlılıklar

Hepsi CDN'den, hepsi SRI (`integrity`) hash'i ile doğrulanıyor.

| Kütüphane | Sürüm | Kullanım |
|---|---|---|
| GSAP | 3.12.5 | Zaman çizelgeleri, tween'ler |
| ScrollTrigger | 3.12.5 | Scroll koreografisi, pin, scrub |
| Lenis | 1.1.14 | Yumuşak scroll |
| Google Fonts | — | Fraunces + Karla + Noto Kufi Arabic |

Harita `iframe`'i **tıklanana kadar yüklenmiyor** — hem gizlilik hem performans için.
Formlar hiçbir üçüncü tarafa veri göndermez (Web3Forms anahtarı girilmedikçe);
mesaj doğrudan kullanıcının WhatsApp'ında açılır.

Arayüz sesleri **dosya indirmez** — WebAudio ile üretilir. Sepet ve tema tercihi
tarayıcının `localStorage`'ında kalır, hiçbir sunucuya gitmez.

İsteğe bağlı ve **varsayılan olarak kapalı** dış servisler (`config.js` boşken
hiç istek atılmaz): Google Places API, Supabase, Web3Forms, Plausible, Umami,
bülten form adresi.

---

## 15. Üretim betikleri (`_work/`, yüklenmez)

| Betik | Ne yapar |
|---|---|
| `build_img.py` | Ham fotoğrafları kırpar, boyutlandırır, WebP'ye çevirir |
| `build_vid.py` | Videoları kırpar, H.264'e kodlar, poster çıkarır |
| `build_avif.py` | Her `.webp` yanına `.avif` üretir (eksikleri, `--hepsi` ile tümünü) |
| `gen_media.py` | `assets/js/media.js` haritasını üretir; kullanılmayan dosya kalırsa `assert` ile durur |
| `build_langs.py` | `index.html`'den `en/` sayfasını üretir (alan adı argümanı ile `hreflang`) |
| `build_static.py` | `sitemap.xml`, `robots.txt` ve mutlak adresleri yazar |
| `yorum_ekle.py` | Google yorumlarını `config.js`'e aktarır (kopyala-yapıştır ya da CSV) |

Sıra önemli: `build_img` → `build_avif` → `gen_media` → `build_langs`.

`build_langs.py` yalnızca `en/` üretir; Arapça çıkarıldı.
