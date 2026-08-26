# -*- coding: utf-8 -*-
"""index.html yamaları — yeni bölümler ve yeni betikler."""
import io, sys

P = 'index.html'
s = io.open(P, encoding='utf-8').read()
orj = s

# =====================================================================
# 1) BUGÜN VİTRİNDE  +  SİHİRBAZ   → ürünlerden hemen sonra
# =====================================================================
VITRIN = """
<!-- ================= BUGÜN VİTRİNDE ================= -->
<section id="vitrin" class="band" aria-labelledby="vit-h" hidden>
  <div class="shell vit-grid">
    <div class="vit-copy">
      <p class="eyebrow rv">Bugün vitrinde</p>
      <h2 id="vit-h" class="rv">Sabah ne <em class="acc">çıktıysa.</em></h2>
      <p class="lede rv">Tezgâh her sabah sıfırdan kurulur. Bugün vitrinde duran çeşitler aşağıda — akşama kalmayabilir.</p>
      <p class="small rv" id="vitrinTarih"></p>
      <ul class="vit-list rv" id="vitrinList"></ul>
      <p class="small rv" id="vitrinNot"></p>
      <div class="vit-act rv">
        <button class="btn btn--solid js-mag" type="button" data-open-cart><span>Sepete ekle</span></button>
        <a class="btn js-mag" href="#siparis"><span>Sipariş formu</span></a>
      </div>
    </div>
    <figure class="vit-shot rv">
      <img id="vitrinFoto" class="m-fill" src="" alt="Bugünkü vitrin fotoğrafı" loading="lazy" decoding="async" hidden>
    </figure>
  </div>
</section>

<!-- ================= TATLI SİHİRBAZI ================= -->
<section id="sihirbaz" class="band cut-top--rev" aria-labelledby="wz-h">
  <div class="shell wz-grid">
    <div class="wz-copy">
      <p class="eyebrow rv">Karar veremediniz mi?</p>
      <h2 id="wz-h" class="rv">Bana bir <em class="acc">tatlı seç.</em></h2>
      <p class="lede rv">Üç soru soruyoruz, tezgâhtan size en uygun çeşidi öneriyoruz. Kaç kişi olduğunuza, nasıl teslim alacağınıza ve kaymak sevip sevmediğinize bakıyoruz.</p>
      <p class="small rv">Öneri, ustanın sofra tecrübesine göre kurulmuş basit bir kılavuzdur — son karar sizin.</p>
    </div>
    <div class="wz-box rv" id="wizard"></div>
  </div>
</section>
"""

anchor = '<!-- ================= FİYAT & GRAMAJ ================= -->'
assert anchor in s
s = s.replace(anchor, VITRIN.strip() + '\n\n' + anchor, 1)

# =====================================================================
# 2) NEDEN BİZDEN — karşılaştırma tablosu → "neden" bölümünden sonra
# =====================================================================
FARK = """
<!-- ================= FARK / KARŞILAŞTIRMA ================= -->
<section id="fark" class="band" aria-labelledby="fark-h" hidden>
  <div class="shell">
    <div class="gal-head">
      <div>
        <p class="eyebrow rv">Neden bizden</p>
        <h2 id="fark-h" class="rv" style="margin-top:1.3rem">Aynı isim,<br><em class="acc">aynı şey değil.</em></h2>
      </div>
      <p class="lede rv" style="max-width:36ch">Raftaki kutulu baklava ile tezgâhtan çıkan baklava arasındaki farkı madde madde yazdık. Sağ sütun, uzun raf ömrü için yapılan tavizleri anlatıyor.</p>
    </div>
    <div class="fark-wrap rv">
      <div class="fark-scroll"><table class="fark" id="farkTable"></table></div>
    </div>
    <p class="small rv" style="margin-top:1.4rem">Sağ sütun, sektörde yaygın olan endüstriyel üretim yöntemlerini tarif eder; belirli bir markayı işaret etmez.</p>
  </div>
</section>
"""
anchor2 = '<!-- ================= TEZGÂH ================= -->'
assert anchor2 in s
s = s.replace(anchor2, FARK.strip() + '\n\n' + anchor2, 1)

# =====================================================================
# 3) STORY ARŞİVİ → tatlı dünyasından sonra
# =====================================================================
STORY = """
<!-- ================= STORY ARŞİVİ ================= -->
<section id="story" class="band cut-top--rev" aria-labelledby="st-h" hidden>
  <div class="shell">
    <div class="gal-head">
      <div>
        <p class="eyebrow rv">Arşiv</p>
        <h2 id="st-h" class="rv" style="margin-top:1.3rem">Tezgâhtan<br><em class="acc">haftalık kareler.</em></h2>
      </div>
      <p class="lede rv" style="max-width:32ch">Instagram hikâyelerinde paylaşılan üretim anları burada kalıcı olarak duruyor.</p>
    </div>
    <div class="st-grid media-set" id="storyList"></div>
  </div>
</section>
"""
anchor3 = '<!-- ================= NEDEN ================= -->'
assert anchor3 in s
s = s.replace(anchor3, STORY.strip() + '\n\n' + anchor3, 1)

