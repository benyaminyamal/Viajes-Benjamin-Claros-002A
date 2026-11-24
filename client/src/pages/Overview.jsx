import { Link, useOutletContext } from 'react-router-dom';

export function Overview() {
  const { destination } = useOutletContext();

  return (
    <div className="overview">
      <div>
        <p className="eyebrow">Ficha del destino · API REST</p>
        <h2>Información de {destination.name}</h2>
        <p className="lede">{destination.description}</p>
        <dl className="facts">
          <div>
            <dt>País</dt>
            <dd>{destination.country}</dd>
          </div>
          <div>
            <dt>Temporada</dt>
            <dd>{destination.season}</dd>
          </div>
          <div>
            <dt>Clima</dt>
            <dd>{destination.climate}</dd>
          </div>
          <div>
            <dt>Aeropuerto</dt>
            <dd>
              {destination.airportName} ({destination.airport})
            </dd>
          </div>
        </dl>
      </div>

      <section>
        <h3>Actividades populares</h3>
        <ol className="activity-list">
          {destination.popularActivities.map((activity) => (
            <li key={activity}>{activity}</li>
          ))}
        </ol>
      </section>

      <section className="next-steps">
        <h3>Siguiente paso</h3>
        <Link to="vuelos">
          <span>Vuelos desde Santiago</span>
          <strong>Precios, fechas y asientos</strong>
        </Link>
        <Link to="hoteles">
          <span>Hoteles en {destination.name}</span>
          <strong>Tarifa por noche y habitaciones</strong>
        </Link>
      </section>
    </div>
  );
}
