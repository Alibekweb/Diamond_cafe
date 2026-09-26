import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { SearchBar } from './components/SearchBar';
import { MenuItemCard } from './components/MenuItemCard';
import { ItemDetailModal } from './components/ItemDetailModal';
import { BottomCartBar } from './components/BottomCartBar';
import { CartDrawer } from './components/CartDrawer';
import { QRCodeModal } from './components/QRCodeModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { categories, menuItems } from './data/menuData';
import { translations } from './data/translations';
import { CartItem, Language, MenuItem, Order } from './types';
import { Utensils, Sparkles, Clock, ShieldCheck } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('diamond_cafe_lang') as Language;
    return saved && ['uz', 'ru', 'en'].includes(saved) ? saved : 'uz';
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Ensure dark mode is disabled
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('diamond_cafe_theme');
  }, []);

  // Persist language choice
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('diamond_cafe_lang', lang);
  };

  const t = translations[language];

  // Cart operations
  const handleIncrement = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleDecrement = (itemId: string) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: current - 1,
      };
    });
  };

  const handleUpdateQuantity = (itemId: string, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: qty,
      };
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  // Convert cart state to structured CartItems
  const cartItems: CartItem[] = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const item = menuItems.find((m) => m.id === id);
        if (!item || qty <= 0) return null;
        return { item, quantity: qty };
      })
      .filter((ci): ci is CartItem => ci !== null);
  }, [cart]);

  const totalCount = useMemo(() => {
    return Object.values(cart).reduce((sum, q) => sum + q, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, ci) => sum + ci.item.price * ci.quantity,
      0
    );
  }, [cartItems]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch =
          item.name[language]?.toLowerCase().includes(q) ||
          item.name.uz.toLowerCase().includes(q) ||
          item.name.ru.toLowerCase().includes(q) ||
          item.name.en.toLowerCase().includes(q);
        const descMatch =
          item.description[language]?.toLowerCase().includes(q) ||
          item.description.uz.toLowerCase().includes(q);
        const ingMatch = item.ingredients?.[language]
          ?.toLowerCase()
          .includes(q);

        return nameMatch || descMatch || ingMatch;
      }

      return true;
    });
  }, [activeCategory, searchQuery, language]);

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#2C2621] selection:bg-[#385A48]/15 font-sans antialiased flex flex-col">
      {/* Full-width responsive container */}
      <div className="w-full min-h-screen bg-[#FAF7F2] relative flex flex-col pb-28">
        
        {/* Top Header: Logo, QR, Lang, and Desktop Cart button */}
        <Header
          language={language}
          onLanguageChange={handleLanguageChange}
          onOpenQR={() => setIsQROpen(true)}
          cartCount={totalCount}
          cartTotal={totalPrice}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Cafe Title Section (Responsive for Mobile & Desktop PC) */}
        <section className="text-center pt-5 pb-3 px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF5F1] text-[#385A48] text-[11px] font-semibold mb-2 border border-[#D5E5DA]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diamond Cafe · Restoran & Cafe Menyu</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2A2521] tracking-tight">
            Diamond Cafe
          </h1>
          <p className="text-xs sm:text-sm md:text-base font-medium text-[#7A7168] mt-1.5 max-w-lg mx-auto leading-relaxed">
            {t.subtitleBottom}
          </p>

          {/* Highlights for Desktop / PC */}
          <div className="hidden sm:flex items-center justify-center gap-6 mt-3 text-xs text-[#7A7168]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#385A48]" />
              Ish vaqti: 09:00 - 23:00
            </span>
            <span className="text-[#D8CFBF]">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#385A48]" />
              Stolga to‘g‘ridan-to‘g‘ri buyurtma
            </span>
          </div>
        </section>

        {/* Search Bar */}
        <div className="my-1">
          <SearchBar
            query={searchQuery}
            onChange={setSearchQuery}
            placeholder={t.searchPlaceholder}
          />
        </div>

        {/* Category Horizontal Navigation */}
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          language={language}
        />

        {/* Menu Items List - Responsive Grid (1 col on mobile, 2 col on tablet, 3-4 col on desktop) */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#EFE9DF] flex items-center justify-center mx-auto text-[#8F857B]">
                <Utensils className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2A2521]">
                {t.noResults}
              </h3>
              <p className="text-xs sm:text-sm text-[#7A7168] max-w-xs mx-auto">
                {t.noResultsDesc}
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="mt-2 text-xs sm:text-sm font-semibold text-[#385A48] hover:text-[#2A4436] underline underline-offset-4 cursor-pointer"
              >
                {t.backToMenu}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  quantity={cart[item.id] || 0}
                  onIncrement={() => handleIncrement(item.id)}
                  onDecrement={() => handleDecrement(item.id)}
                  onSelect={() => setSelectedItem(item)}
                  language={language}
                />
              ))}
            </div>
          )}
        </main>

        {/* Sticky/Floating Bottom Order Bar */}
        {!isCartOpen && totalCount > 0 && (
          <BottomCartBar
            totalCount={totalCount}
            totalPrice={totalPrice}
            onOpenCart={() => setIsCartOpen(true)}
            language={language}
          />
        )}

        {/* Dish Detail Modal */}
        {selectedItem && (
          <ItemDetailModal
            item={selectedItem}
            currentQuantity={cart[selectedItem.id] || 0}
            onClose={() => setSelectedItem(null)}
            onUpdateQuantity={(qty) => handleUpdateQuantity(selectedItem.id, qty)}
            language={language}
          />
        )}

        {/* Cart Drawer / Modal */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleClearCart}
          onConfirmOrder={(order) => {
            setLastOrder(order);
            handleClearCart();
            setIsCartOpen(false);
          }}
          language={language}
        />

        {/* QR Code Modal for Site */}
        <QRCodeModal
          isOpen={isQROpen}
          onClose={() => setIsQROpen(false)}
          language={language}
        />

        {/* Order Success Confirmation */}
        {lastOrder && (
          <OrderSuccessModal
            order={lastOrder}
            onClose={() => setLastOrder(null)}
            language={language}
          />
        )}
      </div>
    </div>
  );
}
