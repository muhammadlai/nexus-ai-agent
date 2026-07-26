import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatArea } from './components/Chat/ChatArea';
import { KnowledgeBase } from './components/Knowledge/KnowledgeBase';
import { MemoryManager } from './components/Memory/MemoryManager';
import { VoicePanel } from './components/Voice/VoicePanel';
import { AvatarStage } from './components/Avatar/AvatarStage';
import { WorkflowBuilder } from './components/Workflows/WorkflowBuilder';
import { PromptLibrary } from './components/Prompts/PromptLibrary';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';
import { AdminPanel } from './components/Admin/AdminPanel';
import { SettingsModal } from './components/Settings/SettingsModal';

import { api } from './services/api';
import { 
  NavigationTab, 
  ChatSession, 
  ChatMessage, 
  MemoryItem, 
  DocumentItem, 
  Workflow, 
  UserProfile, 
  VoiceConfig, 
  AvatarState,
  AnalyticsData,
  AuditLogItem
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('chat');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // App Settings & Controls
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.6-flash');
  const [reasoningEnabled, setReasoningEnabled] = useState<boolean>(true);
  const [ragEnabled, setRagEnabled] = useState<boolean>(true);
  const [voiceActive, setVoiceActive] = useState<boolean>(false);
  const [language, setLanguage] = useState<'Urdu' | 'English' | 'Hindi'>('Urdu');

  // User Profile
  const [user, setUser] = useState<UserProfile>({
    id: 'usr_nexus_01',
    name: 'Aitzaz (Nexus Creator)',
    email: 'aitzazxwd@gmail.com',
    role: 'admin',
    preferences: {
      theme: 'dark',
      language: 'Urdu',
      voiceModel: 'gemini-3.1-flash-live-preview',
      autoSpeech: true,
      reasoningDefault: true
    }
  });

  // State Stores
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalTokens: 1482090,
    promptTokens: 890120,
    completionTokens: 591970,
    totalCostUSD: 2.14,
    activeSessionsCount: 2,
    vectorSearchesCount: 432,
    memoryItemsCount: 3,
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
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  // Streaming State
  const [isStreaming, setIsStreaming] = useState(false);

  // Voice & Avatar State
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>({
    language: 'Urdu',
    voiceName: 'Kore',
    speechRate: 1.0,
    pitch: 1.0,
    autoSpeakUrduReplies: true,
    echoCancellation: true,
    noiseSuppression: true,
    interruptionThreshold: 45
  });

  const [avatarState, setAvatarState] = useState<AvatarState>({
    emotion: 'focused',
    isSpeaking: false,
    isListening: true,
    isThinking: false,
    lipSyncValue: 0.1,
    rotationY: 0,
    modelUrl: '/avatars/nexus.glb'
  });

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const u = await api.getUser();
      setUser(u);

      const sess = await api.getSessions();
      setSessions(sess);
      if (sess.length > 0) {
        setActiveSessionId(sess[0].id);
        const msgs = await api.getMessages(sess[0].id);
        setMessages(msgs);
      }

      const mems = await api.getMemories();
      setMemories(mems);

      const docs = await api.getDocuments();
      setDocuments(docs);

      const wfs = await api.getWorkflows();
      setWorkflows(wfs);

      const logs = await api.getAuditLogs();
      setAuditLogs(logs);

      const stats = await api.getAnalytics();
      setAnalytics(stats);
    }
    loadData();
  }, []);

  // Session select handler
  const handleSelectSession = async (id: string) => {
    setActiveSessionId(id);
    const msgs = await api.getMessages(id);
    setMessages(msgs);
  };

  // Create new session
  const handleCreateNewChat = async () => {
    const newSess = await api.createSession('New Creation Session', selectedModel);
    setSessions(prev => [newSess, ...prev]);
    setActiveSessionId(newSess.id);
    setMessages([]);
    setActiveTab('chat');
  };

  // Delete session
  const handleDeleteSession = async (id: string) => {
    await api.deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      const remaining = sessions.filter(s => s.id !== id);
      if (remaining.length > 0) {
        handleSelectSession(remaining[0].id);
      } else {
        setActiveSessionId(null);
        setMessages([]);
      }
    }
  };

  // Play Speech (Urdu or English)
  const handlePlaySpeech = async (text: string) => {
    setAvatarState(prev => ({ ...prev, isSpeaking: true, emotion: 'speaking' }));
    try {
      const audioUrl = await api.generateSpeech(text, language);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
        audio.onended = () => {
          setAvatarState(prev => ({ ...prev, isSpeaking: false, emotion: 'focused' }));
        };
      } else {
        // Speech Synthesis API fallback
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text.replace(/[*#`_]/g, ''));
          utterance.lang = language === 'Urdu' ? 'ur-PK' : 'en-US';
          window.speechSynthesis.speak(utterance);
          utterance.onend = () => {
            setAvatarState(prev => ({ ...prev, isSpeaking: false, emotion: 'focused' }));
          };
        }
      }
    } catch (e) {
      setAvatarState(prev => ({ ...prev, isSpeaking: false, emotion: 'focused' }));
    }
  };

  // Send Message (Streaming)
  const handleSendMessage = async (content: string) => {
    if (!activeSessionId) {
      const newSess = await api.createSession(content.slice(0, 30), selectedModel);
      setSessions(prev => [newSess, ...prev]);
      setActiveSessionId(newSess.id);
      await sendToSession(newSess.id, content);
    } else {
      await sendToSession(activeSessionId, content);
    }
  };

  const sendToSession = async (sessionId: string, content: string) => {
    const userMsgId = `msg_${Date.now()}_u`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sessionId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      language: language === 'Urdu' ? 'ur' : 'en'
    };

    const assistantMsgId = `msg_${Date.now()}_a`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      sessionId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg, initialAssistantMsg]);
    setIsStreaming(true);
    setAvatarState(prev => ({ ...prev, isThinking: true, emotion: 'thinking' }));

    try {
      const { fullText, reasoningText, memoriesUsed, documentsUsed } = await api.sendMessageStream(
        sessionId,
        content,
        {
          reasoningEnabled,
          ragEnabled,
          language: language === 'Urdu' ? 'ur' : 'en',
          model: selectedModel
        },
        (currentText, currentReasoning) => {
          setMessages(prev => prev.map(m => {
            if (m.id === assistantMsgId) {
              return {
                ...m,
                content: currentText,
                reasoningText: currentReasoning
              };
            }
            return m;
          }));
        }
      );

      // Finalize Message
      setMessages(prev => prev.map(m => {
        if (m.id === assistantMsgId) {
          return {
            ...m,
            content: fullText,
            reasoningText,
            memoriesRetrieved: memoriesUsed,
            documentsReferenced: documentsUsed
          };
        }
        return m;
      }));

      // Speak Urdu response if enabled
      if (voiceConfig.autoSpeakUrduReplies || language === 'Urdu') {
        handlePlaySpeech(fullText);
      } else {
        setAvatarState(prev => ({ ...prev, isThinking: false, emotion: 'focused' }));
      }

    } catch (err) {
      console.error('Error sending message', err);
      setMessages(prev => prev.map(m => {
        if (m.id === assistantMsgId) {
          return {
            ...m,
            content: 'An error occurred while streaming response from Nexus Gemini 2.5 API.',
            status: 'error'
          };
        }
        return m;
      }));
    } finally {
      setIsStreaming(false);
    }
  };

  // Memory operations
  const handleAddMemory = async (mem: Omit<MemoryItem, 'id' | 'createdAt'>) => {
    const created = await api.addMemory(mem);
    setMemories(prev => [created, ...prev]);
  };

  const handleTogglePinMemory = async (id: string, isPinned: boolean) => {
    await api.togglePinMemory(id, isPinned);
    setMemories(prev => prev.map(m => m.id === id ? { ...m, isPinned } : m));
  };

  const handleDeleteMemory = async (id: string) => {
    await api.deleteMemory(id);
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  // Knowledge Base operations
  const handleUploadDocument = async (file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    const newDoc = await api.uploadDocument(formData);
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleDeleteDocument = async (id: string) => {
    await api.deleteDocument(id);
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleSearchKnowledge = async (query: string) => {
    return await api.searchKnowledge(query);
  };

  // Workflow operations
  const handleCreateWorkflow = async (wf: Partial<Workflow>) => {
    const newWf = await api.createWorkflow(wf);
    setWorkflows(prev => [newWf, ...prev]);
  };

  const handleTriggerWorkflow = async (id: string) => {
    return await api.triggerWorkflow(id);
  };

  const activeSessionTitle = sessions.find(s => s.id === activeSessionId)?.title || 'Nexus AI Workspace';

  return (
    <div className="flex h-screen bg-neutral-950 font-sans antialiased text-neutral-100 overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onCreateNewChat={handleCreateNewChat}
        onDeleteSession={handleDeleteSession}
        user={user}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Bar */}
        <Header
          activeTab={activeTab}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          reasoningEnabled={reasoningEnabled}
          setReasoningEnabled={setReasoningEnabled}
          ragEnabled={ragEnabled}
          setRagEnabled={setRagEnabled}
          voiceActive={voiceActive}
          setVoiceActive={setVoiceActive}
          language={language}
          setLanguage={setLanguage}
        />

        {/* View Router */}
        <main className="flex-1 flex overflow-hidden">
          {activeTab === 'chat' && (
            <ChatArea
              messages={messages}
              onSendMessage={handleSendMessage}
              isStreaming={isStreaming}
              onStopGeneration={() => setIsStreaming(false)}
              onRegenerate={() => {
                const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
                if (lastUserMsg) handleSendMessage(lastUserMsg.content);
              }}
              reasoningEnabled={reasoningEnabled}
              ragEnabled={ragEnabled}
              language={language}
              onPlaySpeech={handlePlaySpeech}
              activeSessionTitle={activeSessionTitle}
            />
          )}

          {activeTab === 'knowledge' && (
            <KnowledgeBase
              documents={documents}
              onUploadDocument={handleUploadDocument}
              onDeleteDocument={handleDeleteDocument}
              onSearchKnowledge={handleSearchKnowledge}
            />
          )}

          {activeTab === 'memory' && (
            <MemoryManager
              memories={memories}
              onAddMemory={handleAddMemory}
              onTogglePinMemory={handleTogglePinMemory}
              onDeleteMemory={handleDeleteMemory}
            />
          )}

          {activeTab === 'voice' && (
            <VoicePanel
              voiceConfig={voiceConfig}
              setVoiceConfig={setVoiceConfig}
              onTestSpeech={handlePlaySpeech}
            />
          )}

          {activeTab === 'avatar' && (
            <AvatarStage
              avatarState={avatarState}
              setAvatarState={setAvatarState}
            />
          )}

          {activeTab === 'workflows' && (
            <WorkflowBuilder
              workflows={workflows}
              onCreateWorkflow={handleCreateWorkflow}
              onTriggerWorkflow={handleTriggerWorkflow}
            />
          )}

          {activeTab === 'prompts' && (
            <PromptLibrary
              onSelectPrompt={(pText) => {
                setActiveTab('chat');
                handleSendMessage(pText);
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard analytics={analytics} />
          )}

          {activeTab === 'admin' && (
            <AdminPanel logs={auditLogs} />
          )}

          {activeTab === 'settings' && (
            <SettingsModal
              user={user}
              setUser={setUser}
              reasoningEnabled={reasoningEnabled}
              setReasoningEnabled={setReasoningEnabled}
              language={language}
              setLanguage={setLanguage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
