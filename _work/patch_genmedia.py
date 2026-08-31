# -*- coding: utf-8 -*-
"""gen_media.py: düzeltilen adlar, yeni medyanın yerleşimi ve açıklamaları."""
import io

P = '_work/gen_media.py'
s = io.open(P, encoding='utf-8').read()
n = 0


def degis(a, y):
    global s, n
    if y in s and a not in s:
        return                       # zaten uygulanmış
    assert a in s, 'BULUNAMADI:\n' + a[:130]
    s = s.replace(a, y, 1)
    n += 1


# --- düzeltilen tatlı adları -----------------------------------------
degis(' ("Havuç Dilimi","Geniş tabanlı üçgen dilim. Her lokmada artan fıstık oranı.",[55,30]),',
      ' ("Yuvarlak Tepsi Baklava","Yuvarlak tepside dilim kesim. Bayram ve ikram sofralarının klasik sunumu.",[55,30]),')
degis(' ("Kuşgözü","Küçük, yuvarlak, tek lokmalık. Ortasında iri fıstık tanesi.",[49,16]),',
      ' ("Fıstık Ezmesi","Taş değirmende çekilmiş Antep fıstığı, şekerle yoğrulup tepsiye basılır.",[49,16]),')
degis(' ("Kavrulmuş Fıstık","Baklavanın içine giren fıstığın kendisi. Günlük kavrulur, ayrıca satılır.",[53,7]),',
      ' ("Çiğ İç Fıstık","Baklavanın içine giren fıstığın kendisi — kabuğu alınmış, mor zarlı, kavrulmamış.",[53,7]),')

# --- eski ad ve eski bulvar, metinlerde de geçiyordu ------------------
degis('"kaynatılmış şerbet dökülür. Kesim biçimi çeşidi belirler: kare, midye, havuç dilimi, "',
      '"kaynatılmış şerbet dökülür. Kesim biçimi çeşidi belirler: kare, midye, yuvarlak tepsi, "')
degis("  ozet=\"Kanuni Sultan Süleyman Bulvarı'ndaki dükkân, her sabah 10:00'da sıfırdan dolan vitrin \"",
      "  ozet=\"Yavuz Sultan Selim Bulvarı'ndaki dükkân, her sabah 10:00'da sıfırdan dolan vitrin \"")

# --- yeni medyanın yerleşimi -----------------------------------------
degis("  kapak=P(64),\n  fotograflar=[P(51), P(52), P(64)],\n  videolar=[]),",
      "  kapak=P(65),\n  fotograflar=[P(65), P(51), P(52), P(64)],\n  videolar=[]),")
degis("  videolar=[V(4), V(7), V(8), V(13)]),",
      "  videolar=[V(4), V(7), V(8), V(13),\n"
      "            V(17), V(18), V(19), V(20), V(21), V(22), V(23), V(24)]),")

# --- açıklamalar ------------------------------------------------------
degis(" 'v08':'Fırından çıkan tepsilerin dizilişi','v13':'Katmanlı baklavanın kesilişi',",
      " 'v08':'Fırından çıkan tepsilerin dizilişi','v13':'Katmanlı baklavanın kesilişi',\n"
      " # 29 Ağustos 2026'da işletmeden gelen tepsi sunumları\n"
      " 'v17':'Kare kesim tepsi — fıstık şeridiyle','v18':'Tezgâhta kare baklava tepsisi',\n"
      " 'v19':'Şöbiyet tepsisi — fıstıkla kaplı','v20':'Yuvarlak tepside dilim kesim',\n"
      " 'v21':'Kare baklava — üstten kadraj','v22':'Kare tepsi ve midye tepsisi yan yana',\n"
      " 'v23':'Sarma dilimler, tepsiye dizilmiş','v24':'Yuvarlak tepside fıstıklı dizilim',")
degis(" 'p64':'Günlük kavrulmuş Antep fıstığı',",
      " 'p64':'Günlük kavrulmuş Antep fıstığı',\n"
      " 'p65':'Çiğ iç fıstık — mor zarlı, yuvarlak tepside',")

io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
print('gen_media yamalandi: %d degisiklik' % n)
