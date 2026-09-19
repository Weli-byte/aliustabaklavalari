/* =========================================================================
   ALİ USTA BAKLAVALARI
   Scroll koreografisi, medya etkileşimi, WhatsApp akışları, formlar.

   Bağımlılık: GSAP, ScrollTrigger, Lenis (CDN). Build adımı yok.
   İşletme verisi assets/js/config.js içinde — kod burada, veri orada.

   Kural: prefers-reduced-motion açıksa VEYA kullanıcı durdurma düğmesine
   basarsa kendiliğinden dönen bütün hareket kapanır, içerik statik kalır.
   ========================================================================= */
(function () {
  'use strict';

  var D = document, W = window;
  var M = W.AU_MEDIA || {};
  var C = W.AU_CONFIG || {};
  D.documentElement.classList.add('js');

  /* Google Fonts'u "print" medya hilesiyle geç yükler (render'ı bloklamasın
     diye) — önceden inline onload="" ile yapılıyordu; CSP script-src'yi
     'unsafe-inline' ile gevşetmemek için buraya, harici dosyaya taşındı. */
  (function () {
    var gf = D.getElementById('gfonts');
    if (gf) gf.media = 'all';
  })();

  /* ===============================================================
     i18n — dil, sözlük ve derin çeviri
     =============================================================== */
  var LANG = (D.documentElement.getAttribute('lang') || 'tr').slice(0, 2);
  var DICT = (W.AU_I18N || {})[LANG] || null;

  function T(s) {
    if (!DICT || typeof s !== 'string') return s;
    if (DICT[s] !== undefined) return DICT[s];
    var alt = s.replace(/&amp;/g, '&');
    return DICT[alt] !== undefined ? DICT[alt] : s;
  }

  /* Nesne ağacındaki bütün metinleri çevirir (config ve media için). */
  function ceviriDerin(o) {
    if (!DICT || !o) return o;
    if (typeof o === 'string') return T(o);
    if (Object.prototype.toString.call(o) === '[object Array]') {
      for (var i = 0; i < o.length; i++) o[i] = ceviriDerin(o[i]);
      return o;
    }
    if (typeof o === 'object') {
      for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) o[k] = ceviriDerin(o[k]);
      return o;
    }
    return o;
  }

  /* Sayfadaki hazır (statik) HTML metinlerini çevirir. */
  function ceviriDOM(kok) {
    if (!DICT) return;
    var yur = D.createTreeWalker(kok, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        var t = p.nodeName;
        if (t === 'SCRIPT' || t === 'STYLE') return NodeFilter.FILTER_REJECT;
        return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var dugumler = [], n;
    while ((n = yur.nextNode())) dugumler.push(n);
    dugumler.forEach(function (nd) {
      var ham = nd.nodeValue, kirp = ham.trim(), cev = T(kirp);
      if (cev !== kirp) nd.nodeValue = ham.replace(kirp, cev);
    });
    ['alt', 'title', 'placeholder', 'aria-label'].forEach(function (a) {
      $$('[' + a + ']', kok).forEach(function (e) {
        var v = e.getAttribute(a), c = T(v.trim());
        if (c !== v.trim()) e.setAttribute(a, c);
      });
    });
  }

  if (DICT) {
    ceviriDerin(C);
    ceviriDerin(M);
    if (D.body) ceviriDOM(D.body);
  }

  var rmq = W.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = W.matchMedia('(pointer: fine)');
  var motionOff = rmq.matches;
  var lenis = null, railST = null, rebuildRail = null, stripTween = null, heroTL = null;

  if (typeof W.gsap !== 'undefined' && W.ScrollTrigger) W.gsap.registerPlugin(W.ScrollTrigger);

  /* ===============================================================
     0. Yardımcılar
     =============================================================== */
  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
  /* Sayfa alt klasörde olabilir (en/, ar/). Kök yolu site.js'in kendi
     adresinden çıkarılır; medya tek kopya olarak assets/ altında kalır. */
  var BASE = (function () {
    var sc = D.querySelector('script[src*="assets/js/site.js"]');
    var src = sc ? sc.getAttribute('src') : '';
    return src.replace(/assets\/js\/site\.js.*$/, '');
  })();
  function IMG(k) { return BASE + 'assets/img/' + k + '.webp'; }
  function TH(k) { return BASE + 'assets/img/thumb/' + k + '.webp'; }
  /* AVIF, WebP'den ortalama %57 küçük. <picture> ile sunulur; tarayıcı
     desteklemiyorsa <img> içindeki WebP indirilir. AVIF dosyaları
     _work/build_avif.py ile üretilir — yoksa aşağıdaki hata yakalayıcı
     <source> etiketini kaldırıp WebP'ye döner, görsel kaybolmaz.        */
  function IMG_AV(k) { return BASE + 'assets/img/' + k + '.avif'; }
  function TH_AV(k) { return BASE + 'assets/img/thumb/' + k + '.avif'; }

  /** <picture> üretir. o: {k,w,h}; a: ek öznitelik dizesi. */
  function pic(o, a, buyuk, sizes) {
    var src = TH(o.k), av = TH_AV(o.k), ss = '', ssav = '';
    if (buyuk) {
      /* Kucuk boyun genisligi artik sabit degil; media.js'ten geliyor. */
      var tw = o.tw || 620;
      ss = ' srcset="' + TH(o.k) + ' ' + tw + 'w, ' + IMG(o.k) + ' ' + o.w + 'w" sizes="' + (sizes || '32vw') + '"';
      ssav = TH_AV(o.k) + ' ' + tw + 'w, ' + IMG_AV(o.k) + ' ' + o.w + 'w';
    }
    return '<picture><source type="image/avif" srcset="' + (ssav || av) + '"' +
      (buyuk ? ' sizes="' + (sizes || '32vw') + '"' : '') + '>' +
      '<img src="' + src + '"' + ss + ' width="' + o.w + '" height="' + o.h + '"' + (a || '') + '></picture>';
  }

  /* Tekil <img> için (lightbox, ürün detayı) bir kereye mahsus AVIF yoklaması.
     1×1'lik gömülü bir AVIF çözülebiliyorsa destek var demektir. */
  var AVIF_VAR = null;
  (function () {
    var im = new Image();
    im.onload = function () { AVIF_VAR = im.width === 1; };
    im.onerror = function () { AVIF_VAR = false; };
    im.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADrbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAAAAAAAOcGl0bQAAAAAAAQAAAB5pbG9jAAAAAEQAAAEAAQAAAAEAAAETAAAAIAAAAChpaW5mAAAAAAABAAAAGmluZmUCAAAAAAEAAGF2MDFDb2xvcgAAAABqaXBycAAAAEtpcGNvAAAAFGlzcGUAAAAAAAAAAQAAAAEAAAAQcGl4aQAAAAADCAgIAAAADGF2MUOBAAwAAAAAE2NvbHJuY2x4AAEADQAGgAAAABdpcG1hAAAAAAAAAAEAAQQBAoMEAAAAKG1kYXQSAAoIGAAGiAhoNCAyEh/3h4UV3///4s/AAJA1jjx+3A==';
  })();
  /** Tam boy görselin en uygun biçimdeki adresi. */
  function TAM(k) { return AVIF_VAR ? IMG_AV(k) : IMG(k); }

  /* AVIF dosyası eksik/bozuksa <source>'u at, WebP'yi yeniden dene. */
  D.addEventListener('error', function (e) {
    var t = e.target;
    if (!t || t.tagName !== 'IMG') return;
    var p = t.parentNode;
    if (!p || p.tagName !== 'PICTURE') return;
    var s = p.querySelector('source');
    if (!s) return;
    p.removeChild(s);
    var u = t.getAttribute('src');
    t.removeAttribute('src');
    t.setAttribute('src', u);
  }, true);
  function VID(k) { return BASE + 'assets/video/' + k + '.mp4'; }
  function POS(k) { return BASE + 'assets/video/poster/' + k + '.webp'; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function merge(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function el(tag, cls, txt) { var n = D.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }

  D.getElementById('yr').textContent = new Date().getFullYear();

  /* --- WhatsApp bağlantısı: tek üretim noktası --- */
  var WA_OK = !!(C.whatsapp && /^\d{10,15}$/.test(C.whatsapp));
  function waLink(mesaj) {
    if (!WA_OK) return C.telefonLink ? 'tel:' + C.telefonLink : '#iletisim';
    return 'https://wa.me/' + C.whatsapp + (mesaj ? '?text=' + encodeURIComponent(mesaj) : '');
  }
  function waAc(mesaj) {
    var u = waLink(mesaj);
    if (u.indexOf('http') === 0) W.open(u, '_blank', 'noopener');
    else W.location.href = u;
  }

  /* ===============================================================
     1. Medya karosu — tüm görsel ve videolar aynı bileşen
     =============================================================== */
  var PLAY_ICON = '<span class="m-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z"/></svg></span>';

  function cellHTML(o, opts) {
    var inner;
    if (o.url) {
      /* Panelden (Supabase) gelen kayıt: yerel anahtar yok, ham URL var —
         AVIF/WebP/boyut ön işlemesi olmadığı için doğrudan basılır. */
      inner = o.t === 'vid'
        ? '<video class="m-fill" muted loop playsinline preload="metadata" src="' + esc(o.url) + '"></video>' + PLAY_ICON
        : '<img class="m-fill" src="' + esc(o.url) + '" alt="' + esc(o.alt || o.cap || '') + '" loading="lazy" decoding="async">';
    } else if (o.t === 'vid') {
      inner = '<video class="m-fill" muted loop playsinline preload="none" poster="' + POS(o.k) +
        '" width="' + o.w + '" height="' + o.h + '" data-src="' + VID(o.k) + '" tabindex="-1"></video>' + PLAY_ICON;
    } else {
      inner = pic(o, ' class="m-fill" loading="lazy" decoding="async" alt="' +
        esc(o.alt || o.cap || '') + '"', !!opts.big, opts.sizes);
    }
    return inner + (o.cap ? '<figcaption class="m-cap">' + esc(o.cap) + '</figcaption>' : '') +
      '<span class="m-ring" aria-hidden="true"></span>';
  }
  function makeCell(o, opts) {
    opts = opts || {};
    var b = D.createElement('button');
    b.type = 'button';
    b.className = 'm-cell' + (opts.cls ? ' ' + opts.cls : '');
    if (o.bg) b.style.background = o.bg;
    b.innerHTML = cellHTML(o, opts);
    b.setAttribute('aria-label', (o.cap || o.alt || T('Medya')) + (o.t === 'vid' ? T(' — videoyu büyüt') : T(' — fotoğrafı büyüt')));
    b.__media = o;
    return b;
  }

  /* ===============================================================
     2. İÇERİK ÜRETİMİ
     =============================================================== */

  /* --- Miras --- */
  var MIRAS_META = [
    { cap: 'Ustanın elinde', alt: 'Ali Usta, dükkânın rafları ve vitrini önünde taze fıstıklı baklava dolu tepsiyi tutarken' },
    { cap: 'Kesim sonrası', alt: 'Ustanın bıçakla taze kesim yaptığı an, önlüğünde Ali Usta yazısı' },
    { cap: 'Fıstıklı tatlı çeşitleri sunumu', alt: 'Ali Usta Baklavaları tabelasının önünde, tahta tepside çeşit çeşit taze baklava' },
    { cap: 'Ustadan bir kare', alt: 'Ali Usta, tezgâhın başında elinde fıstıklı baklava tepsisiyle' }
  ];
  var mirasMedia = $('#mirasMedia');
  mirasMedia.appendChild(makeCell(merge(M.miras.video, { cap: T('Ali Usta tezgâhta') }), { cls: 'm-cell--tall' }));
  M.miras.photos.forEach(function (p, i) {
    mirasMedia.appendChild(makeCell(merge(p, MIRAS_META[i]), { cls: i >= 3 ? 'm-cell--wide' : '' }));
  });

  /* --- Ürün rayı --- */
  /* Sepet/karşılaştır düğmeleri kart ilk çizilirken yazılır.
     Sonradan eklenince kart yüksekliği değişiyor ve CLS artıyordu;
     shop.js yalnızca davranışı bağlar. */
  var SEPET_ACIK = !!(C.sepet && C.sepet.acik);

  var railTrack = $('#railTrack');
  (M.rail || []).forEach(function (p, i) {
    var card = D.createElement('article');
    card.className = 'pcard m-cell';
    card.dataset.urun = p.name;
    card.innerHTML =
      '<div class="pcard-media">' +
        '<span class="pcard-no">' + pad(i + 1) + '</span>' +
        pic(p.photos[0], ' class="m-fill main" loading="lazy" decoding="async" alt="' +
          esc(p.name) + ' — tepside yakın çekim"') +
        (p.photos[1] ? pic(p.photos[1], ' class="m-fill alt" loading="lazy" decoding="async" alt="" aria-hidden="true"') : '') +
      '</div>' +
      '<div class="pcard-body">' +
        '<h3>' + esc(p.name) + '</h3>' +
        '<p>' + esc(p.desc) + '</p>' +
        '<div class="pcard-act">' +
          (SEPET_ACIK ? '<button class="mini mini--add" type="button" data-add="' + esc(p.name) + '">' + esc(T('Sepete ekle')) + '</button>' : '') +
          '<button class="mini mini--wa" type="button" data-ask="' + esc(p.name) + '">' + esc(T('Bu ürünü sor')) + '</button>' +
          '<button class="mini" type="button" data-detail="' + esc(p.name) + '">' + esc(T('Detay')) + '</button>' +
          '<button class="mini mini--cmp" type="button" data-cmp="' + esc(p.name) + '" aria-pressed="false">' + esc(T('Karşılaştır')) + '</button>' +
        '</div>' +
      '</div>';
    railTrack.appendChild(card);
  });

  /* --- Tezgâh videoları --- */
  var tezgahGrid = $('#tezgahGrid');
  (M.tezgah || []).forEach(function (v) {
    var fig = D.createElement('figure');
    var r = v.w / v.h;
    fig.className = 'uv m-cell' + (r > 1.3 ? ' uv--wide' : (r > 0.85 ? ' uv--sq' : ''));
    fig.innerHTML =
      '<video class="m-fill" muted loop playsinline preload="none" poster="' + POS(v.k) + '" width="' + v.w + '" height="' + v.h +
      '" data-src="' + VID(v.k) + '" aria-label="' + esc(v.cap) + '"></video>' +
      '<div class="uv-ctrl">' +
        '<button class="uv-toggle" type="button" aria-pressed="false">' +
          '<span class="sr-only">' + esc(v.cap) + ' ' + esc(T('videoyu oynat veya duraklat')) + '</span>' +
          '<svg class="ic-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l12 8-12 8z"/></svg>' +
          '<svg class="ic-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>' +
        '</button>' +
        '<button class="uv-sound" type="button" aria-pressed="false">' +
          '<span class="sr-only">' + esc(v.cap) + ' ' + esc(T('videosunun sesini aç')) + '</span>' +
          '<svg class="ic-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9.5l4.5 5M21.5 9.5l-4.5 5"/></svg>' +
          '<svg class="ic-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.8 8.6a5 5 0 0 1 0 6.8"/><path d="M19.4 6a8.6 8.6 0 0 1 0 12"/></svg>' +
        '</button>' +
      '</div>' +
      '<figcaption class="m-cap m-cap--always">' + esc(v.cap) + '</figcaption>';
    fig.__media = merge(v, {});
    tezgahGrid.appendChild(fig);
  });

  /* --- TATLI DÜNYASI: önce özet kartları, sonra tür ızgarası --- */
  var CATS = M.cats || [];
  var catCards = $('#catCards'), catView = $('#catView'), catGrid = $('#catGrid'),
      catFilters = $('#catFilters'), catIntro = $('#catIntro'), catBack = $('#catBack');

  CATS.forEach(function (c) {
    var a = D.createElement('button');
    a.type = 'button';
    a.className = 'catcard m-cell';
    a.dataset.cat = c.id;
    a.style.background = c.cover.bg;
    var adet = c.nPhoto + c.nVideo;
    a.innerHTML =
      pic(c.cover, ' class="m-fill" loading="lazy" decoding="async" alt=""',
          true, '(max-width:700px) 94vw, 46vw') +
      '<span class="catcard-scrim" aria-hidden="true"></span>' +
      '<span class="catcard-body">' +
        '<span class="catcard-kick">' + esc(c.kicker) + '</span>' +
        '<span class="catcard-title">' + esc(c.name) + '</span>' +
        '<span class="catcard-desc">' + esc(c.desc) + '</span>' +
        '<span class="catcard-foot">' +
          '<span class="catcard-count">' + c.nPhoto + ' ' + esc(T('fotoğraf')) + (c.nVideo ? ' · ' + c.nVideo + ' ' + esc(T('video')) : '') + '</span>' +
          '<span class="catcard-go">' + esc(T('Gör')) + ' <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span>' +
        '</span>' +
      '</span>' +
      '<span class="m-ring" aria-hidden="true"></span>';
    a.setAttribute('aria-label', c.name + ' — ' + adet + ' ' + T('fotoğraf ve videoyu aç'));
    catCards.appendChild(a);
  });

  var ALL = [];
  CATS.forEach(function (c) { c.items.forEach(function (it) { ALL.push(merge(it, { cat: c.id, catName: c.name })); }); });
  ALL.forEach(function (it) {
    var b = makeCell(it, { big: it.t === 'img', sizes: '(max-width:600px) 47vw, (max-width:900px) 31vw, 23vw' });
    b.dataset.cat = it.cat;
    b.hidden = true;
    catGrid.appendChild(b);
  });
  CATS.forEach(function (c) {
    var b = D.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.dataset.cat = c.id;
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = esc(c.name) + '<i>' + (c.nPhoto + c.nVideo) + '</i>';
    catFilters.appendChild(b);
  });

  /* Sabit dizi değil, her çağrıda taze sorgu: panelden gelen kayıtlar
     ilk boyamadan sonra catGrid'e eklenir, o yüzden burada donmuş bir
     listeye güvenilmez. */
  function catCellsAll() { return $$('.m-cell', catGrid); }
  var catChips = $$('.chip', catFilters);
  var catRefreshT = null;
  var catAcikId = null;

  /* Bir sonraki boyamadan sonra çalıştırır — etkileşim gecikmesini uzatmaz. */
  function sonraYap(fn) {
    W.requestAnimationFrame(function () { setTimeout(fn, 0); });
  }

  /* Panel kapanırken odak panelin içinde kalırsa, aria-hidden odaklı bir
     öğeyi gizler ve ekran okuyucular uyarı verir. Odağı önce dışarı taşı. */
  function odakGeri(hedef, panel) {
    if (panel && panel.contains(D.activeElement)) D.activeElement.blur();
    if (hedef && D.contains(hedef) && hedef.offsetParent !== null) hedef.focus();
    else if (D.body) { D.body.setAttribute('tabindex', '-1'); D.body.focus(); D.body.removeAttribute('tabindex'); }
  }

  function catKaydir() {
    var y = $('#tatlilar').getBoundingClientRect().top + W.scrollY - 70;
    if (lenis && !motionOff) lenis.scrollTo(y, { duration: .9 }); else W.scrollTo(0, y);
  }
  function catTazele() {
    if (!W.ScrollTrigger) return;
    clearTimeout(catRefreshT);
    catRefreshT = setTimeout(function () { W.ScrollTrigger.refresh(); }, 450);
  }

  function showCat(id, kaydir) {
    var c = CATS.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    catAcikId = id;
    var turSel = $('#catAddTur');
    if (turSel) turSel.value = id;
    catCards.hidden = true;
    catView.hidden = false;

    catChips.forEach(function (ch) { ch.setAttribute('aria-pressed', ch.dataset.cat === id ? 'true' : 'false'); });

    /* Ağır iş (36 karonun görünürlüğü, metin yazımı, animasyon, kaydırma)
       ilk boyamadan SONRAYA atılır; aksi hâlde INP yükseliyor.
       rAF + setTimeout(0) = "bir sonraki boyamanın ardından". */
    sonraYap(function () {
      catIntro.innerHTML = '<h3>' + esc(c.name) + '</h3><p>' + esc(c.desc) + '</p>' +
        '<p class="cat-count">' + c.nPhoto + ' ' + esc(T('fotoğraf')) +
        (c.nVideo ? ' · ' + c.nVideo + ' ' + esc(T('video')) : '') + '</p>';

      var shown = [];
      catCellsAll().forEach(function (cell) {
        var on = cell.dataset.cat === id;
        cell.hidden = !on;
        cell.classList.remove('is-active');
        if (on) shown.push(cell);
      });

      if (W.gsap && !motionOff) {
        W.gsap.fromTo(shown, { opacity: 0, y: 22, scale: .97 },
          { opacity: 1, y: 0, scale: 1, duration: .55, stagger: .03, ease: 'power3.out', overwrite: true,
            onComplete: function () { W.gsap.set(shown, { clearProps: 'transform' }); } });
      }
      if (kaydir) catKaydir();
      catTazele();
    });
  }

  function showCards() {
    catAcikId = null;
    catView.hidden = true;
    catCards.hidden = false;
    sonraYap(function () {
      catCellsAll().forEach(function (c) { c.hidden = true; c.classList.remove('is-active'); });
      catTazele();
    });
  }

  catCards.addEventListener('click', function (e) {
    var c = e.target.closest('.catcard');
    if (c) { e.preventDefault(); showCat(c.dataset.cat, true); }
  });
  catFilters.addEventListener('click', function (e) {
    var c = e.target.closest('.chip');
    if (c) showCat(c.dataset.cat, false);
  });
  catBack.addEventListener('click', function () { showCards(); catKaydir(); });

  /* "Türüne göre, tek tek" bölümünün İÇİNDE, seçili türün üstünde
     "Fotoğraf/video ekle" düğmesi — ayrı bir panel sayfası değil. Supabase
     kuruluysa (config.js) herkes doğrudan buradan o türe fotoğraf/video
     ekleyebilir; kayıt anında ızgaraya ve sayaçlara işler. Yerel medya
     anahtarı yok, ham URL var; cellHTML/lbRender o.url alanını görünce
     buna göre basar. */
  /* "Türüne göre, tek tek" bölümünde fotoğraf/video ekleme özelliği.
     Bilgisayarda dosya gezgini, telefonda galeri anında açılır.
     Kullanıcı görseli seçip alt kısmına adını yazar.
     Fotoğraf ilgili tatlı türünün vitrinine anında eklenir ve yerel
     hafızada (localStorage) kalıcı tutulur. Supabase varsa
     oraya da arka planda senkronize edilir. */
  (function turEkleKur() {
    var s = C.supabase;
    var toggle = $('#catAddToggle'),
        box = $('#catAdd'),
        form = $('#catAddForm'),
        closeBtn = $('#catAddClose'),
        cancelBtn = $('#catAddCancel'),
        dropZone = $('#catAddDropZone'),
        fileInput = $('#catAddFile'),
        promptWrap = $('#catAddPrompt'),
        previewWrap = $('#catAddPreviewWrap'),
        thumbWrap = $('#catAddPreviewThumb'),
        fileNameEl = $('#catAddFileName'),
        fileSizeEl = $('#catAddFileSize'),
        changeBtn = $('#catAddChangeBtn'),
        selectBtn = $('#catAddSelectBtn'),
        baslikInput = $('#catAddBaslik'),
        turSelect = $('#catAddTur'),
        msg = $('#catAddMsg'),
        submitBtn = $('#catAddSubmit');

    if (!toggle || !box || !form || !fileInput) return;

    var seciliDosya = null; // { file, dataUrl, isVid, name, size }

    /* Kartta/ızgarada gösterilecek yeni kareyi ekler, sayaçları günceller */
    function turKayitEkle(tur, baslik, tip, url, prepend) {
      var c = CATS.filter(function (x) { return x.id === tur; })[0];
      if (!c) return null;
      var isVid = tip === 'video';
      var cell = makeCell({ t: isVid ? 'vid' : 'img', url: url, cap: baslik, cat: c.id, catName: c.name },
        { big: !isVid, sizes: '(max-width:600px) 47vw, (max-width:900px) 31vw, 23vw' });
      cell.dataset.cat = c.id;
      cell.hidden = (catAcikId !== c.id);

      if (prepend && catGrid.firstChild) {
        catGrid.insertBefore(cell, catGrid.firstChild);
      } else {
        catGrid.appendChild(cell);
      }

      if (isVid) c.nVideo++; else c.nPhoto++;
      var adet = c.nPhoto + c.nVideo;
      var cardCount = catCards.querySelector('.catcard[data-cat="' + c.id + '"] .catcard-count');
      if (cardCount) cardCount.textContent = c.nPhoto + ' ' + T('fotoğraf') + (c.nVideo ? ' · ' + c.nVideo + ' ' + T('video') : '');
      var chipCount = catFilters.querySelector('.chip[data-cat="' + c.id + '"] i');
      if (chipCount) chipCount.textContent = adet;
      if (catAcikId === c.id) {
        var cntEl = catIntro.querySelector('.cat-count');
        if (cntEl) cntEl.textContent = c.nPhoto + ' ' + esc(T('fotoğraf')) + (c.nVideo ? ' · ' + c.nVideo + ' ' + esc(T('video')) : '');
      }
      return c;
    }

    /* Kalıcı yerel depolama (LocalStorage) */
    var STORAGE_KEY = 'AU_USER_MEDIA_V1';
    function yerelKayitlariAl() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) { return []; }
    }
    function yerelKayitEkle(item) {
      try {
        var list = yerelKayitlariAl();
        list.unshift(item);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.warn('LocalStorage kotası veya yazma hatası:', e);
      }
    }

    /* Sayfa açılışında kayıtlı medyaları yükle */
    var kaydedilmisler = yerelKayitlariAl();
    if (Array.isArray(kaydedilmisler) && kaydedilmisler.length) {
      kaydedilmisler.forEach(function (r) {
        if (r && r.url && r.tur) {
          turKayitEkle(r.tur, r.baslik || '', r.tip || 'image', r.url, true);
        }
      });
    }

    /* Supabase üzerinden uzaktaki kayıtlar (eğer ayarlandıysa) */
    if (s && s.url && s.anonKey) {
      fetch(s.url.replace(/\/+$/, '') + '/rest/v1/tur_medya' +
        '?select=tur,baslik,medya_url,medya_tip,olusturma&order=olusturma.desc&limit=200',
        { headers: { apikey: s.anonKey, Authorization: 'Bearer ' + s.anonKey } })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!Array.isArray(d) || !d.length) return;
          var etkilenen = {};
          d.forEach(function (r) {
            if (!r.medya_url) return;
            var c = turKayitEkle(r.tur, r.baslik, r.medya_tip, r.medya_url, false);
            if (c) etkilenen[c.id] = true;
          });
          Object.keys(etkilenen).forEach(function (id) { if (catAcikId === id) showCat(id, false); });
        }).catch(function () {});
    }

    /* Paneli Aç / Kapat */
    function panelAcKapat(ac) {
      var yeniDurum = typeof ac === 'boolean' ? ac : box.hidden;
      box.hidden = !yeniDurum;
      toggle.setAttribute('aria-expanded', yeniDurum ? 'true' : 'false');
      if (yeniDurum) {
        if (catAcikId && turSelect) turSelect.value = catAcikId;
        msg.textContent = '';
        msg.className = 'frm-msg';
        try {
          box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (e) {}
      }
    }

    /* Şifre kontrolü: yalnızca işletme sahibi/çalışanları fotoğraf/video
       ekleyebilsin. Bu bir sunucu kontrolü değildir (site tamamen
       tarayıcıda çalışır) — sıradan ziyaretçiyi durdurur, kaynak kodu
       okuyabilen birini durdurmaz. Şifre ters çevrilmiş tutulur, ilk
       bakışta görünmesin diye; gerçek şifreleme değildir. */
    var SIFRE_OTURUM_ANAHTARI = 'AU_PANEL_DOGRULANDI';
    function sifreDogruMu(girilen) {
      var ters = (C.catEkleSifreTers || '').split('').reverse().join('');
      return !!ters && girilen === ters;
    }
    function panelAcmayaCalis() {
      if (!box.hidden) { panelAcKapat(false); return; }
      if (sessionStorage.getItem(SIFRE_OTURUM_ANAHTARI) === '1') { panelAcKapat(true); return; }
      var girilen = window.prompt('Bu bölüm yalnızca işletme sahibi/çalışanları içindir.\nŞifreyi yazın:');
      if (girilen === null) return;
      if (sifreDogruMu(girilen.trim())) {
        try { sessionStorage.setItem(SIFRE_OTURUM_ANAHTARI, '1'); } catch (e) {}
        panelAcKapat(true);
      } else {
        window.alert('Şifre yanlış.');
      }
    }

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      panelAcmayaCalis();
    });
    if (closeBtn) closeBtn.addEventListener('click', function () { panelAcKapat(false); });
    if (cancelBtn) cancelBtn.addEventListener('click', function () { panelAcKapat(false); formSifirla(); });

    /* Dosya Seçiciyi Açma: drop alanına, butona veya değiştir düğmesine basıldığında tetiklenir */
    function dosyaSeciciyiTetikle(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      fileInput.click();
    }

    dropZone.addEventListener('click', function (e) {
      if (e.target !== fileInput) {
        dosyaSeciciyiTetikle(e);
      }
    });
    dropZone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dosyaSeciciyiTetikle(e);
      }
    });

    if (selectBtn) selectBtn.addEventListener('click', dosyaSeciciyiTetikle);
    if (changeBtn) changeBtn.addEventListener('click', dosyaSeciciyiTetikle);

    /* Sürükle - Bırak (Drag and drop) desteği */
    dropZone.addEventListener('dragover', function (e) {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', function () {
      dropZone.classList.remove('drag-over');
    });
    dropZone.addEventListener('drop', function (e) {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        dosyaSecildi();
      }
    });

    function formatBoyut(bytes) {
      if (!bytes) return '';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    /* Kullanıcı dosya seçtiğinde çalışan fonksiyon: anında önizleme gösterir */
    function dosyaSecildi() {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;

      var isVid = /^video\//.test(file.type);
      var reader = new FileReader();

      reader.onload = function (ev) {
        var dataUrl = ev.target.result;
        seciliDosya = {
          file: file,
          dataUrl: dataUrl,
          isVid: isVid,
          name: file.name,
          size: file.size
        };

        thumbWrap.innerHTML = '';
        if (isVid) {
          var v = D.createElement('video');
          v.src = dataUrl;
          v.muted = true; v.playsInline = true; v.autoplay = true; v.loop = true;
          thumbWrap.appendChild(v);
        } else {
          var img = D.createElement('img');
          img.src = dataUrl;
          img.alt = file.name;
          thumbWrap.appendChild(img);
        }

        fileNameEl.textContent = file.name;
        fileSizeEl.textContent = (isVid ? 'Video' : 'Fotoğraf') + ' · ' + formatBoyut(file.size);

        promptWrap.hidden = true;
        previewWrap.hidden = false;
        msg.textContent = '';
        msg.className = 'frm-msg';

        /* Başlık boşsa dosya adından otomatik güzel bir yer tutucu öner */
        if (!baslikInput.value.trim()) {
          var temizAd = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
          if (temizAd.length > 2 && !/image|img|dsc|photo|chatgpt/i.test(temizAd)) {
            baslikInput.value = temizAd.charAt(0).toUpperCase() + temizAd.slice(1);
          }
        }
        baslikInput.focus();
      };

      reader.readAsDataURL(file);
    }

    fileInput.addEventListener('change', dosyaSecildi);

    function formSifirla() {
      form.reset();
      fileInput.value = '';
      seciliDosya = null;
      thumbWrap.innerHTML = '';
      promptWrap.hidden = false;
      previewWrap.hidden = true;
      msg.textContent = '';
      msg.className = 'frm-msg';
      if (catAcikId && turSelect) turSelect.value = catAcikId;
    }

    /* Supabase yükleme yardımcıları */
    function dosyaYukleSupabase(file) {
      if (!s || !s.url || !s.anonKey) return Promise.reject(new Error('Supabase bağlı değil'));
      var base = s.url.replace(/\/+$/, '');
      var guvenliAd = file.name.replace(/[^a-zA-Z0-9.]+/g, '-').slice(-60);
      var yol = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '-' + guvenliAd;
      return fetch(base + '/storage/v1/object/hikaye-medya/' + yol, {
        method: 'POST',
        headers: { apikey: s.anonKey, Authorization: 'Bearer ' + s.anonKey, 'Content-Type': file.type || 'application/octet-stream', 'x-au-key': sessionStorage.getItem(SIFRE_OTURUM_ANAHTARI) === '1' ? (C.dbYaziAnahtari || '') : '' },
        body: file
      }).then(function (r) {
        if (!r.ok) throw new Error('Dosya yüklenemedi (' + r.status + ')');
        return { url: base + '/storage/v1/object/public/hikaye-medya/' + yol, tip: /^video\//.test(file.type) ? 'video' : 'image' };
      });
    }
    function kayitYazSupabase(tur, baslik, medya) {
      if (!s || !s.url || !s.anonKey) return Promise.resolve();
      var base = s.url.replace(/\/+$/, '');
      return fetch(base + '/rest/v1/tur_medya', {
        method: 'POST',
        headers: { apikey: s.anonKey, Authorization: 'Bearer ' + s.anonKey, 'Content-Type': 'application/json', Prefer: 'return=minimal', 'x-au-key': sessionStorage.getItem(SIFRE_OTURUM_ANAHTARI) === '1' ? (C.dbYaziAnahtari || '') : '' },
        body: JSON.stringify({ tur: tur, baslik: baslik, medya_url: medya.url, medya_tip: medya.tip })
      });
    }

    /* Form Gönderimi */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var tur = (turSelect && turSelect.value) || catAcikId || 'baklava';
      var baslik = baslikInput.value.trim();

      if (!seciliDosya || !seciliDosya.dataUrl) {
        msg.textContent = 'Lütfen önce fotoğraf ve dosya seçme alanına basarak bir görsel seçin.';
        msg.className = 'frm-msg err';
        fileInput.click();
        return;
      }
      if (!baslik) {
        msg.textContent = 'Lütfen bu fotoğrafın adını / açıklamasını yazın.';
        msg.className = 'frm-msg err';
        baslikInput.focus();
        return;
      }

      submitBtn.disabled = true;
      msg.className = 'frm-msg';
      msg.innerHTML = '<span class="spin"></span>Fotoğraf ekleniyor…';

      var dataUrl = seciliDosya.dataUrl;
      var tip = seciliDosya.isVid ? 'video' : 'image';

      /* 1. Yerel hafızaya kaydet */
      var yeniItem = {
        id: 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        tur: tur,
        baslik: baslik,
        tip: tip,
        url: dataUrl,
        olusturma: new Date().toISOString()
      };
      yerelKayitEkle(yeniItem);

      /* 2. Vitrine (kategori ızgarasına) ekle */
      turKayitEkle(tur, baslik, tip, dataUrl, true);

      /* 3. Kategoriyi güncelle veya göster */
      if (catAcikId !== tur) {
        showCat(tur, false);
      } else {
        catCellsAll().forEach(function (cell) {
          if (cell.dataset.cat === tur) cell.hidden = false;
        });
        catTazele();
      }

      /* 4. Arka planda Supabase varsa aktar */
      if (s && s.url && s.anonKey && seciliDosya.file) {
        dosyaYukleSupabase(seciliDosya.file)
          .then(function (m) { return kayitYazSupabase(tur, baslik, m); })
          .catch(function (err) { console.warn('Supabase senkronizasyon:', err); });
      }

      /* 5. Başarı mesajı ve form temizliği */
      msg.textContent = '✓ Fotoğraf başarıyla eklendi ve vitrinde yayına alındı!';
      msg.className = 'frm-msg ok';

      setTimeout(function () {
        formSifirla();
        panelAcKapat(false);
        submitBtn.disabled = false;
      }, 1500);
    });
  })();

  /* --- Özel sipariş / kargo / iletişim kareleri --- */
  var OZ_META = [{ cap: 'Kalp biçiminde özel gün baklavası' }, { cap: 'Bayram sofrası — büyük tepsi' },
                 { cap: 'Çilekli özel tepsi' }];
  var ozelMedia = $('#ozelMedia');
  ozelMedia.appendChild(makeCell(merge(M.ozel.video, { cap: T('Bayramda da evlere servis') }), { cls: 'm-cell--tall' }));
  M.ozel.photos.forEach(function (p, i) { ozelMedia.appendChild(makeCell(merge(p, OZ_META[i]))); });

  var KG_META = [{ cap: 'Vitrinde "Soğuk Baklava" etiketi' }, { cap: 'Vitrin — günün seçkisi' }];
  var kargoMedia = $('#kargoMedia');
  M.kargo.forEach(function (p, i) { kargoMedia.appendChild(makeCell(merge(p, KG_META[i]))); });

  var CN_META = [{ cap: 'Aydınlatmalı vitrin' }, { cap: 'Tezgâhta günün tepsileri' }, { cap: 'Ürün — yakın plan' }];
  var conShots = $('#conShots');
  M.iletisim.forEach(function (p, i) { conShots.appendChild(makeCell(merge(p, CN_META[i]))); });

  /* --- kayan şerit --- */
  var STRIP = ['Koruyucu yok', 'Günlük üretim', '%100 doğal malzeme', 'Antep fıstığı',
               'Doğal pancar şekeri', 'Hijyenik üretim', 'Türkiye geneline kargo',
               'Nizip · Gaziantep', 'Baklava & Künefe'];
  var strip1 = $('#strip1');
  for (var s = 0; s < 3; s++) STRIP.forEach(function (t) { strip1.appendChild(el('span', null, T(t))); });

  /* ===============================================================
     3. CONFIG'DEN GELEN BÖLÜMLER
     =============================================================== */
  var izle;   // analitik bölümünde tanımlanır

  if (C.telefonLink) {
    var np = $('#navPhone');
    np.href = 'tel:' + C.telefonLink;
    np.querySelector('span').textContent = C.telefon || C.telefonLink;
  }
  var fab = $('#waFab');
  if (WA_OK) {
    fab.href = waLink('Merhaba, Ali Usta Baklavaları hakkında bilgi almak istiyorum.');
  } else {
    fab.href = 'tel:' + (C.telefonLink || '');
    $('.wa-fab-txt', fab).textContent = 'Ara';
    fab.removeAttribute('target');
  }

  /* --- Sosyal medya --- */
  var SOCIAL = [
    { k: 'instagram', ad: 'Instagram',
      /* Instagram'ın kendi kamera işareti + resmî degrade renkleri */
      grad: [['0%', '#FEDA75'], ['25%', '#FA7E1E'], ['50%', '#D62976'], ['75%', '#962FBF'], ['100%', '#4F5BD5']],
      svg: '<path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.17-.26 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.07.36-2.24.41-1.27.06-1.65.07-4.86.07s-3.59-.01-4.86-.07c-1.17-.06-1.82-.26-2.24-.42-.57-.22-.96-.48-1.38-.9-.42-.42-.69-.82-.9-1.38-.16-.42-.36-1.07-.42-2.24-.05-1.26-.06-1.65-.06-4.84s.01-3.59.06-4.86c.06-1.17.26-1.81.42-2.23.21-.57.48-.96.9-1.38.42-.42.81-.69 1.38-.9.42-.17 1.05-.36 2.22-.42C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.02 7.05.07 5.78.13 4.91.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.91.13 5.78.07 7.05.02 8.33 0 8.74 0 12s.02 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.77.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.02 4.95-.07c1.28-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.67-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.05-1.28.07-1.69.07-4.95s-.02-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.02 15.26 0 12 0z"/>'
         + '<path d="M12 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>'
         + '<circle cx="18.41" cy="5.59" r="1.44"/>' },
    { k: 'facebook', ad: 'Facebook',
      svg: '<path fill="currentColor" d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3h1.5V2.6c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.2H8.5v3h2.5V21h3v-9.5h2.5l.4-3H14z"/>' },
    { k: 'tiktok', ad: 'TikTok',
      svg: '<path fill="currentColor" d="M16.5 3c.4 2.1 1.8 3.6 3.9 3.8v2.6c-1.4.1-2.7-.3-3.9-1v6.2c0 4.4-4.4 6.9-8 4.7-2.4-1.4-3-4.7-1.4-7 1.4-2 3.7-2.6 5.7-2v2.9c-.9-.3-1.9-.1-2.5.7-.8 1-.5 2.6.8 3.1 1.3.5 2.6-.4 2.6-1.8V3h2.8z"/>' },
    { k: 'youtube', ad: 'YouTube',
      svg: '<path fill="currentColor" d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z"/>' },
    { k: 'whatsapp', ad: 'WhatsApp', wa: true, renk: '#25D366',
      /* WhatsApp'ın kendi telefon-baloncuk işareti, marka yeşiliyle */
      svg: '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.57-.34"/>'
         + '<path d="M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.22-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.16 6.44 6.6 2 12.05 2c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.9-9.88 9.9M20.46 3.5A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41"/>' }
  ];
  var socialLinks = SOCIAL.filter(function (x) {
    if (x.wa) return WA_OK;
    return C[x.k] && /^https?:\/\//.test(C[x.k]);
  });
  function socialHref(x) {
    return x.wa ? waLink('Merhaba, bilgi almak istiyorum.') : C[x.k];
  }
  /* Marka logoları kendi renkleriyle çizilir; degrade tanımının id'si her
     kopyada benzersiz olmalı, yoksa aynı sayfadaki ikinci logo boş kalır. */
  var socUid = 0;
  function paintSocial(node, cls) {
    if (!node) return;
    node.innerHTML = socialLinks.map(function (x) {
      var id = 'augr' + (++socUid);
      var defs = '', fill = x.renk || 'currentColor';
      if (x.grad) {
        defs = '<defs><linearGradient id="' + id + '" x1="0%" y1="100%" x2="100%" y2="0%">' +
          x.grad.map(function (st) { return '<stop offset="' + st[0] + '" stop-color="' + st[1] + '"/>'; }).join('') +
          '</linearGradient></defs>';
        fill = 'url(#' + id + ')';
      }
      return '<a class="' + cls + (x.wa ? ' soc--wa' : '') + (x.grad || x.renk ? ' soc--brand' : '') +
        '" href="' + esc(socialHref(x)) + '" target="_blank" rel="noopener me">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" fill="' + fill + '">' + defs + x.svg + '</svg>' +
        '<span class="sr-only">' + esc(x.ad) + '</span></a>';
    }).join('');
    node.hidden = socialLinks.length === 0;
  }
  paintSocial($('#navSocial'), 'soc soc--sm');
  paintSocial($('#footSocial'), 'soc');
  paintSocial($('#footSocial2'), 'soc');
  if (!socialLinks.length) {
    $('#footSocialNote').textContent =
      'Sosyal medya adresleri henüz iletilmedi. Adresi assets/js/config.js dosyasına yazdığınızda düğme kendiliğinden burada ve üst menüde görünür.';
  }

  /* --- Fiyat tablosu ---
     "Fiyatları düzenle" düğmesi: aynı şifre (config.js → catEkleSifreTers,
     "Türüne göre"/menü sayfasındaki şifreyle birebir aynı). Değişiklikler
     Supabase → menu_fiyat tablosuna 'price:<ürün>|kg' / '…|tepsi' /
     '…|detay' anahtarlarıyla yazılır, kurulduysa herkese anında yansır. */
  (function priceTable() {
    var t = $('#priceTable');
    if (!t) return;
    if (!C.fiyatlar || !C.fiyatlar.length) { var fs = $('#fiyat'); if (fs) fs.hidden = true; return; }

    var S = C.supabase, sbAcik = !!(S && S.url && S.anonKey), sbBase = sbAcik ? S.url.replace(/\/+$/, '') : '';
    function sbBaslik() { return { apikey: S.anonKey, Authorization: 'Bearer ' + S.anonKey }; }
    var PRICE_SESSION_KEY = 'AU_PANEL_DOGRULANDI';
    function fiyatKilitliMi() { return sessionStorage.getItem(PRICE_SESSION_KEY) !== '1'; }
    function fiyatSifreDogruMu(g) {
      var ters = (C.catEkleSifreTers || '').split('').reverse().join('');
      return !!ters && g === ters;
    }
    function sbYaziBaslik() {
      var h = sbBaslik();
      h['x-au-key'] = fiyatKilitliMi() ? '' : (C.dbYaziAnahtari || '');
      return h;
    }
    var FIYAT_OV_KEY = 'AU_PRICE_OV_V1';
    function fiyatOvAl() { try { return JSON.parse(localStorage.getItem(FIYAT_OV_KEY) || '{}'); } catch (e) { return {}; } }
    function fiyatOvKaydet(o) { try { localStorage.setItem(FIYAT_OV_KEY, JSON.stringify(o)); } catch (e) {} }
    function sbFiyatGonder(id, deger) {
      if (!sbAcik) return;
      fetch(sbBase + '/rest/v1/menu_fiyat', {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }, sbYaziBaslik()),
        body: JSON.stringify({ id: id, fiyat: deger })
      }).catch(function (err) { console.warn('Supabase (fiyat):', err); });
    }
    function sbFiyatCek(cb) {
      if (!sbAcik) return;
      fetch(sbBase + '/rest/v1/menu_fiyat?select=id,fiyat', { headers: sbBaslik() })
        .then(function (r) { return r.json(); })
        .then(function (rows) {
          if (!Array.isArray(rows)) return;
          var ov = {};
          rows.forEach(function (r) { if (r.id.indexOf('price:') === 0) ov[r.id] = r.fiyat; });
          fiyatOvKaydet(ov);
          cb();
        }).catch(function (err) { console.warn('Supabase (fiyat yükleme):', err); });
    }

    function ciz() {
      var ov = fiyatOvAl();
      var acik = !fiyatKilitliMi();
      t.innerHTML =
        '<thead><tr><th scope="col">' + esc(T('Ürün')) + '</th><th scope="col">' + esc(T('Kilo')) + '</th><th scope="col">' + esc(T('Tepsi')) + '</th></tr></thead>' +
        '<tbody>' + C.fiyatlar.map(function (r) {
          var idDetay = 'price:' + r.urun + '|detay', idKg = 'price:' + r.urun + '|kg', idTepsi = 'price:' + r.urun + '|tepsi';
          if (r.detay || r.porsiyon) {
            var detayGosterilen = ov[idDetay] || r.detay || (r.kg + ' · ' + (r.tepsi || r.tam));
            return '<tr><th scope="row">' + esc(r.urun) + '</th><td colspan="2" class="price-porsiyon">' + esc(detayGosterilen) +
              (acik ? ' <button class="price-edit-btn" type="button" data-price-edit="' + esc(idDetay) + '" title="Değiştir">✎</button>' : '') +
              '</td></tr>';
          }
          var kgGosterilen = ov[idKg] || r.kg || '-', tepsiGosterilen = ov[idTepsi] || r.tepsi || r.tam || '-';
          return '<tr><th scope="row">' + esc(r.urun) + '</th>' +
            '<td>' + esc(kgGosterilen) + (acik ? ' <button class="price-edit-btn" type="button" data-price-edit="' + esc(idKg) + '" title="Değiştir">✎</button>' : '') + '</td>' +
            '<td>' + esc(tepsiGosterilen) + (acik ? ' <button class="price-edit-btn" type="button" data-price-edit="' + esc(idTepsi) + '" title="Değiştir">✎</button>' : '') + '</td>' +
            '</tr>';
        }).join('') + '</tbody>';
    }
    ciz();
    sbFiyatCek(ciz);

    t.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-price-edit]');
      if (!btn) return;
      var id = btn.getAttribute('data-price-edit');
      var yeni = window.prompt('Yeni değer:', btn.previousSibling && btn.previousSibling.textContent ? btn.previousSibling.textContent.trim() : '');
      if (yeni === null) return;
      yeni = yeni.trim();
      if (!yeni) return;
      var ov = fiyatOvAl();
      ov[id] = yeni;
      fiyatOvKaydet(ov);
      ciz();
      sbFiyatGonder(id, yeni);
    });

    var toggle = $('#priceAdminToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        if (!fiyatKilitliMi()) { ciz(); return; }
        var girilen = window.prompt('Bu bölüm yalnızca işletme sahibi/çalışanları içindir.\nŞifreyi yazın:');
        if (girilen === null) return;
        if (fiyatSifreDogruMu(girilen.trim())) {
          try { sessionStorage.setItem(PRICE_SESSION_KEY, '1'); } catch (e) {}
          ciz();
        } else {
          window.alert('Şifre yanlış.');
        }
      });
    }

    var gg = $('#gramGrid');
    if (gg) {
      if (C.gramajlar && C.gramajlar.length) {
        gg.innerHTML = C.gramajlar.map(function (x) {
          return '<div class="gram"><b>' + esc(x.olcu) + '</b><span>' + esc(x.gram) + '</span><span class="gram-kisi">' + esc(x.kisi) + '</span></div>';
        }).join('') +
        (C.kargoUcreti ? '<div class="gram gram--acc"><b>' + esc(T('Kargo')) + '</b><span>' + esc(C.kargoUcreti) + '</span><span class="gram-kisi">' + esc(C.kargoSure || '') + '</span></div>' : '');
      } else {
        gg.remove();
      }
    }

    var fn = $('#fiyatNot');
    if (fn) {
      var not = [];
      if (C.fiyatNotu) not.push(C.fiyatNotu);
      if (C.fiyatBirimNotu) not.push(C.fiyatBirimNotu);
      if (C.fiyatGuncelleme) not.push('Son güncelleme: ' + C.fiyatGuncelleme + '.');
      if (not.length) {
        fn.textContent = not.join(' ');
      } else {
        fn.remove();
      }
    }

    var onayli = (C.fiyatDurum === 'onayli') || C.fiyatlarOnayli === true;
    var u = $('#fiyatUyari');
    if (u) {
      if (!onayli) {
        u.hidden = false;
        u.innerHTML = '<strong>' + esc(T('Not:')) + '</strong><span>' +
          esc(T('Aşağıdaki fiyatlar piyasa ortalamasına göre hazırlanmış tahmini değerlerdir; işletmeden henüz teyit edilmedi. Sipariş vermeden önce WhatsApp\'tan güncel fiyatı sorun.')) +
          '</span>';
        t.classList.add('price--ph');
      } else {
        u.hidden = true;
      }
    }
  })();

  /* --- Yorumlar --- */
  function yorumlar() {
    var box = $('#revs'), note = $('#revNote');
    var list = C.yorumlar || [];
    if (list.length) {
      box.innerHTML = list.slice(0, 9).map(function (y) {
        var p = Math.max(1, Math.min(5, y.puan || 5));
        return '<blockquote class="rev rv">' +
          '<p class="rev-stars" aria-label="' + p + ' / 5">' + '★★★★★'.slice(0, p) + '</p>' +
          '<q>' + esc(y.metin) + '</q>' +
          '<footer>' + esc(y.ad) + (y.tarih ? ' · <time datetime="' + esc(y.tarih) + '">' + esc(y.tarih) + '</time>' : '') + '</footer>' +
          '</blockquote>';
      }).join('');
      var ld = D.getElementById('ldRev') || D.createElement('script');
      ld.id = 'ldRev';
      ld.type = 'application/ld+json';
      ld.textContent = JSON.stringify(list.slice(0, 9).map(function (y) {
        return {
          '@context': 'https://schema.org', '@type': 'Review',
          itemReviewed: { '@type': 'Bakery', name: C.isim || 'Ali Usta Baklavaları', '@id': '#aliusta-nizip' },
          author: { '@type': 'Person', name: y.ad },
          reviewRating: { '@type': 'Rating', ratingValue: String(y.puan || 5), bestRating: '5', worstRating: '1' },
          reviewBody: y.metin,
          datePublished: y.tarih || undefined
        };
      }));
      D.head.appendChild(ld);
    } else {
      /* Yorum METNİ yoksa uydurma alıntı gösterilmez. Onun yerine
         doğrulanabilir değerlendirme verisi kaynağıyla birlikte verilir. */
      var kaynaklar = C.degerlendirmeler || [];
      var one = C.oneCikan || {};
      var html = kaynaklar.map(function (k) {
        var p = Math.round(k.puan);
        return '<article class="rev rev--src rv">' +
          '<p class="rev-src-head"><span class="rev-src-ad">' + esc(k.kaynak) + '</span>' +
            '<span class="rev-stars" aria-hidden="true">' + '★★★★★'.slice(0, p) +
            '<i>' + '★★★★★'.slice(0, 5 - p) + '</i></span></p>' +
          '<p class="rev-src-puan"><b>' + String(k.puan).replace('.', ',') + '</b>' +
            '<span> / 5</span></p>' +
          '<p class="rev-src-adet">' + k.adet + ' ' + esc(T('değerlendirme')) + '</p>' +
          (k.not ? '<p class="rev-src-not">' + esc(k.not) + '</p>' : '') +
          (k.link ? '<a class="rev-src-link" href="' + esc(k.link) + '" target="_blank" rel="noopener">' +
            esc(T('Kaynağı gör')) + ' →</a>' : '') +
          '</article>';
      }).join('');

      if ((one.urunler || []).length) {
        html += '<article class="rev rev--one rv">' +
          '<p class="rev-src-head"><span class="rev-src-ad">' + esc(T('En çok önerilenler')) + '</span></p>' +
          '<ul class="rev-one-list">' + one.urunler.map(function (u) {
            return '<li>' + esc(u) + '</li>'; }).join('') + '</ul>' +
          (one.kisiBasi ? '<p class="rev-src-not">' + esc(T('Kişi başı harcama')) + ': <b>' + esc(one.kisiBasi) + '</b></p>' : '') +
          (one.kaynak ? '<p class="rev-src-adet">' + esc(one.kaynak) + '</p>' : '') +
          '</article>';
      }
      box.innerHTML = html;
      /* Uyarı kutusu kaldırıldı: gösterilen her sayı zaten gerçek ve kaynaklı. */
      note.hidden = true;
    }
  }
  yorumlar();

  /* --- İletişim --- */
  (function iletisim() {
    function row(dt, dd, sub) {
      return '<div><dt>' + esc(dt) + '</dt><dd>' + dd + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</dd></div>';
    }
    var h = '';
    h += row(T('Adres'), '<a href="' + esc(C.haritaLink) + '" target="_blank" rel="noopener">' + esc(C.adres) + '</a>', C.adresAlt);
    h += row(T('Telefon'), '<a href="tel:' + esc(C.telefonLink) + '">' + esc(C.telefon) + '</a>');
    if (WA_OK) h += row('WhatsApp', '<a href="' + esc(waLink('Merhaba, bilgi almak istiyorum.')) + '" target="_blank" rel="noopener">' + esc(C.whatsappGorunen || C.whatsapp) + '</a>', T('Sipariş ve rezervasyon bu hattan alınır.'));
    if (C.eposta) h += row(T('E-posta'), '<a href="mailto:' + esc(C.eposta) + '">' + esc(C.eposta) + '</a>');
    h += row(T('Saatler'), esc(C.saatler), C.saatlerNot);
    h += row(T('Oturma'), esc(T('Açık hava oturma bölümü')), T('Baklavanızı burada, çayla birlikte yiyebilirsiniz. Rezervasyon alınır.'));
    $('#conDl').innerHTML = h;

    $('#conActions').innerHTML =
      '<a class="btn btn--lg btn--wa js-mag" href="' + esc(waLink('Merhaba, bilgi almak istiyorum.')) + '"' + (WA_OK ? ' target="_blank" rel="noopener"' : '') + '><span>' + esc(T('WhatsApp\'tan yaz')) + '</span></a>' +
      '<a class="btn btn--lg js-mag" href="tel:' + esc(C.telefonLink) + '"><span>' + esc(T('Hemen ara')) + '</span></a>' +
      '<a class="btn btn--lg js-mag" href="' + esc(C.haritaLink) + '" target="_blank" rel="noopener"><span>' + esc(T('Yol tarifi al')) + '</span></a>';

    $('#mapOpen').href = C.haritaLink;

    /* WhatsApp ve Instagram: kendi marka işaretleri, kendi renkleriyle */
    var IC_WA = '<svg class="li-ic li-ic--brand" viewBox="0 0 24 24" aria-hidden="true" style="fill:#25D366">'
      + '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.57-.34"/>'
      + '<path d="M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.22-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.16 6.44 6.6 2 12.05 2c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.9-9.88 9.9M20.46 3.5A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41"/></svg>';
    var IC_IG = '<svg class="li-ic li-ic--brand" viewBox="0 0 24 24" aria-hidden="true" style="fill:url(#auIgGrad)">'
      + '<defs><linearGradient id="auIgGrad" x1="0%" y1="100%" x2="100%" y2="0%">'
      + '<stop offset="0%" stop-color="#FEDA75"/><stop offset="25%" stop-color="#FA7E1E"/>'
      + '<stop offset="50%" stop-color="#D62976"/><stop offset="75%" stop-color="#962FBF"/>'
      + '<stop offset="100%" stop-color="#4F5BD5"/></linearGradient></defs>'
      + '<path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.17-.26 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.07.36-2.24.41-1.27.06-1.65.07-4.86.07s-3.59-.01-4.86-.07c-1.17-.06-1.82-.26-2.24-.42-.57-.22-.96-.48-1.38-.9-.42-.42-.69-.82-.9-1.38-.16-.42-.36-1.07-.42-2.24-.05-1.26-.06-1.65-.06-4.84s.01-3.59.06-4.86c.06-1.17.26-1.81.42-2.23.21-.57.48-.96.9-1.38.42-.42.81-.69 1.38-.9.42-.17 1.05-.36 2.22-.42C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.02 7.05.07 5.78.13 4.91.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.91.13 5.78.07 7.05.02 8.33 0 8.74 0 12s.02 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.77.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.02 4.95-.07c1.28-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.67-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.05-1.28.07-1.69.07-4.95s-.02-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.02 15.26 0 12 0z"/>'
      + '<path d="M12 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>'
      + '<circle cx="18.41" cy="5.59" r="1.44"/></svg>';
    var IC_PIN = '<svg class="li-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" stroke-width="1.9"/></svg>';
    var IC_TEL = '<svg class="li-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h3l1.5 3.7-2 1.4a12 12 0 0 0 6.3 6.3l1.4-2 3.7 1.5v3a1.6 1.6 0 0 1-1.7 1.6C10.6 18.4 5.6 13.4 5 5.2a1.6 1.6 0 0 1 1.6-1.7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';

    $('#footContact').innerHTML =
      '<h3>' + esc(T('İletişim')) + '</h3><p class="small">' + esc(C.adres) + '<br>' + esc(C.adresAlt) + '</p>' +
      '<ul class="li-list" style="margin-top:.9rem">' +
        '<li><a href="tel:' + esc(C.telefonLink) + '">' + IC_TEL + '<span>' + esc(C.telefon) + '</span></a></li>' +
        (WA_OK ? '<li><a class="li-wa" href="' + esc(waLink('Merhaba!')) + '" target="_blank" rel="noopener">' + IC_WA + '<span>' + esc(C.whatsappGorunen || 'WhatsApp') + '</span></a></li>' : '') +
        (C.instagram ? '<li><a class="li-ig" href="' + esc(C.instagram) + '" target="_blank" rel="noopener me">' + IC_IG + '<span>Instagram</span></a></li>' : '') +
        '<li><a href="' + esc(C.haritaLink) + '" target="_blank" rel="noopener">' + IC_PIN + '<span>' + esc(T('Haritada göster')) + '</span></a></li>' +
      '</ul>';

    var kn = [];
    if (C.kargoUcreti) kn.push(T('Kargo ücreti:') + ' ' + C.kargoUcreti + '.');
    kn.push(T('Teslim süresi') + ' ' + (C.kargoSure || T('1–3 iş günü')) + '.');
    if (!C.kargoUcreti) kn.push(T('Güncel kargo ücreti ve minimum sipariş tutarı için WhatsApp\'tan yazın.'));
    $('#kargoNot').textContent = kn.join(' ');
  })();

  /* --- Mevsimsel şerit --- */
  (function mevsim() {
    var list = C.mevsimler || [];
    if (!list.length) return;
    var dt = new Date(), bugun = pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
    function icinde(a, b) { return a <= b ? (bugun >= a && bugun <= b) : (bugun >= a || bugun <= b); }
    var m = list.filter(function (x) { return icinde(x.basla, x.bitir); })[0];
    if (!m) return;
    var n = $('#season');
    n.hidden = false;
    D.body.classList.add('has-season');
    n.innerHTML = '<div class="season-in">' +
      '<span class="season-dot" aria-hidden="true"></span><b>' + esc(m.baslik) + '</b>' +
      '<span class="season-msg">' + esc(m.mesaj) + '</span>' +
      '<a class="season-cta" href="' + esc(waLink('Merhaba, ' + m.baslik.toLowerCase() + ' hakkında bilgi almak istiyorum.')) + '"' +
        (WA_OK ? ' target="_blank" rel="noopener"' : '') + '>' + esc(T('Sipariş ver →')) + '</a>' +
      '<button class="season-x" type="button" aria-label="' + esc(T('Duyuruyu kapat')) + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
    $('.season-x', n).addEventListener('click', function () {
      n.hidden = true;
      D.body.classList.remove('has-season');
      if (W.ScrollTrigger) W.ScrollTrigger.refresh();
    });
  })();

  /* --- Toplu sipariş bilgisi --- */
  (function toplu() {
    var t = C.toplu || {};
    $('#corpFacts').innerHTML =
      '<div class="corp-fact corp-fact--wide"><b>' + esc(T(t.baslik || 'Miktar sınırı yok')) + '</b><span>' + esc(T('1 kilodan 30 tepsiye')) + '</span></div>' +
      '<div class="corp-fact"><b>' + (t.hazirlikGun || 2) + ' ' + esc(T('gün')) + '</b><span>' + esc(T('Kalabalık sipariş hazırlığı')) + '</span></div>' +
      '<div class="corp-fact"><b>81 ' + esc(T('il')) + '</b><span>' + esc(T('Kargo kapsamı')) + '</span></div>' +
      '<div class="corp-note"><p>' + esc(T(t.metin || '')) + '</p>' +
      (t.referanslar && t.referanslar.length
        ? '<p class="corp-ref"><b>' + esc(T('Çalıştığımız kurumlar:')) + '</b> ' + t.referanslar.map(esc).join(' · ') + '</p>' : '') + '</div>';
  })();

  /* ===============================================================
     4. SEKMELER
     =============================================================== */
  var TABS = [
    { id: 'order', tab: $('#tab-order'), panel: $('#panel-order') },
    { id: 'rez',   tab: $('#tab-rez'),   panel: $('#panel-rez') },
    { id: 'corp',  tab: $('#tab-corp'),  panel: $('#panel-corp') }
  ];
  function setTab(id, odak) {
    TABS.forEach(function (t) {
      var on = t.id === id;
      t.tab.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tab.tabIndex = on ? 0 : -1;
      t.panel.hidden = !on;
    });
    if (odak) TABS.filter(function (t) { return t.id === id; })[0].tab.focus();
    if (W.ScrollTrigger) setTimeout(function () { W.ScrollTrigger.refresh(); }, 300);
  }
  function gotoTab(id) {
    setTab(id, false);
    var y = $('#siparis').getBoundingClientRect().top + W.scrollY - 70;
    if (lenis && !motionOff) lenis.scrollTo(y, { duration: 1.1 }); else W.scrollTo(0, y);
  }
  TABS.forEach(function (t, i) {
    t.tab.addEventListener('click', function () { setTab(t.id, false); });
    t.tab.addEventListener('keydown', function (e) {
      var j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % TABS.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + TABS.length) % TABS.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = TABS.length - 1;
      if (j !== null) { e.preventDefault(); setTab(TABS[j].id, true); }
    });
  });
  $('#heroWa').addEventListener('click', function (e) { e.preventDefault(); gotoTab('order'); });
  $('#ozelWa').addEventListener('click', function (e) { e.preventDefault(); gotoTab('corp'); });

  /* ===============================================================
     5. FORMLAR → WhatsApp
     =============================================================== */
  var urunSelect = $('#o-urun');
  (M.rail || []).forEach(function (p) { urunSelect.appendChild(new Option(p.name, p.name)); });
  ['Künefe', 'Fıstık Ezmesi', 'Güllaç', 'Karışık — birlikte belirleyelim'].forEach(function (x) {
    urunSelect.appendChild(new Option(T(x), x));
  });

  $('#o-teslim').addEventListener('change', function () {
    var kargo = this.value === 'Kargo';
    $('#o-adres-wrap').hidden = !kargo;
    $('#o-adres').required = kargo;
  });

  (function formSinirlar() {
    var t = new Date();
    t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
    var iso = t.toISOString().slice(0, 10);
    ['#r-tarih', '#o-tarih', '#c-tarih'].forEach(function (s) { $(s).min = iso; });
    var r = C.rezervasyon || {};
    if (r.minKisi) $('#r-kisi').min = r.minKisi;
    if (r.maxKisi) $('#r-kisi').max = r.maxKisi;
    if (r.enErkenSaat) $('#r-saat').min = r.enErkenSaat;
    if (r.enGecSaat) $('#r-saat').max = r.enGecSaat;
    $('#rezNot').textContent = r.not || '';
    if (r.acik === false) {
      $('#tab-rez').disabled = true;
      $('#panel-rez').innerHTML = '<p class="lede">Rezervasyon şu anda kapalı. Bilgi için telefonla arayın.</p>';
    }
  })();

  function telGecerli(v) { return (v || '').replace(/\D/g, '').length >= 10; }
  function hataGoster(alan, mesaj) {
    var f = alan.closest('.f');
    f.classList.add('has-err');
    var e = $('.err', f);
    if (!e) { e = el('span', 'err'); f.appendChild(e); }
    e.textContent = mesaj;
    alan.setAttribute('aria-invalid', 'true');
  }
  function hatalariTemizle(form) {
    $$('.f.has-err', form).forEach(function (f) {
      f.classList.remove('has-err');
      var e = $('.err', f); if (e) e.remove();
      var i = $('input,select,textarea', f); if (i) i.removeAttribute('aria-invalid');
    });
  }
  function dogrula(form) {
    hatalariTemizle(form);
    var ilk = null;
    $$('[required]', form).forEach(function (a) {
      if (a.closest('[hidden]')) return;
      var v = (a.value || '').trim();
      if (!v) { hataGoster(a, T('Bu alan gerekli.')); ilk = ilk || a; return; }
      if (a.type === 'tel' && !telGecerli(v)) { hataGoster(a, T('Telefon numarasını eksiksiz yazın.')); ilk = ilk || a; }
    });
    if (ilk) { ilk.focus(); return false; }
    return true;
  }
  function web3Gonder(konu, metin) {
    if (!C.web3formsKey) return;
    try {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: C.web3formsKey, subject: konu, from_name: C.isim || 'Web sitesi', message: metin })
      });
    } catch (e) {}
  }
  function formGonder(form, konu, metinUret) {
    if (!dogrula(form)) return;
    var metin = metinUret();
    web3Gonder(konu, metin);
    waAc(metin);
    var msg = $('.frm-msg', form);
    msg.textContent = WA_OK ? T('WhatsApp yeni sekmede açıldı. Mesajı göndermeyi unutmayın.') : T('Telefon uygulaması açıldı.');
    msg.classList.add('ok');
    if (izle) izle(konu);
  }
  function d(id) { return ($(id).value || '').trim(); }
  function trTarih(v) { var p = (v || '').split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : (v || '—'); }

  $('#formOrder').addEventListener('submit', function (e) {
    e.preventDefault();
    formGonder(this, 'Web sitesi — sipariş', function () {
      var kargo = d('#o-teslim') === 'Kargo';
      return ['*Ali Usta — Sipariş*',
        'Ad Soyad: ' + d('#o-ad'), 'Telefon: ' + d('#o-tel'),
        'Ürün: ' + d('#o-urun'), 'Miktar: ' + d('#o-miktar'),
        'Teslim: ' + d('#o-teslim'), 'Tarih: ' + trTarih(d('#o-tarih')),
        kargo ? 'Adres: ' + d('#o-adres') : null,
        d('#o-not') ? 'Not: ' + d('#o-not') : null].filter(Boolean).join('\n');
    });
  });
  $('#formRez').addEventListener('submit', function (e) {
    e.preventDefault();
    formGonder(this, 'Web sitesi — rezervasyon', function () {
      return ['*Ali Usta — Rezervasyon*',
        'Ad Soyad: ' + d('#r-ad'), 'Telefon: ' + d('#r-tel'),
        'Tarih: ' + trTarih(d('#r-tarih')), 'Saat: ' + d('#r-saat'),
        'Kişi: ' + d('#r-kisi'), 'Bölüm: ' + d('#r-bolum'),
        d('#r-not') ? 'Not: ' + d('#r-not') : null].filter(Boolean).join('\n');
    });
  });
  $('#formCorp').addEventListener('submit', function (e) {
    e.preventDefault();
    formGonder(this, 'Web sitesi — toplu sipariş', function () {
      return ['*Ali Usta — Toplu / kurumsal teklif*',
        d('#c-firma') ? 'Firma: ' + d('#c-firma') : null,
        'Yetkili: ' + d('#c-ad'), 'Telefon: ' + d('#c-tel'),
        'Tür: ' + d('#c-tur'), 'Miktar: ' + d('#c-adet'),
        'Tarih: ' + trTarih(d('#c-tarih')),
        d('#c-not') ? 'Detay: ' + d('#c-not') : null].filter(Boolean).join('\n');
    });
  });

  /* ===============================================================
     6. ÜRÜN: sor + detay paneli
     =============================================================== */
  var pd = $('#pd'), pdSonOdak = null;
  function urunKayit(ad) { return (M.rail || []).filter(function (x) { return x.name === ad; })[0]; }

  function pdAc(ad) {
    var det = (C.urunDetay || {})[ad], r = urunKayit(ad);
    pdSonOdak = D.activeElement;
    $('#pdTitle').textContent = ad;
    $('#pdDesc').textContent = r ? r.desc : '';
    var img = $('#pdImg'), media = $('.pd-media');
    if (r) {
      img.src = TAM(r.photos[0].k); img.width = r.photos[0].w; img.height = r.photos[0].h;
      img.alt = ad + T(' — yakın çekim');
      media.hidden = false;
    } else media.hidden = true;

    $('#pdDl').innerHTML = det
      ? '<div><dt>' + esc(T('İçindekiler')) + '</dt><dd>' + esc(det.icindekiler) + '</dd></div>' +
        '<div><dt>' + esc(T('Alerjen')) + '</dt><dd>' + (det.alerjen || []).map(function (a) { return '<span class="alrg">' + esc(a) + '</span>'; }).join(' ') + '</dd></div>' +
        '<div><dt>' + esc(T('Saklama')) + '</dt><dd>' + esc(det.saklama) + '</dd></div>' +
        '<div><dt>' + esc(T('Raf ömrü')) + '</dt><dd>' + esc(det.raf) + '</dd></div>' +
        '<div><dt>' + esc(T('Porsiyon')) + '</dt><dd>' + esc(det.porsiyon) + '</dd></div>'
      : '<div><dt>' + esc(T('Bilgi')) + '</dt><dd>' + esc(T('Bu ürün için detaylı içerik bilgisi henüz eklenmedi. WhatsApp\'tan sorabilirsiniz.')) + '</dd></div>';

    var wa = $('#pdWa');
    wa.href = waLink('Merhaba, *' + ad + '* hakkında bilgi ve fiyat almak istiyorum.');
    if (!WA_OK) wa.removeAttribute('target');

    pd.classList.add('open');
    pd.setAttribute('aria-hidden', 'false');
    D.body.classList.add('is-locked');
    if (lenis) lenis.stop();
    W.requestAnimationFrame(function () { $('#pdClose').focus(); });
    if (izle) izle('urun-detay');
  }
  function pdKapat() {
    pd.classList.remove('open');
    pd.setAttribute('aria-hidden', 'true');
    D.body.classList.remove('is-locked');
    if (lenis && !motionOff) lenis.start();
    odakGeri(pdSonOdak, pd);
  }
  $('#pdClose').addEventListener('click', pdKapat);
  pd.addEventListener('click', function (e) { if (e.target === pd) pdKapat(); });

  D.addEventListener('click', function (e) {
    var ask = e.target.closest('[data-ask]');
    if (ask) {
      e.preventDefault(); e.stopPropagation();
      waAc('Merhaba, *' + ask.dataset.ask + '* fiyatı nedir? Sipariş vermek istiyorum.');
      if (izle) izle('urun-sor');
      return;
    }
    var det = e.target.closest('[data-detail]');
    if (det) { e.preventDefault(); e.stopPropagation(); pdAc(det.dataset.detail); }
  });


  /* ===============================================================
     6b. YORUM PANELİ — tüm yorumlar + ziyaretçi yorumu
     Statik sitede sunucu yok; gelen yorum işletmenin WhatsApp hattına
     düşer, onaylandıktan sonra config.js → yorumlar[] listesine eklenir.
     =============================================================== */
  var rvBox = $('#rv'), rvSonOdak = null;

  function yildizHTML(p) {
    p = Math.max(1, Math.min(5, p || 5));
    return '<span class="rv-stars" aria-label="' + p + ' / 5">' +
      '★★★★★'.slice(0, p) + '<i>' + '★★★★★'.slice(0, 5 - p) + '</i></span>';
  }

  function rvDoldur() {
    var list = C.yorumlar || [];
    var toplam = list.length;
    var ort = toplam ? (list.reduce(function (a, y) { return a + (y.puan || 5); }, 0) / toplam) : 0;

    $('#rvSummary').innerHTML =
      '<div class="rv-sum-a"><b>' + String(C.googlePuan || 4.5).replace('.', ',') + '</b>' +
        yildizHTML(Math.round(C.googlePuan || 5)) +
        '<span>' + (C.googleAdet || 0) + ' ' + esc(T('Google değerlendirmesi')) + '</span></div>' +
      (toplam
        ? '<div class="rv-sum-b"><b>' + toplam + '</b><span>' + esc(T('sitede yayınlanan yorum')) +
          '</span><small>' + esc(T('Ortalama')) + ' ' + ort.toFixed(1).replace('.', ',') + ' / 5</small></div>'
        : '');

    var box = $('#rvList'), bos = $('#rvEmpty');
    if (!toplam) {
      box.innerHTML = '';
      bos.hidden = false;
      bos.innerHTML = esc(T('Yorum metinleri henüz siteye aktarılmadı.')) + ' ' +
        esc(T('Google’daki 117 ve Restaurant Guru’daki 116 değerlendirmenin puanları yukarıda; metinleri ise yalnızca o servislerin kendi sayfalarında görünüyor.')) +
        ' <strong>' + esc(T('İlk yorumu siz yazabilirsiniz.')) + '</strong>' +
        (C.haritaLink ? ' <a class="rv-src-link" href="' + esc(C.haritaLink) + '" target="_blank" rel="noopener">' +
          esc(T('Google’daki gerçek yorumları görün')) + ' →</a>' : '');
      return;
    }
    bos.hidden = true;
    box.innerHTML = list.map(function (y) {
      var bas = (y.ad || '?').trim().charAt(0).toUpperCase();
      return '<article class="rv-item">' +
        '<span class="rv-av" aria-hidden="true">' + esc(bas) + '</span>' +
        '<div class="rv-main">' +
          '<header><b>' + esc(y.ad) + '</b>' + yildizHTML(y.puan) +
            (y.tarih ? '<time datetime="' + esc(y.tarih) + '">' + esc(y.tarih) + '</time>' : '') +
          '</header>' +
          '<p>' + esc(y.metin) + '</p>' +
        '</div></article>';
    }).join('');
  }

  /* yıldız seçici */
  (function rvYildiz() {
    var kap = $('#rvRate'), gizli = $('#rv-puan'), txt = $('#rvRateTxt');
    var ETIKET = ['Çok kötü', 'Kötü', 'İdare eder', 'İyi', 'Mükemmel'];
    var secili = 0;

    function ciz(vurgu) {
      $$('.rv-star', kap).forEach(function (b, i) {
        var on = i < (vurgu || secili);
        b.classList.toggle('on', on);
        b.setAttribute('aria-checked', (i + 1) === secili ? 'true' : 'false');
      });
      txt.textContent = secili ? (secili + ' / 5 — ' + T(ETIKET[secili - 1])) : T('Yıldızlara dokunun');
    }
    for (var i = 1; i <= 5; i++) {
      var b = D.createElement('button');
      b.type = 'button';
      b.className = 'rv-star';
      b.dataset.v = i;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', 'false');
      b.setAttribute('aria-label', i + ' / 5 — ' + T(ETIKET[i - 1]));
      b.innerHTML = '<span aria-hidden="true">★</span>';
      kap.appendChild(b);
    }
    kap.addEventListener('click', function (e) {
      var b = e.target.closest('.rv-star');
      if (!b) return;
      secili = parseInt(b.dataset.v, 10);
      gizli.value = secili;
      ciz();
    });
    kap.addEventListener('pointerover', function (e) {
      var b = e.target.closest('.rv-star');
      if (b) ciz(parseInt(b.dataset.v, 10));
    });
    kap.addEventListener('pointerleave', function () { ciz(); });
    kap.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1
            : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      secili = Math.max(1, Math.min(5, secili + d));
      gizli.value = secili;
      ciz();
      $$('.rv-star', kap)[secili - 1].focus();
    });
    ciz();
  })();

  /* panel sekmeleri */
  var RVT = [
    { t: $('#rvTabList'), p: $('#rvPanelList') },
    { t: $('#rvTabForm'), p: $('#rvPanelForm') }
  ];
  function rvSekme(i, odak) {
    RVT.forEach(function (x, j) {
      var on = i === j;
      x.t.setAttribute('aria-selected', on ? 'true' : 'false');
      x.t.tabIndex = on ? 0 : -1;
      x.p.hidden = !on;
    });
    if (odak) RVT[i].t.focus();
  }
  RVT.forEach(function (x, i) {
    x.t.addEventListener('click', function () { rvSekme(i, false); });
    x.t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); rvSekme((i + 1) % 2, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); rvSekme((i + 1) % 2, true); }
    });
  });

  function rvAc(sekme) {
    rvDoldur();
    rvSekme(sekme || 0, false);
    rvSonOdak = D.activeElement;
    rvBox.classList.add('open');
    rvBox.setAttribute('aria-hidden', 'false');
    D.body.classList.add('is-locked');
    if (lenis) lenis.stop();
    W.requestAnimationFrame(function () { $('#rvClose').focus(); });
    if (izle) izle('yorum-paneli');
  }
  function rvKapat() {
    rvBox.classList.remove('open');
    rvBox.setAttribute('aria-hidden', 'true');
    D.body.classList.remove('is-locked');
    if (lenis && !motionOff) lenis.start();
    odakGeri(rvSonOdak, rvBox);
  }
  $('#revAll').addEventListener('click', function () { rvAc(0); });
  $('#revWrite').addEventListener('click', function () { rvAc(1); });
  /* extras.js Google / Supabase yorumlarını çektiğinde bunu çağırır */
  W.__auYorumTazele = function () {
    yorumlar();
    if (rvBox.classList.contains('open')) rvDoldur();
    if (W.ScrollTrigger) W.ScrollTrigger.refresh();
  };

  $('#rvClose').addEventListener('click', rvKapat);
  rvBox.addEventListener('click', function (e) { if (e.target === rvBox) rvKapat(); });

  $('#formRev').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = this;
    if (!$('#rv-puan').value) {
      var f = $('#rvRate').closest('.f');
      f.classList.add('has-err');
      var er = $('.err', f);
      if (!er) { er = el('span', 'err'); f.appendChild(er); }
      er.textContent = T('Lütfen bir puan seçin.');
      $$('.rv-star')[0].focus();
      return;
    }
    $('#rvRate').closest('.f').classList.remove('has-err');
    formGonder(form, 'Web sitesi — müşteri yorumu', function () {
      return ['*Ali Usta — Müşteri yorumu*',
        'Puan: ' + d('#rv-puan') + '/5',
        'Ad: ' + d('#rv-ad'),
        d('#rv-tel') ? 'Telefon: ' + d('#rv-tel') : null,
        'Yorum: ' + d('#rv-metin')].filter(Boolean).join('\n');
    });
    /* Supabase kuruluysa yorum oraya da yazılır (extras.js dinler) */
    W.dispatchEvent(new CustomEvent('au:yorum', { detail: {
      ad: d('#rv-ad'), puan: parseInt(d('#rv-puan'), 10) || 5,
      metin: d('#rv-metin'), tarih: new Date().toISOString().slice(0, 10)
    } }));

    var msg = $('.frm-msg', form);
    msg.textContent = T('Teşekkürler! Yorumunuz WhatsApp’ta açıldı — göndermeyi unutmayın. Onaylandıktan sonra bu sayfada yayınlanacak.');
    msg.classList.add('ok');
  });

  /* ===============================================================
     7. VİDEO YÖNETİMİ
     =============================================================== */
  var allVideos = [], heroVideo = $('#heroVideo');
  function attach(v) { if (v === heroVideo || !v.dataset.src || v.src) return; v.src = v.dataset.src; }
  function tryPlay(v) { if (motionOff) return; attach(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function forcePlay(v) { attach(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); }

  var vObs = 'IntersectionObserver' in W ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { if (v.dataset.userPaused === '1') { attach(v); return; } tryPlay(v); }
      else if (!v.paused) v.pause();
    });
  }, { rootMargin: '160px 0px', threshold: 0.15 }) : null;

  function registerVideos() {
    $$('video').forEach(function (v) {
      if (allVideos.indexOf(v) > -1) return;
      allVideos.push(v);
      if (vObs) vObs.observe(v); else attach(v);
    });
  }
  registerVideos();

  function startHero() { if (!motionOff) tryPlay(heroVideo); }
  if (D.readyState === 'complete') setTimeout(startHero, 60);
  else W.addEventListener('load', function () { (W.requestIdleCallback || function (f) { setTimeout(f, 150); })(startHero); });

  /* Tezgâh videolarında ses: tarayıcı sessiz başlamayı zorunlu kılıyor,
     bu yüzden her karoda ayrı bir ses düğmesi var. Aynı anda tek video
     sesli çalar — yenisi açılınca öteki susar. */
  function sesKapatHepsi(haric) {
    $$('#tezgahGrid video').forEach(function (v) {
      if (v === haric) return;
      v.muted = true;
      var b = $('.uv-sound', v.parentNode.parentNode) || $('.uv-sound', v.parentNode);
      if (b) b.setAttribute('aria-pressed', 'false');
    });
  }
  $$('.uv-sound').forEach(function (btn) {
    var fig = btn.closest('.uv');
    var v = fig.querySelector('video');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var ac = v.muted;
      if (ac) { sesKapatHepsi(v); v.muted = false; v.dataset.userPaused = '0'; forcePlay(v); }
      else { v.muted = true; }
      btn.setAttribute('aria-pressed', ac ? 'true' : 'false');
      $('.sr-only', btn).textContent = ac
        ? T('videosunun sesini kapat') : T('videosunun sesini aç');
    });
  });

  $$('.uv-toggle').forEach(function (btn) {
    var v = btn.closest('.uv').querySelector('video');
    var sync = function () { btn.setAttribute('aria-pressed', v.paused ? 'false' : 'true'); };
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (v.paused) { v.dataset.userPaused = '0'; forcePlay(v); }
      else { v.dataset.userPaused = '1'; v.pause(); }
    });
  });

  /* ===============================================================
     8. SPOTLIGHT
     =============================================================== */
  function clearActive(except) {
    $$('.m-cell.is-active').forEach(function (c) { if (c !== except) c.classList.remove('is-active'); });
  }
  $$('.media-set').forEach(function (set) {
    set.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      var cell = e.target.closest('.m-cell');
      if (!cell || cell.classList.contains('is-active')) return;
      clearActive(cell); cell.classList.add('is-active'); set.classList.add('has-active');
    });
    set.addEventListener('focusin', function (e) {
      var cell = e.target.closest('.m-cell');
      if (cell) { clearActive(cell); cell.classList.add('is-active'); set.classList.add('has-active'); }
    });
    set.addEventListener('focusout', function () {
      setTimeout(function () {
        if (!set.contains(D.activeElement)) { set.classList.remove('has-active'); clearActive(null); }
      }, 0);
    });
    set.addEventListener('pointerleave', function () {
      if (!set.contains(D.activeElement)) set.classList.remove('has-active');
    });
  });
  D.addEventListener('pointerdown', function (e) {
    if (!e.target.closest('.media-set')) {
      clearActive(null);
      $$('.media-set.has-active').forEach(function (x) { x.classList.remove('has-active'); });
    }
  });

  /* ===============================================================
     9. HAREKET ANAHTARI
     =============================================================== */
  var motionBtn = $('#motionBtn');
  function refreshKeepingPlace() {
    if (!W.ScrollTrigger) return;
    var anchor = null, offset = 0, secs = $$('main > section');
    for (var i = 0; i < secs.length; i++) {
      var top = secs[i].getBoundingClientRect().top;
      if (top <= 4) { anchor = secs[i]; offset = top; } else break;
    }
    W.ScrollTrigger.refresh();
    if (anchor) {
      var y = anchor.getBoundingClientRect().top + W.scrollY - offset;
      W.scrollTo(0, y);
      if (lenis) lenis.scrollTo(y, { immediate: true });
    }
  }
  function applyMotion() {
    D.body.classList.toggle('motion-off', motionOff);
    motionBtn.setAttribute('aria-pressed', motionOff ? 'true' : 'false');
    $('.sr-only', motionBtn).textContent = motionOff
      ? T('Sayfadaki hareketi ve videoları başlat') : T('Sayfadaki hareketi ve videoları duraklat');
    if (motionOff) {
      allVideos.forEach(function (v) { v.pause(); });
      if (lenis) lenis.stop();
      if (stripTween) stripTween.pause();
      if (heroTL) heroTL.progress(1).pause();
      if (railST) {
        railST.kill(); railST = null;
        W.gsap.set(railTrack, { x: 0 });
        var vp = $('.rail-viewport'); if (vp) vp.style.overflowX = 'auto';
        refreshKeepingPlace();
      }
      D.body.classList.add('fab-on');
    } else {
      if (lenis) lenis.start();
      if (stripTween) stripTween.play();
      if (rebuildRail) { rebuildRail(); refreshKeepingPlace(); }
      allVideos.forEach(function (v) {
        if (v.dataset.userPaused === '1') return;
        var r = v.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) tryPlay(v);
      });
    }
  }
  /* Hareket durumu degisti: fistik katmani gibi ek modüller haberdar olsun. */
  function motionDuyur() { W.dispatchEvent(new Event('au:motion')); }
  motionBtn.addEventListener('click', function () { motionOff = !motionOff; applyMotion(); motionDuyur(); });
  if (rmq.addEventListener) rmq.addEventListener('change', function (e) { motionOff = e.matches; applyMotion(); motionDuyur(); });

  /* ===============================================================
     10. PRELOADER
     =============================================================== */
  var pre = $('#pre');
  function killPre(instant) {
    if (!pre || pre.hidden) return;
    var done = function () { pre.hidden = true; D.body.classList.remove('is-locked'); };
    if (instant || !W.gsap) { done(); return; }
    W.gsap.to(pre, { yPercent: -100, duration: .6, ease: 'power4.inOut', onComplete: done });
  }
  function runPreloader() {
    if (motionOff || !W.gsap) { killPre(true); return; }
    D.body.classList.add('is-locked');
    var strokes = $$('#pre path:not(.pre-fill), #pre line');
    strokes.forEach(function (p) {
      var len = p.getTotalLength ? p.getTotalLength() : 200;
      p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
    });
    W.gsap.timeline({ onComplete: function () { killPre(); } })
      .to(strokes, { strokeDashoffset: 0, duration: .55, stagger: .05, ease: 'power2.out' })
      .to('.pre-fill', { opacity: .16, duration: .3 }, '-=.3')
      .fromTo('.pre-word', { opacity: 0, letterSpacing: '.7em' },
              { opacity: 1, letterSpacing: '.34em', duration: .45, ease: 'power3.out' }, '-=.35')
      .to('.pre-bar i', { width: '100%', duration: .5, ease: 'power2.inOut' }, '-=.4');
  }

  /* ===============================================================
     11. SCROLL KOREOGRAFİSİ
     =============================================================== */
  function initScroll() {
    if (!W.gsap || !W.ScrollTrigger) return;
    var gsap = W.gsap, ST = W.ScrollTrigger;

    if (!motionOff && typeof W.Lenis !== 'undefined') {
      lenis = new W.Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true, touchMultiplier: 1.6 });
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    gsap.to('#prog', { scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: D.body, start: 'top top', end: 'bottom bottom', scrub: .25 } });

    /* Üst menü GSAP ile değil sınıf + CSS geçişiyle açılır.
       Yüzde cinsinden transform'u GSAP hesaplanmış stilden piksel olarak
       okuyor, ScrollTrigger.refresh() önbelleği tazeleyince yPercent
       tween'i etkisiz kalıyordu. Sınıf yöntemi bundan etkilenmez. */
    ST.create({
      trigger: '#hero', start: 'bottom 78%',
      onEnter: function () { D.body.classList.add('nav-on'); },
      onLeaveBack: function () { D.body.classList.remove('nav-on'); }
    });
    ST.create({
      trigger: '#hero', start: 'bottom 92%',
      onEnter: function () { D.body.classList.add('fab-on'); },
      onLeaveBack: function () { D.body.classList.remove('fab-on'); }
    });

    if (motionOff) { ST.refresh(); return; }

    heroTL = gsap.timeline({ delay: .95 });
    heroTL.fromTo('.hero-film', { scale: 1.14, opacity: .25 }, { scale: 1, opacity: 1, duration: 2.2, ease: 'power2.out' })
      .from('#hero .eyebrow', { yPercent: 60, opacity: 0, duration: .7, ease: 'power3.out' }, '-=1.85')
      .from('#hero h1 .ln > span', { yPercent: 118, rotateX: -55, opacity: 0, duration: 1.05, stagger: .09, ease: 'power4.out', transformOrigin: '50% 100%' }, '-=.5')
      .from('#hero .lede', { y: 26, opacity: 0, duration: .8, ease: 'power3.out' }, '-=.65')
      .from('#hero .hero-cta .btn', { y: 22, opacity: 0, duration: .6, stagger: .09, ease: 'power3.out' }, '-=.5')
      .from('#hero .fact', { y: 20, opacity: 0, duration: .6, stagger: .07, ease: 'power3.out' }, '-=.45')
      .from('.scroll-hint', { opacity: 0, duration: .6 }, '-=.4');

    gsap.to('.hero-film', { yPercent: -12, scale: 1.09, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: .6 } });
    gsap.to('.hero-inner', { yPercent: 16, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'center center', end: 'bottom top', scrub: .5 } });

    $$('.rv').forEach(function (n) {
      gsap.fromTo(n, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: .95, ease: 'power3.out',
        scrollTrigger: { trigger: n, start: 'top 88%', once: true },
        onComplete: function () { gsap.set(n, { clearProps: 'transform' }); } });
    });

    var stripW = strip1.scrollWidth / 3;
    stripTween = gsap.to(strip1, { x: -stripW, duration: 22, ease: 'none', repeat: -1,
      modifiers: { x: function (x) { return (parseFloat(x) % stripW) + 'px'; } } });
    ST.create({ trigger: D.body, start: 'top top', end: 'bottom bottom',
      onUpdate: function (self) {
        gsap.to(stripTween, { timeScale: self.direction * (1 + Math.min(Math.abs(self.getVelocity()) / 2200, 2.2)), duration: .5, overwrite: true });
      } });

    $$('#mirasMedia .m-cell').forEach(function (n, i) {
      var dp = [0.10, 0.20, 0.05, 0.14, 0.08][i % 5] * 260;
      gsap.fromTo(n, { '--py': dp + 'px' }, { '--py': (-dp) + 'px', ease: 'none',
        scrollTrigger: { trigger: n, start: 'top bottom', end: 'bottom top', scrub: .8 } });
    });

    function buildRail() {
      if (railST) { railST.kill(); railST = null; gsap.set(railTrack, { x: 0 }); }
      var vp = $('.rail-viewport');
      if (W.innerWidth < 900) {
        vp.style.overflowX = 'auto';
        if (!vp.dataset.bound) {
          vp.dataset.bound = '1';
          vp.addEventListener('scroll', function () {
            var max = vp.scrollWidth - vp.clientWidth;
            $('#railBar').style.width = max > 0 ? (vp.scrollLeft / max * 100).toFixed(2) + '%' : '0%';
          }, { passive: true });
        }
        return;
      }
      vp.style.overflowX = 'hidden';
      var dist = railTrack.scrollWidth - W.innerWidth + (W.innerWidth * 0.05);
      if (dist <= 0) return;
      var tw = gsap.to(railTrack, { x: -dist, ease: 'none',
        scrollTrigger: { trigger: '#urunler', start: 'top top', end: '+=' + dist,
          pin: true, scrub: .7, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: function (self) { $('#railBar').style.width = (self.progress * 100).toFixed(2) + '%'; } } });
      railST = tw.scrollTrigger;
      $$('.pcard').forEach(function (c) {
        gsap.fromTo(c, { rotateY: 6 }, { rotateY: -6, ease: 'none',
          scrollTrigger: { trigger: c, containerAnimation: tw, start: 'left right', end: 'right left', scrub: .6 } });
      });
    }
    rebuildRail = buildRail;
    buildRail();
    var rt;
    W.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { buildRail(); ST.refresh(); }, 250); });

    var kb = 0;
    $$('.m-cell:not(.pcard):not(.catcard) img.m-fill').forEach(function (img) {
      var dir = (kb++ % 2) ? 1 : -1;
      gsap.fromTo(img, { scale: 1, xPercent: 0, yPercent: 0 },
        { scale: 1.07, xPercent: dir * 1.6, yPercent: dir * -2, ease: 'none',
          scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
    });

    $$('[data-count]').forEach(function (n) {
      var target = parseFloat(n.dataset.count), dec = parseInt(n.dataset.dec || '0', 10), o = { v: 0 };
      ST.create({ trigger: n, start: 'top 88%', once: true, onEnter: function () {
        gsap.to(o, { v: target, duration: 1.9, ease: 'power2.out',
          onUpdate: function () { n.textContent = o.v.toFixed(dec).replace('.', ','); } });
      } });
    });

    var stars = $('.stars i');
    if (stars) ST.create({ trigger: stars, start: 'top 90%', once: true, onEnter: function () {
      gsap.to(stars, { width: stars.dataset.fill + '%', duration: 1.4, ease: 'power3.out' });
    } });

    gsap.fromTo('.uv', { yPercent: 12, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: .85, stagger: { each: .07 }, ease: 'power3.out',
        scrollTrigger: { trigger: '.ur-grid', start: 'top 82%', once: true },
        onComplete: function () { gsap.set('.uv', { clearProps: 'transform' }); } });

    $$('.catcard').forEach(function (t, i) {
      gsap.fromTo(t, { yPercent: 10, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: .85, delay: (i % 2) * .06, ease: 'power3.out',
          scrollTrigger: { trigger: t, start: 'top 92%', once: true },
          onComplete: function () { gsap.set(t, { clearProps: 'transform' }); } });
    });

    ST.refresh();
  }

  /* ===============================================================
     12. MAGNETIC / TILT / CURSOR
     =============================================================== */
  function initMagnetic() {
    if (motionOff || !finePointer.matches || !W.gsap) return;
    $$('.js-mag').forEach(function (b) {
      var span = b.querySelector('span') || b;
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2, my = e.clientY - r.top - r.height / 2;
        W.gsap.to(b, { x: mx * .24, y: my * .3, duration: .5, ease: 'power3.out' });
        W.gsap.to(span, { x: mx * .1, y: my * .14, duration: .5, ease: 'power3.out' });
      });
      b.addEventListener('pointerleave', function () {
        W.gsap.to([b, span], { x: 0, y: 0, duration: .65, ease: 'elastic.out(1,.45)' });
      });
    });
  }
  function initTilt() {
    if (motionOff || !finePointer.matches || !W.gsap) return;
    $$('.pcard').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        W.gsap.to(c, { rotateY: px * 8, rotateX: -py * 8, duration: .5, ease: 'power2.out', transformPerspective: 900 });
      });
      c.addEventListener('pointerleave', function () {
        W.gsap.to(c, { rotateY: 0, rotateX: 0, duration: .7, ease: 'power3.out' });
      });
    });
  }
  /* İmleç artık assets/js/imlec.js tarafından kuruluyor (elmas + halka + iz).
     Buradaki eski medya halkası kaldırıldı; kalan iskelet öğe temizlenir. */
  function initCursor() {
    var cur = $('#cursor');
    if (cur) cur.remove();
  }

  /* ===============================================================
     13. LIGHTBOX
     =============================================================== */
  var lb = $('#lb'), lbStage = $('#lbStage'), lbCap = $('#lbCap'), lbCount = $('#lbCount');
  var lbList = [], lbIdx = 0, lbSonOdak = null;

  function lbRender() {
    var o = lbList[lbIdx];
    lbStage.innerHTML = '';
    if (o.url) {
      if (o.t === 'vid') {
        var vu = D.createElement('video');
        vu.src = o.url;
        vu.controls = true; vu.autoplay = !motionOff; vu.loop = true; vu.muted = true;
        vu.setAttribute('playsinline', '');
        lbStage.appendChild(vu);
      } else {
        var imu = D.createElement('img');
        imu.src = o.url; imu.alt = o.alt || o.cap || '';
        lbStage.appendChild(imu);
      }
    } else if (o.t === 'vid') {
      var v = D.createElement('video');
      v.src = VID(o.k); v.poster = POS(o.k);
      v.controls = true; v.autoplay = !motionOff; v.loop = true; v.muted = true;
      v.setAttribute('playsinline', ''); v.width = o.w; v.height = o.h;
      lbStage.appendChild(v);
    } else {
      var im = D.createElement('img');
      im.src = TAM(o.k); im.alt = o.alt || o.cap || ''; im.width = o.w; im.height = o.h;
      im.addEventListener('error', function () {
        if (im.src.slice(-5) === '.avif') { AVIF_VAR = false; im.src = IMG(o.k); }
      }, { once: true });
      lbStage.appendChild(im);
    }
    lbCap.textContent = (o.catName ? o.catName + ' · ' : '') + (o.cap || '');
    lbCount.textContent = (lbIdx + 1) + ' / ' + lbList.length;
  }
  function lbShow(i) { lbIdx = (i + lbList.length) % lbList.length; lbRender(); }
  function lbOpen(list, i) {
    lbList = list; lbSonOdak = D.activeElement;
    lbShow(i);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    D.body.classList.add('is-locked');
    if (lenis) lenis.stop();
    W.requestAnimationFrame(function () { $('#lbClose').focus(); });
  }
  function lbClose() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    lbStage.innerHTML = '';
    D.body.classList.remove('is-locked');
    if (lenis && !motionOff) lenis.start();
    odakGeri(lbSonOdak, lb);
  }
  D.addEventListener('click', function (e) {
    var cell = e.target.closest('.m-cell');
    if (!cell || e.target.closest('.uv-toggle')) return;
    if (cell.classList.contains('pcard') || cell.classList.contains('catcard')) return;
    var set = cell.closest('.media-set');
    if (!set) return;
    var cells = $$('.m-cell', set).filter(function (c) { return !c.hidden && c.__media; });
    var i = cells.indexOf(cell);
    if (i > -1) { e.preventDefault(); lbOpen(cells.map(function (c) { return c.__media; }), i); }
  });
  $('#lbClose').addEventListener('click', lbClose);
  $('#lbPrev').addEventListener('click', function () { lbShow(lbIdx - 1); });
  $('#lbNext').addEventListener('click', function () { lbShow(lbIdx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbStage) lbClose(); });

  D.addEventListener('keydown', function (e) {
    if (rvBox.classList.contains('open')) {
      if (e.key === 'Escape') { rvKapat(); return; }
      if (e.key === 'Tab') {
        var rf = $$('button, a[href], input, textarea, select', rvBox)
                 .filter(function (x) { return !x.closest('[hidden]') && x.offsetParent !== null; });
        var rfirst = rf[0], rlast = rf[rf.length - 1];
        if (e.shiftKey && D.activeElement === rfirst) { e.preventDefault(); rlast.focus(); }
        else if (!e.shiftKey && D.activeElement === rlast) { e.preventDefault(); rfirst.focus(); }
      }
      return;
    }
    if (pd.classList.contains('open')) {
      if (e.key === 'Escape') { pdKapat(); return; }
      if (e.key === 'Tab') {
        var pf = $$('button, a[href]', pd), pfirst = pf[0], plast = pf[pf.length - 1];
        if (e.shiftKey && D.activeElement === pfirst) { e.preventDefault(); plast.focus(); }
        else if (!e.shiftKey && D.activeElement === plast) { e.preventDefault(); pfirst.focus(); }
      }
      return;
    }
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') { lbClose(); return; }
    if (e.key === 'ArrowLeft') { lbShow(lbIdx - 1); return; }
    if (e.key === 'ArrowRight') { lbShow(lbIdx + 1); return; }
    if (e.key === 'Tab') {
      var f = $$('button', lb), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && D.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && D.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ===============================================================
     14. HARİTA
     =============================================================== */
  $('#mapLoad').addEventListener('click', function () {
    var f = D.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(
      (C.isim || 'Ali Usta Baklavaları') + ', ' + (C.adres || '') + ', ' + (C.adresAlt || '')) + '&output=embed';
    f.title = T('Ali Usta Baklavaları Nizip şubesinin harita üzerindeki konumu');
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.setAttribute('allowfullscreen', '');
    $('#mapWrap').appendChild(f);
    $('#mapPh').remove();
    if (W.ScrollTrigger) W.ScrollTrigger.refresh();
  });

  /* ===============================================================
     15. YUMUŞAK İÇ BAĞLANTILAR
     =============================================================== */
  D.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.id === 'heroWa' || a.id === 'ozelWa') return;
    var id = a.getAttribute('href');
    if (id === '#' || id === '#main') return;
    var tgt = D.querySelector(id);
    if (!tgt) return;
    e.preventDefault();
    if (lenis && !motionOff) lenis.scrollTo(tgt, { offset: -70, duration: 1.15 });
    else tgt.scrollIntoView({ behavior: motionOff ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', id);
  });

  /* ===============================================================
     16. ANALİTİK (çerezsiz, isteğe bağlı)
     =============================================================== */
  izle = function (ad) {
    try {
      if (W.plausible) W.plausible(ad);
      if (W.umami && W.umami.track) W.umami.track(ad);
    } catch (e) {}
  };
  (function analitik() {
    if (C.plausibleDomain) {
      W.plausible = W.plausible || function () { (W.plausible.q = W.plausible.q || []).push(arguments); };
      var p = D.createElement('script');
      p.defer = true; p.dataset.domain = C.plausibleDomain; p.src = 'https://plausible.io/js/script.js';
      D.head.appendChild(p);
    }
    if (C.umamiSrc && C.umamiId) {
      var u = D.createElement('script');
      u.defer = true; u.src = C.umamiSrc; u.dataset.websiteId = C.umamiId;
      D.head.appendChild(u);
    }
  })();
  $('#waFab').addEventListener('click', function () { izle('wa-fab'); });
  $('#navPhone').addEventListener('click', function () { izle('telefon'); });

  /* ===============================================================
     17. PWA
     =============================================================== */
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    W.addEventListener('load', function () { navigator.serviceWorker.register(BASE + 'sw.js').catch(function () {}); });
  }

  /* ===============================================================
     18. BAŞLAT
     =============================================================== */
  function boot() {
    applyMotion();
    runPreloader();
    initScroll();
    initMagnetic();
    initTilt();
    initCursor();
    registerVideos();
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', boot);
  else boot();

  setTimeout(function () { if (!W.gsap) { killPre(true); D.body.classList.add('motion-off', 'fab-on'); } }, 3000);

  /* ===============================================================
     19. DIŞA AÇILAN ARAYÜZ
     shop.js ve extras.js bu yardımcıları kullanır.
     =============================================================== */
  W.AU = {
    $: $, $$: $$, el: el, esc: esc, merge: merge, T: T, pad: pad,
    IMG: IMG, TH: TH, VID: VID, POS: POS, BASE: BASE,
    IMG_AV: IMG_AV, TH_AV: TH_AV, pic: pic, TAM: TAM,
    waLink: waLink, waAc: waAc, WA_OK: WA_OK,
    izle: function (a) { if (izle) izle(a); },
    dogrula: dogrula, web3Gonder: web3Gonder,
    lenis: function () { return lenis; },
    motionOff: function () { return motionOff; },
    kilitle: function (on) { D.body.classList.toggle('is-locked', !!on); if (lenis) { if (on) lenis.stop(); else if (!motionOff) lenis.start(); } },
    tazele: function () { if (W.ScrollTrigger) W.ScrollTrigger.refresh(); },
    sonraYap: sonraYap,
    odakGeri: odakGeri,
    yorumlariTazele: function () { if (W.__auYorumTazele) W.__auYorumTazele(); }
  };
  W.dispatchEvent(new Event('au:ready'));

})();
