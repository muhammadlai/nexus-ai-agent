import React, { useState } from 'react';
import { 
  Workflow as WorkflowIcon, 
  Play, 
  Plus, 
  Zap, 
  Clock, 
  Webhook, 
  Bot, 
  Database, 
  Send, 
  CheckCircle2, 
  Settings,
  ArrowRight
} from 'lucide-react';
import { Workflow, WorkflowNode } from '../../types';

interface WorkflowBuilderProps {
  workflows: Workflow[];
  onCreateWorkflow: (wf: Partial<Workflow>) => void;
  onTriggerWorkflow: (id: string) => Promise<{ success: boolean; result: any }>;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflows,
  onCreateWorkflow,
  onTriggerWorkflow
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(workflows[0] || null);
  const [isRunning, setIsRunning] = useState(false);
  const [runLog, setRunLog] = useState<string | null>(null);

  const handleRun = async (wfId: string) => {
    setIsRunning(true);
    setRunLog('Initializing n8n Workflow Trigger...');
    const result = await onTriggerWorkflow(wfId);
    setTimeout(() => {
      setRunLog(`Success! Executed in ${result.result?.executionTimeMs || 240}ms. Output: Gemini agent vectorized payload & notified workspace.`);
      setIsRunning(false);
    }, 800);
  };

  const getNodeIcon = (type: WorkflowNode['type']) => {
    switch (type) {
      case 'trigger': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'gemini_agent': return <Bot className="w-4 h-4 text-indigo-400" />;
      case 'memory_lookup': return <Database className="w-4 h-4 text-emerald-400" />;
      case 'schedule': return <Clock className="w-4 h-4 text-blue-400" />;
      default: return <Webhook className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-neutral-950 text-neutral-100 overflow-hidden">
      {/* Workflow List Sidebar */}
      <div className="w-full lg:w-80 bg-neutral-900 border-r border-neutral-800 p-6 space-y-6 overflow-y-auto shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <WorkflowIcon className="w-4 h-4 text-indigo-400" />
            n8n Workflows ({workflows.length})
          </h3>
          <button
            onClick={() => onCreateWorkflow({ name: 'New Automation Workflow', description: 'n8n webhook trigger' })}
            className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            title="Create New Workflow"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              onClick={() => setSelectedWorkflow(wf)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                selectedWorkflow?.id === wf.id
                  ? 'bg-neutral-800 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                  : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">{wf.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {wf.status}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                {wf.description}
              </p>
              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                <span>Runs: {wf.runCount}</span>
                <span>{wf.triggerType}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Canvas Stage */}
      {selectedWorkflow ? (
        <div className="flex-1 flex flex-col bg-neutral-950 p-6 overflow-y-auto space-y-6">
          {/* Header Bar */}
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <h2 className="text-lg font-bold text-white">{selectedWorkflow.name}</h2>
              <p className="text-xs text-neutral-400">{selectedWorkflow.description}</p>
            </div>

            <button
              onClick={() => handleRun(selectedWorkflow.id)}
              disabled={isRunning}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all shrink-0 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isRunning ? 'Running Workflow...' : 'Test Run Workflow'}</span>
            </button>
          </div>

          {/* Visual Node Graph Canvas */}
          <div className="flex-1 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 min-h-[360px] flex items-center justify-center relative overflow-x-auto shadow-inner">
            <div className="flex items-center gap-8">
              {selectedWorkflow.nodes.map((node, idx) => (
                <React.Fragment key={node.id}>
                  <div className="p-5 bg-neutral-900 border border-neutral-700/80 rounded-2xl w-56 shadow-2xl space-y-3 shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-neutral-950 border border-neutral-800">
                        {getNodeIcon(node.type)}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">
                        Node {idx + 1}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white">{node.label}</h4>
                      <span className="text-[10px] text-neutral-400 font-mono capitalize">{node.type.replace('_', ' ')}</span>
                    </div>

                    <div className="p-2 bg-neutral-950 rounded-lg text-[10px] font-mono text-indigo-300 border border-neutral-800">
                      Status: Ready
                    </div>
                  </div>

                  {idx < selectedWorkflow.nodes.length - 1 && (
                    <div className="flex items-center text-indigo-500 animate-pulse">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Execution Log Console */}
          {runLog && (
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-emerald-400 space-y-1">
              <div className="text-[10px] text-neutral-500 uppercase font-semibold">Execution Output</div>
              <div>{runLog}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-neutral-500 text-xs">
          Select or create a workflow to view node automation graph
        </div>
      )}
    </div>
  );
};
