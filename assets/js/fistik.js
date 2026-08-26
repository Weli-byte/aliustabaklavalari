/* =========================================================================
   ALİ USTA BAKLAVALARI — FISTIK YAĞMURU

   Boş bölümlerde, metnin ve fotoğrafların ARKASINDA dökülen Antep fıstığı:
   iri taneler + ince fıstık tozu. Taneler düştükçe bölümün altında
   birikiyor; kenarlarda yoğun, ortada seyrek kalıyor.

   Görsel dosya yok — her şey canvas'a sitenin kendi renkleriyle çiziliyor.

   İki katman:
     · birikinti canvas'ı — bir kez çizilir, silinmez (yerdeki fıstık)
     · yağmur canvas'ı    — yalnızca tanelerin küçük kutuları silinir

   Kural olarak sessiz durur:
     · yalnızca .fistik-zone bölümlerinde çalışır, içerik hep üstte kalır
     · pointer-events yok, ekran okuyuculara görünmez
     · ekranda bölüm kalmayınca döngü kendini durdurur
     · prefers-reduced-motion / hareket düğmesi kapalıysa hiç çizmez

   TAMAMEN KALDIRMAK İÇİN: config.js → fistikYagmuru.acik = false
   ========================================================================= */
(function () {
  'use strict';

  var W = window, D = document;
  var C = W.AU_CONFIG || {};
  var A = null;

  var AYAR = C.fistikYagmuru || {};
  if (AYAR.acik === false) return;

  /* --- renkler ---------------------------------------------------------
     Fıstık içi yeşilleri + kabuk altındaki mor zar. Sitenin --pist ve
     --pist-lit değişkenleriyle aynı aileden.                              */
  var YESIL = [
    { a: '#B6CC63', b: '#7E9236' },   // açık iç
    { a: '#A8BE55', b: '#6E8130' },   // --pist-lit → --pist
    { a: '#9BB44A', b: '#5F7128' },   // koyu iç
    { a: '#C2D479', b: '#8CA33F' }    // sarımsı iç
  ];
  var MOR = ['#7A4048', '#8C4A5C', '#63333F'];   // zar lekesi
  var TOZ = ['#A8BE55', '#8FA83C', '#C4D477', '#7E9236'];

  var YOGUNLUK = typeof AYAR.yogunluk === 'number' ? AYAR.yogunluk : 1;
  var DAR = !!(W.matchMedia && W.matchMedia('(max-width: 820px)').matches);
  var DPR = DAR ? 1 : Math.min(W.devicePixelRatio || 1, 1.25);

  var IRI_TAVAN = DAR ? 10 : 20;     // bölüm başına iri tane
  var TOZ_TAVAN = DAR ? 55 : 130;    // bölüm başına toz zerresi (ucuz: 1–3 px daire)
  var BIRIKINTI_TAVAN = DAR ? 170 : 380;

  var bolgeler = [];
  var calisiyor = false;
  var sonZaman = 0;

  function rast(a, b) { return a + Math.random() * (b - a); }
  function secR(d) { return d[Math.floor(Math.random() * d.length)]; }

  /* Kenarlara yaslı dağılım: ortası boş kalsın, metin nefes alsın. */
  function kenarX(w) {
    var u = Math.random();
    var t = u < 0.5 ? Math.pow(u * 2, 2.1) / 2
                    : 1 - Math.pow((1 - u) * 2, 2.1) / 2;
    return -24 + t * (w + 48);
  }

  /* =====================================================================
     TANE ÇİZİMİ
     ===================================================================== */

  /** İri fıstık: yeşil gövde, üstünde mor zar lekesi, ince çatlak. */
  function fistikCiz(ctx, t, alfa) {
    var co = Math.cos(t.aci), si = Math.sin(t.aci);
    ctx.setTransform(co * DPR, si * DPR, -si * DPR, co * DPR, t.px * DPR, t.py * DPR);
    ctx.globalAlpha = alfa;

    var a = t.en / 2, b = t.boy / 2;

    /* gövde — badem formu */
    ctx.beginPath();
    ctx.moveTo(0, -b);
    ctx.bezierCurveTo(a, -b * 0.52, a, b * 0.62, 0, b);
    ctx.bezierCurveTo(-a, b * 0.62, -a, -b * 0.52, 0, -b);

    var g = ctx.createLinearGradient(-a, -b, a, b);
    g.addColorStop(0, t.renk.a);
    g.addColorStop(1, t.renk.b);
    ctx.fillStyle = g;
    ctx.fill();

    if (t.boy < 7) return;            // küçükler burada biter, ucuz kalsın

    /* mor zar — gövdenin bir ucunda kalan kabuk izi */
    ctx.save();
    ctx.clip();
    ctx.globalAlpha = alfa * 0.85;
    ctx.fillStyle = t.mor;
    ctx.beginPath();
    ctx.ellipse(t.morX * a, t.morY * b, a * 0.72, b * 0.42, t.morAci, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* çatlak */
    ctx.globalAlpha = alfa * 0.4;
    ctx.strokeStyle = t.renk.b;
    ctx.lineWidth = Math.max(0.5, t.boy * 0.06);
    ctx.beginPath();
    ctx.moveTo(0, -b * 0.7);
    ctx.lineTo(0, b * 0.7);
    ctx.stroke();

    /* ışık kenarı */
    ctx.globalAlpha = alfa * 0.3;
    ctx.strokeStyle = '#E4EFB4';
    ctx.lineWidth = Math.max(0.4, t.boy * 0.045);
    ctx.beginPath();
    ctx.moveTo(-a * 0.55, -b * 0.35);
    ctx.quadraticCurveTo(-a * 0.85, 0, -a * 0.45, b * 0.4);
    ctx.stroke();
  }

  /** Toz zerresi — tek küçük daire. */
  function tozCiz(ctx, t, alfa) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.globalAlpha = alfa;
    ctx.fillStyle = t.toz;
    ctx.beginPath();
    ctx.arc(t.px, t.py, t.boy / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  /* =====================================================================
     TANE ÜRETİMİ
     ===================================================================== */
  function iriUret(w, h, ilk) {
    var boy = rast(9, 21) * (DAR ? 0.78 : 1);
    return {
      tip: 'iri',
      x: kenarX(w),
      y: ilk ? rast(-h * 0.35, h * 0.9) : rast(-140, -20),
      px: 0, py: 0, cizildi: false,
      boy: boy,
      en: boy * rast(0.56, 0.7),
      hiz: rast(26, 62) * (boy / 15),
      aci: rast(0, Math.PI * 2),
      donus: rast(-1.1, 1.1),
      salinim: rast(4, 16),
      faz: rast(0, Math.PI * 2),
      salinimHizi: rast(0.3, 0.8),
      alfa: rast(0.34, 0.62),
      renk: secR(YESIL),
      mor: secR(MOR),
      morX: rast(-0.35, 0.35),
      morY: rast(-0.5, 0.5),
      morAci: rast(0, Math.PI)
    };
  }

  function tozUret(w, h, ilk) {
    var boy = rast(1.1, 3.4);
    return {
      tip: 'toz',
      x: kenarX(w),
      y: ilk ? rast(-h * 0.3, h) : rast(-120, -10),
      px: 0, py: 0, cizildi: false,
      boy: boy,
      hiz: rast(14, 46),
      salinim: rast(5, 22),
      faz: rast(0, Math.PI * 2),
      salinimHizi: rast(0.4, 1.2),
      alfa: rast(0.18, 0.5),
      toz: secR(TOZ)
    };
  }

  /* =====================================================================
     BİRİKİNTİ — yere düşen taneler kalıcı katmana işlenir
     ===================================================================== */
  function dipYuk(b) { return Math.min(64, b.h * 0.16); }

  function zeminHazirla(b) {
    var ctx = b.bctx;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, b.w, b.h);
    b.dusen = 0;

    var yuk = dipYuk(b);

    /* dipteki ince fıstık tozu pusu */
    var g = ctx.createLinearGradient(0, b.h - yuk, 0, b.h);
    g.addColorStop(0, 'rgba(126,146,54,0)');
    g.addColorStop(1, 'rgba(126,146,54,0.16)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(0, b.h - yuk, b.w, yuk);

    /* kenarlarda daha yoğun serpinti */
    var n = Math.round(Math.min(320, b.w / 5) * (DAR ? 0.5 : 1));
    for (var i = 0; i < n; i++) {
      var x = kenarX(b.w);
      var y = b.h - Math.pow(Math.random(), 1.7) * yuk;
      ctx.globalAlpha = rast(0.08, 0.3);
      ctx.fillStyle = secR(TOZ);
      ctx.beginPath();
      ctx.arc(x, y, rast(0.6, 2.2), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function birikimeEkle(b, t) {
    if (b.dusen >= BIRIKINTI_TAVAN) return;
    b.dusen++;
    var ctx = b.bctx;
    var yuk = dipYuk(b);
    var y = b.h - Math.pow(Math.random(), 1.5) * yuk * 0.85 - 2;

    if (t.tip === 'iri') {
      fistikCiz(ctx, {
        px: t.px, py: y, boy: t.boy * 0.94, en: t.en * 0.94,
        aci: rast(-0.5, 0.5) + Math.PI / 2,          // yatık dursun
        renk: t.renk, mor: t.mor, morX: t.morX, morY: t.morY, morAci: t.morAci
      }, Math.min(0.7, t.alfa + 0.12));

      /* çevresine birkaç kırıntı */
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      for (var i = 0; i < 3; i++) {
        ctx.globalAlpha = rast(0.12, 0.34);
        ctx.fillStyle = secR(TOZ);
        ctx.beginPath();
        ctx.arc(t.px + rast(-t.boy, t.boy), y + rast(-4, 5), rast(0.7, 2.1), 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.globalAlpha = Math.min(0.55, t.alfa + 0.1);
      ctx.fillStyle = t.toz;
      ctx.beginPath();
      ctx.arc(t.px, y, t.boy / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* =====================================================================
     BÖLÜM KURULUMU
     ===================================================================== */
  function bolgeKur(sn) {
    var b = { sec: sn, taneler: [], gorunur: false, w: 0, h: 0, dusen: 0 };

    b.bcv = D.createElement('canvas');
    b.bcv.className = 'fistik-cv fistik-cv--yer';
    b.bcv.setAttribute('aria-hidden', 'true');
    b.bctx = b.bcv.getContext('2d');

    b.cv = D.createElement('canvas');
    b.cv.className = 'fistik-cv fistik-cv--yagmur';
    b.cv.setAttribute('aria-hidden', 'true');
    b.ctx = b.cv.getContext('2d');

    sn.insertBefore(b.cv, sn.firstChild);
    sn.insertBefore(b.bcv, sn.firstChild);

    olcule(b, true);
    bolgeler.push(b);
  }

  function olcule(b, ilk) {
    var r = b.sec.getBoundingClientRect();
    var w = Math.round(r.width), h = Math.round(r.height);
    if (!w || !h || (w === b.w && h === b.h)) return;
    b.w = w; b.h = h;
    [b.cv, b.bcv].forEach(function (c) {
      c.width = Math.round(w * DPR);
      c.height = Math.round(h * DPR);
    });

    var alan = (w * h) / (DAR ? 150000 : 95000) * YOGUNLUK;
    var nIri = Math.max(4, Math.round(Math.min(IRI_TAVAN, alan * 6.5)));
    var nToz = Math.max(18, Math.round(Math.min(TOZ_TAVAN, alan * 42)));

    b.taneler = [];
    for (var i = 0; i < nIri; i++) b.taneler.push(iriUret(w, h, ilk));
    for (var j = 0; j < nToz; j++) b.taneler.push(tozUret(w, h, ilk));

    zeminHazirla(b);
  }

  /* =====================================================================
     DÖNGÜ
     ===================================================================== */
  function kare(zaman) {
    if (!calisiyor) return;
    var dt = Math.min(0.05, (zaman - sonZaman) / 1000 || 0.016);
    sonZaman = zaman;

    var gorunenVar = false;

    for (var i = 0; i < bolgeler.length; i++) {
      var b = bolgeler[i];
      if (!b.gorunur || !b.w) continue;
      gorunenVar = true;

      var ctx = b.ctx, t, j;

      /* bir önceki karenin izlerini sil — yalnızca küçük kutular */
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      for (j = 0; j < b.taneler.length; j++) {
        t = b.taneler[j];
        if (!t.cizildi) continue;
        var p = (t.tip === 'iri' ? t.boy * 0.85 : t.boy) + 3;
        ctx.clearRect((t.px - p) * DPR, (t.py - p) * DPR, p * 2 * DPR, p * 2 * DPR);
      }

      var dip = b.h - dipYuk(b) * 0.5;

      for (j = 0; j < b.taneler.length; j++) {
        t = b.taneler[j];
        t.y += t.hiz * dt;
        t.faz += t.salinimHizi * dt;
        if (t.tip === 'iri') t.aci += t.donus * dt;

        t.px = t.x + Math.sin(t.faz) * t.salinim;
        t.py = t.y;

        if (t.y >= dip) {                      // yere ulaştı
          birikimeEkle(b, t);
          t.y = rast(-150, -20);
          t.x = kenarX(b.w);
          t.cizildi = false;
          continue;
        }
        if (t.py < -30) { t.cizildi = false; continue; }

        if (t.tip === 'iri') fistikCiz(ctx, t, t.alfa);
        else tozCiz(ctx, t, t.alfa);
        t.cizildi = true;
      }
    }

    if (!gorunenVar) { calisiyor = false; return; }
    W.requestAnimationFrame(kare);
  }

  function basla() {
    if (calisiyor || durmali()) return;
    calisiyor = true;
    sonZaman = performance.now();
    W.requestAnimationFrame(kare);
  }

  function temizleCanvas(b) {
    if (!b.w) return;
    b.ctx.setTransform(1, 0, 0, 1, 0, 0);
    b.ctx.clearRect(0, 0, b.cv.width, b.cv.height);
    b.taneler.forEach(function (t) { t.cizildi = false; });
  }

  function dur(temizle) {
    calisiyor = false;
    if (temizle) bolgeler.forEach(temizleCanvas);
  }

  function durmali() {
    if (W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    if (A && A.motionOff && A.motionOff()) return true;
    if (D.hidden) return true;
    return false;
  }

  function tazele() {
    if (durmali()) { dur(true); return; }
    var pay = 140;
    bolgeler.forEach(function (b) {
      var r = b.sec.getBoundingClientRect();
      b.gorunur = r.bottom > -pay && r.top < (W.innerHeight + pay);
    });
    basla();
  }

  /* =====================================================================
     BAŞLAT
     ===================================================================== */
  function boot() {
    A = W.AU;

    var secler = Array.prototype.slice.call(D.querySelectorAll('.fistik-zone'));
    if (!secler.length) return;
    secler.forEach(bolgeKur);

    if ('IntersectionObserver' in W) {
      var io = new IntersectionObserver(function (girisler) {
        girisler.forEach(function (g) {
          for (var i = 0; i < bolgeler.length; i++) {
            if (bolgeler[i].sec !== g.target) continue;
            bolgeler[i].gorunur = g.isIntersecting;
            if (!g.isIntersecting) temizleCanvas(bolgeler[i]);
            break;
          }
        });
        if (bolgeler.some(function (b) { return b.gorunur; })) basla();
        else dur(false);
      }, { rootMargin: '140px 0px' });
      secler.forEach(function (s) { io.observe(s); });
    } else {
      bolgeler.forEach(function (b) { b.gorunur = true; });
      basla();
    }

    var zaman;
    W.addEventListener('resize', function () {
      clearTimeout(zaman);
      zaman = setTimeout(function () {
        bolgeler.forEach(function (b) { olcule(b, false); });
      }, 240);
    }, { passive: true });

    D.addEventListener('visibilitychange', tazele);
    W.addEventListener('au:motion', tazele);
    if (W.matchMedia) {
      var mq = W.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.addEventListener) mq.addEventListener('change', tazele);
    }

    /* ScrollTrigger bölüm yüksekliklerini sonradan değiştirebiliyor */
    setTimeout(function () { bolgeler.forEach(function (b) { olcule(b, false); }); }, 1400);
  }

  if (W.AU) boot();
  else W.addEventListener('au:ready', boot, { once: true });

})();
