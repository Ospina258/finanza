import React, { useState } from 'react';
import { X, Wallet, Building2, Smartphone, Banknote, ArrowRightLeft, Plus, CheckCircle2 } from 'lucide-react';
import { Cuenta, TipoCuenta } from '../types/financial';
import { formatMoney } from '../utils/formatters';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  cuentas: Cuenta[];
  onSaveAccount: (account: Omit<Cuenta, 'id'>) => void;
  onUpdateAccountBalance: (accountId: string, newBalance: number) => void;
  onTransfer: (fromId: string, toId: string, amount: number) => void;
  currency?: string;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  cuentas,
  onSaveAccount,
  onUpdateAccountBalance,
  onTransfer,
  currency = 'COP',
}) => {
  const [activeTab, setActiveTab] = useState<'crear' | 'transferir' | 'ajustar'>('crear');

  // Form states for Create
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TipoCuenta>('banco');
  const [saldo, setSaldo] = useState('');
  const [color, setColor] = useState('#f59e0b');

  // Form states for Transfer
  const [origenId, setOrigenId] = useState(cuentas[0]?.id || '');
  const [destinoId, setDestinoId] = useState(cuentas[1]?.id || '');
  const [montoTransferir, setMontoTransferir] = useState('');

  // Form states for Adjust
  const [ajusteCuentaId, setAjusteCuentaId] = useState(cuentas[0]?.id || '');
  const [nuevoSaldo, setNuevoSaldo] = useState('');

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('Por favor indica un nombre para la cuenta o billetera');
      return;
    }
    const numSaldo = parseFloat(saldo);
    if (isNaN(numSaldo) || numSaldo < 0) {
      setError('El saldo inicial debe ser un número válido');
      return;
    }

    onSaveAccount({
      nombre: nombre.trim(),
      tipo,
      saldo: numSaldo,
      color,
    });

    setNombre('');
    setSaldo('');
    setError('');
    onClose();
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origenId || !destinoId) {
      setError('Selecciona las dos cuentas');
      return;
    }
    if (origenId === destinoId) {
      setError('La cuenta de origen y destino deben ser distintas');
      return;
    }
    const numMonto = parseFloat(montoTransferir);
    if (!numMonto || numMonto <= 0) {
      setError('Ingresa un monto válido a transferir');
      return;
    }

    const cuentaOrigen = cuentas.find((c) => c.id === origenId);
    if (cuentaOrigen && cuentaOrigen.saldo < numMonto) {
      setError(`Saldo insuficiente en ${cuentaOrigen.nombre}. Saldo actual: ${formatMoney(cuentaOrigen.saldo, currency)}`);
      return;
    }

    onTransfer(origenId, destinoId, numMonto);
    setMontoTransferir('');
    setError('');
    onClose();
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numSaldo = parseFloat(nuevoSaldo);
    if (isNaN(numSaldo) || numSaldo < 0) {
      setError('Ingresa un saldo válido');
      return;
    }

    onUpdateAccountBalance(ajusteCuentaId, numSaldo);
    setNuevoSaldo('');
    setError('');
    onClose();
  };

  const colorPresets = ['#f59e0b', '#a855f7', '#10b981', '#3b82f6', '#ef4444', '#06b6d4'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0f172a] rounded-t-3xl sm:rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d16]/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Gestión de Cuentas & Efectivo</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-3 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('crear');
                setError('');
              }}
              className={`py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'crear' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              + Nueva Cuenta
            </button>
            <button
              onClick={() => {
                setActiveTab('transferir');
                setError('');
              }}
              className={`py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'transferir' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Transferir
            </button>
            <button
              onClick={() => {
                setActiveTab('ajustar');
                setError('');
              }}
              className={`py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'ajustar' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ajustar Saldo
            </button>
          </div>
        </div>

        {/* Tab 1: Crear Cuenta */}
        {activeTab === 'crear' && (
          <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Nombre de la Cuenta o Billetera</label>
              <input
                type="text"
                required
                autoFocus
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Bancolombia, Nequi, Efectivo en Mano, Daviplata..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tipo de Cuenta</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'banco', label: 'Banco', icon: Building2 },
                  { id: 'billetera', label: 'Billetera Digital', icon: Smartphone },
                  { id: 'efectivo', label: 'Efectivo', icon: Banknote },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTipo(item.id as TipoCuenta)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer ${
                        tipo === item.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-indigo-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Saldo Actual en esta Cuenta</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="any"
                  required
                  value={saldo}
                  onChange={(e) => setSaldo(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-base font-extrabold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Color Distintivo</label>
              <div className="flex gap-3 pt-1">
                {colorPresets.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
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
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
            >
              Guardar Nueva Cuenta
            </button>
          </form>
        )}

        {/* Tab 2: Transferir entre Cuentas */}
        {activeTab === 'transferir' && (
          <form onSubmit={handleTransferSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">De (Origen)</label>
                <select
                  value={origenId}
                  onChange={(e) => setOrigenId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {cuentas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({formatMoney(c.saldo, currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Hacia (Destino)</label>
                <select
                  value={destinoId}
                  onChange={(e) => setDestinoId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {cuentas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Monto a Transferir</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="any"
                  required
                  value={montoTransferir}
                  onChange={(e) => setMontoTransferir(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-base font-extrabold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Ejecutar Transferencia</span>
            </button>
          </form>
        )}

        {/* Tab 3: Ajustar Saldo Directo */}
        {activeTab === 'ajustar' && (
          <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Seleccionar Cuenta a Modificar</label>
              <select
                value={ajusteCuentaId}
                onChange={(e) => {
                  setAjusteCuentaId(e.target.value);
                  const c = cuentas.find((x) => x.id === e.target.value);
                  if (c) setNuevoSaldo(String(c.saldo));
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {cuentas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} — Saldo actual: {formatMoney(c.saldo, currency)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Nuevo Saldo Real</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="any"
                  required
                  value={nuevoSaldo}
                  onChange={(e) => setNuevoSaldo(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-base font-extrabold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
            >
              Actualizar Saldo
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
