export type TransactionType = 'gasto' | 'ingreso';

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia';

export interface Transaction {
  id: number;
  tipo: TransactionType;
  monto: number;
  categoria: string;
  descripcion?: string;
  fecha: string; // YYYY-MM-DD
  metodoPago?: PaymentMethod;
  hora?: string; // HH:mm
}

export interface Meta {
  id?: number | string;
  nombre: string;
  objetivo: number;
  ahorrado: number;
  color?: string;
  categoria?: string;
  fechaLimite?: string;
}

export type PrestamoTipo = 'prestado' | 'debo'; // 'prestado' = Me deben (Yo presté) | 'debo' = Le debo (Me prestaron)

export interface Prestamo {
  id: number;
  tipo: PrestamoTipo;
  persona: string;
  monto: number;
  pagado: number;
  fecha?: string;
  descripcion?: string;
}

export interface FinzenData {
  transacciones: Transaction[];
  metas: Meta[];
  prestamos: Prestamo[];
  nextId: number;
  nextIdPrestamo: number;
  ahorroPct: number;
  userName?: string;
  moneda?: string; // 'COP' | 'USD' | 'EUR' | 'MXN'
}

export interface CategoryItem {
  nombre: string;
  icono: string;
  color: string;
  bgDark: string;
}
