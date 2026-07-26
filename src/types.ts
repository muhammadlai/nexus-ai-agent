export type NavigationTab = 
  | 'chat'
  | 'knowledge'
  | 'memory'
  | 'voice'
  | 'avatar'
  | 'workflows'
  | 'prompts'
  | 'analytics'
  | 'admin'
  | 'settings';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'developer';
  avatarUrl?: string;
  preferences: {
    theme: 'dark' | 'midnight' | 'cyberpunk';
    language: 'English' | 'Urdu' | 'Hindi' | 'Multilingual';
    voiceModel: string;
    autoSpeech: boolean;
    reasoningDefault: boolean;
  };
}

export interface MemoryItem {
  id: string;
  category: 'preference' | 'project' | 'goal' | 'file_summary' | 'custom_instruction' | 'fact';
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  relevanceScore?: number;
}

export interface DocumentItem {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'md' | 'csv' | 'image';
  size: number;
  uploadedAt: string;
  chunksCount: number;
  vectorId: string;
  status: 'processing' | 'indexed' | 'failed';
  summary?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoningText?: string;
  reasoningTimeMs?: number;
  timestamp: string;
  memoriesRetrieved?: string[];
  documentsReferenced?: string[];
  audioUrl?: string;
  status?: 'sending' | 'streaming' | 'complete' | 'error';
  language?: 'en' | 'ur' | 'hi';
}

export interface ChatSession {
  id: string;
  title: string;
  folderId?: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  model: string;
  reasoningEnabled: boolean;
  ragEnabled: boolean;
  systemInstruction?: string;
}

export interface ChatFolder {
  id: string;
  name: string;
  color?: string;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'gemini_agent' | 'http_request' | 'n8n_webhook' | 'schedule' | 'memory_lookup' | 'slack_notify';
  label: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface WorkflowConnection {
  id: string;
  fromId: string;
  toId: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'paused';
  triggerType: 'webhook' | 'schedule' | 'manual' | 'event';
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  lastRunAt?: string;
  runCount: number;
}

export interface AvatarState {
  emotion: 'neutral' | 'happy' | 'focused' | 'thinking' | 'speaking' | 'listening';
  isSpeaking: boolean;
  isListening: boolean;
  isThinking: boolean;
  lipSyncValue: number;
  rotationY: number;
  modelUrl: string;
}

export interface VoiceConfig {
  language: 'Urdu' | 'English' | 'Hindi' | 'Auto';
  voiceName: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  speechRate: number;
  pitch: number;
  autoSpeakUrduReplies: boolean;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  interruptionThreshold: number;
}

export interface AnalyticsData {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  totalCostUSD: number;
  activeSessionsCount: number;
  vectorSearchesCount: number;
  memoryItemsCount: number;
  dailyUsage: { date: string; tokens: number; cost: number; requests: number }[];
  modelBreakdown: { name: string; percentage: number }[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ip: string;
  status: 'success' | 'warning' | 'error';
}
