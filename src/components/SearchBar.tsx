import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onChange: (query: string) => void;
  placeholder: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChange,
  placeholder,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-[#9C9287] absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-white border border-[#E8E1D5] rounded-2xl text-xs sm:text-sm font-medium text-[#2A2521] placeholder:text-[#9C9287] focus:outline-hidden focus:ring-2 focus:ring-[#385A48]/20 focus:border-[#385A48] transition-all shadow-[0_2px_8px_rgba(60,45,35,0.03)] hover:border-[#D8CFBF]"
        />
        {query && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 text-[#9C9287] hover:text-[#2A2521] p-1 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
