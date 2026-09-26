import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, Send, AlertCircle, Check, Loader2 } from 'lucide-react';
import { CartItem, Language, Order } from '../types';
import { formatPrice } from '../utils/format';
import { translations } from '../data/translations';
import { sendOrderToTelegram } from '../utils/telegram';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onClearCart: () => void;
  onConfirmOrder: (order: Order) => void;
  language: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
  onConfirmOrder,
  language,
}) => {
  const [tableInput, setTableInput] = useState('');
  const [payToWaiter, setPayToWaiter] = useState(true);
  const [kitchenNote, setKitchenNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = translations[language];

  if (!isOpen) return null;

  const totalPrice = items.reduce(
    (sum, ci) => sum + ci.item.price * ci.quantity,
    0
  );

  const handleSendOrderToBot = async () => {
    if (items.length === 0) {
      setError(t.emptyCart);
      return;
    }

    if (!tableInput.trim()) {
      setError(t.tableRequiredError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const orderId = 'DC-' + Math.floor(1000 + Math.random() * 9000);
    const orderTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const order: Order = {
      id: orderId,
      items: [...items],
      totalPrice,
      tableNumber: tableInput.trim(),
      payToWaiter,
      note: kitchenNote.trim() || undefined,
      createdAt: orderTime,
      status: 'new',
    };

    try {
      const result = await sendOrderToTelegram(order, items, language);

      if (result.success) {
        setTableInput('');
        setKitchenNote('');
        onConfirmOrder(order);
      } else {
        setError(
          result.error
            ? `Telegram xatosi: ${result.error}`
            : 'Buyurtmani Telegram botga yuborishda xatolik yuz berdi. Iltimos qaytadan urining.'
        );
      }
    } catch {
      setError('Internetga ulanishda xatolik yuz berdi. Iltimos qaytadan urining.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-[0_16px_50px_rgba(40,30,20,0.22)] border border-[#EFE8DD] flex flex-col my-auto transition-all ${
          items.length > 0
            ? 'max-w-md md:max-w-3xl lg:max-w-4xl h-[92dvh] md:h-[620px]'
            : 'max-w-md h-auto'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header (Fixed top) */}
        <div className="px-5 py-3.5 border-b border-[#EFE8DD] flex items-center justify-between bg-[#F7F3EC]/95 shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2A2521]">
              {t.cartTitle}
            </h2>
            {items.length > 0 && (
              <span className="text-xs bg-[#EEF5F1] text-[#385A48] font-bold px-2.5 py-0.5 rounded-full border border-[#D5E5DA]">
                {items.length} {t.itemCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-[11px] font-semibold text-[#8C8277] hover:text-rose-700 px-2 py-1 rounded-lg transition-colors cursor-pointer hidden sm:flex items-center gap-1"
                title="Savatchani tozalash"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Tozalash</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white text-[#665D55] border border-[#E8E1D5] flex items-center justify-center hover:bg-[#F2ECE3] transition-colors cursor-pointer"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#EFE9DF] flex items-center justify-center mx-auto text-[#8F857B]">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2A2521]">
              {t.emptyCart}
            </h3>
            <p className="text-xs text-[#7A7168] max-w-xs mx-auto">
              {t.emptyCartDesc}
            </p>
            <button
              onClick={onClose}
              className="mt-3 inline-block bg-[#385A48] hover:bg-[#2C4839] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xs active:scale-95 cursor-pointer"
            >
              {t.backToMenu}
            </button>
          </div>
        ) : (
          /* Desktop 2-column or Mobile stacked layout */
          <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left: Food Items List */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-5 space-y-2.5 border-b md:border-b-0 md:border-r border-[#EFE8DD]">
              <div className="text-xs font-bold text-[#8C8277] uppercase tracking-wider mb-2 hidden md:block">
                Tanlangan taomlar ro‘yxati:
              </div>
              {items.map((cartItem) => (
                <div
                  key={cartItem.item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#EFE9DF] shadow-2xs gap-3 hover:border-[#D8CFBF] transition-all"
                >
                  <img
                    src={cartItem.item.image}
                    alt={cartItem.item.name[language]}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-[#EFE9DF]"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm sm:text-[15px] font-bold text-[#2A2521] truncate">
                      {cartItem.item.name[language]}
                    </h4>
                    <p className="text-xs font-semibold text-[#385A48] font-mono mt-0.5">
                      {formatPrice(cartItem.item.price * cartItem.quantity, language)}
                    </p>
                  </div>

                  <div className="flex items-center bg-[#F7F3EC] rounded-full p-1 border border-[#E8E1D5] shrink-0">
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          cartItem.item.id,
                          cartItem.quantity - 1
                        )
                      }
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[#554C44] hover:bg-[#EAE3D8] active:scale-90 cursor-pointer"
                      aria-label="Kamaytirish"
                    >
                      <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                    </button>
                    <span className="w-5 sm:w-6 text-center text-xs font-bold text-[#2A2521] font-mono">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          cartItem.item.id,
                          cartItem.quantity + 1
                        )
                      }
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#385A48] text-white flex items-center justify-center hover:bg-[#2C4839] active:scale-90 cursor-pointer"
                      aria-label="Ko'paytirish"
                    >
                      <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Checkout & Details Form */}
            <div className="w-full md:w-[380px] lg:w-[420px] bg-[#FAF7F2] p-4 md:p-5 flex flex-col justify-between shrink-0 overflow-y-auto space-y-3.5 shadow-[0_-4px_18px_rgba(50,40,30,0.04)] md:shadow-none">
              
              {/* Error banner */}
              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-3">
                {/* Table Number + Payment Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#5A5148] mb-1">
                      <span>📍 {t.tableNumberLabel}</span>
                      <span className="text-[10px] text-amber-700 font-normal">majburiy</span>
                    </div>
                    <input
                      type="text"
                      value={tableInput}
                      onChange={(e) => {
                        setTableInput(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder={t.tableNumberPlaceholder}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-white border-2 border-[#E5DDD2] focus:border-[#385A48] focus:outline-hidden transition-all text-[#2A2521] placeholder:text-[#A69C92] placeholder:font-normal"
                    />
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-[#5A5148] mb-1">
                      <span>🤵 To‘lov turi</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPayToWaiter(!payToWaiter)}
                      className={`w-full px-3 py-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between text-left text-xs ${
                        payToWaiter
                          ? 'bg-[#EEF5F1] border-[#385A48] font-bold text-[#2A4736]'
                          : 'bg-white border-[#E5DDD2] text-[#6E645B]'
                      }`}
                    >
                      <span className="truncate">{t.payToWaiter}</span>
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ml-1 ${
                          payToWaiter
                            ? 'bg-[#385A48] text-white'
                            : 'border border-[#C5BDB2]'
                        }`}
                      >
                        {payToWaiter && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Kitchen Note */}
                <div>
                  <label className="block text-[11px] font-bold text-[#5A5148] mb-1">
                    📝 {t.kitchenNoteLabel} <span className="font-normal text-[#8C8277]">(ixtiyoriy)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={kitchenNote}
                    onChange={(e) => setKitchenNote(e.target.value)}
                    placeholder={t.kitchenNotePlaceholder}
                    className="w-full text-xs p-2.5 rounded-xl bg-white border border-[#E5DDD2] focus:border-[#385A48] focus:outline-hidden transition-all text-[#2A2521] placeholder:text-[#A69C92] resize-none"
                  />
                </div>
              </div>

              {/* Price Breakdown & Telegram Button */}
              <div className="space-y-3 pt-2 border-t border-[#EFE8DD]">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-[#665D55]">
                    {t.totalPrice}:
                  </span>
                  <span className="font-serif text-lg sm:text-xl font-bold text-[#385A48] font-mono">
                    {formatPrice(totalPrice, language)}
                  </span>
                </div>

                <button
                  onClick={handleSendOrderToBot}
                  disabled={isSubmitting}
                  className={`w-full text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(42,171,238,0.22)] active:scale-98 transition-all cursor-pointer ${
                    isSubmitting
                      ? 'bg-[#2AABEE]/70 cursor-not-allowed'
                      : 'bg-[#2AABEE] hover:bg-[#2399D6]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.sendingOrder}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.sendToTelegramBot}</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-[#8C8277]">
                  Buyurtma to‘g‘ridan-to‘g‘ri <b>@diamond_cafe_bot</b> orqali oshxona va ma‘muriyatga yuboriladi
                </p>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
