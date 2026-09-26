import React from 'react';
import { Minus, Plus, Flame } from 'lucide-react';
import { MenuItem, Language } from '../types';
import { formatPrice } from '../utils/format';

interface MenuItemCardProps {
  item: MenuItem;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onSelect: () => void;
  language: Language;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  quantity,
  onIncrement,
  onDecrement,
  onSelect,
  language,
}) => {
  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 border border-[#EFE9DF] shadow-[0_2px_12px_rgba(60,45,35,0.04)] hover:shadow-[0_8px_24px_rgba(60,45,35,0.08)] hover:border-[#D8CFBF] transition-all flex items-center justify-between gap-3 group relative cursor-pointer"
    >
      {/* Left: Food Thumbnail */}
      <div className="relative w-20 h-20 sm:w-22 sm:h-22 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl bg-[#F7F3EC] border border-[#EFE9DF]">
        <img
          src={item.image}
          alt={item.name[language]}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.spicy && (
          <span
            title="Achchiq"
            className="absolute top-1.5 left-1.5 text-[10px] bg-amber-600/90 text-white px-1.5 py-0.5 rounded-full font-bold shadow-2xs"
          >
            🌶️
          </span>
        )}
        {item.popular && (
          <span
            title="Ommabop"
            className="absolute bottom-1.5 left-1.5 text-[10px] bg-stone-900/80 text-amber-300 px-1.5 py-0.5 rounded-full font-bold shadow-2xs backdrop-blur-xs"
          >
            ★
          </span>
        )}
      </div>

      {/* Middle: Dish Name, Description, and Price */}
      <div className="flex-1 min-w-0 pr-1">
        <h3 className="font-serif text-[15px] sm:text-[16px] font-semibold text-[#2A2521] line-clamp-1 tracking-tight group-hover:text-[#385A48] transition-colors">
          {item.name[language]}
        </h3>
        <p className="text-xs text-[#7A7168] line-clamp-2 mt-0.5 font-normal leading-snug">
          {item.description[language]}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm sm:text-base font-bold text-[#385A48] font-mono leading-none">
            {formatPrice(item.price, language)}
          </span>
          {item.calories && (
            <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-[#8C8277]">
              <Flame className="w-2.5 h-2.5 text-amber-600" />
              {item.calories} kkal
            </span>
          )}
        </div>
      </div>

      {/* Right: Counter Pill */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 flex items-center bg-[#F7F3EC] rounded-full p-1 border border-[#E8E1D5] shadow-2xs"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDecrement();
          }}
          disabled={quantity <= 0}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            quantity > 0
              ? 'text-[#5A5148] hover:bg-[#EAE3D8] active:scale-90 cursor-pointer'
              : 'text-[#C5BCB2] cursor-not-allowed opacity-40'
          }`}
          aria-label="Kamaytirish"
        >
          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

        <span className="w-5 text-center text-xs font-bold text-[#2A2521] select-none font-mono">
          {quantity}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onIncrement();
          }}
          className="w-7 h-7 rounded-full bg-[#385A48] text-white flex items-center justify-center hover:bg-[#2C4839] active:scale-90 transition-transform shadow-xs cursor-pointer"
          aria-label="Ko'paytirish"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
