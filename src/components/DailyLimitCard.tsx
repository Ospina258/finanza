import React, { useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, TrendingDown, Calendar, ShieldCheck, Calculator } from 'lucide-react';
import { FinancialSummary } from '../utils/calculations';
import { formatMoney } from '../utils/formatters';

interface DailyLimitCardProps {
  summary: FinancialSummary;
  currency?: string;
  onOpenQuickAdd: () => void;
}

export const DailyLimitCard: React.FC<DailyLimitCardProps> = ({ summary, currency = 'COP', onOpenQuickAdd }) => {
  const [showSimulador, setShowSimulador] = useState(false);
  const [simuladorMonto, setSimuladorMonto] = useState<string>('');

  const {
    limiteDiario,
    gasHoy,
    disponibleHoy,
    porcentajeGastadoHoy,
    dias,
    ahorro,
    disponible,
  } = summary;

  const isExceeded = gasHoy > limiteDiario && limiteDiario > 0;
  const isClose = !isExceeded && porcentajeGastadoHoy >= 80;

  // Calculadora rápida de simulación
  const montoSimulado = Number(simuladorMonto) || 0;
  const nuevoGastoHoy = gasHoy + montoSimulado;
  const simulaExcedido = nuevoGastoHoy > limiteDiario && limiteDiario > 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-800 p-6 text-white shadow-2xl shadow-indigo-950/40 border border-indigo-400/20">
      {/* Ambient background glows */}
      <div className="absolute -right-16 -top-16 w-52 h-52 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-44 h-44 bg-indigo-300/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header pill & Days remaining */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-indigo-100 uppercase">
            Límite Diario Inteligente
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md text-xs text-indigo-100">
          <Calendar className="w-3.5 h-3.5 text-indigo-300" />
          <span className="font-medium">{dias} {dias === 1 ? 'día restante' : 'días restantes'}</span>
        </div>
      </div>

      {/* Big Main Metric */}
      <div className="my-2 relative z-10">
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white tabular-nums drop-shadow-sm">
            {formatMoney(limiteDiario, currency)}
          </h2>
          <span className="text-xs text-indigo-200 font-medium">/ día</span>
        </div>
        <p className="text-xs text-indigo-100/90 mt-1">
          Calculado a partir de tu saldo disponible real descontando ahorro y deudas.
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="my-4 relative z-10">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-indigo-200 font-medium">
            Gastado hoy: <strong className="text-white tabular-nums">{formatMoney(gasHoy, currency)}</strong>
          </span>
          <span className={`font-bold tabular-nums ${isExceeded ? 'text-rose-300' : isClose ? 'text-amber-200' : 'text-indigo-100'}`}>
            {Math.round(porcentajeGastadoHoy)}%
          </span>
        </div>

        {/* Dynamic progress bar */}
        <div className="w-full bg-black/35 rounded-full h-2.5 p-0.5 overflow-hidden backdrop-blur-sm">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isExceeded
                ? 'bg-gradient-to-r from-rose-400 to-rose-500 shadow-sm shadow-rose-500/50'
                : isClose
                ? 'bg-gradient-to-r from-amber-300 to-amber-400'
                : 'bg-gradient-to-r from-emerald-300 to-teal-200 shadow-sm shadow-emerald-400/50'
            }`}
            style={{ width: `${Math.min(porcentajeGastadoHoy, 100)}%` }}
          />
        </div>
      </div>

      {/* Feedback banner */}
      <div className="relative z-10 mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isExceeded ? (
            <div className="flex items-center gap-2 text-rose-200 text-xs font-semibold bg-rose-950/60 border border-rose-500/40 px-3 py-1.5 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Superaste el límite hoy por {formatMoney(gasHoy - limiteDiario, currency)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Te quedan {formatMoney(disponibleHoy, currency)} para hoy</span>
            </div>
          )}
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSimulador(!showSimulador)}
            title="Simular un gasto futuro"
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-xs font-medium text-indigo-100 flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador</span>
          </button>
          <button
            onClick={onOpenQuickAdd}
            className="px-3 py-1.5 rounded-xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 active:scale-95 transition-all text-xs flex items-center gap-1 shadow-md shadow-black/20 cursor-pointer"
          >
            <span>+ Gasto</span>
          </button>
        </div>
      </div>

      {/* Simulator Expansion */}
      {showSimulador && (
        <div className="mt-4 pt-3 border-t border-white/15 relative z-10 animate-fade-in bg-black/25 p-3 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-200 flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" />
              Simulador: ¿Qué pasa si gasto hoy?
            </span>
            <button
              onClick={() => {
                setShowSimulador(false);
                setSimuladorMonto('');
              }}
              className="text-xs text-indigo-300 hover:text-white"
            >
              Cerrar
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Ej: 35000"
              value={simuladorMonto}
              onChange={(e) => setSimuladorMonto(e.target.value)}
              className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-indigo-300/60 focus:outline-none focus:border-white"
            />
          </div>
          {montoSimulado > 0 && (
            <div className="mt-2 text-xs flex items-center justify-between text-indigo-100 bg-white/10 p-2 rounded-lg">
              <span>Nuevo total hoy: <strong className="text-white">{formatMoney(nuevoGastoHoy, currency)}</strong></span>
              {simulaExcedido ? (
                <span className="text-rose-300 font-semibold">⚠️ Excederías por {formatMoney(nuevoGastoHoy - limiteDiario, currency)}</span>
              ) : (
                <span className="text-emerald-300 font-semibold">✅ Aún te sobrarían {formatMoney(limiteDiario - nuevoGastoHoy, currency)}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
