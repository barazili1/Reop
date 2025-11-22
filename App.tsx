import React, { useState, useEffect, useRef } from 'react';
import { Shield, Search, Bell, Key as KeyIcon, Clock, Database, LayoutDashboard, Terminal, Settings, Activity, LogOut, Menu, X, ChevronRight, Lock, FileText, Cpu, Network, Server, Wifi, AlertOctagon, Globe, Eye, EyeOff, MousePointerClick, Fingerprint, AlertTriangle, Trash2, Zap, Radio, Disc, Code, Command, ShieldCheck, Thermometer, BarChart3, Download, Filter, RefreshCw, Layers, GitBranch, CheckCircle2, List, CalendarDays, HardDrive, Cloud, ToggleLeft, ToggleRight, Save, UserCog, CreditCard, Archive, Siren, FileKey, Unlock } from 'lucide-react';
import { ApiKey, CreateKeyFormData, KeyType } from './types';
import { KeyList } from './components/KeyList';
import { KeyGenerator } from './components/KeyGenerator';
import { subscribeToKeys, addKeyToFirebase, updateKeyStatusInFirebase, deleteKeyFromFirebase, updateKeyLastUsed, isFirebaseInitialized } from './services/firebaseService';

// --- VISUALIZATION COMPONENTS ---

// Realistic Terminal Log Component
const LiveTerminal = ({ logs, type = 'system' }: { logs: string[], type?: 'system' | 'security' }) => {
    return (
        <div className={`font-mono text-[10px] sm:text-xs leading-relaxed overflow-y-auto h-full flex flex-col-reverse scroll-smooth custom-scrollbar p-2 ${type === 'security' ? 'text-red-400/90' : 'text-emerald-500/90'}`}>
            {/* Reverse mapping to keep newest at bottom conceptually, but we use flex-col-reverse to stick to bottom */}
             {[...logs].reverse().map((log, i) => (
                <div key={i} className={`animate-in slide-in-from-left-2 fade-in duration-300 border-l-2 pl-2 py-0.5 ${type === 'security' ? 'border-transparent hover:border-red-500/30' : 'border-transparent hover:border-emerald-500/30'}`}>
                    <span className={`opacity-40 mr-2 ${type === 'security' ? 'text-red-200' : 'text-emerald-200'}`}>$&gt;</span>
                    <span className={type === 'security' && log.includes('BLOCKED') ? 'text-red-500 font-bold' : ''}>{log}</span>
                </div>
            ))}
        </div>
    );
};

// Professional Hexagonal Mesh Network Visualization
const HexMeshNetwork = () => {
    // Simulated nodes for a hexagonal grid
    const nodes = [
        { x: 50, y: 50, active: true },
        { x: 30, y: 40, active: true }, { x: 70, y: 40, active: true },
        { x: 30, y: 60, active: true }, { x: 70, y: 60, active: true },
        { x: 10, y: 50, active: false }, { x: 90, y: 50, active: false },
        { x: 50, y: 30, active: true }, { x: 50, y: 70, active: true },
        { x: 20, y: 25, active: false }, { x: 80, y: 25, active: true },
        { x: 20, y: 75, active: true }, { x: 80, y: 75, active: false },
    ];

    return (
        <div className="w-full h-full relative overflow-hidden bg-slate-950/50 rounded-lg">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <filter id="glow-hex" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                {/* Connecting Lines */}
                <g stroke="rgba(99, 102, 241, 0.2)" strokeWidth="0.5">
                     <path d="M50 50 L30 40 M50 50 L70 40 M50 50 L30 60 M50 50 L70 60 M50 50 L50 30 M50 50 L50 70" className="animate-pulse" />
                     <path d="M30 40 L10 50 M30 40 L20 25 M70 40 L90 50 M70 40 L80 25" />
                     <path d="M30 60 L10 50 M30 60 L20 75 M70 60 L90 50 M70 60 L80 75" />
                </g>

                {/* Nodes */}
                {nodes.map((node, i) => (
                    <g key={i} className="transition-all duration-1000">
                        <circle 
                            cx={node.x} 
                            cy={node.y} 
                            r={node.active ? "3" : "1.5"} 
                            fill={node.active ? "#10b981" : "#334155"} 
                            className="transition-all duration-500"
                            filter={node.active ? "url(#glow-hex)" : ""}
                        />
                        {node.active && (
                             <circle cx={node.x} cy={node.y} r="5" fill="none" stroke="#10b981" strokeWidth="0.2" opacity="0.5">
                                 <animate attributeName="r" from="3" to="8" dur="2s" repeatCount="indefinite" />
                                 <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                             </circle>
                        )}
                    </g>
                ))}
            </svg>
            <div className="absolute bottom-2 right-3 flex flex-col items-end">
                 <span className="text-[9px] font-mono text-indigo-400 font-bold bg-indigo-950/50 px-1.5 py-0.5 rounded border border-indigo-500/20">MESH_TOPOLOGY_V4</span>
            </div>
        </div>
    );
};

// Enhanced SVG Wave Chart
const NetworkOscilloscope = () => {
    return (
        <div className="w-full h-full flex items-end gap-[1px] opacity-90 overflow-hidden mask-gradient">
            {Array.from({ length: 80 }).map((_, i) => {
                // Simulated multiple sine waves for complexity
                const height = 30 + Math.random() * 50 + Math.sin(i * 0.2) * 20;
                return (
                    <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-indigo-900/50 via-indigo-500 to-cyan-400 rounded-t-[1px] transition-all duration-150 ease-in-out"
                        style={{ 
                            height: `${height}%`,
                            opacity: Math.max(0.4, Math.random()) 
                        }}
                    ></div>
                )
            })}
        </div>
    );
};

