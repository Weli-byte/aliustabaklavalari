# -*- coding: utf-8 -*-
"""shop.js — sepet satırlarını dil bağımsız dizinle sakla, sayıları bdi ile yalıt."""
import io, sys

P = 'assets/js/shop.js'
s = io.open(P, encoding='utf-8').read()
orj = s
n = 0


def degis(eski, yeni):
    global s, n
    assert eski in s, 'BULUNAMADI:\n' + eski[:90]
    s = s.replace(eski, yeni, 1)
    n += 1


# --- 1) dizin yardımcıları ---------------------------------------------------
degis("""  function fiyatSatiri(urun) {
    return (C.fiyatlar || []).filter(function (f) { return f.urun === urun; })[0] || null;
  }""",
"""  function fiyatSatiri(urun) {
    return (C.fiyatlar || []).filter(function (f) { return f.urun === urun; })[0] || null;
  }
  function fiyatIndex(urun) {
    var l = C.fiyatlar || [];
    for (var i = 0; i < l.length; i++) if (l[i].urun === urun) return i;
    return -1;
  }
  function olcuIndex(ad) {
    var l = (C.sepet && C.sepet.olculer) || [];
    for (var i = 0; i < l.length; i++) if (l[i].ad === ad) return i;
    return -1;
  }
  /* Sepet satiri dizinle saklanir: dil degisince urun adi da degisir ama
     dizin sabit kalir. Eski (ada gore) kayitlar acilista dizine cevrilir. */
  function satirUrun(x) { var f = (C.fiyatlar || [])[x.ui]; return f ? f.urun : (x.urun || ''); }
  function satirOlcu(x) {
    if (porsiyonlumu(satirUrun(x))) return T('porsiyon');
    var o = ((C.sepet && C.sepet.olculer) || [])[x.oi];
    return o ? o.ad : (x.olcu || '');
  }""")

# --- 2) satır hesabı ---------------------------------------------------------
degis("""  /** Tek satırın tutarı ve ağırlığı. */
  function satirHesap(s) {
    var f = fiyatSatiri(s.urun);
    if (!f) return { tutar: 0, kg: 0 };
    if (porsiyonlumu(s.urun)) {
      return { tutar: paraOku(f.tam) * s.adet, kg: 0.25 * s.adet };
    }
    var olcu = (C.sepet.olculer || []).filter(function (o) { return o.ad === s.olcu; })[0];
    if (!olcu) olcu = { kg: 1, carpan: 1 };
    return { tutar: paraOku(f.kg) * olcu.carpan * s.adet, kg: olcu.kg * s.adet };
  }""",
"""  /** Tek satırın tutarı ve ağırlığı. */
  function satirHesap(x) {
    var f = (C.fiyatlar || [])[x.ui];
    if (!f) return { tutar: 0, kg: 0 };
    if (porsiyonlumu(f.urun)) {
      return { tutar: paraOku(f.tam) * x.adet, kg: 0.25 * x.adet };
    }
    var olcu = ((C.sepet && C.sepet.olculer) || [])[x.oi] || { kg: 1, carpan: 1 };
    return { tutar: paraOku(f.kg) * olcu.carpan * x.adet, kg: olcu.kg * x.adet };
  }""")

# --- 3) hediye seçimleri dizinle ---------------------------------------------
degis("""    (C.hediye && C.hediye.secenekler || []).forEach(function (h) {
      if (secilenHediye.indexOf(h.ad) > -1) tutar += h.ucret;
    });""",
"""    (C.hediye && C.hediye.secenekler || []).forEach(function (h, i) {
      if (secilenHediye.indexOf(i) > -1) tutar += h.ucret;
    });""")

# --- 4) yükleme / göç --------------------------------------------------------
degis("""      var v = JSON.parse(ham);
      sepet = Array.isArray(v.satirlar) ? v.satirlar : [];
      secilenHediye = Array.isArray(v.hediye) ? v.hediye : [];""",
"""      var v = JSON.parse(ham);
      sepet = (Array.isArray(v.satirlar) ? v.satirlar : []).map(function (x) {
        if (typeof x.ui !== 'number') { x.ui = fiyatIndex(x.urun); x.oi = olcuIndex(x.olcu); }
        return x;
      }).filter(function (x) { return x.ui > -1; });
      secilenHediye = (Array.isArray(v.hediye) ? v.hediye : [])
        .filter(function (h) { return typeof h === 'number'; });""")

