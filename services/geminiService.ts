
import { GoogleGenAI, Type } from "@google/genai";
import { Exam, GradingResult, StudentSubmission, Question, FeedbackTone } from "../types";

export const generateQuestions = async (
  grade: string,
  course: string,
  outcome: string,
  difficulty: string,
  count: number = 3
): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    ZORLUK SEVİYESİ: ${difficulty}
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

    if (!response.text) {
      throw new Error("Yapay zeka yanıt üretemedi.");
    }

    const questions: any[] = JSON.parse(response.text);
    return questions.map((q, i) => ({
      ...q,
      id: `gen-${Date.now()}-${i}`
    }));
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "AI servisi şu an yanıt veremiyor.");
  }
};

export const gradeSubmission = async (
  exam: Exam,
  submission: StudentSubmission,
  tone: FeedbackTone = 'encouraging'
): Promise<{ results: GradingResult[]; totalScore: number }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    1. OCR: Görüntüdeki el yazısını hata payını minimize ederek dijital metne dök.
    2. ANLAM ANALİZİ: Öğrencinin yanıtını kelime kelime değil, rubrikteki anlamsal karşılığına göre değerlendir.
    3. RUBRİK ÖNCELİĞİ: Öğretmenin tanımladığı "gradingSteps" (puanlama anahtarı) senin ana kılavuzundur.
    4. GÜVEN SKORU: El yazısı okuma kalitene göre 0.0 ile 1.0 arasında bir confidence (güven) değeri ver.
    
    Yanıtı mutlaka JSON formatında döndür.
  `;

  const prompt = `
    SINAV: ${exam.courseName} (${exam.examName})
    SORULAR VE PUANLAMA ANAHTARI:
    ${exam.questions.map(q => `
      - ID: ${q.id}
      - SORU: ${q.text}
      - BEKLENEN CEVAP: ${q.expectedAnswer}
      - RUBRİK: ${q.gradingSteps?.map(s => `${s.text} (${s.score} Puan)`).join(' | ')}
    `).join('\n')}

    ÖĞRENCİ: ${submission.studentName}
    Yanıt Şeması (JSON Array):
    [{ "questionId": "string", "extractedText": "string", "score": number, "reason": "Neden bu puanı verdin?", "feedback": "Öğrenciye özel mesaj", "confidence": 0.95 }]
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/jpeg', data: submission.base64Data } },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("Okuma işlemi başarısız oldu.");
    }

    const results: GradingResult[] = JSON.parse(response.text);
    const totalScore = results.reduce((acc, curr) => acc + curr.score, 0);

    return { results, totalScore };
  } catch (error: any) {
    console.error("Gemini Grading Error:", error);
    throw new Error(error.message || "Kağıt analiz edilemedi.");
  }
};
