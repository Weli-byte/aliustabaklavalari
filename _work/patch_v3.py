# -*- coding: utf-8 -*-
"""
1) Değer kartları + sayaçlar videonun ALTINA ayrı bölüme taşınır; video net görünür.
2) Yorumlar: Restaurant Guru kartı ve "Not:" kutusu kaldırılır.
"""
import io

n = 0


def yama(P, ciftler):
    global n
    s = io.open(P, encoding='utf-8').read()
    for a, y in ciftler:
        assert a in s, P + ' BULUNAMADI:\n' + a[:140]
        s = s.replace(a, y, 1)
        n += 1
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)


# =====================================================================
# 1) LEVHA VİDEONUN ALTINA
# =====================================================================
yama('index.html', [
(
"""      <p class="lede rv">Baklavayı ucuzlatmanın dört yolu var: margarin, glikoz şurubu, koruyucu, bayat fıstık. Dördü de bu tezgâhta yasak.</p>
    </div>

    <div class="neden-plate rv">""",
"""      <p class="lede rv">Baklavayı ucuzlatmanın dört yolu var: margarin, glikoz şurubu, koruyucu, bayat fıstık. Dördü de bu tezgâhta yasak.</p>
    </div>
  </div>
</section>

<!-- ================= DEĞERLER (videonun altında, ayrı) ================= -->
<section id="degerler" class="band band--degerler" aria-label="Ali Usta'nın çalışma ilkeleri">
  <div class="shell">
    <div class="neden-plate rv">"""),
(
"""    </div>
    <p class="small rv neden-kaynak">Puan ve değerlendirme sayısı Google işletme kaydından alınmıştır.</p>
  </div>
</section>""",
"""    </div>
    <p class="small rv neden-kaynak">Puan ve değerlendirme sayısı Google işletme kaydından alınmıştır.</p>
  </div>
</section>"""),
])

yama('assets/css/site.css', [
(""".neden-bg video,.neden-bg img{
  width:100%; height:100%; object-fit:cover;
  opacity:.62; filter:saturate(1.05) contrast(1.06) brightness(1.12);
}
.neden-bg::after{
  content:""; position:absolute; inset:0;
  background:
    linear-gradient(90deg, rgba(28,19,9,.93) 0%, rgba(28,19,9,.78) 26%, rgba(28,19,9,.34) 52%, rgba(28,19,9,.20) 100%),
    linear-gradient(to bottom, rgba(28,19,9,.55), rgba(28,19,9,.10) 42%, rgba(28,19,9,.62));
}
.neden-inner{ position:relative; z-index:1; }
.neden-head{ max-width:46ch; margin-bottom:clamp(3rem,6vw,5.5rem); }""",
"""/* Levha artık bu bölümde değil; videonun üstünde yalnızca başlık var,
   bu yüzden görüntü daha açık bırakılabiliyor. */
.neden-bg video,.neden-bg img{
  width:100%; height:100%; object-fit:cover;
  opacity:.82; filter:saturate(1.08) contrast(1.05) brightness(1.16);
}
.neden-bg::after{
  content:""; position:absolute; inset:0;
  background:
    linear-gradient(90deg, rgba(24,16,7,.9) 0%, rgba(24,16,7,.66) 30%, rgba(24,16,7,.16) 58%, rgba(24,16,7,.04) 100%),
    linear-gradient(to bottom, rgba(24,16,7,.42), rgba(24,16,7,0) 38%, rgba(18,12,6,.55));
}
.neden-inner{ position:relative; z-index:1; }
.neden-head{ max-width:46ch; margin-bottom:0; }
/* Videoyu göstermek için bölüm biraz daha alçak; levha aşağıda. */
#neden{ padding-block:clamp(4.5rem,9vw,7.5rem) clamp(9rem,17vw,15rem); }
.band--degerler{ padding-block:0 clamp(4rem,7vw,6.5rem); margin-top:clamp(-6rem,-9vw,-4rem); position:relative; z-index:2; }"""),
])


# =====================================================================
# 2) YORUMLAR — Restaurant Guru kartı ve not kutusu kalkar
# =====================================================================
yama('assets/js/config.js', [
("""  degerlendirmeler: [
    { kaynak: 'Google',          puan: 4.5, adet: 117,
      link: 'https://www.google.com/maps/search/?api=1&query=Ali+Usta+Baklavalar%C4%B1+Nizip',
      not: 'İşletme kaydındaki güncel ortalama.' },
    { kaynak: 'Restaurant Guru', puan: 4.4, adet: 116,
      link: 'https://restaurantguru.com/Ali-Usta-Baklava-Nizip',
      not: 'Nizip’te tatlı sunan 46 işletme arasında 8. sırada.' }
  ],
  /* Ziyaretçi özetlerinde en çok tekrar eden çeşitler ve harcama aralığı. */
  oneCikan: {
    urunler: ['Kuru Baklava', 'Dondurma', 'Künefe'],
    kisiBasi: '₺100–200',
    kaynak: 'Restaurant Guru ziyaretçi özeti'
  },""",
"""  degerlendirmeler: [
    { kaynak: 'Google', puan: 4.5, adet: 117,
      link: 'https://www.google.com/maps/search/?api=1&query=Ali+Usta+Baklavalar%C4%B1+Nizip',
      not: 'İşletme kaydındaki güncel ortalama.' }
  ],
  /* Ziyaretçi değerlendirmelerinde en çok tekrar eden çeşitler. */
  oneCikan: {
    urunler: ['Kuru Baklava', 'Dondurma', 'Künefe'],
    kisiBasi: '₺100–200',
    kaynak: ''
  },"""),
])

yama('assets/js/site.js', [
("""      box.innerHTML = html;

      note.hidden = false;
      note.innerHTML = '<strong>' + esc(T('Not:')) + '</strong><span>' +
        esc(T('Yukarıdaki puan ve sayılar gerçek, kaynağı gösterilen verilerdir. Yorumların metinleri henüz siteye aktarılmadı: Google bu metinleri üçüncü taraflara toplu vermiyor, uydurma yorum da yazılmadı. Aktarmak için _work/yorum_ekle.py aracını kullanın.')) +
        '</span>';
    }""",
"""      box.innerHTML = html;
      /* Uyarı kutusu kaldırıldı: gösterilen her sayı zaten gerçek ve kaynaklı. */
      note.hidden = true;
    }"""),
])

print('v3 yamalari uygulandi:', n)