# --- 5) sepete ekleme --------------------------------------------------------
degis("""  function sepeteEkle(urun, olcu, adet) {
    adet = adet || 1;
    var v = sepet.filter(function (s) { return s.urun === urun && s.olcu === olcu; })[0];
    if (v) v.adet += adet;
    else sepet.push({ urun: urun, olcu: olcu, adet: adet });""",
"""  function sepeteEkle(urun, olcu, adet) {
    adet = adet || 1;
    var ui = fiyatIndex(urun);
    if (ui < 0) return;
    var oi = porsiyonlumu(urun) ? -1 : olcuIndex(olcu);
    var v = sepet.filter(function (x) { return x.ui === ui && x.oi === oi; })[0];
    if (v) v.adet += adet;
    else sepet.push({ ui: ui, oi: oi, adet: adet });""")

# --- 6) satır çizimi ---------------------------------------------------------
degis("""      liste.innerHTML = sepet.map(function (s, i) {
        var h = satirHesap(s);
        var por = porsiyonlumu(s.urun);
        return '<li class="cart-row">' +
          '<div class="cart-row-main">' +
            '<b>' + esc(s.urun) + '</b>' +
            '<span>' + (por ? esc(T('porsiyon')) : esc(s.olcu)) + ' · ' + paraYaz(h.tutar / s.adet) + '</span>' +
          '</div>' +""",
"""      liste.innerHTML = sepet.map(function (x, i) {
        var h = satirHesap(x);
        return '<li class="cart-row">' +
          '<div class="cart-row-main">' +
            '<b>' + esc(satirUrun(x)) + '</b>' +
            '<span>' + esc(satirOlcu(x)) + ' · <bdi>' + paraYaz(h.tutar / x.adet) + '</bdi></span>' +
          '</div>' +""")

degis("""            '<span>' + s.adet + '</span>' +""",
"""            '<span>' + x.adet + '</span>' +""")

degis("""          '<b class="cart-row-sum">' + paraYaz(h.tutar) + '</b>' +""",
"""          '<b class="cart-row-sum"><bdi>' + paraYaz(h.tutar) + '</bdi></b>' +""")

# --- 7) hediye kutucukları ---------------------------------------------------
degis("""        var on = secilenHediye.indexOf(h.ad) > -1;
        return '<label class="gift"><input type="checkbox" data-gift="' + i + '"' + (on ? ' checked' : '') + '>' +
          '<span>' + esc(h.ad) + '</span><b>+' + paraYaz(h.ucret) + '</b></label>';""",
"""        var on = secilenHediye.indexOf(i) > -1;
        return '<label class="gift"><input type="checkbox" data-gift="' + i + '"' + (on ? ' checked' : '') + '>' +
          '<span>' + esc(h.ad) + '</span><b><bdi>+' + paraYaz(h.ucret) + '</bdi></b></label>';""")

degis("""      var ad = (C.hediye.secenekler || [])[+g.dataset.gift].ad;
      var i = secilenHediye.indexOf(ad);
      if (g.checked && i < 0) secilenHediye.push(ad);
      if (!g.checked && i > -1) secilenHediye.splice(i, 1);""",
"""      var no = +g.dataset.gift;
      var i = secilenHediye.indexOf(no);
      if (g.checked && i < 0) secilenHediye.push(no);
      if (!g.checked && i > -1) secilenHediye.splice(i, 1);""")

