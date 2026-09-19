/* Ali Usta Baklavaları — QR menü sayfası.
   Ürün adı/açıklaması/fotoğraf assets/js/media.js (RAIL + CATS) üzerinden,
   fiyatlar assets/js/config.js üzerinden okunur; ana site ile ortak veri,
   ayrı bakım gerekmez. */
(function () {
  'use strict';
  var C = window.AU_CONFIG || {};
  var M = window.AU_MEDIA || {};
  var RAIL = M.rail || [];
  var CATS = M.cats || [];

  function IMG(k) { return 'assets/img/thumb/' + k + '.webp'; }

  /* Ürün adı → fiyat tablosundaki satır adı. Ana sitedeki shop.js ile aynı mantık. */
  var ALIAS = {
    'Dürüm Baklava': 'Klasik Baklava',
    'Burma Kadayıf': 'Klasik Baklava',
    'Hasır Künefe': 'Klasik Baklava',
    'Antep Özel': 'Klasik Baklava',
    'Saray Sarması': 'Dolama',
    'Fıstıkzade Künefe ve Yarı Fıstıkzade Yarı Billuriye': 'Fıstıkzade',
    /* galeri fotoğraf altyazıları — aynı ürünün başka bir çekimi/adlandırması */
    'Fıstıklı burma kadayıf': 'Klasik Baklava',
    'Fıstıklı kadayıf': 'Klasik Baklava',
    'Hasır kadayıf': 'Klasik Baklava',
    'Fıstıkzade Künefe': 'Fıstıkzade',
    'Yeşil Midye': 'Midye Baklava',
    'Midye': 'Midye Baklava'
  };

  /* RAIL ürünlerinin "Türüne göre" kategorilerindeki karşılığı. */
  var RAIL_CAT = {
    'Klasik Baklava': 'baklava', 'Dürüm Baklava': 'baklava', 'Midye Baklava': 'baklava',
    'Burma Kadayıf': 'baklava', 'Yeşil Şöbiyet': 'baklava', 'Dolama': 'baklava',
    'Bülbül Yuvası': 'baklava', 'Havuç Dilimi': 'baklava', 'Saray Sarması': 'baklava',
    'Hasır Künefe': 'kunefe', 'Fıstıkzade Künefe ve Yarı Fıstıkzade Yarı Billuriye': 'kunefe',
    'Antep Özel': 'dondurma'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fiyatOf(ad) {
    var hedef = ALIAS[ad] || ad;
    var l = C.fiyatlar || [];
    for (var i = 0; i < l.length; i++) if (l[i].urun === hedef) return l[i];
    return null;
  }
  function fiyatMetni(f) {
    if (!f) return '';
    return f.kg || f.tam || '';
  }
  function railPhoto(r) { return r.photos && r.photos[0]; }

  var out = [];
  var no = 0;

  CATS.filter(function (c) { return c.id !== 'dukkan'; }).forEach(function (cat) {
    no++;
    var railItems = RAIL.filter(function (r) { return RAIL_CAT[r.name] === cat.id; });
    var railNames = railItems.map(function (r) { return r.name; });

    /* Kategorinin galeri fotoğrafları arasından, zaten fiyatlı listede
       gösterilen ürünle aynı ada sahip olanları çıkar — aynı ürün iki kez
       görünmesin (fotoğraf farklı olsa da). */
    var galeri = (cat.items || []).filter(function (it) {
      return it.t === 'img' && railNames.indexOf(it.cap) === -1;
    });

    var kartlar = railItems.map(function (r) {
      var f = fiyatOf(r.name);
      var foto = railPhoto(r);
      return (
        '<div class="menu-card">' +
          (foto ? '<div class="menu-card-ph"><img src="' + IMG(foto.k) + '" width="' + foto.w + '" height="' + foto.h + '" alt="" loading="lazy" decoding="async"></div>' : '') +
          '<div class="menu-card-body">' +
            '<div class="menu-card-top">' +
              '<span class="menu-card-name">' + esc(r.name) + '</span>' +
              '<span class="menu-card-price">' + esc(f ? fiyatMetni(f) : 'Sorunuz') + '</span>' +
            '</div>' +
            '<span class="menu-card-desc">' + esc(r.desc) + '</span>' +
            (f && !f.porsiyon ? '<span class="menu-card-unit">/ kg</span>' : '') +
            (f && f.porsiyon && f.detay ? '<span class="menu-card-unit">' + esc(f.detay) + '</span>' : '') +
          '</div>' +
        '</div>'
      );
    }).join('');

    var galeriHtml = '';
    if (galeri.length) {
      galeriHtml =
        '<div class="menu-gallery-lbl"><span>Vitrinden</span><i></i></div>' +
        '<div class="menu-gallery">' +
        galeri.map(function (it) {
          return (
            '<figure class="menu-gph"><img src="' + IMG(it.k) + '" width="' + it.w + '" height="' + it.h + '" alt="" loading="lazy" decoding="async">' +
            (it.cap ? '<figcaption>' + esc(it.cap) + '</figcaption>' : '') +
            '</figure>'
          );
        }).join('') +
        '</div>';
    }

    out.push(
      '<section class="menu-cat">' +
        '<div class="menu-cat-head">' +
          '<p class="menu-cat-no">' + ('0' + no) + '</p>' +
          '<h2>' + esc(cat.name) + '</h2>' +
          '<p class="menu-cat-kicker">' + esc(cat.kicker) + '</p>' +
        '</div>' +
        (kartlar ? '<div class="menu-grid">' + kartlar + '</div>' : '') +
        galeriHtml +
      '</section>'
    );
  });

  document.getElementById('menuBody').innerHTML = out.join('');

  var wa = document.getElementById('menuWa');
  if (wa && C.whatsapp) {
    wa.href = 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent('Merhaba, menüden sipariş vermek istiyorum.');
  }
  var adres = document.getElementById('menuAdres');
  if (adres) adres.textContent = (C.adres || '') + (C.adresAlt ? ', ' + C.adresAlt : '');
})();
