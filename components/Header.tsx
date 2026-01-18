
import React from 'react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: any) => void;
  isExamSet: boolean;
  isPremium?: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, isExamSet, isPremium }) => {
  const navItemClass = (id: string, activeColor: string) => `
    px-4 py-2 rounded-xl text-[11px] font-black transition-all tracking-widest uppercase whitespace-nowrap
    ${currentView === id 
      ? `${activeColor} text-white shadow-lg` 
      : 'text-slate-400 hover:text-notera-purple dark:text-slate-500 dark:hover:text-slate-300'}
    disabled:opacity-20 disabled:cursor-not-allowed
  `;

  return (
    <header className="bg-white/95 dark:bg-notera-dark/95 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 backdrop-blur-md no-print transition-all">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-6xl">
        
        {/* LOGO SEKTÖRÜ */}
        <div className="flex items-center gap-10">
          <div className="flex flex-col leading-none cursor-pointer" onClick={() => onNavigate('home')}>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-notera-purple dark:text-white flex items-center">
              N<span className="logo-o">O</span>TERA
            </h1>
            <span className="text-[7px] font-black uppercase tracking-[0.3em] mt-1 text-notera-turquoise">
              DEĞERLENDİRMENİN AKILLI YOLU
            </span>
          </div>

          {/* ANA PANEL BUTONU (MOR TASARIM) */}
          <button 
            onClick={() => onNavigate('home')}
            className={`px-6 py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase transition-all ${
              currentView === 'home' || currentView === 'info'
                ? 'bg-notera-purple text-white shadow-xl shadow-notera-purple/20' 
                : 'text-slate-400 hover:text-notera-purple'
            }`}
          >
            ANA PANEL
          </button>
        </div>
        
        {/* MODÜLER NAVİGASYON (EXAMORA & EDUMETRİK) */}
        <nav className="hidden lg:flex items-center gap-4">
          
          {/* EXAMORA GRUBU */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] px-3">EXAMORA</span>
            <button onClick={() => onNavigate('question-prep')} className={navItemClass('question-prep', 'bg-notera-purple')}>HAZIRLA</button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={() => onNavigate('setup')} className={navItemClass('setup', 'bg-notera-purple')}>OLUŞTUR</button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button 
              onClick={() => onNavigate('upload')} 
              disabled={!isExamSet}
              className={navItemClass('upload', 'bg-notera-purple')}
            >
              OKU
            </button>
          </div>

          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 mx-2"></div>

          {/* EDUMETRİK GRUBU */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[8px] font-black text-notera-turquoise/50 uppercase tracking-[0.2em] px-3">EDUMETRİK</span>
            <button 
              onClick={() => onNavigate('dashboard')} 
              disabled={!isExamSet}
              className={navItemClass('dashboard', 'bg-notera-turquoise')}
            >
              ANALİZ
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button 
              onClick={() => onNavigate('analytics')} 
              disabled={!isExamSet}
              className={navItemClass('analytics', 'bg-notera-turquoise')}
            >
              RAPOR
            </button>
          </div>
        </nav>

        {/* SAĞ AKSİYONLAR */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('pricing')}
            className="px-5 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 text-amber-600 flex items-center gap-2 hover:bg-amber-100 transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">YÜKSELT</span>
          </button>

          <button 
            onClick={() => onNavigate('settings')}
            className={`p-2.5 rounded-2xl border transition-all ${
              currentView === 'settings' 
                ? 'bg-notera-purple text-white border-notera-purple shadow-lg' 
                : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
