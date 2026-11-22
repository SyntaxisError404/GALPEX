import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeImageProps {
  /** Texto o URL a codificar (lo que leerá un lector de QR real). */
  value: string;
  /** Tamaño en px (cuadrado). */
  size?: number;
  className?: string;
  /** Color de los módulos oscuros del QR. */
  dark?: string;
  /** Color del fondo del QR. */
  light?: string;
}

// Genera un código QR REAL y escaneable (no un dibujo) a partir de `value`.
export const QrCodeImage: React.FC<QrCodeImageProps> = ({
  value,
  size = 200,
  className,
  dark = '#0f172a',
  light = '#ffffff'
}) => {
  const [src, setSrc] = useState<string>('');
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark, light }
    })
      .then((url) => { if (active) { setSrc(url); setFailed(false); } })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [value, size, dark, light]);

  if (failed) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center bg-slate-100 text-slate-400 text-xs rounded ${className || ''}`}
      >
        QR no disponible
      </div>
    );
  }

  if (!src) {
    // Placeholder mientras se genera (evita saltos de layout)
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-slate-100 animate-pulse rounded ${className || ''}`}
        aria-label="Generando código QR"
      />
    );
  }

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt="Código QR de custodia KARGON"
      className={className}
    />
  );
};
