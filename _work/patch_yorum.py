# -*- coding: utf-8 -*-
"""
Yorumlar bölümü: uydurma alıntı kartları yerine GERÇEK, kaynak gösterilen
değerlendirme verisi. Yorum metinleri uydurulmaz.
"""
import io

n = 0


def yama(P, ciftler):
    global n
    s = io.open(P, encoding='utf-8').read()
    for a, y in ciftler:
        assert a in s, P + ' BULUNAMADI:\n' + a[:130]
        s = s.replace(a, y, 1)
        n += 1
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)


# =====================================================================
# 1) config.js — doğrulanmış değerlendirme kaynakları
# =====================================================================
yama('assets/js/config.js', [
("""  googleLink:  'https://www.google.com/maps/search/?api=1&query=Ali+Usta+Baklavalar%C4%B1+Nizip',""",
"""  googleLink:  'https://www.google.com/maps/search/?api=1&query=Ali+Usta+Baklavalar%C4%B1+Nizip',

  /* ------------------------------------------------------------------
     DEĞERLENDİRME KAYNAKLARI
     Bunlar uydurma değildir; herkese açık listeleme sayfalarından
     alınmıştır. Yorum METİNLERİ hiçbir servisten toplu alınamıyor
     (Google API'si üçüncü taraflara en fazla 5 yorum verir), o yüzden
     buraya yalnızca doğrulanabilir sayılar yazıldı.
     Yorum metinlerini eklemek için: python _work/yorum_ekle.py
     ------------------------------------------------------------------ */
  degerlendirmeler: [
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
  },"""),
])


# =====================================================================
# 2) site.js — boş yorum listesinde kaynak kartları
# =====================================================================
yama('assets/js/site.js', [
("""    } else {
      box.innerHTML = ('<blockquote class="rev rev--ph rv"><q>' +
        esc(T('Örnek yorum metni. Gerçek Google yorumlarıyla değiştirilecek.')) + '</q><footer>' +
        esc(T('Yer tutucu · Ad Soyad')) + '</footer></blockquote>').repeat(3);
      note.hidden = false;
      note.innerHTML = '<strong>' + esc(T('Not:')) + '</strong><span>' +
        esc(T('Yukarıdaki üç yorum yer tutucudur ve gerçek müşteri yorumu değildir. Yalnızca puan ve değerlendirme sayısı gerçek Google verisidir. Gerçek yorumları config.js içindeki yorumlar listesine ekleyin — uyarı kendiliğinden kaybolur.')) +
        '</span>';
    }""",
"""    } else {
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

      note.hidden = false;
      note.innerHTML = '<strong>' + esc(T('Not:')) + '</strong><span>' +
        esc(T('Yukarıdaki puan ve sayılar gerçek, kaynağı gösterilen verilerdir. Yorumların metinleri henüz siteye aktarılmadı: Google bu metinleri üçüncü taraflara toplu vermiyor, uydurma yorum da yazılmadı. Aktarmak için _work/yorum_ekle.py aracını kullanın.')) +
        '</span>';
    }"""),
])


# =====================================================================
# 3) Yorum panelindeki boş metin
# =====================================================================
yama('assets/js/site.js', [
("""      bos.innerHTML = esc(T('Yorumlar henüz siteye aktarılmadı.')) + ' ' +
        esc(T('Google’daki 117 değerlendirme işletme kaydında duruyor; buraya eklenmesi için işletmenin onayı gerekiyor.')) +
        ' <strong>' + esc(T('İlk yorumu siz yazabilirsiniz.')) + '</strong>';""",
"""      bos.innerHTML = esc(T('Yorum metinleri henüz siteye aktarılmadı.')) + ' ' +
        esc(T('Google’daki 117 ve Restaurant Guru’daki 116 değerlendirmenin puanları yukarıda; metinleri ise yalnızca o servislerin kendi sayfalarında görünüyor.')) +
        ' <strong>' + esc(T('İlk yorumu siz yazabilirsiniz.')) + '</strong>';"""),
])


