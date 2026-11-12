import React, { useState } from 'react';
import {
  SlidersHorizontal,
  PiggyBank,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  Coins,
  User,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { FinzenData } from '../types/financial';
import { FinancialSummary } from '../utils/calculations';
import { formatMoney } from '../utils/formatters';

interface AnalyticsSettingsViewProps {
  data: FinzenData;
  summary: FinancialSummary;
  onUpdateSettings: (newAhorroPct: number, newMoneda: string, newUserName: string) => void;
  onOpenBackupModal: () => void;
  onForzarActualizacion: () => void;
}

export const AnalyticsSettingsView: React.FC<AnalyticsSettingsViewProps> = ({
  data,
  summary,
  onUpdateSettings,
  onOpenBackupModal,
  onForzarActualizacion,
}) => {
  const [ahorroPct, setAhorroPct] = useState<number>(data.ahorroPct || 10);
  const [moneda, setMoneda] = useState<string>(data.moneda || 'COP');
  const [userName, setUserName] = useState<string>(data.userName || 'David');
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(ahorroPct, moneda, userName);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  // Preview of savings with new percentage
  const ahorroSimulado = summary.ing * (ahorroPct / 100);

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* Top Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Analíticas y Configuración</h2>
        <p className="text-xs text-slate-400 mt-1">
          Ajusta tu regla de ahorro, personaliza tu moneda y administra tus respaldos.
        </p>
      </div>

      {savedNotification && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>¡Ajustes financieros actualizados con éxito!</span>
        </div>
      )}

      {/* Financial Zen Score Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Índice de Salud Financiera (Zen Score)
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
              {summary.zenScore} / 100
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              {summary.zenScore >= 80
                ? '¡Excelente ritmo! Estás respetando tu límite diario y apartando tu cuota de ahorro disciplinadamente.'
                : summary.zenScore >= 50
                ? 'Salud financiera moderada. Vigila tus gastos diarios para no comprometer el ahorro del mes.'
                : 'Atención: tus gastos recientes han superado el presupuesto diario sugerido.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0 w-full sm:w-auto">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">Tasa Ahorro Real</span>
              <strong className="text-base text-emerald-400 font-extrabold tabular-nums">
                {Math.round(summary.tasaAhorroReal)}%
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">Meta Ahorro</span>
              <strong className="text-base text-indigo-400 font-extrabold tabular-nums">
                {data.ahorroPct}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Automatic Savings Rule */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Regla de Ahorro Automático</h3>
              <p className="text-xs text-slate-400">
                ¿Qué porcentaje de tus ingresos quieres apartar antes de calcular tu límite diario?
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Porcentaje a reservar:</span>
              <span className="text-xl font-extrabold text-indigo-400 tabular-nums">{ahorroPct}%</span>
            </div>

            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={ahorroPct}
              onChange={(e) => setAhorroPct(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            <div className="flex justify-between text-[11px] text-slate-500">
              <span>0% (Sin ahorro)</span>
              <span>25%</span>
              <span>50% (Ahorro agresivo)</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex justify-between items-center">
              <span>Con tu ingreso mensual actual apartarás:</span>
              <strong className="text-white font-bold tabular-nums">
                {formatMoney(ahorroSimulado, moneda)}
              </strong>
            </div>
          </div>
        </div>

        {/* Profile and Preferences */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Preferencias de Perfil y Moneda</h3>
              <p className="text-xs text-slate-400">Personaliza tu nombre y formato de moneda</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tu Nombre</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="David"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Moneda Principal</label>
              <select
                value={moneda}
                onChange={(e) => setMoneda(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="COP">COP ($) - Peso Colombiano</option>
                <option value="USD">USD ($) - Dólar Estadounidense</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="MXN">MXN ($) - Peso Mexicano</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              Guardar Preferencias
            </button>
          </div>
        </div>
      </form>

      {/* Backup and Sync Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Respaldo y Seguridad</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tus datos están protegidos y guardados en tu navegador con formato Finzen Pro.
            </p>
          </div>
          <button
            onClick={onOpenBackupModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            Gestionar Backup
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={onOpenBackupModal}
            className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-left flex items-center gap-3 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Exportar archivo JSON</span>
              <span className="text-[11px] text-slate-400">Descarga tus datos</span>
            </div>
          </button>

          <button
            onClick={onForzarActualizacion}
            className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-left flex items-center gap-3 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Sincronizar y Actualizar</span>
              <span className="text-[11px] text-slate-400">Verificar nueva versión</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
