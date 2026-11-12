import React, { useState } from 'react';
import { X, Target, PiggyBank, Plus, CheckCircle2 } from 'lucide-react';
import { Meta } from '../types/financial';
import { formatMoney } from '../utils/formatters';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNewGoal: (goal: Omit<Meta, 'id'>) => void;
  onDeposit: (goalIndex: number, amount: number) => void;
  activeGoalForDeposit?: { goal: Meta; index: number } | null;
  currency?: string;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSaveNewGoal,
  onDeposit,
  activeGoalForDeposit,
  currency = 'COP',
}) => {
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [color, setColor] = useState('#10b981');
  const [depositAmount, setDepositAmount] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isDepositMode = Boolean(activeGoalForDeposit);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numObj = parseFloat(objetivo);
    if (!nombre.trim()) {
      setError('Por favor escribe un nombre para tu meta');
      return;
    }
    if (!numObj || numObj <= 0) {
      setError('Por favor indica un monto objetivo válido');
      return;
    }

    onSaveNewGoal({
      nombre: nombre.trim(),
      objetivo: numObj,
      ahorrado: 0,
      color,
    });

    setNombre('');
    setObjetivo('');
    setError('');
    onClose();
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGoalForDeposit) return;
    const numDep = parseFloat(depositAmount);
    if (!numDep || numDep <= 0) {
      setError('Por favor ingresa un monto a abonar válido');
      return;
    }

    onDeposit(activeGoalForDeposit.index, numDep);
    setDepositAmount('');
    setError('');
    onClose();
  };

  const colorOptions = ['#10b981', '#3b82f6', '#6366f1', '#ec4899', '#f59e0b', '#06b6d4'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0f172a] rounded-t-3xl sm:rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d16]/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              {isDepositMode ? <PiggyBank className="w-4 h-4" /> : <Target className="w-4 h-4" />}
            </div>
            <h3 className="text-base font-bold text-white">
              {isDepositMode ? `Abonar a "${activeGoalForDeposit?.goal.nombre}"` : 'Nueva Meta de Ahorro'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {isDepositMode && activeGoalForDeposit ? (
          <form onSubmit={handleDepositSubmit} className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Progreso actual</span>
                <span className="font-bold text-white">
                  {Math.round((activeGoalForDeposit.goal.ahorrado / activeGoalForDeposit.goal.objetivo) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (activeGoalForDeposit.goal.ahorrado / activeGoalForDeposit.goal.objetivo) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-300 pt-1">
                <span>Ahorrado: {formatMoney(activeGoalForDeposit.goal.ahorrado, currency)}</span>
                <span className="text-indigo-400">
                  Faltan: {formatMoney(Math.max(activeGoalForDeposit.goal.objetivo - activeGoalForDeposit.goal.ahorrado, 0), currency)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Monto a Abonar</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="any"
                  autoFocus
                  required
                  value={depositAmount}
                  onChange={(e) => {
                    setDepositAmount(e.target.value);
                    setError('');
                  }}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-xl font-extrabold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Quick deposit buttons */}
              <div className="flex gap-2 pt-1">
                {[50000, 100000, 200000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      const cur = Number(depositAmount) || 0;
                      setDepositAmount(String(cur + val));
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white cursor-pointer"
                  >
                    +{formatMoney(val, currency)}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              Confirmar Abono
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Nombre de la Meta</label>
              <input
                type="text"
                required
                autoFocus
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setError('');
                }}
                placeholder="Ej: Vacaciones de Verano, Fondo de Emergencia..."
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Monto Objetivo</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="any"
                  required
                  value={objetivo}
                  onChange={(e) => {
                    setObjetivo(e.target.value);
                    setError('');
                  }}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-xl font-extrabold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Color distintivo</label>
              <div className="flex gap-3 pt-1">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                      color === c ? 'scale-110 border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Crear Meta
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
