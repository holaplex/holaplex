import React, { FC, useEffect, useRef } from 'react';

import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  DrawType,
  ErrorCorrectionLevel,
  Mode,
  Options,
  TypeNumber,
} from '@solana/qr-code-styling';

export function createQROptions(
  url: string | URL,
  size = 512,
  background = 'white',
  color = 'black'
): Options {
  return {
    type: 'svg' as DrawType,
    width: size,
    height: size,
    data: String(url),
    margin: 16,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: 'Byte' as Mode,
      errorCorrectionLevel: 'Q' as ErrorCorrectionLevel,
    },
    backgroundOptions: { color: background },
    dotsOptions: { type: 'extra-rounded' as DotType, color },
    cornersSquareOptions: {
      type: 'extra-rounded' as CornerSquareType,
      color,
    },
    cornersDotOptions: { type: 'square' as CornerDotType, color },
    imageOptions: { hideBackgroundDots: true, imageSize: 0.15, margin: 8 },
  };
}

interface QRCodeProps {
  data: string;
  size?: number;
  background?: string;
  color?: string;
}
export default function QRCode({
  data,
  size = 300,
  background = 'white',
  color = 'black',
}: QRCodeProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const qr = new QRCodeStyling(createQROptions(data, size, background, color));
      qr.append(ref.current);
    }
  }, [background, color, data, ref, size]);
  return <div ref={ref} />;
}
