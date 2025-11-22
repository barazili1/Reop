import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { KeyType, CreateKeyFormData } from '../types';
import { Button } from './Button';
import { generateSmartDescription } from '../services/geminiService';
import { Sparkles, Plus, Clock, Key, X, CalendarDays, RefreshCw, Fingerprint, Zap, ShieldCheck, ChevronRight, Copy, Check, Tag, FileText } from 'lucide-react';

interface KeyGeneratorProps {
  onCreate: (data: CreateKeyFormData) => void;
}

const generateFormattedKey = (prefix: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomBytes = new Uint8Array(16);
    window.crypto.getRandomValues(randomBytes);
    
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += chars[randomBytes[i] % chars.length];
    }

    const formatted = result.match(/.{1,4}/g)?.join('-') || result;
    return `${prefix}_${formatted}`;
};

export const KeyGenerator: React.FC<KeyGeneratorProps> = ({ onCreate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [durationValue, setDurationValue] = useState(1);
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours' | 'days' | 'months' | 'years'>('months');
  const [generatedKey, setGeneratedKey] = useState('');

  const [formData, setFormData] = useState<CreateKeyFormData>({
    name: '',
    description: '',
    type: KeyType.PERMANENT,
    durationHours: 24,
  });

  useEffect(() => {
      if (isOpen) {
          regenerateKey();
      }
  }, [isOpen, formData.type]);

  const regenerateKey = () => {
      const prefix = formData.type === KeyType.PERMANENT ? 'pk_live' : 'tk_tmp';
      setGeneratedKey(generateFormattedKey(prefix));
      setCopied(false);
  };

  const handleEnhanceDescription = async () => {
    if (!formData.description) return;
    setIsEnhancing(true);
    const enhanced = await generateSmartDescription(formData.description);
    setFormData(prev => ({ ...prev, description: enhanced }));
    setIsEnhancing(false);
  };

  const calculateDurationInHours = () => {
    switch (durationUnit) {
        case 'minutes': return durationValue / 60;
        case 'hours': return durationValue;
        case 'days': return durationValue * 24;
        case 'months': return durationValue * 24 * 30;
        case 'years': return durationValue * 24 * 365;
        default: return 24;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
        ...formData,
        durationHours: calculateDurationInHours(),
        keyString: generatedKey
    });
    setIsOpen(false);
    setFormData({
        name: '',
        description: '',
        type: KeyType.PERMANENT,
        durationHours: 24,
    });
    setDurationValue(1);
    setDurationUnit('months');
  };

  const openModal = (type: KeyType) => {
      setFormData(prev => ({ ...prev, type }));
      setIsOpen(true);
  };

  const handleCopyKey = () => {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center perspective-2000 px-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={() => setIsOpen(false)}></div>
      
      <div className="relative w-full max-w-lg transform-style-3d animate-scale-in z-[100001] duration-300 ease-out">
        {/* Glowing Border Effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-50 blur-sm"></div>
        
        <div className="relative bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10">
            
            {/* Header */}
            <div className="relative px-6 py-5 border-b border-white/5 bg-slate-900">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl border shadow-inner ${
                            formData.type === KeyType.PERMANENT 
                                ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                            {formData.type === KeyType.PERMANENT ? <ShieldCheck className="w-6 h-6"/> : <Clock className="w-6 h-6"/>}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight">
                                {formData.type === KeyType.PERMANENT ? 'Permanent Access Key' : 'Temporary Access Token'}
                            </h2>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                Configure security parameters for new credentials
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
                
                {/* Section 1: Security Context */}
                <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500" style={{ animationDelay: '0ms' }}>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        <span>Security Context</span>
                        <span className="w-full h-px bg-slate-800 ml-4"></span>
                    </div>

                    {/* Type Selector Pill */}
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/50 relative h-11">
                         <div 
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-gradient-to-b transition-all duration-300 ease-out shadow-lg ${
                                formData.type === KeyType.PERMANENT 
                                    ? 'left-1 from-indigo-600 to-indigo-700 shadow-indigo-500/20' 
                                    : 'left-[calc(50%+2px)] from-amber-600 to-amber-700 shadow-amber-500/20'
                            }`}
                         ></div>
                         
                         <button
                            type="button"
                            onClick={() => setFormData({...formData, type: KeyType.PERMANENT})}
                            className={`relative flex-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 z-10 transition-colors ${formData.type === KeyType.PERMANENT ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Key className="w-3.5 h-3.5" /> Permanent
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, type: KeyType.TEMPORARY})}
                            className={`relative flex-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 z-10 transition-colors ${formData.type === KeyType.TEMPORARY ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Clock className="w-3.5 h-3.5" /> Temporary
                        </button>
                    </div>

                    {/* Generated Key Display */}
                    <div className="relative group">
                         <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                         <div className="relative flex bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="pl-4 py-3 flex items-center justify-center border-r border-slate-800 bg-slate-900/50">
                                <Fingerprint className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                            </div>
                            <input 
                                type="text" 
                                readOnly
                                value={generatedKey}
                                className="flex-1 px-4 py-3 bg-transparent text-white font-mono text-sm font-medium tracking-wider outline-none"
                            />
                            <div className="flex">
                                <button 
                                    type="button"
                                    onClick={handleCopyKey}
                                    className="px-3 hover:bg-slate-900 text-slate-500 hover:text-emerald-400 transition-colors border-l border-slate-800"
                                    title="Copy to Clipboard"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <button 
                                    type="button"
                                    onClick={regenerateKey}
                                    className="px-3 hover:bg-slate-900 text-slate-500 hover:text-white transition-colors border-l border-slate-800"
                                    title="Regenerate Key"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Identity */}
                <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        <span>Identity</span>
                        <span className="w-full h-px bg-slate-800 ml-4"></span>
                    </div>
                    
                    {/* Name Input */}
                    <div className="group relative">
                        <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                            <Tag className="w-4 h-4" />
                        </div>
                        <input 
                            type="text" 
                            required
                            placeholder="Reference Name (e.g. Production API)"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
                        />
                    </div>

                    {/* Description with AI */}
                    <div className="relative group">
                         <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                            <FileText className="w-4 h-4" />
                        </div>
                        <textarea 
                            placeholder="Briefly describe usage scope..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all min-h-[80px] resize-none text-sm leading-relaxed"
                        />
                        <button 
                            type="button"
                            onClick={handleEnhanceDescription}
                            disabled={!formData.description || isEnhancing}
                            className="absolute bottom-2 right-2 text-[10px] bg-indigo-600/90 text-white px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 transition-all disabled:opacity-0 disabled:scale-90 hover:bg-indigo-500 hover:scale-105 shadow-lg shadow-indigo-500/20 backdrop-blur-sm"
                        >
                            {isEnhancing ? (
                                <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Sparkles className="w-2.5 h-2.5" />
                            )}
                            AI POLISH
                        </button>
                    </div>
                </div>

                {/* Section 3: Constraints (Conditional) */}
                {formData.type === KeyType.TEMPORARY && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500" style={{ animationDelay: '200ms' }}>
                        <div className="flex items-center justify-between text-xs font-bold text-amber-500/70 uppercase tracking-widest mb-2">
                            <span>Constraints</span>
                            <span className="w-full h-px bg-amber-900/20 ml-4"></span>
                        </div>
                        
                         <div className="bg-amber-950/10 border border-amber-500/20 rounded-xl p-4 flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest">
                                <CalendarDays className="w-3.5 h-3.5" /> Expiration
                            </div>
                            <div className="flex gap-0 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden ring-1 ring-transparent focus-within:ring-amber-500/50 transition-all">
                                <input 
                                    type="number"
                                    min="1"
                                    value={durationValue}
                                    onChange={(e) => setDurationValue(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-24 px-4 py-2 bg-transparent text-center text-white font-bold border-r border-slate-800 focus:bg-slate-900 outline-none"
                                />
                                <select 
                                    className="flex-1 px-4 py-2 bg-transparent text-slate-300 focus:text-white cursor-pointer outline-none uppercase text-xs font-bold tracking-wider hover:bg-slate-900/50 transition-colors"
                                    value={durationUnit}
                                    onChange={e => setDurationUnit(e.target.value as any)}
                                >
                                    <option value="minutes">Minutes</option>
                                    <option value="hours">Hours</option>
                                    <option value="days">Days</option>
                                    <option value="months">Months</option>
                                    <option value="years">Years</option>
                                </select>
                            </div>
                            <p className="text-[10px] text-amber-500/60 pl-1">
                                Key will automatically revoke after the specified duration.
                            </p>
                         </div>
                    </div>
                )}

                <div className="pt-4 mt-2 border-t border-slate-800 flex gap-3 animate-in slide-in-from-bottom-4 fade-in duration-500" style={{ animationDelay: '300ms' }}>
                    <Button variant="ghost" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
                    <Button 
                        type="submit" 
                        variant="primary" 
                        className={`flex-[2] shadow-lg ${formData.type === KeyType.PERMANENT ? 'shadow-indigo-500/25' : 'shadow-amber-500/25 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500'}`}
                    >
                        <span className="flex items-center gap-2">
                            {formData.type === KeyType.PERMANENT ? 'Generate Credentials' : 'Start Timer'}
                            <ChevronRight className="w-4 h-4" />
                        </span>
                    </Button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex gap-3">
        <Button 
            variant="secondary" 
            onClick={() => openModal(KeyType.TEMPORARY)}
            icon={<Clock className="w-4 h-4 text-amber-400" />}
            className="border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-950/30 hover:text-amber-100"
        >
            Temp Key
        </Button>
        <Button 
            variant="primary"
            onClick={() => openModal(KeyType.PERMANENT)}
            icon={<Plus className="w-4 h-4" />}
        >
            New Key
        </Button>
      </div>
      
      {isOpen && createPortal(modalContent, document.body)}
    </>
  );
};
