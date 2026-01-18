
import React, { useState, useRef } from 'react';
import { Exam, StudentSubmission, UserSettings } from './types';
import { gradeSubmission } from './services/geminiService';

interface UploadSectionProps {
  exam: Exam;
  onUpload: (submissions: StudentSubmission[]) => void;
  settings: UserSettings;
}

const UploadSection: React.FC<UploadSectionProps> = ({ exam, onUpload, settings }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Kameraya erişilemedi.");
      setMode('upload');
    }
  };

  const captureAndGrade = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvasRef.current.toDataURL('image/jpeg');
    const fileName = `Kamera Tarama - ${new Date().toLocaleTimeString()}`;
    
    processFiles([{ data: base64, name: fileName }]);
  };

  const processFiles = async (fileDatas: { data: string, name: string }[]) => {
    setIsProcessing(true);
    const newSubmissions: StudentSubmission[] = [];

    for (let i = 0; i < fileDatas.length; i++) {
      setUploadProgress(Math.round(((i + 1) / fileDatas.length) * 100));
      const { data, name } = fileDatas[i];
      
      const sub: StudentSubmission = {
        id: `sub-${Date.now()}-${i}`,
        studentName: name.replace(/\.[^/.]+$/, ""),
        imageUrl: data,
        base64Data: data.split(',')[1],
        status: 'processing',
        results: [],
        totalScore: 0
      };

      try {
        const { results, totalScore } = await gradeSubmission(exam, sub, settings.feedbackTone);
        sub.results = results;
        sub.totalScore = totalScore;
        sub.status = 'graded';
      } catch (err) {
        console.error("Okuma hatası:", err);
        sub.status = 'pending';
      }
      newSubmissions.push(sub);
    }
    
    onUpload(newSubmissions);
    setIsProcessing(false);
    
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileList = Array.from(files);
    const fileDatas = await Promise.all(fileList.map(async (f: File) => ({
      data: await fileToBase64(f),
      name: f.name
    })));
    
    processFiles(fileDatas);
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
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
      {/* ŞU ANKİ SINAV BİLGİSİ - KRİTİK BAĞLAM */}
      <div className="mb-10 p-8 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-notera-purple text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg">📄</div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Şu an okunan sınav oturumu:</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
              {exam.classSection} {exam.courseName} <span className="text-notera-turquoise ml-2">• {exam.examName}</span>
            </h3>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-8 justify-center no-print">
        <button 
          onClick={() => setMode('upload')} 
          className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'upload' ? 'bg-notera-purple text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}
        >
          DOSYA YÜKLE
        </button>
        <button 
          onClick={startCamera} 
          className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'camera' ? 'bg-notera-purple text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}
        >
          KAMERA İLE TARA
        </button>
      </div>

      <div className={`relative border-4 border-dashed rounded-[4rem] p-16 transition-all min-h-[450px] flex items-center justify-center ${isProcessing ? 'bg-notera-purple/5 border-notera-purple' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-inner'}`}>
        {isProcessing ? (
          <div className="text-center space-y-8 animate-pulse">
            <div className="w-24 h-24 border-8 border-notera-turquoise border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <p className="text-notera-purple dark:text-notera-turquoise font-black text-3xl uppercase tracking-tighter">AI KAĞITLARI ANALİZ EDİYOR</p>
              <p className="text-slate-400 font-bold text-lg">İlerleme: %{uploadProgress}</p>
            </div>
          </div>
        ) : mode === 'camera' ? (
          <div className="w-full max-w-lg space-y-8">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-[2.5rem] shadow-2xl bg-black border-4 border-notera-purple" />
            <canvas ref={canvasRef} className="hidden" />
            <button 
              onClick={captureAndGrade} 
              className="w-full py-8 bg-notera-turquoise text-white rounded-[2rem] font-black uppercase tracking-widest text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              ŞİMDİ TARA 📸
            </button>
          </div>
        ) : (
          <div className="text-center group cursor-pointer w-full">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            />
            <div className="space-y-6">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">ÖĞRENCİ KAĞITLARINI YÜKLE</p>
                <p className="text-sm font-bold text-slate-300 dark:text-slate-700">Dosyaları sürükleyin veya tıklayın.</p>
              </div>
              <button className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] group-hover:bg-notera-purple group-hover:text-white transition-all">DOSYA SEÇİN</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
