// src/components/Chatbot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { callGroqAPI, GroqMessage } from '../utils/groqApi';
import { callGeminiAPI, GeminiMessage } from '../utils/geminiApi';
import { formatText } from '../utils/textFormatter';
import { decryptValue, isEncrypted } from '../utils/encryptionUtils';
import './Chatbot.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  apiUsed?: 'gemini' | 'groq';
}

interface CriminalRecord {
  id: string;
  case_id: string;
  name: string;
  age?: number;
  gender?: string;
  phone_number?: string;
  email?: string;
  crime_type: string;
  last_location: string;
  current_status?: string;
  risk_level?: string;
  total_cases?: number;
  arrest_date?: string;
  modus_operandi?: string;
  tools_used?: string;
  associates?: string;
  address?: string;
  [key: string]: any;
}

interface ChatbotProps {
  setActiveView?: (view: string) => void;
  initialMessage?: string;
  criminalData?: CriminalRecord | null;
  onClose?: () => void;
}

// Helper function to decrypt criminal data fields
const decryptCriminalData = (data: CriminalRecord | null): CriminalRecord | null => {
  if (!data) return null;
  
  const decrypted = { ...data };
  
  // List of fields that might be encrypted
  const encryptedFields = [
    'name', 'phone_number', 'email', 'address', 'last_location',
    'modus_operandi', 'tools_used', 'associates'
  ];
  
  encryptedFields.forEach(field => {
    if (decrypted[field] && typeof decrypted[field] === 'string' && isEncrypted(decrypted[field])) {
      decrypted[field] = decryptValue(decrypted[field]);
    }
  });
  
  return decrypted;
};

// Function to determine which API to use
const shouldUseGemini = (query: string): boolean => {
  const lowerQuery = query.toLowerCase();
  
  // Use Gemini for complex analysis, summaries, legal reasoning
  const geminiKeywords = [
    'analyze', 'analysis', 'summary', 'summarize', 'report', 
    'legal', 'reasoning', 'pattern', 'trend', 'predict',
    'comprehensive', 'detailed', 'investigation', 'case study',
    'modus operandi', 'risk assessment', 'strategy', 'recommendation',
    'generate', 'create', 'write', 'draft', 'explain in detail',
    'compare', 'evaluate', 'assess', 'review', 'critique'
  ];
  
  // Use Groq for quick questions, FAQs, simple queries
  const groqKeywords = [
    'what is', 'how to', 'explain', 'define', 'quick',
    'simple', 'faq', 'help', 'guide', 'steps',
    'list', 'examples', 'basics', 'overview', 'short',
    'brief', 'tell me', 'who is', 'when did', 'where is'
  ];
  
  const geminiScore = geminiKeywords.filter(keyword => lowerQuery.includes(keyword)).length;
  const groqScore = groqKeywords.filter(keyword => lowerQuery.includes(keyword)).length;
  
  // Also use Gemini for longer queries (more comprehensive)
  const wordCount = query.split(' ').length;
  
  if (wordCount > 15) return true; // Longer queries → Gemini
  if (geminiScore > groqScore) return true;
  if (geminiScore === 0 && groqScore === 0) {
    // Default to Groq for very short queries, Gemini for others
    return wordCount > 8;
  }
  
  return false;
};

