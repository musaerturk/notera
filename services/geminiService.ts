import { GoogleGenAI, Type } from "@google/genai";
import { Exam, GradingResult, StudentSubmission, Question, FeedbackTone } from "../types";

const getApiKey = () => {
  // Vite 'define' ile enjekte edilen anahtarı kontrol eder
  const key = process.env.API_KEY;
  if (!key || key === "undefined" || key === "") {
    console.error("Gemini API Anahtarı bulunamadı! Netlify ayarlarını kontrol edin.");
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
    throw new Error("Sistem yapılandırması tamamlanmadı. Lütfen API anahtarını Netlify paneline ekleyin.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    Sen dünya standartlarında bir eğitim teknolojileri uzmanı ve ölçme değerlendirme profesörüsün. 
    Verilen sınıf düzeyi, ders adı, öğrenme çıktısı (kazanım) ve zorluk seviyesine tam uyumlu, 
    öğrencinin bilgisini derinlemesine ölçen profesyonel açık uçlu sınav soruları hazırlarsın.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `DERS: ${course}, SINIF: ${grade}, ZORLUK: ${difficulty}, KAZANIM: ${outcome}, ADET: ${count}`,
      config: {
        systemInstruction,
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

    const text = response.text;
    if (!text) throw new Error("Yapay zeka yanıt üretemedi.");
    
    return JSON.parse(text).map((q: any, i: number) => ({
      ...q,
      id: `gen-${Date.now()}-${i}`
    }));
  } catch (error: any) {
    console.error("Generate Error:", error);
    throw new Error(error.message || "Soru üretilirken teknik bir hata oluştu.");
  }
};

export const gradeSubmission = async (
  exam: Exam,
  submission: StudentSubmission,
  tone: FeedbackTone = 'encouraging'
): Promise<{ results: GradingResult[]; totalScore: number }> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API anahtarı bulunamadı.");

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  const toneInstruction = {
    encouraging: "Öğrenciyi motive eden, gelişim odaklı dil kullan.",
    academic: "Resmi ve akademik bir dil kullan.",
    concise: "Kısa ve öz geri bildirim ver."
  }[tone];

  const systemInstruction = `
    Öğrencinin el yazısı sınav kağıdını analiz et.
    Resimdeki el yazısını OCR ile oku ve rubrikteki kriterlere göre puanla.
    Geri bildirim tonu: ${toneInstruction}
    Yanıtı mutlaka geçerli bir JSON array olarak döndür.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        { text: `SINAV: ${exam.courseName}, SORULAR: ${JSON.stringify(exam.questions.map(q => ({id: q.id, text: q.text, expected: q.expectedAnswer})))}` },
        { inlineData: { mimeType: 'image/jpeg', data: submission.base64Data } }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("Kağıt analizi yapılamadı.");
    
    const results: GradingResult[] = JSON.parse(text);
    const totalScore = results.reduce((acc, curr) => acc + (curr.score || 0), 0);

    return { results, totalScore };
  } catch (error: any) {
    console.error("Grading Error:", error);
    throw new Error("Kağıt analizi sırasında bir hata oluştu.");
  }
};