# =====================================================================
# 4) SİPARİŞ TAKİBİ + KARGO HESAPLAYICI → kargo bölümünün içine
# =====================================================================
TAKIP = """      <p class="small rv" id="kargoNot" style="margin-top:1.6rem"></p>

      <div class="ship-calc rv" id="shipCalc">
        <p class="cart-sub">Kargo ücreti hesaplayıcı</p>
        <div class="ship-row">
          <p class="f"><label for="shIl">İl</label><select id="shIl"></select></p>
          <p class="f f--sm"><label for="shKg">Ağırlık (kg)</label>
            <input id="shKg" type="number" min="0.25" max="40" step="0.25" value="2"></p>
        </div>
        <p class="ship-out" id="shOut"></p>
        <p class="small">Tahmini tarifedir; kesin ücret kargo firmasının o günkü desi hesabına göre belirlenir.</p>
      </div>

      <div class="track rv" id="trackBox">
        <p class="cart-sub">Sipariş takibi</p>
        <form class="frm frm--track" id="trackForm" novalidate>
          <p class="f"><label for="trackKod">Sipariş kodu</label>
            <input id="trackKod" name="kod" type="text" inputmode="latin" autocomplete="off" placeholder="AU-0000"></p>
          <button class="btn btn--solid" type="submit"><span>Sorgula</span></button>
        </form>
        <div id="trackResult" aria-live="polite"></div>
        <p class="small">Kodunuz WhatsApp mesajınızda yazar. Kod paylaşıldıktan sonra bu alandan durumu takip edebilirsiniz.</p>
      </div>
"""
eski_kargonot = """      <p class="small rv" id="kargoNot" style="margin-top:1.6rem"></p>
"""
assert eski_kargonot in s
s = s.replace(eski_kargonot, TAKIP, 1)

# =====================================================================
# 5) YAZILAR (blog) → SSS'den sonra
# =====================================================================
YAZI = """
<!-- ================= YAZILAR ================= -->
<section id="yazilar" class="band" aria-labelledby="yz-h" hidden>
  <div class="shell">
    <div class="gal-head">
      <div>
        <p class="eyebrow rv">Yazılar</p>
        <h2 id="yz-h" class="rv" style="margin-top:1.3rem">Tezgâhın<br><em class="acc">arkasındaki bilgi.</em></h2>
      </div>
      <p class="lede rv" style="max-width:34ch">Yufkanın kaç kat olduğundan şerbetin kıvamına kadar, sık sorulanların uzun cevapları.</p>
    </div>
    <div class="yz-grid media-set" id="yaziList"></div>
  </div>
</section>
"""
anchor5 = '<!-- ================= İLETİŞİM ================= -->'
assert anchor5 in s
s = s.replace(anchor5, YAZI.strip() + '\n\n' + anchor5, 1)

# =====================================================================
# 6) BÜLTEN → footer içinde
# =====================================================================
BULTEN = """    <div class="foot-col foot-col--bl" id="bulten" hidden>
      <h3 id="bultenBaslik">Bülten</h3>
      <p class="small" id="bultenMetin"></p>
      <form class="frm frm--bl" id="formBulten" novalidate>
        <p class="f"><label class="sr-only" for="bl-eposta">E-posta adresiniz</label>
          <input id="bl-eposta" name="eposta" type="email" autocomplete="email" placeholder="ornek@eposta.com" required></p>
        <button class="btn btn--solid" type="submit"><span>Kaydol</span></button>
        <span class="err" id="bl-hata" hidden></span>
      </form>
    </div>
    <div class="foot-col">
      <h3>Takip edin</h3>"""
eski_takip = """    <div class="foot-col">
      <h3>Takip edin</h3>"""
assert eski_takip in s
s = s.replace(eski_takip, BULTEN, 1)

# footer menüsüne yeni bölümler
s = s.replace("""        <li><a href="#tezgah">Tezgâh</a></li>""",
"""        <li><a href="#tezgah">Tezgâh</a></li>
        <li><a href="#yazilar">Yazılar</a></li>""", 1)
s = s.replace("""        <li><a href="#sss">Sıkça sorulanlar</a></li>""",
"""        <li><a href="#sss">Sıkça sorulanlar</a></li>
        <li><a href="#kargo">Sipariş takibi</a></li>""", 1)

# üst menüye sihirbaz
s = s.replace("""    <a href="#tatlilar">Tatlı Dünyası</a>""",
"""    <a href="#tatlilar">Tatlı Dünyası</a>
    <a href="#sihirbaz">Tatlı Seç</a>""", 1)

# =====================================================================
# 7) YENİ BETİKLER
# =====================================================================
eski_sc = '<script defer src="assets/js/site.js"></script>'
assert eski_sc in s, 'site.js betigi bulunamadi'
s = s.replace(eski_sc, eski_sc +
  '\n<script src="assets/js/shop.js" defer></script>' +
  '\n<script src="assets/js/extras.js" defer></script>', 1)

if s == orj:
    print('DEGISIKLIK YOK'); sys.exit(1)
io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
print('index.html yamalandi:', len(orj), '->', len(s))
