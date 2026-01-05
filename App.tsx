
import React, { useState, useEffect } from 'react';
import { Exam, StudentSubmission, Question, UserSettings, PricingPlan } from './types';
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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'setup' | 'upload' | 'dashboard' | 'detail' | 'analytics' | 'question-prep' | 'settings' | 'exam-paper' | 'info' | 'admin' | 'admin-login' | 'pricing' | 'checkout' | 'examora-info' | 'edumetrik-info'>('info');
  const [exam, setExam] = useState<Exam | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
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
    analyticsLevel: 'basic'
  });
  
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState(false);

  useEffect(() => {
    const savedExam = localStorage.getItem('notera_exam');
    const savedSubmissions = localStorage.getItem('notera_submissions');
    const savedSettings = localStorage.getItem('notera_settings');
    const privacyAccepted = localStorage.getItem('notera_privacy_accepted');

    if (!privacyAccepted) setShowPrivacy(true);
    if (savedExam) setExam(JSON.parse(savedExam));
    if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings({
        ...parsedSettings,
        analyticsLevel: parsedSettings.analyticsLevel || 'basic'
      });
      applyTheme(parsedSettings.theme);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey && e.code === 'KeyA') {
        setCurrentView('admin-login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePrivacyAccept = () => {
    localStorage.setItem('notera_privacy_accepted', 'true');
    setShowPrivacy(false);
  };

  const applyTheme = (theme: 'dark' | 'light' | 'system') => {
    const root = window.document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      setCurrentView('admin');
      setAdminError(false);
      setAdminPassword("");
      window.scrollTo(0, 0);
    } else {
      setAdminError(true);
    }
  };

  const saveToLocal = (updatedExam: Exam | null, updatedSubmissions: StudentSubmission[]) => {
    if (updatedExam) localStorage.setItem('notera_exam', JSON.stringify(updatedExam));
    localStorage.setItem('notera_submissions', JSON.stringify(updatedSubmissions));
  };

  const handleSettingsUpdate = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notera_settings', JSON.stringify(newSettings));
    applyTheme(newSettings.theme);
  };

  const handleExamSaved = (newExam: Exam) => {
    setExam(newExam);
    saveToLocal(newExam, submissions);
    setCurrentView('exam-paper');
  };

  const handleUploadComplete = (newSubmissions: StudentSubmission[]) => {
    const updated = [...submissions, ...newSubmissions];
    setSubmissions(updated);
    saveToLocal(exam, updated);
    setCurrentView('dashboard');
  };

  const handleSubmissionUpdate = (updatedSub: StudentSubmission) => {
    const updated = submissions.map(s => s.id === updatedSub.id ? updatedSub : s);
    setSubmissions(updated);
    saveToLocal(exam, updated);
  };

  const handleQuestionsGenerated = (questions: Question[]) => {
    setPrefilledQuestions(questions);
    setCurrentView('setup');
  };

  const handlePlanSelection = (plan: PricingPlan) => {
    if (plan.price === 0) {
      setSettings({ ...settings, isPremium: false, analyticsLevel: 'basic' });
      setCurrentView('home');
    } else {
      setSelectedPlan(plan);
      setCurrentView('checkout');
    }
  };

  const handlePaymentSuccess = () => {
    if (selectedPlan) {
      const newSettings: UserSettings = {
        ...settings,
        isPremium: true,
        analyticsLevel: selectedPlan.analyticsLevel
      };
      setSettings(newSettings);
      localStorage.setItem('notera_settings', JSON.stringify(newSettings));
      setCurrentView('home');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'info': return <AboutView onStart={() => setCurrentView('pricing')} />;
      case 'pricing': return <PricingView onSelectPlan={handlePlanSelection} />;
      case 'checkout': return selectedPlan ? <CheckoutView plan={selectedPlan} onCancel={() => setCurrentView('pricing')} onSuccess={handlePaymentSuccess} /> : null;
      case 'examora-info': return <ExamoraInfoView onStart={() => setCurrentView('question-prep')} />;
      case 'edumetrik-info': return <EduMetrikInfoView onStart={() => setCurrentView('dashboard')} isExamSet={!!exam} />;
      case 'home': return <HomePanel onNavigate={(view) => setCurrentView(view)} isExamSet={!!exam} hasSubmissions={submissions.length > 0} />;
      case 'settings': return <SettingsPanel settings={settings} onUpdate={handleSettingsUpdate} onResetAll={() => { localStorage.clear(); window.location.reload(); }} />;
      case 'question-prep': return <QuestionPrep onQuestionsGenerated={handleQuestionsGenerated} />;
      case 'setup': return <ExamSetup initialExam={exam} onSave={handleExamSaved} prefilledQuestions={prefilledQuestions} />;
      case 'exam-paper': return exam ? <ExamPaper exam={exam} settings={settings} onBack={() => setCurrentView('setup')} onStartGrading={() => setCurrentView('upload')} /> : null;
      case 'upload': return <UploadSection onUpload={handleUploadComplete} exam={exam!} settings={settings} />;
      case 'dashboard': return <GradingDashboard submissions={submissions} settings={settings} onSelect={(id) => { setSelectedSubmissionId(id); setCurrentView('detail'); }} onReset={() => { setSubmissions([]); saveToLocal(exam, []); }} onViewAnalytics={() => setCurrentView('analytics')} />;
      case 'detail':
        const sub = submissions.find(s => s.id === selectedSubmissionId);
        return sub ? <GradingDetail submission={sub} exam={exam!} onBack={() => setCurrentView('dashboard')} onUpdate={handleSubmissionUpdate} /> : null;
      case 'analytics': return <AnalyticsView submissions={submissions} exam={exam!} settings={settings} onBack={() => setCurrentView('dashboard')} />;
      case 'admin': return <AdminPanel />;
      case 'admin-login': return (
        <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md text-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase mb-8">Admin Girişi</h2>
            <form onSubmit={handleAdminAuth} className="space-y-4">
              <input 
                type="password" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Şifre"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl outline-none font-black text-center"
                autoFocus
              />
              <button type="submit" className="w-full py-5 bg-notera-purple text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all">Giriş Yap</button>
              <button type="button" onClick={() => setCurrentView('home')} className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest">İptal</button>
            </form>
          </div>
        </div>
      );
      default: return <HomePanel onNavigate={(view) => setCurrentView(view)} isExamSet={!!exam} hasSubmissions={submissions.length > 0} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${settings.theme === 'dark' ? 'bg-notera-dark text-slate-100' : 'bg-notera-gray text-slate-900'}`}>
      {showPrivacy && <PrivacyModal onAccept={handlePrivacyAccept} />}
      <Header currentView={currentView} onNavigate={(view) => setCurrentView(view)} isExamSet={!!exam} isPremium={settings.isPremium} />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        {renderView()}
      </main>
      <Footer onAdminClick={() => setCurrentView('admin-login')} onNavigate={setCurrentView} />
    </div>
  );
};

export default App;
