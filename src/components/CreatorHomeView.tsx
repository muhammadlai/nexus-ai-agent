import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Smartphone,
  Bot,
  Sparkles,
  Image as ImageIcon,
  Video,
  Layers,
  Workflow,
  BarChart3,
  Mic,
  MicOff,
  Radio,
  Volume2,
  VolumeX,
  Sparkle,
  Zap,
  ArrowRight,
  Flame,
  Wand2,
  Cpu,
  UserCheck,
  CheckCircle2,
  Play,
  RotateCcw,
  Sliders,
  X,
  Compass,
  Code2,
  Database,
  Brain,
  MemoryStick,
  Network,
  HardDrive,
  Activity,
  Clock,
  Gauge,
  BookOpen,
  Pin,
  History,
  Star,
  FileText,
  TrendingUp,
  Server,
  Wifi,
  Timer,
  MessageSquare,
  Boxes,
  Search,
  Save,
  Target,
  Lightbulb,
  Braces,
  GitBranch,
  ScanLine,
  Binary,
  Ear,
  CircuitBoard,
  Waves
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ActiveView } from '../types';
import { ThreeDAvatarCanvas, AvatarType, AvatarState } from './ThreeDAvatarCanvas';
import { AvatarVoiceEngine } from '../utils/avatarVoiceEngine';

interface CreatorHomeViewProps {
  onSelectOption: (view: ActiveView, initialPrompt?: string) => void;
  onOpenVoice: () => void;
}

/* =========================================================================
   AI MEMORY / TELEMETRY DASHBOARD — TYPES
   ========================================================================= */

interface LiveMetric {
  id: string;
  label: string;
  icon: LucideIcon;
  value: number;
  max: number;
  unit: string;
  decimals: number;
  drift: number;
  gradient: string;
  accent: string;
  hint: string;
}

type MemorySystemState = 'Active' | 'Syncing' | 'Indexing' | 'Optimal';

interface MemorySystem {
  id: string;
  label: string;
  icon: LucideIcon;
  load: number;
  state: MemorySystemState;
  accent: string;
}

interface ActivityEvent {
  id: number;
  label: string;
  icon: LucideIcon;
  accent: string;
  time: string;
}

interface KnowledgeStat {
  id: string;
  label: string;
  icon: LucideIcon;
  value: number;
  max: number;
  unit: string;
  decimals: number;
  drift: number;
  accent: string;
}

interface AiStatusBadge {
  id: string;
  label: string;
  icon: LucideIcon;
  accent: string;
  ring: string;
}

interface CircularMeterStat {
  id: string;
  label: string;
  icon: LucideIcon;
  value: number;
  drift: number;
  from: string;
  to: string;
}

interface TelemetryStat {
  id: string;
  label: string;
  icon: LucideIcon;
  value: number;
  unit: string;
  decimals: number;
  drift: number;
  text?: string;
  gradient: string;
  accent: string;
}

interface MemoryTimelineEntry {
  id: string;
  label: string;
  detail: string;
  time: string;
  accent: string;
}

/* =========================================================================
   AI MEMORY / TELEMETRY DASHBOARD — HELPERS
   ========================================================================= */

const clampDrift = (value: number, delta: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value + (Math.random() - 0.5) * delta * 2));

const formatMetric = (value: number, decimals: number): string => {
  if (decimals > 0) return value.toFixed(decimals);
  return Math.round(value).toLocaleString('en-US');
};

const nowLabel = (): string =>
  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/** Smoothly tweens between numeric values with requestAnimationFrame. */
const AnimatedCounter: React.FC<{
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}> = ({ value, decimals = 0, suffix = '', className = '' }) => {
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const from = displayRef.current;
    const start = performance.now();
    const duration = 750;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (value - from) * eased;
      displayRef.current = next;
      setDisplay(next);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  return (
    <span className={className}>
      {formatMetric(display, decimals)}
      {suffix}
    </span>
  );
};

/** Animated gradient progress bar used across memory + knowledge panels. */
const LiveProgressBar: React.FC<{ percent: number; gradient: string; height?: string }> = ({
  percent,
  gradient,
  height = 'h-1.5',
}) => (
  <div className={`w-full ${height} rounded-full bg-slate-950/80 border border-white/5 overflow-hidden`}>
    <motion.div
      className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    />
  </div>
);

/** Animated SVG circular progress indicator. */
const CircularMeter: React.FC<{ stat: CircularMeterStat }> = ({ stat }) => {
  const Icon = stat.icon;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, stat.value)) / 100) * circumference;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      className="group relative flex flex-col items-center gap-2 rounded-3xl bg-slate-900/70 border border-white/10 hover:border-purple-500/40 backdrop-blur-2xl p-4 shadow-xl transition-colors"
    >
      <div className="relative w-[104px] h-[104px]">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <defs>
            <linearGradient id={`meter-${stat.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={stat.from} />
              <stop offset="100%" stopColor={stat.to} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r={radius} stroke="rgba(148,163,184,0.15)" strokeWidth="8" fill="none" />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke={`url(#meter-${stat.id})`}
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-4 h-4 text-cyan-300 mb-0.5" />
          <AnimatedCounter
            value={stat.value}
            decimals={1}
            suffix="%"
            className="text-sm font-extrabold text-slate-100 font-mono"
          />
        </div>
      </div>
      <span className="text-[11px] font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors text-center">
        {stat.label}
      </span>
    </motion.div>
  );
};

/* =========================================================================
   AI MEMORY / TELEMETRY DASHBOARD — SEED DATA
   ========================================================================= */

