
import React, { useState, useRef } from 'react';
import { Exam, StudentSubmission, UserSettings } from '../types';
import { gradeSubmission } from '../services/geminiService';

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
      setUploadProgress(Math.round(((i) / fileDatas.length) * 100));
      const { data, name } = fileDatas[i];
      
      const sub: StudentSubmission = {
        id: Date.now().toString() + i,
        studentName: name.split('.')[0],
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
        sub.status = 'pending';
      }
      newSubmissions.push(sub);
    }
    
    onUpload(newSubmissions);
    setIsProcessing(false);
    // Kamerayı kapat
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    // Fix: Explicitly type 'f' as 'File' to resolve 'unknown' type errors during mapping.
    const fileDatas = await Promise.all(Array.from(files).map(async (f: File) => ({
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
      <div className="flex gap-4 mb-8 justify-center">
        <button onClick={() => setMode('upload')} className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${mode === 'upload' ? 'bg-notera-purple text-white' : 'bg-white text-slate-400'}`}>DOSYA YÜKLE</button>
        <button onClick={startCamera} className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${mode === 'camera' ? 'bg-notera-purple text-white' : 'bg-white text-slate-400'}`}>KAMERA İLE TARA</button>
      </div>

      <div className={`relative border-4 border-dashed rounded-[3rem] p-12 transition-all min-h-[400px] flex items-center justify-center ${isProcessing ? 'bg-notera-purple/5 border-notera-purple' : 'bg-white border-slate-200'}`}>
        {isProcessing ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 border-4 border-notera-turquoise border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-notera-purple font-black text-2xl uppercase tracking-tighter">KAĞITLAR İŞLENİYOR %{uploadProgress}</p>
          </div>
        ) : mode === 'camera' ? (
          <div className="w-full max-w-lg space-y-6">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-[2rem] shadow-2xl bg-black border-4 border-notera-purple" />
            <canvas ref={canvasRef} className="hidden" />
            <button onClick={captureAndGrade} className="w-full py-6 bg-notera-turquoise text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xl shadow-xl hover:scale-105 transition-all">ŞİMDİ TARA 📸</button>
          </div>
        ) : (
          <div className="text-center">
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              <p className="text-xl font-black text-slate-400 uppercase tracking-widest">DOSYALARI SÜRÜKLEYİN</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
