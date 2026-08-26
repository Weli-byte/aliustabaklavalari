# -*- coding: utf-8 -*-
"""i18n.js sözlüğüne yeni bölümlerin anahtarlarını ekler (EN + AR)."""
import io, sys

P = 'assets/js/i18n.js'

EN = """
  /* ===== EK BÖLÜMLER — sepet ve sipariş ===== */
  'Sepet': 'Cart',
  'Sepeti aç': 'Open cart',
  'Siparişinizi hazırlayın': 'Build your order',
  'Sepete ekle': 'Add to cart',
  'Eklendi ✓': 'Added ✓',
  'Ölçü': 'Size',
  'Adet': 'Qty',
  'Azalt': 'Decrease',
  'Artır': 'Increase',
  'Satırı sil': 'Remove item',
  'porsiyon': 'portion',
  'Porsiyon': 'Portion',
  'Ara toplam': 'Subtotal',
  'Toplam': 'Total',
  'Ücretsiz': 'Free',
  'Yaklaşık ağırlık': 'Approximate weight',
  'Teslim': 'Delivery',
  'Dükkândan alacağım': 'I will pick it up at the shop',
  'Kargo ile gönderilsin': 'Ship it to me',
  'Seçin': 'Select',
  'WhatsApp’tan sipariş ver': 'Order on WhatsApp',
  'Hediye paketi': 'Gift wrapping',
  'Kurdeleli hediye ambalajı': 'Ribbon gift wrap',
  'El yazısı hediye kartı': 'Handwritten gift card',
  'Ahşap hediye kutusu': 'Wooden gift box',
  'Kimden–kime notunuzu sipariş formundaki “Not” alanına yazın.':
    'Write your from–to message in the “Note” field of the order form.',
  'Sepetiniz boş. Yukarıdan ürün ekleyin ya da ürün kartlarındaki “Sepete ekle” düğmesini kullanın.':
    'Your cart is empty. Add an item above, or use the “Add to cart” button on any product card.',
  'Tutarlar tahminidir; kesin fiyat WhatsApp’ta teyit edilir.':
    'Amounts are estimates; the final price is confirmed on WhatsApp.',
  '250 g': '250 g',
  '500 g': '500 g',
  '1 kg': '1 kg',
  'Yarım tepsi': 'Half tray',
  'Tam tepsi': 'Full tray',
  'Büyük tepsi': 'Large tray',

  /* ===== alerjen filtresi ve karşılaştırma ===== */
  'İçermesin:': 'Exclude:',
  'Temizle': 'Clear',
  'Karşılaştır': 'Compare',
  'Ürün karşılaştırma': 'Product comparison',
  'Fiyat / kg': 'Price / kg',
  'Kargoya uygunluk': 'Ships well',
  'Çok uygun': 'Excellent',
  'Uygun': 'Suitable',
  'Uygun değil — kaymaklı': 'Not suitable — contains clotted cream',

  /* ===== tatlı sihirbazı ===== */
  'Karar veremediniz mi?': 'Can’t decide?',
  'Bana bir': 'Pick a sweet',
  'tatlı seç.': 'for me.',
  'Üç soru soruyoruz, tezgâhtan size en uygun çeşidi öneriyoruz. Kaç kişi olduğunuza, nasıl teslim alacağınıza ve kaymak sevip sevmediğinize bakıyoruz.':
    'Three questions and we recommend the variety that fits you best — based on how many you are, how you will collect it, and whether you like clotted cream.',
  'Öneri, ustanın sofra tecrübesine göre kurulmuş basit bir kılavuzdur — son karar sizin.':
    'The suggestion is a simple guide built on the master’s table experience — the final call is yours.',
  'Tatlı Seç': 'Pick a Sweet',
  'Kaç kişilik?': 'For how many?',
  '1–4 kişi': '1–4 people',
  '5–15 kişi': '5–15 people',
  '15+ kişi': '15+ people',
  'Nasıl teslim alacaksınız?': 'How will you receive it?',
  'Dükkândan': 'At the shop',
  'Kargoyla': 'By courier',
  'Sütlü / kaymaklı sever misiniz?': 'Do you like milky / cream-filled sweets?',
  'Evet, bayılırım': 'Yes, love them',
  'Hayır, klasik olsun': 'No, keep it classic',
  'Fark etmez': 'Either way',
  'Önerimiz': 'Our suggestion',
  'Baştan sor': 'Start over',
  'Geri': 'Back',
  'Kargoya en dayanıklı çeşit; az şerbetli olduğu için yolda dağılmaz.':
    'The sturdiest variety for shipping — light on syrup, so it survives the journey.',
  'Yola çıkacak sipariş için en güvenli seçim — 10–15 gün tazeliğini korur.':
    'The safest choice for a parcel — it stays fresh for 10–15 days.',
  'Kaymak ve fıstığın buluştuğu klasik. Buzdolabında iki gün içinde tüketin.':
    'The classic where clotted cream meets pistachio. Keep refrigerated, eat within two days.',
  'Katmanları yaprak gibi ayrılır, kalabalık sofrada göz doldurur.':
    'Its layers separate like leaves — a showpiece on a crowded table.',
  'Tek tepside bütün çeşitler — herkesin sevdiği bir şey çıkar.':
    'Every variety on one tray — there is something for everyone.',
  'Fıstık oranı en yüksek çeşitlerden; ikramda en çok beğenilen.':
    'One of the most pistachio-dense varieties; the favourite when serving guests.',
  'Geniş tabanlı dilim, her lokmada artan fıstık. Az kişi için ideal.':
    'A broad-based slice with more pistachio in every bite. Ideal for a few people.',

  /* ===== bugün vitrinde ===== */
  'Bugün vitrinde': 'In the display today',
  'Sabah ne': 'Whatever came out',
  'çıktıysa.': 'this morning.',
  'Tezgâh her sabah sıfırdan kurulur. Bugün vitrinde duran çeşitler aşağıda — akşama kalmayabilir.':
    'The bench is set from scratch every morning. What is in the display today is listed below — it may not last until evening.',
  'Bugünkü vitrin fotoğrafı': 'Today’s display photo',
  'Güncelleme': 'Updated',

  /* ===== story arşivi ===== */
  'Arşiv': 'Archive',
  'Tezgâhtan': 'Weekly frames',
  'haftalık kareler.': 'from the bench.',
  'Instagram hikâyelerinde paylaşılan üretim anları burada kalıcı olarak duruyor.':
    'Production moments shared in Instagram stories are kept here permanently.',

  /* ===== fark tablosu ===== */
  'Neden bizden': 'Why buy from us',
  'Aynı isim,': 'Same name,',
  'aynı şey değil.': 'not the same thing.',
  'Raftaki kutulu baklava ile tezgâhtan çıkan baklava arasındaki farkı madde madde yazdık. Sağ sütun, uzun raf ömrü için yapılan tavizleri anlatıyor.':
    'We listed, point by point, the difference between boxed shelf baklava and baklava straight off the bench. The right column describes the compromises made for a long shelf life.',
  'Sağ sütun, sektörde yaygın olan endüstriyel üretim yöntemlerini tarif eder; belirli bir markayı işaret etmez.':
    'The right column describes industrial production methods common in the sector; it does not point at any particular brand.',
  'Ali Usta ile endüstriyel üretim karşılaştırması': 'Ali Usta compared with industrial production',
  'Ölçüt': 'Criterion',
  'Endüstriyel üretim': 'Industrial production',
  'Yağ': 'Fat',
  'Tatlandırıcı': 'Sweetener',
  'Fıstık': 'Pistachio',
  'Yufka': 'Pastry',
  'Koruyucu': 'Preservatives',
  'Üretim': 'Production',
  'Vitrin': 'Display',
  'Gerçek tereyağı': 'Real butter',
  'Margarin / karışım yağ': 'Margarine / blended fat',
  'Glikoz şurubu': 'Glucose syrup',
  'Aynı sabah kavrulmuş Antep': 'Antep pistachio roasted the same morning',
  'Aylar önce kavrulmuş, boyalı olabilir': 'Roasted months ago, possibly dyed',
  'Elde açılmış, kırk kat': 'Hand-rolled, forty layers',
  'Makine yufkası, sabit kalınlık': 'Machine pastry, fixed thickness',
  'Yok': 'None',
  'Raf ömrü uzatıcı katkı': 'Shelf-life extending additives',
  'Her sabah, o günlük': 'Every morning, for that day',
  'Haftalık parti üretim': 'Weekly batch production',
  '3–4 gün (kuru: 10–15)': '3–4 days (dry: 10–15)',
  '30+ gün': '30+ days',
  'Akşam boşalır': 'Empties by evening',
  'Ertesi güne devreder': 'Carries over to the next day',

  /* ===== kargo hesaplayıcı ve takip ===== */
  'Kargo ücreti hesaplayıcı': 'Shipping cost calculator',
  'Ağırlık (kg)': 'Weight (kg)',
  'İl seçin': 'Choose a province',
  'İl ve ağırlık seçin.': 'Choose a province and a weight.',
  'Sipariş tutarı': 'Orders over',
  'üzerindeyse kargo ücretsizdir.': 'ship free of charge.',
  'Tahmini tarifedir; kesin ücret kargo firmasının o günkü desi hesabına göre belirlenir.':
    'This is an estimated tariff; the exact cost is set by the courier’s volumetric calculation on the day.',
  'Sipariş takibi': 'Order tracking',
  'Sipariş kodu': 'Order code',
  'Sorgula': 'Track',
  'Kodunuz WhatsApp mesajınızda yazar. Kod paylaşıldıktan sonra bu alandan durumu takip edebilirsiniz.':
    'Your code is in your WhatsApp message. Once it has been shared you can follow the status here.',
  'Sipariş alındı': 'Order received',
  'Hazırlanıyor': 'Being prepared',
  'Kargoda': 'In transit',
  'Teslim edildi': 'Delivered',
  'Takip no': 'Tracking no',
  'Bu kodla bir sipariş bulunamadı. Kodu WhatsApp mesajınızda bulabilirsiniz; emin değilseniz bize yazın.':
    'No order found with this code. You can find it in your WhatsApp message; if unsure, write to us.',
  'Gaziantep ve çevre iller': 'Gaziantep and neighbouring provinces',
  'Batı ve İç Anadolu': 'Western and Central Anatolia',
  'Karadeniz ve Doğu': 'Black Sea and the East',
  '1 iş günü': '1 business day',
  '1–2 iş günü': '1–2 business days',
  '2–3 iş günü': '2–3 business days',

  /* ===== yazılar ===== */
  'Yazılar': 'Stories',
  'Tezgâhın': 'The knowledge',
  'arkasındaki bilgi.': 'behind the bench.',
  'Yufkanın kaç kat olduğundan şerbetin kıvamına kadar, sık sorulanların uzun cevapları.':
    'From how many layers the pastry has to the exact consistency of the syrup — the long answers to the questions we get most.',
  'Yazıyı oku': 'Read the story',
  'Yazı': 'Story',
  'Ürünlere göz at': 'Browse the products',
  'dk okuma': 'min read',
  'Ocak': 'January', 'Şubat': 'February', 'Mart': 'March', 'Nisan': 'April',
  'Mayıs': 'May', 'Haziran': 'June', 'Temmuz': 'July', 'Ağustos': 'August',
  'Eylül': 'September', 'Ekim': 'October', 'Kasım': 'November', 'Aralık': 'December',

  'Yufka neden kırk kat?': 'Why forty layers of pastry?',
  'Kırk sayısı gelenekten mi geliyor, fizikten mi? Katman sayısı baklavanın çıtırlığını nasıl belirliyor?':
    'Does the number forty come from tradition or from physics? How the layer count decides whether baklava is crisp.',
  'Antep baklavasında “kırk kat” bir süsleme değil, ölçü. Yufka ne kadar inceyse o kadar çok kat açılabilir; her kat arasına giren tereyağı fırında buharlaşırken katmanları birbirinden ayırır. Çıtırlığın kaynağı bu ayrışmadır.':
    'In Antep baklava “forty layers” is not decoration, it is a measure. The thinner the pastry, the more layers can be rolled; the butter between them evaporates in the oven and prises the layers apart. That separation is the source of the crispness.',
  'Ustanın oklava altında yufkayı ne kadar inceltebildiği, kaç kat açabileceğini belirler. Otuz katın altına düşen baklava hamurumsu kalır; elliyi geçen baklava ise dağılır. Kırk civarı, yüzyıllar içinde deneme yanılmayla bulunmuş denge noktasıdır.':
    'How thin the master can roll the pastry decides how many layers are possible. Below thirty layers the result stays doughy; above fifty it falls apart. Around forty is the balance point found by trial and error over centuries.',
  'Ali Usta’nın tezgâhında yufka elde açılır. Makineyle açılan yufkanın kalınlığı sabittir; el, hamurun o günkü nemine göre kalınlığı değiştirir. Aynı tarif, aynı un, farklı gün — farklı kalınlık. Ölçü değil, sezgi.':
    'At Ali Usta’s bench the pastry is rolled by hand. Machine-rolled sheets have a fixed thickness; a hand adjusts to the dough’s moisture that day. Same recipe, same flour, different day — different thickness. Not measurement, instinct.',

  'Antep fıstığı neden bu kadar yeşil?': 'Why is Antep pistachio so green?',
  'Rengin sırrı toprakta mı, hasat zamanında mı? Gerçek Antep fıstığını taklidinden ayıran işaretler.':
    'Is the colour down to the soil or the harvest time? The signs that separate real Antep pistachio from its imitations.',
  'Fıstığın yeşilliği klorofil ve antosiyanin dengesinden gelir. Hasat erken yapılırsa iç fıstık koyu yeşil, geç yapılırsa sarımsı olur. Baklavalık fıstık bilerek erken toplanır — hem daha yeşil hem daha aromatiktir.':
    'The green comes from the balance of chlorophyll and anthocyanin. Harvested early, the kernel is deep green; harvested late, it turns yellowish. Pistachio meant for baklava is picked early on purpose — greener and more aromatic.',
  'Gaziantep’in fıstık kuşağı, kireçli toprak ve sert kışlarıyla bu rengi destekler. Aynı ağaç başka toprakta daha soluk ürün verir. Coğrafi işaret tescilinin sebebi de budur.':
    'Gaziantep’s pistachio belt, with its calcareous soil and hard winters, supports that colour. The same tree yields a paler nut elsewhere. That is exactly why the geographical indication exists.',
  'Boyalı fıstığı ayırt etmek kolay: avucunuzda ovun. Gerçek fıstık elinizi boyamaz, kırıldığında iç kısmı da dışı kadar yeşildir. Kokusu tereyağımsıdır; boyalı olan kokusuzdur.':
    'Spotting a dyed nut is easy: rub it in your palm. Real pistachio does not stain your hand, and when broken the inside is as green as the outside. It smells buttery; a dyed one smells of nothing.',

  'Şerbetin kıvamı nasıl tutturulur?': 'How is the syrup’s consistency judged?',
  'Bir derece fark, baklavayı ya sünger yapar ya cam. Ustanın gözle ölçtüğü kıvam noktası.':
    'One degree turns baklava into a sponge or into glass. The consistency the master measures by eye.',
  'Şerbet, su ile şekerin belli bir yoğunluğa gelene kadar kaynatılmasıdır. Fazla kaynarsa şeker kristalleşir, baklava cam gibi sertleşir; az kaynarsa yufkaya işlemez, tepsi dibinde birikir.':
    'Syrup is water and sugar boiled to a certain density. Boil it too long and the sugar crystallises, hardening the baklava like glass; boil it too little and it never soaks in, pooling at the bottom of the tray.',
  'Doğru kıvam, kaşıktan akarken ipliğe benzer bir iz bırakır. Termometre 104–106 °C gösterir ama usta termometreye bakmaz; kaşığın kenarındaki akışa bakar.':
    'At the right consistency it leaves a thread-like trail off the spoon. A thermometer reads 104–106 °C, but the master does not look at the thermometer — he watches the flow at the edge of the spoon.',
  'Bir kural daha var: sıcak baklavaya soğuk şerbet, soğuk baklavaya sıcak şerbet. İkisi de sıcak olursa yufka yumuşar, ikisi de soğuk olursa şerbet emilmez.':
    'One more rule: cold syrup on hot baklava, hot syrup on cold baklava. If both are hot the pastry goes soft; if both are cold the syrup is never absorbed.',

  'Baklava buzdolabında saklanır mı?': 'Should baklava be kept in the fridge?',
  'En sık sorulan soru ve en sık yapılan hata. Çeşide göre doğru saklama yöntemi.':
    'The most asked question and the most common mistake. The right way to store each variety.',
  'Kısa cevap: sade fıstıklı baklava buzdolabına girmez. Soğuk, tereyağını katılaştırır ve yufkayı sertleştirir. Oda sıcaklığında, ağzı kapalı bir kutuda 3–4 gün tazeliğini korur.':
    'Short answer: plain pistachio baklava does not belong in the fridge. Cold solidifies the butter and stiffens the pastry. In a closed box at room temperature it keeps for 3–4 days.',
  'İstisna kaymaklı çeşitlerdir. Şöbiyet, yaprak şöbiyet ve kaymaklı sunumlar buzdolabında saklanmalı ve iki gün içinde tüketilmelidir — kaymak bozulur.':
    'The exception is anything with clotted cream. Şöbiyet, yaprak şöbiyet and cream-filled servings must be refrigerated and eaten within two days — the cream spoils.',
  'Kuru baklava en dayanıklısıdır: az şerbetli olduğu için oda sıcaklığında 10–15 gün durur. Kargoya bu yüzden kuru baklava tercih edilir.':
    'Dry baklava is the most durable: light on syrup, it keeps 10–15 days at room temperature. That is why it is the one we ship.',

  'Künefe mi, baklava mı?': 'Künefe or baklava?',
  'İki tatlının hangi durumda birbirinden daha iyi olduğuna dair dürüst bir kılavuz.':
    'An honest guide to when each of the two is the better choice.',
  'Künefe sıcak yenir, baklava beklemeyi kaldırır. Misafirlik, ikram ve hediye için baklava; oturup yemek için künefe.':
    'Künefe is eaten hot; baklava can wait. Baklava for visits, offerings and gifts; künefe for sitting down to eat.',
  'Künefe kargoya gitmez — tel kadayıf ve peynir soğuyunca dokusunu kaybeder. Uzağa gönderilecekse baklava, özellikle kuru baklava tercih edilmeli.':
    'Künefe cannot be shipped — the shredded pastry and cheese lose their texture once cold. For a parcel, choose baklava, especially dry baklava.',
  'Kalabalık sofralarda ikisini birden koymak en iyisidir: baklava tepside bekler, künefe sırayla tezgâhtan gelir.':
    'At a big table the best answer is both: baklava waits on the tray while künefe comes off the bench in rounds.',

  /* ===== bülten, tema, ses ===== */
  'Bülten': 'Newsletter',
  'Bayram ve sezon duyuruları': 'Holiday and season announcements',
  'Yılda birkaç mesaj — bayram siparişleri açıldığında, güllaç mevsimi geldiğinde haber veririz. Reklam yok.':
    'A handful of messages a year — when holiday orders open and when güllaç season arrives. No advertising.',
  'E-posta adresiniz': 'Your email address',
  'Kaydol': 'Subscribe',
  'Geçerli bir e-posta adresi yazın.': 'Enter a valid email address.',
  'Kaydınız alındı. Bayram ve sezon duyurularında haber vereceğiz.':
    'You are on the list. We will write when holiday and season announcements go out.',
  'Koyu temaya geç': 'Switch to dark theme',
  'Açık temaya geç': 'Switch to light theme',
  'Arayüz seslerini aç': 'Turn interface sounds on',
  'Arayüz seslerini kapat': 'Turn interface sounds off',
"""

