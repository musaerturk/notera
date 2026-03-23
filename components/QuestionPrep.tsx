import React, { useState } from 'react';
import { generateQuestions } from '../services/geminiService';
import { Question } from '../types';

interface QuestionPrepProps {
  onQuestionsGenerated: (questions: Question[]) => void;
}

const QuestionPrep: React.FC<QuestionPrepProps> = ({ onQuestionsGenerated }) => {
  const [grade, setGrade] = useState('');
  const [course, setCourse] = useState('');
  const [outcome, setOutcome] = useState('');
  const [difficulty, setDifficulty] = useState('Orta');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const difficulties = [
    { id: 'Çok Basit', label: 'Çok Basit' },
    { id: 'Basit', label: 'Basit' },
    { id: 'Orta', label: 'Orta' },
    { id: 'Orta Üst', label: 'Orta Üst' },
    { id: 'Olması Gereken', label: 'İdeal (MEB)' }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grade || !course || !outcome) return;
    
    setIsGenerating(true);
    try {
      const questions = await generateQuestions(grade, course, outcome, difficulty);
      setGeneratedQuestions(questions);
      // Başlangıçta tümünü seç
      setSelectedIds(questions.map((_, idx) => idx));
    } catch (err: any) {
      // Hata mesajını daha net göster
      alert(`Sınav Hazırlama Hatası:\n${err.message || "Bilinmeyen bir hata oluştu."}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSelection = (idx: number) => {
    if (selectedIds.includes(idx)) {
      setSelectedIds(selectedIds.filter(id => id !== idx));
    } else {
      setSelectedIds([...selectedIds, idx]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === generatedQuestions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(generatedQuestions.map((_, idx) => idx));
    }
  };

  const handleTransfer = () => {
    const selected = generatedQuestions.filter((_, idx) => selectedIds.includes(idx));
    if (selected.length === 0) {
      alert("Lütfen en az bir soru seçiniz.");
      return;
    }
    onQuestionsGenerated(selected);
  };

  const inputClasses = "w-full px-6 py-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl focus:border-notera-turquoise outline-none transition-all text-slate-900 dark:text-white font-bold text-lg shadow-sm";
  const labelClasses = "block text-[10px] font-black text-notera-purple dark:text-notera-turquoise uppercase tracking-[0.3em] mb-3";

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-20">
      <div className="mb-12 p-12 bg-notera-purple rounded-[4rem] shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Sınavı <span className="text-notera-turquoise italic">Birlikte</span> Oluşturalım</h2>
          <p className="text-slate-200 font-medium text-xl max-w-xl">NOTERA önerir, sen onaylarsın. Kazanımlara uygun, ölçücü sorular hazırlayalım.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-12">
        <form onSubmit={handleGenerate} className="p-12 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className={labelClasses}>Sınıf Düzeyi</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className={inputClasses} required>
                <option value="">Seçiniz...</option>
                {[5,6,7,8,9,10,11,12].map(n => <option key={n} value={`${n}. Sınıf`}>{n}. Sınıf</option>)}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Ders</label>
              <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Örn: Biyoloji" className={inputClasses} required />
            </div>
          </div>
          
          <div>
            <label className={labelClasses}>Zorluk Seviyesi Nasıl Olsun?</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setDifficulty(diff.id)}
                  className={`py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${
                    difficulty === diff.id 
                      ? 'bg-notera-purple text-white border-notera-purple shadow-xl' 
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-notera-turquoise'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClasses}>Bu Soru Hangi Kazanımı Ölçüyor?</label>
            <textarea value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="Örn: Hücre bölünmesini analiz eder." className={`${inputClasses} min-h-[160px] leading-relaxed`} required />
          </div>
          
          <button 
            type="submit" 
            disabled={isGenerating}
            className="w-full py-8 bg-notera-turquoise text-white rounded-[2rem] font-black text-lg tracking-[0.4em] uppercase shadow-2xl hover:bg-[#45a19d] transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
          >
            {isGenerating ? 'Hazırlanıyor...' : 'Soruları Oluştur'}
          </button>
        </form>
      </div>

      {generatedQuestions.length > 0 && (
        <div className="space-y-10 animate-fade-in">
          <div className="flex justify-between items-end px-6">
            <h3 className="text-3xl font-black text-notera-purple dark:text-white uppercase tracking-tight">Önerilen Soru Taslakları</h3>
            <button 
              onClick={selectAll}
              className="text-xs font-black text-notera-turquoise uppercase tracking-widest hover:underline"
            >
              {selectedIds.length === generatedQuestions.length ? 'Tüm Seçimi Kaldır' : 'Tümünü Seç'}
            </button>
          </div>
          <div className="grid gap-8">
            {generatedQuestions.map((q, idx) => (
              <div 
                key={idx} 
                onClick={() => toggleSelection(idx)}
                className={`cursor-pointer transition-all bg-white dark:bg-slate-900 p-10 rounded-[3rem] border-4 shadow-sm ${
                  selectedIds.includes(idx) 
                    ? 'border-notera-turquoise' 
                    : 'border-slate-100 dark:border-slate-800 opacity-60 grayscale-[0.5]'
                }`}
              >
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-colors ${
                        selectedIds.includes(idx) ? 'bg-notera-purple text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        {idx + 1}
                      </div>
                      {selectedIds.includes(idx) && (
                        <div className="w-8 h-8 bg-notera-turquoise text-white rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </div>
                    <span className="px-5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-black text-notera-purple dark:text-notera-turquoise uppercase tracking-widest border border-slate-100 dark:border-slate-700">{q.maxScore} PUAN</span>
                 </div>
                 <p className="text-2xl font-bold text-slate-800 dark:text-white mb-8 leading-snug">{q.text}</p>
                 <div className="p-8 bg-slate-50 dark:bg-notera-turquoise/5 rounded-[2.5rem] border border-slate-100 dark:border-notera-turquoise/10">
                    <span className="text-[10px] font-black text-notera-turquoise uppercase mb-3 block tracking-[0.2em]">İDEAL CEVAP TASLAĞI</span>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">"{q.expectedAnswer}"</p>
                 </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleTransfer}
            className="w-full py-10 bg-notera-purple text-white rounded-[3rem] font-black text-xl tracking-[0.3em] uppercase shadow-2xl hover:bg-notera-dark transition-all border-b-8 border-notera-dark/30 active:translate-y-2 active:border-b-0"
          >
            Seçilen Soruları ({selectedIds.length}) Aktar
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionPrep;
