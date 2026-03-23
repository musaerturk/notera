
import React from 'react';
import { Exam, UserSettings } from '../types';

interface ExamPaperProps {
  exam: Exam;
  settings: UserSettings;
  onBack: () => void;
  onStartGrading: () => void;
}

const ExamPaper: React.FC<ExamPaperProps> = ({ exam, settings, onBack, onStartGrading }) => {
  return (
    <div className="animate-fade-in pb-20 max-w-4xl mx-auto">
      {/* Kontrol Paneli */}
      <div className="no-print mb-8 flex flex-col md:flex-row items-center justify-between p-6 bg-slate-900 border-2 border-indigo-900 rounded-[2rem] shadow-xl gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="px-6 py-4 flex items-center gap-2 bg-slate-800 text-indigo-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all border border-indigo-900 font-black text-xs uppercase tracking-widest"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            DÜZENLE
          </button>
          <div>
            <h3 className="text-white font-black uppercase text-sm tracking-widest leading-none mb-1">Sınav Kağıdı Hazır</h3>
            <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">Önce PDF alın veya yazdırın, sınav sonrası kağıtları yükleyin.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => window.print()}
            className="flex-1 md:flex-none px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-slate-100 shadow-lg transition-all flex items-center justify-center gap-2 border-2 border-transparent"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            PDF ÇIKTISI AL
          </button>
          <button 
            onClick={onStartGrading}
            className="flex-1 md:flex-none px-8 py-4 bg-notera-turquoise text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-[#45a19d] shadow-[0_10px_30px_rgba(79,182,178,0.3)] border-b-4 border-teal-800 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-2"
          >
            Okumaya Başla
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
        </div>
      </div>

      {/* Sınav Kağıdı Alanı (A4 Formatı) */}
      <div className="bg-white text-black p-12 min-h-[1100px] shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 flex flex-col" id="printable-exam">
        {/* Okul Başlığı ve Sınav Bilgileri */}
        <div className="mb-8 space-y-4">
          <div className="text-center font-black text-xl uppercase tracking-widest">
            {settings.schoolName || "OKUL ADI"}
          </div>
          
          <div className="flex justify-between items-center font-bold text-sm uppercase">
            <div className="w-1/3 text-left">
              DERS ADI: {exam.courseName}
            </div>
            <div className="w-1/3 text-center">
              DÖNEM NO: {exam.termNo || "-"}
            </div>
            <div className="w-1/3 text-right">
              SINAV NO: {exam.examNo || "-"}
            </div>
          </div>
        </div>

        {/* Öğrenci Bilgi Tablosu */}
        <div className="mb-12">
          <table className="w-full border-collapse border-[2px] border-black text-[11px] md:text-sm font-bold">
            <tbody>
              <tr className="h-12">
                <td className="border-[2px] border-black px-4 w-1/2">Adı Soyad:</td>
                <td className="border-[2px] border-black px-4 w-1/6 text-center">Numara:</td>
                <td className="border-[2px] border-black px-4 w-1/6 text-center">Sınıf Şube: {exam.classSection}</td>
                <td className="border-[2px] border-black px-4 w-1/6 text-center">Puanı:</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sınav Başlığı (Opsiyonel, eğer girildiyse) */}
        {exam.examName && (
          <div className="text-center mb-10 font-black text-lg uppercase underline underline-offset-4">
            {exam.examName}
          </div>
        )}

        {/* Sorular */}
        <div className="space-y-16 flex-grow">
          {exam.questions.map((q, idx) => (
            <div key={q.id} className="relative page-break-inside-avoid">
              <div className="flex justify-between items-start mb-6">
                <div className="font-bold text-sm md:text-base pr-16 text-justify leading-relaxed">
                  <span className="font-black mr-3">{idx + 1}.</span>
                  {q.text}
                </div>
                <div className="text-[10px] font-black italic whitespace-nowrap border-2 border-black px-3 py-1 bg-slate-50">
                  ({q.maxScore} P)
                </div>
              </div>

              {/* Cevap Alanı */}
              {exam.type === 'open-ended' ? (
                <div className="space-y-8 ml-8">
                  <div className="w-full border-b border-dashed border-slate-300 h-10"></div>
                  <div className="w-full border-b border-dashed border-slate-300 h-10"></div>
                  <div className="w-full border-b border-dashed border-slate-300 h-10"></div>
                  <div className="w-full border-b border-dashed border-slate-300 h-10"></div>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-6 ml-12 mt-8">
                  {['A', 'B', 'C', 'D', 'E'].map(opt => (
                    <div key={opt} className="flex items-center gap-4">
                      <div className="w-10 h-10 border-[2.5px] border-black rounded-full flex items-center justify-center font-black text-base">{opt}</div>
                      <div className="w-full border-b-2 border-black opacity-20"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Alt Bilgi */}
        <div className="mt-20">
          <div className="flex justify-between items-end border-t-[2px] border-black pt-8 mb-12">
            <div className="text-xs font-bold italic">
              * Başarılar dilerim... Sınav süresi 40 dakikadır.
            </div>
            <div className="text-center font-black">
              <p className="text-sm uppercase underline underline-offset-8">{exam.teacherName || settings.teacherName || "Ders Öğretmeni"}</p>
              <p className="text-[10px] mt-4 italic opacity-40">İmza / Mühür</p>
            </div>
          </div>

          {/* Uygulama Sloganı (Silik) */}
          <div className="text-center opacity-20 text-[8px] font-bold uppercase tracking-[0.5em] select-none">
            NOTERA - Değerlendirmenin Akıllı Yolu
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 1.5cm; }
          body { background: white !important; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          header { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; width: 100% !important; }
          .container { max-width: 100% !important; padding: 0 !important; }
          .page-break-inside-avoid { page-break-inside: avoid; }
          #printable-exam { 
            width: 100% !important; 
            border: none !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ExamPaper;
