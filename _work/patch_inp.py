# -*- coding: utf-8 -*-
"""INP: ScrollTrigger.refresh() etkileşim karesinden çıkarılır, ağır iş ertelenir."""
import io, sys

n = 0


def yama(P, ciftler):
    global n
    s = io.open(P, encoding='utf-8').read()
    for a, y in ciftler:
        assert a in s, P + ' BULUNAMADI:\n' + a[:100]
        s = s.replace(a, y, 1)
        n += 1
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)


# ---------------------------------------------------------------- shop.js
yama('assets/js/shop.js', [
(
"""  function T(s) { return A && A.T ? A.T(s) : s; }""",
"""  function T(s) { return A && A.T ? A.T(s) : s; }

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
  }"""
),
(
"""      if (A) A.izle('sihirbaz-sonuc');
      }
      if (A) A.tazele();
    }""",
"""      if (A) A.izle('sihirbaz-sonuc');
      }
      tazeleGec();
    }"""
),
(
"""    yer.addEventListener('click', function (e) {
      var o = e.target.closest('.wz-opt');
      if (o) { cevap[SORULAR[adim].k] = o.dataset.v; adim++; ciz(); return; }
      if (e.target.closest('#wzBack')) { adim = Math.max(0, adim - 1); ciz(); return; }
      if (e.target.closest('#wzAgain')) { adim = 0; cevap = {}; ciz(); }
    });""",
"""    /* Adımın kendisi hafif; sabit yükseklikli kutuda çizilir, yeniden ölçüm
       gerekmez. Ağır iş (ScrollTrigger) bir sonraki kareye ertelenir. */
    yer.addEventListener('click', function (e) {
      var o = e.target.closest('.wz-opt');
      if (o) { cevap[SORULAR[adim].k] = o.dataset.v; adim++; ciz(); return; }
      if (e.target.closest('#wzBack')) { adim = Math.max(0, adim - 1); ciz(); return; }
      if (e.target.closest('#wzAgain')) { adim = 0; cevap = {}; ciz(); }
    });"""
),
(
"""    bar.addEventListener('click', function (e) {
      var b = e.target.closest('.alrg-chip');
      if (!b) return;
      if (b.id === 'alrgClear') {
        haric = [];
        $$('.alrg-chip', bar).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      } else {
        var a = b.dataset.alrg, i = haric.indexOf(a);
        if (i > -1) { haric.splice(i, 1); b.setAttribute('aria-pressed', 'false'); }
        else { haric.push(a); b.setAttribute('aria-pressed', 'true'); }
      }
      uygula();
    });""",
"""    /* Filtreleme 12 kartın sınıfını değiştirir; düzen yeniden hesaplanır.
       Basış anında değil, bir sonraki boyamadan sonra yapılır (INP). */
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('.alrg-chip');
      if (!b) return;
      if (b.id === 'alrgClear') {
        haric = [];
        $$('.alrg-chip', bar).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      } else {
        var a = b.dataset.alrg, i = haric.indexOf(a);
        if (i > -1) { haric.splice(i, 1); b.setAttribute('aria-pressed', 'false'); }
        else { haric.push(a); b.setAttribute('aria-pressed', 'true'); }
      }
      if (A) A.sonraYap(uygula); else uygula();
    });"""
),
(
"""    sihirbazKur();
    takipKur();
    kargoHesaplayici();
    if (A) A.tazele();""",
"""    sihirbazKur();
    takipKur();
    kargoHesaplayici();
    tazeleGec();"""
),
])

# ---------------------------------------------------------------- extras.js
yama('assets/js/extras.js', [
(
"""    yaziKur();
    bultenKur();
    if (A) A.sonraYap(function () { googleYorumlari(); supabaseYorumlari(); });
    if (A) A.tazele();""",
"""    yaziKur();
    bultenKur();
    /* Uzak istekler ve tek seferlik ölçüm ilk boyamadan sonra. */
    if (A) A.sonraYap(function () {
      googleYorumlari();
      supabaseYorumlari();
      setTimeout(function () { A.tazele(); }, 300);
    });"""
),
])

print('INP yamalari uygulandi:', n)
