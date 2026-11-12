/**
 * Utility functions for currency and date formatting
 */

export const formatMoney = (num: number, currency: string = 'COP'): string => {
  if (isNaN(num)) return '$0';
  const rounded = Math.round(num);

  if (currency === 'USD') {
    return '$' + rounded.toLocaleString('en-US');
  }
  if (currency === 'EUR') {
    return '€' + rounded.toLocaleString('de-DE');
  }
  if (currency === 'MXN') {
    return '$' + rounded.toLocaleString('es-MX') + ' MXN';
  }
  // Default Colombian Peso
  return '$' + rounded.toLocaleString('es-CO');
};

export const formatCompactMoney = (num: number, currency: string = 'COP'): string => {
  if (isNaN(num)) return '$0';
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  }
  return formatMoney(num, currency);
};

export const formatLocalDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  
  const today = new Date();
  const currentY = today.getFullYear();
  const currentM = today.getMonth() + 1;
  const currentD = today.getDate();

  if (y === currentY && m === currentM && d === currentD) {
    return 'Hoy';
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (y === yesterday.getFullYear() && m === yesterday.getMonth() + 1 && d === yesterday.getDate()) {
    return 'Ayer';
  }

  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const monthName = meses[m - 1] || '';
  return `${d} ${monthName}`;
};

export const formatFullDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return `${d} de ${meses[m - 1]} de ${y}`;
};
