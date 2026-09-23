import { Language } from '../types';

export function formatPrice(amount: number, lang: Language): string {
  const formatted = amount.toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US');
  switch (lang) {
    case 'uz':
      return `${formatted} so'm`;
    case 'ru':
      return `${formatted} сум`;
    case 'en':
      return `${formatted} UZS`;
    default:
      return `${formatted} so'm`;
  }
}
