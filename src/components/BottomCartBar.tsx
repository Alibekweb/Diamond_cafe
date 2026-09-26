import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Language } from '../types';
import { formatPrice } from '../utils/format';
import { translations } from '../data/translations';

interface BottomCartBarProps {
  totalCount: number;
  totalPrice: number;
  onOpenCart: () => void;
  language: Language;
}

export const BottomCartBar: React.FC<BottomCartBarProps> = ({
  totalCount,
  totalPrice,
  onOpenCart,
  language,
}) => {
  const t = translations[language];

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#EFE8DD] px-4 py-3 sm:px-5 sm:py-3.5 sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 sm:w-[94%] sm:max-w-xl sm:rounded-2xl sm:border sm:border-[#E5DDD2] sm:shadow-[0_14px_40px_rgba(40,30,20,0.18)] transition-all">
      <div className="w-full flex items-center justify-between gap-3">
        {/* Left: Summary text */}
        <div
          onClick={onOpenCart}
          className="flex flex-col cursor-pointer select-none group"
        >
          <span className="text-[10px] tracking-wider uppercase font-bold text-[#8C8277]">
            {t.yourOrder}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-base sm:text-lg font-extrabold text-[#2A2521] tracking-tight">
              {totalCount} {t.itemCount}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#385A48] font-mono">
              {formatPrice(totalPrice, language)}
            </span>
          </div>
        </div>

        {/* Right: Checkout button */}
        <button
          onClick={onOpenCart}
          className="bg-[#385A48] hover:bg-[#2C4839] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-[0_4px_14px_rgba(56,90,72,0.22)] active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 opacity-90" />
          <span>{t.orderButton}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
