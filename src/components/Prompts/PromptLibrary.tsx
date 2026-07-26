import React from 'react';
import { Sparkles, Code, Globe, Database, Workflow, Copy, ArrowRight } from 'lucide-react';

interface PromptLibraryProps {
  onSelectPrompt: (promptText: string) => void;
}

export const PromptLibrary: React.FC<PromptLibraryProps> = ({ onSelectPrompt }) => {
  const prompts = [
    {
      title: 'Urdu Natural Speech & AI Tutor',
      category: 'Urdu AI',
      icon: <Globe className="w-4 h-4 text-emerald-400" />,
      prompt: 'السلام علیکم! آپ نیکسس اے آئی ہیں، براہ کرم مجھے اے آئی اور ویب ڈیولپمنٹ کے بنیادی اصول سادہ اردو زبان میں سمجھائیں۔'
    },
    {
      title: 'Full-Stack Express + React 19 Architecture',
      category: 'Coding & Architecture',
      icon: <Code className="w-4 h-4 text-indigo-400" />,
      prompt: 'Design a high-throughput Express.js REST API with TypeScript, supporting server-sent streaming, vector embeddings lookup, and JWT security middleware.'
    },
    {
      title: 'RAG Document Vector Indexer',
      category: 'Knowledge Base',
      icon: <Database className="w-4 h-4 text-amber-400" />,
      prompt: 'Explain how chunking strategy (500 tokens with 50 token overlap) improves cosine similarity search accuracy in Qdrant/Chroma vector databases.'
    },
    {
      title: 'n8n Automated Webhook Workflow',
      category: 'Workflows',
      icon: <Workflow className="w-4 h-4 text-purple-400" />,
      prompt: 'Create a step-by-step specification for an n8n workflow that triggers on GitHub Webhook push events, invokes Gemini 2.5 to review code changes, and updates Slack.'
    }
  ];

  return (
    <div className="flex-1 p-6 md:p-8 bg-neutral-950 text-neutral-100 overflow-y-auto space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400" /> Prompt Library
        </h2>
        <p className="text-xs text-neutral-400">
          Curated enterprise prompts for Gemini 2.5 reasoning, Urdu translation, RAG vector lookup, and n8n workflow triggers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prompts.map((p, idx) => (
          <div key={idx} className="p-6 bg-neutral-900 border border-neutral-800 hover:border-indigo-500/50 rounded-2xl space-y-4 shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold text-white">
                {p.icon}
                {p.title}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                {p.category}
              </span>
            </div>

            <p className="text-xs text-neutral-300 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 font-mono leading-relaxed">
              {p.prompt}
            </p>

            <button
              onClick={() => onSelectPrompt(p.prompt)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
            >
              <span>Use This Prompt in Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
