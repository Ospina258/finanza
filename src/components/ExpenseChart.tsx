import React, { useState } from 'react';
import { formatMoney } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface CategoryData {
  categoria: string;
  monto: number;
  porcentaje: number;
  color: string;
  iconName: string;
}

interface ExpenseChartProps {
  categories: CategoryData[];
  totalExpenses: number;
  currency?: string;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ categories, totalExpenses, currency = 'COP' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!categories || categories.length === 0 || totalExpenses <= 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-3 text-slate-500">
          <CategoryIcon iconName="Package" className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-slate-300">Sin gastos este mes</p>
        <p className="text-xs text-slate-500 mt-1">Registra tu primer gasto para ver la distribución</p>
      </div>
    );
  }

  // Calculate SVG Donut arcs
  const radius = 64;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  const activeCategory = hoveredIndex !== null ? categories[hoveredIndex] : categories[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
        {/* SVG Donut */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
            />
            {/* Slices */}
            {categories.map((cat, idx) => {
              const slicePercent = cat.porcentaje / 100;
              const strokeDasharray = `${slicePercent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedOffset;
              accumulatedOffset += slicePercent * circumference;

              const isHovered = hoveredIndex === idx;

              return (
                <circle
                  key={cat.categoria}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={cat.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer hover:opacity-100"
                  style={{ opacity: hoveredIndex === null || isHovered ? 1 : 0.5 }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              {hoveredIndex !== null ? activeCategory.categoria : 'Total Gastado'}
            </span>
            <span className="text-base font-bold text-white tabular-nums tracking-tight mt-0.5">
              {hoveredIndex !== null ? formatMoney(activeCategory.monto, currency) : formatMoney(totalExpenses, currency)}
            </span>
            {hoveredIndex !== null && (
              <span className="text-xs font-semibold text-indigo-400">
                {activeCategory.porcentaje}% del total
              </span>
            )}
          </div>
        </div>

        {/* Legend pills & breakdown */}
        <div className="w-full sm:max-w-xs space-y-2">
          {categories.slice(0, 5).map((cat, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={cat.categoria}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                  isHovered ? 'bg-slate-800/80 border border-slate-700/60 shadow-sm' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs font-medium text-slate-200 truncate">
                    {cat.categoria}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-right shrink-0">
                  <span className="text-xs font-semibold text-slate-200 tabular-nums">
                    {formatMoney(cat.monto, currency)}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 w-8 tabular-nums">
                    {cat.porcentaje}%
                  </span>
                </div>
              </div>
            );
          })}
          {categories.length > 5 && (
            <p className="text-[11px] text-slate-500 text-center pt-1">
              + {categories.length - 5} categorías adicionales
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