AR = """
  /* ===== الأقسام الجديدة — السلة والطلب ===== */
  'Sepet': 'السلة',
  'Sepeti aç': 'فتح السلة',
  'Siparişinizi hazırlayın': 'جهّز طلبك',
  'Sepete ekle': 'أضف إلى السلة',
  'Eklendi ✓': 'تمت الإضافة ✓',
  'Ölçü': 'الحجم',
  'Adet': 'الكمية',
  'Azalt': 'إنقاص',
  'Artır': 'زيادة',
  'Satırı sil': 'حذف العنصر',
  'porsiyon': 'حصة',
  'Porsiyon': 'الحصة',
  'Ara toplam': 'المجموع الفرعي',
  'Toplam': 'الإجمالي',
  'Ücretsiz': 'مجاني',
  'Yaklaşık ağırlık': 'الوزن التقريبي',
  'Teslim': 'التسليم',
  'Dükkândan alacağım': 'سأستلمه من المحل',
  'Kargo ile gönderilsin': 'أرسلوه بالشحن',
  'Seçin': 'اختر',
  'WhatsApp’tan sipariş ver': 'اطلب عبر واتساب',
  'Hediye paketi': 'تغليف الهدايا',
  'Kurdeleli hediye ambalajı': 'تغليف هدية بشريطة',
  'El yazısı hediye kartı': 'بطاقة هدية بخط اليد',
  'Ahşap hediye kutusu': 'علبة هدايا خشبية',
  'Kimden–kime notunuzu sipariş formundaki “Not” alanına yazın.':
    'اكتب عبارة «من… إلى…» في خانة «ملاحظة» في نموذج الطلب.',
  'Sepetiniz boş. Yukarıdan ürün ekleyin ya da ürün kartlarındaki “Sepete ekle” düğmesini kullanın.':
    'سلتك فارغة. أضف منتجاً من الأعلى أو استخدم زر «أضف إلى السلة» على بطاقات المنتجات.',
  'Tutarlar tahminidir; kesin fiyat WhatsApp’ta teyit edilir.':
    'المبالغ تقديرية؛ يُؤكَّد السعر النهائي عبر واتساب.',
  '250 g': '٢٥٠ غ',
  '500 g': '٥٠٠ غ',
  '1 kg': '١ كغ',
  'Yarım tepsi': 'نصف صينية',
  'Tam tepsi': 'صينية كاملة',
  'Büyük tepsi': 'صينية كبيرة',

  /* ===== مرشّح المُحسِّسات والمقارنة ===== */
  'İçermesin:': 'استبعد:',
  'Temizle': 'مسح',
  'Karşılaştır': 'قارن',
  'Ürün karşılaştırma': 'مقارنة المنتجات',
  'Fiyat / kg': 'السعر / كغ',
  'Kargoya uygunluk': 'الملاءمة للشحن',
  'Çok uygun': 'ممتازة',
  'Uygun': 'مناسبة',
  'Uygun değil — kaymaklı': 'غير مناسبة — تحتوي قشطة',

  /* ===== مرشد الحلويات ===== */
  'Karar veremediniz mi?': 'لم تستطع الاختيار؟',
  'Bana bir': 'اختر لي',
  'tatlı seç.': 'حلوى.',
  'Üç soru soruyoruz, tezgâhtan size en uygun çeşidi öneriyoruz. Kaç kişi olduğunuza, nasıl teslim alacağınıza ve kaymak sevip sevmediğinize bakıyoruz.':
    'ثلاثة أسئلة ونقترح عليك الصنف الأنسب: كم عددكم، وكيف ستستلمه، وهل تحب القشطة.',
  'Öneri, ustanın sofra tecrübesine göre kurulmuş basit bir kılavuzdur — son karar sizin.':
    'الاقتراح دليل بسيط مبني على خبرة الأسطى في السفرة — والقرار الأخير لك.',
  'Tatlı Seç': 'اختر حلوى',
  'Kaç kişilik?': 'لكم شخصاً؟',
  '1–4 kişi': '١–٤ أشخاص',
  '5–15 kişi': '٥–١٥ شخصاً',
  '15+ kişi': 'أكثر من ١٥',
  'Nasıl teslim alacaksınız?': 'كيف ستستلمه؟',
  'Dükkândan': 'من المحل',
  'Kargoyla': 'بالشحن',
  'Sütlü / kaymaklı sever misiniz?': 'هل تحب الحلويات بالحليب أو القشطة؟',
  'Evet, bayılırım': 'نعم، أحبها كثيراً',
  'Hayır, klasik olsun': 'لا، لتكن كلاسيكية',
  'Fark etmez': 'لا فرق',
  'Önerimiz': 'اقتراحنا',
  'Baştan sor': 'ابدأ من جديد',
  'Geri': 'رجوع',
  'Kargoya en dayanıklı çeşit; az şerbetli olduğu için yolda dağılmaz.':
    'أكثر الأصناف تحمّلاً للشحن؛ قليلة القطر فلا تتفكك في الطريق.',
  'Yola çıkacak sipariş için en güvenli seçim — 10–15 gün tazeliğini korur.':
    'الخيار الأأمن للطلب المُرسَل — يحافظ على طزاجته ١٠–١٥ يوماً.',
  'Kaymak ve fıstığın buluştuğu klasik. Buzdolabında iki gün içinde tüketin.':
    'الكلاسيكية التي تجمع القشطة والفستق. احفظها في الثلاجة وتناولها خلال يومين.',
  'Katmanları yaprak gibi ayrılır, kalabalık sofrada göz doldurur.':
    'تنفصل طبقاتها كالأوراق، وتلفت الأنظار على السفرة الكبيرة.',
  'Tek tepside bütün çeşitler — herkesin sevdiği bir şey çıkar.':
    'كل الأصناف في صينية واحدة — يجد كل ضيف ما يحبه.',
  'Fıstık oranı en yüksek çeşitlerden; ikramda en çok beğenilen.':
    'من أعلى الأصناف نسبةً في الفستق؛ الأكثر إعجاباً عند الضيافة.',
  'Geniş tabanlı dilim, her lokmada artan fıstık. Az kişi için ideal.':
    'شريحة عريضة القاعدة وفستق أوفر في كل لقمة. مثالية لعدد قليل.',

  /* ===== واجهة العرض اليوم ===== */
  'Bugün vitrinde': 'في الواجهة اليوم',
  'Sabah ne': 'ما خرج',
  'çıktıysa.': 'هذا الصباح.',
  'Tezgâh her sabah sıfırdan kurulur. Bugün vitrinde duran çeşitler aşağıda — akşama kalmayabilir.':
    'تُجهَّز الطاولة من الصفر كل صباح. الأصناف الموجودة اليوم في الواجهة مذكورة أدناه — وقد لا تبقى حتى المساء.',
  'Bugünkü vitrin fotoğrafı': 'صورة واجهة اليوم',
  'Güncelleme': 'آخر تحديث',

  /* ===== أرشيف الستوري ===== */
  'Arşiv': 'الأرشيف',
  'Tezgâhtan': 'لقطات أسبوعية',
  'haftalık kareler.': 'من الطاولة.',
  'Instagram hikâyelerinde paylaşılan üretim anları burada kalıcı olarak duruyor.':
    'لحظات الإنتاج المنشورة في ستوري إنستغرام محفوظة هنا بشكل دائم.',

  /* ===== جدول الفرق ===== */
  'Neden bizden': 'لماذا من عندنا',
  'Aynı isim,': 'الاسم نفسه،',
  'aynı şey değil.': 'لكن ليس الشيء نفسه.',
  'Raftaki kutulu baklava ile tezgâhtan çıkan baklava arasındaki farkı madde madde yazdık. Sağ sütun, uzun raf ömrü için yapılan tavizleri anlatıyor.':
    'كتبنا الفرق بنداً بنداً بين البقلاوة المعلّبة على الرف والبقلاوة الخارجة من الطاولة. العمود الآخر يصف التنازلات التي تُقدَّم لإطالة العمر على الرف.',
  'Sağ sütun, sektörde yaygın olan endüstriyel üretim yöntemlerini tarif eder; belirli bir markayı işaret etmez.':
    'يصف ذلك العمود أساليب الإنتاج الصناعي الشائعة في القطاع، ولا يشير إلى علامة تجارية بعينها.',
  'Ali Usta ile endüstriyel üretim karşılaştırması': 'مقارنة بين علي أوسطا والإنتاج الصناعي',
  'Ölçüt': 'المعيار',
  'Endüstriyel üretim': 'الإنتاج الصناعي',
  'Yağ': 'الدهن',
  'Tatlandırıcı': 'المُحلّي',
  'Fıstık': 'الفستق',
  'Yufka': 'العجين',
  'Koruyucu': 'المواد الحافظة',
  'Üretim': 'الإنتاج',
  'Vitrin': 'الواجهة',
  'Gerçek tereyağı': 'زبدة حقيقية',
  'Margarin / karışım yağ': 'مرغرين / دهن مخلوط',
  'Glikoz şurubu': 'شراب الغلوكوز',
  'Aynı sabah kavrulmuş Antep': 'فستق عنتابي محمّص في الصباح نفسه',
  'Aylar önce kavrulmuş, boyalı olabilir': 'محمّص منذ أشهر، وقد يكون ملوّناً',
  'Elde açılmış, kırk kat': 'مفرود باليد، أربعون طبقة',
  'Makine yufkası, sabit kalınlık': 'عجين آلة بسماكة ثابتة',
  'Yok': 'لا يوجد',
  'Raf ömrü uzatıcı katkı': 'مضافات لإطالة العمر على الرف',
  'Her sabah, o günlük': 'كل صباح، ليوم واحد',
  'Haftalık parti üretim': 'إنتاج بدفعات أسبوعية',
  '3–4 gün (kuru: 10–15)': '٣–٤ أيام (الجافة: ١٠–١٥)',
  '30+ gün': 'أكثر من ٣٠ يوماً',
  'Akşam boşalır': 'تفرغ مساءً',
  'Ertesi güne devreder': 'تُنقَل إلى اليوم التالي',

  /* ===== حاسبة الشحن والتتبّع ===== */
  'Kargo ücreti hesaplayıcı': 'حاسبة تكلفة الشحن',
  'Ağırlık (kg)': 'الوزن (كغ)',
  'İl seçin': 'اختر المحافظة',
  'İl ve ağırlık seçin.': 'اختر المحافظة والوزن.',
  'Sipariş tutarı': 'الطلبات التي تتجاوز',
  'üzerindeyse kargo ücretsizdir.': 'تُشحَن مجاناً.',
  'Tahmini tarifedir; kesin ücret kargo firmasının o günkü desi hesabına göre belirlenir.':
    'التعرفة تقديرية؛ تُحدَّد التكلفة الدقيقة وفق حساب الحجم لدى شركة الشحن في يومه.',
  'Sipariş takibi': 'تتبّع الطلب',
  'Sipariş kodu': 'رمز الطلب',
  'Sorgula': 'تتبّع',
  'Kodunuz WhatsApp mesajınızda yazar. Kod paylaşıldıktan sonra bu alandan durumu takip edebilirsiniz.':
    'ستجد الرمز في رسالتك على واتساب. بعد مشاركته يمكنك متابعة الحالة من هنا.',
  'Sipariş alındı': 'تم استلام الطلب',
  'Hazırlanıyor': 'قيد التحضير',
  'Kargoda': 'في الشحن',
  'Teslim edildi': 'تم التسليم',
  'Takip no': 'رقم التتبّع',
  'Bu kodla bir sipariş bulunamadı. Kodu WhatsApp mesajınızda bulabilirsiniz; emin değilseniz bize yazın.':
    'لا يوجد طلب بهذا الرمز. ستجده في رسالتك على واتساب، وإن لم تكن متأكداً فراسِلنا.',
  'Gaziantep ve çevre iller': 'غازي عنتاب والمحافظات المجاورة',
  'Batı ve İç Anadolu': 'غرب الأناضول ووسطه',
  'Karadeniz ve Doğu': 'البحر الأسود والشرق',
  '1 iş günü': 'يوم عمل واحد',
  '1–2 iş günü': 'يوما عمل',
  '2–3 iş günü': '٢–٣ أيام عمل',

  /* ===== المقالات ===== */
  'Yazılar': 'مقالات',
  'Tezgâhın': 'المعرفة',
  'arkasındaki bilgi.': 'خلف الطاولة.',
  'Yufkanın kaç kat olduğundan şerbetin kıvamına kadar, sık sorulanların uzun cevapları.':
    'من عدد طبقات العجين إلى قوام القطر — الأجوبة المطوّلة على أكثر الأسئلة تكراراً.',
  'Yazıyı oku': 'اقرأ المقال',
  'Yazı': 'مقال',
  'Ürünlere göz at': 'تصفّح المنتجات',
  'dk okuma': 'دقيقة قراءة',
  'Ocak': 'يناير', 'Şubat': 'فبراير', 'Mart': 'مارس', 'Nisan': 'أبريل',
  'Mayıs': 'مايو', 'Haziran': 'يونيو', 'Temmuz': 'يوليو', 'Ağustos': 'أغسطس',
  'Eylül': 'سبتمبر', 'Ekim': 'أكتوبر', 'Kasım': 'نوفمبر', 'Aralık': 'ديسمبر',

  'Yufka neden kırk kat?': 'لماذا أربعون طبقة من العجين؟',
  'Kırk sayısı gelenekten mi geliyor, fizikten mi? Katman sayısı baklavanın çıtırlığını nasıl belirliyor?':
    'هل يأتي الرقم أربعون من التقليد أم من الفيزياء؟ وكيف يحدّد عدد الطبقات هشاشة البقلاوة؟',
  'Antep baklavasında “kırk kat” bir süsleme değil, ölçü. Yufka ne kadar inceyse o kadar çok kat açılabilir; her kat arasına giren tereyağı fırında buharlaşırken katmanları birbirinden ayırır. Çıtırlığın kaynağı bu ayrışmadır.':
    'في بقلاوة عنتاب ليست «أربعون طبقة» زخرفاً بل مقياساً. كلما رقّ العجين أمكن فرد طبقات أكثر؛ والزبدة بين الطبقات تتبخّر في الفرن فتفصل بعضها عن بعض. هذا الانفصال هو مصدر الهشاشة.',
  'Ustanın oklava altında yufkayı ne kadar inceltebildiği, kaç kat açabileceğini belirler. Otuz katın altına düşen baklava hamurumsu kalır; elliyi geçen baklava ise dağılır. Kırk civarı, yüzyıllar içinde deneme yanılmayla bulunmuş denge noktasıdır.':
    'مدى قدرة الأسطى على ترقيق العجين تحت الشوبك تحدّد عدد الطبقات. ما دون الثلاثين يبقى عجينياً، وما فوق الخمسين يتفتّت. والأربعون تقريباً هي نقطة التوازن التي وُجدت بالتجربة عبر قرون.',
  'Ali Usta’nın tezgâhında yufka elde açılır. Makineyle açılan yufkanın kalınlığı sabittir; el, hamurun o günkü nemine göre kalınlığı değiştirir. Aynı tarif, aynı un, farklı gün — farklı kalınlık. Ölçü değil, sezgi.':
    'يُفرد العجين باليد على طاولة علي أوسطا. عجين الآلة ثابت السماكة، أما اليد فتغيّر السماكة بحسب رطوبة العجين في ذلك اليوم. الوصفة نفسها والطحين نفسه ويوم مختلف — سماكة مختلفة. ليست قياساً بل حدساً.',

  'Antep fıstığı neden bu kadar yeşil?': 'لماذا الفستق العنتابي أخضر إلى هذا الحد؟',
  'Rengin sırrı toprakta mı, hasat zamanında mı? Gerçek Antep fıstığını taklidinden ayıran işaretler.':
    'أسرّ اللون في التربة أم في موعد الحصاد؟ وعلامات تميّز الفستق العنتابي الحقيقي عن مقلّده.',
  'Fıstığın yeşilliği klorofil ve antosiyanin dengesinden gelir. Hasat erken yapılırsa iç fıstık koyu yeşil, geç yapılırsa sarımsı olur. Baklavalık fıstık bilerek erken toplanır — hem daha yeşil hem daha aromatiktir.':
    'تأتي خضرة الفستق من توازن الكلوروفيل والأنثوسيانين. إن بُكِّر الحصاد كانت اللبّة خضراء داكنة، وإن تأخّر مالت إلى الاصفرار. ويُقطف فستق البقلاوة مبكراً عن قصد — فهو أشدّ خضرة وأغنى عطراً.',
  'Gaziantep’in fıstık kuşağı, kireçli toprak ve sert kışlarıyla bu rengi destekler. Aynı ağaç başka toprakta daha soluk ürün verir. Coğrafi işaret tescilinin sebebi de budur.':
    'حزام الفستق في غازي عنتاب، بتربته الكلسية وشتائه القاسي، يدعم هذا اللون. والشجرة نفسها تعطي ثمراً أبهت في تربة أخرى. ولهذا بالضبط وُجد تسجيل المؤشر الجغرافي.',
  'Boyalı fıstığı ayırt etmek kolay: avucunuzda ovun. Gerçek fıstık elinizi boyamaz, kırıldığında iç kısmı da dışı kadar yeşildir. Kokusu tereyağımsıdır; boyalı olan kokusuzdur.':
    'تمييز الفستق الملوّن سهل: افركه في كفّك. الفستق الحقيقي لا يصبغ يدك، وإذا كُسر كان داخله أخضر كخارجه، ورائحته زبدية؛ أما الملوّن فلا رائحة له.',

  'Şerbetin kıvamı nasıl tutturulur?': 'كيف يُضبط قوام القطر؟',
  'Bir derece fark, baklavayı ya sünger yapar ya cam. Ustanın gözle ölçtüğü kıvam noktası.':
    'درجة واحدة تحوّل البقلاوة إلى إسفنجة أو إلى زجاج. نقطة القوام التي يقيسها الأسطى بعينه.',
  'Şerbet, su ile şekerin belli bir yoğunluğa gelene kadar kaynatılmasıdır. Fazla kaynarsa şeker kristalleşir, baklava cam gibi sertleşir; az kaynarsa yufkaya işlemez, tepsi dibinde birikir.':
    'القطر هو ماء وسكر يُغليان حتى كثافة معيّنة. إن زاد الغلي تبلور السكر وتصلّبت البقلاوة كالزجاج، وإن قلّ لم ينفذ إلى العجين وتجمّع في قاع الصينية.',
  'Doğru kıvam, kaşıktan akarken ipliğe benzer bir iz bırakır. Termometre 104–106 °C gösterir ama usta termometreye bakmaz; kaşığın kenarındaki akışa bakar.':
    'عند القوام الصحيح يترك أثراً كالخيط وهو ينساب عن الملعقة. يشير المقياس إلى ١٠٤–١٠٦ °م، لكن الأسطى لا ينظر إلى المقياس بل إلى الانسياب عند حافة الملعقة.',
  'Bir kural daha var: sıcak baklavaya soğuk şerbet, soğuk baklavaya sıcak şerbet. İkisi de sıcak olursa yufka yumuşar, ikisi de soğuk olursa şerbet emilmez.':
    'وثمّة قاعدة أخرى: قطر بارد على بقلاوة ساخنة، وقطر ساخن على بقلاوة باردة. فإن كانا ساخنين لان العجين، وإن كانا باردين لم يُمتصّ القطر.',

  'Baklava buzdolabında saklanır mı?': 'هل تُحفظ البقلاوة في الثلاجة؟',
  'En sık sorulan soru ve en sık yapılan hata. Çeşide göre doğru saklama yöntemi.':
    'أكثر الأسئلة تكراراً وأكثر الأخطاء شيوعاً. الطريقة الصحيحة لحفظ كل صنف.',
  'Kısa cevap: sade fıstıklı baklava buzdolabına girmez. Soğuk, tereyağını katılaştırır ve yufkayı sertleştirir. Oda sıcaklığında, ağzı kapalı bir kutuda 3–4 gün tazeliğini korur.':
    'الجواب المختصر: البقلاوة بالفستق السادة لا توضع في الثلاجة. فالبرودة تجمّد الزبدة وتقسّي العجين. وفي علبة مغلقة بحرارة الغرفة تبقى طازجة ٣–٤ أيام.',
  'İstisna kaymaklı çeşitlerdir. Şöbiyet, yaprak şöbiyet ve kaymaklı sunumlar buzdolabında saklanmalı ve iki gün içinde tüketilmelidir — kaymak bozulur.':
    'الاستثناء هو الأصناف بالقشطة. الشُّبيّات وورق الشُّبيّات والتقديمات بالقشطة تُحفظ في الثلاجة وتُؤكل خلال يومين — لأن القشطة تفسد.',
  'Kuru baklava en dayanıklısıdır: az şerbetli olduğu için oda sıcaklığında 10–15 gün durur. Kargoya bu yüzden kuru baklava tercih edilir.':
    'البقلاوة الجافة أكثرها تحمّلاً: لقلّة القطر فيها تبقى ١٠–١٥ يوماً بحرارة الغرفة. ولهذا تُفضَّل للشحن.',

  'Künefe mi, baklava mı?': 'كنافة أم بقلاوة؟',
  'İki tatlının hangi durumda birbirinden daha iyi olduğuna dair dürüst bir kılavuz.':
    'دليل صادق لمعرفة أيّهما أفضل في كل حالة.',
  'Künefe sıcak yenir, baklava beklemeyi kaldırır. Misafirlik, ikram ve hediye için baklava; oturup yemek için künefe.':
    'الكنافة تُؤكل ساخنة، والبقلاوة تحتمل الانتظار. البقلاوة للزيارة والضيافة والهدية، والكنافة للجلوس والأكل.',
  'Künefe kargoya gitmez — tel kadayıf ve peynir soğuyunca dokusunu kaybeder. Uzağa gönderilecekse baklava, özellikle kuru baklava tercih edilmeli.':
    'الكنافة لا تُشحن — إذ يفقد الكدايف والجبن قوامهما عند البرودة. وللإرسال البعيد تُفضَّل البقلاوة، وخاصة الجافة.',
  'Kalabalık sofralarda ikisini birden koymak en iyisidir: baklava tepside bekler, künefe sırayla tezgâhtan gelir.':
    'على السفرة الكبيرة الأفضل تقديمهما معاً: البقلاوة تنتظر في الصينية، والكنافة تأتي من الطاولة على دفعات.',

  /* ===== النشرة والسمة والصوت ===== */
  'Bülten': 'النشرة البريدية',
  'Bayram ve sezon duyuruları': 'إعلانات الأعياد والمواسم',
  'Yılda birkaç mesaj — bayram siparişleri açıldığında, güllaç mevsimi geldiğinde haber veririz. Reklam yok.':
    'رسائل قليلة في السنة — عند فتح طلبات العيد وعند حلول موسم الگُلّاچ. بلا إعلانات.',
  'E-posta adresiniz': 'بريدك الإلكتروني',
  'Kaydol': 'اشترك',
  'Geçerli bir e-posta adresi yazın.': 'اكتب بريداً إلكترونياً صحيحاً.',
  'Kaydınız alındı. Bayram ve sezon duyurularında haber vereceğiz.':
    'تم تسجيلك. سنراسلك عند إعلانات الأعياد والمواسم.',
  'Koyu temaya geç': 'التبديل إلى السمة الداكنة',
  'Açık temaya geç': 'التبديل إلى السمة الفاتحة',
  'Arayüz seslerini aç': 'تشغيل أصوات الواجهة',
  'Arayüz seslerini kapat': 'إيقاف أصوات الواجهة',
"""

s = io.open(P, encoding='utf-8').read()
if 'EK BÖLÜMLER — sepet' in s:
    print('zaten eklenmis'); sys.exit(0)

i = s.index('\n},\n\nar: {')
s = s[:i] + '\n' + EN.strip('\n') + s[i:]

j = s.rindex('\n}\n};')
s = s[:j] + '\n' + AR.strip('\n') + s[j:]

io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
print('i18n.js guncellendi')
