import { formatRange, money, nightsBetween, roomsLabel } from '../utils/format';

export function HotelCard({ hotel, selected, badge, onSelect }) {
  const nights = nightsBetween(hotel.checkIn, hotel.checkOut);

  return (
    <article
      className={`option-card ${selected ? 'is-selected' : ''} ${hotel.available ? '' : 'is-unavailable'}`}
    >
      <header className="option-top">
        <div>
          <p className="stars" aria-label={`${hotel.stars} de 5 estrellas`}>
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className={index < hotel.stars ? 'is-on' : ''}>
                ★
              </span>
            ))}
          </p>
          <h3>{hotel.name}</h3>
          <p className="option-place">{hotel.neighborhood}</p>
        </div>
        <p className="score">
          <strong>{hotel.guestScore.toFixed(1)}</strong>
          <span>nota</span>
        </p>
      </header>

      <p className="option-note">{hotel.address}</p>
      <ul className="chips">
        {hotel.amenities.map((amenity) => (
          <li key={amenity}>{amenity}</li>
        ))}
      </ul>
      <p className="option-note">
        {formatRange(hotel.checkIn, hotel.checkOut)} · {nights} {nights === 1 ? 'noche' : 'noches'}
      </p>

      {badge ? <span className={`badge ${badge === 'Sin cupo' ? 'is-muted' : ''}`}>{badge}</span> : null}

      <footer className="option-foot">
        <div>
          <strong>{money(hotel.pricePerNight, hotel.currency)}</strong>
          <span>por noche · {roomsLabel(hotel)}</span>
        </div>
        <button
          type="button"
          className="button button-small"
          aria-pressed={selected}
          disabled={!hotel.available}
          onClick={() => onSelect(hotel)}
        >
          {selected ? 'Quitar' : hotel.available ? 'Elegir hotel' : 'Sin cupo'}
        </button>
      </footer>
    </article>
  );
}
