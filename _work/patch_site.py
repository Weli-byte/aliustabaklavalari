# -*- coding: utf-8 -*-
"""site.js yamaları — gerçek marka logoları, yorum tazeleme, Supabase köprüsü."""
import io, sys, re

P = 'assets/js/site.js'
s = io.open(P, encoding='utf-8').read()
orj = s

# ---------------------------------------------------------------- 1) Instagram: gerçek marka logosu + degrade
eski_ig = """    { k: 'instagram', ad: 'Instagram',
      svg: '<rect x="2.7" y="2.7" width="18.6" height="18.6" rx="5.4" fill="none" stroke="currentColor" stroke-width="1.9"/>'
         + '<circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="1.9"/>'
         + '<circle cx="17.3" cy="6.7" r="1.25" fill="currentColor"/>' },"""

yeni_ig = """    { k: 'instagram', ad: 'Instagram',
      /* Instagram'ın kendi kamera işareti + resmî degrade renkleri */
      grad: [['0%', '#FEDA75'], ['25%', '#FA7E1E'], ['50%', '#D62976'], ['75%', '#962FBF'], ['100%', '#4F5BD5']],
      svg: '<path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.17-.26 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.07.36-2.24.41-1.27.06-1.65.07-4.86.07s-3.59-.01-4.86-.07c-1.17-.06-1.82-.26-2.24-.42-.57-.22-.96-.48-1.38-.9-.42-.42-.69-.82-.9-1.38-.16-.42-.36-1.07-.42-2.24-.05-1.26-.06-1.65-.06-4.84s.01-3.59.06-4.86c.06-1.17.26-1.81.42-2.23.21-.57.48-.96.9-1.38.42-.42.81-.69 1.38-.9.42-.17 1.05-.36 2.22-.42C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.02 7.05.07 5.78.13 4.91.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.91.13 5.78.07 7.05.02 8.33 0 8.74 0 12s.02 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.77.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.02 4.95-.07c1.28-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.67-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.05-1.28.07-1.69.07-4.95s-.02-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.02 15.26 0 12 0z"/>'
         + '<path d="M12 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>'
         + '<circle cx="18.41" cy="5.59" r="1.44"/>' },"""
assert eski_ig in s, 'Instagram SVG bulunamadi'
s = s.replace(eski_ig, yeni_ig)

# ---------------------------------------------------------------- 2) WhatsApp: gerçek marka logosu + marka yeşili
eski_wa = """    { k: 'whatsapp', ad: 'WhatsApp', wa: true,
      svg: '<path fill="currentColor" d="M12 2.2A9.7 9.7 0 0 0 3.6 16.8L2.4 21.6l4.9-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.6c-1.5 0-3-.4-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A7.8 7.8 0 1 1 12 19.8zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.6.1l-.8.9c-.1.2-.3.2-.5.1-1-.4-2.2-1.4-2.9-2.6-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.6.6-.9 1.4-.9 2.2.1 1.3.6 2.5 1.5 3.5 1.1 1.4 2.5 2.4 4.2 2.9 1 .3 1.9.3 2.6-.1.5-.3.9-.8 1-1.4.1-.3.1-.6 0-.8l-.5-.2z"/>' }"""

yeni_wa = """    { k: 'whatsapp', ad: 'WhatsApp', wa: true, renk: '#25D366',
      /* WhatsApp'ın kendi telefon-baloncuk işareti, marka yeşiliyle */
      svg: '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.57-.34"/>'
         + '<path d="M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.22-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.16 6.44 6.6 2 12.05 2c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.9-9.88 9.9M20.46 3.5A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41"/>' }"""
assert eski_wa in s, 'WhatsApp SVG bulunamadi'
s = s.replace(eski_wa, yeni_wa)

# ---------------------------------------------------------------- 3) paintSocial: degrade / marka rengi desteği
eski_paint = """  function paintSocial(node, cls) {
    if (!node) return;
    node.innerHTML = socialLinks.map(function (x) {
      return '<a class="' + cls + (x.wa ? ' soc--wa' : '') + '" href="' + esc(socialHref(x)) + '" target="_blank" rel="noopener me">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">' + x.svg + '</svg>' +
        '<span class="sr-only">' + esc(x.ad) + '</span></a>';
    }).join('');
    node.hidden = socialLinks.length === 0;
  }"""

