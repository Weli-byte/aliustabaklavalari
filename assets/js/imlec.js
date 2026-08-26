/* =========================================================================
   ALİ USTA BAKLAVALARI — ÖZEL İMLEÇ

   Üç parça:
     · elmas  — dolu altın eşkenar dörtgen, gecikmesiz
     · halka  — ince altın çember, ~320 ms yumuşak gecikmeyle takip eder
     · iz     — hızlı hareket ederken arkada kalan fıstık kırıntıları

   Bağlama göre halka büyüyüp içine bir kelime yazar:
     fotoğrafta BÜYÜT · videoda OYNAT · düğmede AÇ · WhatsApp'ta YAZ ...

   Sistem oku tamamen gizlenir. Geri geldiği yerler:
     · form alanları (yazı imleci gerekli)
     · metin seçerken (sürükleme)
     · dokunmatik cihazlar, hareket azaltma, hareket düğmesi kapalıyken

   KALDIRMAK İÇİN: config.js → imlec.acik = false
   ========================================================================= */
(function () {
  'use strict';

  var W = window, D = document;
  var C = W.AU_CONFIG || {};
  var A = null;

  var AYAR = C.imlec || {};
  if (AYAR.acik === false) return;

  var ince = W.matchMedia && W.matchMedia('(pointer: fine)');
  if (!ince || !ince.matches) return;              // dokunmatik: hiç kurulmaz

  var IZ_ACIK = AYAR.iz !== false;

  /* --- bağlama göre kelime ---------------------------------------------
     Sıra önemli: ilk eşleşen kazanır.                                    */
  var KURALLAR = [
    ['[data-add]',                                  'SEPETE'],
    ['[data-detail]',                               'DETAY'],
    ['[data-cmp]',                                  'KARŞILAŞTIR'],
    ['[data-yazi]',                                 'OKU'],
    ['a[href^="tel:"]',                             'ARA'],
    ['[href*="wa.me"], [href*="api.whatsapp"], .soc--wa, .wa-fab, .mini--wa, .btn--wa, #cartSend', 'YAZ'],
    ['.wz-opt',                                     'SEÇ'],
    ['button[type="submit"], .frm button',          'GÖNDER'],
    ['.catcard',                                    'GÖR'],
    ['.faq-item summary',                           'AÇ'],
    ['.lang',                                       'DİL'],
    ['.soc',                                        'TAKİP'],
    ['.rev-src-link',                               'KAYNAK'],
    ['.btn, .mini, .chip, .icon-btn, .tab, .cart-fab', 'AÇ'],
    ['nav a, .foot-col a',                          'GİT']
  ];

  var YAZI_ALANI = 'input, textarea, select, [contenteditable="true"], video[controls]';

  var kok, elmas, halka, kelime, izCv, izCtx;
  var acik = false, gizli = false;
  var sonX = 0, sonY = 0, sonT = 0;
  var izler = [], donuyor = false;
  var qx, qy;

  /* --- kurulum ---------------------------------------------------------- */
  function kur() {
    kok = D.createElement('div');
    kok.id = 'imlec';
    kok.setAttribute('aria-hidden', 'true');

    halka = D.createElement('span');
    halka.className = 'im-halka';
    kelime = D.createElement('b');
    kelime.className = 'im-kelime';
    halka.appendChild(kelime);

    elmas = D.createElement('span');
    elmas.className = 'im-elmas';

    kok.appendChild(halka);
    kok.appendChild(elmas);
    D.body.appendChild(kok);

    if (IZ_ACIK) {
      izCv = D.createElement('canvas');
      izCv.className = 'im-iz';
      izCv.setAttribute('aria-hidden', 'true');
      izCtx = izCv.getContext('2d');
      D.body.appendChild(izCv);
      olcule();
      W.addEventListener('resize', olcule, { passive: true });
    }

    D.documentElement.classList.add('imlec-var');

    if (W.gsap) {
      qx = W.gsap.quickTo(halka, 'x', { duration: 0.32, ease: 'power3' });
      qy = W.gsap.quickTo(halka, 'y', { duration: 0.32, ease: 'power3' });
    }
  }

  function olcule() {
    if (!izCv) return;
    var dpr = Math.min(W.devicePixelRatio || 1, 1.5);
    izCv.width = Math.round(W.innerWidth * dpr);
    izCv.height = Math.round(W.innerHeight * dpr);
    izCv.dataset.dpr = dpr;
  }

  /* --- iz: fıstık kırıntısı --------------------------------------------- */
  var TOZ = ['#A8BE55', '#8FA83C', '#C4D477', '#7E9236'];

  function izEkle(x, y, hiz) {
    if (!izCtx || izler.length > 70) return;
    var adet = hiz > 900 ? 3 : (hiz > 480 ? 2 : 1);
    for (var i = 0; i < adet; i++) {
      izler.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        r: 0.9 + Math.random() * 2.1,
        vx: (Math.random() - 0.5) * 26,
        vy: 14 + Math.random() * 30,
        omur: 0.42 + Math.random() * 0.24,
        yas: 0,
        c: TOZ[Math.floor(Math.random() * TOZ.length)],
        px: 0, py: 0, ciz: false
      });
    }
    donduryap();
  }

  function donduryap() {
    if (donuyor) return;
    donuyor = true;
    W.requestAnimationFrame(izKare);
  }

  var izSon = 0;
  function izKare(t) {
    var dt = Math.min(0.05, (t - izSon) / 1000 || 0.016);
    izSon = t;
    var dpr = parseFloat(izCv.dataset.dpr) || 1;

    izCtx.setTransform(1, 0, 0, 1, 0, 0);
    for (var j = 0; j < izler.length; j++) {
      var p = izler[j];
      if (!p.ciz) continue;
      var pay = p.r + 2;
      izCtx.clearRect((p.px - pay) * dpr, (p.py - pay) * dpr, pay * 2 * dpr, pay * 2 * dpr);
    }

    for (var k = izler.length - 1; k >= 0; k--) {
      var q = izler[k];
      q.yas += dt;
      if (q.yas >= q.omur) { izler.splice(k, 1); continue; }
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.vy += 42 * dt;
      q.px = q.x; q.py = q.y; q.ciz = true;
      izCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      izCtx.globalAlpha = (1 - q.yas / q.omur) * 0.55;
      izCtx.fillStyle = q.c;
      izCtx.beginPath();
      izCtx.arc(q.x, q.y, q.r, 0, Math.PI * 2);
      izCtx.fill();
    }

    if (izler.length) W.requestAnimationFrame(izKare);
    else { donuyor = false; izCtx.setTransform(1, 0, 0, 1, 0, 0); izCtx.clearRect(0, 0, izCv.width, izCv.height); }
  }

  /* --- bağlam çözümü ----------------------------------------------------- */
  function kelimeBul(hedef) {
    if (!hedef || !hedef.closest) return null;
    if (hedef.closest(YAZI_ALANI)) return '__yazi__';

    /* medya karosu: video mu fotoğraf mı */
    var karo = hedef.closest('.m-cell');
    if (karo && !karo.classList.contains('pcard') && !karo.classList.contains('catcard')) {
      return karo.querySelector('video') ? 'OYNAT' : 'BÜYÜT';
    }
    for (var i = 0; i < KURALLAR.length; i++) {
      if (hedef.closest(KURALLAR[i][0])) return KURALLAR[i][1];
    }
    return null;
  }

  function T(s) { return (A && A.T) ? A.T(s) : s; }

  /* --- durum ------------------------------------------------------------- */
  var sonKelime = null;

  function durumYaz(k) {
    if (k === sonKelime) return;
    sonKelime = k;

    if (k === '__yazi__') {
      kok.classList.add('im-kapali');
      D.documentElement.classList.add('imlec-yerli');
      return;
    }
    kok.classList.remove('im-kapali');
    D.documentElement.classList.remove('imlec-yerli');

    if (k) {
      kelime.textContent = T(k);
      kok.classList.add('im-kelimeli');
    } else {
      kok.classList.remove('im-kelimeli');
    }
  }

  /* --- olaylar ----------------------------------------------------------- */
  function bagla() {
    D.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;

      var x = e.clientX, y = e.clientY;
      if (!acik) {
        acik = true;
        kok.classList.add('im-acik');
        W.gsap && W.gsap.set(halka, { x: x, y: y });
      }
      elmas.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) rotate(45deg)';
      if (qx) { qx(x); qy(y); }
      else halka.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';

      var t = e.timeStamp || performance.now();
      var dt = t - sonT;
      if (IZ_ACIK && dt > 0 && dt < 220 && !gizli) {
        var hiz = Math.hypot(x - sonX, y - sonY) / (dt / 1000);
        if (hiz > 260) izEkle(x, y, hiz);
      }
      sonX = x; sonY = y; sonT = t;

      durumYaz(kelimeBul(e.target));
    }, { passive: true });

    D.addEventListener('pointerdown', function () { kok.classList.add('im-bas'); }, { passive: true });
    D.addEventListener('pointerup', function () { kok.classList.remove('im-bas'); }, { passive: true });

    /* metin seçerken sistem imleci geri gelsin */
    D.addEventListener('selectstart', function () {
      gizli = true;
      kok.classList.add('im-kapali');
      D.documentElement.classList.add('imlec-yerli');
    });
    D.addEventListener('pointerup', function () {
      if (!gizli) return;
      gizli = false;
      if (sonKelime !== '__yazi__') {
        kok.classList.remove('im-kapali');
        D.documentElement.classList.remove('imlec-yerli');
      }
    });

    /* pencereden çıkınca kaybolsun */
    D.addEventListener('pointerleave', function () { kok.classList.remove('im-acik'); acik = false; });
    W.addEventListener('blur', function () { kok.classList.remove('im-acik'); acik = false; });

    W.addEventListener('au:motion', tazele);
    var mq = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq && mq.addEventListener) mq.addEventListener('change', tazele);
  }

  function durmali() {
    var mq = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq && mq.matches) return true;
    if (A && A.motionOff && A.motionOff()) return true;
    return false;
  }

  function tazele() {
    if (durmali()) {
      D.documentElement.classList.remove('imlec-var');
      kok.classList.remove('im-acik');
      acik = false;
      if (izCtx) { izler.length = 0; izCtx.setTransform(1,0,0,1,0,0); izCtx.clearRect(0, 0, izCv.width, izCv.height); }
    } else {
      D.documentElement.classList.add('imlec-var');
    }
  }

  /* --- başlat ------------------------------------------------------------ */
  function boot() {
    A = W.AU;
    if (durmali()) return;
    var eski = D.getElementById('cursor');
    if (eski) eski.remove();
    kur();
    bagla();
  }

  if (W.AU) boot();
  else W.addEventListener('au:ready', boot, { once: true });

})();