const Chatbot: React.FC<ChatbotProps> = ({ 
  setActiveView, 
  initialMessage = '', 
  criminalData = null, 
  onClose 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Crime Data Assistant. How can I help you with criminal analysis today?",
      sender: 'bot',
      timestamp: new Date(),
      apiUsed: 'groq' // Default first message from Groq
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Decrypt criminal data when component receives it
  const decryptedCriminalData = decryptCriminalData(criminalData);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialMessage) {
      setInputText(initialMessage);
      if (isOpen) {
        setTimeout(() => handleSendMessage(), 500);
      }
    }
  }, [initialMessage, isOpen]);

  const handleSendMessage = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const useGemini = shouldUseGemini(inputText);
      
      // Prepare system prompt
      const systemPrompt = `You are a crime data analysis assistant for Tamil Nadu Police. You help analyze criminal patterns, 
      provide insights on criminal behavior, and assist with crime investigation. Be professional, concise, and factual.
      
      ${decryptedCriminalData ? `
      Current criminal being analyzed:
      - Name: ${decryptedCriminalData.name || 'Unknown'}
      - Case ID: ${decryptedCriminalData.case_id || 'Unknown'}
      - Crime Type: ${decryptedCriminalData.crime_type || 'Unknown'}
      - Status: ${decryptedCriminalData.current_status || 'Unknown'}
      - Risk Level: ${decryptedCriminalData.risk_level || 'Unknown'}
      - Location: ${decryptedCriminalData.last_location || 'Unknown'}
      ${decryptedCriminalData.modus_operandi ? `- Modus Operandi: ${decryptedCriminalData.modus_operandi}` : ''}
      ${decryptedCriminalData.total_cases ? `- Total Cases: ${decryptedCriminalData.total_cases}` : ''}
      ${decryptedCriminalData.age ? `- Age: ${decryptedCriminalData.age}` : ''}
      ${decryptedCriminalData.gender ? `- Gender: ${decryptedCriminalData.gender}` : ''}
      ` : ''}
      
      Important: Always refer to criminals by their decrypted names if available. If you receive encrypted data 
      (starting with U2FsdGVkX1), inform the user that decryption may be needed.`;

      let botResponseText: string;
      let apiUsed: 'gemini' | 'groq' = useGemini ? 'gemini' : 'groq';

      if (useGemini) {
        // Use Gemini API
        const geminiMessages: GeminiMessage[] = [
          {
            role: 'system',
            parts: [{ text: systemPrompt }]
          },
          ...messages.slice(1).map(msg => ({
            role: msg.sender === 'user' ? 'user' as const : 'model' as const,
            parts: [{ text: msg.text }]
          })),
          {
            role: 'user',
            parts: [{ text: inputText }]
          }
        ];

        botResponseText = await callGeminiAPI(geminiMessages, decryptedCriminalData);
      } else {
        // Use Groq API
        const groqMessages: GroqMessage[] = [
          {
            role: 'system',
            content: systemPrompt
          },
          ...messages.slice(1).map(msg => ({
            role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
            content: msg.text
          })),
          {
            role: 'user',
            content: inputText
          }
        ];

        botResponseText = await callGroqAPI(groqMessages);
      }
      
      const botResponse: Message = {
        id: messages.length + 2,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
        apiUsed
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Try fallback API
      try {
        const fallbackApi = shouldUseGemini(inputText) ? 'groq' : 'gemini';
        let fallbackResponse: string;
        
        if (fallbackApi === 'gemini') {
          const geminiMessages: GeminiMessage[] = [
            {
              role: 'user',
              parts: [{ text: inputText }]
            }
          ];
          fallbackResponse = await callGeminiAPI(geminiMessages, decryptedCriminalData);
        } else {
          const groqMessages: GroqMessage[] = [
            {
              role: 'user',
              content: inputText
            }
          ];
          fallbackResponse = await callGroqAPI(groqMessages);
        }
        
        const botResponse: Message = {
          id: messages.length + 2,
          text: fallbackResponse,
          sender: 'bot',
          timestamp: new Date(),
          apiUsed: fallbackApi
        };
        
        setMessages(prev => [...prev, botResponse]);
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        
        const errorResponse: Message = {
          id: messages.length + 2,
          text: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorResponse]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Analyze crime patterns",
    "Explain modus operandi",
    "Risk assessment",
    "Criminal connections",
    "Investigation tips",
    "Generate report"
  ];

  const handleQuickAction = (action: string) => {
    setInputText(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDeleteChat = () => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      setMessages([{
        id: 1,
        text: "Hello! I'm your Crime Data Assistant. How can I help you with criminal analysis today?",
        sender: 'bot',
        timestamp: new Date(),
        apiUsed: 'groq'
      }]);
    }
  };

  const toggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
  };

  return (
    <>
      {/* Chatbot Button */}
      <div 
        className={`chatbot-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`chatbot-window ${isExpanded ? 'expanded' : ''}`}>
          <div className="chatbot-header">
            <div className="chatbot-title">
              <h3>Crime Data Assistant</h3>
              <p>Powered by AI Analysis (Gemini + Groq)</p>
            </div>
            <div className="chatbot-controls">
              <button 
                className="control-btn expand-btn"
                onClick={handleExpand}
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M14 10l6-6M9 21H3v-6M10 14l-6 6"/>
                  </svg>
                )}
              </button>
              <button 
                className="control-btn delete-btn"
                onClick={handleDeleteChat}
                title="Delete Conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
              <button 
                className="control-btn close-btn"
                onClick={handleClose}
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  {formatText(message.text)}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {message.sender === 'bot' && message.apiUsed && (
                    <span className={`api-indicator api-${message.apiUsed}`}>
                      {message.apiUsed.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {showQuickActions && (
            <div className="quick-actions">
              <div className="quick-actions-header">
                <p>Quick analysis options:</p>
                <button 
                  className="toggle-actions-btn"
                  onClick={toggleQuickActions}
                  title="Hide suggestions"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 15l-6-6-6 6"/>
                  </svg>
                </button>
              </div>
              <div className="quick-buttons">
                {quickActions.map((action, index) => (
                  <button 
                    key={index} 
                    className="quick-btn"
                    onClick={() => handleQuickAction(action)}
                    disabled={isLoading}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {!showQuickActions && (
            <div className="quick-actions-collapsed">
              <button 
                className="show-actions-btn"
                onClick={toggleQuickActions}
                title="Show suggestions"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
                Show suggestions
              </button>
            </div>
          )}
          
          <div className="chatbot-input-container">
            <div className="character-count">
              {500 - inputText.length} characters remaining
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about crime patterns, analysis, or investigations..."
                disabled={isLoading}
                maxLength={500}
              />
              <button onClick={handleSendMessage} disabled={isLoading || inputText.trim() === ''}>
                {isLoading ? (
                  <div className="spinner"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;