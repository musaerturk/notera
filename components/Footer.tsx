
import React from 'react';

interface FooterProps {
  onAdminClick: () => void;
  onNavigate: (view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick, onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-notera-dark/50 backdrop-blur-sm py-12 no-print">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* LOGO & SLOGAN */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-col leading-none">
              <h2 className="text-2xl font-black text-notera-purple dark:text-white uppercase tracking-tighter">
                N<span className="logo-o">O</span>TERA
              </h2>
              <span className="text-[10px] font-black text-notera-turquoise uppercase tracking-widest mt-1">
                Değerlendirmenin Akıllı Yolu
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-sm">
              Öğretmenlerin vaktini koruyan, öğrencilerin gelişimini verilerle destekleyen yeni nesil ölçme ve değerlendirme asistanı.
            </p>
          </div>

          {/* HIZLI BAĞLANTILAR */}
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Navigasyon</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate('home')} className="text-slate-600 dark:text-slate-300 hover:text-notera-purple font-bold text-sm transition-colors">Ana Sayfa</button></li>
              <li><button onClick={() => onNavigate('examora-info')} className="text-slate-600 dark:text-slate-300 hover:text-notera-purple font-bold text-sm transition-colors text-left">Examora (Hazırlama & Okuma)</button></li>
              <li><button onClick={() => onNavigate('edumetrik-info')} className="text-slate-600 dark:text-slate-300 hover:text-notera-turquoise font-bold text-sm transition-colors text-left">EduMetrik (Analiz & Rapor)</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="text-slate-600 dark:text-slate-300 hover:text-notera-purple font-bold text-sm transition-colors">Fiyatlandırma</button></li>
            </ul>
          </div>

          {/* SİSTEM ERİŞİMİ */}
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Yönetim</h4>
            <button 
              onClick={onAdminClick}
              className="group flex items-center gap-3 px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg"
            >
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Yönetici Paneli</span>
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:row items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © 2024 NOTERA AI SOLUTIONS. TÜM HAKLARI SAKLIDIR.
          </p>
          <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-notera-purple">Kullanım Koşulları</a>
            <a href="#" className="hover:text-notera-purple">Gizlilik Politikası</a>
            <a href="#" className="hover:text-notera-purple">KVKK</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
