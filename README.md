# MapEvents

## Proje Hakkında

MapEvents, NASA EONET API'sinden alınan yangın (wildfire) olaylarını Türkiye ve çevresinde harita üzerinde gösteren bir React Native uygulamasıdır. Yangınlşar harita üzerinde marker olarak gösterilir ve ayrıca Yangınların listesi ekranda sunulur.

## Özellikler
- **Harita üzerinde yangın olaylarını gösterme** (OpenStreetMap altyapısı ile)
- **Marker filtreleme:** Sadece Türkiye ve çevresindeki yangınlar gösterilir
- **Gerçek zamanlı veri:** NASA EONET API'sinden güncel yangın verisi çekilir
- **Olay listesi:** Harita altındaki listede olay başlıkları gösterilir
- **Yükleniyor ve hata durumları için kullanıcıya bilgi verme**

## Kullanılan Teknolojiler ve Sürümler
- React Native: 0.80.1
- React: 19.1.0
- react-native-maps: ^1.24.5
- react-native-map-clustering: ^3.4.2
- axios: ^1.10.0
- TypeScript: 5.0.4
- Jest (test): ^29.6.3

## Kurulum

### 1. Bağımlılıkları Yükleyin

```sh
npm install
# veya
yarn install
```

### 2. Android için Çalıştırma

```sh
npm run android
# veya
yarn android
```

### 3. iOS için Çalıştırma
İlk kez çalıştırıyorsanız veya native bağımlılıkları güncellediyseniz:

```sh
cd ios
bundle install           # CocoaPods için (ilk kurulumda)
bundle exec pod install  # CocoaPods bağımlılıklarını yükle
cd ..
```

Sonra:
```sh
npm run ios
# veya
yarn ios
```

### 4. Metro Sunucusunu Başlatma

```sh
npm start
# veya
yarn start
```

## Proje Yapısı

- `App.tsx`: Ana uygulama dosyası, harita ve marker işlevselliği burada.
- `android/` ve `ios/`: Native platform dosyaları.
- `package.json`: Bağımlılıklar ve scriptler.
- `tsconfig.json`: TypeScript yapılandırması.

## API Bilgisi
- Veri kaynağı: [NASA EONET API](https://eonet.gsfc.nasa.gov/api/v2.1/events)
- Sadece yangın (wildfire) kategorisindeki olaylar filtrelenir.

## Geliştirici Notları
- Proje TypeScript ile yazılmıştır.
- Harita başlangıç noktası Türkiye'nin merkezine ayarlanmıştır.
- Sadece geçerli koordinatlara sahip ve Türkiye sınırlarında olan yangınlar gösterilir.

## Sürüm Gereksinimleri
- Node.js >= 18
- Android Studio veya Xcode (platforma göre)
- AndroidManifest.xml dosyasında Kendi API Key'inizi girmelisiniz!

## Katkı ve Lisans
Hakan Tahta
