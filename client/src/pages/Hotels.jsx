import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { getHotels } from '../api/graphql';
import { HotelCard } from '../components/HotelCard';
import { EmptyState, ErrorState, SkeletonCards } from '../components/Status';
import { useTrip } from '../context/TripContext';
import { bestPriceId } from '../utils/format';
import { CatalogToolbar, hotelBadge } from './Flights';

export function Hotels() {
  const { id } = useParams();
  const { destination } = useOutletContext();
  const { hotelId, selectHotel } = useTrip();
  const [hotels, setHotels] = useState([]);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [sort, setSort] = useState('recommended');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    getHotels(id, controller.signal)
      .then((data) => {
        setHotels(data);
        setStatus('ready');
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setStatus('error');
      });
    return () => controller.abort();
  }, [id, attempt]);

  const visible = useMemo(() => {
    const copy = hotels.filter((hotel) => (onlyAvailable ? hotel.available : true));
    if (sort === 'price') copy.sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sort === 'stars') copy.sort((a, b) => b.stars - a.stars || a.pricePerNight - b.pricePerNight);
    if (sort === 'score') copy.sort((a, b) => b.guestScore - a.guestScore);
    return copy;
  }, [hotels, onlyAvailable, sort]);

  const cheapest = bestPriceId(hotels, 'pricePerNight');

  return (
    <section>
      <header className="page-head">
        <p className="eyebrow">API GraphQL · consulta hotels</p>
        <h2>Hoteles en {destination.name}</h2>
        <p>Tarifa por noche, fechas de estadía y habitaciones disponibles para este destino.</p>
      </header>
      <CatalogToolbar
        sort={sort}
        onSort={setSort}
        onlyAvailable={onlyAvailable}
        onToggle={setOnlyAvailable}
        sortOptions={[
          ['recommended', 'Orden de la guía'],
          ['price', 'Menor precio'],
          ['stars', 'Más estrellas'],
          ['score', 'Mejor nota'],
        ]}
      />
      {status === 'loading' ? <SkeletonCards /> : null}
      {status === 'error' ? (
        <ErrorState
          message="La consulta de hoteles no llegó desde GraphQL."
          onRetry={() => setAttempt((value) => value + 1)}
        />
      ) : null}
      {status === 'ready' && visible.length === 0 ? (
        <EmptyState
          title="No hay hoteles con habitación"
          text="Quita el filtro para ver también los que están llenos."
        />
      ) : null}
      {status === 'ready' && visible.length > 0 ? (
        <div className="stack">
          {visible.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              selected={hotel.id === hotelId}
              badge={hotelBadge(hotel, cheapest)}
              onSelect={selectHotel}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
