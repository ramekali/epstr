
import { GoogleGenAI, Type } from "@google/genai";

export async function generateObjectives(
  gradeName: string,
  finalCompetence: string,
  knowledgeResource: string,
  overallCompetence: string
): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    أنت خبير في المناهج التربوية الجزائرية (2023) لمادة التربية البدنية والرياضية للطور الابتدائي.
    بناءً على المعطيات التالية:
    - المستوى: ${gradeName}
    - الكفاءة الختامية: ${finalCompetence}
    - المورد المعرفي: ${knowledgeResource}
    - الكفاءة الشاملة للمستوى: ${overallCompetence}

    المطلوب: توليد 20 هدفاً تعلمياً تتبع قاعدة (SMART) وتصاغ وفق الهيكل التالي بالضبط:
    (أن + فعل إجرائي قابل للقياس + المتعلم + المورد + معيار الأداء أو شرطه).

    شروط هامة:
    1. تجنب الأفعال الغامضة مثل (يفهم، يعرف، يدرك).
    2. استخدم أفعال حركية إجرائية مثل (يؤدي، ينجز، يرمي، يربط، يحافظ، يقفز، ينسق).
    3. يجب أن تكون الأهداف ملائمة جداً للمستوى العمري والبدني لتلاميذ ${gradeName}.
    4. يجب أن تغطي الأهداف جوانب تقنية، تنظيمية، وأخلاقية مرتبطة بالمورد.
    5. الالتزام بصيغة: أن + فعل + المتعلم + المورد + المعيار.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          objectives: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "قائمة تضم 20 هدفاً تعلمياً"
          }
        },
        required: ["objectives"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data.objectives || [];
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    return [];
  }
}
