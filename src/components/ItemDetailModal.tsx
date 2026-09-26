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
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md md:max-w-3xl bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_16px_50px_rgba(40,30,20,0.22)] border border-[#EFE8DD] max-h-[92vh] md:max-h-[580px] flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-stone-900/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-stone-900/70 active:scale-95 transition-all cursor-pointer"
          aria-label="Yopish"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left (Image section) */}
        <div className="relative h-56 sm:h-64 md:h-auto md:w-1/2 shrink-0 bg-[#F5EFE6] overflow-hidden">
          <img
            src={item.image}
            alt={item.name[language]}
            className="w-full h-full object-cover"
          />
          {item.spicy && (
            <span className="absolute top-3 left-3 bg-amber-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs">
              🌶️ {t.spicyBadge}
            </span>
          )}
        </div>

        {/* Right (Content & Actions section) */}
        <div className="flex-1 flex flex-col justify-between min-h-0 bg-[#FAF7F2]">
          {/* Scrollable details */}
          <div className="p-5 sm:p-6 overflow-y-auto no-scrollbar space-y-4">
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A2521] leading-tight">
                  {item.name[language]}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#786E64] mt-1.5 leading-relaxed">
                {item.description[language]}
              </p>
            </div>

            {/* Price line */}
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#385A48] font-mono">
                {formatPrice(item.price, language)}
              </span>
            </div>

            {/* Badges / Meta */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {item.popular && (
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF0E1] text-[#8C6228] border border-[#EEDFCD]">
                  ⭐ {t.popularBadge}
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
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8176] block mb-1">
                  {t.ingredients}
                </span>
                <p className="text-xs text-[#524941] leading-relaxed">
                  {item.ingredients[language]}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 sm:p-5 border-t border-[#EFE8DD] bg-[#F7F3EC]/80 flex items-center justify-between gap-3 shrink-0">
            {/* Quantity selector */}
            <div className="flex items-center bg-[#F7F3EC] rounded-full p-1 border border-[#E8E1D5]">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#554C44] hover:bg-[#EAE3D8] active:scale-95 cursor-pointer"
                aria-label="Kamaytirish"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className="w-8 text-center font-bold text-sm text-[#2A2521] font-mono">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 rounded-full bg-[#385A48] text-white flex items-center justify-center hover:bg-[#2C4839] active:scale-95 cursor-pointer"
                aria-label="Ko'paytirish"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleConfirm}
              className="flex-1 bg-[#385A48] hover:bg-[#2C4839] text-white py-3 px-4 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(56,90,72,0.22)] active:scale-95 transition-all cursor-pointer"
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
    </div>
  );
};