# =====================================================================
# 4) CSS — kaynak kartları
# =====================================================================
CSS = """

/* ==========================================================
   DEĞERLENDİRME KAYNAK KARTLARI
   Yorum metni yokken uydurma alıntı yerine doğrulanabilir veri.
   ========================================================== */
.rev--src,.rev--one{
  display:flex; flex-direction:column; gap:.45rem;
  padding:clamp(1.4rem,2.4vw,2rem);
  background:linear-gradient(160deg, rgba(240,196,99,.055), transparent 60%);
  border:1px solid var(--line);
}
.rev-src-head{ display:flex; align-items:baseline; justify-content:space-between; gap:.8rem; }
.rev-src-ad{
  font-size:.7rem; letter-spacing:.19em; text-transform:uppercase; color:var(--gold);
}
.rev--src .rev-stars{ font-size:.82rem; letter-spacing:.06em; color:var(--gold-lit); }
.rev--src .rev-stars i{ color:var(--cream-mute); opacity:.4; font-style:normal; }
.rev-src-puan{ display:flex; align-items:baseline; gap:.3rem; margin-top:.2rem; }
.rev-src-puan b{
  font-family:var(--f-disp); font-size:clamp(2.2rem,4vw,3rem); font-weight:500;
  line-height:1; color:var(--cream); font-variant-numeric:tabular-nums;
}
.rev-src-puan span{ font-size:1rem; color:var(--cream-mute); }
.rev-src-adet{ font-size:.78rem; letter-spacing:.1em; text-transform:uppercase; color:var(--cream-mute); }
.rev-src-not{ font-size:.87rem; color:var(--cream-dim); line-height:1.55; margin-top:.35rem; }
.rev-src-link{
  margin-top:auto; padding-top:.9rem;
  font-size:.8rem; letter-spacing:.1em; text-transform:uppercase;
  color:var(--gold-lit); text-decoration:none;
  transition:color .3s var(--ease);
}
.rev-src-link:hover{ color:var(--cream); }
.rev-one-list{ display:flex; flex-wrap:wrap; gap:.4rem; margin:.5rem 0 .2rem; }
.rev-one-list li{
  padding:.3rem .7rem; border:1px solid var(--line);
  font-size:.82rem; color:var(--gold-pale);
}
"""

with io.open('assets/css/site.css', 'a', encoding='utf-8', newline='\n') as f:
    f.write(CSS)
n += 1


# =====================================================================
# 5) i18n — yeni anahtarlar
# =====================================================================
EN = """  'değerlendirme': 'ratings',
  'Kaynağı gör': 'View source',
  'En çok önerilenler': 'Most recommended',
  'Kişi başı harcama': 'Spend per person',
  'Restaurant Guru ziyaretçi özeti': 'Restaurant Guru visitor summary',
  'İşletme kaydındaki güncel ortalama.': 'Current average on the business listing.',
  'Nizip’te tatlı sunan 46 işletme arasında 8. sırada.': 'Ranked 8th of 46 dessert places in Nizip.',
  'Yorum metinleri henüz siteye aktarılmadı.': 'Review texts have not been imported yet.',
  'Google’daki 117 ve Restaurant Guru’daki 116 değerlendirmenin puanları yukarıda; metinleri ise yalnızca o servislerin kendi sayfalarında görünüyor.':
    'The scores behind the 117 Google and 116 Restaurant Guru ratings are shown above; the texts themselves live only on those services’ own pages.',
  'Yukarıdaki puan ve sayılar gerçek, kaynağı gösterilen verilerdir. Yorumların metinleri henüz siteye aktarılmadı: Google bu metinleri üçüncü taraflara toplu vermiyor, uydurma yorum da yazılmadı. Aktarmak için _work/yorum_ekle.py aracını kullanın.':
    'The scores and counts above are real and sourced. The review texts have not been imported yet: Google does not release them in bulk to third parties, and no review was invented. Use the _work/yorum_ekle.py tool to import them.',
  'Kuru Baklava': 'Dry Baklava',
  'Dondurma': 'Ice cream',
  'Künefe': 'Künefe',
"""

t = io.open('assets/js/i18n.js', encoding='utf-8').read()
if 'Kaynağı gör' not in t:
    j = t.rindex('\n}\n};')
    t = t[:j] + '\n' + EN.rstrip('\n') + t[j:]
    io.open('assets/js/i18n.js', 'w', encoding='utf-8', newline='\n').write(t)
    n += 1

print('yorum yamalari uygulandi:', n)
