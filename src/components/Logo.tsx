import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link 
      to="/" 
      // Changed text-primary-brown to text-primary-orange
      className={`text-2xl font-bold text-primary-orange flex flex-col items-start ${className}`} 
    >
      <div className="flex items-center">
        <span className="font-light tracking-wider">Universo</span>
        <span className="font-bold ml-1">Nómada</span>
      </div>
      {/* Removed the VIAJES span */}
    </Link>
  );
};

export default Logo;
