/* Ali Usta Baklavaları — QR menü sayfası.
   Ürün adı/açıklaması assets/js/media.js (RAIL), fiyatlar assets/js/config.js
   üzerinden okunur; ikisi de ana site ile ortak, ayrı bakım gerekmez. */
(function () {
  'use strict';
  var C = window.AU_CONFIG || {};
  var RAIL = (window.AU_MEDIA && window.AU_MEDIA.rail) || [];

  var ALIAS = {
    'Dürüm Baklava': 'Klasik Baklava',
    'Burma Kadayıf': 'Klasik Baklava',
    'Hasır Künefe': 'Klasik Baklava',
    'Antep Özel': 'Klasik Baklava',
    'Saray Sarması': 'Dolama',
    'Fıstıkzade Künefe ve Yarı Fıstıkzade Yarı Billuriye': 'Fıstıkzade'
  };

  /* Kategori başlıkları + içindeki ürün adları (RAIL adlarıyla birebir). */
  var KATEGORILER = [
    { ad: 'Baklava Çeşitleri', urunler: [
      'Klasik Baklava', 'Dürüm Baklava', 'Midye Baklava', 'Burma Kadayıf',
      'Yeşil Şöbiyet', 'Dolama', 'Bülbül Yuvası', 'Havuç Dilimi', 'Saray Sarması'
    ]},
    { ad: 'Künefe', urunler: [
      'Hasır Künefe', 'Fıstıkzade Künefe ve Yarı Fıstıkzade Yarı Billuriye'
    ]},
    { ad: 'Fıstık & Özel', urunler: [
      'Antep Özel'
    ]}
  ];

  function railOf(ad) {
    for (var i = 0; i < RAIL.length; i++) if (RAIL[i].name === ad) return RAIL[i];
    return null;
  }
  function fiyatOf(ad) {
    var hedef = ALIAS[ad] || ad;
    var l = C.fiyatlar || [];
    for (var i = 0; i < l.length; i++) if (l[i].urun === hedef) return l[i];
    return null;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var out = [];
  KATEGORILER.forEach(function (kat) {
    var satirlar = kat.urunler.map(function (ad) {
      var r = railOf(ad);
      var f = fiyatOf(ad);
      if (!r || !f) return '';
      var fiyatMetin = f.porsiyon ? (f.kg || f.tam || '') : (f.kg || f.tam || '');
      return (
        '<div class="menu-item">' +
          '<div><span class="menu-item-name">' + esc(ad) + '</span>' +
          '<span class="menu-item-desc">' + esc(r.desc) + '</span></div>' +
          '<div><span class="menu-item-price">' + esc(fiyatMetin) + '</span>' +
          (f.porsiyon ? '<span class="menu-item-unit">' + esc(f.detay || '') + '</span>' : '<span class="menu-item-unit">/ kg</span>') +
          '</div>' +
        '</div>'
      );
    }).join('');
    if (!satirlar) return;
    out.push(
      '<section class="menu-cat"><h2>' + esc(kat.ad) + '</h2><div class="menu-list">' + satirlar + '</div></section>'
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
