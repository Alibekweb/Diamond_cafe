import React from 'react';
import { Minus, Plus } from 'lucide-react';
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
    <div className="bg-white rounded-3xl p-3 border border-[#EFE9DF] shadow-[0_3px_14px_rgba(60,45,35,0.04)] hover:shadow-[0_4px_18px_rgba(60,45,35,0.07)] transition-all flex items-center justify-between gap-3 group">
      {/* Left: Food Thumbnail */}
      <div
        onClick={onSelect}
        className="relative w-20 h-20 shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-[#F7F3EC] border border-[#EFE9DF]"
      >
        <img
          src={item.image}
          alt={item.name[language]}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.spicy && (
          <span className="absolute top-1.5 left-1.5 text-[10px] bg-amber-600/90 text-white px-1.5 py-0.5 rounded-full font-bold">
            🌶️
          </span>
        )}
      </div>

      {/* Middle: Dish Name, Description, and Price */}
      <div
        onClick={onSelect}
        className="flex-1 min-w-0 cursor-pointer pr-1"
      >
        <h3 className="font-serif text-[17px] font-semibold text-[#2A2521] truncate tracking-tight leading-snug">
          {item.name[language]}
        </h3>
        <p className="text-xs text-[#7A7168] truncate mt-0.5 font-normal">
          {item.description[language]}
        </p>
        <div className="text-sm font-bold text-[#385A48] mt-2 font-mono">
          {formatPrice(item.price, language)}
        </div>
      </div>

      {/* Right: Counter Pill */}
      <div className="shrink-0 flex items-center bg-[#F7F3EC] rounded-full p-1 border border-[#E8E1D5] shadow-2xs">
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
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

        <span className="w-5 text-center text-xs font-bold text-[#2A2521] select-none">
          {quantity}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onIncrement();
          }}
          className="w-7 h-7 rounded-full bg-[#385A48] text-white flex items-center justify-center hover:bg-[#2C4839] active:scale-90 transition-transform shadow-xs cursor-pointer"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
