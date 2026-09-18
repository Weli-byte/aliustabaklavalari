/* Ali Usta Baklavaları — İşletme paneli.
   Şifre yok: linki bilen açar. Supabase Storage + tablo üzerinden
   doğrudan yazar; site.js/extras.js hiç değişmeden aynı anda okur. */
(function () {
  'use strict';

  var C = window.AU_CONFIG || {};
  var S = C.supabase || {};
  var BUCKET = 'hikaye-medya';
  var TABLO = 'hikayeler';

  var uyari = document.getElementById('pnlUyari');
  var form = document.getElementById('pnlForm');
  var fileInput = document.getElementById('pnlFile');
  var pickBtn = document.getElementById('pnlPick');
  var preview = document.getElementById('pnlPreview');
  var baslikInput = document.getElementById('pnlBaslik');
  var msg = document.getElementById('pnlMsg');
  var submitBtn = document.getElementById('pnlSubmit');
  var listWrap = document.getElementById('pnlListWrap');
  var list = document.getElementById('pnlList');

  if (!S.url || !S.anonKey) {
    uyari.hidden = false;
    uyari.textContent = 'Panel henüz bağlı değil: assets/js/config.js içindeki "supabase" alanına url ve anonKey girilmemiş. README bölüm 12/14’e bakın.';
    form.hidden = true;
    return;
  }

  var base = S.url.replace(/\/+$/, '');
  function h(json) {
    var o = { apikey: S.anonKey, Authorization: 'Bearer ' + S.anonKey };
    if (json) { o['Content-Type'] = 'application/json'; o.Prefer = 'return=minimal'; }
    return o;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function tarihYaz(iso) {
    try {
      return new Date(iso).toLocaleString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return ''; }
  }

  pickBtn.addEventListener('click', function () { fileInput.click(); });

  fileInput.addEventListener('change', function () {
    var files = Array.prototype.slice.call(fileInput.files).slice(0, 2);
    preview.innerHTML = '';
    preview.hidden = files.length === 0;
    files.forEach(function (f) {
      var url = URL.createObjectURL(f);
      var isVid = /^video\//.test(f.type);
      var el = document.createElement(isVid ? 'video' : 'img');
      el.className = 'th';
      el.src = url;
      if (isVid) { el.muted = true; el.playsInline = true; }
      preview.appendChild(el);
    });
  });

  function dosyaYukle(file) {
    var guvenliAd = file.name.replace(/[^a-zA-Z0-9.]+/g, '-').slice(-60);
    var yol = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '-' + guvenliAd;
    return fetch(base + '/storage/v1/object/' + BUCKET + '/' + yol, {
      method: 'POST',
      headers: { apikey: S.anonKey, Authorization: 'Bearer ' + S.anonKey, 'Content-Type': file.type || 'application/octet-stream' },
      body: file
    }).then(function (r) {
      if (!r.ok) throw new Error('Dosya yüklenemedi (' + r.status + ')');
      return { url: base + '/storage/v1/object/public/' + BUCKET + '/' + yol, tip: /^video\//.test(file.type) ? 'video' : 'image' };
    });
  }

  function kayitYaz(baslik, medya) {
    return fetch(base + '/rest/v1/' + TABLO, {
      method: 'POST',
      headers: h(true),
      body: JSON.stringify({
        baslik: baslik,
        medya_url: medya[0] ? medya[0].url : null,
        medya_tip: medya[0] ? medya[0].tip : null,
        medya_url2: medya[1] ? medya[1].url : null
      })
    }).then(function (r) { if (!r.ok) throw new Error('Kayıt yazılamadı (' + r.status + ')'); });
  }

  function sonListeYukle() {
    fetch(base + '/rest/v1/' + TABLO + '?select=baslik,medya_url,medya_tip,olusturma&order=olusturma.desc&limit=8', { headers: h(false) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!Array.isArray(d) || !d.length) return;
        listWrap.hidden = false;
        list.innerHTML = d.map(function (r) {
          var m = r.medya_tip === 'video'
            ? '<video src="' + esc(r.medya_url) + '" muted playsinline preload="metadata"></video>'
            : '<img src="' + esc(r.medya_url) + '" alt="" loading="lazy">';
          return '<div class="panel-row">' + m +
            '<span><b>' + esc(r.baslik) + '</b><span class="pr-date">' + esc(tarihYaz(r.olusturma)) + '</span></span></div>';
        }).join('');
      }).catch(function () {});
  }
  sonListeYukle();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var baslik = baslikInput.value.trim();
    var files = Array.prototype.slice.call(fileInput.files).slice(0, 2);

    if (!baslik) { msg.textContent = 'Ürünün adını yaz.'; msg.classList.remove('ok'); return; }
    if (!files.length) { msg.textContent = 'En az bir fotoğraf ya da video seç.'; msg.classList.remove('ok'); return; }

    submitBtn.disabled = true;
    msg.classList.remove('ok');
    msg.innerHTML = '<span class="spin"></span>Yükleniyor…';

    Promise.all(files.map(dosyaYukle))
      .then(function (medya) { return kayitYaz(baslik, medya); })
      .then(function () {
        msg.textContent = 'Yayınlandı! Site anında güncellendi.';
        msg.classList.add('ok');
        form.reset();
        preview.innerHTML = '';
        preview.hidden = true;
        sonListeYukle();
      })
      .catch(function (err) {
        msg.textContent = 'Olmadı: ' + err.message;
        msg.classList.remove('ok');
      })
      .finally(function () { submitBtn.disabled = false; });
  });
})();
