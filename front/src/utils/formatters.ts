import { format } from 'date-fns';

export const formatDate = (date: Date | undefined): string => {
  return date ? format(date, 'yyyy-MM-dd') : '';
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('kk-KZ', { style: 'currency', currency: 'KZT' }).format(amount);
};