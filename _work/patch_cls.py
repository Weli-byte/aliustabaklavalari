# -*- coding: utf-8 -*-
"""CLS: fiyat, sepet/karşılaştır düğmeleri ve alerjen çubuğu ilk çizimde gelsin."""
import io

n = 0


def yama(P, ciftler):
    global n
    s = io.open(P, encoding='utf-8').read()
    for a, y in ciftler:
        assert a in s, P + ' BULUNAMADI:\n' + a[:120]
        s = s.replace(a, y, 1)
        n += 1
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)


# =====================================================================
# 1) site.js — ürün kartı fiyat ve düğmeleri baştan yazar
# =====================================================================
yama('assets/js/site.js', [
(
"""  /* --- Ürün rayı --- */
  var railTrack = $('#railTrack');""",
"""  /* --- Ürün rayı --- */
  /* Fiyat ve sepet/karşılaştır düğmeleri kart ilk çizilirken yazılır.
     Sonradan eklenince kart yüksekliği değişiyor ve CLS artıyordu;
     shop.js yalnızca davranışı bağlar. */
  function railFiyat(ad) {
    var f = (C.fiyatlar || []).filter(function (x) { return x.urun === ad; })[0];
    if (!f) return '';
    function oku(v) {
      var t = String(v == null ? '' : v).replace(/[^\\d,.]/g, '').replace(/\\./g, '').replace(',', '.');
      var s = parseFloat(t);
      return isNaN(s) ? 0 : s;
    }
    var kg = oku(f.kg), tam = oku(f.tam);
    if (!kg && !tam) return '';
    var tut = kg ? kg : tam;
    return '<span class="pcard-price"><bdi>' + tut.toLocaleString('tr-TR') + ' ₺' +
      (kg ? ' / kg' : '') + '</bdi></span>';
  }
  var SEPET_ACIK = !!(C.sepet && C.sepet.acik);

  var railTrack = $('#railTrack');"""
),
(
"""      '<div class="pcard-body">' +
        '<h3>' + esc(p.name) + '</h3>' +
        '<p>' + esc(p.desc) + '</p>' +
        '<div class="pcard-act">' +
          '<button class="mini mini--wa" type="button" data-ask="' + esc(p.name) + '">' + esc(T('Bu ürünü sor')) + '</button>' +
          '<button class="mini" type="button" data-detail="' + esc(p.name) + '">' + esc(T('Detay')) + '</button>' +
        '</div>' +
      '</div>';""",
"""      '<div class="pcard-body">' +
        '<h3>' + esc(p.name) + '</h3>' +
        '<p>' + esc(p.desc) + '</p>' +
        (SEPET_ACIK ? railFiyat(p.name) : '') +
        '<div class="pcard-act">' +
          (SEPET_ACIK ? '<button class="mini mini--add" type="button" data-add="' + esc(p.name) + '">' + esc(T('Sepete ekle')) + '</button>' : '') +
          '<button class="mini mini--wa" type="button" data-ask="' + esc(p.name) + '">' + esc(T('Bu ürünü sor')) + '</button>' +
          '<button class="mini" type="button" data-detail="' + esc(p.name) + '">' + esc(T('Detay')) + '</button>' +
          '<button class="mini mini--cmp" type="button" data-cmp="' + esc(p.name) + '" aria-pressed="false">' + esc(T('Karşılaştır')) + '</button>' +
        '</div>' +
      '</div>';"""
),
])


# =====================================================================
# 2) index.html — alerjen çubuğu boş olarak baştan durur
# =====================================================================
yama('index.html', [
(
"""    <p class="lede rv" style="max-width:34ch">Hepsi aynı hamurdan, aynı fıstıktan. Ayıran şey yalnızca ustanın elindeki kesim ve katlama. Kartın altındaki düğmelerden fiyat sorabilir ya da içerik ve alerjen bilgisine bakabilirsiniz.</p>
  </div>""",
"""    <p class="lede rv" style="max-width:34ch">Hepsi aynı hamurdan, aynı fıstıktan. Ayıran şey yalnızca ustanın elindeki kesim ve katlama. Kartın altındaki düğmelerden sepete ekleyebilir, fiyat sorabilir ya da içerik ve alerjen bilgisine bakabilirsiniz.</p>
    <div class="alrg-bar" id="alrgBar" hidden></div>
  </div>"""
),
])


