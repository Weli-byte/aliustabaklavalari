/* =========================================================================
   ALİ USTA BAKLAVALARI — EK MODÜLLER

   Tema (açık/koyu) · ses tasarımı · bugün vitrinde · story arşivi ·
   karşılaştırma tablosu · yazılar (blog) · e-posta bülteni ·
   Google yorumları (Places API) · Supabase yorum yayını.

   Hepsi config.js'ten beslenir. Veri yoksa bölüm siteye hiç çıkmaz.
   ========================================================================= */
(function () {
  'use strict';

  var W = window, D = document;
  var C = W.AU_CONFIG || {};
  var A = null;

  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function T(s) { return A && A.T ? A.T(s) : s; }
  function el(t, c, x) { var n = D.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; }

  var AYLAR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
               'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  /* '2026-08-10' → '10 Ağustos 2026' */
  function tarihYaz(t) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(t || ''));
    if (!m) return t || '';
    return parseInt(m[3], 10) + ' ' + T(AYLAR[parseInt(m[2], 10) - 1]) + ' ' + m[1];
  }
  /* 4 → '4 dk okuma' */
  function okumaYaz(o) {
    if (o == null || o === '') return '';
    return (typeof o === 'number' ? o + ' ' + T('dk okuma') : o);
  }

  /* ===============================================================
     1. TEMA — koyu / açık
     Seçim localStorage'da kalır. Sistem tercihi ilk açılışta okunur.
     =============================================================== */
  var TEMA_ANAHTAR = 'aliusta.tema';

  function temaUygula(t) {
    D.documentElement.setAttribute('data-tema', t);
    var m = $('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'acik' ? '#F5E8CF' : '#120C06');
    $$('.tema-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', t === 'acik' ? 'true' : 'false');
      b.setAttribute('aria-label', t === 'acik' ? T('Koyu temaya geç') : T('Açık temaya geç'));
    });
  }

  function temaKur() {
    if (!(C.tema && C.tema.secilebilir)) {
      temaUygula(C.tema && C.tema.varsayilan || 'koyu');
      return;
    }
    var kayit = null;
    try { kayit = localStorage.getItem(TEMA_ANAHTAR); } catch (e) {}
    var baslangic = kayit || (C.tema.varsayilan || 'koyu');
    temaUygula(baslangic);

    /* Düğme HTML'de duruyor; burada yalnızca görünür kılıp bağlıyoruz.
       Sonradan eklenseydi üst menü kayar ve CLS artardı. */
    var b = $('#temaBtn');
    if (!b) return;
    b.hidden = false;
    temaUygula(baslangic);

    b.addEventListener('click', function () {
      var yeni = D.documentElement.getAttribute('data-tema') === 'acik' ? 'koyu' : 'acik';
      temaUygula(yeni);
      try { localStorage.setItem(TEMA_ANAHTAR, yeni); } catch (e) {}
      ses('tik');
      if (A) A.izle('tema-' + yeni);
    });
  }

  /* ===============================================================
     2. SES TASARIMI
     Dosya yok — sesler WebAudio ile üretilir (tek osilatör, kısa zarf).
     Varsayılan KAPALI; kullanıcı açarsa tercihi hatırlanır.
     prefers-reduced-motion açıkken hiç çalışmaz.
     =============================================================== */
  var SES_ANAHTAR = 'aliusta.ses';
  var sesAcik = false, ctx = null, master = null;

  function ctxKur() {
    if (ctx) return ctx;
    var AC = W.AudioContext || W.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = (C.sesTasarimi && C.sesTasarimi.seviye) || 0.22;
    master.connect(ctx.destination);
    return ctx;
  }

  /* tur: 'tik' (dokunuş) · 'ac' (panel açıldı) · 'kapat' · 'onay' */
  var TON = {
    tik:  { f: 880,  f2: 660,  s: 0.055, tip: 'triangle' },
    ac:   { f: 523,  f2: 784,  s: 0.16,  tip: 'sine' },
    kapat:{ f: 660,  f2: 392,  s: 0.14,  tip: 'sine' },
    onay: { f: 659,  f2: 988,  s: 0.22,  tip: 'sine' }
  };

  function ses(tur) {
    if (!sesAcik) return;
    if (A && A.motionOff && A.motionOff()) return;
    var c = ctxKur();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    var t = TON[tur] || TON.tik;
    var o = c.createOscillator(), g = c.createGain();
    o.type = t.tip;
    o.frequency.setValueAtTime(t.f, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(t.f2, c.currentTime + t.s);
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.6, c.currentTime + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t.s);
    o.connect(g); g.connect(master);
    o.start(); o.stop(c.currentTime + t.s + 0.02);
  }

  function sesKur() {
    if (!(C.sesTasarimi && C.sesTasarimi.acik)) return;
    var kayit = null;
    try { kayit = localStorage.getItem(SES_ANAHTAR); } catch (e) {}
    sesAcik = kayit ? kayit === '1' : !!C.sesTasarimi.varsayilanAcik;

    var b = $('#sesBtn');
    if (!b) return;
    b.hidden = false;

    function yaz() {
      b.setAttribute('aria-pressed', sesAcik ? 'true' : 'false');
      b.setAttribute('aria-label', sesAcik ? T('Arayüz seslerini kapat') : T('Arayüz seslerini aç'));
      b.classList.toggle('is-on', sesAcik);
    }
    yaz();
    b.addEventListener('click', function () {
      sesAcik = !sesAcik;
      try { localStorage.setItem(SES_ANAHTAR, sesAcik ? '1' : '0'); } catch (e) {}
      yaz();
      if (sesAcik) { ctxKur(); ses('onay'); }
      if (A) A.izle('ses-' + (sesAcik ? 'ac' : 'kapat'));
    });

    /* arayüzün geneline bağla — tek delege, pasif */
    D.addEventListener('pointerdown', function (e) {
      if (!sesAcik) return;
      var t = e.target;
      if (t.closest('.mini, .btn, .cat-card, .m-cell, .rv-star, .chip, .wz-opt')) ses('tik');
    }, { passive: true });
  }

  /* ===============================================================
     3. BUGÜN VİTRİNDE
     =============================================================== */
  function vitrinKur() {
    var v = C.vitrin;
    var sec = $('#vitrin');
    if (!sec) return;
    if (!v || !(v.cesitler || []).length) { sec.hidden = true; return; }
    sec.hidden = false;
    $('#vitrinTarih').textContent = v.tarih ? T('Güncelleme') + ': ' + tarihYaz(v.tarih) : '';
    $('#vitrinNot').textContent = v.not || '';
    $('#vitrinList').innerHTML = (v.cesitler || []).map(function (c) {
      var ad = typeof c === 'string' ? c : c.ad;
      var durum = typeof c === 'string' ? '' : (c.durum || '');
      return '<li class="vt-chip' + (/tüken|bitti/i.test(durum) ? ' vt-chip--out' : '') + '">' +
        '<b>' + esc(ad) + '</b>' + (durum ? '<span>' + esc(durum) + '</span>' : '') + '</li>';
    }).join('');
    var g = $('#vitrinFoto');
    if (v.gorsel) { g.src = v.gorsel; g.hidden = false; } else { g.hidden = true; }
  }

  /* ===============================================================
     5. KARŞILAŞTIRMA TABLOSU — "neden bizden"
     =============================================================== */
  function karsilastirmaKur() {
    var sec = $('#fark');
    if (!sec) return;
    var rows = C.karsilastirma || [];
    if (!rows.length) { sec.hidden = true; return; }
    sec.hidden = false;
    $('#farkTable').innerHTML =
      '<caption class="sr-only">' + esc(T('Ali Usta ile endüstriyel üretim karşılaştırması')) + '</caption>' +
      '<thead><tr><th scope="col">' + esc(T('Ölçüt')) + '</th>' +
        '<th scope="col" class="fk-us">' + esc(C.isim || 'Ali Usta') + '</th>' +
        '<th scope="col">' + esc(T('Endüstriyel üretim')) + '</th></tr></thead>' +
      '<tbody>' + rows.map(function (r) {
        /* data-lbl: dar ekranda tablo karta dönüşünce sütun başlığı yerine geçer */
        return '<tr><th scope="row">' + esc(r.konu) + '</th>' +
          '<td class="fk-us" data-lbl="' + esc(C.isim || 'Ali Usta') + '">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true" class="fk-ic fk-ic--y"><path d="M5 13l4 4L19 7"/></svg>' + esc(r.biz) + '</td>' +
          '<td data-lbl="' + esc(T('Endüstriyel üretim')) + '">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true" class="fk-ic fk-ic--n"><path d="M6 6l12 12M18 6L6 18"/></svg>' + esc(r.onlar) + '</td></tr>';
      }).join('') + '</tbody>';
  }

  /* ===============================================================
     7. E-POSTA BÜLTENİ
     Sunucu yok: Web3Forms anahtarı varsa oraya, yoksa WhatsApp'a düşer.
     =============================================================== */
  function bultenKur() {
    var kutu = $('#bulten');
    if (!kutu) return;
    if (!(C.bulten && C.bulten.acik)) { kutu.hidden = true; return; }
    kutu.hidden = false;
    $('#bultenBaslik').textContent = C.bulten.baslik || '';
    $('#bultenMetin').textContent = C.bulten.metin || '';

    $('#formBulten').addEventListener('submit', function (e) {
      e.preventDefault();
      var form = this;
      var eposta = $('#bl-eposta', form).value.trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(eposta);
      var hata = $('#bl-hata', form);
      if (!ok) {
        hata.textContent = T('Geçerli bir e-posta adresi yazın.');
        hata.hidden = false;
        $('#bl-eposta', form).focus();
        return;
      }
      hata.hidden = true;

      if (C.bulten.formUrl) {
        fetch(C.bulten.formUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: eposta, kaynak: 'aliusta-web' })
        }).catch(function () {});
      } else if (A) {
        A.web3Gonder('Bülten kaydı', 'E-posta: ' + eposta);
      }
      form.innerHTML = '<p class="bl-ok">' + esc(T('Kaydınız alındı. Bayram ve sezon duyurularında haber vereceğiz.')) + '</p>';
      ses('onay');
      if (A) A.izle('bulten');
    });
  }

  /* ===============================================================
     8. YORUM KAYNAKLARI — Google Places + Supabase
     Not: Google'ın Places API'si üçüncü taraflara EN FAZLA 5 yorum verir.
     117 yorumun tamamı yalnızca Google'ın kendi arayüzünde görünür.
     Tamamını siteye almak için _work/yorum_ekle.py ile toplu aktarım
     yapılır (Google'dan kopyala-yapıştır → config.js).
     =============================================================== */
  function yorumBirlestir(yeni, kaynak) {
    if (!yeni || !yeni.length) return 0;
    C.yorumlar = C.yorumlar || [];
    var var_ = {};
    C.yorumlar.forEach(function (y) { var_[(y.ad || '') + '|' + (y.metin || '').slice(0, 40)] = 1; });
    var n = 0;
    yeni.forEach(function (y) {
      var k = (y.ad || '') + '|' + (y.metin || '').slice(0, 40);
      if (var_[k]) return;
      var_[k] = 1;
      y.kaynak = y.kaynak || kaynak;
      C.yorumlar.push(y);
      n++;
    });
    if (n) {
      C.yorumlar.sort(function (a, b) { return String(b.tarih || '').localeCompare(String(a.tarih || '')); });
      if (A) A.yorumlariTazele();
    }
    return n;
  }

  function googleYorumlari() {
    var g = C.googlePlaces;
    if (!g || !g.apiKey || !g.placeId) return;
    var url = 'https://places.googleapis.com/v1/places/' + encodeURIComponent(g.placeId) +
      '?fields=rating,userRatingCount,reviews&languageCode=tr&key=' + encodeURIComponent(g.apiKey);
    fetch(url).then(function (r) { return r.json(); }).then(function (d) {
      if (d.rating) C.googlePuan = d.rating;
      if (d.userRatingCount) C.googleAdet = d.userRatingCount;
      var list = (d.reviews || []).map(function (r) {
        return {
          ad: (r.authorAttribution && r.authorAttribution.displayName) || 'Google kullanıcısı',
          puan: r.rating || 5,
          metin: (r.originalText && r.originalText.text) || (r.text && r.text.text) || '',
          tarih: (r.publishTime || '').slice(0, 10),
          kaynak: 'Google'
        };
      }).filter(function (r) { return r.metin; });
      yorumBirlestir(list, 'Google');
    }).catch(function () { /* anahtar yanlış ya da kota — sessiz geç */ });
  }

  function supabaseYorumlari() {
    var s = C.supabase;
    if (!s || !s.url || !s.anonKey) return;
    var url = s.url.replace(/\/+$/, '') + '/rest/v1/' + (s.tablo || 'yorumlar') +
      '?select=ad,puan,metin,tarih&onayli=eq.true&order=tarih.desc&limit=200';
    fetch(url, { headers: { apikey: s.anonKey, Authorization: 'Bearer ' + s.anonKey } })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (Array.isArray(d)) yorumBirlestir(d, 'Site'); })
      .catch(function () {});
  }

  /* Site üzerinden gelen yorumu Supabase'e yaz (varsa). site.js
     form gönderimini yakalayıp bu olayı fırlatır. */
  W.addEventListener('au:yorum', function (e) {
    var s = C.supabase, y = e.detail;
    if (!s || !s.url || !s.anonKey || !y) return;
    fetch(s.url.replace(/\/+$/, '') + '/rest/v1/' + (s.tablo || 'yorumlar'), {
      method: 'POST',
      headers: {
        apikey: s.anonKey, Authorization: 'Bearer ' + s.anonKey,
        'Content-Type': 'application/json', Prefer: 'return=minimal'
      },
      body: JSON.stringify({ ad: y.ad, puan: y.puan, metin: y.metin, tarih: y.tarih, onayli: false })
    }).catch(function () {});
  });

  /* ===============================================================
     9. Başlat
     =============================================================== */
  function boot() {
    A = W.AU;
    temaKur();
    sesKur();
    vitrinKur();
    karsilastirmaKur();
    bultenKur();
    /* Uzak istekler ve tek seferlik ölçüm ilk boyamadan sonra. */
    if (A) A.sonraYap(function () {
      googleYorumlari();
      supabaseYorumlari();
      setTimeout(function () { A.tazele(); }, 300);
    });
    W.AU_SES = ses;
  }
  if (W.AU) boot();
  else W.addEventListener('au:ready', boot, { once: true });

})();
