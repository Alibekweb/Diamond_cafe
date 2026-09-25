import { CartItem, Language, Order } from '../types';
import { formatPrice } from './format';

export const TELEGRAM_CONFIG = {
  botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8821246854:AAEz_iiPIlxMx__V1hkR1ZNyG8BNgg6EJcY',
  chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID || '6060855601',
};

export const sendOrderToTelegram = async (
  order: Order,
  items: CartItem[],
  language: Language
): Promise<{ success: boolean; error?: string }> => {
  try {
    const itemListText = items
      .map(
        (ci, idx) =>
          `<b>${idx + 1}. ${escapeHtml(ci.item.name[language])}</b>\n   └ ${ci.quantity} dona × ${formatPrice(ci.item.price, language)} = <b>${formatPrice(ci.item.price * ci.quantity, language)}</b>`
      )
      .join('\n');

    const paymentLine = order.payToWaiter
      ? `🤵 <b>To'lov turi:</b> Ofitsiantga to'lash`
      : `💳 <b>To'lov turi:</b> Karta orqali`;

    const noteLine = order.note
      ? `\n📝 <b>Mijoz izohi:</b> <i>${escapeHtml(order.note)}</i>`
      : '';

    const text = 
`💎 <b>YANGI BUYURTMA — DIAMOND CAFE</b>
━━━━━━━━━━━━━━━━━━━━
🆔 <b>Buyurtma kodi:</b> <code>#${order.id}</code>
📍 <b>Stol raqami:</b> <b>${escapeHtml(order.tableNumber)}-sonli stol</b>
⏰ <b>Vaqti:</b> ${order.createdAt}
${paymentLine}${noteLine}

📋 <b>BUYURTMA TARKIBI:</b>
${itemListText}

━━━━━━━━━━━━━━━━━━━━
💰 <b>JAMI TO'LOV:</b> <b>${formatPrice(order.totalPrice, language)}</b>
━━━━━━━━━━━━━━━━━━━━
✨ <i>Mijoz buyurtmasi muvaffaqiyatli qabul qilindi!</i>`;

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CONFIG.chatId,
          text,
          parse_mode: 'HTML',
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error('Telegram API error:', data);
      return { success: false, error: data?.description || 'Telegramga yuborishda xatolik yuz berdi' };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('Failed to send order to Telegram:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Tarmoqda xatolik yuz berdi',
    };
  }
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
