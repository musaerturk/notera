
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { StudentSubmission, Exam } from '../types';

interface AnalyticsViewProps {
  submissions: StudentSubmission[];
  exam: Exam;
  onBack: () => void;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ submissions, exam, onBack }) => {
  // Genel Başarı Analizi
  const successData = useMemo(() => {
    const successful = submissions.filter(s => s.totalScore >= 50).length;
    const unsuccessful = submissions.length - successful;
    return [
      { name: 'Başarılı', value: successful, color: '#4FB6B2' },
      { name: 'Başarısız', value: unsuccessful, color: '#f43f5e' }
    ];
  }, [submissions]);

  // Soru Bazlı Başarı Verisi
  const chartData = useMemo(() => {
    return exam.questions.map((q, idx) => {
      const scores = submissions.map(s => {
        const res = s.results.find(r => r.questionId === q.id);
        return res ? (res.score / q.maxScore) * 100 : 0;
      });
      const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
      return {
        id: q.id,
        name: `Soru ${idx + 1}`,
        başarı: Math.round(avg),
        maxScore: q.maxScore,
        text: q.text
      };
    });
  }, [submissions, exam]);

  const averageScore = Math.round(submissions.reduce((a, b) => a + b.totalScore, 0) / (submissions.length || 1));

  return (
    <div className="animate-fade-in pb-24 max-w-6xl mx-auto" id="printable-analytics">
      {/* Rapor Başlığı */}
      <div className="flex items-center justify-between mb-10 bg-slate-900 border-2 border-indigo-900 p-8 rounded-[2.5rem] shadow-2xl print:bg-white print:text-black print:border-black print:rounded-none">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="no-print w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all active:scale-90"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 className="text-3xl font-black text-white print:text-black uppercase tracking-tighter leading-none">{exam.courseName} - ANALİZ RAPORU</h2>
            <p className="text-indigo-400 print:text-slate-600 font-bold text-sm mt-2 uppercase tracking-[0.2em]">{exam.classSection} ŞUBESİ | {exam.examName}</p>
          </div>
        </div>
        <button 
          onClick={() => window.print()} 
          className="no-print flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-slate-100 transition-all shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          PDF RAPORU AL
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Başarı Özeti Kartı */}
        <div className="lg:col-span-1 bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl overflow-hidden flex flex-col print:border-black print:rounded-none">
          <div className="bg-slate-900 print:bg-slate-100 p-6 border-b border-indigo-900 print:border-black">
            <h3 className="text-xs font-black text-white print:text-black uppercase tracking-[0.3em]">GENEL BAŞARI ÖZETİ</h3>
          </div>
          <div className="flex-grow p-10 flex flex-col items-center justify-center">
            <div className="w-full h-48 print:hidden">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={successData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {successData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '15px', fontWeight: 900 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 w-full space-y-4">
              {successData.map(d => (
                <div key={d.name} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 print:border-black print:rounded-none">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{d.name}</span>
                  </div>
                  <span className="text-xl font-black text-indigo-950">{d.value} Kişi</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 bg-notera-turquoise/10 border-t border-indigo-100 text-center">
            <div className="text-[10px] font-black text-notera-turquoise uppercase tracking-widest mb-1">SINIF ORTALAMASI</div>
            <div className="text-6xl font-black text-notera-purple tracking-tighter">{averageScore}</div>
          </div>
        </div>

        {/* Soru Bazlı Başarı Grafiği */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl overflow-hidden print:border-black print:rounded-none">
          <div className="bg-slate-900 print:bg-slate-100 p-6 border-b border-indigo-900 print:border-black">
            <h3 className="text-xs font-black text-white print:text-black uppercase tracking-[0.3em]">SORU BAZLI ANALİZ (%)</h3>
          </div>
          <div className="p-10 h-full min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#1e1b4b', fontSize: 12, fontWeight: 900}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#1e1b4b', fontSize: 11, fontWeight: 700}} unit="%" />
                <Tooltip cursor={{fill: '#f8fafc', radius: 15}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="başarı" radius={[10, 10, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.başarı >= 50 ? '#4FB6B2' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detaylı Öğrenci Listesi */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl overflow-hidden print:border-black print:rounded-none">
        <div className="bg-slate-900 print:bg-slate-100 p-8 border-b border-indigo-900 print:border-black">
          <h3 className="text-xl font-black text-white print:text-black uppercase tracking-tight">ÖĞRENCİ BAŞARI ÇİZELGESİ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-200 print:border-black">
                <th className="px-10 py-6">ÖĞRENCİ ADI</th>
                <th className="px-10 py-6 text-center">TOPLAM PUAN</th>
                <th className="px-10 py-6 text-right">DURUM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 print:divide-black">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-6 font-black text-slate-900 uppercase">{sub.studentName}</td>
                  <td className="px-10 py-6 text-center">
                    <span className="text-2xl font-black text-notera-purple">{sub.totalScore}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${sub.totalScore >= 50 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {sub.totalScore >= 50 ? 'GEÇTİ' : 'KALDI'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 1cm; }
          body { background: white !important; }
          .no-print { display: none !important; }
          .shadow-2xl, .shadow-xl { box-shadow: none !important; }
          .rounded-[3rem], .rounded-[2.5rem] { border-radius: 0 !important; }
          #printable-analytics { max-width: 100% !important; padding: 0 !important; }
          .recharts-responsive-container { min-height: 300px !important; }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsView;
