import { formatDate, money, seatsLabel, stopsLabel } from '../utils/format';

export function FlightCard({ flight, selected, badge, onSelect }) {
  return (
    <article
      className={`option-card ${selected ? 'is-selected' : ''} ${flight.available ? '' : 'is-unavailable'}`}
    >
      <header className="option-top">
        <div>
          <p className="eyebrow">{flight.cabin}</p>
          <h3>
            {flight.airline} <span>{flight.flightNumber}</span>
          </h3>
        </div>
        {badge ? <span className={`badge ${badge === 'Sin cupo' ? 'is-muted' : ''}`}>{badge}</span> : null}
      </header>

      <div className="route">
        <div>
          <strong>{flight.originCode}</strong>
          <em>{flight.departureTime}</em>
          <span>{flight.originCity}</span>
        </div>
        <div className="route-mid">
          <span>{flight.duration}</span>
          <i />
          <span>{stopsLabel(flight.stops)}</span>
        </div>
        <div>
          <strong>{flight.destinationCode}</strong>
          <em>{flight.arrivalTime}</em>
          <span>{flight.destinationCity}</span>
        </div>
      </div>

      <p className="option-note">
        Ida {formatDate(flight.departureDate)} · Regreso {formatDate(flight.returnDate)}, salida {flight.returnTime}
      </p>

      <footer className="option-foot">
        <div>
          <strong>{money(flight.price, flight.currency)}</strong>
          <span>ida y vuelta · {seatsLabel(flight)}</span>
        </div>
        <button
          type="button"
          className="button button-small"
          aria-pressed={selected}
          disabled={!flight.available}
          onClick={() => onSelect(flight)}
        >
          {selected ? 'Quitar' : flight.available ? 'Elegir vuelo' : 'Sin cupo'}
        </button>
      </footer>
    </article>
  );
}
