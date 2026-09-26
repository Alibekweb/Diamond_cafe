import React from 'react';
import { QrCode, ShoppingBag } from 'lucide-react';
import { Language } from '../types';
import { formatPrice } from '../utils/format';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenQR: () => void;
  cartCount?: number;
  cartTotal?: number;
  onOpenCart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenQR,
  cartCount = 0,
  cartTotal = 0,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EFE8DD] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#385A48] text-white flex items-center justify-center shadow-xs shrink-0">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 3h12l4 6-10 12L2 9z" />
              <path d="M11 3 8 9l4 12 4-12-3-6" />
              <path d="M2 9h20" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg sm:text-xl font-bold text-[#2A2521] tracking-tight leading-none">
                Diamond Cafe
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#EEF5F1] text-[#385A48] border border-[#D5E5DA]">
                Restoran Menyu
              </span>
            </div>
            <p className="text-[11px] text-[#7A7168] hidden sm:block mt-0.5">
              Mazali taomlar va qulay onlayn buyurtma
            </p>
          </div>
        </div>

        {/* Right side controls: QR button, Language pill, Desktop Cart Button */}
        <div className="flex items-center gap-2.5">
          {/* QR Code button */}
          <button
            onClick={onOpenQR}
            title="QR Menyu"
            className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-full bg-white border border-[#E8E1D5] text-[#554C44] flex items-center gap-1.5 hover:bg-[#F5EFE6] transition-colors shadow-2xs active:scale-95 cursor-pointer text-xs font-medium"
            aria-label="QR Menyu"
          >
            <QrCode className="w-4 h-4 text-[#385A48]" />
            <span className="hidden sm:inline font-semibold">QR Menyu</span>
          </button>

          {/* Language Switcher Pill */}
          <div className="flex items-center bg-[#EFE9DF] rounded-full p-0.5 text-xs font-semibold text-[#665D54]">
            {(['uz', 'ru', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-2.5 py-1 uppercase rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  language === lang
                    ? 'bg-white text-[#2A2521] shadow-2xs font-bold'
                    : 'text-[#7A7168] hover:text-[#2A2521]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Desktop Cart Shortcut Button (PC screens) */}
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="hidden md:flex items-center gap-2 bg-[#385A48] hover:bg-[#2C4839] text-white px-4 py-2 rounded-full font-semibold text-xs shadow-[0_4px_14px_rgba(56,90,72,0.2)] active:scale-95 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white font-mono text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#385A48]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Savatcha</span>
              {cartCount > 0 && (
                <span className="font-mono bg-white/20 px-2 py-0.5 rounded-full text-[11px]">
                  {formatPrice(cartTotal, language)}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
