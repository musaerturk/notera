
import { GoogleGenAI, Type } from "@google/genai";
import { Exam, GradingResult, StudentSubmission, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateQuestions = async (
  grade: string,
  course: string,
  outcome: string,
  difficulty: string,
  count: number = 3
): Promise<Question[]> => {
  const model = 'gemini-3-pro-preview';
  
  const systemInstruction = `
    Sen uzman bir eğitim teknolojileri uzmanı ve ölçme değerlendirme profesörüsün. 
    Verilen sınıf, ders, kazanım ve ZORLUK SEVİYESİNE uygun olarak profesyonel açık uçlu sınav soruları hazırlarsın.
    
    ZORLUK SEVİYESİ REHBERİ:
    - Çok Basit: Hatırlama düzeyinde, doğrudan bilgi sorgulayan sorular.
    - Basit: Kavrama düzeyinde, tanım ve temel örnekleme içeren sorular.
    - Orta: Uygulama düzeyinde, bilgiyi yeni bir durumda kullanma soruları.
    - Orta Üst: Analiz düzeyinde, parçalar arası ilişki kurma soruları.
    - Olması Gereken: Kazanımın gerektirdiği tüm bilişsel basamakları kapsayan ideal sınav sorusu.

    KURALLAR:
    1. Her soru için ideal bir cevap (expectedAnswer) oluştur.
    2. Soruda mutlaka olması gereken anahtar kelimeleri (keywords) belirle.
    3. Her soru için basamaklı bir puanlama rubriği (gradingSteps) hazırla.
    4. Sorular pedagojik açıdan net ve anlaşılır olmalıdır.
    5. JSON formatında bir liste döndür.
  `;

  const prompt = `
    DERS: ${course}
    SINIF DÜZEYİ: ${grade}
    ZORLUK SEVİYESİ: ${difficulty}
    KAZANIM / ÖĞRENME ÇIKTISI: "${outcome}"
    İSTENEN SORU SAYISI: ${count}

    Lütfen bu bilgiler ışığında, tam olarak "${difficulty}" zorluk seviyesinde profesyonel sınav soruları hazırla.
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

    const questions: any[] = JSON.parse(response.text || "[]");
    return questions.map((q, i) => ({
      ...q,
      id: `gen-${Date.now()}-${i}`
    }));
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const gradeSubmission = async (
  exam: Exam,
  submission: StudentSubmission
): Promise<{ results: GradingResult[]; totalScore: number }> => {
  const model = 'gemini-3-flash-preview';
  const isMultipleChoice = exam.type === 'multiple-choice';
  
  const systemInstruction = `
    Sen uzman bir kıdemli öğretmensin. Görevin, sınav kağıdını titizlikle analiz etmektir.
    
    ${isMultipleChoice ? `
    TEST ANALİZ KURALLARI:
    1. Seçeneği tespit et.
    2. Doğruysa tam puan, değilse 0 ver.
    ` : `
    YAZILI ANALİZ KURALLARI:
    1. OCR: El yazısını metne dök.
    2. RUBRİK ÖNCELİĞİ: Öğretmenin tanımladığı "PUANLAMA BASAMAKLARI" (gradingSteps) senin ana kılavuzundur. Öğrencinin yanıtı bu basamaklardan hangisine en yakınsa o basamağın puanını ver.
    3. GEREKÇE: Neden o basamağı seçtiğini 'reason' alanında açıkla.
    4. GERİ BİLDİRİM: Öğrenciye gelişim önerisi ver.
    `}
    
    Kesinlikle JSON formatında yanıt ver.
  `;

  const prompt = `
    SINAV: ${exam.courseName} - ${exam.examName}

    SORULAR VE RUBRİK:
    ${exam.questions.map(q => `
      - ID: ${q.id}
      - SORU: ${q.text}
      - İDEAL CEVAP: ${q.expectedAnswer}
      ${!isMultipleChoice ? `- RUBRİK BASAMAKLARI: ${q.gradingSteps?.map(s => `${s.text} -> ${s.score} Puan`).join(' | ')}` : ''}
      - MAX PUAN: ${q.maxScore}
    `).join('\n')}

    ÖĞRENCİ: ${submission.studentName}
    (Görüntü ektedir.)

    Yanıt Şeması:
    [{ "questionId": "string", "extractedText": "string", "score": number, "reason": "Öğretmenin rubriğine göre gerekçe", "feedback": "Öğrenci notu", "confidence": number }]
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: submission.base64Data,
            },
          },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const results: GradingResult[] = JSON.parse(response.text || "[]");
    const totalScore = results.reduce((acc, curr) => acc + curr.score, 0);

    return { results, totalScore };
  } catch (error) {
    console.error("Gemini Grading Error:", error);
    throw error;
  }
};
