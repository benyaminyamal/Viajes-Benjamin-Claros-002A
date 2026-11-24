import { createContext, useContext, useMemo, useState } from 'react';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [flightId, setFlightId] = useState(null);
  const [hotelId, setHotelId] = useState(null);

  const value = useMemo(
    () => ({
      flightId,
      hotelId,
      selectFlight(flight) {
        if (!flight?.available) return;
        setFlightId((current) => (current === flight.id ? null : flight.id));
      },
      selectHotel(hotel) {
        if (!hotel?.available) return;
        setHotelId((current) => (current === hotel.id ? null : hotel.id));
      },
      clear() {
        setFlightId(null);
        setHotelId(null);
      },
    }),
    [flightId, hotelId],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip debe usarse dentro del destino seleccionado.');
  }
  return context;
}
