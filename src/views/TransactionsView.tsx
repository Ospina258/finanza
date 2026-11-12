import React, { useState } from 'react';
import {
  Search,
  Filter,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  CreditCard,
  Plus,
  DollarSign,
} from 'lucide-react';
import { Transaction, TransactionType } from '../types/financial';
import { formatMoney, formatLocalDate, formatFullDate } from '../utils/formatters';
import { CategoryIcon } from '../components/CategoryIcon';
import { getCategoryConfig } from '../utils/categories';

interface TransactionsViewProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: number) => void;
  onOpenNewTransaction: () => void;
  currency?: string;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onDeleteTransaction,
  onOpenNewTransaction,
  currency = 'COP',
}) => {
  const [filterTipo, setFilterTipo] = useState<'todos' | TransactionType>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // Available unique categories in list
  const uniqueCategories = Array.from(new Set(transactions.map((t) => t.categoria)));

  // Filter logic
  const filtered = transactions.filter((t) => {
    if (filterTipo !== 'todos' && t.tipo !== filterTipo) return false;
    if (selectedCategory !== 'all' && t.categoria !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCat = t.categoria.toLowerCase().includes(q);
      const matchDesc = (t.descripcion || '').toLowerCase().includes(q);
      const matchFecha = t.fecha.includes(q);
      const matchMonto = String(t.monto).includes(q);
      if (!matchCat && !matchDesc && !matchFecha && !matchMonto) return false;
    }
    return true;
  });

  // Sort by date descending
  const sorted = [...filtered].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  // Calculate totals of currently filtered results
  const totalFiltrado = sorted.reduce((acc, t) => {
    return t.tipo === 'ingreso' ? acc + t.monto : acc - t.monto;
  }, 0);

  const totalGastosFiltrados = sorted
    .filter((t) => t.tipo === 'gasto')
    .reduce((acc, t) => acc + t.monto, 0);

  const totalIngresosFiltrados = sorted
    .filter((t) => t.tipo === 'ingreso')
    .reduce((acc, t) => acc + t.monto, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* Top Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Historial de Movimientos</h2>
          <p className="text-xs text-slate-400 mt-1">
            Consulta, filtra y busca todas tus transacciones registradas.
          </p>
        </div>
        <button
          onClick={onOpenNewTransaction}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Movimiento</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por categoría, nota, fecha o monto..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Filter Tabs & Category Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterTipo('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTipo === 'todos'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({transactions.length})
            </button>
            <button
              onClick={() => setFilterTipo('gasto')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTipo === 'gasto'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gastos
            </button>
            <button
              onClick={() => setFilterTipo('ingreso')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTipo === 'ingreso'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ingresos
            </button>
          </div>

          {/* Category Dropdown */}
          {uniqueCategories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Todas las categorías</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Summary of Filtered View */}
      <div className="flex items-center justify-between text-xs px-2 text-slate-400">
        <span>
          Mostrando <strong className="text-white">{sorted.length}</strong> movimientos
        </span>
        <div className="flex items-center gap-3">
          {filterTipo !== 'gasto' && (
            <span className="text-emerald-400 font-semibold tabular-nums">
              +{formatMoney(totalIngresosFiltrados, currency)}
            </span>
          )}
          {filterTipo !== 'ingreso' && (
            <span className="text-rose-400 font-semibold tabular-nums">
              -{formatMoney(totalGastosFiltrados, currency)}
            </span>
          )}
        </div>
      </div>

      {/* Transactions List */}
      {sorted.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500">
            <Filter className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-300">No se encontraron movimientos</p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Prueba ajustando los filtros de búsqueda o agrega una nueva transacción.
          </p>
          {(searchQuery || filterTipo !== 'todos' || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterTipo('todos');
                setSelectedCategory('all');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-indigo-400 hover:text-white"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {sorted.map((t) => {
            const isIngreso = t.tipo === 'ingreso';
            const catCfg = getCategoryConfig(t.categoria, t.tipo);

            return (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between gap-4 transition-all group"
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{
                      backgroundColor: catCfg.bgColor,
                      color: catCfg.color,
                    }}
                  >
                    <CategoryIcon iconName={catCfg.iconName} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white truncate">{t.categoria}</p>
                      {t.metodoPago && (
                        <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded capitalize">
                          {t.metodoPago}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      <span>{formatFullDate(t.fecha)}</span>
                      {t.descripcion && <span> · {t.descripcion}</span>}
                    </p>
                  </div>
                </div>

                {/* Right: Amount & Delete action */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p
                      className={`text-sm sm:text-base font-extrabold tabular-nums tracking-tight ${
                        isIngreso ? 'text-emerald-400' : 'text-slate-100'
                      }`}
                    >
                      {isIngreso ? '+' : '-'}{formatMoney(t.monto, currency)}
                    </p>
                  </div>

                  <button
                    onClick={() => setItemToDelete(t.id)}
                    title="Eliminar transacción"
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0f172a] rounded-3xl border border-slate-800 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">¿Eliminar este movimiento?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Esta acción recalculará automáticamente tu límite diario y balance.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => {
                  onDeleteTransaction(itemToDelete);
                  setItemToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Sí, Eliminar
              </button>
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
