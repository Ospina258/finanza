import React, { useState } from 'react';
import {
  Target,
  Handshake,
  Plus,
  PiggyBank,
  CheckCircle2,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Meta, Prestamo, PrestamoTipo } from '../types/financial';
import { formatMoney } from '../utils/formatters';

interface GoalsLoansViewProps {
  metas: Meta[];
  prestamos: Prestamo[];
  onOpenNewGoal: () => void;
  onOpenDeposit: (goal: Meta, index: number) => void;
  onDeleteGoal: (index: number) => void;
  onOpenNewLoan: () => void;
  onOpenLoanPayment: (loan: Prestamo) => void;
  onDeleteLoan: (id: number) => void;
  currency?: string;
}

export const GoalsLoansView: React.FC<GoalsLoansViewProps> = ({
  metas,
  prestamos,
  onOpenNewGoal,
  onOpenDeposit,
  onDeleteGoal,
  onOpenNewLoan,
  onOpenLoanPayment,
  onDeleteLoan,
  currency = 'COP',
}) => {
  const [activeSection, setActiveSection] = useState<'metas' | 'prestamos'>('metas');
  const [loanFilter, setLoanFilter] = useState<'todos' | PrestamoTipo>('todos');

  // Metas metrics
  const totalObjetivoMetas = metas.reduce((acc, m) => acc + m.objetivo, 0);
  const totalAhorradoMetas = metas.reduce((acc, m) => acc + m.ahorrado, 0);
  const porcentajeGlobalMetas = totalObjetivoMetas > 0 ? Math.round((totalAhorradoMetas / totalObjetivoMetas) * 100) : 0;

  // Prestamos metrics
  const totalMeDeben = prestamos
    .filter((p) => p.tipo === 'prestado')
    .reduce((acc, p) => acc + Math.max(p.monto - p.pagado, 0), 0);

  const totalYoDebo = prestamos
    .filter((p) => p.tipo === 'debo')
    .reduce((acc, p) => acc + Math.max(p.monto - p.pagado, 0), 0);

  const filteredLoans = prestamos.filter((p) => {
    if (loanFilter !== 'todos' && p.tipo !== loanFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-5xl mx-auto">
      {/* Top Header & Section Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Metas & Control de Deudas</h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestiona tus objetivos de ahorro y mantén tus préstamos bajo control.
          </p>
        </div>

        {/* Section Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveSection('metas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'metas'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Metas de Ahorro ({metas.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('prestamos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'prestamos'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Handshake className="w-4 h-4" />
            <span>Préstamos ({prestamos.length})</span>
          </button>
        </div>
      </div>

      {/* SECTION: METAS */}
      {activeSection === 'metas' && (
        <div className="space-y-6">
          {/* Metas Overall KPI Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left w-full sm:w-auto">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Ahorro Total Acumulado en Metas
              </span>
              <div className="flex items-baseline justify-center sm:justify-start gap-2">
                <h3 className="text-3xl font-extrabold text-white tabular-nums">
                  {formatMoney(totalAhorradoMetas, currency)}
                </h3>
                <span className="text-xs text-slate-400">
                  de {formatMoney(totalObjetivoMetas, currency)}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Progreso global de tus {metas.length} objetivos: <strong className="text-indigo-300">{porcentajeGlobalMetas}%</strong>
              </p>
            </div>

            <button
              onClick={onOpenNewGoal}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Meta</span>
            </button>
          </div>

          {/* Goals Grid */}
          {metas.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 text-indigo-400 mx-auto flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">No tienes metas de ahorro</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Crea objetivos específicos como vacaciones, emergencias o compras importantes para mantenerte motivado.
              </p>
              <button
                onClick={onOpenNewGoal}
                className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors"
              >
                + Crear primera meta
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metas.map((m, idx) => {
                const pct = Math.min(Math.round((m.ahorrado / m.objetivo) * 100), 100);
                const isCompleted = m.ahorrado >= m.objetivo;
                const faltan = Math.max(m.objetivo - m.ahorrado, 0);

                return (
                  <div
                    key={m.nombre + idx}
                    className="p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      {/* Top bar of goal card */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-3.5 h-3.5 rounded-full shrink-0"
                            style={{ backgroundColor: m.color || '#6366f1' }}
                          />
                          <h4 className="text-sm font-bold text-white truncate">{m.nombre}</h4>
                        </div>
                        <button
                          onClick={() => onDeleteGoal(idx)}
                          title="Eliminar meta"
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors opacity-60 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Numbers */}
                      <div className="flex items-baseline justify-between mt-3">
                        <span className="text-lg font-extrabold text-white tabular-nums">
                          {formatMoney(m.ahorrado, currency)}
                        </span>
                        <span className="text-xs font-bold text-indigo-400 tabular-nums">{pct}%</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Meta: {formatMoney(m.objetivo, currency)}
                      </p>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden my-3">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isCompleted ? 'bg-emerald-400' : 'bg-indigo-500'
                          }`}
                          style={{
                            width: `${pct}%`,
                            backgroundColor: isCompleted ? '#10b981' : m.color || '#6366f1',
                          }}
                        />
                      </div>

                      {/* Status */}
                      <div className="text-xs">
                        {isCompleted ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>¡Felicidades! Meta completada</span>
                          </div>
                        ) : (
                          <p className="text-slate-400 text-[11px]">
                            Faltan <strong className="text-slate-200">{formatMoney(faltan, currency)}</strong> para completarla
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onOpenDeposit(m, idx)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white font-bold text-xs border border-slate-700/80 hover:border-indigo-500 transition-all cursor-pointer"
                    >
                      + Abonar a esta Meta
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION: PRÉSTAMOS */}
      {activeSection === 'prestamos' && (
        <div className="space-y-6">
          {/* Dual Balance Cards: Me Deben vs Yo Debo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowDownLeft className="w-4 h-4" />
                  Te Deben (Cuentas por cobrar)
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1 tabular-nums">
                  {formatMoney(totalMeDeben, currency)}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Dinero que te adeudan otras personas</p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowUpRight className="w-4 h-4" />
                  Tú Debes (Deudas por pagar)
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1 tabular-nums">
                  {formatMoney(totalYoDebo, currency)}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Se descuenta de tu límite de gasto diario</p>
              </div>
            </div>
          </div>

          {/* Action & Filter bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                onClick={() => setLoanFilter('todos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  loanFilter === 'todos' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos ({prestamos.length})
              </button>
              <button
                onClick={() => setLoanFilter('prestado')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  loanFilter === 'prestado' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Me deben
              </button>
              <button
                onClick={() => setLoanFilter('debo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  loanFilter === 'debo' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Yo debo
              </button>
            </div>

            <button
              onClick={onOpenNewLoan}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Préstamo</span>
            </button>
          </div>

          {/* Loans List */}
          {filteredLoans.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-950/60 text-orange-400 mx-auto flex items-center justify-center">
                <Handshake className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">No hay préstamos registrados</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Registra préstamos que hayas hecho o deudas pendientes para llevar el control automático.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLoans.map((p) => {
                const pend = Math.max(p.monto - p.pagado, 0);
                const isPaidOff = pend === 0;
                const isReceivable = p.tipo === 'prestado';

                return (
                  <div
                    key={p.id}
                    className={`p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all group ${
                      isPaidOff ? 'opacity-65' : ''
                    }`}
                  >
                    {/* Left details */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            isReceivable
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {isReceivable ? 'Te debe' : 'Le debes'}
                        </span>
                        <h4 className="text-sm font-bold text-white truncate">{p.persona}</h4>
                      </div>

                      {p.descripcion && (
                        <p className="text-xs text-slate-400">{p.descripcion}</p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                        <span>Monto total: <strong className="text-slate-200">{formatMoney(p.monto, currency)}</strong></span>
                        <span>·</span>
                        <span>Pagado: <strong className="text-slate-200">{formatMoney(p.pagado, currency)}</strong></span>
                      </div>
                    </div>

                    {/* Right: Pending and Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-slate-400 block">Saldo Pendiente</span>
                        <span
                          className={`text-base font-extrabold tabular-nums ${
                            isPaidOff ? 'text-slate-400 line-through' : 'text-white'
                          }`}
                        >
                          {formatMoney(pend, currency)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isPaidOff && (
                          <button
                            onClick={() => onOpenLoanPayment(p)}
                            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            Abonar
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteLoan(p.id)}
                          title="Eliminar préstamo"
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-400 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
