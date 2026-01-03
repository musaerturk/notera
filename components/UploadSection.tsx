
import React, { useState } from 'react';
import { Exam, StudentSubmission } from '../types';
import { gradeSubmission } from '../services/geminiService';

interface UploadSectionProps {
  exam: Exam;
  onUpload: (submissions: StudentSubmission[]) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ exam, onUpload }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    const newSubmissions: StudentSubmission[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(Math.round(((i) / files.length) * 100));
        
        const base64 = await fileToBase64(file);
        
        const sub: StudentSubmission = {
          id: Date.now().toString() + i,
          studentName: file.name.split('.')[0] || `Öğrenci ${i + 1}`,
          imageUrl: URL.createObjectURL(file),
          base64Data: base64.split(',')[1],
          status: 'processing',
          results: [],
          totalScore: 0
        };

        try {
          const { results, totalScore } = await gradeSubmission(exam, sub);
          sub.results = results;
          sub.totalScore = totalScore;
          sub.status = 'graded';
        } catch (err) {
          console.error("Grading failed for file", file.name, err);
          sub.status = 'pending';
        }
        
        newSubmissions.push(sub);
      }
      
      onUpload(newSubmissions);
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-12 text-center animate-fade-in">
      <div className="mb-8">
        <div className="w-20 h-20 bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-700">
          <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Sınav Kağıtlarını Yükleyin</h2>
        <p className="text-slate-400 mt-2">AI asistanının okuması için öğrenci kağıtlarını buraya aktarın.</p>
      </div>

      <div className={`relative border-2 border-dashed rounded-3xl p-12 transition-all shadow-2xl ${isProcessing ? 'border-indigo-500 bg-indigo-950/50' : 'border-slate-700 hover:border-indigo-600 bg-white'}`}>
        {!isProcessing ? (
          <>
            <input 
              type="file" 
              multiple 
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-4">
              <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all inline-flex items-center gap-2 uppercase tracking-wide">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Dosya Seçin
              </button>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">veya buraya sürükleyin</p>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-indigo-900 font-black text-xl uppercase">AI ANALİZ EDİYOR</p>
              <p className="text-slate-500 text-xs font-bold mt-1 uppercase">Lütfen Bekleyin...</p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 border border-slate-300">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-300 shadow-lg shadow-indigo-400" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-black text-indigo-900 uppercase tracking-widest">
              <span>İŞLENEN VERİ</span>
              <span>%{uploadProgress}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        {[
          { t: 'OCR TARAMA', d: 'El yazısı karakterleri yüksek doğrulukla metne dökülür.' },
          { t: 'ANLAM ANALİZİ', d: 'Cevaplar kelime bazlı değil, anlamsal olarak kıyaslanır.' },
          { t: 'PUANLAMA', d: 'Rubrik kriterlerine göre objektif puan önerilir.' }
        ].map((item, i) => (
          <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 shadow-lg">
            <div className="text-indigo-900 mb-2 font-black text-xs tracking-widest uppercase">{item.t}</div>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{item.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadSection;
