import React from 'react';
import { ShieldCheck, Lock, Activity, Users, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { AuditLogItem } from '../../types';

interface AdminPanelProps {
  logs: AuditLogItem[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ logs }) => {
  return (
    <div className="flex-1 p-6 md:p-8 bg-neutral-950 text-neutral-100 overflow-y-auto space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" /> Enterprise Admin & Security Governance
        </h2>
        <p className="text-xs text-neutral-400">
          JWT Token enforcement, Helmet HTTP headers, CORS policies, rate limiting, and real-time security audit trails.
        </p>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
            <span>JWT Auth & Refresh Tokens</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Active (256-bit RS256)
          </div>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
            <span>Rate Limiting Guard</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" /> 100 reqs / min / IP
          </div>
        </div>

        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
            <span>System User Roles</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-white">
            1 Admin, 3 Developers
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
          Security & Operation Audit Logs
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3">IP</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-850/50">
                  <td className="py-2.5 px-3 text-neutral-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{log.user}</td>
                  <td className="py-2.5 px-3 text-indigo-400">{log.action}</td>
                  <td className="py-2.5 px-3 text-neutral-300">{log.details}</td>
                  <td className="py-2.5 px-3 text-neutral-500">{log.ip}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
