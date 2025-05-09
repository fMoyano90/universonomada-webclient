// Enumeraciones para estados de las reservas y cotizaciones

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum BookingType {
  QUOTE = 'quote',
  BOOKING = 'booking',
} 