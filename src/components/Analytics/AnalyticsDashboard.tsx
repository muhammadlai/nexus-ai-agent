import React from 'react';
import { BarChart3, Coins, Zap, Database, BrainCircuit, Activity } from 'lucide-react';
import { AnalyticsData } from '../../types';

interface AnalyticsDashboardProps {
  analytics: AnalyticsData;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics }) => {
  return (
    <div className="flex-1 p-6 md:p-8 bg-neutral-950 text-neutral-100 overflow-y-auto space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" /> System Usage & Cost Analytics
        </h2>
        <p className="text-xs text-neutral-400">
          Realtime metrics tracking token consumption, Gemini 2.5 API inference costs, vector database searches, and session activity.
        </p>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
            <span>Total Token Volume</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{analytics.totalTokens.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-mono">Prompt: {(analytics.promptTokens / 1000).toFixed(0)}k | Completion: {(analytics.completionTokens / 1000).toFixed(0)}k</div>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
            <span>Estimated API Cost</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">${analytics.totalCostUSD.toFixed(2)}</div>
          <div className="text-[10px] text-neutral-400 font-mono">Gemini 2.5 Flash & Native Audio</div>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
            <span>Vector RAG Searches</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{analytics.vectorSearchesCount}</div>
          <div className="text-[10px] text-indigo-400 font-mono">Avg Latency: 12ms</div>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
            <span>Active Memory Items</span>
            <BrainCircuit className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{analytics.memoryItemsCount}</div>
          <div className="text-[10px] text-purple-400 font-mono">Auto Context Pre-fetched</div>
        </div>
      </div>

      {/* Daily Usage Chart Simulation */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          Daily Token Inference Volume
        </h3>

        <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-neutral-800">
          {analytics.dailyUsage.map((d, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-mono text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {(d.tokens / 1000).toFixed(0)}k
              </span>
              <div 
                style={{ height: `${(d.tokens / 420000) * 100}%` }} 
                className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all group-hover:from-indigo-500 group-hover:to-purple-400" 
              />
              <span className="text-xs font-mono text-neutral-400">{d.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
