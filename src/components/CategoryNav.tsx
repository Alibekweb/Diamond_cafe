import React, { useRef } from 'react';
import { Category, Language } from '../types';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  language: Language;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  language,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="py-2.5 px-4 sm:px-6 lg:px-8 sticky top-[57px] sm:top-[65px] z-20 bg-[#FAF7F2]/95 backdrop-blur-md transition-colors border-b border-[#EFE8DD]/70">
      <div
        ref={scrollRef}
        className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth sm:justify-center sm:flex-wrap py-0.5"
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`whitespace-nowrap px-4 py-2 sm:px-4.5 sm:py-2 rounded-full text-xs font-semibold tracking-wide transition-all shrink-0 active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-[#385A48] text-white shadow-xs'
                  : 'bg-white text-[#665D55] border border-[#E8E1D5] hover:bg-[#F7F3EC] hover:border-[#D8CFBF]'
              }`}
            >
              {category.name[language]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
