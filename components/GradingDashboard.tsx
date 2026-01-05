
import React from 'react';
import { StudentSubmission, UserSettings } from '../types';

interface GradingDashboardProps {
  submissions: StudentSubmission[];
  settings: UserSettings;
  onSelect: (id: string) => void;
  onReset: () => void;
  onViewAnalytics: () => void;
}

const GradingDashboard: React.FC<GradingDashboardProps> = ({ submissions, settings, onSelect, onReset, onViewAnalytics }) => {
  if (submissions.length === 0) {
    return (
      <div className="py-40 text-center animate-pulse space-y-6">
        <h3 className="text-4xl font-black text-notera-purple dark:text-white uppercase tracking-tighter">EduMetrik Hazır</h3>
        <p className="text-slate-500 font-bold text-xl">Değerlendirme için kağıtları yüklemeni bekliyorum.</p>
      </div>
    );
  }

  const averageScore = Math.round(submissions.reduce((a, b) => a + b.totalScore, 0) / (submissions.length || 1));
  const needsReviewCount = submissions.filter(s => s.results.some(r => r.confidence < 0.6)).length;

  const level = settings.analyticsLevel || 'basic';

  const stats = [
    { label: 'Sınıf Ortalaması', val: averageScore, color: 'text-notera-purple', visible: true },
    { label: 'Başarı Oranı', val: `%${Math.round((submissions.filter(s => s.totalScore >= 50).length / submissions.length) * 100)}`, color: 'text-notera-turquoise', visible: level !== 'basic' },
    { label: 'Destek Bekleyen', val: submissions.filter(s => s.totalScore < 50).length, color: 'text-rose-500', visible: level !== 'basic' },
    { label: 'Şüpheli Okuma', val: needsReviewCount, color: 'text-amber-500', visible: level === 'institutional' }
  ];

  return (
    <div className="animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="space-y-3">
          <h2 className="text-5xl font-black text-notera-purple dark:text-white uppercase tracking-tighter leading-none">EduMetrik Analizi</h2>
          <div className="flex items-center gap-3">
            <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">
              {submissions.length} Kağıt Değerlendirildi
            </p>
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase border border-indigo-100 dark:border-indigo-900/50">
              {level.toUpperCase()} ANALİZ
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={onViewAnalytics} className="px-10 py-5 bg-notera-turquoise text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl">Analiz Raporu</button>
          <button onClick={onReset} className="px-10 py-5 bg-white text-slate-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest border border-slate-200">Temizle</button>
        </div>
      </div>

      {needsReviewCount > 0 && level === 'institutional' && (
        <div className="mb-12 p-6 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/50 rounded-[2rem] flex items-center gap-6 animate-pulse">
          <div className="text-4xl">⚠️</div>
          <div>
            <h4 className="font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight">AI Şüpheli Okumalar Tespit Etti</h4>
            <p className="text-amber-700 dark:text-amber-500 font-bold text-sm">{needsReviewCount} öğrencinin kağıdında el yazısı tam anlaşılamamış olabilir. Bu kağıtları manuel kontrol etmenizi öneririz.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {stats.filter(s => s.visible).map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl group">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">{stat.label}</span>
            <div className={`text-6xl font-black ${stat.color} tracking-tighter`}>{stat.val}</div>
          </div>
        ))}
        {level === 'basic' && (
          <div className="bg-slate-50 dark:bg-slate-800/30 p-10 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center opacity-60">
             <span className="text-[10px] font-black text-slate-400 uppercase mb-2">GELİŞMİŞ VERİLER</span>
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">KİLİTLİ (ADVANCED GEREKİR)</p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-12 py-6">Öğrenci</th>
              <th className="px-12 py-6">Puan</th>
              <th className="px-12 py-6">Durum</th>
              <th className="px-12 py-6 text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {submissions.map((sub) => {
              const isLowConfidence = sub.results.some(r => r.confidence < 0.6);
              return (
                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                  <td className="px-12 py-10">
                    <div className="font-black text-slate-900 dark:text-white text-xl tracking-tight flex items-center gap-3">
                      {sub.studentName}
                      {isLowConfidence && level === 'institutional' && <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[9px] font-black uppercase tracking-widest">AI ŞÜPHELİ</span>}
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <span className="text-4xl font-black text-notera-purple dark:text-notera-turquoise">{sub.totalScore}</span>
                  </td>
                  <td className="px-12 py-10">
                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${sub.totalScore >= 50 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {sub.totalScore >= 50 ? 'GEÇTİ' : 'KALDI'}
                    </span>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <button onClick={() => onSelect(sub.id)} className="px-8 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 rounded-2xl text-[10px] font-black text-notera-purple uppercase tracking-widest transition-all shadow-sm">İncele</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradingDashboard;
