
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { StudentSubmission, Exam, UserSettings } from '../types';

interface AnalyticsViewProps {
  submissions: StudentSubmission[];
  exam: Exam;
  settings: UserSettings;
  onBack: () => void;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ submissions, exam, settings, onBack }) => {
  const level = settings.analyticsLevel || 'basic';

  const successData = useMemo(() => {
    const successful = submissions.filter(s => s.totalScore >= 50).length;
    const unsuccessful = submissions.length - successful;
    return [
      { name: 'Başarılı', value: successful, color: '#4FB6B2' },
      { name: 'Başarısız', value: unsuccessful, color: '#f43f5e' }
    ];
  }, [submissions]);

  const chartData = useMemo(() => {
    return exam.questions.map((q, idx) => {
      const scores = submissions.map(s => {
        const res = s.results.find(r => r.questionId === q.id);
        return res ? (res.score / q.maxScore) * 100 : 0;
      });
      const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
      return { name: `Soru ${idx + 1}`, başarı: Math.round(avg) };
    });
  }, [submissions, exam]);

  const averageScore = Math.round(submissions.reduce((a, b) => a + b.totalScore, 0) / (submissions.length || 1));

  const exportToCSV = () => {
    if (level === 'basic') return;
    const headers = ["Öğrenci Adı", "Toplam Puan", "Durum"];
    const rows = submissions.map(s => [s.studentName, s.totalScore, s.totalScore >= 50 ? "Geçti" : "Kaldı"]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exam.courseName}_Not_Listesi.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="animate-fade-in pb-24 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl no-print">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-2xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{exam.courseName} - ANALİZ</h2>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">{level} sürüm raporu</span>
          </div>
        </div>
        <div className="flex gap-4">
          {level !== 'basic' && (
            <button onClick={exportToCSV} className="px-8 py-4 bg-notera-turquoise text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-2">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               EXCEL (CSV) AKTAR
            </button>
          )}
          {level === 'institutional' && (
            <button onClick={() => window.print()} className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase shadow-xl">PDF RAPORU</button>
          )}
          {level === 'basic' && (
            <div className="px-6 py-4 bg-slate-800 text-slate-400 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              PDF & EXCEL KİLİTLİ
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl text-center border border-slate-100 dark:border-slate-800">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">BAŞARI DAĞILIMI</h3>
            <div className="h-48 mb-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={successData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {successData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '1rem', border: 'none'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-6xl font-black text-notera-purple dark:text-white tracking-tighter">{averageScore}</div>
            <div className="text-[10px] font-black text-notera-turquoise uppercase mt-2">SINIF ORTALAMASI</div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SORU BAZLI ANALİZ (%)</h3>
            {level === 'basic' && <span className="text-[9px] font-black text-rose-400 uppercase">Önizleme Modu</span>}
          </div>
          <div className={`h-64 ${level === 'basic' ? 'blur-sm grayscale pointer-events-none' : ''}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f910" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 900}} />
                <YAxis axisLine={false} tickLine={false} unit="%" tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip contentStyle={{borderRadius: '1rem', border: 'none'}} />
                <Bar dataKey="başarı" radius={[10, 10, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.başarı >= 50 ? '#4FB6B2' : '#f43f5e'} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {level === 'basic' && (
            <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl text-center">
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Soru bazlı başarı analizini görmek için <span className="font-black">ADVANCED</span> plana yükseltin.</p>
            </div>
          )}
        </div>
      </div>

      {level === 'institutional' && (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl border border-slate-100 dark:border-slate-800 animate-slide-up">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">OKUL GENELİ KARŞILAŞTIRMA (SİMÜLASYON)</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Zümre Sıralaması', val: '2 / 8', desc: 'Biyoloji öğretmenleri arasında' },
                { label: 'Okul Ortalaması Sapması', val: '+12.4', desc: 'Genel ortalamanın üzerinde' },
                { label: 'Kazanım Tamamlama', val: '%88', desc: 'Hücre ünitesi hedefi' }
              ].map((m, i) => (
                <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="text-2xl font-black text-notera-purple dark:text-notera-turquoise mb-1">{m.val}</div>
                  <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase mb-1">{m.label}</div>
                  <div className="text-[9px] font-bold text-slate-400">{m.desc}</div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;
