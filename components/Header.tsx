
import React from 'react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: 'setup' | 'upload' | 'dashboard' | 'analytics' | 'question-prep' | 'settings' | 'exam-paper' | 'info' | 'home') => void;
  isExamSet: boolean;
  teacherName?: string;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, isExamSet, teacherName }) => {
  const isExamora = ['question-prep', 'setup', 'exam-paper', 'upload'].includes(currentView);
  const isEduMetrik = ['dashboard', 'analytics'].includes(currentView);

  return (
    <header className="bg-white/95 dark:bg-notera-dark/95 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 backdrop-blur-md shadow-sm no-print">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-6xl">
        {/* LOGO: NOTERA */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="flex flex-col leading-none">
            <h1 className="text-2xl font-black text-notera-purple dark:text-white uppercase tracking-[-0.05em] flex items-center">
              N<span className="logo-o">O</span>TERA
            </h1>
            <span className="text-[8px] font-black text-notera-turquoise uppercase tracking-widest mt-1">DEĞERLENDİRMENİN AKILLI YOLU</span>
          </div>
        </div>
        
        <nav className="flex items-center gap-1">
          <button 
            onClick={() => onNavigate('home')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all tracking-wider uppercase mr-2 ${
              currentView === 'home' || currentView === 'info'
                ? 'bg-notera-purple text-white shadow-lg' 
                : 'text-slate-500 hover:text-notera-purple dark:text-slate-400'
            }`}
          >
            ANA PANEL
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2"></div>

          {/* EXAMORA MODÜLÜ */}
          <div className={`flex items-center gap-1 p-1 rounded-2xl border transition-all ${isExamora ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' : 'border-transparent'}`}>
            <span className="hidden lg:block text-[9px] font-black text-notera-purple dark:text-indigo-400 uppercase tracking-widest px-3 border-r border-slate-200 dark:border-slate-700 mr-1">Examora</span>
            {[
              { id: 'question-prep', label: 'Soru Hazırla' },
              { id: 'setup', label: 'Sınav Oluştur' },
              { id: 'upload', label: 'Sınav Oku', disabled: !isExamSet }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                disabled={item.disabled}
                className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all tracking-wider uppercase whitespace-nowrap ${
                  currentView === item.id 
                    ? 'bg-notera-purple text-white shadow-md' 
                    : 'text-slate-500 hover:text-notera-purple dark:text-slate-400'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2"></div>

          {/* EDUMETRİK MODÜLÜ */}
          <div className={`flex items-center gap-1 p-1 rounded-2xl border transition-all ${isEduMetrik ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' : 'border-transparent'}`}>
            <span className="hidden lg:block text-[9px] font-black text-notera-turquoise uppercase tracking-widest px-3 border-r border-slate-200 dark:border-slate-700 mr-1">EduMetrik</span>
            {[
              { id: 'dashboard', label: 'Analiz', disabled: !isExamSet },
              { id: 'analytics', label: 'Raporlama', disabled: !isExamSet },
              { id: 'analytics', label: 'Kazanım', disabled: !isExamSet } // Kazanım da analytics üzerinden yönetiliyor
            ].map((item, idx) => (
              <button 
                key={`${item.id}-${idx}`}
                onClick={() => onNavigate(item.id as any)}
                disabled={item.disabled}
                className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all tracking-wider uppercase whitespace-nowrap ${
                  (currentView === item.id && (idx === 0 ? item.label === 'Analiz' : true)) 
                    ? 'bg-notera-turquoise text-white shadow-md' 
                    : 'text-slate-500 hover:text-notera-turquoise dark:text-slate-400'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => onNavigate('settings')}
            className={`ml-4 p-2.5 rounded-xl transition-all border ${
              currentView === 'settings' 
                ? 'bg-notera-purple text-white shadow-lg border-notera-purple' 
                : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
            title="Ayarlar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
