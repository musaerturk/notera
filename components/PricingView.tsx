
import React from 'react';
import { PricingPlan } from '../types';

interface PricingViewProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

const PricingView: React.FC<PricingViewProps> = ({ onSelectPlan }) => {
  const plans: PricingPlan[] = [
    {
      id: '1',
      name: 'Eğitimci Başlangıç',
      price: 0,
      currency: '₺',
      paperLimit: 25,
      questionGenLimit: 5,
      analyticsLevel: 'basic',
      color: 'bg-slate-100 dark:bg-slate-800',
      features: [
        '25 Kağıt/Ay (Examora)',
        '5 AI Soru Üretimi',
        'Temel Sınıf Analizi (EduMetrik)',
        'Tek Cihazda Kullanım'
      ]
    },
    {
      id: '2',
      name: 'Profesyonel Öğretmen',
      price: 249,
      currency: '₺',
      paperLimit: 500,
      questionGenLimit: 100,
      analyticsLevel: 'advanced',
      isPopular: true,
      color: 'bg-notera-purple',
      features: [
        '500 Kağıt/Ay (Examora)',
        'Sınırsız Soru Tasarımı',
        'Gelişmiş Kazanım Analizi (EduMetrik)',
        'Excel/PDF Veri Aktarımı',
        'Reklamsız Deneyim'
      ]
    },
    {
      id: '3',
      name: 'Kurumsal / Okul',
      price: 2499,
      currency: '₺',
      paperLimit: 10000,
      questionGenLimit: 5000,
      analyticsLevel: 'institutional',
      color: 'bg-emerald-600',
      features: [
        '10.000 Kağıt/Ay',
        'Okul Geneli Karşılaştırma (EduMetrik)',
        'Yönetici Paneli Erişimi',
        '7/24 Öncelikli Destek',
        'API Entegrasyonu (E-Okul Uyumlu)'
      ]
    }
  ];

  return (
    <div className="animate-fade-in pb-20 max-w-6xl mx-auto px-4">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-5xl font-black text-notera-purple dark:text-white uppercase tracking-tighter">İşini Kolaylaştıracak Paketi Seç</h2>
        <p className="text-xl font-medium text-slate-500 max-w-2xl mx-auto">
          Examora ile kağıt okuma yükünden kurtul, EduMetrik ile eğitim kalitesini verilerle artır.
        </p>
      </div>

      {/* Free Plan Highlight */}
      <div className="mb-16 bg-emerald-50 dark:bg-emerald-950/20 border-4 border-emerald-500 rounded-[4rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
            ÜCRETSİZ BAŞLANGIÇ
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-tighter">
            Hemen Ücretsiz <span className="italic">Devam Et</span>
          </h3>
          <p className="text-emerald-700 dark:text-emerald-600 font-bold text-lg max-w-xl">
            NOTERA'nın gücünü keşfetmek için hiçbir ücret ödemeden başlayabilirsin. 25 kağıt okuma ve temel analizler tamamen ücretsiz.
          </p>
        </div>
        <button 
          onClick={() => onSelectPlan(plans[0])}
          className="relative z-10 px-16 py-8 bg-emerald-500 text-white rounded-[2.5rem] font-black text-xl tracking-widest uppercase shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
        >
          ÜCRETSİZ BAŞLA
        </button>
      </div>

      <div className="text-center mb-12">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">VEYA PROFESYONEL PLANLARI İNCELE</h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.slice(1).map((plan) => (
          <div 
            key={plan.id} 
            className={`relative p-10 rounded-[3.5rem] border-4 transition-all hover:scale-[1.03] flex flex-col ${
              plan.isPopular 
                ? 'bg-white dark:bg-slate-900 border-notera-turquoise shadow-2xl z-10' 
                : 'bg-white/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 shadow-sm grayscale-[0.3]'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-notera-turquoise text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                EN ÇOK TERCİH EDİLEN
              </div>
            )}

            <div className="mb-10 text-center">
              <h3 className={`text-2xl font-black uppercase tracking-tighter mb-4 ${plan.isPopular ? 'text-notera-purple dark:text-white' : 'text-slate-500'}`}>
                {plan.name}
              </h3>
              <div className="flex items-center justify-center gap-1">
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{plan.price}</span>
                <div className="text-left leading-none">
                  <p className="text-xl font-bold text-slate-400">{plan.currency}</p>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">/ AYLIK</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-10 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
               <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
                 <span className="text-[9px] font-black text-slate-400 uppercase">Examora Okuma</span>
                 <span className="text-sm font-black text-notera-purple dark:text-notera-turquoise">{plan.paperLimit} Kağıt</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-[9px] font-black text-slate-400 uppercase">EduMetrik Analiz</span>
                 <span className="text-sm font-black text-indigo-500 dark:text-indigo-400 uppercase">{plan.analyticsLevel}</span>
               </div>
            </div>

            <ul className="space-y-5 mb-12 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-4 text-sm font-bold text-slate-600 dark:text-slate-400 leading-tight">
                  <div className="w-5 h-5 bg-notera-turquoise/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-notera-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => onSelectPlan(plan)}
              className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 ${
                plan.isPopular 
                  ? 'bg-notera-purple text-white hover:bg-notera-dark' 
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700'
              }`}
            >
              {plan.price === 0 ? 'HEMEN BAŞLA' : 'PLANI SEÇ'}
            </button>
          </div>
        ))}
      </div>

      {/* TRUST FOOTER */}
      <div className="mt-24 flex flex-col md:flex-row items-center justify-center gap-12 opacity-40 grayscale">
         <div className="flex items-center gap-2">
           <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>
           <span className="font-black text-xs">256-BIT SSL SECURE</span>
         </div>
         <div className="flex items-center gap-2">
           <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
           <span className="font-black text-xs">PCI-DSS COMPLIANT</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="font-black text-xl italic tracking-tighter">KVKK</span>
            <span className="font-black text-xs">UYUMLU ALTYAPI</span>
         </div>
      </div>
    </div>
  );
};

export default PricingView;
