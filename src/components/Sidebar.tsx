import React, { useState } from 'react';
import { 
  MessageSquare, 
  Database, 
  BrainCircuit, 
  Mic, 
  UserCheck, 
  Workflow, 
  Sparkles, 
  BarChart3, 
  ShieldCheck, 
  Settings, 
  Plus, 
  Pin, 
  Folder, 
  Trash2, 
  Search, 
  ChevronRight,
  ChevronDown,
  Bot
} from 'lucide-react';
import { NavigationTab, ChatSession, UserProfile } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateNewChat: () => void;
  onDeleteSession: (id: string) => void;
  user: UserProfile;
  isCollapsed: boolean;
  setIsCollapsed: (col: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateNewChat,
  onDeleteSession,
  user,
  isCollapsed,
  setIsCollapsed
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFolderOpen, setIsFolderOpen] = useState(true);

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedSessions = filteredSessions.filter(s => s.isPinned);
  const unpinnedSessions = filteredSessions.filter(s => !s.isPinned);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'chat', label: 'AI Workspace', icon: <MessageSquare className="w-4 h-4 opacity-70" /> },
    { id: 'knowledge', label: 'Knowledge Base', icon: <Database className="w-4 h-4 opacity-70" /> },
    { id: 'memory', label: 'Memory Vault', icon: <BrainCircuit className="w-4 h-4 opacity-70" />, badge: 'Active' },
    { id: 'voice', label: 'Voice & Urdu Engine', icon: <Mic className="w-4 h-4 opacity-70" />, badge: 'Live' },
    { id: 'avatar', label: '3D Cyber Avatar', icon: <UserCheck className="w-4 h-4 opacity-70" /> },
    { id: 'workflows', label: 'Workflows (n8n)', icon: <Workflow className="w-4 h-4 opacity-70" /> },
    { id: 'prompts', label: 'Prompt Library', icon: <Sparkles className="w-4 h-4 opacity-70" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4 opacity-70" /> },
    { id: 'admin', label: 'Admin & Governance', icon: <ShieldCheck className="w-4 h-4 opacity-70" /> },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-4 h-4 opacity-70" /> },
  ];

  return (
    <aside className={`bg-[#0A0A0A] border-r border-white/10 flex flex-col h-screen transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30">
            <Bot className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-lg">
              NEXUS <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-600/30 text-indigo-400 border border-indigo-500/20 font-mono font-normal">OS</span>
            </div>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Main Action - New Session */}
      <div className="p-4 pb-2">
        <button
          onClick={onCreateNewChat}
          className={`w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all ${isCollapsed ? 'p-2.5' : ''}`}
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span>New Chat Session</span>}
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className="p-4 pt-2 space-y-1">
        {!isCollapsed && (
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Intelligence & Tools
          </div>
        )}
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-white/5 text-white border border-white/10 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={isActive ? 'text-indigo-400' : 'text-slate-400'}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Chat Sessions Tree (Only when Chat Tab active & expand) */}
      {activeTab === 'chat' && !isCollapsed && (
        <div className="flex-1 overflow-y-auto px-4 py-2 border-t border-white/5 mt-2 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input 
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* Pinned Chats */}
          {pinnedSessions.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-1 py-1 flex items-center gap-1.5">
                <Pin className="w-3 h-3 text-amber-400" /> Pinned Sessions
              </div>
              <div className="space-y-0.5 mt-1">
                {pinnedSessions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectSession(s.id)}
                    className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      activeSessionId === s.id
                        ? 'bg-white/10 text-white font-medium border border-white/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate pr-2">{s.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(s.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Chat Folders */}
          <div>
            <button 
              onClick={() => setIsFolderOpen(!isFolderOpen)}
              className="w-full text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-1 py-1 flex items-center justify-between hover:text-slate-400"
            >
              <div className="flex items-center gap-1.5">
                <Folder className="w-3 h-3 text-indigo-400" /> Recent History
              </div>
              {isFolderOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {isFolderOpen && (
              <div className="space-y-0.5 mt-1">
                {unpinnedSessions.length === 0 ? (
                  <div className="text-xs text-slate-600 px-2 py-1 italic">No recent chats</div>
                ) : (
                  unpinnedSessions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => onSelectSession(s.id)}
                      className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        activeSessionId === s.id
                          ? 'bg-white/10 text-white font-medium border border-white/10'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate pr-2">{s.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(s.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Footer Profile Card */}
      <div className="p-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white shrink-0">
            AZ
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-medium text-white truncate">{user.name}</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Enterprise Ready
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
