import { GoogleGenAI, Type } from "@google/genai";
import { Exam, GradingResult, StudentSubmission, Question, FeedbackTone } from "../types";

export const generateQuestions = async (
  grade: string,
  course: string,
  outcome: string,
  difficulty: string,
  count: number = 3
): Promise<Question[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY bulunamadı. Lütfen Netlify ortam değişkenlerini (Environment Variables) kontrol edin.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    Sen dünya standartlarında bir eğitim teknolojileri uzmanı ve ölçme değerlendirme profesörüsün. 
    Verilen sınıf düzeyi, ders adı, öğrenme çıktısı (kazanım) ve zorluk seviyesine tam uyumlu, 
    öğrencinin bilgisini derinlemesine ölçen profesyonel açık uçlu sınav soruları hazırlarsın.
    Sorular MEB müfredatına ve hiyerarşisine uygun olmalıdır.
  `;

  const prompt = `
    DERS: ${course}
    SINIF DÜZEYİ: ${grade}
    ZORLUK SEVİSESİ: ${difficulty}
    KAZANIM / ÖĞRENME ÇIKTISI: "${outcome}"
    İSTENEN SORU SAYISI: ${count}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
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
    console.error("Gemini Servis Hatası:", error);
    throw new Error(error.message || "Sorular oluşturulurken bir teknik hata oluştu.");
  }
};

export const gradeSubmission = async (
  exam: Exam,
  submission: StudentSubmission,
  tone: FeedbackTone = 'encouraging'
): Promise<{ results: GradingResult[]; totalScore: number }> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Anahtarı eksik.");

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  const toneInstruction = {
    encouraging: "Öğrenciyi motive eden, gelişim odaklı, yapıcı ve nazik bir dil kullan.",
    academic: "Resmi, teknik terimlere odaklanan, profesyonel ve akademik standartlarda bir dil kullan.",
    concise: "Sadece hatayı belirten, çok kısa, öz ve net geri bildirim ver."
  }[tone];

  const systemInstruction = `
    Sen uzman bir kıdemli öğretmensin. Görevin, el yazısı sınav kağıtını titizlikle analiz etmektir.
    GERİ BİLDİRİM TONU: ${toneInstruction}
    
    ANALİZ KURALLARI:
    1. OCR: Görüntüdeki el yazısını dijital metne dök.
    2. ANLAM ANALİZİ: Yanıtı rubrikteki anlamsal karşılığına göre değerlendir.
    3. GÜVEN SKORU: El yazısı netliğine göre 0.0-1.0 arası bir puan ver.
    Yanıtı JSON formatında döndür.
  `;

  const prompt = `
    SINAV: ${exam.courseName}
    SORULAR: ${JSON.stringify(exam.questions.map(q => ({ id: q.id, text: q.text, key: q.expectedAnswer })))}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        { text: prompt },
        { inlineData: { mimeType: 'image/jpeg', data: submission.base64Data } }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("Okuma başarısız.");

    const results: GradingResult[] = JSON.parse(text);
    const totalScore = results.reduce((acc, curr) => acc + (curr.score || 0), 0);

    return { results, totalScore };
  } catch (error: any) {
    console.error("Grade Hatası:", error);
    throw new Error("Kağıt analizi hatası: " + error.message);
  }
};