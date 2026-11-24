import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { getFlights } from '../api/graphql';
import { FlightCard } from '../components/FlightCard';
import { EmptyState, ErrorState, SkeletonCards } from '../components/Status';
import { useTrip } from '../context/TripContext';
import { bestPriceId } from '../utils/format';

export function Flights() {
  const { id } = useParams();
  const { destination } = useOutletContext();
  const { flightId, selectFlight } = useTrip();
  const [flights, setFlights] = useState([]);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [sort, setSort] = useState('recommended');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    getFlights(id, controller.signal)
      .then((data) => {
        setFlights(data);
        setStatus('ready');
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setStatus('error');
      });
    return () => controller.abort();
  }, [id, attempt]);

  const visible = useMemo(() => {
    const copy = flights.filter((flight) => (onlyAvailable ? flight.available : true));
    if (sort === 'price') copy.sort((a, b) => a.price - b.price);
    if (sort === 'duration') copy.sort((a, b) => a.durationMinutes - b.durationMinutes);
    if (sort === 'stops') copy.sort((a, b) => a.stops - b.stops || a.price - b.price);
    return copy;
  }, [flights, onlyAvailable, sort]);

  const cheapest = bestPriceId(flights, 'price');

  return (
    <section>
      <header className="page-head">
        <p className="eyebrow">API GraphQL · consulta flights</p>
        <h2>Vuelos a {destination.name}</h2>
        <p>
          Ida y vuelta desde Santiago (SCL). Cada opción incluye tarifa, fechas y asientos libres.
        </p>
      </header>
      <CatalogToolbar
        sort={sort}
        onSort={setSort}
        onlyAvailable={onlyAvailable}
        onToggle={setOnlyAvailable}
        sortOptions={[
          ['recommended', 'Orden de la guía'],
          ['price', 'Menor precio'],
          ['duration', 'Menor duración'],
          ['stops', 'Menos escalas'],
        ]}
      />
      {status === 'loading' ? <SkeletonCards /> : null}
      {status === 'error' ? (
        <ErrorState
          message="La consulta de vuelos no llegó desde GraphQL."
          onRetry={() => setAttempt((value) => value + 1)}
        />
      ) : null}
      {status === 'ready' && visible.length === 0 ? (
        <EmptyState
          title="No hay vuelos con cupo"
          text="Quita el filtro para ver también las salidas agotadas."
        />
      ) : null}
      {status === 'ready' && visible.length > 0 ? (
        <div className="stack">
          {visible.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              selected={flight.id === flightId}
              badge={flightBadge(flight, cheapest)}
              onSelect={selectFlight}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function CatalogToolbar({ sort, onSort, onlyAvailable, onToggle, sortOptions }) {
  return (
    <div className="toolbar">
      <label className="search">
        Orden
        <select value={sort} onChange={(event) => onSort(event.target.value)}>
          {sortOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={onlyAvailable}
          onChange={(event) => onToggle(event.target.checked)}
        />
        Solo con cupo
      </label>
    </div>
  );
}

export function flightBadge(flight, cheapest) {
  if (!flight.available) return 'Sin cupo';
  if (flight.id === cheapest) return 'Mejor tarifa';
  if (flight.availableSeats <= 5) return 'Últimos cupos';
  return '';
}

export function hotelBadge(hotel, cheapest) {
  if (!hotel.available) return 'Sin cupo';
  if (hotel.id === cheapest) return 'Mejor tarifa';
  if (hotel.availableRooms <= 2) return 'Últimas habitaciones';
  return '';
}
