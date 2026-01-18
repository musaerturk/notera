export interface GradingStep {
  text: string;
  score: number;
}

export interface Question {
  id: string;
  text: string;
  expectedAnswer: string;
  keywords: string[];
  maxScore: number;
  gradingSteps?: GradingStep[];
  options?: string[];
}

export interface Exam {
  id: string;
  type: 'open-ended' | 'multiple-choice';
  classSection: string;
  courseName: string;
  examName: string;
  date: string;
  questions: Question[];
}

export interface GradedExam {
  id: string;
  exam: Exam;
  submissions: StudentSubmission[];
  averageScore: number;
  createdAt: string;
}

export interface GradingResult {
  questionId: string;
  extractedText: string;
  selectedOption?: string;
  score: number;
  reason: string;
  feedback: string;
  confidence: number;
}

export interface StudentSubmission {
  id: string;
  studentName: string;
  imageUrl: string;
  base64Data: string;
  status: 'pending' | 'processing' | 'graded' | 'reviewed';
  results: GradingResult[];
  totalScore: number;
}

export type FeedbackTone = 'encouraging' | 'academic' | 'concise';

export type AnalyticsLevel = 'basic' | 'advanced' | 'institutional';

export interface UserSettings {
  teacherName: string;
  schoolName: string;
  subject: string;
  theme: 'dark' | 'light' | 'system';
  aiSensitivity: 'low' | 'normal' | 'strict';
  feedbackTone: FeedbackTone;
  isPremium?: boolean;
  analyticsLevel: AnalyticsLevel;
  savedClasses: string[]; // Kayıtlı sınıflar listesi
}

// ADMIN & PAYMENT TYPES
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  paperLimit: number;
  questionGenLimit: number;
  analyticsLevel: AnalyticsLevel;
  features: string[];
  isPopular?: boolean;
  color: string;
}

export interface Campaign {
  id: string;
  code: string;
  discount: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  school: string;
  planId: string;
  joinedAt: string;
  status: 'active' | 'suspended' | 'pending';
  totalPapersRead: number;
}

export interface AdminStats {
  totalRevenue: number;
  activeUsers: number;
  processedPapers: number;
  conversions: number;
  growthData: { date: string; users: number; revenue: number; papers: number }[];
  moduleUsage: { module: string; usage: number; color: string }[];
}