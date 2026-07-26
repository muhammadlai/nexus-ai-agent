import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Square, 
  RotateCcw, 
  Copy, 
  Check, 
  Edit3, 
  BrainCircuit, 
  Database, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Paperclip, 
  Play, 
  Code,
  FileText,
  Bot,
  User,
  Globe
} from 'lucide-react';
import { ChatMessage, MemoryItem, DocumentItem } from '../../types';

interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isStreaming: boolean;
  onStopGeneration: () => void;
  onRegenerate: () => void;
  reasoningEnabled: boolean;
  ragEnabled: boolean;
  language: 'Urdu' | 'English' | 'Hindi';
  onPlaySpeech: (text: string) => void;
  activeSessionTitle: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onSendMessage,
  isStreaming,
  onStopGeneration,
  onRegenerate,
  reasoningEnabled,
  ragEnabled,
  language,
  onPlaySpeech,
  activeSessionTitle
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editPromptText, setEditPromptText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSend = () => {
    if (!inputText.trim() || isStreaming) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleReasoning = (id: string) => {
    setExpandedReasoning(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleMicListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser window, but Gemini Voice API synthesis is ready!');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'Urdu' ? 'ur-PK' : 'en-US';

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
    }
  };

  const urduPresets = [
    'نیکسس اے آئی، مجھے ورچوئل ریئلٹی اور AI کی جدید تکنیک بتائیں۔',
    'Explain RAG architecture with vector memory and TypeScript examples.',
    'پاکستان میں تکنیک اور اے آئی انوویشن کے لیے ایک تفصیلی روڈ میپ بنائیں۔',
    'Write a complete Express.js WebSocket route in Node.js for live audio streaming.'
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-[#050505] text-slate-200 overflow-hidden relative">
      {/* Session Banner */}
      <div className="px-6 py-2.5 bg-[#050505]/80 border-b border-white/5 flex items-center justify-between text-xs text-slate-400 backdrop-blur-md">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-white font-semibold">{activeSessionTitle}</span>
        </div>
        <div className="flex items-center gap-3">
          {reasoningEnabled && (
            <span className="flex items-center gap-1 text-indigo-400 font-mono text-[10px] uppercase font-bold tracking-widest">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" /> Reasoning Active
            </span>
          )}
          {ragEnabled && (
            <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-widest">
              <Database className="w-3.5 h-3.5 text-emerald-400" /> RAG Knowledge Sync
            </span>
          )}
          <span className="text-slate-500 font-mono">
            Mode: {language === 'Urdu' ? 'Urdu (اردو)' : language}
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">NEXUS AI WORKSPACE</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-lg">
              Enterprise AI with persistent long-term memory, RAG knowledge retrieval, Gemini 2.5 deep reasoning, and native Urdu voice synthesis.
            </p>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              {urduPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(preset)}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-slate-300 transition-all flex flex-col justify-between gap-2 group"
                >
                  <span className="line-clamp-2 font-medium group-hover:text-white leading-relaxed">{preset}</span>
                  <span className="text-[10px] text-indigo-400 flex items-center gap-1 uppercase tracking-widest font-bold">
                    Execute Prompt <Sparkles className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center shrink-0 text-white font-bold text-[10px]">
                  NX
                </div>
              )}

              <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* User Message Bubble */}
                {msg.role === 'user' ? (
                  <div className="max-w-xl rounded-2xl bg-white/5 border border-white/10 p-4 text-sm leading-relaxed text-slate-300 shadow-lg">
                    {msg.content}
                  </div>
                ) : (
                  /* Assistant Message Box */
                  <div className="max-w-2xl flex-1 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 p-5 text-sm leading-relaxed text-slate-200 shadow-xl space-y-4">
                    {/* Retrieved Memory Badges */}
                    {((msg.memoriesRetrieved && msg.memoriesRetrieved.length > 0) || (msg.documentsReferenced && msg.documentsReferenced.length > 0)) && (
                      <div className="flex flex-wrap gap-2 pb-3 border-b border-indigo-500/10">
                        {msg.memoriesRetrieved?.map((mem, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-semibold">
                            <BrainCircuit className="w-3 h-3 text-indigo-400" />
                            Memory: {mem}
                          </span>
                        ))}
                        {msg.documentsReferenced?.map((doc, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold">
                            <FileText className="w-3 h-3 text-emerald-400" />
                            RAG: {doc}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Reasoning Accordion */}
                    {msg.reasoningText && (
                      <div className="bg-[#050505]/80 border border-indigo-500/20 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleReasoning(msg.id)}
                          className="w-full px-3 py-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:bg-white/5 transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
                            Reasoning Active ({msg.reasoningTimeMs || 820}ms)
                          </span>
                          {expandedReasoning[msg.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        {expandedReasoning[msg.id] && (
                          <div className="p-3 text-xs text-slate-400 font-mono border-t border-indigo-500/20 whitespace-pre-wrap leading-relaxed bg-[#050505]">
                            {msg.reasoningText}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Main Content Render */}
                    <div className="text-slate-200 leading-relaxed space-y-3 prose prose-invert max-w-none text-sm">
                      {msg.content.split('\n\n').map((paragraph, pIdx) => {
                        if (paragraph.startsWith('```')) {
                          const lines = paragraph.split('\n');
                          const lang = lines[0].replace('```', '') || 'typescript';
                          const codeText = lines.slice(1, -1).join('\n');
                          return (
                            <div key={pIdx} className="my-3 rounded-xl border border-white/10 bg-[#050505] overflow-hidden font-mono text-xs">
                              <div className="px-4 py-2 bg-[#0A0A0A] border-b border-white/10 flex items-center justify-between text-slate-400">
                                <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                                  <Code className="w-3.5 h-3.5" /> {lang}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(codeText, `${msg.id}_code_${pIdx}`)}
                                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                                >
                                  {copiedId === `${msg.id}_code_${pIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedId === `${msg.id}_code_${pIdx}` ? 'Copied!' : 'Copy code'}</span>
                                </button>
                              </div>
                              <pre className="p-4 overflow-x-auto text-slate-200 font-mono leading-relaxed">
                                <code>{codeText || paragraph.replace(/```/g, '')}</code>
                              </pre>
                            </div>
                          );
                        }
                        return (
                          <p key={pIdx} className="whitespace-pre-wrap leading-relaxed">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>

                    {/* Assistant Message Actions */}
                    <div className="pt-3 border-t border-indigo-500/10 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => onPlaySpeech(msg.content)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white/5 hover:text-indigo-400 transition-colors"
                          title="Speak answer in Urdu/English natural voice"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Speak Urdu</span>
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0 text-slate-300 font-bold text-[10px] border border-white/10">
                  U
                </div>
              )}
            </div>
          ))
        )}

        {/* Streaming Indicator */}
        {isStreaming && (
          <div className="flex items-center gap-3 text-xs text-indigo-400 max-w-4xl mx-auto pl-12 font-mono">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
            <span>Nexus Gemini 2.5 streaming answer...</span>
            <button
              onClick={onStopGeneration}
              className="ml-auto flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-sans font-medium"
            >
              <Square className="w-3 h-3 fill-rose-400" /> Stop Generation
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Prompt Dock */}
      <div className="p-4 md:px-12 bg-[#050505] border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Active Voice Waveform Visualizer */}
          {isListening && (
            <div className="flex items-center justify-between px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-mono">
              <span className="flex items-center gap-2">
                <Mic className="w-4 h-4 animate-bounce text-emerald-400" />
                Listening to voice prompt...
              </span>
              <div className="flex items-center gap-1 h-3">
                <span className="w-1 bg-emerald-400 h-full animate-pulse"></span>
                <span className="w-1 bg-emerald-400 h-2/3 animate-pulse delay-75"></span>
                <span className="w-1 bg-emerald-400 h-full animate-pulse delay-150"></span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 pr-4 shadow-xl">
            <button
              type="button"
              onClick={toggleMicListening}
              className={`ml-2 flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                isListening ? 'bg-emerald-500 text-white animate-pulse' : 'hover:bg-white/10 text-slate-400'
              }`}
              title="Voice Input"
            >
              <Mic className="h-5 w-5 opacity-70" />
            </button>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'Urdu' ? 'Command Nexus AI in Urdu or English...' : 'Command Nexus AI...'}
              rows={1}
              className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-600 text-slate-200 resize-none font-sans"
            />

            <div className="flex items-center gap-2">
              {messages.length > 0 && !isStreaming && (
                <button
                  onClick={onRegenerate}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  title="Regenerate last response"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isStreaming}
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition-all shadow-md shadow-indigo-600/30"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