// SVG Holographic Globe Simulation
const HoloGlobe = () => (
    <div className="relative w-64 h-64 mx-auto animate-spin-slow [perspective:1000px]">
        <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute inset-2 border border-indigo-400/20 rounded-full rotate-45"></div>
        <div className="absolute inset-4 border border-indigo-300/10 rounded-full -rotate-45"></div>
        {/* Simulated Lat/Long lines */}
        <svg className="w-full h-full opacity-30 animate-pulse-slow" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="0.5" />
            <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#6366f1" strokeWidth="0.5" className="animate-[spin_4s_linear_infinite]" />
            <ellipse cx="50" cy="50" rx="15" ry="45" fill="none" stroke="#6366f1" strokeWidth="0.5" />
            <path d="M5 50 H95 M50 5 V95" stroke="#6366f1" strokeWidth="0.5" />
        </svg>
        {/* Glowing Dots */}
        <div className="absolute top-[30%] left-[40%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] animate-ping"></div>
        <div className="absolute top-[60%] left-[70%] w-1 h-1 bg-red-500 rounded-full shadow-[0_0_10px_red] animate-ping delay-700"></div>
    </div>
);

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={onClose}></div>
            <div className="relative bg-slate-900 border border-red-900/50 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(220,38,38,0.2)] animate-scale-in overflow-hidden">
                <div className="bg-gradient-to-r from-red-950/50 to-slate-900 p-6 border-b border-red-900/20 flex items-center gap-4">
                    <div className="p-3 bg-red-900/20 rounded-full border border-red-500/20">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Confirm Deletion</h3>
                        <p className="text-xs text-red-400">Permanent destructive action</p>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Are you sure you want to permanently delete this API Key? This action cannot be undone and any systems using this key will immediately lose access.
                    </p>
                </div>
                <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-3">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] rounded-lg transition-all flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Forever
                    </button>
                </div>
            </div>
        </div>
    );
};

