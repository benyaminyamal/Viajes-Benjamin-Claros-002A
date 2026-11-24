const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function formatDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export function formatRange(start, end) {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function money(amount, currency = 'USD') {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function nightsBetween(start, end) {
  const from = Date.parse(`${start}T00:00:00Z`);
  const to = Date.parse(`${end}T00:00:00Z`);
  return Math.max(0, Math.round((to - from) / 86400000));
}

export function stopsLabel(stops) {
  if (stops === 0) return 'Directo';
  if (stops === 1) return '1 escala';
  return `${stops} escalas`;
}

export function seatsLabel(flight) {
  if (!flight.available || flight.availableSeats <= 0) return 'Sin cupos';
  if (flight.availableSeats === 1) return 'Último asiento';
  return `${flight.availableSeats} asientos`;
}

export function roomsLabel(hotel) {
  if (!hotel.available || hotel.availableRooms <= 0) return 'Sin habitaciones';
  if (hotel.availableRooms === 1) return 'Última habitación';
  return `${hotel.availableRooms} habitaciones`;
}

export function bestPriceId(items, key) {
  const available = items.filter((item) => item.available);
  if (!available.length) return null;
  return available.reduce((best, item) => (item[key] < best[key] ? item : best)).id;
}
