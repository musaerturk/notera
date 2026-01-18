
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line } from 'recharts';
import { StudentSubmission, Exam, UserSettings, GradedExam } from '../types';

interface AnalyticsViewProps {
  submissions: StudentSubmission[];
  exam: Exam;
  settings: UserSettings;
  onBack: () => void;
  history?: GradedExam[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ submissions, exam, settings, onBack, history = [] }) => {
  const level = settings.analyticsLevel || 'basic';
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

  const filteredHistory = useMemo(() => {
    if (selectedClassFilter === 'all') return history;
    return history.filter(h => h.exam.classSection === selectedClassFilter);
  }, [history, selectedClassFilter]);

  const progressData = useMemo(() => {
    return filteredHistory
      .slice()
      .reverse()
      .map(h => ({
        date: new Date(h.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
        ort: h.averageScore,
        name: h.exam.examName
      }));
  }, [filteredHistory]);

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

  return (
    <div className="animate-fade-in pb-24 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl no-print">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-2xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{exam.courseName} - ANALİZ</h2>
            <div className="flex gap-2">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">{level} sürüm raporu</span>
              {history.length > 0 && <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">• {history.length} Kayıtlı Sınav</span>}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <select 
            value={selectedClassFilter} 
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-6 py-3 bg-slate-800 text-white rounded-xl text-xs font-black uppercase outline-none border border-slate-700"
          >
            <option value="all">Tüm Sınıflar</option>
            {settings.savedClasses.map(cls => <option key={cls} value={cls}>{cls}</option>)}
          </select>
          <button onClick={() => window.print()} className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase shadow-xl">PDF RAPORU</button>
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
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">GELİŞİM TRENDİ (TARİHSEL)</h3>
          <div className="h-64">
            {progressData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f910" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{borderRadius: '1.5rem', border: 'none', backgroundColor: '#3B2F5B', color: 'white'}} 
                    labelStyle={{fontWeight: 'black', marginBottom: '5px'}}
                  />
                  <Line type="monotone" dataKey="ort" stroke="#4FB6B2" strokeWidth={5} dot={{r: 8, fill: '#4FB6B2', strokeWidth: 0}} activeDot={{r: 10}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <div className="text-4xl">📉</div>
                <p className="text-[10px] font-black uppercase tracking-widest">Trend analizi için en az 2 sınav sonucu gerekir.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">SORU BAZLI BAŞARI (%)</h3>
          <div className="h-64">
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
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">SINIFLAR ARASI KIYASLAMA</h3>
          <div className="space-y-4">
            {settings.savedClasses.slice(0, 4).map((cls, idx) => {
              const clsAvg = Math.round(history.filter(h => h.exam.classSection === cls).reduce((a, b) => a + b.averageScore, 0) / (history.filter(h => h.exam.classSection === cls).length || 1));
              return (
                <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{cls}</span>
                  <div className="flex-1 mx-8 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-notera-purple" style={{width: `${clsAvg}%`}}></div>
                  </div>
                  <span className="text-lg font-black text-notera-purple dark:text-notera-turquoise">{clsAvg}</span>
                </div>
              );
            })}
            {settings.savedClasses.length === 0 && (
              <p className="text-center text-slate-400 text-xs italic py-10">Karşılaştırma yapılacak veri henüz yok.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
