// src/utils/groqApi.ts
export interface GroqMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }
  
  export interface GroqResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
      index: number;
      message: GroqMessage;
      finish_reason: string;
    }>;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }
  
  export const callGroqAPI = async (messages: GroqMessage[]): Promise<string> => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1024
        })
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Error calling Groq API:', error);
      return 'I apologize, but I encountered an error while processing your request. Please try again.';
    }
  };