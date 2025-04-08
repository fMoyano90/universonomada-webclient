import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link 
      to="/" 
      className={`text-2xl font-bold text-primary-brown flex flex-col items-start ${className}`}
    >
      <div className="flex items-center">
        <span className="font-light tracking-wider">Universo</span>
        <span className="font-bold ml-1">Nómada</span>
      </div>
      <span className="text-xs block text-primary-orange font-normal tracking-widest mt-[-3px]">VIAJES</span>
    </Link>
  );
};

export default Logo; 