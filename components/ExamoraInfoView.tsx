
import React from 'react';

interface ExamoraInfoViewProps {
  onStart: () => void;
}

const ExamoraInfoView: React.FC<ExamoraInfoViewProps> = ({ onStart }) => {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-24 space-y-20">
      {/* Hero Section */}
      <div className="relative p-12 md:p-20 bg-notera-purple rounded-[3.5rem] shadow-2xl overflow-hidden text-white">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <svg className="w-64 h-64 rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-xs font-black text-notera-turquoise uppercase tracking-[0.5em]">EXAMORA MODÜLÜ</h2>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight">
            Sınav Hazırlamanın ve <br/> Okumanın <span className="text-notera-turquoise italic">Akıllı</span> Hali
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl font-medium leading-relaxed">
            Kazanım odaklı soru üretiminden, yapay zeka destekli el yazısı okumaya kadar tüm operasyonel süreci Examora üstlenir.
          </p>
          <button 
            onClick={onStart}
            className="px-12 py-5 bg-notera-turquoise text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl hover:scale-105 transition-all"
          >
            Hemen Sınav Hazırla
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            title: "Öğrenme Çıktısı (Kazanım) Odaklılık",
            desc: "Ders ve konu kazanımını yazın; Examora MEB müfredatına ve kazanım hiyerarşisine uygun profesyonel soruları saniyeler içinde hazırlasın.",
            icon: "🎯"
          },
          {
            title: "Seviye Ayarlı Soru Üretimi",
            desc: "Basitten ideale, her sınıf düzeyine ve zorluk derecesine uygun açık uçlu veya çoktan seçmeli sınav setleri oluşturun.",
            icon: "🪜"
          },
          {
            title: "Profesyonel Sınav Kağıdı (PDF)",
            desc: "Hazırladığınız soruları tek tıkla resmi sınav formatında (Okul adı, Tarih, İsim alanı dahil) PDF'e dönüştürün ve yazdırın.",
            icon: "📄"
          },
          {
            title: "Yapay Zeka ile Kağıt Okuma",
            desc: "Sınav sonrası kağıtları fotoğraflayın. El yazısını anlayan AI motorumuz, rubriğinize göre puanlama yapsın ve her soruya gerekçe yazsın.",
            icon: "👁️"
          }
        ].map((feat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex gap-6 group hover:border-notera-purple transition-colors">
            <div className="text-4xl bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0">{feat.icon}</div>
            <div className="space-y-3">
              <h3 className="text-xl font-black text-notera-purple dark:text-white uppercase tracking-tighter">{feat.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Process Section */}
      <div className="bg-slate-50 dark:bg-slate-800/30 p-12 md:p-20 rounded-[4rem] text-center space-y-12">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Examora Nasıl Çalışır?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Kazanım Gir", desc: "Dersinizi ve ölçmek istediğiniz kazanımı belirtin." },
            { step: "02", title: "Seç & Onayla", desc: "AI'nın önerdiği soruları düzenleyin veya puanlarını belirleyin." },
            { step: "03", title: "Kağıdı Al", desc: "Resmi sınav kağıdınızı indirin ve sınıfa dağıtın." }
          ].map((s, i) => (
            <div key={i} className="relative space-y-4">
              <div className="text-7xl font-black text-notera-purple/10 absolute -top-8 left-1/2 -translate-x-1/2 select-none">{s.step}</div>
              <h4 className="text-xl font-black text-notera-purple dark:text-notera-turquoise uppercase">{s.title}</h4>
              <p className="text-slate-500 font-bold">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamoraInfoView;
