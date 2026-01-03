
# NOTERA - AI-Powered Teacher Assistant 🎓✨

**NOTERA**, öğretmenlerin yazılı sınav süreçlerini baştan sona dijitalleştiren ve yapay zeka ile destekleyen profesyonel bir platformdur. 

> "Son karar her zaman öğretmenindir." prensibiyle çalışan NOTERA, bir ölçme-değerlendirme asistanıdır.

![NOTERA Banner](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)

## 🌟 Öne Çıkan Özellikler

### ✏️ EXAMORA (Akıllı Sınav Modülü)
- **AI Soru Hazırlama:** Kazanımlara uygun, zorluk seviyesi ayarlı açık uçlu sorular üretin.
- **Manuel Tanımlama:** Elinizdeki mevcut sınavları puanlama anahtarı (rubrik) ile sisteme tanıtın.
- **Resmi Çıktı:** MEB standartlarında, hazır A4 sınav kağıdı PDF'i oluşturun.

### 📸 Akıllı Okuma & Değerlendirme
- **El Yazısı OCR:** Öğrenci kağıtlarını fotoğraflayarak veya PDF olarak yükleyin.
- **Anlam Bazlı Puanlama:** AI, öğrencinin yanıtını kelime kelime değil, rubrikteki anlamsal karşılığına göre puanlar.
- **Gerekçeli Geri Bildirim:** AI her puana bir gerekçe yazar ve öğrenciye özel gelişim notu üretir.

### 📊 EDUMETRİK (Analiz & Raporlama)
- **Sınıf Karnesi:** Başarı ortalaması, güçlü ve zayıf kazanımların analizi.
- **Bireysel Rapor:** Her öğrenci için PDF formatında detaylı sonuç karnesi.
- **Veri Görselleştirme:** Etkileşimli grafiklerle sınıfın genel durumunu izleme.

## 🛠️ Teknolojiler

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **AI:** Google Gemini 3 (Pro & Flash) API
- **Analiz:** Recharts
- **Yazdırma:** Browser-native Print-to-PDF Engine

## 🚀 Kurulum

1. Bu depoyu klonlayın:
   ```bash
   git clone https://github.com/kullanici-adiniz/notera.git
   cd notera
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Gemini API anahtarınızı tanımlayın:
   Projeyi yerelde çalıştırmak için Gemini API anahtarınızın ortam değişkenlerinde (`process.env.API_KEY`) tanımlı olması gerekir.

4. Uygulamayı başlatın:
   ```bash
   npm start
   ```

## 📄 Lisans
Bu proje [MIT](LICENSE) lisansı ile korunmaktadır.

---
*NOTERA, eğitimde fırsat eşitliğini ve öğretmen verimliliğini desteklemek amacıyla geliştirilmiştir.*
