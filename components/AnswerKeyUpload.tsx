
import React, { useState, useRef } from 'react';
import { parseAnswerKey } from '../services/geminiService';
import { Question, Exam } from '../types';

interface AnswerKeyUploadProps {
  onParsed: (data: Partial<Exam> & { questions: Question[] }, quickStart: boolean) => void;
  onCancel: () => void;
}

const AnswerKeyUpload: React.FC<AnswerKeyUploadProps> = ({ onParsed, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<Partial<Exam> & { questions: Question[] } | null>(null);
  
  const [examName, setExamName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [classSection, setClassSection] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const base64 = await fileToBase64(file);
      const data = await parseAnswerKey(base64.split(',')[1]);
      setParsedResult(data);
      setExamName(data.examName || '1. Yazılı Sınav');
      setCourseName(data.courseName || 'Genel Ders');
      setClassSection(''); 
    } catch (err: any) {
      setError(err.message || "Cevap anahtarı okunamadı. Lütfen görselin net olduğundan emin olun.");
    } finally {
      setIsProcessing(false);
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

  const handleConfirmAndStart = () => {
    if (!classSection.trim()) {
      alert("Lütfen sınavı yapacağınız sınıfı (örn: 10-A) giriniz.");
      return;
    }
    if (!parsedResult) return;

    // Bu aşamada onParsed çağrıldığında App.tsx tarafında hafıza sıfırlanıyor.
    onParsed({
      ...parsedResult,
      examName,
      courseName,
      classSection
    }, true); 
  };

  const handleDetailedEdit = () => {
    if (!parsedResult) return;
    onParsed({
      ...parsedResult,
      examName,
      courseName,
      classSection
    }, false); 
  };

  const inputClasses = "w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-notera-turquoise rounded-2xl outline-none transition-all font-bold text-lg text-slate-800 dark:text-white shadow-inner";
  const labelClasses = "block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-2";

  if (parsedResult) {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-fade-in space-y-8">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl border border-notera-turquoise/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </div>
          
          <div className="flex items-center gap-6 mb-10">
            <div className="w-16 h-16 bg-notera-turquoise text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-notera-turquoise/20">✓</div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Cevap Anahtarı Hazır</h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">AI {parsedResult.questions.length} adet soru tespit etti.</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Sınav Başlığı</label>
                <input 
                  type="text" 
                  value={examName} 
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="Örn: 1. Dönem 1. Yazılı" 
                  className={inputClasses} 
                />
              </div>
              <div>
                <label className={labelClasses}>Ders Adı</label>
                <input 
                  type="text" 
                  value={courseName} 
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Örn: Biyoloji" 
                  className={inputClasses} 
                />
              </div>
            </div>
            
            <div>
              <label className={labelClasses}>Hedef Sınıf / Şube (Örn: 9-B)</label>
              <input 
                type="text" 
                value={classSection} 
                onChange={(e) => setClassSection(e.target.value)}
                placeholder="Bu sınav hangi sınıf için?" 
                className={`${inputClasses} border-notera-purple/20 ring-4 ring-notera-purple/5`}
                autoFocus
              />
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleConfirmAndStart}
                className="flex-[2] py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm tracking-widest uppercase shadow-xl hover:bg-notera-purple transition-all flex items-center justify-center gap-3"
              >
                ONAYLA VE OKUMAYA GEÇ
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
              <button 
                onClick={handleDetailedEdit}
                className="flex-1 py-6 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all border-2 border-transparent"
              >
                PUANLARI DÜZENLE
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/30 p-10 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
           <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">AI Tespit Özeti</h3>
           <div className="space-y-4">
              {parsedResult.questions.map((q, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white dark:bg-slate-900/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                   <div className="flex items-center gap-4">
                     <span className="w-8 h-8 bg-notera-purple/10 text-notera-purple rounded-lg flex items-center justify-center font-black text-xs">{i+1}</span>
                     <span className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate max-w-[400px]">{q.text}</span>
                   </div>
                   <span className="shrink-0 font-black text-notera-turquoise text-xs">{q.maxScore} PUAN</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in space-y-12">
      <div className="bg-notera-purple p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none">
           <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">Cevap Anahtarını <br/> <span className="text-notera-turquoise italic">Tanıt</span></h2>
          <p className="text-xl text-slate-200 font-medium max-w-xl">Hafıza temizlenecek ve yeni bir sınav oturumu başlayacaktır.</p>
        </div>
      </div>

      <div className={`relative border-8 border-dashed rounded-[4rem] p-16 transition-all min-h-[450px] flex items-center justify-center ${isProcessing ? 'bg-notera-purple/5 border-notera-purple' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-inner'}`}>
        {isProcessing ? (
          <div className="text-center space-y-8 animate-pulse">
            <div className="w-24 h-24 border-8 border-notera-turquoise border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <p className="text-notera-purple dark:text-notera-turquoise font-black text-3xl uppercase tracking-tighter">ANAHTAR ÇÖZÜMLENİYOR</p>
              <p className="text-slate-400 font-bold">Lütfen bekleyin, sorular ayrıştırılıyor...</p>
            </div>
          </div>
        ) : (
          <div className="text-center group cursor-pointer w-full">
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleUpload} 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            />
            {error && (
              <div className="mb-8 p-6 bg-rose-50 text-rose-600 rounded-[2rem] border-2 border-rose-100 font-black uppercase text-xs tracking-widest animate-shake">
                ⚠️ {error}
              </div>
            )}
            <div className="space-y-8">
              <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner border-2 border-transparent group-hover:border-notera-purple/20">
                <svg className="w-16 h-16 text-notera-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <p className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">CEVAP ANAHTARI GÖRSELİNİ SEÇ</p>
              <button className="px-12 py-5 bg-notera-purple text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl group-hover:bg-notera-turquoise transition-all">DOSYA SEÇİN VEYA SÜRÜKLEYİN</button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button onClick={onCancel} className="text-slate-400 font-black text-xs uppercase tracking-[0.4em] hover:text-rose-500 transition-colors">Vazgeç ve Geri Dön</button>
      </div>
    </div>
  );
};

export default AnswerKeyUpload;
