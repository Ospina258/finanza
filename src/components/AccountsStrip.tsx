import React from 'react';
import { Building2, Smartphone, Banknote, Plus, ArrowRightLeft, CreditCard, ChevronRight } from 'lucide-react';
import { Cuenta } from '../types/financial';
import { formatMoney } from '../utils/formatters';

interface AccountsStripProps {
  cuentas: Cuenta[];
  totalEnCuentas: number;
  onOpenAccountModal: () => void;
  currency?: string;
}

export const AccountsStrip: React.FC<AccountsStripProps> = ({
  cuentas,
  totalEnCuentas,
  onOpenAccountModal,
  currency = 'COP',
}) => {
  const getIconForType = (tipo: string) => {
    switch (tipo) {
      case 'banco':
        return Building2;
      case 'billetera':
        return Smartphone;
      case 'efectivo':
        return Banknote;
      default:
        return CreditCard;
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
      {/* Header with Total Liquid Money */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Dinero Total en Cuentas y Efectivo
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
              {formatMoney(totalEnCuentas, currency)}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              en {cuentas.length} {cuentas.length === 1 ? 'cuenta' : 'cuentas'}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenAccountModal}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 hover:text-white border border-slate-700/80 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Gestionar / Transferir</span>
        </button>
      </div>

      {/* Grid / Horizontal Carousel of Accounts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {cuentas.map((c) => {
          const IconComponent = getIconForType(c.tipo);

          return (
            <div
              key={c.id}
              onClick={onOpenAccountModal}
              className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${c.color || '#6366f1'}20`,
                    color: c.color || '#6366f1',
                  }}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                {c.numeroOculto && (
                  <span className="text-[10px] text-slate-500 font-mono">{c.numeroOculto}</span>
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-200 truncate group-hover:text-white">
                  {c.nombre}
                </p>
                <p className="text-sm sm:text-base font-extrabold text-white tabular-nums mt-0.5">
                  {formatMoney(c.saldo, currency)}
                </p>
              </div>
            </div>
          );
        })}

        {/* Add Account shortcut */}
        <button
          onClick={onOpenAccountModal}
          className="p-3.5 rounded-2xl bg-slate-950/30 hover:bg-slate-950/70 border border-dashed border-slate-800 hover:border-indigo-500/50 flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer text-slate-400 hover:text-indigo-300"
        >
          <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-400">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold">+ Otra Cuenta</span>
        </button>
      </div>
    </div>
  );
};