# --- 8) özet satırları -------------------------------------------------------
degis("""    var ozet = '<div class="cart-line"><span>' + esc(T('Ara toplam')) + '</span><b>' + paraYaz(t.tutar) + '</b></div>';
    if (kargo) {
      ozet += '<div class="cart-line"><span>' + esc(T('Kargo')) + ' · ' + esc(kargo.bolge ? kargo.bolge.gun : '') + '</span><b>' +
        (kargo.bedava ? esc(T('Ücretsiz')) : paraYaz(kargo.ucret)) + '</b></div>';
    }
    ozet += '<div class="cart-line cart-line--big"><span>' + esc(T('Toplam')) + '</span><b>' +
      paraYaz(t.tutar + (kargo && !kargo.bedava ? kargo.ucret : 0)) + '</b></div>';
    if (t.kg) ozet += '<p class="cart-kg">' + esc(T('Yaklaşık ağırlık')) + ': ' + t.kg.toFixed(2).replace('.', ',') + ' kg</p>';""",
"""    var ozet = '<div class="cart-line"><span>' + esc(T('Ara toplam')) + '</span><b><bdi>' + paraYaz(t.tutar) + '</bdi></b></div>';
    if (kargo) {
      ozet += '<div class="cart-line"><span>' + esc(T('Kargo')) + ' · ' + esc(kargo.bolge ? kargo.bolge.gun : '') + '</span><b><bdi>' +
        (kargo.bedava ? esc(T('Ücretsiz')) : paraYaz(kargo.ucret)) + '</bdi></b></div>';
    }
    ozet += '<div class="cart-line cart-line--big"><span>' + esc(T('Toplam')) + '</span><b><bdi>' +
      paraYaz(t.tutar + (kargo && !kargo.bedava ? kargo.ucret : 0)) + '</bdi></b></div>';
    if (t.kg) ozet += '<p class="cart-kg">' + esc(T('Yaklaşık ağırlık')) + ': <bdi>' + t.kg.toFixed(2).replace('.', ',') + ' kg</bdi></p>';""")

# --- 9) WhatsApp mesajı ------------------------------------------------------
degis("""    var satirlar = sepet.map(function (s) {
      var h = satirHesap(s);
      return '• ' + s.urun + ' — ' + s.olcu + ' × ' + s.adet + ' = ' + paraYaz(h.tutar);
    });
    secilenHediye.forEach(function (ad) {
      var h = (C.hediye.secenekler || []).filter(function (x) { return x.ad === ad; })[0];
      satirlar.push('• ' + ad + ' = ' + paraYaz(h ? h.ucret : 0));
    });""",
"""    var satirlar = sepet.map(function (x) {
      var h = satirHesap(x);
      return '• ' + satirUrun(x) + ' — ' + satirOlcu(x) + ' × ' + x.adet + ' = ' + paraYaz(h.tutar);
    });
    secilenHediye.forEach(function (no) {
      var h = ((C.hediye && C.hediye.secenekler) || [])[no];
      if (h) satirlar.push('• ' + h.ad + ' = ' + paraYaz(h.ucret));
    });""")

# --- 10) kargo hesaplayıcı ve fiyat etiketi ----------------------------------
degis("""      out.innerHTML = '<b>' + paraYaz(r.ucret) + '</b> · ' + esc(b ? b.ad : '') + ' · ' + esc(b ? b.gun : '') +
        '<span class="ship-free">' + esc(T('Sipariş tutarı')) + ' ' + paraYaz(C.kargoTarife.ucretsizUstu) + ' ' +""",
"""      out.innerHTML = '<b><bdi>' + paraYaz(r.ucret) + '</bdi></b> · ' + esc(b ? b.ad : '') + ' · ' + esc(b ? b.gun : '') +
        '<span class="ship-free">' + esc(T('Sipariş tutarı')) + ' <bdi>' + paraYaz(C.kargoTarife.ucretsizUstu) + '</bdi> ' +""")

degis("""      var fiyatEt = el('span', 'pcard-price', paraOku(f.kg) ? paraYaz(paraOku(f.kg)) + ' / kg' : paraYaz(paraOku(f.tam)));""",
"""      var fiyatEt = el('span', 'pcard-price');
      fiyatEt.innerHTML = '<bdi>' + (paraOku(f.kg) ? paraYaz(paraOku(f.kg)) + ' / kg' : paraYaz(paraOku(f.tam))) + '</bdi>';""")

# --- 11) sihirbaz fiyatı -----------------------------------------------------
degis("""              (fs ? '<p class="wz-price">' + esc(r.o) + ' · ' + paraYaz(paraOku(fs.kg) * ((C.sepet.olculer || []).filter(function (o) { return o.ad === r.o; })[0] || { carpan: 1 }).carpan) + '</p>' : '') +""",
"""              (fs ? '<p class="wz-price">' + esc(r.o) + ' · <bdi>' + paraYaz(paraOku(fs.kg) * ((C.sepet.olculer || []).filter(function (o) { return o.ad === r.o; })[0] || { carpan: 1 }).carpan) + '</bdi></p>' : '') +""")

if s == orj:
    print('DEGISIKLIK YOK'); sys.exit(1)
io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
print('shop.js yamalandi, %d degisiklik' % n)
