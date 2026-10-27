import React from 'react';

export interface BrandLogoProps {
  variant?: 'horizontal' | 'stacked' | 'wordmark' | 'isotipo';
  theme?: 'color' | 'white' | 'monochrome';
  className?: string;
  height?: number | string;
  width?: number | string;
  alt?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  theme = 'color',
  className = '',
  height,
  width,
  alt = 'Gestión Digital & Social Media',
}) => {
  let src = '/brand/logos/svg/logo-horizontal.svg';

  if (variant === 'isotipo') {
    if (theme === 'white') {
      src = '/brand/logos/svg/isotipo-blanco.svg';
    } else if (theme === 'monochrome') {
      src = '/brand/logos/svg/isotipo-monocromo.svg';
    } else {
      src = '/brand/logos/svg/isotipo.svg';
    }
  } else if (variant === 'stacked') {
    if (theme === 'white') {
      src = '/brand/logos/svg/logo-apilado-blanco.svg';
    } else if (theme === 'monochrome') {
      src = '/brand/logos/svg/logo-apilado-monocromo.svg';
    } else {
      src = '/brand/logos/svg/logo-apilado.svg';
    }
  } else if (variant === 'wordmark') {
    if (theme === 'white') {
      src = '/brand/logos/svg/wordmark-blanco.svg';
    } else if (theme === 'monochrome') {
      src = '/brand/logos/svg/wordmark-monocromo.svg';
    } else {
      src = '/brand/logos/svg/wordmark.svg';
    }
  } else {
    // horizontal
    if (theme === 'white') {
      src = '/brand/logos/svg/logo-horizontal-blanco.svg';
    } else if (theme === 'monochrome') {
      src = '/brand/logos/svg/logo-horizontal-monocromo.svg';
    } else {
      src = '/brand/logos/svg/logo-horizontal.svg';
    }
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`select-none object-contain ${className}`}
      style={{
        ...(height !== undefined ? { height } : {}),
        ...(width !== undefined ? { width } : {}),
      }}
      loading="eager"
    />
  );
};