const RoadmapTimeline = () => {
    const events = [
        { status: 'complete', version: 'v1.0', date: '2024 Q1', title: 'Core Infrastructure', desc: 'Initial Firebase integration and Auth0 setup.' },
        { status: 'complete', version: 'v1.2', date: '2024 Q2', title: 'Security Protocol V2', desc: 'Added temporary key logic and IP binding simulations.' },
        { status: 'current', version: 'v2.0', date: 'NOW', title: 'Nexus Dashboard', desc: 'Real-time telemetry, 3D visualization, and advanced key management.' },
        { status: 'upcoming', version: 'v2.1', date: '2025 Q3', title: 'Hardware 2FA', desc: 'YubiKey support and biometric auth integration.' },
        { status: 'upcoming', version: 'v3.0', date: '2026 Q1', title: 'Decentralized Ledger', desc: 'Blockchain-backed key verification system.' },
    ];

    return (
        <div className="relative border-l border-slate-800 ml-4 space-y-8 py-4">
            {events.map((e, i) => (
                <div key={i} className="relative pl-8 group">
                    <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 transition-all ${e.status === 'complete' ? 'bg-emerald-500 border-emerald-500' : e.status === 'current' ? 'bg-indigo-500 border-indigo-400 animate-pulse shadow-[0_0_10px_#6366f1]' : 'bg-slate-900 border-slate-700'}`}></div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${e.status === 'current' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                {e.version}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{e.date}</span>
                        </div>
                        <h4 className={`text-sm font-bold ${e.status === 'current' ? 'text-white' : 'text-slate-300'}`}>{e.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-md">{e.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const PrivacyModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl animate-scale-in">
                <div className="bg-slate-800/50 p-6 border-b border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-emerald-400" />
                        <h2 className="text-xl font-bold text-white">Privacy Protocol & Data Policy</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
                </div>
                <div className="p-8 overflow-y-auto max-h-[60vh] space-y-6 text-slate-300 leading-relaxed custom-scrollbar">
                    <section>
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Lock className="w-4 h-4 text-indigo-400"/> 1. Data Encryption & Storage</h3>
                        <p className="text-sm">All generated API credentials and access tokens are stored using Firebase Realtime Database with strict security rules. We utilize industry-standard encryption for data in transit. No personally identifiable information (PII) is linked to generated keys unless explicitly provided in the description field.</p>
                    </section>
                    <section>
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-400"/> 2. Usage Scope</h3>
                        <p className="text-sm">The keys generated by Nexus Vault are intended for administrative authentication and resource access control. The "Temporary" key feature creates ephemeral credentials that are automatically flagged as expired by the client-side logic.</p>
                    </section>
                    <div className="bg-indigo-900/20 border border-indigo-500/20 p-4 rounded-lg">
                        <p className="text-xs text-indigo-300 text-center">By using Nexus Vault, you agree to these terms. Last updated: 2025-05-20</p>
                    </div>
                </div>
                <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors">Acknowledge</button>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<KeyType>(KeyType.PERMANENT);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'keys' | 'security' | 'privacy' | 'settings'>('dashboard');
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [securityLogs, setSecurityLogs] = useState<string[]>([]);
  
  // Settings View State
  const [settingsTab, setSettingsTab] = useState<'general' | 'roadmap' | 'logs' | 'policy'>('general');

  // Delete Modal State
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  // Security State Simulations
  const [panicMode, setPanicMode] = useState(false);
  const [ipBinding, setIpBinding] = useState(true);
  const [wafEnabled, setWafEnabled] = useState(true);
  const [ddosProtection, setDdosProtection] = useState(true);
  const [threatLevel, setThreatLevel] = useState<'low' | 'elevated' | 'critical'>('low');
  
  // Add system log helper
  const addLog = (msg: string, type: 'system' | 'security' = 'system') => {
      const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
      const logEntry = `[${timestamp}] ${msg}`;
      if (type === 'system') {
          setSystemLogs(prev => [...prev, logEntry]);
      } else {
          setSecurityLogs(prev => [...prev, logEntry]);
      }
  };

  useEffect(() => {
    const unsubscribe = subscribeToKeys((fetchedKeys) => {
        setKeys(fetchedKeys);
        setLoading(false);
    });
    
    // Initial fake logs
    addLog("System initialized. Establishing secure connection...");
    addLog("Firebase Authentication: HANDSHAKE_OK");
    addLog("IDS Monitor started on port 443", 'security');
    
    return () => unsubscribe();
  }, []);

  // Auto-Delete Expired Keys Logic
  useEffect(() => {
      if (keys.length > 0) {
          const now = Date.now();
          const expiredKeys = keys.filter(k => k.type === KeyType.TEMPORARY && k.expiresAt && k.expiresAt < now);
          
          if (expiredKeys.length > 0) {
              expiredKeys.forEach(key => {
                  addLog(`[AUTO-CLEANUP] Deleting expired key: ${key.id.substring(0,8)}...`);
                  deleteKeyFromFirebase(key.id).then(() => {
                      addLog(`[SUCCESS] Key ${key.name} permanently removed.`);
                  });
              });
          }
      }
  }, [keys]);

  // Simulated System Activity
  useEffect(() => {
      const interval = setInterval(() => {
          const events = [
              "[NET] Verifying handshake...",
              "[INFO] Database sync complete",
              "[AUTH] Token validation request: pk_live_... [OK]",
              "[PERF] Garbage collection started",
              "[WARN] Latency spike on US-East-1 (45ms)",
          ];
           const securityEvents = [
              "[SEC] Port scan detected - BLOCKED IP: 45.22.19.11",
              "[WAF] SQL Injection attempt neutralized",
              "[AUTH] Failed login attempt (root) from 192.168.1.50",
              "[IDS] Unusual payload size detected on endpoint /api/v1/keys",
          ];

          if (Math.random() > 0.7) {
              addLog(events[Math.floor(Math.random() * events.length)]);
          }
          if (Math.random() > 0.85) {
               addLog(securityEvents[Math.floor(Math.random() * securityEvents.length)], 'security');
               // Occasionally spike threat level
               if (Math.random() > 0.9) setThreatLevel('elevated');
               else setTimeout(() => setThreatLevel('low'), 5000);
          }
      }, 2000);
      return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      if (currentView === 'privacy') {
          setPrivacyOpen(true);
          setCurrentView(prev => prev === 'privacy' ? 'dashboard' : prev); 
      }
  }, [currentView]);

  const handleCreateKey = async (data: CreateKeyFormData) => {
    const keyString = data.keyString || `KEY_${Date.now()}`;
    const newKeyData = {
        key: keyString,
        name: data.name,
        description: data.description,
        type: data.type,
        createdAt: Date.now(),
        isActive: true,
        ...(data.type === KeyType.TEMPORARY && { 
            expiresAt: Date.now() + (data.durationHours || 24) * 3600 * 1000 
        })
    };
    
    // Automatically switch to the tab of the key type created so the user sees it
    setActiveTab(data.type);
    
    await addKeyToFirebase(newKeyData);
    addLog(`[ACTION] New credentials generated: ${data.name}`);
  };

  const handleToggleKeyStatus = async (id: string, currentStatus: boolean) => {
      await updateKeyStatusInFirebase(id, !currentStatus);
      addLog(`[ACTION] Key ${id.substring(0,8)} status changed: ${!currentStatus ? 'ACTIVE' : 'BLOCKED'}`);
  };

  const handleDeleteClick = (id: string) => {
      setKeyToDelete(id);
  };

  const confirmDelete = async () => {
      if (keyToDelete) {
          await deleteKeyFromFirebase(keyToDelete);
          addLog(`[WARN] Key ${keyToDelete.substring(0,8)} manually deleted.`);
          setKeyToDelete(null);
      }
  };

  const handleSimulateUsage = (id: string) => {
      updateKeyLastUsed(id);
      addLog(`[TRAFFIC] Verified access using key ${id.substring(0,8)}`);
  };

  // Filter logic
  const filteredKeys = keys.filter(k => {
    const matchesTab = k.type === activeTab;
    const matchesSearch = k.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          k.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (k.description && k.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const activePermanent = keys.filter(k => k.type === KeyType.PERMANENT && k.isActive).length;
  // Count temporary keys that are active and NOT expired
  const activeTemporary = keys.filter(k => {
      if (k.type !== KeyType.TEMPORARY || !k.isActive) return false;
      // If it has an expiresAt, check if it's in the future. If no expiresAt, assume valid (though temp keys usually have one)
      return k.expiresAt ? k.expiresAt > Date.now() : true;
  }).length;
  
  const totalKeys = activePermanent + activeTemporary;
  // Mock security score calculation
  const securityScore = Math.min(100, Math.max(0, 95 - (keys.filter(k => !k.isActive).length * 2) + (ipBinding ? 5 : -10)));

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col relative overflow-x-hidden pb-32">
        
        {/* Background Grid */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none z-0"></div>
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-900/10 blur-[120px] pointer-events-none z-0"></div>

        <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
        <DeleteConfirmationModal 
            isOpen={!!keyToDelete} 
            onClose={() => setKeyToDelete(null)} 
            onConfirm={confirmDelete} 
        />

        {/* --- ENHANCED TOP HEADER --- */}
        <header className="h-20 flex items-center justify-between px-4 lg:px-8 z-30 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0">
            <div className="flex items-center gap-6 flex-1">
                {/* Brand */}
                <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-white/10 group">
                        <Shield className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="hidden md:block">
                        <h1 className="font-bold text-lg tracking-tight text-white leading-none">NEXUS<span className="text-indigo-400">VAULT</span></h1>
                        <div className="flex items-center gap-1.5 mt-1">
                             <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                             <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">System Online</span>
                        </div>
                    </div>
                </div>

                {/* Redesigned Search Bar */}
                <div className="max-w-md w-full hidden md:block group relative">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-lg blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center bg-slate-900/50 border border-slate-800 group-focus-within:border-indigo-500/50 rounded-lg px-3 py-2.5 transition-all duration-300 group-focus-within:ring-1 group-focus-within:ring-indigo-500/20">
                        <Search className="w-4 h-4 text-slate-500 mr-3" />
                        <input 
                            type="text" 
                            placeholder="Search keys, protocols, or logs..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-600 w-full font-medium"
                        />
                        <div className="flex items-center gap-1">
                            <div className="bg-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-500 border border-slate-700 font-mono">⌘</div>
                            <div className="bg-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-500 border border-slate-700 font-mono">K</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4 shrink-0">
                {/* Mobile Search Icon */}
                <button className="md:hidden p-2 text-slate-400 hover:text-white">
                    <Search className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
                     <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isFirebaseInitialized() ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isFirebaseInitialized() ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                     </span>
                     <span className="text-[10px] font-mono text-slate-400 font-bold">{isFirebaseInitialized() ? 'DB CONNECTED' : 'DISCONNECTED'}</span>
                </div>

                <button 
                    onClick={() => setCurrentView('settings')}
                    className="w-9 h-9 bg-indigo-950 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-900/50 hover:border-indigo-400 hover:text-white transition-all cursor-pointer shadow-[0_0_10px_rgba(99,102,241,0.1)]"
                >
                    <Settings className="w-4 h-4" />
                </button>
            </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 lg:p-6 z-10 relative">

            {/* --- VIEW: DASHBOARD (REALISTIC COMMAND CENTER) --- */}
            {currentView === 'dashboard' && (
                <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Left Column: System Vitals */}
                    <div className="col-span-12 lg:col-span-3 space-y-6">
                         <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-lg">
                             <div className="flex justify-between items-center mb-6">
                                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                     <Activity className="w-4 h-4 text-indigo-500" /> Vitals
                                 </h3>
                                 <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">OPTIMAL</span>
                             </div>
                             
                             <div className="space-y-6">
                                 {/* CPU Widget */}
                                 <div className="relative group">
                                     <div className="flex justify-between text-xs mb-2 font-mono text-slate-300">
                                         <span className="flex items-center gap-1.5"><Cpu className="w-3 h-3" /> CPU_LOAD</span>
                                         <span className="text-indigo-300">34%</span>
                                     </div>
                                     <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50 relative">
                                         <div className="h-full bg-indigo-500 w-[34%] group-hover:animate-pulse shadow-[0_0_10px_#6366f1]"></div>
                                     </div>
                                     <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                         <span>2.4GHz</span>
                                         <span className="flex items-center gap-1"><Thermometer className="w-2.5 h-2.5"/> 42°C</span>
                                     </div>
                                 </div>
                                 
                                 {/* RAM Widget */}
                                 <div className="relative group">
                                     <div className="flex justify-between text-xs mb-2 font-mono text-slate-300">
                                         <span className="flex items-center gap-1.5"><Database className="w-3 h-3" /> MEM_ALLOC</span>
                                         <span className="text-purple-300">6.2GB</span>
                                     </div>
                                     <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50 relative">
                                         <div className="h-full bg-purple-500 w-[62%] group-hover:animate-pulse shadow-[0_0_10px_#a855f7]"></div>
                                     </div>
                                 </div>

                                 {/* Security Score */}
                                 <div className="pt-4 border-t border-slate-800/50">
                                     <div className="flex items-end justify-between mb-2">
                                         <span className="text-xs font-bold text-slate-400">SECURITY INDEX</span>
                                         <span className={`text-2xl font-bold ${securityScore > 80 ? 'text-emerald-400' : 'text-amber-500'}`}>{securityScore}</span>
                                     </div>
                                     <div className="h-2 bg-slate-950 rounded-full overflow-hidden flex">
                                         <div className={`h-full transition-all duration-1000 ${securityScore > 80 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500 shadow-[0_0_10px_#f59e0b]'}`} style={{width: `${securityScore}%`}}></div>
                                     </div>
                                 </div>
                             </div>
                         </div>

                         {/* Server Cluster Status */}
                         <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-1 shadow-lg overflow-hidden h-48">
                            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2"><Server className="w-3 h-3"/> Node Mesh</span>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                </div>
                            </div>
                            <HexMeshNetwork />
                         </div>
                    </div>

                    {/* Middle Column: Visualizations */}
                    <div className="col-span-12 lg:col-span-6 space-y-6">
                         {/* Main Traffic Monitor */}
                         <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-0 overflow-hidden shadow-xl h-64 relative group">
                             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950/0 to-slate-950/0 pointer-events-none"></div>
                             <div className="absolute top-4 left-4 z-10">
                                 <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                     <Network className="w-4 h-4 text-indigo-400" /> LIVE TRAFFIC
                                 </h3>
                                 <p className="text-[10px] text-slate-500 font-mono mt-0.5">OUTBOUND / INBOUND</p>
                             </div>
                             <div className="absolute top-4 right-4 z-10 flex gap-2">
                                 <span className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded flex items-center gap-1"><Wifi className="w-3 h-3"/> HTTP/2</span>
                                 <span className="px-2 py-1 bg-slate-800 border border-slate-700 text-slate-500 text-[10px] font-bold rounded">WS</span>
                             </div>
                             <div className="h-full w-full pt-16 px-2 pb-0">
                                 <NetworkOscilloscope />
                             </div>
                         </div>

                         {/* Quick Stats Row */}
                         <div className="grid grid-cols-3 gap-4">
                             <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center hover:bg-slate-800/40 transition-colors cursor-default relative overflow-hidden group">
                                 <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                 <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center justify-center gap-1"><KeyIcon className="w-3 h-3"/> Active Keys</div>
                                 <div className="text-2xl font-bold text-white font-mono relative z-10">{totalKeys}</div>
                             </div>
                             <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center hover:bg-slate-800/40 transition-colors cursor-default relative overflow-hidden group">
                                 <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                 <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center justify-center gap-1"><AlertOctagon className="w-3 h-3"/> Threats</div>
                                 <div className="text-2xl font-bold text-rose-500 font-mono relative z-10">0</div>
                             </div>
                             <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center hover:bg-slate-800/40 transition-colors cursor-default relative overflow-hidden group">
                                 <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                 <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center justify-center gap-1"><Activity className="w-3 h-3"/> Uptime</div>
                                 <div className="text-2xl font-bold text-emerald-400 font-mono relative z-10">99.9%</div>
                             </div>
                         </div>
                    </div>

                    {/* Right Column: Terminal & Activity */}
                    <div className="col-span-12 lg:col-span-3 h-full min-h-[300px]">
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col shadow-2xl">
                            <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                                    <Terminal className="w-3 h-3" /> SYSTEM KERNEL
                                </span>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-2 h-2 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-950 relative overflow-hidden">
                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:100%_4px] z-10"></div>
                                <LiveTerminal logs={systemLogs} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- VIEW: KEY MANAGEMENT (PROFESSIONAL REDESIGN) --- */}
            {currentView === 'keys' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
                     
                     {/* Professional Control Header */}
                     <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
                         <div>
                             <div className="flex items-center gap-2 text-indigo-400 font-mono text-[10px] uppercase tracking-widest mb-1">
                                 <Layers className="w-3 h-3" /> Registry V2.4
                             </div>
                             <h2 className="text-2xl font-bold text-white tracking-tight">Credential Management</h2>
                         </div>
                         
                         <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-4 mr-4 pr-4 border-r border-slate-800">
                                <div className="text-right">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Total Keys</div>
                                    <div className="text-lg font-mono font-bold text-white leading-none">{totalKeys}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Active</div>
                                    <div className="text-lg font-mono font-bold text-emerald-400 leading-none">{activePermanent + activeTemporary}</div>
                                </div>
                            </div>
                             <div className="z-[50]">
                                <KeyGenerator onCreate={handleCreateKey} />
                             </div>
                         </div>
                    </div>

                    {/* Action Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-950/60 p-2 rounded-xl border border-slate-800 backdrop-blur-sm sticky top-24 z-20 shadow-lg">
                        <div className="flex items-center gap-2 w-full md:w-auto p-1 bg-slate-900/50 rounded-lg border border-slate-800/50">
                             <button 
                                onClick={() => setActiveTab(KeyType.PERMANENT)}
                                className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === KeyType.PERMANENT ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                            >
                                <KeyIcon className="w-3 h-3" /> PERMANENT
                            </button>
                            <button 
                                onClick={() => setActiveTab(KeyType.TEMPORARY)}
                                className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === KeyType.TEMPORARY ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                            >
                                <Clock className="w-3 h-3" /> TEMPORARY
                            </button>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-72 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Filter by ID, name, or metadata..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div className="h-8 w-px bg-slate-800 mx-1"></div>
                            <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 transition-colors" title="Export CSV">
                                <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 transition-colors" title="Refresh Data">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                         <div className="h-64 w-full rounded-xl bg-slate-900/30 border border-slate-800 flex flex-col items-center justify-center gap-4">
                             <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                             <span className="text-xs text-slate-500 animate-pulse">Decrypting registry...</span>
                         </div>
                    ) : (
                        <KeyList 
                            keys={filteredKeys} 
                            onToggleStatus={handleToggleKeyStatus} 
                            onDelete={handleDeleteClick}
                            onSimulateUsage={handleSimulateUsage}
                        />
                    )}
                </div>
            )}

            {/* --- VIEW: SOC (SECURITY OPERATIONS CENTER) --- */}
            {currentView === 'security' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
                    
                    {/* Header / KPI Cards */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                         {/* Threat Level KPI */}
                         <div className={`bg-slate-900/60 border rounded-xl p-4 flex items-center justify-between relative overflow-hidden ${threatLevel === 'critical' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-800'}`}>
                             {threatLevel === 'critical' && <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>}
                             <div>
                                 <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Threat Level</p>
                                 <h3 className={`text-xl font-black uppercase tracking-tight ${threatLevel === 'low' ? 'text-emerald-400' : threatLevel === 'elevated' ? 'text-amber-400' : 'text-red-500'}`}>
                                     DEFCON {threatLevel === 'low' ? '5' : threatLevel === 'elevated' ? '3' : '1'}
                                 </h3>
                             </div>
                             <div className={`p-3 rounded-lg ${threatLevel === 'low' ? 'bg-emerald-500/10 text-emerald-400' : threatLevel === 'elevated' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-500'}`}>
                                 <Siren className="w-6 h-6" />
                             </div>
                         </div>
                         
                         {/* Active Threats */}
                         <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                             <div>
                                 <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Active Threats</p>
                                 <h3 className="text-xl font-black text-white tracking-tight">0 <span className="text-xs font-normal text-slate-500">DETECTED</span></h3>
                             </div>
                             <div className="p-3 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
                                 <AlertOctagon className="w-6 h-6" />
                             </div>
                         </div>

                         {/* WAF Status */}
                         <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                             <div>
                                 <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">WAF Efficiency</p>
                                 <h3 className="text-xl font-black text-emerald-400 tracking-tight">99.8%</h3>
                             </div>
                             <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                 <ShieldCheck className="w-6 h-6" />
                             </div>
                         </div>

                         {/* Global Health */}
                         <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                             <div>
                                 <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">System Integrity</p>
                                 <h3 className="text-xl font-black text-white tracking-tight">SECURE</h3>
                             </div>
                             <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                 <Fingerprint className="w-6 h-6" />
                             </div>
                         </div>
                     </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* --- MAP SECTION (8 COLS) --- */}
                        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-0 overflow-hidden min-h-[450px] relative group shadow-2xl flex flex-col">
                             {/* Header */}
                            <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start pointer-events-none">
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2"><Globe className="w-5 h-5 text-indigo-400" /> Global Attack Surface</h2>
                                    <p className="text-slate-400 text-xs mt-1">Real-time geospatial intrusion detection.</p>
                                </div>
                                <div className="flex gap-2 pointer-events-auto">
                                    <span className="text-[10px] bg-slate-950/80 border border-slate-700 px-2 py-1 rounded text-slate-300 flex items-center gap-1 backdrop-blur">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> LIVE
                                    </span>
                                </div>
                            </div>
                            
                            {/* Background Grid */}
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px] z-0"></div>
                            
                            {/* Globe Container */}
                            <div className="flex-1 flex items-center justify-center z-10 py-10">
                                <HoloGlobe />
                            </div>

                            {/* Scan Line */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent h-[20%] animate-slide-down pointer-events-none z-10"></div>

                            {/* Stats Footer */}
                            <div className="bg-slate-950/80 backdrop-blur-sm border-t border-slate-800 p-4 flex justify-between text-xs z-20 relative">
                                <div className="flex gap-6">
                                    <div>
                                        <span className="text-slate-500 block text-[10px] font-bold">REGIONS MONITORED</span>
                                        <span className="text-white font-mono">142</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-[10px] font-bold">ANOMALIES</span>
                                        <span className="text-emerald-400 font-mono">0 DETECTED</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <span className="text-emerald-500 font-bold tracking-wider">SECURE</span>
                                </div>
                            </div>
                        </div>

                        {/* --- SIDE PANEL (4 COLS) --- */}
                        <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
                             {/* Panic Mode */}
                            <div className={`border p-6 rounded-2xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden ${panicMode ? 'bg-red-950/30 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-slate-900/40 border-slate-800'}`}>
                                {panicMode && <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ef444410_10px,#ef444410_20px)] animate-pulse pointer-events-none"></div>}
                                
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-3 rounded-lg border ${panicMode ? 'bg-red-500 text-white border-red-400 animate-pulse' : 'bg-slate-800 text-red-500 border-slate-700'}`}>
                                            <AlertOctagon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-lg ${panicMode ? 'text-red-400' : 'text-white'}`}>PANIC PROTOCOL</h3>
                                            <p className="text-xs text-slate-500">Emergency Lockdown System</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 my-6">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <div className={`w-1.5 h-1.5 rounded-full ${panicMode ? 'bg-red-500' : 'bg-slate-600'}`}></div>
                                            Gateway Shutdown
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <div className={`w-1.5 h-1.5 rounded-full ${panicMode ? 'bg-red-500' : 'bg-slate-600'}`}></div>
                                            Revoke All Active Tokens
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <div className={`w-1.5 h-1.5 rounded-full ${panicMode ? 'bg-red-500' : 'bg-slate-600'}`}></div>
                                            Notify Security Ops
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => {
                                        setPanicMode(!panicMode);
                                        addLog(`[ALERT] ${!panicMode ? 'PANIC MODE INITIATED' : 'PANIC MODE DEACTIVATED'}`, 'security');
                                        setThreatLevel(!panicMode ? 'critical' : 'low');
                                    }}
                                    className={`w-full py-4 rounded-lg font-bold text-sm tracking-widest uppercase transition-all shadow-xl relative overflow-hidden group ${panicMode ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/50' : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-red-500/50'}`}
                                >
                                    <span className="relative z-10">{panicMode ? 'DISENGAGE LOCKDOWN' : 'INITIATE LOCKDOWN'}</span>
                                    {!panicMode && <div className="absolute inset-0 bg-red-600/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                                </button>
                            </div>

                            {/* Live IDS Log */}
                            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-lg min-h-[300px]">
                                <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-red-400 flex items-center gap-2">
                                        <Shield className="w-3 h-3" /> IDS LIVE FEED
                                    </span>
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                </div>
                                <div className="flex-1 relative">
                                    <LiveTerminal logs={securityLogs} type="security" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- BOTTOM ROW (3 COLS) --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         {/* Firewall Rules */}
                        <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Active Firewall Rules
                                    </h3>
                                    <span className="text-[10px] bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded border border-emerald-900/50 font-mono">WAF: ACTIVE</span>
                                </div>
                                <div className="divide-y divide-slate-800/50">
                                    <div className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800 rounded text-indigo-400"><Code className="w-4 h-4"/></div>
                                            <div>
                                                <div className="text-sm font-bold text-white">SQL Injection Filter</div>
                                                <div className="text-xs text-slate-500">Sanitize query params</div>
                                            </div>
                                        </div>
                                        <button onClick={() => setWafEnabled(!wafEnabled)} className={`w-10 h-5 rounded-full transition-colors relative ${wafEnabled ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${wafEnabled ? 'translate-x-5' : ''}`}></div>
                                        </button>
                                    </div>
                                    <div className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800 rounded text-purple-400"><Zap className="w-4 h-4"/></div>
                                            <div>
                                                <div className="text-sm font-bold text-white">DDoS Mitigation</div>
                                                <div className="text-xs text-slate-500">Rate limit > 1k/min</div>
                                            </div>
                                        </div>
                                        <button onClick={() => setDdosProtection(!ddosProtection)} className={`w-10 h-5 rounded-full transition-colors relative ${ddosProtection ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${ddosProtection ? 'translate-x-5' : ''}`}></div>
                                        </button>
                                    </div>
                                    <div className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800 rounded text-amber-400"><Fingerprint className="w-4 h-4"/></div>
                                            <div>
                                                <div className="text-sm font-bold text-white">Geo-Fencing (IP)</div>
                                                <div className="text-xs text-slate-500">Block high-risk regions</div>
                                            </div>
                                        </div>
                                        <button onClick={() => setIpBinding(!ipBinding)} className={`w-10 h-5 rounded-full transition-colors relative ${ipBinding ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${ipBinding ? 'translate-x-5' : ''}`}></div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        {/* Compliance Status */}
                        <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                             <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-400" /> Compliance & Standards
                                </h3>
                            </div>
                            <div className="p-6 space-y-4 flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-400 border border-slate-700">SOC2</div>
                                        <span className="text-sm font-medium text-white">SOC2 Type II</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                        <CheckCircle2 className="w-3 h-3" /> COMPLIANT
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-400 border border-slate-700">GDPR</div>
                                        <span className="text-sm font-medium text-white">GDPR Ready</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                        <CheckCircle2 className="w-3 h-3" /> COMPLIANT
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-400 border border-slate-700">ISO</div>
                                        <span className="text-sm font-medium text-white">ISO 27001</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                        <Clock className="w-3 h-3" /> PENDING
                                    </div>
                                </div>
                            </div>
                        </div>

                         {/* Encryption Status */}
                        <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                             <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-purple-400" /> Encryption Protocol
                                </h3>
                            </div>
                            <div className="p-6 space-y-6 flex-1">
                                <div className="relative">
                                     <div className="flex justify-between text-xs mb-2 text-slate-400">
                                         <span>Data at Rest</span>
                                         <span className="text-emerald-400 font-bold">AES-256</span>
                                     </div>
                                     <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                         <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-full"></div>
                                     </div>
                                </div>
                                <div className="relative">
                                     <div className="flex justify-between text-xs mb-2 text-slate-400">
                                         <span>Data in Transit</span>
                                         <span className="text-emerald-400 font-bold">TLS 1.3</span>
                                     </div>
                                     <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                         <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-full"></div>
                                     </div>
                                </div>
                                <div className="bg-slate-950/50 p-3 rounded border border-slate-800 flex items-start gap-3">
                                    <KeyIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-slate-400 leading-relaxed">
                                        Master keys are rotated automatically every 90 days. Next rotation scheduled for <span className="text-white">June 15, 2025</span>.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

             {/* --- VIEW: SETTINGS & ROADMAP --- */}
            {currentView === 'settings' && (
                 <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-140px)]">
                    
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 shrink-0 space-y-1">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Configuration</h3>
                        <button 
                            onClick={() => setSettingsTab('general')}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${settingsTab === 'general' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                        >
                            <Settings className="w-4 h-4" /> General
                        </button>
                        <button 
                            onClick={() => setSettingsTab('policy')}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${settingsTab === 'policy' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                        >
                            <ShieldCheck className="w-4 h-4" /> Security Policy
                        </button>
                        <button 
                            onClick={() => setSettingsTab('roadmap')}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${settingsTab === 'roadmap' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                        >
                            <GitBranch className="w-4 h-4" /> Roadmap
                        </button>
                        <button 
                            onClick={() => setSettingsTab('logs')}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${settingsTab === 'logs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                        >
                            <List className="w-4 h-4" /> Audit Logs
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-2xl p-8 overflow-y-auto custom-scrollbar relative">
                         <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(63,63,70,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-shimmer pointer-events-none opacity-10"></div>
                         
                         {settingsTab === 'roadmap' && (
                             <div className="max-w-3xl animate-in fade-in duration-300">
                                 <div className="mb-8">
                                     <h2 className="text-2xl font-bold text-white mb-2">System Roadmap</h2>
                                     <p className="text-slate-400 text-sm">Track the evolution of the Nexus Vault infrastructure and upcoming security milestones.</p>
                                 </div>
                                 <RoadmapTimeline />
                             </div>
                         )}

                         {settingsTab === 'general' && (
                             <div className="space-y-8 max-w-3xl animate-in fade-in duration-300">
                                 <div>
                                     <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Settings className="w-5 h-5 text-indigo-400"/> Instance Configuration</h2>
                                     
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                         <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-800 rounded text-slate-400"><HardDrive className="w-4 h-4"/></div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-300 uppercase">Disk Usage</div>
                                                    <div className="text-sm font-mono text-white">45.2% Used</div>
                                                </div>
                                            </div>
                                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="w-[45%] h-full bg-indigo-500"></div></div>
                                         </div>
                                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-800 rounded text-slate-400"><Cloud className="w-4 h-4"/></div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-300 uppercase">Sync Rate</div>
                                                    <div className="text-sm font-mono text-emerald-400">24ms</div>
                                                </div>
                                            </div>
                                            <Wifi className="w-4 h-4 text-emerald-500" />
                                         </div>
                                     </div>

                                     <div className="space-y-4">
                                         {/* Settings Toggle Item */}
                                         <div className="flex justify-between items-center bg-slate-950/50 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                                             <div>
                                                 <h4 className="text-sm font-bold text-white flex items-center gap-2"><Terminal className="w-4 h-4 text-slate-500"/> Debug Mode</h4>
                                                 <p className="text-xs text-slate-500 mt-1">Verbose logging for all API transactions to console output.</p>
                                             </div>
                                             <button className="w-12 h-6 bg-slate-800 rounded-full relative transition-colors hover:bg-slate-700">
                                                 <div className="absolute left-1 top-1 w-4 h-4 bg-slate-500 rounded-full transition-transform"></div>
                                             </button>
                                         </div>

                                         <div className="flex justify-between items-center bg-slate-950/50 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                                             <div>
                                                 <h4 className="text-sm font-bold text-white flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500"/> Maintenance Mode</h4>
                                                 <p className="text-xs text-slate-500 mt-1">Reject all incoming traffic except admin. Returns 503 Service Unavailable.</p>
                                             </div>
                                             <button className="w-12 h-6 bg-slate-800 rounded-full relative transition-colors hover:bg-slate-700">
                                                 <div className="absolute left-1 top-1 w-4 h-4 bg-slate-500 rounded-full transition-transform"></div>
                                             </button>
                                         </div>

                                          <div className="flex justify-between items-center bg-slate-950/50 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                                             <div>
                                                 <h4 className="text-sm font-bold text-white flex items-center gap-2"><Archive className="w-4 h-4 text-indigo-500"/> Auto-Archive Logs</h4>
                                                 <p className="text-xs text-slate-500 mt-1">Automatically compress and archive logs older than 30 days.</p>
                                             </div>
                                             <button className="w-12 h-6 bg-indigo-600 rounded-full relative transition-colors">
                                                 <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform translate-x-6"></div>
                                             </button>
                                         </div>
                                     </div>
                                     
                                     <div className="mt-8 pt-6 border-t border-slate-800">
                                         <h3 className="text-sm font-bold text-red-400 mb-4 uppercase tracking-widest">Danger Zone</h3>
                                         <div className="border border-red-900/30 bg-red-950/10 rounded-xl p-4 flex items-center justify-between">
                                             <div>
                                                 <h4 className="text-sm font-bold text-white">Flush All Data</h4>
                                                 <p className="text-xs text-red-400/70">Permanently remove all keys and logs. Cannot be undone.</p>
                                             </div>
                                             <button className="px-4 py-2 bg-red-950 border border-red-900 text-red-400 text-xs font-bold rounded hover:bg-red-900 transition-colors">
                                                 WIPE SYSTEM
                                             </button>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         )}

                         {settingsTab === 'policy' && (
                              <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
                                   <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-400"/> Access Control Policies</h2>
                                   
                                   <div className="grid gap-4">
                                       <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                                           <div className="flex items-start gap-4">
                                               <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg"><UserCog className="w-5 h-5"/></div>
                                               <div className="flex-1">
                                                   <h3 className="text-sm font-bold text-white">Role-Based Access Control (RBAC)</h3>
                                                   <p className="text-xs text-slate-400 mt-1 mb-3">Enforce strict role validation for all admin actions.</p>
                                                   <div className="flex gap-2">
                                                       <span className="text-[10px] px-2 py-1 bg-slate-800 rounded text-slate-300 border border-slate-700">Admin</span>
                                                       <span className="text-[10px] px-2 py-1 bg-slate-800 rounded text-slate-300 border border-slate-700">Auditor</span>
                                                       <span className="text-[10px] px-2 py-1 bg-slate-800 rounded text-slate-300 border border-slate-700">Developer</span>
                                                   </div>
                                               </div>
                                               <div className="text-emerald-400 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> ENFORCED</div>
                                           </div>
                                       </div>

                                       <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                                           <div className="flex items-start gap-4">
                                               <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg"><CreditCard className="w-5 h-5"/></div>
                                               <div className="flex-1">
                                                   <h3 className="text-sm font-bold text-white">API Quota Limits</h3>
                                                   <p className="text-xs text-slate-400 mt-1">Default rate limits applied to new generated keys.</p>
                                                    <div className="mt-3 flex items-center gap-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-slate-500 uppercase font-bold">Free Tier</span>
                                                            <span className="text-sm font-mono text-white">1,000 req/h</span>
                                                        </div>
                                                        <div className="w-px h-6 bg-slate-800"></div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-slate-500 uppercase font-bold">Pro Tier</span>
                                                            <span className="text-sm font-mono text-white">10,000 req/h</span>
                                                        </div>
                                                    </div>
                                               </div>
                                               <button className="text-xs text-indigo-400 hover:text-white font-bold">EDIT</button>
                                           </div>
                                       </div>
                                   </div>
                              </div>
                         )}
                         
                         {settingsTab === 'logs' && (
                             <div className="h-full flex flex-col animate-in fade-in duration-300">
                                 <h2 className="text-xl font-bold text-white mb-6">Immutable Audit Trail</h2>
                                 <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs shadow-inner">
                                     <div className="grid grid-cols-4 gap-4 p-3 bg-slate-900 border-b border-slate-800 text-slate-500 font-bold tracking-wider">
                                         <div>TIMESTAMP</div>
                                         <div className="col-span-2">ACTION_SIGNATURE</div>
                                         <div className="text-right">STATUS_CODE</div>
                                     </div>
                                     <div className="divide-y divide-slate-800/50 overflow-y-auto max-h-[500px] custom-scrollbar">
                                         {[1,2,3,4,5,6,7,8].map(i => (
                                             <div key={i} className="grid grid-cols-4 gap-4 p-3 hover:bg-slate-900/80 transition-colors text-slate-400">
                                                 <div className="text-slate-600">2025-05-20 10:42:{10+i}</div>
                                                 <div className="col-span-2 flex items-center gap-2">
                                                     <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                                     SYSTEM_INTEGRITY_CHECK_ROUTINE
                                                 </div>
                                                 <div className="text-right text-emerald-500 bg-emerald-500/5 inline-block ml-auto px-2 rounded">200 OK</div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                         )}
                    </div>
                </div>
            )}

        </main>

        {/* Enhanced Bottom Dock */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up w-auto max-w-[95vw]">
            <div className="bg-slate-950/80 backdrop-blur-2xl border border-slate-800/80 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,1)] p-1.5 flex items-center gap-1 ring-1 ring-white/5">
                {[
                    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                    { id: 'keys', label: 'Keys', icon: KeyIcon },
                    { id: 'security', label: 'Security', icon: Shield },
                    { id: 'privacy', label: 'Privacy', icon: Lock },
                    { id: 'settings', label: 'Settings', icon: Settings },
                ].map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id as any)}
                            className={`relative group px-5 py-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1.5 min-w-[70px] sm:min-w-[75px] ${
                                isActive
                                ? 'bg-indigo-600 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] scale-105' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:-translate-y-0.5'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'animate-pulse-slow' : 'opacity-70 group-hover:opacity-100'}`} />
                            <span className={`text-[9px] font-bold uppercase tracking-wide transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} absolute -bottom-6 bg-slate-800 px-2 py-0.5 rounded text-white pointer-events-none md:static md:bg-transparent md:p-0 md:opacity-100 hidden md:block`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>

    </div>
  );
};

const Badge = ({ active, text }: { active?: boolean, text?: string }) => {
    if (text) return <span className="text-[10px] font-bold bg-indigo-900/30 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">{text}</span>;
    return null;
}

export default App;