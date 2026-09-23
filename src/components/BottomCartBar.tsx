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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#EFE8DD] px-4 py-3 transition-colors shadow-[0_-4px_20px_rgba(60,45,35,0.05)]">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Left: Summary text */}
        <div
          onClick={onOpenCart}
          className="flex flex-col cursor-pointer select-none group"
        >
          <span className="text-[10px] tracking-wider uppercase font-bold text-[#8C8277]">
            {t.yourOrder}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-base font-extrabold text-[#2A2521] tracking-tight">
              {totalCount} {t.itemCount}
            </span>
            <span className="text-xs font-semibold text-[#385A48]">
              {formatPrice(totalPrice, language)}
            </span>
          </div>
        </div>

        {/* Right: Checkout button */}
        <button
          onClick={onOpenCart}
          className="bg-[#385A48] hover:bg-[#2C4839] text-white px-5 py-3 rounded-full text-sm font-semibold flex items-center gap-2 shadow-[0_4px_14px_rgba(56,90,72,0.22)] active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 opacity-90" />
          <span>{t.orderButton}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
