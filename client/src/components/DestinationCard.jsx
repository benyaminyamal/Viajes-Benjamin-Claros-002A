import { Link } from 'react-router-dom';
import { Cover } from './Cover';

export function DestinationCard({ destination }) {
  const activities = destination.popularActivities.slice(0, 3);
  const extra = destination.popularActivities.length - activities.length;

  return (
    <Link className="destination-card" to={`/destinos/${destination.id}`}>
      <Cover
        src={destination.image}
        alt=""
        color={destination.accent}
        position={destination.imagePosition}
      />
      <div className="destination-card-body">
        <p className="eyebrow">
          {destination.region} · {destination.country}
        </p>
        <h2>{destination.name}</h2>
        <p>{destination.tagline}</p>
        <ul className="chips" aria-label="Actividades populares">
          {activities.map((activity) => (
            <li key={activity}>{activity}</li>
          ))}
          {extra > 0 ? <li>+{extra}</li> : null}
        </ul>
        <span className="text-link">Ver destino</span>
      </div>
    </Link>
  );
}
