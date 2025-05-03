import { motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";

interface DestinationDetailHeaderProps {
  title: string;
  imageSrc: string;
  duration: string;
  activityLevel: string;
  activityType: string[];
  groupSize: string;
  onReserveClick?: () => void;
}

const DestinationDetailHeader: React.FC<DestinationDetailHeaderProps> = ({
  title,
  imageSrc,
  duration,
  activityLevel,
  activityType,
  groupSize,
  onReserveClick,
}) => {
  const scrollToContent = () => {
    const contentSection = document.getElementById("destination-content");
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative h-[60vh] md:h-[70vh] min-h-[550px] md:min-h-[500px] max-h-[600px] w-full mb-28 md:mb-16">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Título centrado (oculto en móvil) */}
      <div className="absolute inset-0 md:flex flex-col items-center justify-center text-white z-10 hidden">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {title}
        </motion.h1>

        {/* Botón de scroll */}
        <motion.button
          onClick={scrollToContent}
          className="absolute bottom-28 left-1/2 transform -translate-x-1/2 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          whileHover={{ y: 5 }}
        >
          <div className="animate-bounce">
            <HiChevronDown size={42} />
          </div>
        </motion.button>
      </div>

      {/* Barra de información */}
      <div className="absolute -bottom-24 md:-bottom-16 left-0 right-0 flex justify-center z-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="bg-white flex flex-col md:flex-row justify-between items-stretch rounded-md shadow-lg overflow-hidden">
            {/* Título del destino solo visible en móvil */}
            <div className="w-full p-4 bg-primary-brown-light text-center md:hidden">
              <h2 className="text-xl font-bold text-gray-50">{title}</h2>
            </div>
            
            <div className="w-full md:w-1/5 p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <h3 className="text-gray-500 text-sm mb-1">Duración</h3>
              <p className="font-medium">{duration}</p>
            </div>

            <div className="w-full md:w-1/5 p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <h3 className="text-gray-500 text-sm mb-1">Nivel de actividad</h3>
              <p className="font-medium">{activityLevel}</p>
            </div>

            <div className="w-full md:w-1/5 p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <h3 className="text-gray-500 text-sm mb-1">Tipo de actividad</h3>
              <p className="font-medium">{activityType.join(" - ")}</p>
            </div>

            <div className="w-full md:w-1/5 p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <h3 className="text-gray-500 text-sm mb-1">Tamaño del Grupo</h3>
              <p className="font-medium">{groupSize}</p>
            </div>

            <div className="w-full md:w-1/5 flex">
              <button 
                onClick={onReserveClick} 
                className="w-full min-h-[50px] bg-primary-green text-black font-medium hover:bg-primary-green-dark transition-colors flex items-center justify-center"
              >
                Reservar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailHeader;
