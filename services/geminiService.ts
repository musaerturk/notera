import { GoogleGenAI, Type } from "@google/genai";
import { Exam, GradingResult, StudentSubmission, Question, FeedbackTone } from "../types";

const getApiKey = () => {
  const key = process.env.API_KEY;
  if (!key || key === "undefined" || key === "") {
    return null;
  }
  return key;
};

export const generateQuestions = async (
  grade: string,
  course: string,
  outcome: string,
  difficulty: string,
  count: number = 3
): Promise<Question[]> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Anahtarı Bulunamadı! Lütfen Netlify -> Site Settings -> Environment Variables kısmına API_KEY ekleyin.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `DERS: ${course}, SINIF: ${grade}, ZORLUK: ${difficulty}, KAZANIM: ${outcome}, ADET: ${count}`,
      config: {
        systemInstruction: "Sen profesyonel bir eğitim uzmanısın. Kazanımlara uygun sınav soruları üretirsin.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              expectedAnswer: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              maxScore: { type: Type.NUMBER },
              gradingSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    score: { type: Type.NUMBER }
                  },
                  required: ["text", "score"]
                }
              }
            },
            required: ["text", "expectedAnswer", "keywords", "maxScore", "gradingSteps"]
          }
        }
      }
    });

    if (!response.text) throw new Error("Yapay zeka boş yanıt döndürdü.");
    
    return JSON.parse(response.text).map((q: any, i: number) => ({
      ...q,
      id: `gen-${Date.now()}-${i}`
    }));
  } catch (error: any) {
    console.error("AI Soru Üretme Hatası Detayı:", error);
    throw new Error(error.message || "Teknik bir hata oluştu.");
  }
};

export const gradeSubmission = async (
  exam: Exam,
  submission: StudentSubmission,
  tone: FeedbackTone = 'encouraging'
): Promise<{ results: GradingResult[]; totalScore: number }> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Anahtarı Eksik.");

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';

  // Soruları ve puanlama kriterlerini zenginleştirilmiş halde hazırlayalım
  const enrichedQuestions = exam.questions.map(q => ({
    id: q.id,
    text: q.text,
    expectedAnswer: q.expectedAnswer,
    maxScore: q.maxScore,
    gradingSteps: q.gradingSteps || []
  }));
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        { text: `SINAV BİLGİSİ: ${exam.courseName} - ${exam.examName}. \nSORULAR VE KRİTERLER: ${JSON.stringify(enrichedQuestions)}` },
        { inlineData: { mimeType: 'image/jpeg', data: submission.base64Data } }
      ],
      config: {
        systemInstruction: `
          Sen uzman bir öğretmensin. Öğrencinin el yazısı sınav kağıdını OCR ile oku. 
          Her soru için 'score' değerini belirlerken ilgili sorunun 'maxScore' değerini ASLA aşma.
          Cevap kısmen doğruysa rubrikteki (gradingSteps) puanlara göre adil davran.
          Sonucu her soru için JSON objesi içeren bir array olarak dön.
          JSON yapısı: [{ "questionId": "...", "extractedText": "...", "score": 0, "reason": "...", "feedback": "...", "confidence": 0.0 }]
        `,
        responseMimeType: "application/json"
      }
    });

    if (!response.text) throw new Error("Görüntü işlenemedi.");
    
    let results: GradingResult[] = JSON.parse(response.text);

    // GÜVENLİK KATMANI: AI hata yapsa bile kod seviyesinde puanı maxScore ile sınırla
    results = results.map(res => {
      const originalQuestion = exam.questions.find(q => q.id === res.questionId);
      const max = originalQuestion?.maxScore || 100;
      return {
        ...res,
        score: Math.min(Math.max(0, res.score), max) // Puanı 0 ile maxScore arasına hapset
      };
    });

    const totalScore = results.reduce((acc, curr) => acc + (curr.score || 0), 0);

    return { results, totalScore };
  } catch (error: any) {
    console.error("AI Değerlendirme Hatası Detayı:", error);
    throw new Error("Kağıt analizi yapılamadı veya geçersiz format döndü.");
  }
};