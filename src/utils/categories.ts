export interface CategoryConfig {
  name: string;
  iconName: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const EXPENSE_CATEGORIES: CategoryConfig[] = [
  { name: 'Alimentación', iconName: 'Utensils', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' },
  { name: 'Restaurantes', iconName: 'Pizza', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' },
  { name: 'Transporte', iconName: 'Car', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)' },
  { name: 'Vivienda', iconName: 'Home', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)' },
  { name: 'Servicios', iconName: 'Zap', color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.15)', borderColor: 'rgba(234, 179, 8, 0.3)' },
  { name: 'Salud', iconName: 'HeartPulse', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)' },
  { name: 'Entretenimiento', iconName: 'Gamepad2', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)', borderColor: 'rgba(236, 72, 153, 0.3)' },
  { name: 'Suscripciones', iconName: 'Tv', color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.3)' },
  { name: 'Educación', iconName: 'GraduationCap', color: '#6366f1', bgColor: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.3)' },
  { name: 'Ropa', iconName: 'Shirt', color: '#14b8a6', bgColor: 'rgba(20, 184, 166, 0.15)', borderColor: 'rgba(20, 184, 166, 0.3)' },
  { name: 'Ahorro', iconName: 'PiggyBank', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' },
  { name: 'Otros', iconName: 'Package', color: '#94a3b8', bgColor: 'rgba(148, 163, 184, 0.15)', borderColor: 'rgba(148, 163, 184, 0.3)' },
];

export const INCOME_CATEGORIES: CategoryConfig[] = [
  { name: 'Salario', iconName: 'Briefcase', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' },
  { name: 'Freelance', iconName: 'Laptop', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)' },
  { name: 'Inversiones', iconName: 'TrendingUp', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)' },
  { name: 'Regalo', iconName: 'Gift', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)', borderColor: 'rgba(236, 72, 153, 0.3)' },
  { name: 'Otros', iconName: 'Coins', color: '#94a3b8', bgColor: 'rgba(148, 163, 184, 0.15)', borderColor: 'rgba(148, 163, 184, 0.3)' },
];

export const getCategoryConfig = (name: string, type: 'gasto' | 'ingreso' = 'gasto'): CategoryConfig => {
  const list = type === 'ingreso' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const found = list.find((c) => c.name.toLowerCase() === name.toLowerCase());
  if (found) return found;
  
  // Cross-check other list just in case
  const alternate = type === 'ingreso' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const altFound = alternate.find((c) => c.name.toLowerCase() === name.toLowerCase());
  if (altFound) return altFound;

  return {
    name,
    iconName: 'Tag',
    color: '#94a3b8',
    bgColor: 'rgba(148, 163, 184, 0.15)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
  };
};
