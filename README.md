<div align="center">
  <img src="assets/icon.png" width="150" alt="HQXBALL Logo">
  <h1>HQXBALL Desktop Client</h1>
  <p><b>Rekabetçi oyuncular için özel olarak tasarlanmış yüksek performanslı masaüstü istemcisi.</b></p>
  <br>
</div>

## 🚀 Proje Hakkında
**HQXBALL Desktop**, standart web tarayıcılarında (/X11/Wayland üzerinde) karşılaşılan kronik Canvas çökme ve "donma" (freeze) sorunlarını tamamen ortadan kaldırmak üzere tasarlanmıştır.

Özel kararlı (stable) **Electron 18.2.0** çekirdeği sayesinde, `FPS` limiti olmadan gecikmesiz (**0 Input Lag**) ve inanılmaz akıcı (4000+ FPS) maç deneyimi sunar. Sadece yeteneğinizin konuştuğu eşsiz bir e-spor arenasına giriş yapın.

## ✨ Öne Çıkan Özellikler
* **Limitsiz Performans:** Modern Chromium sürümlerinde görülen VSYNC çökmesi onarılmış, donanım donmaları engellenmiştir.
* **Apple-Style Hızlı Bağlantı:** Oyunun her anında `F2` tuşuna basarak, ekranda beliren okyanus pürüzsüzlüğündeki panelle dilediğiniz HQXBALL koduna yıldırım hızında bağlanın.
* **Discord Entegrasyonu (RPC):** Oyunda olduğunuzu ve istatistiklerinizi Discord profilinizde havalı bir şekilde sergileyin (Kurulu değilse bile arka planda çökmeden çalışmaya devam eder).
* **Gelişmiş Görüntüleme:** Gömülü `inject.js` ve özel Hqxball overlay eklentileriyle akıcı pip ekranı (DM Vision) ve tam kontrol.
* **Açık Kaynak & Şeffaflık:** Her saniyesinde hilesiz ve güvenilir bir kod bloğundan güç alır.

## 📥 İndirme ve Kurulum
Kurulum gerektiren veya gerektirmeyen hazır paketleri indirmek için [Releases](../../releases) sayfamızı ziyaret edin.
Sistemleriniz için şu formatlar otomatik derlenmektedir:
- **Windows:** `.exe` / `.portable`
- **MacOS:** `.dmg` / `.zip`
- **Linux:** `.AppImage` / `.deb`

## 🛠️ Geliştiriciler İçin Çalıştırma Kılavuzu
Kendi sisteminizde derlemek veya uygulamaya katkıda bulunmak isterseniz:

1. Depoyu bilgisayarınıza klonlayın:
```bash
git clone https://github.com/imsinanulgen/hqxball-app.git
cd hqxball-app
```

2. Bağımlılıkları yükleyin (Electron çekirdeği indirilecektir):
```bash
npm install
```

3. Geliştirici modunda (-limitsiz- flags ile) başlatın:
```bash
npm start
```

4. Paketi dışa aktarmak için:
```bash
npm run dist
```

## 🌐 Topluluk
Bize katılıp destek verebilir veya arkadaşlarınızla eşleşebilirsiniz:
- **Website:** [www.hqxball.com](https://www.hqxball.com)
- **Discord:** [discord.gg/hqxball](https://discord.gg/hqxball)
