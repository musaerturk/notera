
import React from 'react';

interface EduMetrikInfoViewProps {
  onStart: () => void;
  isExamSet: boolean;
}

const EduMetrikInfoView: React.FC<EduMetrikInfoViewProps> = ({ onStart, isExamSet }) => {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-24 space-y-20">
      {/* Hero Section */}
      <div className="relative p-12 md:p-20 bg-notera-turquoise rounded-[3.5rem] shadow-2xl overflow-hidden text-white">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <svg className="w-64 h-64 -rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg>
        </div>
        <div className="relative z-10 space-y-6 text-center md:text-left">
          <h2 className="text-xs font-black text-slate-900/40 uppercase tracking-[0.5em]">EDUMETRİK MODÜLÜ</h2>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight">
            Veriye Dayalı <br/> <span className="text-slate-900 italic">Eğitim Vizyonu</span>
          </h1>
          <p className="text-xl text-slate-900/60 max-w-2xl font-medium leading-relaxed">
            Notları sadece birer sayı olmaktan çıkarıp, gelişim yolculuğuna dair stratejik verilere dönüştüren analiz motoru.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onStart}
              disabled={!isExamSet}
              className={`px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl transition-all ${!isExamSet ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              Analiz Panelini Aç
            </button>
            {!isExamSet && <p className="text-xs font-black text-slate-900/40 self-center uppercase tracking-widest italic">* Analiz için önce sınav tanımlayın</p>}
          </div>
        </div>
      </div>

      {/* Analytics Power Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Sınıf Başarı Analizi",
            desc: "Sınıfın genel başarı ortalamasını, başarı dağılımını ve en çok hata yapılan soruları anlık olarak görün.",
            icon: "📈"
          },
          {
            title: "Kazanım Raporları",
            desc: "Hangi öğrencinin hangi kazanımda eksik kaldığını tespit edin. Ünite bazlı gelişim grafiklerini takip edin.",
            icon: "🧬"
          },
          {
            title: "Bireysel Öğrenci Karnesi",
            desc: "Her öğrenciye özel, AI tarafından yazılmış gelişim notları içeren profesyonel karne çıktıları (PDF) üretin.",
            icon: "📋"
          }
        ].map((feat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 group hover:bg-notera-turquoise/5 transition-colors">
            <div className="text-5xl">{feat.icon}</div>
            <div className="space-y-3">
              <h3 className="text-xl font-black text-notera-turquoise uppercase tracking-tighter">{feat.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Section */}
      <div className="p-16 border-y border-slate-100 dark:border-slate-800 text-center">
        <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter max-w-2xl mx-auto italic">
          "Öğrencilerin sadece neyi yapamadığını değil, <span className="text-notera-turquoise underline decoration-4">neden</span> yapamadığını anlamak için EduMetrik."
        </h3>
      </div>

      {/* Deep Insights Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch">
        <div className="p-12 md:w-1/2 space-y-6 bg-slate-50 dark:bg-slate-800/20">
           <h4 className="text-[10px] font-black text-notera-turquoise uppercase tracking-[0.5em]">İLERİ ANALİTİK</h4>
           <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Kazanım Tamamlama Oranı</h3>
           <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
             EduMetrik, sınav sorularını kazanımlarla eşleştirir. Sınav sonunda hangi kazanımın sınıfta % kaç oranında öğrenildiğini size raporlar. Bu, bir sonraki dersin planını yaparken öğretmene rehberlik eder.
           </p>
           <ul className="space-y-4">
              {['Kazanım bazlı sınıf sıralaması', 'En yüksek ayırt ediciliği olan sorular', 'Farklı şubeler arası karşılaştırma'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
                  <span className="text-notera-turquoise">✓</span> {item}
                </li>
              ))}
           </ul>
        </div>
        <div className="md:w-1/2 bg-notera-dark p-12 flex items-center justify-center">
           <div className="w-full space-y-6 animate-pulse">
              <div className="h-4 bg-slate-800 rounded-full w-3/4"></div>
              <div className="h-4 bg-notera-turquoise rounded-full w-full"></div>
              <div className="h-4 bg-slate-800 rounded-full w-1/2"></div>
              <div className="h-20 bg-slate-800 rounded-3xl w-full"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EduMetrikInfoView;