const INITIAL_MEMORY_METRICS: LiveMetric[] = [
  {
    id: 'short-term',
    label: 'Short-Term Memory',
    icon: Zap,
    value: 148,
    max: 256,
    unit: ' slots',
    decimals: 0,
    drift: 6,
    gradient: 'from-purple-600 via-indigo-600 to-blue-600',
    accent: 'text-purple-300',
    hint: 'Rolling session buffer',
  },
  {
    id: 'long-term',
    label: 'Long-Term Memory',
    icon: Database,
    value: 8420,
    max: 16384,
    unit: ' MB',
    decimals: 0,
    drift: 40,
    gradient: 'from-cyan-500 via-sky-600 to-indigo-600',
    accent: 'text-cyan-300',
    hint: 'Persisted across sessions',
  },
  {
    id: 'context-window',
    label: 'Context Window',
    icon: Braces,
    value: 96400,
    max: 128000,
    unit: ' tok',
    decimals: 0,
    drift: 900,
    gradient: 'from-fuchsia-600 via-purple-600 to-indigo-600',
    accent: 'text-fuchsia-300',
    hint: 'Live prompt context',
  },
  {
    id: 'conversation',
    label: 'Conversation Memory',
    icon: MessageSquare,
    value: 342,
    max: 500,
    unit: ' threads',
    decimals: 0,
    drift: 3,
    gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
    accent: 'text-emerald-300',
    hint: 'Indexed chat history',
  },
  {
    id: 'vector',
    label: 'Vector Memory',
    icon: Boxes,
    value: 18450,
    max: 25000,
    unit: ' vec',
    decimals: 0,
    drift: 120,
    gradient: 'from-violet-600 via-purple-700 to-fuchsia-600',
    accent: 'text-violet-300',
    hint: 'Pinecone RAG namespace',
  },
  {
    id: 'knowledge',
    label: 'Knowledge Base',
    icon: BookOpen,
    value: 1284,
    max: 2000,
    unit: ' docs',
    decimals: 0,
    drift: 8,
    gradient: 'from-amber-500 via-orange-600 to-rose-600',
    accent: 'text-amber-300',
    hint: 'Embedded documents',
  },
  {
    id: 'confidence',
    label: 'AI Confidence',
    icon: Target,
    value: 94.2,
    max: 100,
    unit: '%',
    decimals: 1,
    drift: 1.2,
    gradient: 'from-sky-500 via-cyan-500 to-emerald-500',
    accent: 'text-sky-300',
    hint: 'Answer certainty score',
  },
  {
    id: 'learning',
    label: 'Learning Progress',
    icon: TrendingUp,
    value: 78.6,
    max: 100,
    unit: '%',
    decimals: 1,
    drift: 1.6,
    gradient: 'from-rose-500 via-pink-600 to-purple-600',
    accent: 'text-rose-300',
    hint: 'Fine-tune cycle progress',
  },
];

const INITIAL_MEMORY_SYSTEMS: MemorySystem[] = [
  { id: 'stm', label: 'Short-Term Memory', icon: MemoryStick, load: 62, state: 'Active', accent: 'text-purple-300' },
  { id: 'ltm', label: 'Long-Term Memory', icon: Database, load: 51, state: 'Optimal', accent: 'text-cyan-300' },
  { id: 'ctx', label: 'Conversation Context', icon: MessageSquare, load: 74, state: 'Active', accent: 'text-emerald-300' },
  { id: 'graph', label: 'Knowledge Graph', icon: GitBranch, load: 46, state: 'Indexing', accent: 'text-amber-300' },
  { id: 'vectordb', label: 'Vector Database', icon: Boxes, load: 68, state: 'Syncing', accent: 'text-violet-300' },
  { id: 'embed', label: 'Embedding Engine', icon: CircuitBoard, load: 57, state: 'Active', accent: 'text-fuchsia-300' },
  { id: 'autosave', label: 'Auto Save', icon: Save, load: 88, state: 'Optimal', accent: 'text-sky-300' },
  { id: 'compression', label: 'Memory Compression', icon: Waves, load: 41, state: 'Syncing', accent: 'text-teal-300' },
];

const ACTIVITY_TEMPLATES: { label: string; icon: LucideIcon; accent: string }[] = [
  { label: 'User Prompt Saved', icon: Save, accent: 'text-emerald-300' },
  { label: 'Memory Updated', icon: MemoryStick, accent: 'text-purple-300' },
  { label: 'Context Indexed', icon: ScanLine, accent: 'text-cyan-300' },
  { label: 'Vector Stored', icon: Boxes, accent: 'text-violet-300' },
  { label: 'AI Learned New Context', icon: Lightbulb, accent: 'text-amber-300' },
  { label: 'Embedding Complete', icon: Binary, accent: 'text-fuchsia-300' },
  { label: 'Knowledge Synced', icon: BookOpen, accent: 'text-sky-300' },
  { label: 'Agent Memory Updated', icon: Bot, accent: 'text-rose-300' },
];

const INITIAL_KNOWLEDGE: KnowledgeStat[] = [
  { id: 'projects', label: 'Projects', icon: Layers, value: 34, max: 60, unit: '', decimals: 0, drift: 1, accent: 'text-purple-300' },
  { id: 'conversations', label: 'Conversations', icon: MessageSquare, value: 486, max: 800, unit: '', decimals: 0, drift: 4, accent: 'text-cyan-300' },
  { id: 'documents', label: 'Documents', icon: FileText, value: 1284, max: 2000, unit: '', decimals: 0, drift: 7, accent: 'text-emerald-300' },
  { id: 'images', label: 'Images', icon: ImageIcon, value: 762, max: 1200, unit: '', decimals: 0, drift: 5, accent: 'text-fuchsia-300' },
  { id: 'videos', label: 'Videos', icon: Video, value: 128, max: 250, unit: '', decimals: 0, drift: 2, accent: 'text-amber-300' },
  { id: 'embeddings', label: 'Embeddings', icon: Binary, value: 18450, max: 25000, unit: '', decimals: 0, drift: 140, accent: 'text-violet-300' },
  { id: 'tokens', label: 'Stored Tokens', icon: Braces, value: 2480000, max: 4000000, unit: '', decimals: 0, drift: 9000, accent: 'text-sky-300' },
  { id: 'accuracy', label: 'Memory Accuracy', icon: Target, value: 96.4, max: 100, unit: '%', decimals: 1, drift: 0.8, accent: 'text-teal-300' },
  { id: 'learning-score', label: 'Learning Score', icon: TrendingUp, value: 88.2, max: 100, unit: '%', decimals: 1, drift: 1.1, accent: 'text-rose-300' },
];

