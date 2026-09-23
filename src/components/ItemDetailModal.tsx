import React, { useState } from 'react';
import { X, Clock, Flame, Minus, Plus, ShoppingBag } from 'lucide-react';
import { MenuItem, Language } from '../types';
import { formatPrice } from '../utils/format';
import { translations } from '../data/translations';

interface ItemDetailModalProps {
  item: MenuItem;
  currentQuantity: number;
  onClose: () => void;
  onUpdateQuantity: (quantity: number) => void;
  language: Language;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  currentQuantity,
  onClose,
  onUpdateQuantity,
  language,
}) => {
  const [qty, setQty] = useState(currentQuantity > 0 ? currentQuantity : 1);
  const t = translations[language];

  const handleConfirm = () => {
    onUpdateQuantity(qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(40,30,20,0.18)] border border-[#EFE8DD] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Image Hero with Close Button */}
        <div className="relative h-60 w-full shrink-0 bg-[#F5EFE6]">
          <img
            src={item.image}
            alt={item.name[language]}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-900/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-stone-900/60 active:scale-95 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content details */}
        <div className="p-5 overflow-y-auto no-scrollbar flex-1 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2A2521] leading-tight">
                {item.name[language]}
              </h2>
              <p className="text-sm text-[#786E64] mt-1">
                {item.description[language]}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-serif text-lg font-bold text-[#385A48]">
                {formatPrice(item.price, language)}
              </span>
            </div>
          </div>

          {/* Badges / Meta */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {item.popular && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF0E1] text-[#8C6228] border border-[#EEDFCD]">
                ⭐ {t.popularBadge}
              </span>
            )}
            {item.spicy && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FCECE8] text-[#A64228] border border-[#F4D3C9] flex items-center gap-1">
                🌶️ {t.spicyBadge}
              </span>
            )}
            {item.vegetarian && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#EEF5F1] text-[#345944] border border-[#D3E5DA]">
                🌱 {t.vegetarianBadge}
              </span>
            )}
            {item.prepTime && (
              <span className="text-[11px] font-medium text-[#736A61] flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-[#EAE3D8]">
                <Clock className="w-3 h-3 text-[#998E83]" />
                {item.prepTime}
              </span>
            )}
            {item.calories && (
              <span className="text-[11px] font-medium text-[#736A61] flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-[#EAE3D8]">
                <Flame className="w-3 h-3 text-[#998E83]" />
                {item.calories} kkal
              </span>
            )}
          </div>

          {/* Ingredients */}
          {item.ingredients && (
            <div className="bg-white p-3.5 rounded-2xl border border-[#EFE9DF]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C8176] block mb-1">
                {t.ingredients}
              </span>
              <p className="text-xs text-[#524941] leading-relaxed">
                {item.ingredients[language]}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 border-t border-[#EFE8DD] bg-[#FAF7F2] flex items-center justify-between gap-3">
          {/* Quantity selector */}
          <div className="flex items-center bg-[#F7F3EC] rounded-full p-1 border border-[#E8E1D5]">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#554C44] hover:bg-[#EAE3D8] active:scale-95 cursor-pointer"
            >
              <Minus className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-[#2A2521]">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-8 h-8 rounded-full bg-[#385A48] text-white flex items-center justify-center hover:bg-[#2C4839] active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleConfirm}
            className="flex-1 bg-[#385A48] hover:bg-[#2C4839] text-white py-3.5 px-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(56,90,72,0.22)] active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.addToCart}</span>
            <span className="font-mono text-xs opacity-90 ml-1">
              ({formatPrice(item.price * qty, language)})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
