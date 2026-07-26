import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Radio, 
  Volume2, 
  SlidersHorizontal, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Activity,
  Play,
  RotateCcw
} from 'lucide-react';
import { VoiceConfig } from '../../types';

interface VoicePanelProps {
  voiceConfig: VoiceConfig;
  setVoiceConfig: React.Dispatch<React.SetStateAction<VoiceConfig>>;
  onTestSpeech: (text: string) => void;
}

export const VoicePanel: React.FC<VoicePanelProps> = ({
  voiceConfig,
  setVoiceConfig,
  onTestSpeech
}) => {
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [testUrduText, setTestUrduText] = useState('السلام علیکم! میں نیکسس اے آئی کریٹر او ایس ہوں، آپ کی کیا مدد کر سکتا ہوں؟');

  return (
    <div className="flex-1 p-6 md:p-8 bg-neutral-950 text-neutral-100 overflow-y-auto space-y-8">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-emerald-950/30 to-neutral-900 border border-neutral-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Radio className="w-6 h-6 animate-pulse" />
            </span>
            <h2 className="text-xl font-bold text-white">Google Native Audio & Urdu Voice Studio</h2>
          </div>
          <p className="text-xs text-neutral-400">
            Realtime streaming with Voice Activity Detection (VAD), Echo Cancellation, Noise Suppression, and Voice Interruption handling. Speaks fluent Urdu, English, and Hindi.
          </p>
        </div>

        <button
          onClick={() => setIsLiveActive(!isLiveActive)}
          className={`px-6 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all shrink-0 ${
            isLiveActive 
              ? 'bg-emerald-500 text-neutral-950 shadow-emerald-500/30 animate-pulse' 
              : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
          }`}
        >
          {isLiveActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{isLiveActive ? 'Disconnect Live Audio' : 'Connect Gemini Live Session'}</span>
        </button>
      </div>

      {/* Realtime Audio Spectrum Visualizer */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Live Audio Waveform & Interruption Engine
          </h3>
          <span className="text-xs font-mono text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
            Sample Rate: 24kHz PCM
          </span>
        </div>

        <div className="h-28 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center p-4 relative overflow-hidden">
          {isLiveActive ? (
            <div className="flex items-center gap-1.5 h-16 w-full justify-center">
              {[40, 80, 20, 90, 60, 30, 100, 70, 50, 85, 35, 95, 45, 75, 25, 65].map((h, idx) => (
                <div
                  key={idx}
                  style={{ height: `${h}%` }}
                  className="w-2 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-full animate-pulse transition-all duration-150"
                />
              ))}
            </div>
          ) : (
            <div className="text-xs text-neutral-500 font-mono flex items-center gap-2">
              <Zap className="w-4 h-4" /> Live audio stream disconnected. Click button above to initiate low latency WebSocket audio session.
            </div>
          )}
        </div>
      </div>

      {/* Urdu Voice Reply Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            Urdu Speech Test & Natural Synthesis
          </h3>
          <p className="text-xs text-neutral-400">
            Test Gemini Native Text-To-Speech (TTS) natural voice output in Urdu and English.
          </p>

          <textarea
            value={testUrduText}
            onChange={(e) => setTestUrduText(e.target.value)}
            rows={3}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
          />

          <button
            onClick={() => onTestSpeech(testUrduText)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Synthesize Urdu Speech</span>
          </button>
        </div>

        {/* Audio Engine Configuration */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            DSP & Interruption Parameters
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium">Interruption Threshold (VAD Sensitivity)</span>
              <span className="font-mono text-indigo-400">{voiceConfig.interruptionThreshold}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={voiceConfig.interruptionThreshold}
              onChange={(e) => setVoiceConfig(prev => ({ ...prev, interruptionThreshold: Number(e.target.value) }))}
              className="w-full accent-indigo-500"
            />

            <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
              <span className="text-xs text-neutral-300 font-medium">Echo Cancellation</span>
              <input
                type="checkbox"
                checked={voiceConfig.echoCancellation}
                onChange={(e) => setVoiceConfig(prev => ({ ...prev, echoCancellation: e.target.checked }))}
                className="rounded border-neutral-800 bg-neutral-950 text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-300 font-medium">Noise Suppression</span>
              <input
                type="checkbox"
                checked={voiceConfig.noiseSuppression}
                onChange={(e) => setVoiceConfig(prev => ({ ...prev, noiseSuppression: e.target.checked }))}
                className="rounded border-neutral-800 bg-neutral-950 text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-300 font-medium">Auto Speak Urdu Replies</span>
              <input
                type="checkbox"
                checked={voiceConfig.autoSpeakUrduReplies}
                onChange={(e) => setVoiceConfig(prev => ({ ...prev, autoSpeakUrduReplies: e.target.checked }))}
                className="rounded border-neutral-800 bg-neutral-950 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
