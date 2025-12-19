
import React, { useState } from 'react';
import { PHASES, MOCK_CHART_DATA, GLOSSARY } from './constants';
import { PhaseType } from './types';
import { 
  Dna, 
  Activity, 
  Zap, 
  Dumbbell, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  BrainCircuit,
  Loader2,
  BookOpen,
  X
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Line
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

/**
 * Component to visualize the cell internals with scientific accuracy.
 */
const CellVisualizer: React.FC<{ phase: PhaseType }> = ({ phase }) => {
  const isMitosis = [PhaseType.PROPHASE, PhaseType.METAPHASE, PhaseType.ANAPHASE, PhaseType.TELOPHASE].includes(phase);
  const isInterphase = [PhaseType.G1, PhaseType.S, PhaseType.G2].includes(phase);
  const isG0 = phase === PhaseType.G0;
  
  const getChromatidState = (chromosomeId: 1 | 2, chromatidId: 1 | 2) => {
    const yOffset = chromosomeId === 1 ? -25 : 25;
    const chromatinPath = "M -15 -5 Q -5 -15 5 -5 T 15 -5";
    const condensedPath = "M 0 -12 L 0 12";
    const xPath1 = "M -10 -10 L 10 10";
    const xPath2 = "M 10 -10 L -10 10";

    switch (phase) {
      case PhaseType.G0:
        return { 
          opacity: chromatidId === 1 ? 0.25 : 0, 
          transform: `translate(${chromosomeId === 1 ? -20 : 20}, ${yOffset}) rotate(${chromosomeId * 60})`,
          path: chromatinPath,
          strokeWidth: 1.5
        };
      case PhaseType.G1:
        return { 
          opacity: chromatidId === 1 ? 0.4 : 0, 
          transform: `translate(${chromosomeId === 1 ? -15 : 15}, ${yOffset}) rotate(${chromosomeId * 45})`,
          path: chromatinPath,
          strokeWidth: 2
        };
      case PhaseType.S:
        return { 
          opacity: 0.5, 
          transform: `translate(${chromatidId === 1 ? -15 : 15}, ${yOffset + (chromatidId === 2 ? 5 : 0)}) rotate(${chromosomeId * 40})`,
          path: chromatinPath,
          strokeWidth: 2
        };
      case PhaseType.G2:
        return { 
          opacity: 0.6, 
          transform: `translate(${chromosomeId === 1 ? -15 : 15}, ${yOffset + (chromatidId === 2 ? 8 : 0)}) rotate(${chromosomeId * 35})`,
          path: chromatinPath,
          strokeWidth: 2.5
        };
      case PhaseType.PROPHASE:
        return { 
          opacity: 1, 
          transform: `translate(${chromosomeId === 1 ? -15 : 15}, ${yOffset}) rotate(0)`,
          path: chromatidId === 1 ? xPath1 : xPath2,
          strokeWidth: 6
        };
      case PhaseType.METAPHASE:
        return { 
          opacity: 1, 
          transform: `translate(0, ${yOffset}) rotate(90)`,
          path: chromatidId === 1 ? xPath1 : xPath2,
          strokeWidth: 6
        };
      case PhaseType.ANAPHASE:
        return { 
          opacity: 1, 
          transform: `translate(${chromatidId === 1 ? -60 : 60}, ${yOffset}) rotate(${chromatidId === 1 ? 45 : -45})`,
          path: condensedPath,
          strokeWidth: 6
        };
      case PhaseType.TELOPHASE:
      case PhaseType.CYTOKINESIS:
        return { 
          opacity: 0.5, 
          transform: `translate(${chromatidId === 1 ? -70 : 70}, ${yOffset / 2}) scale(0.6)`,
          path: chromatinPath,
          strokeWidth: 2
        };
      default:
        return { opacity: 0, transform: '', path: '', strokeWidth: 0 };
    }
  };

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">
      <circle cx="100" cy="100" r="95" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      {phase === PhaseType.CYTOKINESIS && (
        <path d="M 100 5 Q 70 100 100 195 M 100 5 Q 130 100 100 195" fill="none" stroke="rgba(239, 68, 68, 0.6)" strokeWidth="6" className="animate-pulse" />
      )}
      {isMitosis && (
        <g className="transition-opacity duration-1000">
          <g transform="translate(20, 100)"><rect x="-4" y="-8" width="8" height="16" fill="#94a3b8" rx="1" /><rect x="-8" y="-4" width="16" height="8" fill="#94a3b8" rx="1" opacity="0.5" /></g>
          <g transform="translate(180, 100)"><rect x="-4" y="-8" width="8" height="16" fill="#94a3b8" rx="1" /><rect x="-8" y="-4" width="16" height="8" fill="#94a3b8" rx="1" opacity="0.5" /></g>
          <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
          {(phase === PhaseType.METAPHASE || phase === PhaseType.ANAPHASE) && (
            <><line x1="20" y1="100" x2={phase === PhaseType.METAPHASE ? 100 : 40} y2="75" stroke="rgba(59,130,246,0.3)" strokeWidth="1" /><line x1="180" y1="100" x2={phase === PhaseType.METAPHASE ? 100 : 160} y2="75" stroke="rgba(59,130,246,0.3)" strokeWidth="1" /><line x1="20" y1="100" x2={phase === PhaseType.METAPHASE ? 100 : 40} y2="125" stroke="rgba(59,130,246,0.3)" strokeWidth="1" /><line x1="180" y1="100" x2={phase === PhaseType.METAPHASE ? 100 : 160} y2="125" stroke="rgba(59,130,246,0.3)" strokeWidth="1" /></>
          )}
        </g>
      )}
      <circle cx="100" cy="100" r={phase === PhaseType.CYTOKINESIS ? 0 : 65} fill="none" stroke="white" strokeWidth="2" strokeDasharray={phase === PhaseType.PROPHASE ? "10 5" : "0"} opacity={isInterphase || isG0 ? 0.35 : (phase === PhaseType.PROPHASE ? 0.15 : (phase === PhaseType.TELOPHASE ? 0.25 : 0))} className="transition-all duration-1000 ease-in-out" />
      {phase === PhaseType.TELOPHASE && (
        <><circle cx="40" cy="100" r="38" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 2" opacity="0.4" /><circle cx="160" cy="100" r="38" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 2" opacity="0.4" /></>
      )}
      <g transform="translate(100, 100)">
        <g className="transition-all duration-1000">
          {(() => {
            const c1 = getChromatidState(1, 1);
            const c2 = getChromatidState(1, 2);
            return (<><path d={c1.path} transform={c1.transform} stroke="#fbbf24" strokeWidth={c1.strokeWidth} fill="none" strokeLinecap="round" opacity={c1.opacity} className="transition-all duration-1000" /><path d={c2.path} transform={c2.transform} stroke="#fbbf24" strokeWidth={c2.strokeWidth} fill="none" strokeLinecap="round" opacity={c2.opacity} className="transition-all duration-1000" /></>);
          })()}
        </g>
        <g className="transition-all duration-1000">
          {(() => {
            const c1 = getChromatidState(2, 1);
            const c2 = getChromatidState(2, 2);
            return (<><path d={c1.path} transform={c1.transform} stroke="#60a5fa" strokeWidth={c1.strokeWidth} fill="none" strokeLinecap="round" opacity={c1.opacity} className="transition-all duration-1000" /><path d={c2.path} transform={c2.transform} stroke="#60a5fa" strokeWidth={c2.strokeWidth} fill="none" strokeLinecap="round" opacity={c2.opacity} className="transition-all duration-1000" /></>);
          })()}
        </g>
      </g>
      {isG0 && <text x="100" y="30" fill="#64748b" fontSize="9" textAnchor="middle" className="font-bold uppercase tracking-widest">Estado: Reposo Celular</text>}
      {isInterphase && !isG0 && <text x="100" y="30" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle" className="font-bold uppercase tracking-widest">Estado: Cromatina</text>}
      {phase === PhaseType.PROPHASE && <text x="100" y="30" fill="#a855f7" fontSize="10" textAnchor="middle" className="font-black animate-pulse">CONDENSANDO ADN (X)</text>}
    </svg>
  );
};

const PhaseIndicator: React.FC<{ phase: PhaseType; active: boolean; onClick: () => void }> = ({ phase, active, onClick }) => {
  const info = PHASES[phase];
  return (
    <button 
      onClick={onClick}
      className={`flex-1 min-w-[80px] p-3 transition-all duration-300 border-b-4 flex flex-col items-center gap-2
        ${active ? 'bg-slate-800/50 border-white' : 'border-transparent hover:bg-slate-800/30'}`}
      style={{ borderBottomColor: active ? info.color : 'transparent' }}
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: info.color }}>
        <span className="text-white font-black text-[10px]">{phase}</span>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-tight text-center ${active ? 'text-white' : 'text-slate-500'}`}>
        {info.name.split(' ')[0]}
      </span>
    </button>
  );
};

export default function App() {
  const [activePhase, setActivePhase] = useState<PhaseType>(PhaseType.G1);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  const phaseOrder: PhaseType[] = [
    PhaseType.G0,
    PhaseType.G1, 
    PhaseType.S, 
    PhaseType.G2, 
    PhaseType.PROPHASE, 
    PhaseType.METAPHASE, 
    PhaseType.ANAPHASE, 
    PhaseType.TELOPHASE, 
    PhaseType.CYTOKINESIS
  ];

  const currentIndex = phaseOrder.indexOf(activePhase);
  const isMitosis = [PhaseType.PROPHASE, PhaseType.METAPHASE, PhaseType.ANAPHASE, PhaseType.TELOPHASE].includes(activePhase);
  const isInterphase = [PhaseType.G1, PhaseType.S, PhaseType.G2].includes(activePhase);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % phaseOrder.length;
    setActivePhase(phaseOrder[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + phaseOrder.length) % phaseOrder.length;
    setActivePhase(phaseOrder[prevIdx]);
  };

  const askAiCoach = async () => {
    setIsLoadingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Actúa como un fisiólogo celular del deporte. Explica en 3 puntos clave cómo la fase ${activePhase} (${PHASES[activePhase].name}) impacta la regeneración muscular y qué debe hacer el atleta en términos de descanso o nutrición. Sé técnico pero inspirador.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setAiAnalysis(response.text || "No se pudo obtener el análisis.");
    } catch (error) {
      setAiAnalysis("Error conectando con el experto de BioSport.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const activeInfo = PHASES[activePhase];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      <header className="bg-slate-900/95 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-800/50 px-6 py-4 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg border border-white/10">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">BIOSPORT <span className="text-blue-500 italic">PRECISION</span></h1>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.4em]">Advanced Cellular Simulation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsGlossaryOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800 text-[11px] font-black text-blue-400 border border-slate-700 hover:bg-slate-700 transition-all shadow-lg"
          >
            <BookOpen size={16} />
            GLOSARIO
          </button>
          <button 
            onClick={() => setActivePhase(PhaseType.G0)}
            className={`px-6 py-2 rounded-2xl text-[11px] font-black transition-all border ${activePhase === PhaseType.G0 ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}
          >
            MODO G0
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <section className="bg-slate-900/40 rounded-[3rem] p-10 border border-slate-800/50 shadow-2xl relative overflow-hidden backdrop-blur-sm">
            <div className="flex justify-between items-start mb-12">
              <div className="flex flex-col">
                <span className="text-slate-500 text-[11px] font-black uppercase tracking-widest mb-3 px-4 py-1.5 bg-slate-950/80 rounded-full w-fit border border-slate-800">Status Molecular</span>
                <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter" style={{ color: activeInfo.color }}>{activeInfo.name}</h2>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handlePrev} className="p-4 rounded-[1.5rem] bg-slate-800/80 hover:bg-slate-700 text-white transition-all active:scale-90 shadow-xl border border-slate-700"><ChevronLeft size={28} /></button>
                <button onClick={handleNext} className="p-4 rounded-[1.5rem] bg-slate-800/80 hover:bg-slate-700 text-white transition-all active:scale-90 shadow-xl border border-slate-700"><ChevronRight size={28} /></button>
              </div>
            </div>
            <div className="flex justify-center py-6 relative">
              <div className="relative w-80 h-80 flex items-center justify-center">
                <div className="absolute inset-0 border-[12px] border-slate-800/30 rounded-full"></div>
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                   <circle cx="160" cy="160" r="150" fill="transparent" stroke={activeInfo.color} strokeWidth="12" strokeDasharray="942" strokeDashoffset={942 - (942 / phaseOrder.length) * (currentIndex + 1)} className="transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)" strokeLinecap="round" />
                </svg>
                <div className="z-10 w-full h-full p-6"><CellVisualizer phase={activePhase} /></div>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
              {[
                { label: 'CROMOSOMAS', value: activePhase === PhaseType.G0 ? 'INACTIVO' : (activePhase === PhaseType.G1 ? 'CROMATINA 2n' : (isMitosis ? 'X CONDENSADA' : 'CROMATINA 4n')), color: activePhase === PhaseType.G0 ? 'text-slate-500' : 'text-blue-400' },
                { label: 'GENÉTICA', value: activePhase === PhaseType.G0 ? '2n (Static)' : (activePhase === PhaseType.G1 ? '2n (Simple)' : (isInterphase ? '2n (Dupl)' : '2n + 2n')), color: 'text-white' },
                { label: 'VISIBILIDAD', value: isMitosis ? 'MÁXIMA (X)' : 'BAJA (Cromatina)', color: isMitosis ? 'text-amber-400' : 'text-slate-600' },
                { label: 'NÚCLEO', value: isInterphase || activePhase === PhaseType.G0 ? 'INTEGRO' : 'DILUIDO', color: 'text-slate-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-950/60 p-5 rounded-[2rem] border border-slate-800/50 backdrop-blur-md">
                  <p className="text-[10px] text-slate-500 font-black mb-1.5 tracking-tighter">{stat.label}</p>
                  <p className={`text-sm font-black truncate uppercase ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-slate-900/20 rounded-[3rem] p-10 border border-slate-800/50">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 mb-10 text-slate-400"><Zap size={20} className="text-amber-500" />DINÁMICA DE REGENERACIÓN</h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="gradEnergy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gradProtein" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.2} />
                  <XAxis dataKey="time" hide /><YAxis hide domain={[0, 110]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }} itemStyle={{ fontSize: '12px', fontWeight: '900' }} />
                  <Area type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={4} fill="url(#gradEnergy)" name="Energía (ATP)" />
                  <Area type="monotone" dataKey="protein" stroke="#22c55e" strokeWidth={4} fill="url(#gradProtein)" name="Síntesis Muscular" />
                  <Line type="step" dataKey="dna" stroke="#3b82f6" strokeWidth={5} dot={false} name="Carga Genética" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-8">
          <section className="bg-white text-slate-950 rounded-[3rem] p-10 shadow-2xl relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-slate-100 p-3 rounded-2xl"><Info size={24} className="text-slate-700" /></div>
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic underline underline-offset-8">Biokinetics Library</span>
            </div>
            <h3 className="text-4xl font-black mb-6 leading-none tracking-tight">{activeInfo.name}</h3>
            <p className="text-slate-600 leading-relaxed text-base mb-10 font-medium">{activeInfo.description}</p>
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-100/50 shadow-inner">
              <div className="flex items-center gap-4 mb-5"><div className="bg-slate-950 p-2 rounded-lg"><Dumbbell className="text-white" size={20} /></div><h4 className="font-black text-xs uppercase tracking-widest text-slate-900">VISIÓN DEL ENTRENADOR</h4></div>
              <p className="text-slate-800 text-lg leading-snug italic font-bold">"{activeInfo.sportsAnalogy}"</p>
            </div>
          </section>
          <section className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 p-10 opacity-10 transform group-hover:scale-110 transition-transform duration-1000"><BrainCircuit size={180} /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-2"><BrainCircuit size={28} className="text-blue-300" /><h3 className="text-2xl font-black tracking-tight">AI BIOCONTROL</h3></div>
              <p className="text-blue-200 text-xs mb-8 font-black uppercase tracking-widest">Molecular Performance Optimization</p>
              {aiAnalysis && <div className="bg-white/5 backdrop-blur-2xl p-6 rounded-[2rem] text-sm leading-relaxed border border-white/10 mb-8 animate-in slide-in-from-bottom-8 duration-700"><div className="prose prose-invert prose-sm max-w-none"><p className="font-semibold text-blue-50 leading-relaxed whitespace-pre-line">{aiAnalysis}</p></div></div>}
              <button onClick={askAiCoach} disabled={isLoadingAi} className="w-full bg-white text-indigo-900 font-black py-5 rounded-[1.8rem] hover:bg-blue-50 transition-all flex items-center justify-center gap-4 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] disabled:opacity-50 active:scale-95 group">
                {isLoadingAi ? <Loader2 size={24} className="animate-spin" /> : <>ANÁLISIS DE RENDIMIENTO<ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </div>
          </section>
          <div className="bg-slate-900/60 p-3 rounded-[2.5rem] border border-slate-800/50 mt-auto backdrop-blur-md">
             <div className="flex overflow-x-auto gap-2 no-scrollbar p-1">
              {phaseOrder.map((phaseKey) => (<PhaseIndicator key={phaseKey} phase={phaseKey} active={activePhase === phaseKey} onClick={() => setActivePhase(phaseKey)} />))}
             </div>
          </div>
        </div>
      </main>

      {/* Glossary Modal */}
      {isGlossaryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsGlossaryOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <BookOpen className="text-blue-500" />
                <h2 className="text-2xl font-black tracking-tight uppercase">Glosario de Términos</h2>
              </div>
              <button onClick={() => setIsGlossaryOpen(false)} className="p-3 rounded-2xl hover:bg-slate-800 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                {GLOSSARY.map((item) => (
                  <button 
                    key={item.term}
                    onClick={() => setActiveTerm(item.term)}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all border ${activeTerm === item.term ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'}`}
                  >
                    {item.term}
                  </button>
                ))}
              </div>

              <div className="min-h-[160px] bg-slate-950/50 rounded-[2.5rem] p-8 border border-slate-800 flex flex-col justify-center transition-all">
                {activeTerm ? (
                  <div className="animate-in slide-in-from-left-4 duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{GLOSSARY.find(g => g.term === activeTerm)?.icon}</span>
                      <h4 className="text-xl font-black text-blue-400">{activeTerm}</h4>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-medium italic">
                      {GLOSSARY.find(g => g.term === activeTerm)?.definition}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-500 text-center font-bold italic">
                    Selecciona un término arriba para ver su definición molecular.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full py-12 px-6 text-center text-[11px] text-slate-500 leading-relaxed border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center flex-wrap justify-center gap-1">
            <a href="https://ai.studio/apps/drive/1PzYd_x2kDBeXqKjjc9dZh9eBHDD_oNGt" className="hover:text-blue-400 font-bold transition-colors">BioSport: Ciclo Celular Interactivo</a>
            <span>© 2025 by</span>
            <a href="https://www.instagram.com/valderramavernaza/" className="hover:text-blue-400 font-bold transition-colors">Mercedes Valderrama</a>
            <span>is licensed under</span>
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="hover:text-blue-400 font-bold transition-colors">Creative Commons Attribution-ShareAlike 4.0 International</a>
            <div className="flex items-center ml-2">
              <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="CC" className="w-5 h-5 ml-1" />
              <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="BY" className="w-5 h-5 ml-1" />
              <img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="SA" className="w-5 h-5 ml-1" />
            </div>
          </div>
        </div>
      </footer>

      <footer className="lg:hidden sticky bottom-0 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/50 p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-4"><div className="w-5 h-5 rounded-full ring-4 ring-slate-900" style={{ backgroundColor: activeInfo.color }}></div><span className="text-[12px] font-black uppercase tracking-wider">{activeInfo.name.split(' ')[0]}</span></div>
        <div className="flex gap-4"><button onClick={handlePrev} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 active:bg-slate-700"><ChevronLeft size={20} /></button><button onClick={handleNext} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 active:bg-slate-700"><ChevronRight size={20} /></button></div>
      </footer>
    </div>
  );
}
