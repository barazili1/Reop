import React, { useEffect, useState } from 'react';
import { ApiKey, KeyType } from '../types';
import { Badge } from './Badge';
import { Copy, Trash2, Eye, EyeOff, Clock, Calendar, Key as KeyIcon, Shield, CheckCircle2, Hash, Timer, Hourglass, Activity, Play, Ban, ShieldCheck, AlertOctagon, Terminal, ChevronDown } from 'lucide-react';

interface KeyListProps {
  keys: ApiKey[];
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onSimulateUsage: (id: string) => void;
}

export const KeyList: React.FC<KeyListProps> = ({ keys, onToggleStatus, onDelete, onSimulateUsage }) => {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleVisibility = (id: string) => {
    const newSet = new Set(visibleKeys);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setVisibleKeys(newSet);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  };

  const formatRelativeTime = (timestamp?: number) => {
      if (!timestamp) return "--";
      const diff = Date.now() - timestamp;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return formatDate(timestamp);
  };

  const getTimeLeft = (expiresAt: number) => {
      if (!expiresAt) return "--";
      const diff = expiresAt - currentTime;
      if (diff <= 0) return "00d 00h 00m 00s";
      
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const getProgressPercentage = (createdAt: number, expiresAt: number) => {
      if (!createdAt || !expiresAt) return 0;
      const totalDuration = expiresAt - createdAt;
      const timeElapsed = currentTime - createdAt;
      const percentage = Math.max(0, Math.min(100, (timeElapsed / totalDuration) * 100));
      return 100 - percentage; // Remaining %
  };

  // Count keys expiring soon (within 24 hours)
  const expiringSoonCount = keys.filter(k => k.type === KeyType.TEMPORARY && k.expiresAt && (k.expiresAt - currentTime < 24 * 60 * 60 * 1000) && (k.expiresAt > currentTime)).length;

  if (keys.length === 0) {
    return (
        <div className="w-full flex justify-center py-20 animate-in fade-in duration-700">
            <div className="text-center py-16 px-10 bg-slate-900/50 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <div className="mx-auto w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-700">
                    <Terminal className="text-slate-500 w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Credentials Found</h3>
                <p className="text-slate-400 text-sm leading-relaxed">The security registry is currently empty. Initialize a new key to begin.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Expiring Keys Warning Banner */}
      {expiringSoonCount > 0 && (
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between animate-pulse-slow backdrop-blur-md">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20">
                      <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div>
                      <h4 className="text-sm font-bold text-amber-400">Expiring Credentials Detected</h4>
                      <p className="text-xs text-amber-500/70">{expiringSoonCount} temporary keys will expire within 24 hours.</p>
                  </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-500 px-3 py-1 bg-amber-500/10 rounded border border-amber-500/20 uppercase tracking-wider">ACTION REQUIRED</span>
          </div>
      )}

      {/* Desktop Table View - Professional Polish */}
      <div className="hidden lg:block bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left text-sm relative border-collapse">
              <thead className="bg-slate-950/90 border-b border-slate-800 sticky top-0 z-10 shadow-lg backdrop-blur-xl">
                  <tr>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px] w-[25%] group cursor-pointer hover:text-slate-300 transition-colors">
                          <div className="flex items-center gap-1">Identity Reference <ChevronDown className="w-3 h-3 opacity-50" /></div>
                      </th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px] w-[25%]">Key Sequence</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Access Status</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Telemetry</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">TTL / Expiry</th>
                      <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px] text-right">Controls</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                  {keys.map((key, index) => {
                      const isExpired = key.expiresAt ? currentTime > key.expiresAt : false;
                      const isExpiringSoon = key.expiresAt && (key.expiresAt - currentTime < 24 * 60 * 60 * 1000) && !isExpired;
                      const isVisible = visibleKeys.has(key.id);
                      const isPermanent = key.type === KeyType.PERMANENT;
                      const progress = !isPermanent && key.expiresAt ? getProgressPercentage(key.createdAt, key.expiresAt) : 100;
                      
                      return (
                      <tr key={key.id} className={`group transition-all duration-300 hover:bg-slate-800/40 animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards ${isExpiringSoon ? 'bg-amber-950/5' : ''}`} style={{ animationDelay: `${index * 50}ms` }}>
                          <td className="px-6 py-4">
                              <div className="flex items-start gap-4">
                                  <div className={`mt-0.5 p-2 rounded-lg border shadow-inner ${
                                      !key.isActive ? 'bg-slate-800 border-slate-700 text-slate-500' :
                                      isPermanent ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                  }`}>
                                     {isPermanent ? <KeyIcon className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                  </div>
                                  <div>
                                    <div className={`font-bold text-sm tracking-tight ${!key.isActive ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{key.name}</div>
                                    <div className="text-slate-500 text-[11px] font-medium mt-0.5 max-w-[200px] leading-relaxed line-clamp-1">{key.description || 'System generated key'}</div>
                                  </div>
                              </div>
                          </td>
                          <td className="px-6 py-4">
                              <div className="flex items-center gap-2 group/key relative">
                                  <div className={`bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-md flex items-center min-w-[220px] transition-colors group-hover:border-slate-700 shadow-sm`}>
                                    <Hash className="w-3 h-3 text-slate-600 mr-2" />
                                    <code className={`font-mono text-xs tracking-wide ${!key.isActive ? 'text-slate-600' : isVisible ? 'text-emerald-400' : 'text-slate-400'}`}>
                                        {isVisible ? key.key : key.key.replace(/([A-Z0-9]{4})-/g, '****-').replace(/_[A-Z0-9-]+/, '_*******************')}
                                    </code>
                                  </div>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                    <button type="button" onClick={() => toggleVisibility(key.id)} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-all" title={isVisible ? "Hide" : "Show"}>
                                        {isVisible ? <EyeOff className="w-3.5 h-3.5"/> : <Eye className="w-3.5 h-3.5"/>}
                                    </button>
                                    <button type="button" onClick={() => copyToClipboard(key.key, key.id)} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-all" title="Copy">
                                        {copiedId === key.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5"/>}
                                    </button>
                                  </div>
                              </div>
                          </td>
                          <td className="px-6 py-4">
                              <Badge active={key.isActive && !isExpired} />
                          </td>
                          <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                   <div className="flex items-center gap-2">
                                      <div className={`w-1.5 h-1.5 rounded-full ${key.lastUsed ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`}></div>
                                      <span className="text-xs font-mono text-slate-400">{formatRelativeTime(key.lastUsed)}</span>
                                   </div>
                                   {key.isActive && !isExpired && (
                                      <button 
                                        type="button"
                                        onClick={() => onSimulateUsage(key.id)}
                                        className="text-[10px] text-indigo-400 hover:text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                          <Play className="w-2 h-2 fill-current" /> PING_TEST
                                      </button>
                                  )}
                              </div>
                          </td>
                          <td className="px-6 py-4">
                               <div className="flex flex-col gap-1.5">
                                   <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 tracking-tight">
                                      <Calendar className="w-3 h-3" />
                                      <span>{formatDate(key.createdAt)}</span>
                                   </div>
                                   
                                   {key.expiresAt && key.isActive && (
                                      <div className="flex flex-col gap-1">
                                          <div className={`flex items-center gap-2 text-xs font-mono font-bold ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                                              <Timer className="w-3 h-3" />
                                              <span className="tabular-nums min-w-[140px]">{isExpired ? 'EXPIRED' : getTimeLeft(key.expiresAt)}</span>
                                          </div>
                                          {!isExpired && (
                                              <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                                                  <div 
                                                    className={`h-full transition-all duration-1000 ease-linear ${progress < 20 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${progress}%` }}
                                                  ></div>
                                              </div>
                                          )}
                                      </div>
                                   )}
                               </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                              <div className="flex justify-end items-center gap-2">
                                  <button 
                                      type="button"
                                      onClick={() => onToggleStatus(key.id, key.isActive)}
                                      className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-[10px] uppercase font-bold border transition-all ${
                                          key.isActive 
                                            ? 'border-slate-700 text-slate-400 hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-950/20' 
                                            : 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40'
                                      }`}
                                  >
                                      {key.isActive ? (
                                          <>
                                              <Ban className="w-3 h-3" />
                                              Block
                                          </>
                                      ) : (
                                          <>
                                              <ShieldCheck className="w-3 h-3" />
                                              Enable
                                          </>
                                      )}
                                  </button>

                                  <button 
                                      type="button"
                                      onClick={() => onDelete(key.id)}
                                      className="p-1.5 rounded-md border border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-900/50 hover:bg-red-950/20 transition-all"
                                      title="Revoke & Delete"
                                  >
                                      <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                              </div>
                          </td>
                      </tr>
                  )})}
              </tbody>
          </table>
        </div>
        
        {/* Footer Pagination Mockup */}
        <div className="bg-slate-950/80 border-t border-slate-800 px-6 py-3 flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-mono">SHOWING {keys.length} ENTRIES</span>
            <div className="flex gap-2">
                <button disabled className="px-2 py-1 rounded border border-slate-800 text-slate-600 text-xs opacity-50 cursor-not-allowed">PREV</button>
                <button className="px-2 py-1 rounded border border-slate-800 text-slate-400 text-xs hover:text-white hover:bg-slate-800">NEXT</button>
            </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden grid gap-4 grid-cols-1 md:grid-cols-2">
        {keys.map((key, index) => {
             const isExpired = key.expiresAt ? currentTime > key.expiresAt : false;
             const isExpiringSoon = key.expiresAt && (key.expiresAt - currentTime < 24 * 60 * 60 * 1000) && !isExpired;
             const isPermanent = key.type === KeyType.PERMANENT;
             const progress = !isPermanent && key.expiresAt ? getProgressPercentage(key.createdAt, key.expiresAt) : 0;
             
             return (
              <div key={key.id} className={`bg-slate-900/50 backdrop-blur-sm p-5 rounded-xl border relative overflow-hidden card-3d group ${!key.isActive ? 'border-slate-800 opacity-75' : 'border-slate-700/50'} ${isExpiringSoon ? 'shadow-[0_0_20px_rgba(245,158,11,0.1)] border-amber-900/30' : ''}`} style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Expiration Warning Overlay */}
                  {key.isActive && isExpiringSoon && (
                      <div className="absolute top-0 right-0 p-2">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                          </span>
                      </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3">
                          <div className={`p-2.5 rounded-lg h-fit ${!key.isActive ? 'bg-slate-800 text-slate-500' : 'bg-slate-800 text-white shadow-lg shadow-indigo-500/10'}`}>
                              {isPermanent ? <KeyIcon className="w-5 h-5" /> : <Clock className="w-5 h-5 text-amber-400" />}
                          </div>
                          <div>
                              <h3 className={`font-bold text-base ${!key.isActive ? 'text-slate-500 line-through' : 'text-white'}`}>{key.name}</h3>
                              <div className="flex items-center gap-2 mt-1.5">
                                  <Badge active={key.isActive && !isExpired} />
                              </div>
                          </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                            type="button"
                            onClick={() => onToggleStatus(key.id, key.isActive)}
                            className={`p-2 rounded-lg border ${key.isActive ? 'border-slate-700 text-slate-400 hover:text-amber-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}
                        >
                            {key.isActive ? <Ban className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                        </button>
                        <button 
                            type="button"
                            onClick={() => onDelete(key.id)}
                            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-red-400 hover:bg-red-950/20"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 group-hover:border-slate-600 transition-colors relative">
                           <code className="text-xs font-mono text-slate-300 break-all">
                               {visibleKeys.has(key.id) ? key.key : key.key.substring(0, 15) + '...'}
                           </code>
                           <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => toggleVisibility(key.id)} className="text-slate-500 hover:text-white"><Eye className="w-3.5 h-3.5"/></button>
                                <button onClick={() => copyToClipboard(key.key, key.id)} className="text-slate-500 hover:text-white"><Copy className="w-3.5 h-3.5"/></button>
                           </div>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/50">
                          <div className="text-slate-500 font-medium">
                              {formatDate(key.createdAt)}
                          </div>
                          {key.expiresAt && (
                              <div className="flex flex-col items-end">
                                  <div className={`flex items-center gap-1.5 font-mono font-bold ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                                      {isExpired ? <Hourglass className="w-3 h-3" /> : <Timer className="w-3 h-3" />}
                                      <span>{isExpired ? 'EXPIRED' : getTimeLeft(key.expiresAt)}</span>
                                  </div>
                                  {!isExpired && key.isActive && (
                                      <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                          <div className={`h-full ${progress < 20 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${progress}%`}}></div>
                                      </div>
                                  )}
                              </div>
                          )}
                      </div>
                  </div>
              </div>
        )})}
      </div>
    </div>
  );
};