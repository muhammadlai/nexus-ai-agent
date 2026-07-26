import React from 'react';
import { Settings as SettingsIcon, Key, Sliders, Moon, Sparkles, Check, Globe } from 'lucide-react';
import { UserProfile } from '../../types';

interface SettingsModalProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  reasoningEnabled: boolean;
  setReasoningEnabled: (r: boolean) => void;
  language: 'Urdu' | 'English' | 'Hindi';
  setLanguage: (lang: 'Urdu' | 'English' | 'Hindi') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  setUser,
  reasoningEnabled,
  setReasoningEnabled,
  language,
  setLanguage
}) => {
  return (
    <div className="flex-1 p-6 md:p-8 bg-neutral-950 text-neutral-100 overflow-y-auto space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-400" /> System Settings & Preferences
        </h2>
        <p className="text-xs text-neutral-400">
          Configure default Gemini 2.5 models, reasoning depth, voice audio parameters, and system prompts.
        </p>
      </div>

      {/* API Credentials */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" /> Gemini API Key Integration
          </h3>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
            Server-Side Key Attached
          </span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Your Gemini API key is securely attached server-side from your AI Studio environment secrets. All requests are proxied via Express backend routes to ensure zero key exposure in browser bundles.
        </p>
      </div>

      {/* Defaults */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" /> Default AI Behavior
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between pt-2 border-b border-neutral-800 pb-3">
            <div>
              <div className="text-xs font-semibold text-white">Default Reasoning Mode</div>
              <div className="text-[11px] text-neutral-400">Enable Gemini 2.5 Deep Thinking by default on new chats</div>
            </div>
            <input
              type="checkbox"
              checked={reasoningEnabled}
              onChange={(e) => setReasoningEnabled(e.target.checked)}
              className="rounded border-neutral-800 bg-neutral-950 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-b border-neutral-800 pb-3">
            <div>
              <div className="text-xs font-semibold text-white">Primary Output Language</div>
              <div className="text-[11px] text-neutral-400">Default to Urdu or English for AI answers</div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Urdu">Urdu (اردو)</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-xs font-semibold text-white">Theme Atmosphere</div>
              <div className="text-[11px] text-neutral-400">Enterprise Dark Premium Canvas</div>
            </div>
            <span className="text-xs font-mono text-indigo-400 flex items-center gap-1">
              <Moon className="w-3.5 h-3.5" /> Dark Obsidian
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
