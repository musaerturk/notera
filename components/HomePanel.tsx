
import React from 'react';

interface HomePanelProps {
  onNavigate: (view: 'question-prep' | 'upload' | 'dashboard' | 'analytics' | 'setup' | 'answer-key-upload') => void;
  onResume: (view: 'upload' | 'dashboard' | 'setup') => void;
  isExamSet: boolean;
  hasSubmissions: boolean;
}

const HomePanel: React.FC<HomePanelProps> = ({ onNavigate, onResume, isExamSet, hasSubmissions }) => {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto py-12">
      <div className="mb-16 text-center md:text-left space-y-4">
        <h2 className="text-5xl md:text-6xl font-black text-notera-purple dark:text-white uppercase tracking-tighter leading-none">Hoş geldin.</h2>
        <p className="text-2xl font-medium text-slate-500 dark:text-slate-400">Bugün ne yapmak istiyorsun? <span className="text-notera-turquoise font-black underline underline-offset-8 decoration-notera-turquoise/30">NOTERA</span> seninle yönetir.</p>
      </div>

      <div className="mb-12 p-1 bg-gradient-to-r from-notera-purple to-notera-turquoise rounded-[4rem] shadow-2xl hover:scale-[1.01] transition-all cursor-pointer group" onClick={() => onNavigate('answer-key-upload')}>
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.8rem] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-notera-turquoise/10 rounded-full border border-notera-turquoise/20">
              <span className="w-2 h-2 bg-notera-turquoise rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-notera-turquoise uppercase tracking-widest">SIFIRLA & YENİ BAŞLAT</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-notera-purple dark:text-white uppercase tracking-tighter leading-none">📸 Cevap Anahtarı <br/> ile Başla</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-md">Kendi hazırladığın cevap anahtarını fotoğrafla; AI senin yerine otomatik tanımlasın.</p>
          </div>
          <div className="w-24 h-24 md:w-40 md:h-40 bg-notera-purple text-white rounded-[3rem] flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform">
             <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { id: 'question-prep', title: '✏️ SORU HAZIRLA (AI)', desc: 'Kazanımlara uygun soruları AI ile oluştur.', btn: '→ AI ASİSTANI BAŞLAT', color: 'hover:border-notera-purple', iconColor: 'bg-indigo-50 text-notera-purple' },
          { id: 'setup', title: '📝 SINAV OLUŞTUR (MANUEL)', desc: 'Soruları ve puanları manuel tanımla.', btn: '→ MANUEL TANIMLA', color: 'hover:border-notera-turquoise', iconColor: 'bg-notera-turquoise/10 text-notera-turquoise' },
          { id: 'upload', title: '📸 SINAV OKU', desc: 'Kağıtları yükle ve okumayı başlat.', btn: '→ OKUMAYA GİT', disabled: !isExamSet, useResume: true, color: 'hover:border-notera-purple', iconColor: 'bg-slate-100 text-slate-600' },
          { id: 'dashboard', title: '📊 ANALİZ & RAPOR', desc: 'EduMetrik verilerini incele.', btn: '→ VERİLERİ GÖR', disabled: !hasSubmissions, useResume: true, color: 'hover:border-notera-turquoise', iconColor: 'bg-indigo-50 text-indigo-500' }
        ].map((card) => (
          <div key={card.id} className={`bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-800 transition-all group flex flex-col justify-between h-[24rem] ${card.disabled ? 'opacity-30 grayscale pointer-events-none' : 'cursor-pointer hover:shadow-2xl hover:-translate-y-2 ' + card.color}`} onClick={() => card.useResume ? onResume(card.id as any) : onNavigate(card.id as any)}>
            <div>
              <div className="flex items-start justify-between mb-8">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight max-w-[15rem] group-hover:text-notera-purple transition-colors">{card.title}</h3>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.iconColor} shadow-inner group-hover:scale-110 transition-transform`}><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">{card.desc}</p>
            </div>
            <button className="w-full py-5 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-[11px] tracking-widest uppercase group-hover:bg-notera-purple transition-colors shadow-lg">
              {card.btn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePanel;
