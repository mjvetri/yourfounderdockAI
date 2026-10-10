interface BrandLogoProps {
  className?: string;
  inverse?: boolean;
}

export default function BrandLogo({ className = '', inverse = false }: BrandLogoProps) {
  return (
    <img
      src="/images/yourfounderdock-logo.png"
      alt=""
      className={`block shrink-0 object-contain ${inverse ? 'mix-blend-screen' : 'mix-blend-multiply'} ${className}`}
      style={inverse ? { filter: 'invert(1)' } : undefined}
    />
  );
}
