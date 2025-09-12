import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyD16-KMaL1Mf0Rilo80fNAkg6j6was6_kM';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface GeminiMessage {
  role: 'user' | 'model' | 'system';
  parts: { text: string }[];
}

export async function callGeminiAPI(messages: GeminiMessage[], criminalData?: any): Promise<string> {
  try {
    // Filter out system messages and format for Gemini
    const filteredMessages = messages.filter(msg => msg.role !== 'system');
    
    // Get the last user message as the main prompt
    const lastUserMessage = filteredMessages.filter(msg => msg.role === 'user').pop();
    
    if (!lastUserMessage) {
      throw new Error('No user message found');
    }

    // Create the full prompt with context
    const systemPrompt = `You are a crime data analysis assistant for Tamil Nadu Police. You help analyze criminal patterns, 
    provide insights on criminal behavior, and assist with crime investigation. Be professional, concise, and factual.
    
    ${criminalData ? `
    Current criminal being analyzed:
    - Name: ${criminalData.name || 'Unknown'}
    - Case ID: ${criminalData.case_id || 'Unknown'}
    - Crime Type: ${criminalData.crime_type || 'Unknown'}
    - Status: ${criminalData.current_status || 'Unknown'}
    - Risk Level: ${criminalData.risk_level || 'Unknown'}
    - Location: ${criminalData.last_location || 'Unknown'}
    ${criminalData.modus_operandi ? `- Modus Operandi: ${criminalData.modus_operandi}` : ''}
    ${criminalData.total_cases ? `- Total Cases: ${criminalData.total_cases}` : ''}
    ${criminalData.age ? `- Age: ${criminalData.age}` : ''}
    ${criminalData.gender ? `- Gender: ${criminalData.gender}` : ''}
    ` : ''}
    
    Important: Always refer to criminals by their decrypted names if available.`;

    const fullPrompt = `${systemPrompt}\n\nUser query: ${lastUserMessage.parts[0].text}`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}