
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

export interface UserSettings {
  teacherName: string;
  schoolName: string;
  subject: string;
  theme: 'dark' | 'light' | 'system';
  aiSensitivity: 'low' | 'normal' | 'strict';
}
