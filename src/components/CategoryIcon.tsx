import React from 'react';
import {
  Utensils,
  Car,
  Home,
  Zap,
  HeartPulse,
  Gamepad2,
  GraduationCap,
  Shirt,
  Pizza,
  Tv,
  PiggyBank,
  Package,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Coins,
  DollarSign,
  Tag,
  CreditCard,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';

interface CategoryIconProps {
  iconName?: string;
  className?: string;
  size?: number;
}

const iconMap: Record<string, React.ElementType> = {
  Utensils,
  Car,
  Home,
  Zap,
  HeartPulse,
  Gamepad2,
  GraduationCap,
  Shirt,
  Pizza,
  Tv,
  PiggyBank,
  Package,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Coins,
  DollarSign,
  Tag,
  CreditCard,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName = 'Tag', className = 'w-5 h-5', size }) => {
  const IconComponent = iconMap[iconName] || Tag;
  return <IconComponent className={className} size={size} />;
};
