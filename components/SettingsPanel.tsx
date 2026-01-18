import React, { useState } from 'react';
import { UserSettings, FeedbackTone } from '../types';

interface SettingsPanelProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
  onResetAll: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, onResetAll }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof UserSettings, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    // Tema değişikliği anlıktır, beklemeye gerek yok
    if (field === 'theme') onUpdate(updated);
    setIsSaved(false);
  };

  const handleSave = () => {
    onUpdate(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const inputClasses = "w-full px-5 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[1rem] focus:ring-4 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all text-indigo-950 dark:text-indigo-100 font-bold text-lg";
  const labelClasses = "block text-[11px] font-black text-slate-500 dark:text-indigo-400 mb-3 uppercase tracking-[0.25em]";

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-20">
      <div className="mb-12 p-10 bg-white dark:bg-slate-900 border-l-8 border-notera-purple rounded-[3rem] shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-4">Ayarlar & Profil</h2>
          <p className="text-slate-500 dark:text-indigo-400 font-bold text-lg">Eğitmen kimliğinizi ve tercihlerinizi yönetin.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl whitespace-nowrap ${isSaved ? 'bg-emerald-500 text-white' : 'bg-notera-purple text-white hover:scale-105'}`}
        >
          {isSaved ? 'AYARLAR KAYDEDİLDİ ✓' : 'AYARLARI KAYDET'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
           <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Eğitmen Profili</h3>
          <div>
            <label className={labelClasses}>Ad Soyad</label>
            <input type="text" value={localSettings.teacherName} onChange={(e) => handleChange('teacherName', e.target.value)} placeholder="Öğretmen Adı" className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Okul / Kurum</label>
            <input type="text" value={localSettings.schoolName} onChange={(e) => handleChange('schoolName', e.target.value)} placeholder="Okul Adı" className={inputClasses} />
          </div>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Kayıtlı Sınıflarım</h3>
            <div className="flex flex-wrap gap-2">
              {localSettings.savedClasses && localSettings.savedClasses.length > 0 ? (
                localSettings.savedClasses.map((cls, idx) => (
                  <span key={idx} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase border border-indigo-100 dark:border-indigo-800">
                    {cls}
                  </span>
                ))
              ) : (
                <p className="text-slate-400 text-xs italic">Henüz bir sınıf okutulmadı.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
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
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${localSettings.feedbackTone === t.id ? 'bg-notera-purple border-notera-purple text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <span className="font-black text-[10px] uppercase tracking-widest">{t.label}</span>
                </button>
              ))}
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Görünüm Modu</h3>
            <div className="flex gap-4">
              {(['dark', 'light', 'system'] as const).map((t) => (
                <button key={t} onClick={() => handleChange('theme', t)} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${localSettings.theme === t ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-rose-50 dark:bg-rose-900/10 p-10 rounded-[2.5rem] border-2 border-dashed border-rose-200 text-center">
        <p className="text-rose-600 dark:text-rose-400 font-bold mb-6 text-sm uppercase tracking-tight">Dikkat: Bu işlem tüm geçmiş sınav verilerinizi ve ayarlarınızı kalıcı olarak siler.</p>
        <button onClick={onResetAll} className="px-12 py-5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-700 transition-colors">TÜM VERİLERİ SIFIRLA</button>
      </div>
    </div>
  );
};

export default SettingsPanel;