
import React from 'react';
import { UserSettings } from '../types';

interface SettingsPanelProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
  onResetAll: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, onResetAll }) => {
  const handleChange = (field: keyof UserSettings, value: any) => {
    onUpdate({ ...settings, [field]: value });
  };

  const inputClasses = "w-full px-5 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[1rem] focus:ring-4 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-indigo-950 dark:text-indigo-100 font-bold text-lg";
  const labelClasses = "block text-[11px] font-black text-slate-500 dark:text-indigo-400 mb-3 uppercase tracking-[0.25em]";

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-20">
      <div className="mb-12 p-8 bg-white dark:bg-slate-900 border-l-8 border-indigo-600 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-4">Ayarlar & Profil</h2>
        <p className="text-slate-500 dark:text-indigo-400 font-bold text-lg">Platform deneyiminizi ve AI hassasiyetini özelleştirin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* KULLANICI BİLGİLERİ */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Eğitmen Profili</h3>
          </div>
          
          <div>
            <label className={labelClasses}>Ad Soyad</label>
            <input 
              type="text" 
              value={settings.teacherName} 
              onChange={(e) => handleChange('teacherName', e.target.value)}
              placeholder="Örn: Ahmet Yılmaz" 
              className={inputClasses} 
            />
          </div>
          <div>
            <label className={labelClasses}>Okul / Kurum</label>
            <input 
              type="text" 
              value={settings.schoolName} 
              onChange={(e) => handleChange('schoolName', e.target.value)}
              placeholder="Örn: Atatürk Anadolu Lisesi" 
              className={inputClasses} 
            />
          </div>
          <div>
            <label className={labelClasses}>Ana Branş</label>
            <input 
              type="text" 
              value={settings.subject} 
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="Örn: Biyoloji" 
              className={inputClasses} 
            />
          </div>
        </div>

        <div className="space-y-8">
          {/* TEMA SEÇİMİ */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.242 16.242l.707.707M7.757 7.757l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              </div>
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Görünüm Modu</h3>
            </div>
            
            <div className="flex gap-4">
              {(['dark', 'light', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleChange('theme', t)}
                  className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
                    settings.theme === t 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                      : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {t === 'dark' ? 'KOYU' : t === 'light' ? 'AÇIK' : 'SİSTEM'}
                </button>
              ))}
            </div>
          </div>

          {/* AI HASSASİYETİ */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Değerlendirme Katılığı</h3>
            </div>
            
            <div className="flex gap-4">
              {(['low', 'normal', 'strict'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleChange('aiSensitivity', s)}
                  className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${
                    settings.aiSensitivity === s 
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' 
                      : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {s === 'low' ? 'ESNEK' : s === 'normal' ? 'STANDART' : 'KATI'}
                </button>
              ))}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 text-center tracking-widest leading-relaxed">
              * KATI modda AI, anahtar kelime ve imla uyumuna daha fazla önem verir.
            </p>
          </div>
        </div>
      </div>

      {/* KRİTİK İŞLEMLER */}
      <div className="mt-12 bg-rose-50 dark:bg-rose-900/10 p-10 rounded-[2.5rem] border-2 border-dashed border-rose-200 dark:border-rose-900/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h4 className="font-black text-rose-800 dark:text-rose-400 uppercase tracking-widest mb-2">Veri Temizliği</h4>
            <p className="text-sm text-rose-600 dark:text-rose-500 font-bold max-w-lg">Cihazınızda kayıtlı olan tüm sınav yapılandırmalarını, öğrenci cevaplarını ve istatistikleri kalıcı olarak siler.</p>
          </div>
          <button 
            onClick={onResetAll}
            className="px-10 py-5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-700 shadow-xl shadow-rose-900/20 active:scale-95 transition-all"
          >
            TÜM VERİLERİ SIFIRLA
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
