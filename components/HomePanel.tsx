
import React from 'react';

interface HomePanelProps {
  onNavigate: (view: 'question-prep' | 'upload' | 'dashboard' | 'analytics' | 'setup') => void;
  isExamSet: boolean;
  hasSubmissions: boolean;
}

const HomePanel: React.FC<HomePanelProps> = ({ onNavigate, isExamSet, hasSubmissions }) => {
  const cards = [
    {
      id: 'question-prep',
      title: '✏️ Soru Hazırla (AI)',
      desc: 'Kazanımlara uygun, ölçücü ve dengeli soruları AI ile birlikte oluştur.',
      btn: '→ AI Asistanı Başlat',
      color: 'bg-white dark:bg-slate-900 border-notera-purple/20 hover:border-notera-purple shadow-sm',
      iconColor: 'bg-indigo-50 dark:bg-indigo-900/30 text-notera-purple'
    },
    {
      id: 'setup',
      title: '📝 Sınav Oluştur (Manuel)',
      desc: 'Halihazırda hazır olan sınavının sorularını ve puanlarını manuel tanımla.',
      btn: '→ Manuel Tanımla',
      color: 'bg-white dark:bg-slate-900 border-notera-purple/20 hover:border-notera-turquoise shadow-sm',
      iconColor: 'bg-notera-turquoise/10 text-notera-turquoise'
    },
    {
      id: 'upload',
      title: '📸 Sınav Oku',
      desc: 'Hazırladığın veya tanımladığın sınavın kağıtlarını yükle, okumayı başlat.',
      btn: '→ Okumaya Başla',
      disabled: !isExamSet,
      color: 'bg-white dark:bg-slate-900 border-notera-purple/20 hover:border-notera-purple shadow-sm',
      iconColor: 'bg-slate-100 dark:bg-slate-800 text-slate-600'
    },
    {
      id: 'dashboard',
      title: '📊 Analiz & Rapor',
      desc: 'Okuma bittiğinde sınıfa dair EduMetrik verilerini ve kazanım analizlerini incele.',
      btn: '→ Verileri Gör',
      disabled: !hasSubmissions,
      color: 'bg-white dark:bg-slate-900 border-notera-purple/20 hover:border-notera-turquoise shadow-sm',
      iconColor: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500'
    }
  ];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto py-12">
      <div className="mb-16 text-center md:text-left space-y-4">
        <h2 className="text-5xl md:text-6xl font-black text-notera-purple dark:text-white uppercase tracking-tighter leading-none">
          Hoş geldin.
        </h2>
        <p className="text-2xl font-medium text-slate-500 dark:text-slate-400">
          Bugün ne yapmak istiyorsun? <span className="text-notera-turquoise font-black underline underline-offset-8 decoration-notera-turquoise/30">NOTERA</span> seninle birlikte yönetir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card) => (
          <div 
            key={card.id}
            className={`${card.color} p-12 rounded-[3.5rem] border-2 transition-all group flex flex-col justify-between h-80 ${card.disabled ? 'opacity-30 grayscale pointer-events-none' : 'cursor-pointer hover:shadow-2xl hover:-translate-y-2'}`}
            onClick={() => onNavigate(card.id as any)}
          >
            <div>
              <div className="flex items-start justify-between mb-8">
                <h3 className="text-3xl font-black text-notera-purple dark:text-white uppercase tracking-tighter leading-tight max-w-[12rem]">{card.title}</h3>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.iconColor} shadow-inner group-hover:scale-110 transition-transform`}>
                   <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
                {card.desc}
              </p>
            </div>
            <button className="w-fit px-8 py-3 bg-notera-purple text-white rounded-2xl font-black text-xs tracking-widest uppercase group-hover:bg-notera-turquoise transition-colors shadow-lg">
              {card.btn}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-24 flex flex-col items-center gap-2 opacity-50">
        <div className="h-px w-24 bg-slate-300 dark:bg-slate-700 mb-4"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500">NOTERA REHBERLİK SİSTEMİ</p>
        <p className="text-xs font-bold text-slate-400 italic">"Son karar her zaman öğretmenindir."</p>
      </div>
    </div>
  );
};

export default HomePanel;
