interface BrandLogoProps {
  className?: string;
  inverse?: boolean;
  transparent?: boolean;
}

export default function BrandLogo({ className = '', inverse = false, transparent = false }: BrandLogoProps) {
  const logoPath = inverse || transparent
    ? '/images/yourfounderdock-logo-circle-transparent.png'
    : '/images/yourfounderdock-logo-circle.png';

  return (
    <img
      src={logoPath}
      alt=""
      className={`block shrink-0 object-contain ${inverse ? 'mix-blend-screen' : ''} ${className}`}
      style={inverse ? { filter: 'invert(1)' } : undefined}
    />
  );
}
