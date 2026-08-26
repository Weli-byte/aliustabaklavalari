# -*- coding: utf-8 -*-
"""Tema ve ses düğmelerini HTML'e sabitler — JS ile eklenince menü kayıyordu (CLS)."""
import io, sys

# ---------------------------------------------------------------- index.html
P = 'index.html'
s = io.open(P, encoding='utf-8').read()
orj = s

DUGMELER = """    <button class="icon-btn tema-btn" id="temaBtn" type="button" aria-pressed="false" aria-label="Açık temaya geç" hidden>
      <svg class="ic-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8.2 8.2 0 1 0 10.5 10.5z"/></svg>
      <svg class="ic-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>
    </button>
    <button class="icon-btn ses-btn" id="sesBtn" type="button" aria-pressed="false" aria-label="Arayüz seslerini aç" hidden>
      <svg class="ic-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>
      <svg class="ic-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9.5l4 5M21 9.5l-4 5"/></svg>
    </button>
    <button class="icon-btn" id="motionBtn" type="button" aria-pressed="false">"""

eski = """    <button class="icon-btn" id="motionBtn" type="button" aria-pressed="false">"""
assert eski in s, 'motionBtn bulunamadi'
assert 'id="temaBtn"' not in s, 'zaten eklenmis'
s = s.replace(eski, DUGMELER, 1)
io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
print('index.html: tema/ses dugmeleri sabitlendi')

# ---------------------------------------------------------------- extras.js
P2 = 'assets/js/extras.js'
e = io.open(P2, encoding='utf-8').read()

degis = [
(
"""    var yer = $('.nav-tools');
    if (!yer) return;
    var b = el('button', 'icon-btn tema-btn');
    b.type = 'button';
    b.innerHTML =
      '<svg class="ic-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8.2 8.2 0 1 0 10.5 10.5z"/></svg>' +
      '<svg class="ic-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/>' +
      '<path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>';
    yer.insertBefore(b, $('#motionBtn', yer) || yer.lastElementChild);
    temaUygula(baslangic);""",
"""    /* Düğme HTML'de duruyor; burada yalnızca görünür kılıp bağlıyoruz.
       Sonradan eklenseydi üst menü kayar ve CLS artardı. */
    var b = $('#temaBtn');
    if (!b) return;
    b.hidden = false;
    temaUygula(baslangic);"""
),
(
"""    var yer = $('.nav-tools');
    if (!yer) return;
    var b = el('button', 'icon-btn ses-btn');
    b.type = 'button';
    b.innerHTML =
      '<svg class="ic-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>' +
      '<svg class="ic-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9.5l4 5M21 9.5l-4 5"/></svg>';
    yer.insertBefore(b, $('#motionBtn', yer) || yer.lastElementChild);""",
"""    var b = $('#sesBtn');
    if (!b) return;
    b.hidden = false;"""
),
]

for a, y in degis:
    assert a in e, 'BULUNAMADI:\n' + a[:80]
    e = e.replace(a, y, 1)

io.open(P2, 'w', encoding='utf-8', newline='\n').write(e)
print('extras.js: dugmeler HTML uzerinden baglandi')
