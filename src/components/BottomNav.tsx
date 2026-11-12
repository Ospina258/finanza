import React from 'react';
import { Home, ListOrdered, Target, SlidersHorizontal, Plus } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNewTransaction: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewTransaction,
}) => {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'movimientos', label: 'Historial', icon: ListOrdered },
    { id: 'metas', label: 'Metas', icon: Target },
    { id: 'ajustes', label: 'Ajustes', icon: SlidersHorizontal },
  ];

  return (
    <>
      {/* Floating Center Action Button (FAB) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <button
          onClick={onOpenNewTransaction}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border-4 border-[#090d16]"
          aria-label="Nuevo movimiento"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 pb-safe pt-1">
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto">
          {/* Tab 1: Inicio */}
          <button
            onClick={() => onSelectTab(tabs[0].id)}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-all cursor-pointer ${
              currentTab === tabs[0].id ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px] tracking-tight">{tabs[0].label}</span>
          </button>

          {/* Tab 2: Movimientos */}
          <button
            onClick={() => onSelectTab(tabs[1].id)}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-all cursor-pointer ${
              currentTab === tabs[1].id ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListOrdered className="w-5 h-5 mb-1" />
            <span className="text-[10px] tracking-tight">{tabs[1].label}</span>
          </button>

          {/* Tab 3: Empty center slot for elevated FAB */}
          <div className="min-h-[48px] pointer-events-none" />

          {/* Tab 4: Metas */}
          <button
            onClick={() => onSelectTab(tabs[2].id)}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-all cursor-pointer ${
              currentTab === tabs[2].id ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-5 h-5 mb-1" />
            <span className="text-[10px] tracking-tight">{tabs[2].label}</span>
          </button>

          {/* Tab 5: Ajustes */}
          <button
            onClick={() => onSelectTab(tabs[3].id)}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-all cursor-pointer ${
              currentTab === tabs[3].id ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5 mb-1" />
            <span className="text-[10px] tracking-tight">{tabs[3].label}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
