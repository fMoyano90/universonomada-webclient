// Enumeraciones para estados de las reservas y cotizaciones

export enum BookingStatus {
  // Estados para cotizaciones
  PENDING = 'pending',          // Pendiente
  IN_REVIEW = 'in_review',      // En revisión
  SENT = 'sent',                // Enviado
  
  // Estados para reservas
  IN_CONTACT = 'in_contact',    // En contacto
  APPROVED = 'approved',        // Aprobado
  APPROVED_AND_PAID = 'approved_and_paid', // Aprobado y pagado
  REJECTED = 'rejected',        // Rechazado
  
  // Estados comunes
  CANCELLED = 'cancelled',      // Cancelado
  COMPLETED = 'completed',      // Completado
}

export enum BookingType {
  QUOTE = 'quote',
  BOOKING = 'booking',
} 