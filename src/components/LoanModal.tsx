import React, { useState } from 'react';
import { X, Handshake, ArrowUpRight, ArrowDownLeft, User, DollarSign } from 'lucide-react';
import { Prestamo, PrestamoTipo } from '../types/financial';
import { formatMoney } from '../utils/formatters';
import { hoy } from '../utils/calculations';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNewLoan: (loan: Omit<Prestamo, 'id'>) => void;
  onPayment: (loanId: number, amount: number) => void;
  activeLoanForPayment?: Prestamo | null;
  currency?: string;
}

export const LoanModal: React.FC<LoanModalProps> = ({
  isOpen,
  onClose,
  onSaveNewLoan,
  onPayment,
  activeLoanForPayment,
  currency = 'COP',
}) => {
  const [tipo, setTipo] = useState<PrestamoTipo>('prestado');
  const [persona, setPersona] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isPaymentMode = Boolean(activeLoanForPayment);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numMonto = parseFloat(monto);
    if (!persona.trim()) {
      setError('Por favor indica el nombre de la persona o entidad');
      return;
    }
    if (!numMonto || numMonto <= 0) {
      setError('Por favor ingresa un monto válido mayor a 0');
      return;
    }

    onSaveNewLoan({
      tipo,
      persona: persona.trim(),
      monto: numMonto,
      pagado: 0,
      fecha: hoy(),
      descripcion: descripcion.trim() || undefined,
    });

    setPersona('');
    setMonto('');
    setDescripcion('');
    setError('');
    onClose();
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLoanForPayment) return;
    const numPay = parseFloat(paymentAmount);
    if (!numPay || numPay <= 0) {
      setError('Por favor ingresa un monto válido');
      return;
    }

    onPayment(activeLoanForPayment.id, numPay);
    setPaymentAmount('');
    setError('');
    onClose();
  };

  const pendiente = activeLoanForPayment
    ? Math.max(activeLoanForPayment.monto - activeLoanForPayment.pagado, 0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0f172a] rounded-t-3xl sm:rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d16]/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Handshake className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isPaymentMode ? `Abonar a ${activeLoanForPayment?.persona}` : 'Registrar Préstamo o Deuda'}
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
        {isPaymentMode && activeLoanForPayment ? (
          <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  {activeLoanForPayment.tipo === 'prestado' ? 'Te debe en total' : 'Le debes en total'}
                </span>
                <span className="font-semibold text-white">
                  {formatMoney(activeLoanForPayment.monto, currency)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Saldo pendiente:</span>
                <span className="text-base font-extrabold text-amber-400 tabular-nums">
                  {formatMoney(pendiente, currency)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Monto del Abono</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="any"
                  autoFocus
                  required
                  value={paymentAmount}
                  onChange={(e) => {
                    setPaymentAmount(e.target.value);
                    setError('');
                  }}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-xl font-extrabold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Pay full amount helper */}
              {pendiente > 0 && (
                <button
                  type="button"
                  onClick={() => setPaymentAmount(String(pendiente))}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium pt-1 cursor-pointer"
                >
                  Pagar total pendiente ({formatMoney(pendiente, currency)})
                </button>
              )}
            </div>

            {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Registrar Abono
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
            {/* Toggle: Me deben vs Yo debo */}
            <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setTipo('prestado')}
                className={`py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tipo === 'prestado'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>Me deben (Presté)</span>
              </button>
              <button
                type="button"
                onClick={() => setTipo('debo')}
                className={`py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tipo === 'debo'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Yo debo (Me prestaron)</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Persona o Institución
              </label>
              <input
                type="text"
                required
                autoFocus
                value={persona}
                onChange={(e) => {
                  setPersona(e.target.value);
                  setError('');
                }}
                placeholder="Ej: Camilo, Tarjeta Bancolombia, etc."
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Monto del Préstamo</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-xl font-extrabold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Motivo / Notas (Opcional)</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej: Repuesto carro, cuota sin intereses..."
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
            >
              Guardar Registro
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
