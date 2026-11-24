import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { getTripOptions } from '../api/graphql';
import { FlightCard } from '../components/FlightCard';
import { HotelCard } from '../components/HotelCard';
import { ErrorState, SkeletonCards } from '../components/Status';
import { useTrip } from '../context/TripContext';
import { bestPriceId, money, nightsBetween } from '../utils/format';
import { flightBadge, hotelBadge } from './Flights';

export function Plan() {
  const { id } = useParams();
  const { destination } = useOutletContext();
  const { flightId, hotelId, selectFlight, selectHotel, clear } = useTrip();
  const [options, setOptions] = useState({ flights: [], hotels: [] });
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [code, setCode] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    getTripOptions(id, controller.signal)
      .then((data) => {
        setOptions(data);
        setStatus('ready');
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setStatus('error');
      });
    return () => controller.abort();
  }, [id, attempt]);

  useEffect(() => {
    setCode(null);
  }, [flightId, hotelId]);

  const flight = options.flights.find((item) => item.id === flightId) || null;
  const hotel = options.hotels.find((item) => item.id === hotelId) || null;
  const nights = hotel ? nightsBetween(hotel.checkIn, hotel.checkOut) : 0;
  const stayTotal = hotel ? hotel.pricePerNight * nights : 0;
  const total = (flight?.price || 0) + stayTotal;
  const cheapestFlight = useMemo(() => bestPriceId(options.flights, 'price'), [options.flights]);
  const cheapestHotel = useMemo(
    () => bestPriceId(options.hotels, 'pricePerNight'),
    [options.hotels],
  );

  function confirm() {
    if (!flight || !hotel) return;
    const prefix = destination.id.replace(/[^a-z]/gi, '').slice(0, 3).toUpperCase();
    const number = Math.floor(1000 + Math.random() * 9000);
    setCode(`AV-${prefix}-${number}`);
  }

  return (
    <section>
      <header className="page-head">
        <p className="eyebrow">API GraphQL · vuelos y hoteles en una consulta</p>
        <h2>Plan para {destination.name}</h2>
        <p>
          Elige un vuelo y un hotel. El total suma el pasaje de ida y vuelta con las noches del
          hotel.
        </p>
      </header>

      {status === 'error' ? (
        <ErrorState
          message="No se pudo armar el plan porque GraphQL no respondió."
          onRetry={() => setAttempt((value) => value + 1)}
        />
      ) : null}

      {status === 'loading' ? <SkeletonCards count={2} /> : null}

      {status === 'ready' ? (
        <>
          <aside className="summary" aria-live="polite">
            {code ? (
              <div className="confirmation">
                <p className="eyebrow">Plan armado</p>
                <h3>Código {code}</h3>
                <p>
                  {flight.airline} {flight.flightNumber} y {hotel.name}. Es una reserva simulada:
                  no hay cobro ni cupo bloqueado.
                </p>
                <button
                  className="button button-small"
                  type="button"
                  onClick={() => {
                    clear();
                    setCode(null);
                  }}
                >
                  Armar otro plan
                </button>
              </div>
            ) : (
              <>
                <p className="eyebrow">Tu combinación</p>
                <SummaryRow
                  label="Vuelo"
                  value={flight ? `${flight.airline} ${flight.flightNumber}` : null}
                  amount={flight ? money(flight.price, flight.currency) : null}
                  href={`/destinos/${destination.id}/vuelos`}
                  empty="Elegir vuelo"
                />
                <SummaryRow
                  label={hotel ? `Hotel · ${nights} noches` : 'Hotel'}
                  value={hotel ? hotel.name : null}
                  amount={hotel ? money(stayTotal, hotel.currency) : null}
                  href={`/destinos/${destination.id}/hoteles`}
                  empty="Elegir hotel"
                />
                <div className="summary-total">
                  <span>{flight && hotel ? 'Total estimado' : 'Total parcial'}</span>
                  <strong>{money(total)}</strong>
                </div>
                <p className="option-note">
                  Vuelo ida y vuelta + noches × tarifa. No incluye traslados ni comidas fuera del
                  hotel.
                </p>
                <button className="button" type="button" disabled={!flight || !hotel} onClick={confirm}>
                  Confirmar plan
                </button>
              </>
            )}
          </aside>

          <div className="plan-grid">
            <div className="stack">
              <h3>Vuelos</h3>
              {options.flights.map((item) => (
                <FlightCard
                  key={item.id}
                  flight={item}
                  selected={item.id === flightId}
                  badge={flightBadge(item, cheapestFlight)}
                  onSelect={selectFlight}
                />
              ))}
            </div>
            <div className="stack">
              <h3>Hoteles</h3>
              {options.hotels.map((item) => (
                <HotelCard
                  key={item.id}
                  hotel={item}
                  selected={item.id === hotelId}
                  badge={hotelBadge(item, cheapestHotel)}
                  onSelect={selectHotel}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

function SummaryRow({ label, value, amount, href, empty }) {
  return (
    <div className="summary-row">
      <div>
        <span>{label}</span>
        {value ? <strong>{value}</strong> : <Link to={href}>{empty}</Link>}
      </div>
      {amount ? <em>{amount}</em> : null}
    </div>
  );
}
