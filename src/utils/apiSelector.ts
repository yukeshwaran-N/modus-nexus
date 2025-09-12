import { callGroqAPI, GroqMessage } from './groqApi';
import { callGeminiAPI, GeminiMessage } from './geminiApi';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function callAppropriateAPI(
  messages: ChatMessage[], 
  criminalData: any
): Promise<string> {
  const lastUserMessage = messages.filter(msg => msg.role === 'user').pop()?.content || '';
  
  // Determine which API to use based on query type
  const useGemini = shouldUseGemini(lastUserMessage);
  
  try {
    if (useGemini) {
      // Convert to Gemini format
      const geminiMessages: GeminiMessage[] = messages.map(msg => ({
        role: msg.role === 'system' ? 'system' : (msg.role === 'user' ? 'user' : 'model'),
        parts: [{ text: msg.content }]
      }));
      
      return await callGeminiAPI(geminiMessages, criminalData);
    } else {
      // Use Groq
      return await callGroqAPI(messages as GroqMessage[]);
    }
  } catch (error) {
    // Fallback to the other API if one fails
    console.warn(`Primary API failed, trying fallback: ${error}`);
    
    if (useGemini) {
      return await callGroqAPI(messages as GroqMessage[]);
    } else {
      const geminiMessages: GeminiMessage[] = messages.map(msg => ({
        role: msg.role === 'system' ? 'system' : (msg.role === 'user' ? 'user' : 'model'),
        parts: [{ text: msg.content }]
      }));
      return await callGeminiAPI(geminiMessages, criminalData);
    }
  }
}

function shouldUseGemini(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  
  // Use Gemini for complex analysis, summaries, legal reasoning
  const geminiKeywords = [
    'analyze', 'analysis', 'summary', 'summarize', 'report', 
    'legal', 'reasoning', 'pattern', 'trend', 'predict',
    'comprehensive', 'detailed', 'investigation', 'case study',
    'modus operandi', 'risk assessment', 'strategy', 'recommendation'
  ];
  
  // Use Groq for quick questions, FAQs, simple queries
  const groqKeywords = [
    'what is', 'how to', 'explain', 'define', 'quick',
    'simple', 'faq', 'help', 'guide', 'steps',
    'list', 'examples', 'basics', 'overview'
  ];
  
  const geminiScore = geminiKeywords.filter(keyword => lowerQuery.includes(keyword)).length;
  const groqScore = groqKeywords.filter(keyword => lowerQuery.includes(keyword)).length;
  
  // Also use Gemini for longer queries (more comprehensive)
  const wordCount = query.split(' ').length;
  
  if (wordCount > 20) return true; // Longer queries → Gemini
  if (geminiScore > groqScore) return true;
  if (geminiScore === 0 && groqScore === 0) {
    // Default to Groq for very short queries, Gemini for others
    return wordCount > 8;
  }
  
  return false;
}