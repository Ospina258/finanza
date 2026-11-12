import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Calendar, CreditCard, Tag, Sparkles, Wallet } from 'lucide-react';
import { Cuenta, Transaction, TransactionType, PaymentMethod } from '../types/financial';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/categories';
import { hoy } from '../utils/calculations';
import { CategoryIcon } from './CategoryIcon';
import { formatMoney } from '../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id'>) => void;
  currency?: string;
  limiteDiario?: number;
  gasHoy?: number;
  cuentas?: Cuenta[];
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currency = 'COP',
  limiteDiario = 0,
  gasHoy = 0,
  cuentas = [],
}) => {
  const [tipo, setTipo] = useState<TransactionType>('gasto');
  const [monto, setMonto] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('Alimentación');
  const [descripcion, setDescripcion] = useState<string>('');
  const [fecha, setFecha] = useState<string>(hoy());
  const [metodoPago, setMetodoPago] = useState<PaymentMethod>('tarjeta');
  const [cuentaId, setCuentaId] = useState<string>(cuentas[0]?.id || '');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const currentCategories = tipo === 'gasto' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTipoChange = (newTipo: TransactionType) => {
    setTipo(newTipo);
    setCategoria(newTipo === 'gasto' ? 'Alimentación' : 'Salario');
  };

  const handleQuickAddAmount = (val: number) => {
    const current = Number(monto) || 0;
    setMonto(String(current + val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numMonto = parseFloat(monto);
    if (!numMonto || numMonto <= 0) {
      setError('Por favor ingresa un monto válido mayor a 0');
      return;
    }

    const now = new Date();
    const hora = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    onSave({
      tipo,
      monto: numMonto,
      categoria,
      descripcion: descripcion.trim() || undefined,
      fecha,
      metodoPago,
      cuentaId: cuentaId || undefined,
      hora,
    });

    // Reset and close
    setMonto('');
    setDescripcion('');
    setError('');
    onClose();
  };

  // Preview impact
  const numMonto = parseFloat(monto) || 0;
  const nuevoGastoHoy = gasHoy + numMonto;
  const excederaLimite = tipo === 'gasto' && limiteDiario > 0 && nuevoGastoHoy > limiteDiario;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0f172a] rounded-t-3xl sm:rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d16]/70">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">Nuevo Movimiento</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {/* Segmented Selector: Gasto vs Ingreso */}
          <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleTipoChange('gasto')}
              className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                tipo === 'gasto'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Gasto</span>
            </button>
            <button
              type="button"
              onClick={() => handleTipoChange('ingreso')}
              className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                tipo === 'ingreso'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Ingreso</span>
            </button>
          </div>

          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Monto</span>
              {numMonto > 0 && (
                <span className="text-indigo-400 font-bold tabular-nums">
                  {formatMoney(numMonto, currency)}
                </span>
              )}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                $
              </span>
              <input
                type="number"
                step="any"
                required
                value={monto}
                onChange={(e) => {
                  setMonto(e.target.value);
                  setError('');
                }}
                placeholder="0"
                autoFocus
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3.5 text-2xl font-extrabold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 tabular-nums"
              />
            </div>

            {/* Quick amount adder buttons */}
            <div className="flex gap-2 pt-1 overflow-x-auto hide-scrollbar">
              {[10000, 20000, 50000, 100000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAddAmount(val)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-xs text-slate-300 font-medium whitespace-nowrap active:scale-95 transition-all cursor-pointer"
                >
                  +{formatMoney(val, currency)}
                </button>
              ))}
            </div>
          </div>

          {/* Impact preview */}
          {tipo === 'gasto' && numMonto > 0 && limiteDiario > 0 && (
            <div
              className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                excederaLimite
                  ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                  : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  {excederaLimite
                    ? `⚠️ Este gasto superará tu límite diario por ${formatMoney(nuevoGastoHoy - limiteDiario, currency)}`
                    : `✅ Tu gasto total hoy será ${formatMoney(nuevoGastoHoy, currency)} (Dentro del límite)`}
                </span>
              </div>
            </div>
          )}

          {/* Category Grid */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Categoría</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
              {currentCategories.map((cat) => {
                const isSelected = categoria === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategoria(cat.name)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-transform"
                      style={{
                        backgroundColor: isSelected ? cat.color : cat.bgColor,
                        color: isSelected ? '#ffffff' : cat.color,
                      }}
                    >
                      <CategoryIcon iconName={cat.iconName} className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium truncate w-full">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Descripción (Opcional)</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Almuerzo con el equipo, Uber, etc."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Date & Payment method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                Método de Pago
              </label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as PaymentMethod)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="tarjeta">💳 Tarjeta Débito / Crédito</option>
                <option value="transferencia">📲 Transferencia / Nequi / Daviplata</option>
                <option value="efectivo">💵 Efectivo</option>
              </select>
            </div>
          </div>

          {/* Account / Cash selector */}
          {cuentas.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-indigo-400" />
                {tipo === 'gasto' ? 'Descontar de la cuenta / efectivo:' : 'Abonar a la cuenta / efectivo:'}
              </label>
              <select
                value={cuentaId}
                onChange={(e) => setCuentaId(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">(Opcional) Ninguna cuenta específica</option>
                {cuentas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} · Saldo: {formatMoney(c.saldo, currency)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}

          {/* Footer Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
                tipo === 'gasto'
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
              }`}
            >
              Guardar {tipo === 'gasto' ? 'Gasto' : 'Ingreso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
