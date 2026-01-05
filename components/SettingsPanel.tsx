
import React from 'react';
import { UserSettings, FeedbackTone, AnalyticsLevel } from '../types';

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
      <div className="mb-12 p-8 bg-white dark:bg-slate-900 border-l-8 border-notera-purple rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-4">Ayarlar & Profil</h2>
        <p className="text-slate-500 dark:text-indigo-400 font-bold text-lg">Platform deneyiminizi ve AI hassasiyetini özelleştirin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* KULLANICI BİLGİLERİ */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
           <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Eğitmen Profili</h3>
          <div>
            <label className={labelClasses}>Ad Soyad</label>
            <input type="text" value={settings.teacherName} onChange={(e) => handleChange('teacherName', e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Okul / Kurum</label>
            <input type="text" value={settings.schoolName} onChange={(e) => handleChange('schoolName', e.target.value)} className={inputClasses} />
          </div>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">EduMetrik Paket Seçimi</h3>
            <div className="space-y-3">
              {(['basic', 'advanced', 'institutional'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleChange('analyticsLevel', lvl)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${settings.analyticsLevel === lvl ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}
                >
                  <span className="font-black text-[10px] uppercase tracking-widest">{lvl} ANALİZ</span>
                  {settings.analyticsLevel === lvl && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* AI GERİ BİLDİRİM TONU */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
             <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">AI Geri Bildirim Tonu</h3>
             <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'encouraging', label: 'Teşvik Edici (Önerilen)', icon: '🌟' },
                { id: 'academic', label: 'Akademik & Ciddi', icon: '🎓' },
                { id: 'concise', label: 'Kısa & Öz', icon: '⚡' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => handleChange('feedbackTone', t.id as FeedbackTone)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${settings.feedbackTone === t.id ? 'bg-notera-purple border-notera-purple text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <span className="font-black text-[10px] uppercase tracking-widest">{t.label}</span>
                </button>
              ))}
             </div>
          </div>

          {/* TEMA SEÇİMİ */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Görünüm Modu</h3>
            <div className="flex gap-4">
              {(['dark', 'light', 'system'] as const).map((t) => (
                <button key={t} onClick={() => handleChange('theme', t)} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${settings.theme === t ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-rose-50 dark:bg-rose-900/10 p-10 rounded-[2.5rem] border-2 border-dashed border-rose-200">
        <button onClick={onResetAll} className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em]">TÜM VERİLERİ SIFIRLA</button>
      </div>
    </div>
  );
};

export default SettingsPanel;
