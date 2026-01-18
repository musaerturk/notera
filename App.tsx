
import React, { useState, useEffect } from 'react';
import { Exam, StudentSubmission, Question, UserSettings, PricingPlan, GradedExam } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ExamSetup from './components/ExamSetup';
import UploadSection from './components/UploadSection';
import GradingDashboard from './components/GradingDashboard';
import GradingDetail from './components/GradingDetail';
import AnalyticsView from './components/AnalyticsView';
import QuestionPrep from './components/QuestionPrep';
import SettingsPanel from './components/SettingsPanel';
import ExamPaper from './components/ExamPaper';
import AboutView from './components/AboutView';
import HomePanel from './components/HomePanel';
import AdminPanel from './components/AdminPanel';
import PricingView from './components/PricingView';
import CheckoutView from './components/CheckoutView';
import ExamoraInfoView from './components/ExamoraInfoView';
import EduMetrikInfoView from './components/EduMetrikInfoView';
import PrivacyModal from './components/PrivacyModal';
import AnswerKeyUpload from './components/AnswerKeyUpload';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'setup' | 'upload' | 'dashboard' | 'detail' | 'analytics' | 'question-prep' | 'settings' | 'exam-paper' | 'info' | 'admin' | 'admin-login' | 'pricing' | 'checkout' | 'examora-info' | 'edumetrik-info' | 'answer-key-upload'>('info');
  const [exam, setExam] = useState<Exam | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [examHistory, setExamHistory] = useState<GradedExam[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [prefilledQuestions, setPrefilledQuestions] = useState<Question[]>([]);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    teacherName: '',
    schoolName: '',
    subject: '',
    theme: 'light',
    aiSensitivity: 'normal',
    feedbackTone: 'encouraging',
    analyticsLevel: 'basic',
    savedClasses: []
  });
  
  const [adminPassword, setAdminPassword] = useState("");

  const STORAGE_KEYS = {
    EXAM: 'notera_active_exam_v3',
    SUBMISSIONS: 'notera_active_submissions_v3',
    SETTINGS: 'notera_settings_v3',
    HISTORY: 'notera_history_v3',
    PRIVACY: 'notera_privacy_accepted_v3'
  };

  useEffect(() => {
    const savedExam = localStorage.getItem(STORAGE_KEYS.EXAM);
    const savedSubmissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const privacyAccepted = localStorage.getItem(STORAGE_KEYS.PRIVACY);

    if (!privacyAccepted) setShowPrivacy(true);
    if (savedExam) setExam(JSON.parse(savedExam));
    if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));
    if (savedHistory) setExamHistory(JSON.parse(savedHistory));
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applyTheme(parsed.theme);
    }
  }, []);

  const applyTheme = (theme: 'dark' | 'light' | 'system') => {
    const root = window.document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const saveToLocal = (updatedExam: Exam | null, updatedSubmissions: StudentSubmission[], updatedHistory?: GradedExam[]) => {
    if (updatedExam) localStorage.setItem(STORAGE_KEYS.EXAM, JSON.stringify(updatedExam));
    else localStorage.removeItem(STORAGE_KEYS.EXAM);
    
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updatedSubmissions));
    if (updatedHistory) localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
  };

  const startNewExamFlow = (targetView: typeof currentView) => {
    localStorage.removeItem(STORAGE_KEYS.EXAM);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    setExam(null);
    setSubmissions([]);
    setPrefilledQuestions([]);
    setCurrentView(targetView);
    window.scrollTo(0, 0);
  };

  const handleExamSaved = (newExam: Exam) => {
    setExam(newExam);
    setSubmissions([]); 
    saveToLocal(newExam, []);
    setCurrentView('exam-paper');
  };

  const handleAnswerKeyParsed = (parsedData: Partial<Exam> & { questions: Question[] }, quickStart: boolean) => {
    setSubmissions([]);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    const newExamId = `exam-${Date.now()}`;
    
    if (quickStart) {
      const newExam: Exam = {
        id: newExamId,
        type: 'open-ended',
        classSection: parsedData.classSection || 'Belirtilmedi',
        courseName: parsedData.courseName || 'Genel Ders',
        examName: parsedData.examName || 'Yazılı Sınav',
        date: new Date().toISOString(),
        questions: parsedData.questions
      };
      setExam(newExam);
      saveToLocal(newExam, []);
      setCurrentView('upload');
    } else {
      setPrefilledQuestions(parsedData.questions);
      setExam(null);
      saveToLocal(null, []);
      setCurrentView('setup');
    }
  };

  const handleUploadComplete = (newSubmissions: StudentSubmission[]) => {
    const updated = [...submissions, ...newSubmissions];
    setSubmissions(updated);
    
    if (exam) {
      const avg = updated.reduce((a, b) => a + b.totalScore, 0) / (updated.length || 1);
      const gradedExam: GradedExam = {
        id: Date.now().toString(),
        exam: exam,
        submissions: updated,
        averageScore: Math.round(avg),
        createdAt: new Date().toISOString()
      };
      const newHistory = [gradedExam, ...examHistory];
      setExamHistory(newHistory);
      saveToLocal(exam, updated, newHistory);
    }
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'info': return <AboutView onStart={() => setCurrentView('pricing')} />;
      case 'pricing': return <PricingView onSelectPlan={(p) => { if(p.price === 0) setCurrentView('home'); else { setSelectedPlan(p); setCurrentView('checkout'); }}} />;
      case 'checkout': return <CheckoutView plan={selectedPlan!} onCancel={() => setCurrentView('pricing')} onSuccess={() => { setSettings({...settings, isPremium: true}); setCurrentView('home'); }} />;
      case 'home': return <HomePanel onNavigate={startNewExamFlow} onResume={(v) => setCurrentView(v)} isExamSet={!!exam} hasSubmissions={submissions.length > 0} />;
      case 'answer-key-upload': return <AnswerKeyUpload onParsed={handleAnswerKeyParsed} onCancel={() => setCurrentView('home')} />;
      case 'setup': return <ExamSetup initialExam={exam} onSave={handleExamSaved} prefilledQuestions={prefilledQuestions} />;
      case 'upload': return <UploadSection exam={exam!} onUpload={handleUploadComplete} settings={settings} />;
      case 'dashboard': return <GradingDashboard submissions={submissions} settings={settings} onSelect={(id) => { setSelectedSubmissionId(id); setCurrentView('detail'); }} onReset={() => { setSubmissions([]); saveToLocal(exam, []); }} onViewAnalytics={() => setCurrentView('analytics')} />;
      case 'detail':
        const sub = submissions.find(s => s.id === selectedSubmissionId);
        return sub ? <GradingDetail submission={sub} exam={exam!} onBack={() => setCurrentView('dashboard')} onUpdate={(u) => { const updated = submissions.map(s => s.id === u.id ? u : s); setSubmissions(updated); saveToLocal(exam, updated); }} /> : null;
      case 'analytics': return <AnalyticsView submissions={submissions} exam={exam!} settings={settings} onBack={() => setCurrentView('dashboard')} history={examHistory} />;
      case 'question-prep': return <QuestionPrep onQuestionsGenerated={(q) => { setPrefilledQuestions(q); setCurrentView('setup'); }} />;
      case 'settings': return <SettingsPanel settings={settings} onUpdate={(s) => { setSettings(s); applyTheme(s.theme); localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(s)); }} onResetAll={() => { localStorage.clear(); window.location.reload(); }} />;
      case 'exam-paper': return <ExamPaper exam={exam!} settings={settings} onBack={() => setCurrentView('setup')} onStartGrading={() => setCurrentView('upload')} />;
      case 'admin-login': return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Admin Şifresi" className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 outline-none focus:border-notera-purple transition-all" />
          <button onClick={() => { if(adminPassword === "admin123") setCurrentView('admin'); }} className="px-12 py-4 bg-notera-purple text-white rounded-2xl font-black uppercase tracking-widest">Giriş Yap</button>
        </div>
      );
      case 'admin': return <AdminPanel />;
      default: return <HomePanel onNavigate={startNewExamFlow} onResume={(v) => setCurrentView(v)} isExamSet={!!exam} hasSubmissions={submissions.length > 0} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${settings.theme === 'dark' ? 'bg-notera-dark text-slate-100' : 'bg-notera-gray text-slate-900'}`}>
      {showPrivacy && <PrivacyModal onAccept={() => { setShowPrivacy(false); localStorage.setItem(STORAGE_KEYS.PRIVACY, 'true'); }} />}
      <Header currentView={currentView} onNavigate={(v) => setCurrentView(v)} isExamSet={!!exam} isPremium={settings.isPremium} />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {renderView()}
      </main>
      <Footer onAdminClick={() => setCurrentView('admin-login')} onNavigate={setCurrentView} />
    </div>
  );
};

export default App;