const AI_STATUS_BADGES: AiStatusBadge[] = [
  { id: 'idle', label: 'Idle', icon: Compass, accent: 'from-slate-600 to-slate-700', ring: 'shadow-slate-900/60' },
  { id: 'thinking', label: 'Thinking', icon: Brain, accent: 'from-purple-600 to-indigo-600', ring: 'shadow-purple-950/60' },
  { id: 'speaking', label: 'Speaking', icon: Volume2, accent: 'from-cyan-500 to-sky-600', ring: 'shadow-cyan-950/60' },
  { id: 'listening', label: 'Listening', icon: Ear, accent: 'from-emerald-500 to-teal-600', ring: 'shadow-emerald-950/60' },
  { id: 'learning', label: 'Learning', icon: Lightbulb, accent: 'from-amber-500 to-orange-600', ring: 'shadow-amber-950/60' },
  { id: 'planning', label: 'Planning', icon: Compass, accent: 'from-fuchsia-600 to-purple-600', ring: 'shadow-fuchsia-950/60' },
  { id: 'executing', label: 'Executing', icon: Play, accent: 'from-rose-500 to-pink-600', ring: 'shadow-rose-950/60' },
  { id: 'memory-saving', label: 'Memory Saving', icon: Save, accent: 'from-violet-600 to-indigo-700', ring: 'shadow-violet-950/60' },
];

const INITIAL_METERS: CircularMeterStat[] = [
  { id: 'memory-usage', label: 'Memory Usage', icon: MemoryStick, value: 64.5, drift: 3, from: '#a855f7', to: '#22d3ee' },
  { id: 'learning-progress', label: 'Learning Progress', icon: TrendingUp, value: 78.6, drift: 2, from: '#f43f5e', to: '#a855f7' },
  { id: 'context-usage', label: 'Context Usage', icon: Braces, value: 75.3, drift: 4, from: '#6366f1', to: '#22d3ee' },
  { id: 'token-usage', label: 'Token Usage', icon: Binary, value: 58.1, drift: 4, from: '#f59e0b', to: '#f43f5e' },
  { id: 'cpu-usage', label: 'CPU Usage', icon: Cpu, value: 42.7, drift: 6, from: '#22d3ee', to: '#10b981' },
  { id: 'gpu-usage', label: 'GPU Usage', icon: CircuitBoard, value: 71.9, drift: 6, from: '#8b5cf6', to: '#ec4899' },
];

const INITIAL_TELEMETRY: TelemetryStat[] = [
  { id: 'requests', label: "Today's Requests", icon: Activity, value: 12480, unit: '', decimals: 0, drift: 60, gradient: 'from-purple-600/25 to-indigo-600/10', accent: 'text-purple-300' },
  { id: 'api-calls', label: 'API Calls', icon: Network, value: 8642, unit: '', decimals: 0, drift: 45, gradient: 'from-cyan-500/25 to-sky-600/10', accent: 'text-cyan-300' },
  { id: 'tokens', label: 'Tokens Used', icon: Braces, value: 1842000, unit: '', decimals: 0, drift: 8000, gradient: 'from-fuchsia-600/25 to-purple-600/10', accent: 'text-fuchsia-300' },
  { id: 'memory', label: 'Memory Usage', icon: MemoryStick, value: 64.5, unit: '%', decimals: 1, drift: 3, gradient: 'from-violet-600/25 to-indigo-700/10', accent: 'text-violet-300' },
  { id: 'gpu', label: 'GPU Load', icon: CircuitBoard, value: 71.9, unit: '%', decimals: 1, drift: 5, gradient: 'from-pink-600/25 to-rose-600/10', accent: 'text-pink-300' },
  { id: 'cpu', label: 'CPU Load', icon: Cpu, value: 42.7, unit: '%', decimals: 1, drift: 6, gradient: 'from-emerald-500/25 to-teal-600/10', accent: 'text-emerald-300' },
  { id: 'workflows', label: 'Workflow Runs', icon: Workflow, value: 268, unit: '', decimals: 0, drift: 3, gradient: 'from-amber-500/25 to-orange-600/10', accent: 'text-amber-300' },
  { id: 'agents', label: 'AI Agents', icon: Bot, value: 12, unit: '', decimals: 0, drift: 0.6, gradient: 'from-sky-500/25 to-blue-600/10', accent: 'text-sky-300' },
  { id: 'latency', label: 'Response Time', icon: Timer, value: 284, unit: ' ms', decimals: 0, drift: 22, gradient: 'from-teal-500/25 to-cyan-600/10', accent: 'text-teal-300' },
  { id: 'network', label: 'Network Status', icon: Wifi, value: 99.98, unit: '%', decimals: 2, drift: 0.02, text: 'Online', gradient: 'from-lime-500/25 to-emerald-600/10', accent: 'text-lime-300' },
  { id: 'storage', label: 'Storage', icon: HardDrive, value: 412.6, unit: ' GB', decimals: 1, drift: 1.4, gradient: 'from-indigo-600/25 to-purple-700/10', accent: 'text-indigo-300' },
];

const INITIAL_RECENT_PROMPTS: string[] = [
  'Build a multi-tenant SaaS dashboard with Stripe billing',
  'Generate a neon cyberpunk brand logo set',
  'Deploy an autonomous market research agent',
  'Create an n8n pipeline for GitHub PR reviews',
  'Render an 8K holographic control room image',
];

const PINNED_PROMPTS: string[] = [
  'Nexus AI landing page — glassmorphism hero',
  'React Native fitness tracker architecture',
  'Vector RAG knowledge base setup',
  'Realtime telemetry dashboard with charts',
];

const RECENT_CONVERSATIONS: { id: string; title: string; meta: string }[] = [
  { id: 'c1', title: 'SaaS billing webhook design', meta: '24 messages · 2h ago' },
  { id: 'c2', title: '3D avatar lip-sync tuning', meta: '11 messages · 5h ago' },
  { id: 'c3', title: 'Vector memory namespace plan', meta: '38 messages · yesterday' },
  { id: 'c4', title: 'Workflow automation rollout', meta: '9 messages · yesterday' },
];

const FAVORITE_PROJECTS: { id: string; title: string; meta: string }[] = [
  { id: 'p1', title: 'Nexus Creator OS', meta: 'React 19 · Tailwind v4' },
  { id: 'p2', title: 'Atlas Agent Swarm', meta: 'Gemini · Pinecone RAG' },
  { id: 'p3', title: 'Orbit Mobile App', meta: 'Expo · NativeWind' },
  { id: 'p4', title: 'Pulse Analytics', meta: 'FastAPI · PostgreSQL' },
];

const INITIAL_MEMORY_TIMELINE: MemoryTimelineEntry[] = [
  { id: 't1', label: 'Session context checkpoint', detail: 'Compressed 18k tokens into long-term store', time: '2 min ago', accent: 'bg-purple-500' },
  { id: 't2', label: 'Knowledge graph rebuilt', detail: '1,284 documents re-linked', time: '18 min ago', accent: 'bg-cyan-500' },
  { id: 't3', label: 'Vector namespace synced', detail: '18,450 embeddings verified', time: '1 h ago', accent: 'bg-fuchsia-500' },
  { id: 't4', label: 'Fine-tune cycle completed', detail: 'Learning score improved to 88.2', time: '3 h ago', accent: 'bg-emerald-500' },
];

