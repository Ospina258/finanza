import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Wallet,
  Target,
  Handshake,
  ChevronRight,
  Sparkles,
  TrendingDown,
  Calendar,
} from 'lucide-react';
import { FinzenData, Meta, Prestamo, Transaction } from '../types/financial';
import { FinancialSummary } from '../utils/calculations';
import { formatMoney, formatLocalDate } from '../utils/formatters';
import { DailyLimitCard } from '../components/DailyLimitCard';
import { AccountsStrip } from '../components/AccountsStrip';
import { ExpenseChart } from '../components/ExpenseChart';
import { CategoryIcon } from '../components/CategoryIcon';
import { getCategoryConfig } from '../utils/categories';

interface DashboardViewProps {
  data: FinzenData;
  summary: FinancialSummary;
  onOpenNewTransaction: () => void;
  onOpenDeposit: (goal: Meta, index: number) => void;
  onOpenLoanPayment: (loan: Prestamo) => void;
  onNavigateTab: (tab: string) => void;
  onOpenGoalModal: () => void;
  onOpenAccountModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  summary,
  onOpenNewTransaction,
  onOpenDeposit,
  onOpenLoanPayment,
  onNavigateTab,
  onOpenGoalModal,
  onOpenAccountModal,
}) => {
  const currency = data.moneda || 'COP';

  const recentTransactions = [...(data.transacciones || [])]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  const activeGoals = (data.metas || []).slice(0, 3);
  const activeLoans = (data.prestamos || [])
    .filter((p) => p.monto - p.pagado > 0)
    .slice(0, 3);

  // Encontrar el valor máximo en los últimos 7 días para escalar las barritas
  const maxSpend7Days = Math.max(...summary.gastosUltimos7Dias.map((d) => d.monto), 1);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Hero: Daily Limit Card */}
      <DailyLimitCard
        summary={summary}
        currency={currency}
        onOpenQuickAdd={onOpenNewTransaction}
      />

      {/* Cuentas & Efectivo Strip */}
      <AccountsStrip
        cuentas={data.cuentas || []}
        totalEnCuentas={summary.totalEnCuentas}
        onOpenAccountModal={onOpenAccountModal}
        currency={currency}
      />

      {/* KPI Cards Grid (4 Columns on Desktop, 2 on Mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Ingresos */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Ingresos</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tabular-nums tracking-tight">
              {formatMoney(summary.ing, currency)}
            </h3>
            <p className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1">
              <span>Este mes</span>
            </p>
          </div>
        </div>

        {/* Card 2: Gastos */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Gastos</span>
            <div className="w-7 h-7 rounded-lg bg-rose-950/60 text-rose-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tabular-nums tracking-tight">
              {formatMoney(summary.gas, currency)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {summary.ing > 0
                ? `${Math.round((summary.gas / summary.ing) * 100)}% del ingreso`
                : 'Sin ingresos registrados'}
            </p>
          </div>
        </div>

        {/* Card 3: Ahorro Previsto */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Ahorro ({data.ahorroPct}%)</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-950/60 text-indigo-400 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tabular-nums tracking-tight">
              {formatMoney(summary.ahorro, currency)}
            </h3>
            <p className="text-[11px] text-indigo-300/90 mt-1">Regla automática</p>
          </div>
        </div>

        {/* Card 4: Disponible Neto */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Disponible Restante</span>
            <div className="w-7 h-7 rounded-lg bg-violet-950/60 text-violet-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-400 tabular-nums tracking-tight">
              {formatMoney(summary.disponible, currency)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Para los {summary.dias} días restantes</p>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Charts and Velocity */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section: Expense Distribution */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Distribución de Gastos</h3>
                <p className="text-xs text-slate-400 mt-0.5">Desglose por categorías en el mes</p>
              </div>
              <span className="text-xs font-semibold text-indigo-400">
                {summary.gastosPorCategoria.length} {summary.gastosPorCategoria.length === 1 ? 'categoría' : 'categorías'}
              </span>
            </div>

            <ExpenseChart
              categories={summary.gastosPorCategoria}
              totalExpenses={summary.gas}
              currency={currency}
            />
          </div>

          {/* Section: 7-Day Spending Velocity */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Ritmo de Gasto Diario</h3>
                <p className="text-xs text-slate-400 mt-0.5">Últimos 7 días</p>
              </div>
              <span className="text-xs text-slate-400">
                Límite: <strong className="text-white">{formatMoney(summary.limiteDiario, currency)}</strong>
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 items-end h-32 pt-4 px-2">
              {summary.gastosUltimos7Dias.map((dia, idx) => {
                const heightPct = Math.max((dia.monto / maxSpend7Days) * 100, 6);
                const isToday = idx === 6;
                const exceeded = dia.monto > summary.limiteDiario && summary.limiteDiario > 0;

                return (
                  <div key={dia.fecha} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                      {dia.monto > 0 ? formatMoney(dia.monto, currency) : '$0'}
                    </div>
                    <div className="w-full max-w-[28px] bg-slate-800 rounded-lg flex items-end p-0.5 h-20">
                      <div
                        className={`w-full rounded-md transition-all duration-500 ${
                          isToday
                            ? exceeded
                              ? 'bg-rose-500 shadow-md shadow-rose-500/30'
                              : 'bg-indigo-500 shadow-md shadow-indigo-500/30'
                            : exceeded
                            ? 'bg-rose-500/60'
                            : 'bg-slate-600 hover:bg-slate-500'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${
                        isToday ? 'text-indigo-400' : 'text-slate-400'
                      }`}
                    >
                      {dia.diaLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Goals, Loans & Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Goals Preview */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Metas de Ahorro</h3>
              </div>
              <button
                onClick={() => onNavigateTab('metas')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeGoals.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                <p>No tienes metas de ahorro activas.</p>
                <button
                  onClick={onOpenGoalModal}
                  className="mt-2 text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  + Crear primera meta
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeGoals.map((m, idx) => {
                  const pct = Math.min(Math.round((m.ahorrado / m.objetivo) * 100), 100);
                  return (
                    <div key={m.nombre + idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-200 truncate">{m.nombre}</span>
                        <span className="text-xs font-bold text-indigo-400 tabular-nums">{pct}%</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-2">
                        <span>{formatMoney(m.ahorrado, currency)}</span>
                        <span>de {formatMoney(m.objetivo, currency)}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: m.color || '#6366f1',
                          }}
                        />
                      </div>
                      <button
                        onClick={() => onOpenDeposit(m, idx)}
                        className="w-full py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-[11px] font-bold text-indigo-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
                      >
                        + Abonar a meta
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Spotlight: Plata que prestaste y a quién */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Handshake className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Plata que Prestaste</h3>
              </div>
              <button
                onClick={() => onNavigateTab('metas')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-baseline justify-between mb-3 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
              <div>
                <span className="text-[10px] uppercase font-semibold text-emerald-300 block">Total por cobrar</span>
                <span className="text-lg font-extrabold text-white tabular-nums">
                  {formatMoney(summary.prestamosPorCobrar, currency)}
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">
                {summary.personasQueDeben.length} {summary.personasQueDeben.length === 1 ? 'persona' : 'personas'}
              </span>
            </div>

            {summary.personasQueDeben.length === 0 ? (
              <p className="text-center py-4 text-xs text-slate-500">
                No tienes préstamos pendientes de cobro.
              </p>
            ) : (
              <div className="space-y-2">
                {summary.personasQueDeben.slice(0, 3).map((item) => {
                  const loanObj = data.prestamos?.find((p) => p.id === item.id);

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/70 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {item.persona.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{item.persona}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            Prestado: {formatMoney(item.monto, currency)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-emerald-400 tabular-nums block">
                          {formatMoney(item.pendiente, currency)}
                        </span>
                        {loanObj && (
                          <button
                            onClick={() => onOpenLoanPayment(loanObj)}
                            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                          >
                            + Abonar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Transactions Preview */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Últimos Movimientos</h3>
              <button
                onClick={() => onNavigateTab('movimientos')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <span>Historial</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentTransactions.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-500">No hay movimientos registrados.</p>
            ) : (
              <div className="space-y-2">
                {recentTransactions.map((t) => {
                  const isIngreso = t.tipo === 'ingreso';
                  const catCfg = getCategoryConfig(t.categoria, t.tipo);

                  return (
                    <div
                      key={t.id}
                      className="p-3 rounded-2xl bg-slate-950/50 hover:bg-slate-950/80 border border-slate-800/60 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: catCfg.bgColor,
                            color: catCfg.color,
                          }}
                        >
                          <CategoryIcon iconName={catCfg.iconName} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{t.categoria}</p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {formatLocalDate(t.fecha)} {t.descripcion ? `· ${t.descripcion}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-extrabold tabular-nums ${
                            isIngreso ? 'text-emerald-400' : 'text-slate-100'
                          }`}
                        >
                          {isIngreso ? '+' : '-'}{formatMoney(t.monto, currency)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
