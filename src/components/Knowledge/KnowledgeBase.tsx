import React, { useState } from 'react';
import { 
  Database, 
  Upload, 
  FileText, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Sparkles, 
  FileCode,
  FileSpreadsheet,
  FileImage,
  ArrowRight
} from 'lucide-react';
import { DocumentItem } from '../../types';

interface KnowledgeBaseProps {
  documents: DocumentItem[];
  onUploadDocument: (file: File) => void;
  onDeleteDocument: (id: string) => void;
  onSearchKnowledge: (query: string) => Promise<{ text: string; source: string; score: number }[]>;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  documents,
  onUploadDocument,
  onDeleteDocument,
  onSearchKnowledge
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ text: string; source: string; score: number }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadDocument(e.target.files[0]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await onSearchKnowledge(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const getFileIcon = (type: DocumentItem['fileType']) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-rose-400" />;
      case 'docx': return <FileText className="w-5 h-5 text-blue-400" />;
      case 'csv': return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'image': return <FileImage className="w-5 h-5 text-purple-400" />;
      default: return <FileCode className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-neutral-950 text-neutral-100 overflow-y-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-indigo-950/40 to-neutral-900 border border-neutral-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Database className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-bold text-white">RAG Knowledge Base Engine</h2>
          </div>
          <p className="text-xs text-neutral-400">
            Upload PDF, DOCX, TXT, CSV, and Images. Automatically chunk, embed with Gemini Embeddings, and index into vector store for contextual answer grounding.
          </p>
        </div>

        {/* File Upload Button */}
        <label className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20 transition-all shrink-0">
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
          <input type="file" onChange={handleFileUpload} accept=".pdf,.docx,.txt,.md,.csv,.png,.jpg" className="hidden" />
        </label>
      </div>

      {/* RAG Vector Search Workbench */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Vector Semantic Search Sandbox
        </h3>
        <p className="text-xs text-neutral-400">
          Test similarity queries against indexed vector chunk embeddings before chat inference.
        </p>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter search query (e.g. 'Nexus OS architecture' or 'Urdu speech specs')..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Run Vector Search'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results Display */}
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2 pt-4 border-t border-neutral-800">
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Matched Vector Chunks ({searchResults.length})
            </div>
            {searchResults.map((res, idx) => (
              <div key={idx} className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center justify-between text-neutral-400 font-mono">
                  <span className="text-indigo-400 font-semibold">{res.source}</span>
                  <span className="text-emerald-400 font-bold">Similarity Score: {(res.score * 100).toFixed(0)}%</span>
                </div>
                <p className="text-neutral-200 leading-relaxed font-sans">{res.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Indexed Documents Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Indexed Knowledge Documents ({documents.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="p-5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl space-y-3 cursor-pointer transition-all hover:shadow-xl group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 shrink-0">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">{doc.fileName}</h4>
                    <span className="text-[10px] text-neutral-500 font-mono">{(doc.size / 1024).toFixed(0)} KB • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDocument(doc.id);
                  }}
                  className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Remove from Knowledge Base"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                {doc.summary || doc.textSnippet}
              </p>

              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Indexed
                </span>
                <span className="text-neutral-400">{doc.chunksCount} Vector Chunks</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
