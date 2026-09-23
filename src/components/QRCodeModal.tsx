import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Printer, Copy, Check, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const t = translations[language];

  // Base URL of the website
  const currentOrigin =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : 'https://diamondcafe.uz';

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      currentOrigin,
      {
        width: 260,
        margin: 2,
        color: {
          dark: '#2A2521',
          light: '#ffffff',
        },
      },
      (err) => {
        if (err) console.error('QR code generation error:', err);
      }
    );
  }, [isOpen, currentOrigin]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentOrigin);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    // Create a composite canvas for printing / downloading
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = 600;
    compositeCanvas.height = 760;
    const ctx = compositeCanvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, 600, 760);

    // Decorative inner border
    ctx.strokeStyle = '#385A48';
    ctx.lineWidth = 3;
    ctx.strokeRect(28, 28, 544, 704);

    // Title
    ctx.fillStyle = '#2A2521';
    ctx.font = 'bold 46px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Diamond Cafe', 300, 110);

    ctx.fillStyle = '#385A48';
    ctx.font = '600 24px sans-serif';
    ctx.fillText('Restoran Cafe', 300, 155);

    // Draw QR
    const qrImage = canvasRef.current;
    const qrSize = 340;
    const qrX = (600 - qrSize) / 2;
    const qrY = 220;

    // White box for QR
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30, 20);
    ctx.fill();
    ctx.strokeStyle = '#EAE2D6';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

    // Instruction text
    ctx.fillStyle = '#2A2521';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Telefon kamerangizni QR-kodga qarating', 300, 630);

    ctx.fillStyle = '#786E64';
    ctx.font = '15px sans-serif';
    ctx.fillText('va menyuni ochib to‘g‘ridan-to‘g‘ri buyurtma bering', 300, 660);

    ctx.fillStyle = '#385A48';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('Wi-Fi: Diamond_Cafe | Parol: diamond2026', 300, 700);

    // Trigger download
    const link = document.createElement('a');
    link.download = `diamond-cafe-qr-menyu.png`;
    link.href = compositeCanvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(40,30,20,0.18)] border border-[#EFE8DD] flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EFE8DD] flex items-center justify-between bg-[#F7F3EC]/90">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#2A2521] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#385A48]"></span>
              {t.qrTitle}
            </h2>
            <p className="text-xs text-[#7A7066]">
              Diamond Cafe · Restoran Cafe
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E8E1D5] text-[#665D55] flex items-center justify-center hover:bg-[#F2ECE3] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          <p className="text-xs text-[#665D55] leading-relaxed text-center">
            {t.qrSubtitle}
          </p>

          {/* QR Display Card */}
          <div className="bg-white p-5 rounded-3xl border border-[#EFE9DF] flex flex-col items-center text-center shadow-xs">
            <h3 className="font-serif text-2xl font-bold text-[#2A2521] mt-1">
              Diamond Cafe
            </h3>
            <span className="text-xs font-semibold text-[#385A48] mb-3">
              Restoran Cafe
            </span>

            {/* QR Canvas */}
            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D8] inline-block shadow-2xs">
              <canvas ref={canvasRef} className="rounded-lg max-w-[220px] max-h-[220px]" />
            </div>

            <p className="text-[11px] text-[#665D55] mt-3 font-medium">
              Kamerani qarating va menyuga kiring
            </p>
            <p className="text-[10px] text-[#8C8277] font-mono mt-1">
              Wi-Fi: Diamond_Cafe · Parol: diamond2026
            </p>
          </div>

          {/* Quick link & Copy */}
          <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-[#EFE9DF]">
            <input
              type="text"
              readOnly
              value={currentOrigin}
              className="bg-transparent text-xs text-[#554C44] font-mono flex-1 outline-hidden truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-[#F7F3EC] text-[#2A2521] text-xs font-semibold flex items-center gap-1 hover:bg-[#EFE9DF] cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#385A48]" />
                  <span className="text-[#385A48]">{t.linkCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copyLink}</span>
                </>
              )}
            </button>
            <a
              href={currentOrigin}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-[#8C8277] hover:text-[#2A2521]"
              title="Havolani ochish"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#EFE8DD] bg-[#FAF7F2] flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 bg-[#385A48] hover:bg-[#2C4839] text-white py-3 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(56,90,72,0.22)] active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t.downloadQR}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-3 rounded-2xl bg-white border border-[#E8E1D5] text-[#4A4138] text-xs font-bold flex items-center gap-1.5 hover:bg-[#F7F3EC] active:scale-95 cursor-pointer"
            title="Chop etish"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printQR}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
