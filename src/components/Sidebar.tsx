import React from 'react';
import {
  Home,
  ListOrdered,
  Target,
  SlidersHorizontal,
  Plus,
  Wallet,
  Sparkles,
  Download,
  Calendar,
  Handshake,
} from 'lucide-react';
import { FinancialSummary } from '../utils/calculations';
import { formatMoney } from '../utils/formatters';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNewTransaction: () => void;
  onOpenBackupModal: () => void;
  summary: FinancialSummary;
  userName?: string;
  currency?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewTransaction,
  onOpenBackupModal,
  summary,
  userName = 'David',
  currency = 'COP',
}) => {
  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'movimientos', label: 'Historial', icon: ListOrdered },
    { id: 'metas', label: 'Metas & Deudas', icon: Target },
    { id: 'ajustes', label: 'Analíticas & Ajustes', icon: SlidersHorizontal },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 min-h-[calc(100vh-65px)] sticky top-[65px] border-r border-slate-800/80 bg-[#090d16]/60 backdrop-blur-md p-5 justify-between">
      {/* Top Part: Navigation */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
            Navegación
          </span>
          <div className="space-y-1 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Add CTA in Sidebar */}
        <button
          onClick={onOpenNewTransaction}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registrar Movimiento</span>
        </button>

        {/* Live Mini Widget: Hoy */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Presupuesto Hoy</span>
            <span className="text-emerald-400 font-bold tabular-nums">
              {formatMoney(summary.disponibleHoy, currency)}
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                summary.gasHoy > summary.limiteDiario
                  ? 'bg-rose-500'
                  : 'bg-emerald-400'
              }`}
              style={{
                width: `${Math.min(summary.porcentajeGastadoHoy, 100)}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
            <span>Gastado: {formatMoney(summary.gasHoy, currency)}</span>
            <span>{summary.dias}d restantes</span>
          </div>

          {/* Cuentas y Préstamos Quick Summary */}
          <div className="pt-2 mt-2 border-t border-slate-800/70 space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">En cuentas / efectivo:</span>
              <span className="font-bold text-white tabular-nums">{formatMoney(summary.totalEnCuentas, currency)}</span>
            </div>
            {summary.prestamosPorCobrar > 0 && (
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Te deben por cobrar:</span>
                <span className="font-bold text-emerald-400 tabular-nums">{formatMoney(summary.prestamosPorCobrar, currency)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Part: User and Backup */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <button
          onClick={onOpenBackupModal}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Copia de Seguridad</span>
        </button>

        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs">
            {userName.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{userName}</p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Zen: {summary.zenScore}%</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
