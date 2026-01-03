
import React, { useState, useEffect } from 'react';
import { Exam, StudentSubmission, Question, UserSettings } from './types';
import Header from './components/Header';
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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'setup' | 'upload' | 'dashboard' | 'detail' | 'analytics' | 'question-prep' | 'settings' | 'exam-paper' | 'info'>('info');
  const [exam, setExam] = useState<Exam | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [prefilledQuestions, setPrefilledQuestions] = useState<Question[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    teacherName: '',
    schoolName: '',
    subject: '',
    theme: 'light',
    aiSensitivity: 'normal'
  });

  useEffect(() => {
    const savedExam = localStorage.getItem('notera_exam');
    const savedSubmissions = localStorage.getItem('notera_submissions');
    const savedSettings = localStorage.getItem('notera_settings');

    if (savedExam) setExam(JSON.parse(savedExam));
    if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      applyTheme(parsedSettings.theme);
    } else {
      applyTheme('light');
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

  const renderView = () => {
    switch (currentView) {
      case 'info':
        return <AboutView onStart={() => setCurrentView('home')} />;
      case 'home':
        return <HomePanel onNavigate={(view) => setCurrentView(view)} isExamSet={!!exam} hasSubmissions={submissions.length > 0} />;
      case 'settings':
        return <SettingsPanel settings={settings} onUpdate={handleSettingsUpdate} onResetAll={() => {
          if(confirm('Tüm veriler (sınavlar, sonuçlar) kalıcı olarak silinecek. Emin misiniz?')) {
            localStorage.clear();
            window.location.reload();
          }
        }} />;
      case 'question-prep':
        return <QuestionPrep onQuestionsGenerated={handleQuestionsGenerated} />;
      case 'setup':
        return <ExamSetup initialExam={exam} onSave={handleExamSaved} prefilledQuestions={prefilledQuestions} />;
      case 'exam-paper':
        return exam ? (
          <ExamPaper 
            exam={exam} 
            settings={settings} 
            onBack={() => setCurrentView('setup')} 
            onStartGrading={() => setCurrentView('upload')}
          />
        ) : null;
      case 'upload':
        return <UploadSection onUpload={handleUploadComplete} exam={exam!} />;
      case 'dashboard':
        return (
          <GradingDashboard 
            submissions={submissions} 
            onSelect={(id) => { setSelectedSubmissionId(id); setCurrentView('detail'); }}
            onReset={() => { if(confirm('Tüm sonuçlar silinecek. Emin misiniz?')) { setSubmissions([]); saveToLocal(exam, []); } }}
            onViewAnalytics={() => setCurrentView('analytics')}
          />
        );
      case 'detail':
        const sub = submissions.find(s => s.id === selectedSubmissionId);
        if (!sub) return null;
        return (
          <GradingDetail 
            submission={sub} 
            exam={exam!} 
            onBack={() => setCurrentView('dashboard')} 
            onUpdate={handleSubmissionUpdate}
          />
        );
      case 'analytics':
        return <AnalyticsView submissions={submissions} exam={exam!} onBack={() => setCurrentView('dashboard')} />;
      default:
        return <HomePanel onNavigate={(view) => setCurrentView(view)} isExamSet={!!exam} hasSubmissions={submissions.length > 0} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${settings.theme === 'light' ? 'bg-notera-gray text-slate-900' : 'bg-notera-dark text-slate-100'}`}>
      <Header 
        currentView={currentView} 
        onNavigate={(view) => setCurrentView(view)} 
        isExamSet={!!exam}
        teacherName={settings.teacherName}
      />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