yeni_paint = """  /* Marka logoları kendi renkleriyle çizilir; degrade tanımının id'si her
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
  }"""
assert eski_paint in s, 'paintSocial bulunamadi'
s = s.replace(eski_paint, yeni_paint)

# ---------------------------------------------------------------- 4) Facebook notu (hesap yok)
s = s.replace(
  "'Instagram ve Facebook adresleri henüz iletilmedi. Adresleri assets/js/config.js dosyasına yazdığınızda düğmeler kendiliğinden burada ve üst menüde görünür.';",
  "'Sosyal medya adresleri henüz iletilmedi. Adresi assets/js/config.js dosyasına yazdığınızda düğme kendiliğinden burada ve üst menüde görünür.';")

# ---------------------------------------------------------------- 5) Yorum bölümünü yeniden çizilebilir yap
eski_yor = "  /* --- Yorumlar --- */\n  (function yorumlar() {"
yeni_yor = "  /* --- Yorumlar --- */\n  function yorumlar() {"
assert eski_yor in s
s = s.replace(eski_yor, yeni_yor)

eski_yor_son = """        esc(T('Yukarıdaki üç yorum yer tutucudur ve gerçek müşteri yorumu değildir. Yalnızca puan ve değerlendirme sayısı gerçek Google verisidir. Gerçek yorumları config.js içindeki yorumlar listesine ekleyin — uyarı kendiliğinden kaybolur.')) +
        '</span>';
    }
  })();"""
yeni_yor_son = """        esc(T('Yukarıdaki üç yorum yer tutucudur ve gerçek müşteri yorumu değildir. Yalnızca puan ve değerlendirme sayısı gerçek Google verisidir. Gerçek yorumları config.js içindeki yorumlar listesine ekleyin — uyarı kendiliğinden kaybolur.')) +
        '</span>';
    }
  }
  yorumlar();"""
assert eski_yor_son in s
s = s.replace(eski_yor_son, yeni_yor_son)

# şema betiği her tazelemede tekrar eklenmesin
s = s.replace("""      var ld = D.createElement('script');
      ld.type = 'application/ld+json';
      ld.textContent = JSON.stringify(list.slice(0, 9).map(function (y) {""",
"""      var ld = D.getElementById('ldRev') || D.createElement('script');
      ld.id = 'ldRev';
      ld.type = 'application/ld+json';
      ld.textContent = JSON.stringify(list.slice(0, 9).map(function (y) {""")

# ---------------------------------------------------------------- 6) Yorum tazeleme kancası + Supabase köprüsü
eski_tazele = "  $('#rvClose').addEventListener('click', rvKapat);"
yeni_tazele = """  /* extras.js Google / Supabase yorumlarını çektiğinde bunu çağırır */
  W.__auYorumTazele = function () {
    yorumlar();
    if (rvBox.classList.contains('open')) rvDoldur();
    if (W.ScrollTrigger) W.ScrollTrigger.refresh();
  };

  $('#rvClose').addEventListener('click', rvKapat);"""
assert eski_tazele in s
s = s.replace(eski_tazele, yeni_tazele, 1)

eski_msg = """    var msg = $('.frm-msg', form);
    msg.textContent = T('Teşekkürler! Yorumunuz WhatsApp’ta açıldı — göndermeyi unutmayın. Onaylandıktan sonra bu sayfada yayınlanacak.');
    msg.classList.add('ok');
  });"""
yeni_msg = """    /* Supabase kuruluysa yorum oraya da yazılır (extras.js dinler) */
    W.dispatchEvent(new CustomEvent('au:yorum', { detail: {
      ad: d('#rv-ad'), puan: parseInt(d('#rv-puan'), 10) || 5,
      metin: d('#rv-metin'), tarih: new Date().toISOString().slice(0, 10)
    } }));

    var msg = $('.frm-msg', form);
    msg.textContent = T('Teşekkürler! Yorumunuz WhatsApp’ta açıldı — göndermeyi unutmayın. Onaylandıktan sonra bu sayfada yayınlanacak.');
    msg.classList.add('ok');
  });"""
assert eski_msg in s
s = s.replace(eski_msg, yeni_msg)

if s == orj:
    print('DEGISIKLIK YOK'); sys.exit(1)
io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
print('site.js yamalandi:', len(orj), '->', len(s))