export const CreatorHomeView: React.FC<CreatorHomeViewProps> = ({
  onSelectOption,
  onOpenVoice,
}) => {
  // Avatar Configuration & State
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>('professional_female');
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [speechVolume, setSpeechVolume] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasGreeted, setHasGreeted] = useState(false);

  // Guided Step-by-Step Creator Modal State
  const [selectedCardStep, setSelectedCardStep] = useState<any | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>(['React 19', 'Tailwind CSS v4', 'TypeScript']);
  const [guidedPromptInput, setGuidedPromptInput] = useState('');

  // Speech Recognition for Push-To-Talk
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // ===== AI MEMORY / TELEMETRY DASHBOARD STATE =====
  const [memoryMetrics, setMemoryMetrics] = useState<LiveMetric[]>(INITIAL_MEMORY_METRICS);
  const [memorySystems, setMemorySystems] = useState<MemorySystem[]>(INITIAL_MEMORY_SYSTEMS);
  const [knowledgeStats, setKnowledgeStats] = useState<KnowledgeStat[]>(INITIAL_KNOWLEDGE);
  const [meters, setMeters] = useState<CircularMeterStat[]>(INITIAL_METERS);
  const [telemetry, setTelemetry] = useState<TelemetryStat[]>(INITIAL_TELEMETRY);
  const [recentPrompts, setRecentPrompts] = useState<string[]>(INITIAL_RECENT_PROMPTS);
  const [memoryTimeline, setMemoryTimeline] = useState<MemoryTimelineEntry[]>(INITIAL_MEMORY_TIMELINE);
  const [statusCycleIndex, setStatusCycleIndex] = useState(0);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>(() =>
    ACTIVITY_TEMPLATES.slice(0, 6).map((template, idx) => ({
      id: idx,
      label: template.label,
      icon: template.icon,
      accent: template.accent,
      time: nowLabel(),
    }))
  );
  const activityIdRef = useRef(ACTIVITY_TEMPLATES.length);

  const voiceEngine = AvatarVoiceEngine.getInstance();

  // Attach Voice Engine state listener to update mouth lip sync
  useEffect(() => {
    voiceEngine.onStateChange = (speaking, vol) => {
      setSpeechVolume(vol);
      if (speaking) {
        setAvatarState('speaking');
      } else if (avatarState === 'speaking') {
        setAvatarState('idle');
      }
    };
  }, [avatarState]);

  // Initial Automatic Greeting when Component Mounts
  const triggerGreeting = () => {
    setHasGreeted(true);
    setAvatarState('speaking');
    const greetingText =
      "Hello! Welcome to Nexus AI. I'm your personal AI Creator. What would you like to create today?";

    if (voiceEnabled) {
      voiceEngine.speak(greetingText, selectedAvatar, () => {
        setAvatarState('idle');
      });
    }
  };

  useEffect(() => {
    // Attempt automatic greeting trigger
    const timer = setTimeout(() => {
      triggerGreeting();
    }, 600);
    return () => {
      clearTimeout(timer);
      voiceEngine.stop();
    };
  }, [selectedAvatar]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSearchQuery(transcript);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  // Live Telemetry Simulation Loop (memory, knowledge, meters, telemetry)
  useEffect(() => {
    const interval = setInterval(() => {
      setMemoryMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: clampDrift(metric.value, metric.drift, metric.max * 0.25, metric.max),
        }))
      );
      setMemorySystems((prev) =>
        prev.map((system) => ({
          ...system,
          load: clampDrift(system.load, 5, 22, 99),
        }))
      );
      setKnowledgeStats((prev) =>
        prev.map((stat) => ({
          ...stat,
          value: clampDrift(stat.value, stat.drift, stat.max * 0.2, stat.max),
        }))
      );
      setMeters((prev) =>
        prev.map((meter) => ({
          ...meter,
          value: clampDrift(meter.value, meter.drift, 18, 98),
        }))
      );
      setTelemetry((prev) =>
        prev.map((stat) => ({
          ...stat,
          value: clampDrift(stat.value, stat.drift, stat.value * 0.85, stat.value * 1.15 + stat.drift),
        }))
      );
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  // Live AI Activity Feed Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const template = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
      activityIdRef.current += 1;
      const event: ActivityEvent = {
        id: activityIdRef.current,
        label: template.label,
        icon: template.icon,
        accent: template.accent,
        time: nowLabel(),
      };
      setActivityFeed((prev) => [event, ...prev].slice(0, 8));
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // Rotating AI Status Badge Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusCycleIndex((prev) => (prev + 1) % AI_STATUS_BADGES.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  // Live Avatar State -> AI Status Badge Mapping
  const activeStatusId =
    avatarState === 'speaking'
      ? 'speaking'
      : avatarState === 'thinking'
      ? 'thinking'
      : avatarState === 'listening' || isListening
      ? 'listening'
      : AI_STATUS_BADGES[statusCycleIndex].id;

  // Record a prompt into the live memory timeline + search history panels
  const recordPromptMemory = (prompt: string, source: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setRecentPrompts((prev) => [trimmed, ...prev.filter((p) => p !== trimmed)].slice(0, 6));
    setMemoryTimeline((prev) =>
      [
        {
          id: `mem-${Date.now()}`,
          label: `${source} stored in memory`,
          detail: trimmed.length > 72 ? `${trimmed.slice(0, 72)}…` : trimmed,
          time: 'just now',
          accent: 'bg-cyan-500',
        },
        ...prev,
      ].slice(0, 6)
    );
    activityIdRef.current += 1;
    setActivityFeed((prev) =>
      [
        {
          id: activityIdRef.current,
          label: 'User Prompt Saved',
          icon: Save,
          accent: 'text-emerald-300',
          time: nowLabel(),
        },
        ...prev,
      ].slice(0, 8)
    );
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser tab.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSearchQuery('');
      setAvatarState('listening');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Creator Cards Array
  const creatorCards = [
    {
      id: 'website',
      title: 'Build Website',
      description: 'Generate production-ready React, Next.js, & Tailwind websites with modern animations.',
      icon: Globe,
      view: 'chat' as ActiveView,
      badge: 'POPULAR',
      gradient: 'from-purple-600 via-indigo-600 to-cyan-500',
      speechGuide: 'Awesome! Let\'s build a high-performance modern React website. I\'ll guide you through the layout, components, and animations.',
      defaultPrompt: 'Build a full-stack modern React SaaS landing page with dark theme glassmorphism, pricing tables, and Framer Motion animations.',
      stacks: ['React 19 + Vite', 'Tailwind CSS v4', 'Framer Motion', 'Express Backend'],
    },
    {
      id: 'mobile',
      title: 'Build Mobile App',
      description: 'Create cross-platform iOS & Android mobile apps using React Native, Expo, and Tailwind.',
      icon: Smartphone,
      view: 'chat' as ActiveView,
      badge: 'REACT NATIVE',
      gradient: 'from-cyan-500 via-teal-600 to-emerald-500',
      speechGuide: 'Mobile app development mode activated! Let\'s design native iOS and Android screens with fluid tab navigation.',
      defaultPrompt: 'Generate a React Native Expo application architecture for a fitness and wellness tracker with dark mode and tab transitions.',
      stacks: ['React Native Expo', 'NativeWind Tailwind', 'TypeScript', 'AsyncStorage'],
    },
    {
      id: 'agent',
      title: 'Create AI Agent',
      description: 'Deploy autonomous AI agents with tools, vector memory, and automated task execution.',
      icon: Bot,
      view: 'agents' as ActiveView,
      badge: 'AUTONOMOUS',
      gradient: 'from-yellow-500 via-amber-600 to-orange-600',
      speechGuide: 'Creating an autonomous AI agent! We can equip your agent with web browsing, code execution, and vector memory.',
      defaultPrompt: 'Deploy an autonomous market research AI agent that continuously monitors tech news feeds and compiles daily vector summaries.',
      stacks: ['Gemini 3.6 Flash', 'Pinecone Vector RAG', 'Tool Calling SDK', 'Express Proxy'],
    },
    {
      id: 'logo',
      title: 'Generate Logo',
      description: 'Design minimalist vector logos, brand identities, typography kits, and icon sets.',
      icon: Sparkles,
      view: 'imagegen' as ActiveView,
      badge: 'BRAND KIT',
      gradient: 'from-amber-500 via-orange-600 to-red-500',
      speechGuide: 'Logo and Brand Kit Studio! I will synthesize vector-style brand logos with custom typography and color palettes.',
      defaultPrompt: 'Minimalist futuristic tech logo emblem featuring geometric intersecting infinity curves, metallic cyan and neon purple gradient accents.',
      stacks: ['Imagen 3 Model', 'SVG Vector Tracing', 'Color Palette Synth'],
    },
    {
      id: 'image',
      title: 'Generate Image',
      description: 'Synthesize photorealistic 8K images, digital concept art, and UI visual assets with Imagen 3.',
      icon: ImageIcon,
      view: 'imagegen' as ActiveView,
      badge: 'IMAGEN 3',
      gradient: 'from-fuchsia-600 via-pink-600 to-rose-500',
      speechGuide: 'Image Generation Studio ready! Tell me what atmosphere, lighting, or visual assets you want to render in 8K.',
      defaultPrompt: 'A futuristic cybernetic AI control room with holographic data displays, neon purple and cyan glassmorphism UI, 8K photorealistic render.',
      stacks: ['Imagen 3 Ultra', 'Aspect Ratio 16:9', 'Prompt Enhancer'],
    },
    {
      id: 'video',
      title: 'Generate Video',
      description: 'Craft video generation scripts, visual scene storyboards, and Veo model motion prompts.',
      icon: Video,
      view: 'chat' as ActiveView,
      badge: 'VEO SYNTH',
      gradient: 'from-indigo-600 via-purple-600 to-pink-500',
      speechGuide: 'Video Production Mode! I will write scene-by-scene cinematic storyboards and Veo video generator prompts.',
      defaultPrompt: 'Generate a 30-second futuristic tech launch video script complete with cinematic scene descriptions, voiceover lines, and AI video prompts.',
      stacks: ['Veo AI Model', 'Cinematic Script Engine', 'Audio Voiceover Spec'],
    },
    {
      id: 'saas',
      title: 'Build SaaS',
      description: 'Architect multi-tenant SaaS platforms complete with Stripe subscriptions and RBAC auth.',
      icon: Layers,
      view: 'chat' as ActiveView,
      badge: 'COMPLETE ENGINE',
      gradient: 'from-purple-600 via-violet-700 to-indigo-800',
      speechGuide: 'SaaS Platform Architect engaged! We will build multi-tenant databases, Stripe billing webhooks, and team management.',
      defaultPrompt: 'Architect a multi-tenant SaaS application structure in React + FastAPI, including Stripe webhook handlers, user team management, and RBAC.',
      stacks: ['React 19 SPA', 'FastAPI Backend', 'PostgreSQL DB', 'Stripe Payments'],
    },
    {
      id: 'workflow',
      title: 'Create Workflow',
      description: 'Build visual n8n automation pipelines, webhook listeners, and multi-node LLM chains.',
      icon: Workflow,
      view: 'workflows' as ActiveView,
      badge: 'N8N HUB',
      gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
      speechGuide: 'n8n Workflow Automation Studio! I will build visual multi-node pipelines connecting webhooks, LLMs, and databases.',
      defaultPrompt: 'Build an automated n8n pipeline that receives GitHub pull request webhooks, runs an AI code review via Gemini, and sends Slack summaries.',
      stacks: ['n8n Engine', 'Webhook Handlers', 'Slack API', 'Gemini RAG'],
    },
    {
      id: 'dashboard',
      title: 'Build Dashboard',
      description: 'Design analytical admin dashboards with real-time charts, telemetry cards, and data tables.',
      icon: BarChart3,
      view: 'dashboard' as ActiveView,
      badge: 'ANALYTICAL',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      speechGuide: 'Analytical Dashboard Studio! I will construct real-time telemetry panels, data tables, and interactive metric charts.',
      defaultPrompt: 'Build an analytical AI API usage dashboard with real-time request charts, token cost breakdowns, and system latency monitoring.',
      stacks: ['Recharts / D3', 'Real-time Telemetry', 'Glassmorphic Cards', 'Tailwind CSS'],
    },
  ];

  // Handle Card Click -> Avatar Reacts + Speaks Guidance + Opens Step Guidance
  const handleSelectCard = (card: typeof creatorCards[0]) => {
    setSelectedCardStep(card);
    setStepIndex(0);
    setGuidedPromptInput(card.defaultPrompt);

    // Avatar Reaction
    setAvatarState('celebrating');

    // Avatar Speaks Step Guidance
    if (voiceEnabled) {
      voiceEngine.speak(card.speechGuide, selectedAvatar, () => {
        setAvatarState('idle');
      });
    }

    setTimeout(() => {
      setAvatarState('idle');
    }, 2500);
  };

  // Confirm Step Guidance & Proceed to Execution
  const handleConfirmGuidanceAndExecute = () => {
    if (!selectedCardStep) return;

    // Avatar Says final confirmation
    setAvatarState('thinking');
    const finalSpeech = `Executing your ${selectedCardStep.title}! Initializing code generation and workspace environment.`;

    if (voiceEnabled) {
      voiceEngine.speak(finalSpeech, selectedAvatar);
    }

    recordPromptMemory(guidedPromptInput || selectedCardStep.defaultPrompt, `${selectedCardStep.title} prompt`);

    onSelectOption(selectedCardStep.view, guidedPromptInput || selectedCardStep.defaultPrompt);
    setSelectedCardStep(null);
  };

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setAvatarState('thinking');
    if (voiceEnabled) {
      voiceEngine.speak(`Processing your request: "${searchQuery}". Launching AI creator studio.`, selectedAvatar);
    }

    recordPromptMemory(searchQuery, 'Creator prompt');

    onSelectOption('chat', searchQuery);
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 text-slate-100 overflow-y-auto p-3 sm:p-8 space-y-8 pb-32 relative select-none">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-purple-600/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* 3D AVATAR HERO CENTERPIECE STAGE */}
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
        {/* Top Header System Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/40 text-purple-300 text-xs font-mono shadow-xl backdrop-blur-xl mb-2"
        >
          <Flame className="w-4 h-4 text-cyan-400 animate-bounce" />
          <span>NEXUS 3D HUMAN AI ASSISTANT OPERATING SYSTEM</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
        </motion.div>

        {/* Avatar Persona Selector Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-wrap items-center justify-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl mb-4"
        >
          {[
            { id: 'professional_female', label: 'Professional Female', icon: UserCheck, color: 'text-purple-400' },
            { id: 'professional_male', label: 'Professional Male', icon: UserCheck, color: 'text-cyan-400' },
            { id: 'futuristic_robot', label: 'Futuristic Robot', icon: Cpu, color: 'text-emerald-400' },
            { id: 'holographic_ai', label: 'Holographic AI', icon: Radio, color: 'text-fuchsia-400' },
          ].map((persona) => {
            const Icon = persona.icon;
            const isSelected = selectedAvatar === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => {
                  setSelectedAvatar(persona.id as AvatarType);
                  setAvatarState('thinking');
                  setTimeout(() => setAvatarState('idle'), 1000);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/60 border border-purple-400/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${persona.color}`} />
                <span>{persona.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* 3D AVATAR CANVAS BOX */}
        <div className="relative w-full max-w-2xl h-[380px] sm:h-[420px] rounded-3xl bg-slate-950/80 border border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.25)] backdrop-blur-3xl overflow-hidden flex flex-col items-center justify-center">
          {/* Ambient Corner Glows */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Three.js 3D Canvas */}
          <ThreeDAvatarCanvas
            avatarType={selectedAvatar}
            avatarState={avatarState}
            speechVolume={speechVolume}
            onAvatarClick={triggerGreeting}
          />

          {/* Live Avatar Status Badge Overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md text-xs font-mono shadow-lg">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                avatarState === 'speaking'
                  ? 'bg-cyan-400 animate-ping'
                  : avatarState === 'thinking'
                  ? 'bg-purple-400 animate-pulse'
                  : avatarState === 'celebrating'
                  ? 'bg-amber-400 animate-bounce'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-slate-200 uppercase tracking-wider font-bold text-[10px]">
              {avatarState === 'speaking'
                ? 'AI Speaking...'
                : avatarState === 'thinking'
                ? 'Processing Thought...'
                : avatarState === 'celebrating'
                ? 'Task Celebrated!'
                : avatarState === 'listening'
                ? 'Listening to Voice...'
                : 'AI Ready'}
            </span>
          </div>

          {/* Controls Bar Overlay (Voice Toggle & Replay Greeting) */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
            <button
              onClick={() => {
                const newVoice = !voiceEnabled;
                setVoiceEnabled(newVoice);
                if (!newVoice) voiceEngine.stop();
              }}
              className={`p-2 rounded-xl transition-colors ${
                voiceEnabled ? 'text-cyan-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
              }`}
              title={voiceEnabled ? 'Mute AI Speech Voice' : 'Enable AI Speech Voice'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={triggerGreeting}
              className="p-2 rounded-xl text-purple-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Replay 3D Avatar Greeting Speech"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Live Subtitle / Spoken Greeting Text Overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-purple-500/30 p-3 rounded-2xl backdrop-blur-2xl text-center shadow-2xl">
            <p className="text-xs sm:text-sm font-medium text-slate-100 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />
              <span>
                "Hello! Welcome to Nexus AI. I'm your personal AI Creator. What would you like to create today?"
              </span>
            </p>
          </div>
        </div>

        {/* Central Futuristic Prompt Input Bar */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCustomPromptSubmit}
          className="w-full max-w-2xl relative group mt-6"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-cyan-500 to-indigo-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-500" />
          <div className="relative flex items-center bg-slate-900/90 backdrop-blur-2xl rounded-2xl border border-white/15 p-2 shadow-2xl">
            <Wand2 className="w-5 h-5 text-cyan-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Talk to 3D AI Assistant (e.g. 'Build a SaaS dashboard', 'Generate logo')..."
              className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none px-3 py-2"
            />
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition-all mr-1.5 ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border-cyan-500/20'
              }`}
              title="Speak to Avatar"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow-lg shadow-purple-950/60 transition-all shrink-0"
            >
              <span>Create</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.form>
      </div>

      {/* ===================================================================
          AI MEMORY DASHBOARD — LIVE GLASSMORPHISM METRIC CARDS
          =================================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto relative z-10 space-y-4"
      >
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span>AI Memory Dashboard</span>
            </h2>
            <p className="text-xs text-slate-400">
              Real-time neural memory telemetry streaming from the Nexus cognition core.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl text-[10px] font-mono text-emerald-300 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Sync</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {memoryMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            const percent = (metric.value / metric.max) * 100;
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="group relative rounded-3xl bg-slate-900/70 border border-white/10 hover:border-purple-500/50 backdrop-blur-2xl p-4 shadow-xl overflow-hidden transition-colors"
              >
                <div
                  className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${metric.gradient} opacity-20 blur-2xl group-hover:opacity-45 transition duration-500 pointer-events-none`}
                />

                <div className="relative z-10 space-y-3">
                  <div className="flex items-start justify-between">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.2 }}
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center text-white shadow-lg shadow-slate-950/70`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span className={`text-[10px] font-mono ${metric.accent} px-2 py-0.5 rounded-full bg-white/5 border border-white/10`}>
                      {percent.toFixed(0)}%
                    </span>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{metric.label}</p>
                    <AnimatedCounter
                      value={metric.value}
                      decimals={metric.decimals}
                      suffix={metric.unit}
                      className="block text-xl font-extrabold text-slate-100 font-mono mt-0.5"
                    />
                  </div>

                  <LiveProgressBar percent={percent} gradient={metric.gradient} />

                  <p className="text-[10px] text-slate-500 font-mono">{metric.hint}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ===================================================================
          LIVE MEMORY STATUS + LIVE AI ACTIVITY
          =================================================================== */}
      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Live Memory Status */}
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl p-5 shadow-2xl overflow-hidden"
        >
          <div className="absolute -top-16 -left-16 w-52 h-52 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>Memory Status</span>
            </h3>
            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest">Streaming</span>
          </div>

          <div className="relative z-10 mt-4 space-y-3">
            {memorySystems.map((system, idx) => {
              const Icon = system.icon;
              return (
                <motion.div
                  key={system.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  whileHover={{ x: 4 }}
                  className="group rounded-2xl bg-slate-950/60 border border-white/5 hover:border-cyan-500/30 p-3 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${system.accent}`} />
                      <span className="text-xs font-semibold text-slate-200 truncate">{system.label}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">
                        <AnimatedCounter value={system.load} decimals={0} suffix="%" />
                      </span>
                      <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border ${
                          system.state === 'Optimal'
                            ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'
                            : system.state === 'Syncing'
                            ? 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10'
                            : system.state === 'Indexing'
                            ? 'text-amber-300 border-amber-500/30 bg-amber-500/10'
                            : 'text-purple-300 border-purple-500/30 bg-purple-500/10'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {system.state}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <LiveProgressBar
                      percent={system.load}
                      gradient="from-purple-500 via-indigo-500 to-cyan-400"
                      height="h-1"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Live AI Activity */}
        <motion.section
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl p-5 shadow-2xl overflow-hidden"
        >
          <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Live AI Activity</span>
            </h3>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-300 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Realtime
            </span>
          </div>

          <div className="relative z-10 mt-4 max-h-[340px] overflow-y-auto pr-1 space-y-2">
            <AnimatePresence initial={false}>
              {activityFeed.map((event) => {
                const Icon = event.icon;
                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: -14, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-emerald-500/30 p-3 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Icon className={`w-3.5 h-3.5 ${event.accent}`} />
                      </span>
                      <span className="text-xs font-medium text-slate-200 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline mr-1.5 -mt-0.5" />
                        {event.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">{event.time}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>

      {/* ===================================================================
          AI STATUS — ANIMATED BADGES
          =================================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto relative z-10 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-fuchsia-400" />
            <span>AI Status</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Agent state machine
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-4">
          {AI_STATUS_BADGES.map((badge) => {
            const Icon = badge.icon;
            const isActive = badge.id === activeStatusId;
            return (
              <motion.div
                key={badge.id}
                animate={
                  isActive
                    ? { scale: [1, 1.06, 1], opacity: 1 }
                    : { scale: 1, opacity: 0.55 }
                }
                transition={isActive ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-[11px] font-bold border transition-colors ${
                  isActive
                    ? `bg-gradient-to-r ${badge.accent} text-white border-white/20 shadow-lg ${badge.ring}`
                    : 'bg-slate-950/60 text-slate-400 border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{badge.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* LARGE ANIMATED CREATOR CARDS SECTION */}
      <div className="max-w-6xl mx-auto space-y-4 relative z-10 pt-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <Sparkle className="w-5 h-5 text-purple-400" />
              <span>Interactive AI Creator Studio</span>
            </h2>
            <p className="text-xs text-slate-400">
              Select a studio card. Your 3D AI Assistant will guide you step by step.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {creatorCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => handleSelectCard(card)}
                className="group relative cursor-pointer rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/50 p-5 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 shadow-xl overflow-hidden"
              >
                {/* Accent Background Glow */}
                <div
                  className={`absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br ${card.gradient} opacity-15 rounded-full blur-2xl group-hover:opacity-35 transition duration-500 pointer-events-none`}
                />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} p-3 text-white flex items-center justify-center shadow-lg shadow-slate-950/80 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-300 group-hover:border-cyan-500/40">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-purple-300 group-hover:text-cyan-300 relative z-10 mt-4">
                  <span>Talk to AI Assistant</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ===================================================================
          CIRCULAR METERS — ANIMATED RADIAL PROGRESS INDICATORS
          =================================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto relative z-10 space-y-4"
      >
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-cyan-400" />
              <span>Neural Resource Meters</span>
            </h2>
            <p className="text-xs text-slate-400">Live radial utilization of memory, context, and compute.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {meters.map((meter) => (
            <CircularMeter key={meter.id} stat={meter} />
          ))}
        </div>
      </motion.section>

      {/* ===================================================================
          SYSTEM TELEMETRY — DASHBOARD CARDS
          =================================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto relative z-10 space-y-4"
      >
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <span>System Telemetry</span>
            </h2>
            <p className="text-xs text-slate-400">Infrastructure, model usage, and network health at a glance.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl text-[10px] font-mono text-cyan-300 uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated every 2s</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {telemetry.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                whileHover={{ y: -5, scale: 1.03 }}
                className={`group relative rounded-3xl bg-gradient-to-br ${stat.gradient} border border-white/10 hover:border-cyan-500/40 backdrop-blur-2xl p-4 shadow-xl overflow-hidden transition-colors`}
              >
                <div className="absolute inset-0 bg-slate-950/60 pointer-events-none" />

                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 ${stat.accent}`} />
                    {stat.text && (
                      <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-300 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {stat.text}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{stat.label}</p>
                  <AnimatedCounter
                    value={stat.value}
                    decimals={stat.decimals}
                    suffix={stat.unit}
                    className="block text-lg font-extrabold text-slate-100 font-mono"
                  />
                  <LiveProgressBar
                    percent={stat.decimals > 0 && stat.unit === '%' ? stat.value : 45 + (idx * 6) % 50}
                    gradient="from-purple-500 via-indigo-500 to-cyan-400"
                    height="h-1"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ===================================================================
          KNOWLEDGE BASE + SEARCH HISTORY
          =================================================================== */}
      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Knowledge Base Panel */}
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl p-5 shadow-2xl overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Knowledge Base</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest">Indexed</span>
          </div>

          <div className="relative z-10 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {knowledgeStats.map((stat, idx) => {
              const Icon = stat.icon;
              const percent = (stat.value / stat.max) * 100;
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="rounded-2xl bg-slate-950/60 border border-white/5 hover:border-amber-500/30 p-3 space-y-2 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${stat.accent}`} />
                      <span className="text-[11px] font-semibold text-slate-300 truncate">{stat.label}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 shrink-0">{percent.toFixed(0)}%</span>
                  </div>
                  <AnimatedCounter
                    value={stat.value}
                    decimals={stat.decimals}
                    suffix={stat.unit}
                    className="block text-base font-extrabold text-slate-100 font-mono"
                  />
                  <LiveProgressBar
                    percent={percent}
                    gradient="from-amber-500 via-orange-500 to-rose-500"
                    height="h-1"
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Search History Panel */}
        <motion.section
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl p-5 shadow-2xl overflow-hidden"
        >
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <span>Search History & Memory Recall</span>
            </h3>
            <Search className="w-4 h-4 text-slate-500" />
          </div>

          <div className="relative z-10 mt-4 space-y-4 max-h-[520px] overflow-y-auto pr-1">
            {/* Recent Prompts */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Recent Prompts
              </p>
              <AnimatePresence initial={false}>
                {recentPrompts.map((prompt) => (
                  <motion.button
                    key={prompt}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    whileHover={{ x: 4 }}
                    onClick={() => setSearchQuery(prompt)}
                    className="w-full text-left flex items-center gap-2 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-purple-500/40 p-2.5 transition-colors"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                    <span className="text-[11px] text-slate-300 truncate">{prompt}</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            {/* Pinned Prompts */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Pin className="w-3 h-3" /> Pinned Prompts
              </p>
              <div className="flex flex-wrap gap-2">
                {PINNED_PROMPTS.map((prompt) => (
                  <motion.button
                    key={prompt}
                    whileHover={{ scale: 1.04, y: -2 }}
                    onClick={() => setSearchQuery(prompt)}
                    className="px-2.5 py-1 rounded-xl bg-slate-950/70 border border-cyan-500/20 hover:border-cyan-400/50 text-[10px] font-mono text-cyan-300 transition-colors"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recent Conversations */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3" /> Recent Conversations
              </p>
              {RECENT_CONVERSATIONS.map((conversation) => (
                <motion.button
                  key={conversation.id}
                  whileHover={{ x: 4 }}
                  onClick={() => onSelectOption('chat', conversation.title)}
                  className="w-full text-left flex items-center justify-between gap-3 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-emerald-500/30 p-2.5 transition-colors"
                >
                  <span className="text-[11px] text-slate-300 truncate">{conversation.title}</span>
                  <span className="text-[9px] font-mono text-slate-500 shrink-0">{conversation.meta}</span>
                </motion.button>
              ))}
            </div>

            {/* Favorite Projects */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Star className="w-3 h-3" /> Favorite Projects
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FAVORITE_PROJECTS.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.02, y: -3 }}
                    className="rounded-2xl bg-slate-950/60 border border-white/5 hover:border-amber-500/30 p-2.5 transition-colors"
                  >
                    <p className="text-[11px] font-semibold text-slate-200 truncate flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-amber-300 shrink-0" />
                      {project.title}
                    </p>
                    <p className="text-[9px] font-mono text-slate-500 mt-0.5 truncate">{project.meta}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Memory Timeline */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <GitBranch className="w-3 h-3" /> Memory Timeline
              </p>
              <div className="relative pl-4 border-l border-white/10 space-y-3">
                <AnimatePresence initial={false}>
                  {memoryTimeline.map((entry) => (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="relative"
                    >
                      <span
                        className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full ${entry.accent} shadow-lg animate-pulse`}
                      />
                      <p className="text-[11px] font-semibold text-slate-200">{entry.label}</p>
                      <p className="text-[10px] text-slate-400 truncate">{entry.detail}</p>
                      <p className="text-[9px] font-mono text-slate-600">{entry.time}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* STEP-BY-STEP GUIDANCE MODAL OVERLAY */}
      <AnimatePresence>
        {selectedCardStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-slate-900/95 border border-purple-500/40 rounded-3xl p-6 text-slate-100 shadow-2xl shadow-purple-950/60 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCardStep(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${selectedCardStep.gradient} text-white`}>
                  <selectedCardStep.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{selectedCardStep.title} Creator Guide</h3>
                  <p className="text-xs text-purple-300 font-mono">Guided by 3D AI Assistant</p>
                </div>
              </div>

              {/* Step Contents */}
              <div className="py-5 space-y-4">
                {/* AI Guidance Speech Bubble */}
                <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 font-medium flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                  <p>{selectedCardStep.speechGuide}</p>
                </div>

                {/* Tech Stack Chips */}
                <div>
                  <label className="text-xs font-mono text-slate-400 mb-2 block">
                    Recommended Tech Stack & Architecture:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCardStep.stacks.map((st: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 border border-white/10 text-xs font-mono text-cyan-300 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prompt Customization Input */}
                <div>
                  <label className="text-xs font-mono text-slate-400 mb-1.5 block">
                    Customize Prompt Goal for AI Agent:
                  </label>
                  <textarea
                    value={guidedPromptInput}
                    onChange={(e) => setGuidedPromptInput(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 text-slate-100 text-xs p-3 rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500/50 font-mono resize-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setSelectedCardStep(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmGuidanceAndExecute}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-950/60 hover:brightness-110 flex items-center gap-2 transition-all"
                >
                  <span>Generate Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
