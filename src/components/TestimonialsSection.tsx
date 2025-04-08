import { motion } from 'framer-motion';

// Interfaz para los testimonios
interface Testimonial {
  id: number;
  name: string;
  image: string;
  rating: number;
  text: string;
  images?: string[];
}

const TestimonialsSection = () => {
  // Datos de testimonios
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Marcelo P.",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "Excelente viaje los paisajes son sacados de una postal nuestro guía Raimundo y el chófer don Pablo hicieron que el viaje fuera 10 de 5 estrellas!!! Recomendado",
      images: ["/images/testimonials/sunset.jpg"]
    },
    {
      id: 2,
      name: "Pamela",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "Un muy buen tour a Campos de Hielo Sur con geoterra a cargo Raimundo González como guía y acompañado de don Pablo como chófer. Todo muy bien gestionando y coordinado. Se agradece la amabilidad, preocupación y dedicación de Raimundo con todo el grupo del 'Rompe huesos'.",
      images: ["/images/testimonials/waterfall-group.jpg"]
    },
    {
      id: 3,
      name: "Maria H.",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "Excelente experiencia un viaje espectacular, buen tiempo lugares maravillosos y todo esto complementado con el impecable desempeño de Max Sue Wong nuestra brillante guía, su simpatía, conocimientos, preocupación de todos y cada uno de los pasajeros, en resumen un siete",
      images: ["/images/testimonials/mountains.jpg"]
    },
    {
      id: 4,
      name: "Yasna M.",
      image: "/placeholder-avatar.jpg", 
      rating: 5,
      text: "Regresando de nuestro 3er viaje con GeoTerra esta vez acompañada de Mix-Sue una guía maravillosa, siempre dispuesta a responder todas las inquietudes y dudas pendiente de cada detalle para disfrutar el viaje hasta el último momento, espero en la próxima aventura encontrarme con ella",
      images: ["/images/testimonials/lake-group.jpg"]
    },
    {
      id: 5,
      name: "Karia V.",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "muy hermoso todo los lugares que hemos visitamos volveré sin duda de dudas!!",
      images: ["/images/testimonials/lake.jpg"]
    },
    {
      id: 6,
      name: "Victor A.",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "Todo el viaje fue maravilloso, y de la Guía nada malo que decir, un 7 ella, como Guía, persona, amiga, 100% recomiendo este a cualquier otro viaje con Mix-Sue... GRACIAS TOTALES !!!",
      images: ["/images/testimonials/boat-group.jpg"] 
    },
    {
      id: 7,
      name: "Patricio E.",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "El viaje a Patagonia Norte fue maravilloso y muy entretenido, para venir en pareja es recomendable, se disfruta mucho de los paisajes de esta zona junto al guía Dante que es una enciclopedia andante!!!, junto a su pareja Patricio, los dos hacen un equipo espectacular!!!",
      images: ["/images/testimonials/couple-boat.jpg"]
    },
    {
      id: 8,
      name: "Catalina B.",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "Excelente servicio y atención personalizada. Los guías son muy profesionales.",
      images: ["/images/testimonials/pillars.jpg"]
    }
  ];

  // Renderizar estrellas de calificación
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className="text-primary-orange">
          {i < rating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  return (
    <section className="py-20 px-4 bg-white relative">
      {/* Textura de fondo sutil */}
      <div className="absolute inset-0 opacity-5 z-0" 
           style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-3 text-gray-900">Nuestros Viajeros</h2>
          <div className="w-20 h-1 bg-primary-orange mx-auto rounded-full mb-6"></div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              {renderStars(5)}
              <span className="ml-2 text-gray-700 font-medium">48 Reseñas</span>
            </div>
            
            <div className="ml-6">
              <button 
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                aria-label="Filtrar reseñas"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-md"
            >
              {testimonial.images && testimonial.images.length > 0 && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={testimonial.images[0]} 
                    alt={`Foto de viaje de ${testimonial.name}`}
                    className="w-full h-full object-cover"
                  />
                  {testimonial.images.length > 1 && (
                    <span className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      +{testimonial.images.length - 1}
                    </span>
                  )}
                </div>
              )}
              
              <div className="p-5">
                <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                <div className="flex my-1">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-700 text-sm mt-2 line-clamp-4">{testimonial.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <button className="px-6 py-3 bg-primary-orange text-white rounded-lg hover:bg-primary-orange-dark transition-colors">
            Ver todas las reseñas
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 