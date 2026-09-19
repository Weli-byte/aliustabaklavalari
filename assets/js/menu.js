/* Ali Usta Baklavaları — QR menü sayfası.
   Ürün adı/açıklaması/fotoğraf assets/js/media.js (RAIL + CATS) üzerinden,
   fiyatlar assets/js/config.js üzerinden okunur; ana site ile ortak veri,
   ayrı bakım gerekmez.

   YÖNETİM: işletme sahibi aynı şifreyle (config.js → catEkleSifreTers,
   "Türüne göre" bölümündeki fotoğraf/video ekleme şifresiyle birebir aynı)
   buradan yeni tatlı ekleyebilir, eklediğini silebilir, HERHANGİ bir
   tatlının fiyatını değiştirebilir. Bu değişiklikler LocalStorage'da
   tutulur — site.js'teki "Türüne göre" ekleme özelliği ile aynı sınır:
   Supabase kurulu değilse (config.js → supabase.url boş) yalnızca
   İŞLEMİ YAPAN TARAYICIDA görünür, ziyaretçilerin kendi telefonuna
   yansımaz. Gerçekten herkese yansısın diye Supabase bağlanmalı. */
(function () {
  'use strict';
  var D = document;
  var C = window.AU_CONFIG || {};
  var M = window.AU_MEDIA || {};
  var RAIL = M.rail || [];
  var CATS = (M.cats || []).filter(function (c) { return c.id !== 'dukkan'; });

  function IMG(k) { return 'assets/img/thumb/' + k + '.webp'; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  /* Ürün/altyazı adı → fiyat tablosundaki satır adı. */
  var ALIAS = {
    'Dürüm Baklava': 'Klasik Baklava',
    'Burma Kadayıf': 'Klasik Baklava',
    'Hasır Künefe': 'Klasik Baklava',
    'Antep Özel': 'Klasik Baklava',
    'Saray Sarması': 'Dolama',
    'Fıstıkzade Künefe ve Yarı Fıstıkzade Yarı Billuriye': 'Fıstıkzade',
    'Fıstıklı burma kadayıf': 'Klasik Baklava',
    'Fıstıklı kadayıf': 'Klasik Baklava',
    'Hasır kadayıf': 'Klasik Baklava',
    'Fıstıkzade Künefe': 'Fıstıkzade',
    'Yeşil Midye': 'Midye Baklava',
    'Midye': 'Midye Baklava',
    'Fıstık Ezmesi': 'Klasik Baklava',
    'Fıstık Ezmesi Dolama': 'Dolama'
  };
  /* Bazı galeri fotoğraflarının altyazısı ana sitede bilinçli olarak
     boş bırakıldı (kullanıcı isteğiyle) — menüde isim göstermek için
     yalnızca burada, yerel bir görünen-ad tanımlanır. */
  var ISIM_YEDEK = { p34: 'Fıstık Ezmesi', p36: 'Fıstık Ezmesi Dolama' };

  var RAIL_CAT = {
    'Klasik Baklava': 'baklava', 'Dürüm Baklava': 'baklava', 'Midye Baklava': 'baklava',
    'Yeşil Şöbiyet': 'baklava', 'Dolama': 'baklava', 'Bülbül Yuvası': 'baklava',
    'Havuç Dilimi': 'baklava', 'Saray Sarması': 'baklava', 'Antep Özel': 'baklava',
    'Burma Kadayıf': 'kunefe', 'Hasır Künefe': 'kunefe',
    'Fıstıkzade Künefe ve Yarı Fıstıkzade Yarı Billuriye': 'kunefe'
  };

  function fiyatSatiri(ad) {
    var hedef = ALIAS[ad] || ad;
    var l = C.fiyatlar || [];
    for (var i = 0; i < l.length; i++) if (l[i].urun === hedef) return l[i];
    return null;
  }
  function fiyatMetni(f) { return f ? (f.kg || f.tam || '') : ''; }

  /* ------------------------------------------------------------------
     YEREL DEPOLAMA
     ------------------------------------------------------------------ */
  var ADD_KEY = 'AU_MENU_ADD_V1';
  var PRICE_KEY = 'AU_MENU_FIYAT_V1';
  var SESSION_KEY = 'AU_PANEL_DOGRULANDI'; /* site.js ile aynı anahtar — bir kere girilince tüm sitede geçerli */

  function oku(key, dflt) {
    try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : dflt; }
    catch (e) { return dflt; }
  }
  function yaz(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { window.alert('Kaydedilemedi (tarayıcı depolama alanı dolu olabilir).'); }
  }
  function eklenenler() { return oku(ADD_KEY, []); }
  function eklenenKaydet(list) { yaz(ADD_KEY, list); }
  function fiyatOverride() { return oku(PRICE_KEY, {}); }
  function fiyatOverrideKaydet(obj) { yaz(PRICE_KEY, obj); }

  function kilitliMi() { return sessionStorage.getItem(SESSION_KEY) !== '1'; }
  function sifreDogruMu(girilen) {
    var ters = (C.catEkleSifreTers || '').split('').reverse().join('');
    return !!ters && girilen === ters;
  }
  function kilidiAcmayaCalis(cb) {
    if (!kilitliMi()) { cb(true); return; }
    var girilen = window.prompt('Bu bölüm yalnızca işletme sahibi/çalışanları içindir.\nŞifreyi yazın:');
    if (girilen === null) { cb(false); return; }
    if (sifreDogruMu(girilen.trim())) {
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
      cb(true);
    } else {
      window.alert('Şifre yanlış.');
      cb(false);
    }
  }

  /* ------------------------------------------------------------------
     KART OLUŞTURMA
     id       : benzersiz anahtar (fiyat override'ı buna göre kaydedilir)
     name     : görünen ad
     desc     : açıklama (olmayabilir)
     photoSrc : <img src> değeri (thumb yolu ya da data: URL)
     w,h      : orijinal ölçüler (CLS önlemek için)
     baseFiyat: {text, porsiyon, detay} ya da null
     silinebilir: yönetim modunda "sil" düğmesi göstersin mi (yalnızca eklenenler)
     ------------------------------------------------------------------ */
  function kartHTML(o) {
    var overrides = fiyatOverride();
    var fiyatMetniGosterilen = overrides[o.id] || (o.baseFiyat ? o.baseFiyat.text : '') || 'Sorunuz';
    return (
      '<div class="menu-card" data-id="' + esc(o.id) + '">' +
        (o.photoSrc ? '<div class="menu-card-ph"><img src="' + esc(o.photoSrc) + '" width="' + (o.w || 600) + '" height="' + (o.h || 600) + '" alt="" loading="lazy" decoding="async"></div>' : '') +
        '<div class="menu-card-body">' +
          '<div class="menu-card-top">' +
            '<span class="menu-card-name">' + esc(o.name) + '</span>' +
            '<span class="menu-card-price-wrap">' +
              '<span class="menu-card-price">' + esc(fiyatMetniGosterilen) + '</span>' +
              '<button class="menu-admin-only menu-edit-price" type="button" data-edit-price="' + esc(o.id) + '" data-name="' + esc(o.name) + '" hidden title="Fiyatı değiştir">✎</button>' +
            '</span>' +
          '</div>' +
          (o.desc ? '<span class="menu-card-desc">' + esc(o.desc) + '</span>' : '') +
          (o.baseFiyat && !o.baseFiyat.porsiyon ? '<span class="menu-card-unit">/ kg</span>' : '') +
          (o.baseFiyat && o.baseFiyat.porsiyon && o.baseFiyat.detay ? '<span class="menu-card-unit">' + esc(o.baseFiyat.detay) + '</span>' : '') +
        '</div>' +
        (o.silinebilir ? '<button class="menu-admin-only menu-del-item" type="button" data-del-item="' + esc(o.id) + '" hidden title="Bu tatlıyı sil">×</button>' : '') +
      '</div>'
    );
  }

  function eklemeFormuHTML(catId) {
    return (
      '<form class="menu-add-form menu-admin-only" data-cat="' + esc(catId) + '" hidden>' +
        '<p class="menu-add-title">Yeni tatlı ekle</p>' +
        '<div class="menu-add-row">' +
          '<input type="text" name="ad" placeholder="Tatlının adı" required>' +
          '<input type="text" name="fiyat" placeholder="Örn. 1.200 ₺" required>' +
        '</div>' +
        '<div class="menu-add-row">' +
          '<input type="file" name="foto" accept="image/*">' +
          '<button class="menu-add-submit" type="submit">Ekle</button>' +
        '</div>' +
        '<p class="menu-add-msg" hidden></p>' +
      '</form>'
    );
  }

  function ciz() {
    var no = 0;
    var out = [];

    CATS.forEach(function (cat) {
      no++;
      var railItems = RAIL.filter(function (r) { return RAIL_CAT[r.name] === cat.id; });
      var railNames = railItems.map(function (r) { return r.name; });

      var kartlar = railItems.map(function (r) {
        var foto = r.photos && r.photos[0];
        return kartHTML({
          id: 'rail:' + r.name, name: r.name, desc: r.desc,
          photoSrc: foto ? IMG(foto.k) : '', w: foto && foto.w, h: foto && foto.h,
          baseFiyat: (function () { var f = fiyatSatiri(r.name); return f ? { text: fiyatMetni(f), porsiyon: f.porsiyon, detay: f.detay } : null; })()
        });
      }).join('');

      var galeriKartlar = (cat.items || []).filter(function (it) {
        return it.t === 'img' && railNames.indexOf(it.cap) === -1;
      }).map(function (it) {
        var ad = it.cap || ISIM_YEDEK[it.k] || 'İsimsiz';
        var f = fiyatSatiri(ad);
        return kartHTML({
          id: 'gal:' + it.k, name: ad, desc: '',
          photoSrc: IMG(it.k), w: it.w, h: it.h,
          baseFiyat: f ? { text: fiyatMetni(f), porsiyon: f.porsiyon, detay: f.detay } : null
        });
      }).join('');

      var eklenmisKartlar = eklenenler().filter(function (it) { return it.cat === cat.id; }).map(function (it) {
        return kartHTML({ id: it.id, name: it.name, desc: '', photoSrc: it.foto, w: 600, h: 600, baseFiyat: { text: it.fiyat }, silinebilir: true });
      }).join('');

      out.push(
        '<section class="menu-cat">' +
          '<div class="menu-cat-head">' +
            '<p class="menu-cat-no">' + ('0' + no) + '</p>' +
            '<h2>' + esc(cat.name) + '</h2>' +
            '<p class="menu-cat-kicker">' + esc(cat.kicker) + '</p>' +
          '</div>' +
          '<div class="menu-grid">' + kartlar + galeriKartlar + eklenmisKartlar + '</div>' +
          '<button class="menu-admin-only menu-add-toggle" type="button" data-cat-toggle="' + esc(cat.id) + '" hidden>+ Yeni tatlı ekle</button>' +
          eklemeFormuHTML(cat.id) +
        '</section>'
      );
    });

    D.getElementById('menuBody').innerHTML = out.join('');
    uygulaAdminGorunumu();
  }

  function uygulaAdminGorunumu() {
    var acik = !kilitliMi();
    var adminBtn = D.getElementById('menuAdminToggle');
    if (adminBtn) adminBtn.textContent = acik ? 'Yönetim (açık)' : 'Yönetim';
    [].forEach.call(D.querySelectorAll('.menu-admin-only'), function (el) { el.hidden = !acik; });
  }

  /* ------------------------------------------------------------------
     OLAYLAR
     ------------------------------------------------------------------ */
  D.addEventListener('click', function (e) {
    var editBtn = e.target.closest('[data-edit-price]');
    if (editBtn) {
      var id = editBtn.getAttribute('data-edit-price');
      var yeni = window.prompt('Yeni fiyat (örn. 1.200 ₺ ya da "Sorunuz"):', editBtn.previousElementSibling.textContent);
      if (yeni === null) return;
      yeni = yeni.trim();
      if (!yeni) return;
      var ov = fiyatOverride();
      ov[id] = yeni;
      fiyatOverrideKaydet(ov);
      ciz();
      return;
    }
    var delBtn = e.target.closest('[data-del-item]');
    if (delBtn) {
      if (!window.confirm('Bu tatlıyı menüden kaldırmak istediğinize emin misiniz?')) return;
      var did = delBtn.getAttribute('data-del-item');
      eklenenKaydet(eklenenler().filter(function (it) { return it.id !== did; }));
      ciz();
      return;
    }
    var addToggle = e.target.closest('[data-cat-toggle]');
    if (addToggle) {
      var form = D.querySelector('.menu-add-form[data-cat="' + addToggle.getAttribute('data-cat-toggle') + '"]');
      if (form) form.hidden = !form.hidden;
      return;
    }
  });

  D.addEventListener('submit', function (e) {
    var form = e.target.closest('.menu-add-form');
    if (!form) return;
    e.preventDefault();
    var ad = form.ad.value.trim(), fiyat = form.fiyat.value.trim();
    var dosya = form.foto.files && form.foto.files[0];
    var msg = form.querySelector('.menu-add-msg');
    if (!ad || !fiyat) return;
    function ekle(fotoDataUrl) {
      var list = eklenenler();
      list.push({ id: 'add:' + Date.now(), cat: form.getAttribute('data-cat'), name: ad, fiyat: fiyat, foto: fotoDataUrl || '' });
      eklenenKaydet(list);
      ciz();
    }
    if (dosya) {
      if (dosya.size > 4 * 1024 * 1024) {
        msg.hidden = false; msg.textContent = 'Fotoğraf çok büyük (4 MB üzeri). Daha küçük bir fotoğraf seçin.';
        return;
      }
      var reader = new FileReader();
      reader.onload = function (ev) { ekle(ev.target.result); };
      reader.readAsDataURL(dosya);
    } else {
      ekle('');
    }
  });

  var adminBtn = D.getElementById('menuAdminToggle');
  if (adminBtn) {
    adminBtn.addEventListener('click', function () {
      if (!kilitliMi()) { uygulaAdminGorunumu(); return; }
      kilidiAcmayaCalis(function (basarili) { if (basarili) uygulaAdminGorunumu(); });
    });
  }

  ciz();

  var wa = D.getElementById('menuWa');
  if (wa && C.whatsapp) {
    wa.href = 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent('Merhaba, menüden sipariş vermek istiyorum.');
  }
  var adres = D.getElementById('menuAdres');
  if (adres) adres.textContent = (C.adres || '') + (C.adresAlt ? ', ' + C.adresAlt : '');
})();
