
import React, { useState } from 'react';
import { StudentSubmission, Exam, GradingResult, GradingStep } from '../types';

interface GradingDetailProps {
  submission: StudentSubmission;
  exam: Exam;
  onBack: () => void;
  onUpdate: (submission: StudentSubmission) => void;
}

const GradingDetail: React.FC<GradingDetailProps> = ({ submission, exam, onBack, onUpdate }) => {
  const [editedSubmission, setEditedSubmission] = useState(submission);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  const handleScoreChange = (qId: string, newScore: number) => {
    const max = exam.questions.find(q => q.id === qId)?.maxScore || 100;
    const score = Math.min(Math.max(0, newScore), max);
    const updatedResults = editedSubmission.results.map(r => r.questionId === qId ? { ...r, score } : r);
    setEditedSubmission({ ...editedSubmission, results: updatedResults, totalScore: updatedResults.reduce((a, b) => a + b.score, 0), status: 'reviewed' });
  };

  const approveQuestion = (qId: string) => {
    const newApproved = new Set(approvedIds);
    newApproved.add(qId);
    setApprovedIds(newApproved);
  };

  return (
    <div className="animate-fade-in pb-40" id="student-report">
      <div className="flex items-center justify-between mb-12 bg-notera-purple p-8 rounded-[3rem] shadow-2xl sticky top-24 z-40 print:relative print:top-0 print:bg-white print:text-black print:border-2 print:border-black print:rounded-none no-print">
        <button onClick={onBack} className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 group">
          <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Geri Dön
        </button>
        <div className="text-center">
          <h3 className="text-white font-black text-2xl uppercase tracking-tighter">{submission.studentName}</h3>
          <p className="text-notera-turquoise text-[10px] font-black uppercase tracking-widest">Sınav Sonuç Analizi</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase shadow-xl transition-all border-2 border-transparent">PDF KARNE</button>
          <button onClick={() => { onUpdate(editedSubmission); onBack(); }} className="px-10 py-4 bg-notera-turquoise text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-[#45a19d] transition-all">DEĞİŞİKLİKLERİ KAYDET</button>
        </div>
      </div>

      {/* Yazdırma İçin Karne Başlığı */}
      <div className="hidden print:block mb-10 text-center border-4 border-black p-8">
        <h1 className="text-4xl font-black uppercase mb-2">SINAV SONUÇ KARNESİ</h1>
        <p className="text-xl font-bold uppercase">{exam.courseName} - {exam.examName}</p>
        <div className="mt-6 flex justify-between border-t-2 border-black pt-6 font-black text-lg">
          <span>ÖĞRENCİ: {submission.studentName}</span>
          <span>PUAN: {editedSubmission.totalScore} / 100</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 no-print">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-sm sticky top-52">
            <div className="aspect-[3/4] bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden mb-8 border-4 border-slate-50 dark:border-slate-800 shadow-inner group">
              <img src={submission.imageUrl} alt="Exam" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 cursor-zoom-in" />
            </div>
            <div className="text-center p-8 bg-notera-purple text-white rounded-[3rem] shadow-lg">
              <span className="text-[10px] font-black text-notera-turquoise uppercase block mb-2 tracking-widest">Önerilen Başarı Skoru</span>
              <div className="text-7xl font-black tracking-tighter">{editedSubmission.totalScore}</div>
              <span className="text-xs font-bold opacity-40">/ 100 PUAN</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-10 print:lg:col-span-12">
          {exam.questions.map((q, idx) => {
            const result = editedSubmission.results.find(r => r.questionId === q.id);
            if (!result) return null;
            const isApproved = approvedIds.has(q.id);

            return (
              <div key={q.id} className={`bg-white dark:bg-slate-900 rounded-[3.5rem] border-2 overflow-hidden transition-all duration-300 print:rounded-none print:border-black ${isApproved ? 'border-notera-turquoise shadow-lg shadow-notera-turquoise/5' : 'border-slate-100 dark:border-slate-800 shadow-sm'}`}>
                <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 print:bg-slate-100">
                   <div className="flex items-center gap-5">
                      <span className="w-14 h-14 bg-notera-purple text-white rounded-2xl flex items-center justify-center font-black text-2xl print:bg-black">{idx + 1}</span>
                      <div>
                        <span className="text-[10px] font-black text-notera-turquoise print:text-black uppercase tracking-widest block">SORU ANALİZİ</span>
                        <h4 className="text-slate-900 dark:text-white font-black text-lg uppercase tracking-tight line-clamp-1">{q.text}</h4>
                      </div>
                   </div>
                   <div className="flex items-center gap-5">
                      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border-2 border-notera-purple/20 print:border-black no-print">
                        <input type="number" value={result.score} onChange={(e) => handleScoreChange(q.id, parseInt(e.target.value) || 0)} className="w-20 px-4 py-3 bg-transparent font-black text-3xl text-notera-purple outline-none text-center" />
                        <span className="font-black text-slate-300 mr-2">/ {q.maxScore}</span>
                      </div>
                      <div className="hidden print:block font-black text-3xl">
                        {result.score} / {q.maxScore}
                      </div>
                      <button 
                        onClick={() => approveQuestion(q.id)} 
                        className={`no-print w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isApproved ? 'bg-notera-turquoise text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-notera-turquoise hover:text-white'}`}
                      >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </button>
                   </div>
                </div>
                <div className="p-12 space-y-10">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Öğrenci Yanıtı</span>
                    <div className="relative p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border-l-8 border-notera-turquoise print:border-black print:bg-white print:rounded-none print:border-2">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white leading-relaxed italic">"{result.extractedText || "Yanıt tespit edilemedi."}"</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-100 print:bg-white print:border-black print:rounded-none">
                      <span className="text-[10px] font-black text-notera-purple uppercase tracking-widest block mb-4">AI ANALİZİ</span>
                      <p className="text-base font-bold text-slate-700 leading-relaxed">{result.reason}</p>
                    </div>
                    
                    <div className="p-8 bg-notera-turquoise/5 dark:bg-notera-turquoise/10 rounded-[2.5rem] border border-notera-turquoise/20 print:bg-white print:border-black print:rounded-none">
                      <span className="text-[10px] font-black text-notera-turquoise uppercase tracking-widest block mb-4">ÖĞRETMEN GERİ BİLDİRİMİ</span>
                      <p className="text-base font-bold text-notera-purple italic">"{result.feedback || "Başarılı bir yanıt."}"</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 1.5cm; }
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          #student-report { padding: 0 !important; }
          .shadow-2xl, .shadow-lg, .shadow-sm { box-shadow: none !important; }
          .rounded-[3.5rem], .rounded-[4rem], .rounded-[2.5rem] { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default GradingDetail;
