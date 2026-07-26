import { 
  ChatSession, 
  ChatMessage, 
  MemoryItem, 
  DocumentItem, 
  Workflow, 
  UserProfile, 
  VoiceConfig,
  AnalyticsData,
  AuditLogItem
} from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  async getUser(): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, using fallback state', e);
    }
    return {
      id: 'usr_01',
      name: 'Nexus Admin',
      email: 'aitzazxwd@gmail.com',
      role: 'admin',
      preferences: {
        theme: 'dark',
        language: 'Urdu',
        voiceModel: 'gemini-3.1-flash-live-preview',
        autoSpeech: true,
        reasoningDefault: true,
      }
    };
  },

  // Sessions & History
  async getSessions(): Promise<ChatSession[]> {
    try {
      const res = await fetch(`${API_BASE}/chat/sessions`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Failed to fetch sessions from API', e);
    }
    return [];
  },

  async createSession(title: string, model: string = 'gemini-3.6-flash'): Promise<ChatSession> {
    const res = await fetch(`${API_BASE}/chat/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, model })
    });
    if (!res.ok) throw new Error('Failed to create chat session');
    return await res.json();
  },

  async deleteSession(sessionId: string): Promise<void> {
    await fetch(`${API_BASE}/chat/sessions/${sessionId}`, { method: 'DELETE' });
  },

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const res = await fetch(`${API_BASE}/chat/sessions/${sessionId}/messages`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Failed to fetch messages', e);
    }
    return [];
  },

  // Streaming Chat Request
  async sendMessageStream(
    sessionId: string, 
    content: string, 
    options: {
      reasoningEnabled?: boolean;
      ragEnabled?: boolean;
      language?: 'en' | 'ur' | 'hi';
      model?: string;
    },
    onChunk: (text: string, reasoning?: string) => void
  ): Promise<{ fullText: string; reasoningText?: string; memoriesUsed?: string[]; documentsUsed?: string[] }> {
    const response = await fetch(`${API_BASE}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        content,
        reasoningEnabled: options.reasoningEnabled,
        ragEnabled: options.ragEnabled,
        language: options.language || 'en',
        model: options.model || 'gemini-3.6-flash'
      })
    });

    if (!response.ok) {
      throw new Error(`API Chat error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let reasoningText = '';
    let memoriesUsed: string[] = [];
    let documentsUsed: string[] = [];

    if (reader) {
      let done = false;
      let buffer = '';
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const rawJson = line.replace('data: ', '').trim();
              if (rawJson === '[DONE]') break;
              try {
                const parsed = JSON.parse(rawJson);
                if (parsed.text) {
                  fullText += parsed.text;
                  onChunk(fullText, reasoningText);
                }
                if (parsed.reasoning) {
                  reasoningText += parsed.reasoning;
                  onChunk(fullText, reasoningText);
                }
                if (parsed.memories) memoriesUsed = parsed.memories;
                if (parsed.documents) documentsUsed = parsed.documents;
              } catch (err) {
                // Ignore chunk parse errors
              }
            }
          }
        }
      }
    }

    return { fullText, reasoningText, memoriesUsed, documentsUsed };
  },

  // Memory Management
  async getMemories(): Promise<MemoryItem[]> {
    try {
      const res = await fetch(`${API_BASE}/memory`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Memory fetch fallback', e);
    }
    return [];
  },

  async addMemory(memory: Omit<MemoryItem, 'id' | 'createdAt'>): Promise<MemoryItem> {
    const res = await fetch(`${API_BASE}/memory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memory)
    });
    return await res.json();
  },

  async togglePinMemory(id: string, isPinned: boolean): Promise<void> {
    await fetch(`${API_BASE}/memory/${id}/pin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPinned })
    });
  },

  async deleteMemory(id: string): Promise<void> {
    await fetch(`${API_BASE}/memory/${id}`, { method: 'DELETE' });
  },

  // Knowledge Base (RAG)
  async getDocuments(): Promise<DocumentItem[]> {
    try {
      const res = await fetch(`${API_BASE}/knowledge`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Knowledge fetch fallback', e);
    }
    return [];
  },

  async uploadDocument(formData: FormData): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });
    return await res.json();
  },

  async deleteDocument(id: string): Promise<void> {
    await fetch(`${API_BASE}/knowledge/${id}`, { method: 'DELETE' });
  },

  async searchKnowledge(query: string): Promise<{ text: string; source: string; score: number }[]> {
    const res = await fetch(`${API_BASE}/knowledge/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!res.ok) return [];
    return await res.json();
  },

  // TTS / Voice Speech Generation
  async generateSpeech(text: string, language: 'Urdu' | 'English' | 'Hindi' = 'Urdu'): Promise<string> {
    const res = await fetch(`${API_BASE}/voice/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language })
    });
    const data = await res.json();
    return data.audioUrl;
  },

  // Workflows (n8n Automation)
  async getWorkflows(): Promise<Workflow[]> {
    try {
      const res = await fetch(`${API_BASE}/workflow`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Workflow fetch fallback', e);
    }
    return [];
  },

  async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    const res = await fetch(`${API_BASE}/workflow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow)
    });
    return await res.json();
  },

  async triggerWorkflow(id: string): Promise<{ success: boolean; result: any }> {
    const res = await fetch(`${API_BASE}/workflow/${id}/trigger`, { method: 'POST' });
    return await res.json();
  },

  // Analytics & Admin
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Analytics fetch fallback', e);
    }
    return {
      totalTokens: 1482090,
      promptTokens: 890120,
      completionTokens: 591970,
      totalCostUSD: 2.14,
      activeSessionsCount: 18,
      vectorSearchesCount: 432,
      memoryItemsCount: 34,
      dailyUsage: [
        { date: 'Mon', tokens: 180000, cost: 0.25, requests: 42 },
        { date: 'Tue', tokens: 230000, cost: 0.32, requests: 68 },
        { date: 'Wed', tokens: 310000, cost: 0.44, requests: 95 },
        { date: 'Thu', tokens: 280000, cost: 0.39, requests: 82 },
        { date: 'Fri', tokens: 420000, cost: 0.61, requests: 120 },
        { date: 'Sat', tokens: 290000, cost: 0.41, requests: 74 },
        { date: 'Sun', tokens: 350000, cost: 0.49, requests: 88 },
      ],
      modelBreakdown: [
        { name: 'Gemini 2.5 Flash', percentage: 65 },
        { name: 'Gemini 2.5 Pro', percentage: 25 },
        { name: 'Gemini Native Live Audio', percentage: 10 }
      ]
    };
  },

  async getAuditLogs(): Promise<AuditLogItem[]> {
    try {
      const res = await fetch(`${API_BASE}/admin/audit-logs`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Audit logs fallback', e);
    }
    return [];
  }
};