# =====================================================================
# 3) shop.js — hazır düğmeleri tekrar eklemez
# =====================================================================
yama('assets/js/shop.js', [
(
"""  function urunKartlari() {
    if (!(C.sepet && C.sepet.acik)) return;
    $$('.pcard').forEach(function (card) {
      var ad = card.dataset.urun;
      if (!ad || !fiyatSatiri(ad)) return;
      var act = $('.pcard-act', card);
      if (!act || $('[data-add]', act)) return;
      var f = fiyatSatiri(ad);
      var fiyatEt = el('span', 'pcard-price');
      fiyatEt.innerHTML = '<bdi>' + (paraOku(f.kg) ? paraYaz(paraOku(f.kg)) + ' / kg' : paraYaz(paraOku(f.tam))) + '</bdi>';
      act.parentNode.insertBefore(fiyatEt, act);
      var b = el('button', 'mini mini--add', T('Sepete ekle'));
      b.type = 'button';
      b.dataset.add = ad;
      act.insertBefore(b, act.firstChild);
    });
  }""",
"""  /* Kartlardaki fiyat ve "Sepete ekle" düğmesi site.js tarafından ilk
     çizimde yazılır (CLS). Burada yalnızca eksik kalmışsa tamamlanır. */
  function urunKartlari() {
    if (!(C.sepet && C.sepet.acik)) return;
    $$('.pcard').forEach(function (card) {
      var ad = card.dataset.urun;
      if (!ad || !fiyatSatiri(ad)) return;
      var act = $('.pcard-act', card);
      if (!act || $('[data-add]', act)) return;
      var f = fiyatSatiri(ad);
      if (!$('.pcard-price', card)) {
        var fiyatEt = el('span', 'pcard-price');
        fiyatEt.innerHTML = '<bdi>' + (paraOku(f.kg) ? paraYaz(paraOku(f.kg)) + ' / kg' : paraYaz(paraOku(f.tam))) + '</bdi>';
        act.parentNode.insertBefore(fiyatEt, act);
      }
      var b = el('button', 'mini mini--add', T('Sepete ekle'));
      b.type = 'button';
      b.dataset.add = ad;
      act.insertBefore(b, act.firstChild);
    });
  }"""
),
(
"""  function karsiKur() {
    $$('.pcard').forEach(function (card) {
      var act = $('.pcard-act', card);
      if (!act || $('[data-cmp]', act)) return;
      var b = el('button', 'mini mini--cmp', T('Karşılaştır'));
      b.type = 'button';
      b.dataset.cmp = card.dataset.urun;
      b.setAttribute('aria-pressed', 'false');
      act.appendChild(b);
    });
  }""",
"""  /* "Karşılaştır" düğmesi de kartla birlikte gelir; eksikse tamamlanır. */
  function karsiKur() {
    $$('.pcard').forEach(function (card) {
      var act = $('.pcard-act', card);
      if (!act || $('[data-cmp]', act)) return;
      var b = el('button', 'mini mini--cmp', T('Karşılaştır'));
      b.type = 'button';
      b.dataset.cmp = card.dataset.urun;
      b.setAttribute('aria-pressed', 'false');
      act.appendChild(b);
    });
  }"""
),
(
"""  function alerjenFiltresi() {
    var head = $('.rail-head');
    if (!head || $('#alrgBar')) return;
    var TUM = [];
    Object.keys(C.urunDetay || {}).forEach(function (k) {
      (C.urunDetay[k].alerjen || []).forEach(function (a) { if (TUM.indexOf(a) < 0) TUM.push(a); });
    });
    if (!TUM.length) return;

    var bar = el('div', 'alrg-bar');
    bar.id = 'alrgBar';
    bar.innerHTML = '<span class="alrg-lbl">' + esc(T('İçermesin:')) + '</span>' +""",
"""  function alerjenFiltresi() {
    /* Çubuk HTML'de boş olarak duruyor; doldurulunca görünür olur.
       Sonradan eklenseydi ray aşağı kayar ve CLS artardı. */
    var bar = $('#alrgBar');
    if (!bar || bar.childNodes.length) return;
    var TUM = [];
    Object.keys(C.urunDetay || {}).forEach(function (k) {
      (C.urunDetay[k].alerjen || []).forEach(function (a) { if (TUM.indexOf(a) < 0) TUM.push(a); });
    });
    if (!TUM.length) return;
    bar.hidden = false;

    bar.innerHTML = '<span class="alrg-lbl">' + esc(T('İçermesin:')) + '</span>' +"""
),
(
"""      '<button class="alrg-chip alrg-chip--clear" type="button" id="alrgClear" hidden>' + esc(T('Temizle')) + '</button>';
    head.appendChild(bar);

    var haric = [];""",
"""      '<button class="alrg-chip alrg-chip--clear" type="button" id="alrgClear" hidden>' + esc(T('Temizle')) + '</button>';

    var haric = [];"""
),
])

print('CLS yamalari uygulandi:', n)
