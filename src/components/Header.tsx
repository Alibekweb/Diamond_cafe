import React from 'react';
import { QrCode } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenQR: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenQR,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md px-4 py-3 border-b border-[#EFE8DD] transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#385A48] text-white flex items-center justify-center shadow-xs">
            <svg
              className="w-4 h-4"
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
          <span className="font-serif text-lg font-bold text-[#2A2521] tracking-tight leading-none">
            Diamond Cafe
          </span>
        </div>

        {/* Right side controls: QR button, Language pill */}
        <div className="flex items-center gap-2">
          {/* QR Code button */}
          <button
            onClick={onOpenQR}
            title="QR Menyu"
            className="w-8 h-8 rounded-full bg-white border border-[#E8E1D5] text-[#554C44] flex items-center justify-center hover:bg-[#F5EFE6] transition-colors shadow-2xs active:scale-95 cursor-pointer"
            aria-label="QR Menyu"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Language Switcher Pill */}
          <div className="flex items-center bg-[#EFE9DF] rounded-full p-0.5 text-xs font-semibold text-[#665D54]">
            {(['uz', 'ru', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-2.5 py-0.5 uppercase rounded-full text-[11px] transition-all cursor-pointer ${
                  language === lang
                    ? 'bg-white text-[#2A2521] shadow-2xs font-bold'
                    : 'text-[#7A7168] hover:text-[#2A2521]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
