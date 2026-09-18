/* =========================================================================
   ALİ USTA BAKLAVALARI — TİCARET MODÜLÜ

   Sepet · canlı fiyat hesaplayıcı · kargo hesaplayıcı · hediye paketi ·
   alerjen filtresi · ürün karşılaştırma · tatlı sihirbazı · sipariş takibi.

   Sunucu yok: sepet localStorage'da tutulur, sipariş tek WhatsApp mesajı
   olarak gider. Fiyatlar assets/js/config.js dosyasından okunur.
   ========================================================================= */
(function () {
  'use strict';

  var W = window, D = document;
  var C = W.AU_CONFIG || {};
  var M = W.AU_MEDIA || {};
  var A = null;                    // site.js arayüzü (au:ready ile gelir)

  var SEPET_ANAHTAR = 'aliusta.sepet.v2';
  var VARSAYILAN_OLCU = 2;          // C.sepet.olculer icinde '1 kg'
  var sepet = [];

  /* ---------------------------------------------------------------
     0. Yardımcılar
     --------------------------------------------------------------- */
  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function T(s) { return A && A.T ? A.T(s) : s; }

  /* ScrollTrigger.refresh() pahalıdır (tüm tetikleyicileri yeniden ölçer).
     Etkileşim karesinde çağrılırsa INP fırlar; bu yüzden bir sonraki boyama
     sonrasına ertelenir ve üst üste gelen istekler tek çağrıda birleşir. */
  var tazeleZ = 0;
  function tazeleGec() {
    if (tazeleZ) clearTimeout(tazeleZ);
    tazeleZ = setTimeout(function () {
      tazeleZ = 0;
      if (A) A.sonraYap(function () { A.tazele(); });
    }, 260);
  }
  function el(t, c, x) { var n = D.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; }

  /** "1.150 ₺" → 1150 */
  function paraOku(v) {
    if (typeof v === 'number') return v;
    var s = String(v || '').replace(/[^\d,.]/g, '').replace(/\./g, '').replace(',', '.');
    var n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }
  function paraYaz(n) {
    return Math.round(n).toLocaleString('tr-TR') + ' ₺';
  }

  var URUN_ALIAS = {
    'Dürüm Baklava': 'Klasik Baklava',
    'Burma Kadayıf': 'Klasik Baklava',
    'Hasır Künefe': 'Klasik Baklava',
    'Özel Kare': 'Klasik Baklava',
    'Yaprak Şöbiyet': 'Yeşil Şöbiyet',
    'Saray Dolması': 'Dolama',
    'Saray Sarması': 'Dolama',
    'Antep Özel': 'Klasik Baklava',
    'Fıstıkzade Künefe ve Yarı Fıstıkzade Yarı Billuriye': 'Fıstıkzade',
    'Fıstıkzade Künefe': 'Fıstıkzade'
  };

  function fiyatSatiri(urun) {
    var u = URUN_ALIAS[urun] || urun;
    return (C.fiyatlar || []).filter(function (f) { return f.urun === u || f.urun === urun; })[0] || null;
  }
  function fiyatIndex(urun) {
    var l = C.fiyatlar || [];
    var u = URUN_ALIAS[urun] || urun;
    for (var i = 0; i < l.length; i++) if (l[i].urun === urun || l[i].urun === u) return i;
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
  }
  function porsiyonlumu(urun) {
    return (C.sepet && C.sepet.porsiyonlu || []).indexOf(urun) > -1;
  }

  /** "Tepsi" ölçüsünün tutarı: kg fiyatının sabit katı DEĞİL, ürünün
      fiyat tablosundaki kendi tepsi/tam değeri — ürünler arası oran
      (2,25–2,45 arası) sabit olmadığı için kg×çarpan yanlış sonuç verirdi. */
  function tepsiFiyati(f) {
    var v = f.tepsi || f.tam;
    return v ? paraOku(v) : null;
  }

  /** Tek satırın tutarı ve ağırlığı. */
  function satirHesap(x) {
    var f = (C.fiyatlar || [])[x.ui];
    if (!f) return { tutar: 0, kg: 0 };
    if (porsiyonlumu(f.urun)) {
      return { tutar: paraOku(f.tam) * x.adet, kg: 0.25 * x.adet };
    }
    var olcu = ((C.sepet && C.sepet.olculer) || [])[x.oi] || { kg: 1, carpan: 1 };
    if (olcu.ad === 'Tepsi') {
      var tf = tepsiFiyati(f);
      if (tf != null) return { tutar: tf * x.adet, kg: olcu.kg * x.adet };
    }
    return { tutar: paraOku(f.kg) * olcu.carpan * x.adet, kg: olcu.kg * x.adet };
  }

  function sepetToplam() {
    var tutar = 0, kg = 0, adet = 0;
    sepet.forEach(function (s) {
      var h = satirHesap(s);
      tutar += h.tutar; kg += h.kg; adet += s.adet;
    });
    (C.hediye && C.hediye.secenekler || []).forEach(function (h, i) {
      if (secilenHediye.indexOf(i) > -1) tutar += h.ucret;
    });
    return { tutar: tutar, kg: kg, adet: adet };
  }

  /* ---------------------------------------------------------------
     1. Sepet deposu
     --------------------------------------------------------------- */
  var secilenHediye = [];

  function sepetYukle() {
    try {
      var ham = localStorage.getItem(SEPET_ANAHTAR);
      if (!ham) return;
      var v = JSON.parse(ham);
      sepet = (Array.isArray(v.satirlar) ? v.satirlar : []).map(function (x) {
        if (typeof x.ui !== 'number') { x.ui = fiyatIndex(x.urun); x.oi = olcuIndex(x.olcu); }
        return x;
      }).filter(function (x) { return x.ui > -1; });
      secilenHediye = (Array.isArray(v.hediye) ? v.hediye : [])
        .filter(function (h) { return typeof h === 'number'; });
    } catch (e) { sepet = []; secilenHediye = []; }
  }
  function sepetKaydet() {
    try {
      localStorage.setItem(SEPET_ANAHTAR, JSON.stringify({ satirlar: sepet, hediye: secilenHediye }));
    } catch (e) { /* özel sekmede yazılamaz — sepet oturumluk kalır */ }
  }

  function sepeteEkle(urun, olcu, adet) {
    adet = adet || 1;
    var ui = fiyatIndex(urun);
    if (ui < 0) return;
    /* olcu null gelirse varsayilan olcu (1 kg) kullanilir; dil ne olursa olsun
       dizin sabit oldugu icin ceviriden etkilenmez. */
    var oi = porsiyonlumu(urun) ? -1 : (olcu == null ? VARSAYILAN_OLCU : olcuIndex(olcu));
    if (oi < 0 && !porsiyonlumu(urun)) oi = VARSAYILAN_OLCU;
    var v = sepet.filter(function (x) { return x.ui === ui && x.oi === oi; })[0];
    if (v) v.adet += adet;
    else sepet.push({ ui: ui, oi: oi, adet: adet });
    sepetKaydet();
    sepetCiz();
    rozetOynat();
    if (A) A.izle('sepete-ekle');
  }
  function sepettenCikar(i) { sepet.splice(i, 1); sepetKaydet(); sepetCiz(); }
  function adetDegistir(i, d) {
    sepet[i].adet = Math.max(1, Math.min(99, sepet[i].adet + d));
    sepetKaydet(); sepetCiz();
  }

  /* ---------------------------------------------------------------
     2. Kargo hesaplayıcı
     --------------------------------------------------------------- */
  function bolgeBul(il) {
    var b = (C.kargoTarife.bolgeler || []).filter(function (x) { return x.iller.indexOf(il) > -1; })[0];
    return b || (C.kargoTarife.bolgeler || [])[1] || null;
  }
  function kargoHesap(kg, il, tutar) {
    var t = C.kargoTarife;
    if (!t) return null;
    if (t.ucretsizUstu && tutar >= t.ucretsizUstu) {
      return { ucret: 0, bedava: true, bolge: bolgeBul(il) };
    }
    var kad = t.kademeler || [];
    var temel = kad.length ? kad[kad.length - 1].ucret : 0;
    var son = kad.length ? kad[kad.length - 1].kg : 0;
    for (var i = 0; i < kad.length; i++) {
      if (kg <= kad[i].kg) { temel = kad[i].ucret; son = 0; break; }
    }
    if (son && kg > son) temel += Math.ceil(kg - son) * (t.kgBasiEk || 0);
    var b = bolgeBul(il);
    return { ucret: Math.round(temel * (b ? b.carpan : 1)), bedava: false, bolge: b };
  }

  var TUM_ILLER = (function () {
    var a = [];
    (C.kargoTarife && C.kargoTarife.bolgeler || []).forEach(function (b) {
      b.iller.forEach(function (i) { if (a.indexOf(i) < 0) a.push(i); });
    });
    return a.sort(function (x, y) { return x.localeCompare(y, 'tr'); });
  })();

  /* ---------------------------------------------------------------
     3. Sepet paneli — çizim
     --------------------------------------------------------------- */
  var panel, rozet;

  function sepetCiz() {
    if (!panel) return;
    var liste = $('#cartList', panel);
    var bos = $('#cartEmpty', panel);

    if (!sepet.length) {
      liste.innerHTML = '';
      bos.hidden = false;
    } else {
      bos.hidden = true;
      liste.innerHTML = sepet.map(function (x, i) {
        var h = satirHesap(x);
        return '<li class="cart-row">' +
          '<div class="cart-row-main">' +
            '<b>' + esc(satirUrun(x)) + '</b>' +
            '<span>' + esc(satirOlcu(x)) + ' · <bdi>' + paraYaz(h.tutar / x.adet) + '</bdi></span>' +
          '</div>' +
          '<div class="cart-qty">' +
            '<button type="button" data-eksi="' + i + '" aria-label="' + esc(T('Azalt')) + '">−</button>' +
            '<span>' + x.adet + '</span>' +
            '<button type="button" data-arti="' + i + '" aria-label="' + esc(T('Artır')) + '">+</button>' +
          '</div>' +
          '<b class="cart-row-sum"><bdi>' + paraYaz(h.tutar) + '</bdi></b>' +
          '<button class="cart-del" type="button" data-sil="' + i + '" aria-label="' + esc(T('Satırı sil')) + '">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '</li>';
      }).join('');
    }

    // hediye seçenekleri
    var hd = $('#cartGift', panel);
    if (hd && C.hediye && C.hediye.acik) {
      hd.innerHTML = (C.hediye.secenekler || []).map(function (h, i) {
        var on = secilenHediye.indexOf(i) > -1;
        return '<label class="gift"><input type="checkbox" data-gift="' + i + '"' + (on ? ' checked' : '') + '>' +
          '<span>' + esc(h.ad) + '</span><b><bdi>+' + paraYaz(h.ucret) + '</bdi></b></label>';
      }).join('');
    }

    var t = sepetToplam();
    var teslim = $('#cartTeslim', panel).value;
    var il = $('#cartIl', panel).value;
    var kargo = (teslim === 'Kargo' && il) ? kargoHesap(t.kg, il, t.tutar) : null;

    $('#cartIlWrap', panel).hidden = teslim !== 'Kargo';

    var ozet = '<div class="cart-line"><span>' + esc(T('Ara toplam')) + '</span><b><bdi>' + paraYaz(t.tutar) + '</bdi></b></div>';
    if (kargo) {
      ozet += '<div class="cart-line"><span>' + esc(T('Kargo')) + ' · ' + esc(kargo.bolge ? kargo.bolge.gun : '') + '</span><b><bdi>' +
        (kargo.bedava ? esc(T('Ücretsiz')) : paraYaz(kargo.ucret)) + '</bdi></b></div>';
    }
    ozet += '<div class="cart-line cart-line--big"><span>' + esc(T('Toplam')) + '</span><b><bdi>' +
      paraYaz(t.tutar + (kargo && !kargo.bedava ? kargo.ucret : 0)) + '</bdi></b></div>';
    if (t.kg) ozet += '<p class="cart-kg">' + esc(T('Yaklaşık ağırlık')) + ': <bdi>' + t.kg.toFixed(2).replace('.', ',') + ' kg</bdi></p>';
    $('#cartSum', panel).innerHTML = ozet;

    $('#cartSend', panel).disabled = !sepet.length;
    rozetGuncelle(t.adet);
  }

  function rozetGuncelle(n) {
    if (!rozet) return;
    n = n || 0;
    rozet.dataset.n = n;
    rozet.hidden = false;
    /* Rakam aria-hidden; sayı erişilebilir ada yazılır — böylece görünen
       etiket ile erişilebilir ad çelişmez (WCAG 2.5.3). */
    $('.cart-count', rozet).textContent = n;
    rozet.setAttribute('aria-label', n
      ? T('Sepeti aç') + ' — ' + n + ' ' + T('ürün')
      : T('Sepeti aç'));
    rozet.classList.toggle('is-empty', !n);
  }
  function rozetOynat() {
    if (!rozet) return;
    rozet.classList.remove('pop');
    void rozet.offsetWidth;
    rozet.classList.add('pop');
  }

  /* ---------------------------------------------------------------
     4. Sepet paneli — kurulum
     --------------------------------------------------------------- */
  function sepetKur() {
    if (!(C.sepet && C.sepet.acik)) return;

    // yüzen rozet
    rozet = el('button', 'cart-fab is-empty');
    rozet.type = 'button';
    rozet.hidden = true;
    rozet.setAttribute('aria-label', T('Sepeti aç'));
    rozet.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2.2l2.1 10.4a2 2 0 0 0 2 1.6h7.1a2 2 0 0 0 2-1.6L21 8H7"/>' +
      '<circle cx="10" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>' +
      '<span class="cart-count" aria-hidden="true">0</span>';
    D.body.appendChild(rozet);

    // panel
    panel = el('div', 'cart-panel');
    panel.id = 'cart';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', T('Sepet'));
    panel.setAttribute('aria-hidden', 'true');

    var urunler = (C.fiyatlar || []).map(function (f) { return f.urun; });
    var olculer = (C.sepet.olculer || []).map(function (o) { return o.ad; });

    panel.innerHTML =
      '<div class="cart-box">' +
        '<div class="cart-head">' +
          '<div><p class="eyebrow eyebrow--plain">' + esc(T('Sepet')) + '</p>' +
          '<h3>' + esc(T('Siparişinizi hazırlayın')) + '</h3></div>' +
          '<button class="icon-btn" type="button" id="cartClose"><span class="sr-only">' + esc(T('Kapat')) + '</span>' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '</div>' +

        '<div class="cart-add">' +
          '<p class="f"><label for="cartUrun">' + esc(T('Ürün')) + '</label>' +
            '<select id="cartUrun">' + urunler.map(function (u) {
              return '<option>' + esc(u) + '</option>'; }).join('') + '</select></p>' +
          '<p class="f" id="cartOlcuWrap"><label for="cartOlcu">' + esc(T('Ölçü')) + '</label>' +
            '<select id="cartOlcu">' + olculer.map(function (o, i) {
              return '<option' + (i === 2 ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select></p>' +
          '<p class="f f--sm"><label for="cartAdet">' + esc(T('Adet')) + '</label>' +
            '<input id="cartAdet" type="number" min="1" max="99" value="1"></p>' +
          '<button class="btn btn--solid" type="button" id="cartAdd"><span>' + esc(T('Sepete ekle')) + '</span></button>' +
        '</div>' +

        '<div class="cart-body">' +
          '<ul class="cart-list" id="cartList"></ul>' +
          '<p class="cart-empty" id="cartEmpty">' + esc(T('Sepetiniz boş. Yukarıdan ürün ekleyin ya da ürün kartlarındaki “Sepete ekle” düğmesini kullanın.')) + '</p>' +

          '<div class="cart-gift" id="cartGiftWrap">' +
            '<p class="cart-sub">' + esc(T('Hediye paketi')) + '</p>' +
            '<div id="cartGift"></div>' +
            '<p class="small">' + esc(C.hediye && C.hediye.not || '') + '</p>' +
          '</div>' +

          '<div class="cart-ship">' +
            '<p class="f"><label for="cartTeslim">' + esc(T('Teslim')) + '</label>' +
              '<select id="cartTeslim">' +
                '<option value="Dükkândan teslim">' + esc(T('Dükkândan alacağım')) + '</option>' +
                '<option value="Kargo">' + esc(T('Kargo ile gönderilsin')) + '</option>' +
              '</select></p>' +
            '<p class="f" id="cartIlWrap" hidden><label for="cartIl">' + esc(T('İl')) + '</label>' +
              '<select id="cartIl"><option value="">' + esc(T('Seçin')) + '</option>' +
                TUM_ILLER.map(function (i) { return '<option>' + esc(i) + '</option>'; }).join('') +
              '</select></p>' +
          '</div>' +
        '</div>' +

        '<div class="cart-foot">' +
          '<div class="cart-sum" id="cartSum"></div>' +
          '<button class="btn btn--lg btn--wa" type="button" id="cartSend"><span>' + esc(T('WhatsApp’tan sipariş ver')) + '</span></button>' +
          '<p class="small">' + esc(C.sepet.not || '') + '</p>' +
        '</div>' +
      '</div>';
    D.body.appendChild(panel);

    // olaylar
    rozet.addEventListener('click', sepetAc);
    $('#cartClose', panel).addEventListener('click', sepetKapat);
    panel.addEventListener('click', function (e) { if (e.target === panel) sepetKapat(); });

    $('#cartUrun', panel).addEventListener('change', function () {
      $('#cartOlcuWrap', panel).hidden = porsiyonlumu(this.value);
    });
    $('#cartAdd', panel).addEventListener('click', function () {
      var u = $('#cartUrun', panel).value;
      var sel = $('#cartOlcu', panel);
      var o = porsiyonlumu(u) ? null : (((C.sepet.olculer || [])[sel.selectedIndex] || {}).ad);
      sepeteEkle(u, o, parseInt($('#cartAdet', panel).value, 10) || 1);
    });
    $('#cartTeslim', panel).addEventListener('change', sepetCiz);
    $('#cartIl', panel).addEventListener('change', sepetCiz);

    panel.addEventListener('click', function (e) {
      var b = e.target.closest('[data-sil],[data-arti],[data-eksi]');
      if (!b) return;
      if (b.dataset.sil !== undefined) sepettenCikar(+b.dataset.sil);
      else if (b.dataset.arti !== undefined) adetDegistir(+b.dataset.arti, 1);
      else adetDegistir(+b.dataset.eksi, -1);
    });
    panel.addEventListener('change', function (e) {
      var g = e.target.closest('[data-gift]');
      if (!g) return;
      var no = +g.dataset.gift;
      var i = secilenHediye.indexOf(no);
      if (g.checked && i < 0) secilenHediye.push(no);
      if (!g.checked && i > -1) secilenHediye.splice(i, 1);
      sepetKaydet(); sepetCiz();
    });

    $('#cartSend', panel).addEventListener('click', siparisGonder);

    D.addEventListener('keydown', function (e) {
      if (!panel.classList.contains('open')) return;
      if (e.key === 'Escape') { sepetKapat(); return; }
      if (e.key === 'Tab') {
        var f = $$('button, input, select', panel).filter(function (x) {
          return !x.disabled && !x.closest('[hidden]') && x.offsetParent !== null;
        });
        if (!f.length) return;
        if (e.shiftKey && D.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && D.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });

    if (C.hediye && !C.hediye.acik) $('#cartGiftWrap', panel).hidden = true;

    sepetYukle();
    sepetCiz();
  }

  var sepetSonOdak = null;
  function sepetAc() {
    sepetSonOdak = D.activeElement;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    if (A) A.kilitle(true);
    W.requestAnimationFrame(function () { $('#cartClose', panel).focus(); });
    if (A) A.izle('sepet-ac');
  }
  function sepetKapat() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    if (A) A.kilitle(false);
    if (A && A.odakGeri) A.odakGeri(sepetSonOdak, panel);
    else if (sepetSonOdak) sepetSonOdak.focus();
  }

  function siparisGonder() {
    if (!sepet.length) return;
    var t = sepetToplam();
    var teslim = $('#cartTeslim', panel).value;
    var il = $('#cartIl', panel).value;
    var kargo = (teslim === 'Kargo' && il) ? kargoHesap(t.kg, il, t.tutar) : null;

    var satirlar = sepet.map(function (x) {
      var h = satirHesap(x);
      return '• ' + satirUrun(x) + ' — ' + satirOlcu(x) + ' × ' + x.adet + ' = ' + paraYaz(h.tutar);
    });
    secilenHediye.forEach(function (no) {
      var h = ((C.hediye && C.hediye.secenekler) || [])[no];
      if (h) satirlar.push('• ' + h.ad + ' = ' + paraYaz(h.ucret));
    });

    var mesaj = ['*Ali Usta — Sipariş*', ''].concat(satirlar).concat([
      '',
      'Ara toplam: ' + paraYaz(t.tutar),
      teslim === 'Kargo'
        ? 'Teslim: Kargo — ' + il + (kargo ? ' (' + (kargo.bedava ? 'ücretsiz' : paraYaz(kargo.ucret)) + ', ' + kargo.bolge.gun + ')' : '')
        : 'Teslim: Dükkândan alacağım',
      'TOPLAM: ' + paraYaz(t.tutar + (kargo && !kargo.bedava ? kargo.ucret : 0)),
      'Yaklaşık ağırlık: ' + t.kg.toFixed(2).replace('.', ',') + ' kg',
      '',
      '(Tutarlar sitedeki tahmini fiyatlardan hesaplandı.)'
    ]).join('\n');

    if (A) { A.web3Gonder('Web sitesi — sepet siparişi', mesaj); A.waAc(mesaj); A.izle('sepet-siparis'); }
  }

  /* ---------------------------------------------------------------
     5. Ürün kartlarına "Sepete ekle"
     --------------------------------------------------------------- */
  /* Kartlardaki fiyat ve "Sepete ekle" düğmesi site.js tarafından ilk
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
  }

  D.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var ad = b.dataset.add;
    sepeteEkle(ad, null, 1);
    b.classList.add('added');
    var eski = b.textContent;
    b.textContent = T('Eklendi ✓');
    setTimeout(function () { b.textContent = eski; b.classList.remove('added'); }, 1400);
  });

  /* ---------------------------------------------------------------
     7. Ürün karşılaştırma
     --------------------------------------------------------------- */
  var karsi = [];
  /* "Karşılaştır" düğmesi de kartla birlikte gelir; eksikse tamamlanır. */
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
  }
  D.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cmp]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var ad = b.dataset.cmp, i = karsi.indexOf(ad);
    if (i > -1) { karsi.splice(i, 1); b.setAttribute('aria-pressed', 'false'); }
    else {
      if (karsi.length >= 3) { karsiUyar(); return; }
      karsi.push(ad); b.setAttribute('aria-pressed', 'true');
    }
    karsiCiz();
  });
  function karsiUyar() {
    var t = $('#cmpBar');
    if (!t) return;
    t.classList.remove('warn'); void t.offsetWidth; t.classList.add('warn');
  }
  function karsiCiz() {
    var bar = $('#cmpBar');
    if (!bar) {
      bar = el('div', 'cmp-bar');
      bar.id = 'cmpBar';
      D.body.appendChild(bar);
      bar.addEventListener('click', function (e) {
        if (e.target.closest('#cmpOpen')) karsiAc();
        if (e.target.closest('#cmpClear')) {
          karsi = [];
          $$('[data-cmp]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          karsiCiz();
        }
      });
    }
    if (!karsi.length) { bar.classList.remove('on'); return; }
    bar.classList.add('on');
    bar.innerHTML =
      '<span class="cmp-n">' + karsi.length + '/3</span>' +
      '<span class="cmp-list">' + karsi.map(esc).join(' · ') + '</span>' +
      '<button class="btn btn--solid" type="button" id="cmpOpen"><span>' + esc(T('Karşılaştır')) + '</span></button>' +
      '<button class="cmp-x" type="button" id="cmpClear" aria-label="' + esc(T('Temizle')) + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
  }

  function karsiAc() {
    var dlg = $('#cmp');
    if (!dlg) {
      dlg = el('div', 'cmp-dlg');
      dlg.id = 'cmp';
      dlg.setAttribute('role', 'dialog');
      dlg.setAttribute('aria-modal', 'true');
      dlg.setAttribute('aria-label', T('Ürün karşılaştırma'));
      D.body.appendChild(dlg);
      dlg.addEventListener('click', function (e) {
        if (e.target === dlg || e.target.closest('#cmpClose2')) {
          dlg.classList.remove('open');
          if (A) { A.kilitle(false); if (A.odakGeri) A.odakGeri(null, dlg); }
        }
      });
    }
    var SATIR = [
      { ad: T('Fiyat / kg'), f: function (u) { var x = fiyatSatiri(u); return x ? (paraOku(x.kg) ? paraYaz(paraOku(x.kg)) : '—') : '—'; } },
      { ad: T('İçindekiler'), f: function (u) { return (C.urunDetay[u] || {}).icindekiler || '—'; } },
      { ad: T('Alerjen'), f: function (u) { return ((C.urunDetay[u] || {}).alerjen || []).join(', ') || '—'; } },
      { ad: T('Saklama'), f: function (u) { return (C.urunDetay[u] || {}).saklama || '—'; } },
      { ad: T('Raf ömrü'), f: function (u) { return (C.urunDetay[u] || {}).raf || '—'; } },
      { ad: T('Porsiyon'), f: function (u) { return (C.urunDetay[u] || {}).porsiyon || '—'; } },
      { ad: T('Kargoya uygunluk'), f: function (u) {
          var r = ((C.urunDetay[u] || {}).raf || '');
          if (/10–15/.test(r)) return T('Çok uygun');
          if (/2 gün/.test(r)) return T('Uygun değil — kaymaklı');
          return T('Uygun');
        } }
    ];
    function foto(u) {
      var r = (M.rail || []).filter(function (x) { return x.name === u; })[0];
      return r ? r.photos[0] : null;
    }
    dlg.innerHTML = '<div class="cmp-box">' +
      '<div class="cmp-head"><h3>' + esc(T('Ürün karşılaştırma')) + '</h3>' +
        '<button class="icon-btn" type="button" id="cmpClose2"><span class="sr-only">' + esc(T('Kapat')) + '</span>' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="cmp-scroll"><table class="cmp-table"><thead><tr><th></th>' +
        karsi.map(function (u) {
          var f = foto(u);
          return '<th><span class="cmp-th">' +
            (f && A ? A.pic(f, ' alt="" loading="lazy" decoding="async"') : '') +
            esc(u) + '</span></th>';
        }).join('') + '</tr></thead><tbody>' +
        SATIR.map(function (s) {
          return '<tr><th scope="row">' + esc(s.ad) + '</th>' +
            karsi.map(function (u) { return '<td>' + esc(s.f(u)) + '</td>'; }).join('') + '</tr>';
        }).join('') +
        '<tr><th scope="row"></th>' + karsi.map(function (u) {
          return '<td><button class="mini mini--add" type="button" data-add="' + esc(u) + '">' + esc(T('Sepete ekle')) + '</button></td>';
        }).join('') + '</tr>' +
      '</tbody></table></div></div>';
    dlg.classList.add('open');
    if (A) { A.kilitle(true); A.izle('karsilastirma'); }
  }

  /* ---------------------------------------------------------------
     8. "Bana bir tatlı seç" sihirbazı
     --------------------------------------------------------------- */
  var SORULAR = [
    { s: 'Kaç kişilik?', k: 'kisi',
      c: [{ a: '1–4 kişi', v: 'az' }, { a: '5–15 kişi', v: 'orta' }, { a: '15+ kişi', v: 'cok' }] },
    { s: 'Nasıl teslim alacaksınız?', k: 'teslim',
      c: [{ a: 'Dükkândan', v: 'yerinde' }, { a: 'Kargoyla', v: 'kargo' }] },
    { s: 'Sütlü / kaymaklı sever misiniz?', k: 'kaymak',
      c: [{ a: 'Evet, bayılırım', v: 'evet' }, { a: 'Hayır, klasik olsun', v: 'hayir' }, { a: 'Fark etmez', v: 'farketmez' }] }
  ];

  function oner(c) {
    if (c.teslim === 'kargo') {
      return c.kisi === 'cok'
        ? { u: 'Klasik Baklava', o: 'Tepsi', n: 'Kargoya en dayanıklı çeşit; az şerbetli olduğu için yolda dağılmaz.' }
        : { u: 'Klasik Baklava', o: '1 kg', n: 'Yola çıkacak sipariş için en güvenli seçim — 10–15 gün tazeliğini korur.' };
    }
    if (c.kaymak === 'evet') {
      return c.kisi === 'az'
        ? { u: 'Şöbiyet', o: '500 g', n: 'Kaymak ve fıstığın buluştuğu klasik. Buzdolabında iki gün içinde tüketin.' }
        : { u: 'Yeşil Şöbiyet', o: 'Tepsi', n: 'Katmanları yaprak gibi ayrılır, kalabalık sofrada göz doldurur.' };
    }
    if (c.kisi === 'cok') {
      return { u: 'Klasik Baklava', o: 'Tepsi', n: 'Tek tepside zengin ikram — herkesin sevdiği lezzet.' };
    }
    if (c.kisi === 'orta') {
      return { u: 'Midye Baklava', o: 'Tepsi', n: 'Fıstık oranı en yüksek çeşitlerden; ikramda en çok beğenilen.' };
    }
    return { u: 'Havuç Dilimi', o: '500 g', n: 'Geniş tabanlı dilim, her lokmada artan fıstık. Az kişi için ideal.' };
  }

  function sihirbazKur() {
    var yer = $('#wizard');
    if (!yer) return;
    var adim = 0, cevap = {};

    function ciz() {
      if (adim < SORULAR.length) {
        var q = SORULAR[adim];
        yer.innerHTML =
          '<div class="wz-step">' +
            '<p class="wz-n">' + (adim + 1) + ' / ' + SORULAR.length + '</p>' +
            '<h3>' + esc(T(q.s)) + '</h3>' +
            '<div class="wz-opts">' + q.c.map(function (o) {
              return '<button class="wz-opt" type="button" data-v="' + esc(o.v) + '">' + esc(T(o.a)) + '</button>';
            }).join('') + '</div>' +
            (adim ? '<button class="wz-back" type="button" id="wzBack">← ' + esc(T('Geri')) + '</button>' : '') +
          '</div>';
      } else {
        var r = oner(cevap);
        var f = (M.rail || []).filter(function (x) { return x.name === r.u; })[0];
        var fs = fiyatSatiri(r.u);
        yer.innerHTML =
          '<div class="wz-res">' +
            (f && A ? A.pic(f.photos[0], ' class="wz-img" alt="" loading="lazy" decoding="async"') : '') +
            '<div class="wz-res-body">' +
              '<p class="eyebrow eyebrow--plain">' + esc(T('Önerimiz')) + '</p>' +
              '<h3>' + esc(r.u) + '</h3>' +
              '<p class="wz-why">' + esc(T(r.n)) + '</p>' +
              (fs ? '<p class="wz-price">' + esc(r.o) + ' · <bdi>' + paraYaz(
                r.o === 'Tepsi' ? (tepsiFiyati(fs) || 0)
                  : paraOku(fs.kg) * ((C.sepet.olculer || []).filter(function (o) { return o.ad === r.o; })[0] || { carpan: 1 }).carpan
              ) + '</bdi></p>' : '') +
              '<div class="wz-act">' +
                '<button class="btn btn--solid" type="button" data-add="' + esc(r.u) + '"><span>' + esc(T('Sepete ekle')) + '</span></button>' +
                '<button class="btn" type="button" id="wzAgain"><span>' + esc(T('Baştan sor')) + '</span></button>' +
              '</div>' +
            '</div>' +
          '</div>';
        if (A) A.izle('sihirbaz-sonuc');
      }
      tazeleGec();
    }

    /* Adımın kendisi hafif; sabit yükseklikli kutuda çizilir, yeniden ölçüm
       gerekmez. Ağır iş (ScrollTrigger) bir sonraki kareye ertelenir. */
    yer.addEventListener('click', function (e) {
      var o = e.target.closest('.wz-opt');
      if (o) { cevap[SORULAR[adim].k] = o.dataset.v; adim++; ciz(); return; }
      if (e.target.closest('#wzBack')) { adim = Math.max(0, adim - 1); ciz(); return; }
      if (e.target.closest('#wzAgain')) { adim = 0; cevap = {}; ciz(); }
    });
    ciz();
  }

  /* ---------------------------------------------------------------
     9. Sipariş takibi
     --------------------------------------------------------------- */
  var DURUM = [
    { k: 'alindi', ad: 'Sipariş alındı' },
    { k: 'hazirlaniyor', ad: 'Hazırlanıyor' },
    { k: 'kargoda', ad: 'Kargoda' },
    { k: 'teslim', ad: 'Teslim edildi' }
  ];

  function takipKur() {
    var yer = $('#trackBox');
    if (!yer || !(C.takip && C.takip.acik)) return;

    function goster(kod) {
      var s = (C.takip.siparisler || []).filter(function (x) {
        return String(x.kod).toUpperCase() === String(kod).toUpperCase().trim();
      })[0];
      var sonuc = $('#trackResult');
      if (!s) {
        sonuc.innerHTML = '<p class="track-none">' +
          esc(T('Bu kodla bir sipariş bulunamadı. Kodu WhatsApp mesajınızda bulabilirsiniz; emin değilseniz bize yazın.')) +
          '</p>';
        return;
      }
      var i = DURUM.map(function (d) { return d.k; }).indexOf(s.durum);
      sonuc.innerHTML =
        '<div class="track-card">' +
          '<div class="track-top"><b>' + esc(s.kod) + '</b><span>' + esc(s.ad || '') + '</span></div>' +
          '<p class="track-urun">' + esc(s.urun || '') + (s.tarih ? ' · ' + esc(s.tarih) : '') + '</p>' +
          '<ol class="track-steps">' + DURUM.map(function (d, j) {
            return '<li class="' + (j <= i ? 'on' : '') + (j === i ? ' now' : '') + '"><span></span>' + esc(T(d.ad)) + '</li>';
          }).join('') + '</ol>' +
          (s.takipNo ? '<p class="track-no">' + esc(s.kargoFirma || T('Kargo')) + ' · ' +
            esc(T('Takip no')) + ': <b>' + esc(s.takipNo) + '</b></p>' : '') +
        '</div>';
      if (A) A.izle('siparis-takip');
    }

    $('#trackForm').addEventListener('submit', function (e) {
      e.preventDefault();
      goster($('#trackKod').value);
    });

    // ?siparis=KOD ile doğrudan
    var p = new URLSearchParams(location.search).get('siparis');
    if (p) {
      $('#trackKod').value = p;
      goster(p);
      setTimeout(function () {
        var y = yer.getBoundingClientRect().top + W.scrollY - 80;
        var l = A && A.lenis();
        if (l) l.scrollTo(y, { duration: 1.1 }); else W.scrollTo(0, y);
      }, 900);
    }
  }

  /* ---------------------------------------------------------------
     9b. Bağımsız kargo ücreti hesaplayıcı (kargo bölümü)
     --------------------------------------------------------------- */
  function kargoHesaplayici() {
    var kutu = $('#shipCalc');
    if (!kutu || !C.kargoTarife) { if (kutu) kutu.hidden = true; return; }
    var il = $('#shIl'), kg = $('#shKg'), out = $('#shOut');
    il.innerHTML = '<option value="">' + esc(T('İl seçin')) + '</option>' +
      TUM_ILLER.map(function (x) { return '<option' + (x === 'Gaziantep' ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('');

    function yaz() {
      var a = parseFloat(kg.value) || 0;
      if (!il.value || a <= 0) { out.textContent = T('İl ve ağırlık seçin.'); out.classList.remove('on'); return; }
      var r = kargoHesap(a, il.value, 0);
      var b = r.bolge;
      out.classList.add('on');
      out.innerHTML = '<b><bdi>' + paraYaz(r.ucret) + '</bdi></b> · ' + esc(b ? b.ad : '') + ' · ' + esc(b ? b.gun : '') +
        '<span class="ship-free">' + esc(T('Sipariş tutarı')) + ' <bdi>' + paraYaz(C.kargoTarife.ucretsizUstu) + '</bdi> ' +
        esc(T('üzerindeyse kargo ücretsizdir.')) + '</span>';
    }
    il.addEventListener('change', yaz);
    kg.addEventListener('input', function () { if (A) A.sonraYap(yaz); else yaz(); });
    yaz();
  }

  /* sepeti dışarıdan açan düğmeler */
  D.addEventListener('click', function (e) {
    if (e.target.closest('[data-open-cart]')) { e.preventDefault(); if (panel) sepetAc(); }
  });

  /* ---------------------------------------------------------------
     10. Başlat
     --------------------------------------------------------------- */
  function boot() {
    A = W.AU;
    sepetKur();
    urunKartlari();
    karsiKur();
    sihirbazKur();
    takipKur();
    kargoHesaplayici();
    tazeleGec();
  }
  if (W.AU) boot();
  else W.addEventListener('au:ready', boot, { once: true });

})();
