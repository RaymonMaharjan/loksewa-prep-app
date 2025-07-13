
'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdBanner = ({
  'data-ad-client': dataAdClient,
  'data-ad-slot': dataAdSlot,
  'data-ad-format': dataAdFormat = 'auto',
  'data-full-width-responsive': dataFullWidthResponsive = 'true',
  className,
}: {
  'data-ad-client': string;
  'data-ad-slot': string;
  'data-ad-format'?: string;
  'data-full-width-responsive'?: string;
  className?: string;
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  // In development, show a placeholder. In production, show the ad.
  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        className={`flex items-center justify-center bg-muted border border-dashed h-24 text-muted-foreground ${className}`}
      >
        Ad Placeholder
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client={dataAdClient}
      data-ad-slot={dataAdSlot}
      data-ad-format={dataAdFormat}
      data-full-width-responsive={dataFullWidthResponsive}
    ></ins>
  );
};

export default AdBanner;
