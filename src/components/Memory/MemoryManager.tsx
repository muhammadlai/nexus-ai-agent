import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Pin, 
  Plus, 
  Trash2, 
  Sparkles, 
  User, 
  Briefcase, 
  Target, 
  FileCheck, 
  Settings,
  Search,
  Check,
  Tag
} from 'lucide-react';
import { MemoryItem } from '../../types';

interface MemoryManagerProps {
  memories: MemoryItem[];
  onAddMemory: (memory: Omit<MemoryItem, 'id' | 'createdAt'>) => void;
  onTogglePinMemory: (id: string, isPinned: boolean) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoryManager: React.FC<MemoryManagerProps> = ({
  memories,
  onAddMemory,
  onTogglePinMemory,
  onDeleteMemory
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<MemoryItem['category']>('preference');
  const [isPinned, setIsPinned] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAddMemory({ title, content, category, isPinned });
    setTitle('');
    setContent('');
    setShowAddModal(false);
  };

  const filteredMemories = memories.filter(m => 
    filterCategory === 'all' ? true : m.category === filterCategory
  );

  const getCategoryIcon = (cat: MemoryItem['category']) => {
    switch (cat) {
      case 'preference': return <User className="w-4 h-4 text-indigo-400" />;
      case 'project': return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'goal': return <Target className="w-4 h-4 text-emerald-400" />;
      case 'custom_instruction': return <Settings className="w-4 h-4 text-purple-400" />;
      default: return <Tag className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-neutral-950 text-neutral-100 overflow-y-auto space-y-8">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-amber-950/30 to-neutral-900 border border-neutral-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BrainCircuit className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-bold text-white">Persistent Memory Engine</h2>
          </div>
          <p className="text-xs text-neutral-400">
            Nexus AI remembers user preferences, active projects, goals, and custom instructions across conversations automatically.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Memory</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'preference', 'project', 'goal', 'custom_instruction'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all border ${
              filterCategory === cat
                ? 'bg-neutral-800 text-white border-neutral-700 shadow-sm'
                : 'text-neutral-400 border-transparent hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
              mem.isPinned 
                ? 'bg-neutral-900 border-amber-500/30 shadow-lg shadow-amber-500/5' 
                : 'bg-neutral-900/60 border-neutral-800'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
                  {getCategoryIcon(mem.category)}
                  {mem.category.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onTogglePinMemory(mem.id, !mem.isPinned)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      mem.isPinned ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-500 hover:text-white'
                    }`}
                    title={mem.isPinned ? 'Unpin Memory' : 'Pin Memory'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteMemory(mem.id)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg transition-colors"
                    title="Delete Memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white">{mem.title}</h4>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">{mem.content}</p>
            </div>

            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>Added {new Date(mem.createdAt).toLocaleDateString()}</span>
              {mem.isPinned && <span className="text-amber-400 font-semibold">Auto-Retrieved</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Add Memory to Vector Store
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Memory Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Preferred Language: Urdu"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="preference">User Preference</option>
                <option value="project">Project Specification</option>
                <option value="goal">Goal / Objective</option>
                <option value="custom_instruction">Custom Instruction</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Memory Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe what Nexus AI should always remember..."
                rows={3}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pinToggle"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="rounded border-neutral-800 bg-neutral-950 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="pinToggle" className="text-xs font-medium text-neutral-300">
                Pin memory for mandatory pre-answer retrieval
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-5 py-2 rounded-xl text-xs shadow-lg shadow-amber-500/20"
              >
                Save Memory
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
