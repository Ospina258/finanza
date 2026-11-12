import { FinzenData } from '../types/financial';
import { getCategoryConfig } from './categories';

export const mesActual = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const hoy = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const diasRestantesMes = (): number => {
  const now = new Date();
  const ultimoDia = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const diaActual = now.getDate();
  // Include today so if today is day 15 and month has 30 days, 16 days remain (inclusive of today)
  return Math.max(ultimoDia - diaActual + 1, 1);
};

export const diasTotalesMes = (): number => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

export interface FinancialSummary {
  ing: number;
  gas: number;
  gasHoy: number;
  ahorro: number;
  deudas: number;
  prestamosPorCobrar: number;
  totalPrestadoOriginal: number;
  totalPrestadoRecuperado: number;
  totalEnCuentas: number;
  personasQueDeben: Array<{
    id: number;
    persona: string;
    pendiente: number;
    monto: number;
    pagado: number;
    descripcion?: string;
  }>;
  disponible: number;
  limiteDiario: number;
  disponibleHoy: number;
  porcentajeGastadoHoy: number;
  dias: number;
  tasaAhorroReal: number;
  zenScore: number;
  gastosPorCategoria: Array<{
    categoria: string;
    monto: number;
    porcentaje: number;
    color: string;
    iconName: string;
  }>;
  gastosUltimos7Dias: Array<{
    fecha: string;
    diaLabel: string;
    monto: number;
  }>;
}

export const calcularInfo = (data: FinzenData): FinancialSummary => {
  const currentMonth = mesActual();
  const todayStr = hoy();
  let ing = 0;
  let gas = 0;
  let gasHoy = 0;
  const catsMap: Record<string, number> = {};

  const txs = data.transacciones || [];

  txs.forEach((t) => {
    if (t.fecha && t.fecha.startsWith(currentMonth)) {
      const amount = Number(t.monto) || 0;
      if (t.tipo === 'ingreso') {
        ing += amount;
      } else {
        gas += amount;
        catsMap[t.categoria] = (catsMap[t.categoria] || 0) + amount;
        if (t.fecha === todayStr) {
          gasHoy += amount;
        }
      }
    }
  });

  const ahorroPct = Number(data.ahorroPct) || 10;
  const ahorro = ing * (ahorroPct / 100);

  const prestamos = data.prestamos || [];
  let deudas = 0;
  let prestamosPorCobrar = 0;
  let totalPrestadoOriginal = 0;
  let totalPrestadoRecuperado = 0;
  const personasQueDeben: Array<{
    id: number;
    persona: string;
    pendiente: number;
    monto: number;
    pagado: number;
    descripcion?: string;
  }> = [];

  prestamos.forEach((p) => {
    const monto = Number(p.monto) || 0;
    const pagado = Number(p.pagado) || 0;
    const pend = Math.max(monto - pagado, 0);
    if (p.tipo === 'debo') {
      deudas += pend;
    } else {
      prestamosPorCobrar += pend;
      totalPrestadoOriginal += monto;
      totalPrestadoRecuperado += pagado;
      if (pend > 0) {
        personasQueDeben.push({
          id: p.id,
          persona: p.persona,
          pendiente: pend,
          monto,
          pagado,
          descripcion: p.descripcion,
        });
      }
    }
  });

  // Calculate total across all accounts / wallets
  const cuentas = data.cuentas || [];
  const totalEnCuentas = cuentas.reduce((acc, c) => acc + (Number(c.saldo) || 0), 0);

  const disponible = Math.max(ing - gas - ahorro - deudas, 0);
  const dias = diasRestantesMes();
  const limiteDiario = dias > 0 ? Math.max(disponible / dias, 0) : 0;
  const disponibleHoy = limiteDiario - gasHoy;
  const porcentajeGastadoHoy = limiteDiario > 0 ? (gasHoy / limiteDiario) * 100 : (gasHoy > 0 ? 120 : 0);

  // Tasa de ahorro real
  const tasaAhorroReal = ing > 0 ? Math.max(0, ((ing - gas) / ing) * 100) : 0;

  // Categorías ordenadas
  const totalGastosMes = gas || 1;
  const gastosPorCategoria = Object.entries(catsMap)
    .map(([cat, monto]) => {
      const cfg = getCategoryConfig(cat, 'gasto');
      return {
        categoria: cat,
        monto,
        porcentaje: Math.round((monto / totalGastosMes) * 100),
        color: cfg.color,
        iconName: cfg.iconName,
      };
    })
    .sort((a, b) => b.monto - a.monto);

  // Últimos 7 días para gráfico de barras / tendencia
  const gastosUltimos7Dias: Array<{ fecha: string; diaLabel: string; monto: number }> = [];
  const diasNombres = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const diaLabel = i === 0 ? 'Hoy' : diasNombres[d.getDay()];

    let diaTotal = 0;
    txs.forEach((t) => {
      if (t.tipo === 'gasto' && t.fecha === dateStr) {
        diaTotal += Number(t.monto) || 0;
      }
    });

    gastosUltimos7Dias.push({
      fecha: dateStr,
      diaLabel,
      monto: diaTotal,
    });
  }

  // Zen Score (0-100)
  // Factors:
  // 1. Daily limit pacing (40 pts)
  // 2. Savings rate (30 pts)
  // 3. Debt to income ratio (30 pts)
  let zenScore = 50;
  if (ing > 0) {
    let budgetScore = 35;
    if (gasHoy <= limiteDiario) budgetScore = 40;
    else if (gasHoy <= limiteDiario * 1.2) budgetScore = 25;
    else budgetScore = 10;

    let savingsScore = Math.min(30, (tasaAhorroReal / (ahorroPct || 10)) * 25);
    let debtRatio = deudas / (ing || 1);
    let debtScore = Math.max(5, 30 - debtRatio * 30);

    zenScore = Math.min(100, Math.round(budgetScore + savingsScore + debtScore));
  }

  return {
    ing,
    gas,
    gasHoy,
    ahorro,
    deudas,
    prestamosPorCobrar,
    totalPrestadoOriginal,
    totalPrestadoRecuperado,
    totalEnCuentas,
    personasQueDeben,
    disponible,
    limiteDiario,
    disponibleHoy,
    porcentajeGastadoHoy,
    dias,
    tasaAhorroReal,
    zenScore,
    gastosPorCategoria,
    gastosUltimos7Dias,
  };
};
