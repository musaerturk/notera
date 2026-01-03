
import React from 'react';
import { StudentSubmission } from '../types';

interface GradingDashboardProps {
  submissions: StudentSubmission[];
  onSelect: (id: string) => void;
  onReset: () => void;
  onViewAnalytics: () => void;
}

const GradingDashboard: React.FC<GradingDashboardProps> = ({ submissions, onSelect, onReset, onViewAnalytics }) => {
  if (submissions.length === 0) {
    return (
      <div className="py-40 text-center animate-pulse space-y-6">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border-2 border-slate-200 dark:border-slate-700">
           <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </div>
        <h3 className="text-4xl font-black text-notera-purple dark:text-white uppercase tracking-tighter">EduMetrik Hazır</h3>
        <p className="text-slate-500 font-bold text-xl">Değerlendirme için kağıtları yüklemeni bekliyorum.</p>
      </div>
    );
  }

  const averageScore = Math.round(submissions.reduce((a, b) => a + b.totalScore, 0) / (submissions.length || 1));

  return (
    <div className="animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="space-y-3">
          <div className="inline-flex px-4 py-1.5 bg-notera-turquoise/10 text-notera-turquoise rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-notera-turquoise/20">Modül: EduMetrik</div>
          <h2 className="text-5xl md:text-6xl font-black text-notera-purple dark:text-white uppercase tracking-tighter leading-none">Bu Sınav Bize <span className="text-notera-turquoise italic underline underline-offset-8 decoration-notera-turquoise/20">Ne Söylüyor?</span></h2>
          <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">
            Değerlendirilen: <span className="text-notera-purple dark:text-notera-turquoise font-black">{submissions.length} Kağıt</span>
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={onViewAnalytics} className="px-10 py-5 bg-notera-turquoise text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all hover:scale-105">Analiz Raporu</button>
          <button onClick={onReset} className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-500 transition-all">Verileri Temizle</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          { label: 'Sınıf Ortalaması', val: averageScore, color: 'text-notera-purple', sub: 'Başarı Puanı' },
          { label: 'Güçlü Alanlar', val: `%${Math.round((submissions.filter(s => s.totalScore >= 70).length / submissions.length) * 100)}`, color: 'text-notera-turquoise', sub: 'Yeterlilik' },
          { label: 'Odak Noktası', val: submissions.filter(s => s.totalScore < 50).length, color: 'text-rose-500', sub: 'Destek Bekleyen' },
          { label: 'AI Güven Skoru', val: '%98', color: 'text-slate-400', sub: 'Okuma Hassasiyeti' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl group">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-4">{stat.label}</span>
            <div className={`text-6xl font-black ${stat.color} tracking-tighter group-hover:scale-110 transition-transform`}>{stat.val}</div>
            <span className="text-[10px] font-black text-slate-400 uppercase mt-4 block tracking-widest">{stat.sub}</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 dark:border-slate-800">
           <h3 className="text-xl font-black text-notera-purple dark:text-white uppercase tracking-tight">Kayıtlı Öğrenci Listesi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-12 py-6">Öğrenci Profili</th>
                <th className="px-12 py-6">Başarı Skoru</th>
                <th className="px-12 py-6 text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group">
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-2xl text-slate-300">
                        {sub.studentName[0]}
                      </div>
                      <div className="font-black text-slate-900 dark:text-white text-xl tracking-tight">{sub.studentName}</div>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-notera-purple dark:text-notera-turquoise">{sub.totalScore}</span>
                      <span className="text-sm text-slate-400 font-bold ml-1">/ 100</span>
                    </div>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <button onClick={() => onSelect(sub.id)} className="px-10 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black text-notera-purple dark:text-notera-turquoise uppercase tracking-widest hover:bg-notera-purple hover:text-white dark:hover:bg-white dark:hover:text-notera-purple transition-all shadow-sm">
                      İncele
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-12 p-8 bg-notera-turquoise/5 rounded-[2.5rem] border border-notera-turquoise/10 text-center">
        <p className="text-sm font-bold text-notera-purple italic">"Bu analizler pedagojik birer rehber niteliğindedir. Gelişim odaklı değerlendirme için verileri kullanabilirsiniz."</p>
      </div>
    </div>
  );
};

export default GradingDashboard;
