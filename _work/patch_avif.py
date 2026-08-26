# -*- coding: utf-8 -*-
"""AVIF: görseller <picture> ile sunulur, AVIF yoksa WebP'ye düşer."""
import io, sys

n = 0


def yama(P, ciftler):
    global n
    s = io.open(P, encoding='utf-8').read()
    for a, y in ciftler:
        assert a in s, P + ' BULUNAMADI:\n' + a[:110]
        s = s.replace(a, y, 1)
        n += 1
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)


# =====================================================================
# site.js
# =====================================================================
yama('assets/js/site.js', [

# --- yol yardımcıları ------------------------------------------------
(
"""  function IMG(k) { return BASE + 'assets/img/' + k + '.webp'; }
  function TH(k) { return BASE + 'assets/img/thumb/' + k + '.webp'; }""",
"""  function IMG(k) { return BASE + 'assets/img/' + k + '.webp'; }
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
      ss = ' srcset="' + TH(o.k) + ' 620w, ' + IMG(o.k) + ' ' + o.w + 'w" sizes="' + (sizes || '32vw') + '"';
      ssav = TH_AV(o.k) + ' 620w, ' + IMG_AV(o.k) + ' ' + o.w + 'w';
    }
    return '<picture><source type="image/avif" srcset="' + (ssav || av) + '"' +
      (buyuk ? ' sizes="' + (sizes || '32vw') + '"' : '') + '>' +
      '<img src="' + src + '"' + ss + ' width="' + o.w + '" height="' + o.h + '"' + (a || '') + '></picture>';
  }

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
  }, true);"""
),

# --- medya karosu ----------------------------------------------------
(
"""      var ss = opts.big ? ' srcset="' + TH(o.k) + ' 620w, ' + IMG(o.k) + ' ' + o.w + 'w" sizes="' + (opts.sizes || '32vw') + '"' : '';
      inner = '<img class="m-fill" src="' + TH(o.k) + '"' + ss + ' width="' + o.w + '" height="' + o.h +
        '" loading="lazy" decoding="async" alt="' + esc(o.alt || o.cap || '') + '">';""",
"""      inner = pic(o, ' class="m-fill" loading="lazy" decoding="async" alt="' +
        esc(o.alt || o.cap || '') + '"', !!opts.big, opts.sizes);"""
),

# --- ürün kartı ------------------------------------------------------
(
"""        '<img class="m-fill main" src="' + TH(p.photos[0].k) + '" width="' + p.photos[0].w + '" height="' + p.photos[0].h + '" loading="lazy" decoding="async" alt="' + esc(p.name) + ' — tepside yakın çekim">' +
        '<img class="m-fill alt" src="' + TH(p.photos[1].k) + '" width="' + p.photos[1].w + '" height="' + p.photos[1].h + '" loading="lazy" decoding="async" alt="" aria-hidden="true">' +""",
"""        pic(p.photos[0], ' class="m-fill main" loading="lazy" decoding="async" alt="' +
          esc(p.name) + ' — tepside yakın çekim"') +
        pic(p.photos[1], ' class="m-fill alt" loading="lazy" decoding="async" alt="" aria-hidden="true"') +"""
),

# --- kategori kartı --------------------------------------------------
(
"""      '<img class="m-fill" src="' + TH(c.cover.k) + '" srcset="' + TH(c.cover.k) + ' 620w, ' + IMG(c.cover.k) + ' ' + c.cover.w + 'w"' +
      ' sizes="(max-width:700px) 94vw, 46vw" width="' + c.cover.w + '" height="' + c.cover.h + '" loading="lazy" decoding="async" alt="">' +""",
"""      pic(c.cover, ' class="m-fill" loading="lazy" decoding="async" alt=""',
          true, '(max-width:700px) 94vw, 46vw') +"""
),

# --- dışa açılan arayüz ----------------------------------------------
(
"""    IMG: IMG, TH: TH, VID: VID, POS: POS, BASE: BASE,""",
"""    IMG: IMG, TH: TH, VID: VID, POS: POS, BASE: BASE,
    IMG_AV: IMG_AV, TH_AV: TH_AV, pic: pic,"""
),
])


# =====================================================================
# shop.js — karşılaştırma tablosu ve sihirbaz görselleri
# =====================================================================
yama('assets/js/shop.js', [
(
"""          return '<th><span class="cmp-th">' +
            (f && A ? '<img src="' + A.TH(f.photos[0].k) + '" alt="" loading="lazy" decoding="async">' : '') +
            esc(u) + '</span></th>';""",
"""          return '<th><span class="cmp-th">' +
            (f && A ? A.pic(f.photos[0], ' alt="" loading="lazy" decoding="async"') : '') +
            esc(u) + '</span></th>';"""
),
(
"""            (f && A ? '<img class="wz-img" src="' + A.TH(f.photos[0].k) + '" alt="" loading="lazy" decoding="async">' : '') +""",
"""            (f && A ? A.pic(f.photos[0], ' class="wz-img" alt="" loading="lazy" decoding="async"') : '') +"""
),
])


# =====================================================================
# extras.js — yazı kapakları ve story kareleri
# =====================================================================
yama('assets/js/extras.js', [
(
"""    $('#yaziList').innerHTML = list.map(function (y, i) {
      var kapak = y.kapak && A ? A.TH(y.kapak) : '';
      return '<article class="yz-card m-cell">' +
        (kapak ? '<span class="yz-img"><img src="' + esc(kapak) + '" alt="" loading="lazy" decoding="async"></span>' : '') +""",
"""    $('#yaziList').innerHTML = list.map(function (y, i) {
      var kapak = y.kapak && A
        ? '<picture><source type="image/avif" srcset="' + esc(A.TH_AV(y.kapak)) + '">' +
          '<img src="' + esc(A.TH(y.kapak)) + '" alt="" loading="lazy" decoding="async"></picture>'
        : '';
      return '<article class="yz-card m-cell">' +
        (kapak ? '<span class="yz-img">' + kapak + '</span>' : '') +"""
),
(
"""    var kapak = y.kapak && A ? A.IMG(y.kapak) : '';
    yaziPanel.innerHTML = '<article class="yz-box">' +
      '<button class="icon-btn yz-close" type="button" id="yzClose"><span class="sr-only">' + esc(T('Kapat')) + '</span>' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      (kapak ? '<img class="yz-hero" src="' + esc(kapak) + '" alt="" decoding="async">' : '') +""",
"""    var kapak = y.kapak && A
      ? '<picture><source type="image/avif" srcset="' + esc(A.IMG_AV(y.kapak)) + '">' +
        '<img class="yz-hero" src="' + esc(A.IMG(y.kapak)) + '" alt="" decoding="async"></picture>'
      : '';
    yaziPanel.innerHTML = '<article class="yz-box">' +
      '<button class="icon-btn yz-close" type="button" id="yzClose"><span class="sr-only">' + esc(T('Kapat')) + '</span>' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      kapak +"""
),
(
"""        '<span class="st-ring"><img src="' + esc(A ? A.TH(s.gorsel) : s.gorsel) + '" alt="" loading="lazy" decoding="async"></span>' +""",
"""        '<span class="st-ring"><picture>' +
          (A ? '<source type="image/avif" srcset="' + esc(A.TH_AV(s.gorsel)) + '">' : '') +
          '<img src="' + esc(A ? A.TH(s.gorsel) : s.gorsel) + '" alt="" loading="lazy" decoding="async"></picture></span>' +"""
),
])

print('AVIF yamalari uygulandi:', n)
