import axios from 'axios';

const API_BASE_URL = 'https://gen-email-agent-ai.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface EmailGenerationData {
  purpose: string;
  recipient_info: string;
  sender_name: string;
  tone: string;
  subject: string;
  key_points: string;
  context: string;
  actions: string;
  attachments: string;
  length: string;
}

export interface EmailAnalysisData {
  original_email: string;
  tone?: string;
  user_name?: string;
  additional_context?: string;
}

export const emailService = {
  generateEmail: async (data: EmailGenerationData) => {
    try {
      const response = await api.post('/generate-email', data);
      return response.data;
    } catch (error) {
      console.error('Error generating email:', error);
      throw error;
    }
  },

  paraphraseText: async (text: string, tone: string = 'neutral') => {
    try {
      const response = await api.post('/paraphrase', { text, tone });
      return response.data;
    } catch (error) {
      console.error('Error paraphrasing text:', error);
      throw error;
    }
  },

  analyzeAndReply: async (data: EmailAnalysisData) => {
    try {
      const response = await api.post('/analyze-and-reply', data);
      return response.data;
    } catch (error) {
      console.error('Error analyzing email:', error);
      throw error;
    }
  },
}; 