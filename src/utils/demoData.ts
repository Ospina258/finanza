import { FinzenData } from '../types/financial';
import { hoy, mesActual } from './calculations';

export const getInitialData = (): FinzenData => {
  const currentMonth = mesActual();
  const todayStr = hoy();
  
  // Calculate relative dates for realistic current-month transactions
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  const d1 = `${year}-${month}-01`;
  const d3 = `${year}-${month}-03`;
  const d5 = `${year}-${month}-05`;
  const d8 = `${year}-${month}-08`;
  const dYesterday = new Date(now);
  dYesterday.setDate(dYesterday.getDate() - 1);
  const yesterdayStr = `${dYesterday.getFullYear()}-${String(dYesterday.getMonth() + 1).padStart(2, '0')}-${String(dYesterday.getDate()).padStart(2, '0')}`;

  return {
    userName: 'David',
    moneda: 'COP',
    ahorroPct: 15,
    nextId: 10,
    nextIdPrestamo: 4,
    transacciones: [
      {
        id: 1,
        tipo: 'ingreso',
        monto: 4500000,
        categoria: 'Salario',
        descripcion: 'Nómina quincenal y bonificación',
        fecha: d1,
        metodoPago: 'transferencia',
        hora: '09:00',
      },
      {
        id: 2,
        tipo: 'ingreso',
        monto: 850000,
        categoria: 'Freelance',
        descripcion: 'Diseño UI App Móvil',
        fecha: d5,
        metodoPago: 'transferencia',
        hora: '15:30',
      },
      {
        id: 3,
        tipo: 'gasto',
        monto: 1200000,
        categoria: 'Vivienda',
        descripcion: 'Arriendo y administración',
        fecha: d3,
        metodoPago: 'transferencia',
        hora: '11:00',
      },
      {
        id: 4,
        tipo: 'gasto',
        monto: 380000,
        categoria: 'Alimentación',
        descripcion: 'Mercado quincenal Éxito',
        fecha: d5,
        metodoPago: 'tarjeta',
        hora: '17:20',
      },
      {
        id: 5,
        tipo: 'gasto',
        monto: 165000,
        categoria: 'Servicios',
        descripcion: 'Energía, agua y fibra óptica',
        fecha: d8,
        metodoPago: 'transferencia',
        hora: '14:00',
      },
      {
        id: 6,
        tipo: 'gasto',
        monto: 45000,
        categoria: 'Suscripciones',
        descripcion: 'Spotify Familiar + iCloud',
        fecha: d8,
        metodoPago: 'tarjeta',
        hora: '08:30',
      },
      {
        id: 7,
        tipo: 'gasto',
        monto: 72000,
        categoria: 'Restaurantes',
        descripcion: 'Cena con amigos',
        fecha: yesterdayStr,
        metodoPago: 'tarjeta',
        hora: '21:15',
      },
      {
        id: 8,
        tipo: 'gasto',
        monto: 26000,
        categoria: 'Transporte',
        descripcion: 'Uber a reunión',
        fecha: todayStr,
        metodoPago: 'tarjeta',
        hora: '10:45',
      },
      {
        id: 9,
        tipo: 'gasto',
        monto: 18500,
        categoria: 'Alimentación',
        descripcion: 'Almuerzo ejecutivo',
        fecha: todayStr,
        metodoPago: 'efectivo',
        hora: '13:10',
      },
    ],
    metas: [
      {
        id: 1,
        nombre: 'Fondo de Emergencia',
        objetivo: 5000000,
        ahorrado: 3200000,
        color: '#10b981',
      },
      {
        id: 2,
        nombre: 'Viaje a San Andrés',
        objetivo: 2400000,
        ahorrado: 1450000,
        color: '#06b6d4',
      },
      {
        id: 3,
        nombre: 'Nuevo Portátil M3',
        objetivo: 6500000,
        ahorrado: 2100000,
        color: '#6366f1',
      },
    ],
    prestamos: [
      {
        id: 1,
        tipo: 'prestado',
        persona: 'Carlos Méndez',
        monto: 350000,
        pagado: 150000,
        fecha: d3,
        descripcion: 'Préstamo para repuesto de moto',
      },
      {
        id: 2,
        tipo: 'debo',
        persona: 'Tarjeta de Crédito (Cuota)',
        monto: 420000,
        pagado: 210000,
        fecha: d5,
        descripcion: 'Cuota laptop 0% interés',
      },
      {
        id: 3,
        tipo: 'prestado',
        persona: 'Andrea Gomez',
        monto: 120000,
        pagado: 120000,
        fecha: d1,
        descripcion: 'Entrada concierto',
      },
    ],
  };
};
