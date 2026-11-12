import React from 'react';
import { Plus, Wallet, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNewTransaction: () => void;
  userName?: string;
  zenScore?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewTransaction,
  userName = 'David',
  zenScore = 85,
}) => {
  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'movimientos', label: 'Movimientos' },
    { id: 'metas', label: 'Metas & Deudas' },
    { id: 'ajustes', label: 'Analíticas' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#090d16]/80 border-b border-slate-800/80 px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('inicio');
              }}
              className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-indigo-300 transition-colors"
            >
              FINZEN
            </a>
            <span className="text-[10px] text-slate-400 font-medium sm:hidden">
              Hola, {userName}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 relative py-1 cursor-pointer ${
                currentTab === item.id ? 'text-white font-semibold' : ''
              }`}
            >
              {item.label}
              {currentTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 Primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Zen:</span>
            <strong className="text-emerald-400 tabular-nums">{zenScore}/100</strong>
          </div>

          <button
            onClick={onOpenNewTransaction}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 active:scale-95 transition-all shadow-md shadow-indigo-600/25 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Movimiento</span>
          </button>
        </div>
      </div>
    </header>
  );
};
