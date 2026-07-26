import React from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Database, 
  Mic, 
  Radio, 
  Search, 
  SlidersHorizontal,
  ChevronDown,
  Globe
} from 'lucide-react';
import { NavigationTab } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  reasoningEnabled: boolean;
  setReasoningEnabled: (r: boolean) => void;
  ragEnabled: boolean;
  setRagEnabled: (r: boolean) => void;
  voiceActive: boolean;
  setVoiceActive: (v: boolean) => void;
  language: 'Urdu' | 'English' | 'Hindi';
  setLanguage: (lang: 'Urdu' | 'English' | 'Hindi') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  selectedModel,
  setSelectedModel,
  reasoningEnabled,
  setReasoningEnabled,
  ragEnabled,
  setRagEnabled,
  voiceActive,
  setVoiceActive,
  language,
  setLanguage
}) => {
  const modelOptions = [
    { id: 'gemini-3.6-flash', label: 'Gemini 2.5 Flash', desc: 'Fast & High Precision' },
    { id: 'gemini-3.1-pro-preview', label: 'Gemini 2.5 Pro (Deep Thought)', desc: 'Complex Logic & Code' },
    { id: 'gemini-3.1-flash-live-preview', label: 'Gemini Live Audio Native', desc: 'Realtime Voice & Urdu Speech' }
  ];

  const getTitleForTab = () => {
    switch (activeTab) {
      case 'chat': return 'AI Workspace & Reasoning';
      case 'knowledge': return 'Knowledge Base (RAG Store)';
      case 'memory': return 'AI Memory Management Engine';
      case 'voice': return 'Gemini Native Voice & Urdu Engine';
      case 'avatar': return '3D Cyber Human Avatar';
      case 'workflows': return 'n8n Workflow Automation Canvas';
      case 'prompts': return 'Prompt Engineering Library';
      case 'analytics': return 'Usage Analytics & Cost Engine';
      case 'admin': return 'Admin Governance & Audit';
      case 'settings': return 'System Configurations';
    }
  };

  return (
    <header className="h-16 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between z-10">
      {/* Title & Status */}
      <div className="flex items-center gap-4">
        <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          {getTitleForTab()}
        </h1>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Gemini 2.5 Active</span>
        </div>
        <div className="hidden lg:block text-xs font-medium text-slate-500">
          Latency: <span className="text-slate-300">12ms</span>
        </div>
      </div>

      {/* Controls & Options */}
      <div className="flex items-center gap-3">
        {/* Language Selection */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language} Mode</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <div className="absolute right-0 mt-1 w-36 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl hidden group-hover:block z-50 p-1">
            {(['Urdu', 'English', 'Hindi'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                  language === lang ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {lang === 'Urdu' ? 'اردو (Urdu)' : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Reasoning Mode Toggle */}
        <button
          onClick={() => setReasoningEnabled(!reasoningEnabled)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            reasoningEnabled 
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
              : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
          }`}
          title="Toggle Gemini 2.5 Deep Thinking / Reasoning mode"
        >
          <BrainCircuit className={`w-3.5 h-3.5 ${reasoningEnabled ? 'text-amber-400 animate-pulse' : ''}`} />
          <span className="hidden sm:inline">Reasoning Mode</span>
        </button>

        {/* RAG Context Toggle */}
        <button
          onClick={() => setRagEnabled(!ragEnabled)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            ragEnabled 
              ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' 
              : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
          }`}
          title="Toggle RAG Knowledge Base Retrieval"
        >
          <Database className={`w-3.5 h-3.5 ${ragEnabled ? 'text-indigo-400' : ''}`} />
          <span className="hidden sm:inline">RAG Context</span>
        </button>

        {/* Voice Live Button */}
        <button
          onClick={() => setVoiceActive(!voiceActive)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-lg transition-all ${
            voiceActive 
              ? 'bg-emerald-600 text-white shadow-emerald-600/20 animate-pulse' 
              : 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-500'
          }`}
          title="Toggle Native Audio & Live Voice engine"
        >
          {voiceActive ? <Radio className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          <span>{voiceActive ? 'Live Voice' : 'Start Voice'}</span>
        </button>

        {/* Model Selector */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{modelOptions.find(m => m.id === selectedModel)?.label || selectedModel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <div className="absolute right-0 mt-2 w-64 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl hidden group-hover:block z-50 p-1.5 space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Gemini 2.5 Models
            </div>
            {modelOptions.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  selectedModel === m.id ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/30' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <div className="text-xs font-semibold">{m.label}</div>
                <div className="text-[10px] text-slate-500">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
