import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Clock, MapPin, Receipt, UtensilsCrossed, X } from 'lucide-react';
import { Order, Language } from '../types';
import { formatPrice } from '../utils/format';
import { translations } from '../data/translations';

interface OrderSuccessModalProps {
  order: Order;
  onClose: () => void;
  language: Language;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  language,
}) => {
  const t = translations[language];

  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#385A48', '#C99456', '#528368', '#45A3D9'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(40,30,20,0.18)] border border-[#EFE8DD] flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 text-center bg-[#F7F3EC] border-b border-[#EFE8DD] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-[#E8E1D5] text-[#665D55] flex items-center justify-center hover:bg-[#F2ECE3] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-full bg-[#EEF5F1] text-[#385A48] flex items-center justify-center mx-auto mb-3 shadow-2xs border border-[#D3E5DA]">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#2A2521]">
            {t.orderSuccessTitle}
          </h2>
          <p className="text-xs text-[#7A7168] mt-1 max-w-xs mx-auto">
            {t.orderSuccessDesc}
          </p>

          <div className="mt-4 inline-block bg-white px-4 py-1.5 rounded-full border border-[#E8E1D5] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#8C8277] mr-2">{t.orderNumber}:</span>
            <span className="font-mono text-sm font-extrabold text-[#385A48]">
              {order.id}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-[#EFE9DF] space-y-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#6B6158] font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#385A48]" />
                {t.tableNumberLabel}:
              </span>
              <span className="font-bold text-[#2A2521]">
                {order.tableNumber}-sonli stol
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#6B6158] font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#385A48]" />
                {t.estimatedTime}:
              </span>
              <span className="font-bold text-[#2A2521]">
                15-20 {t.minutes}
              </span>
            </div>

            {order.payToWaiter && (
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[#6B6158] font-semibold">
                  <span>🤵</span>
                  To‘lov turi:
                </span>
                <span className="font-bold text-[#385A48]">
                  {t.payToWaiter}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F0EAE1]">
              <span className="flex items-center gap-1.5 text-[#6B6158] font-semibold">
                <Receipt className="w-3.5 h-3.5 text-[#385A48]" />
                {t.totalPrice}:
              </span>
              <span className="font-bold text-base font-serif text-[#385A48] font-mono">
                {formatPrice(order.totalPrice, language)}
              </span>
            </div>
          </div>

          {/* Ordered items breakdown */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C8277] flex items-center gap-1">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              Taomlar ro‘yxati:
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
              {order.items.map((ci) => (
                <div
                  key={ci.item.id}
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-white border border-[#EFE9DF]"
                >
                  <span className="font-medium text-[#2A2521] truncate pr-2">
                    {ci.item.name[language]} <span className="font-bold text-[#9C9389]">×{ci.quantity}</span>
                  </span>
                  <span className="font-mono font-semibold text-[#554D45] shrink-0">
                    {formatPrice(ci.item.price * ci.quantity, language)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EFE8DD] bg-[#FAF7F2]">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#385A48] hover:bg-[#2C4839] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(56,90,72,0.22)] active:scale-95 cursor-pointer"
          >
            {t.newOrder}
          </button>
        </div>
      </div>
    </div>
  );
};
