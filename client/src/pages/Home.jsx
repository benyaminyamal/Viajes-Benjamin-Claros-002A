import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDestinations } from '../api/rest';
import { DestinationCard } from '../components/DestinationCard';
import { ErrorState, SkeletonGrid } from '../components/Status';
import { usePageTitle } from '../hooks/usePageTitle';

export function Home() {
  usePageTitle('Inicio');
  const [destinations, setDestinations] = useState([]);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getDestinations({}, controller.signal)
      .then((data) => {
        setDestinations(data);
        setStatus('ready');
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setStatus('error');
      });
    return () => controller.abort();
  }, [attempt]);

  const featured = destinations.filter((destination) => destination.featured);

  return (
    <>
      <section className="banner">
        <div className="wrap">
          <h1>Agencia de viajes</h1>
          <p>
            Elige un destino para ver el país y las actividades. Después puedes revisar los vuelos
            y hoteles de esa ciudad.
          </p>
          <Link className="button" to="/destinos">
            Ver destinos
          </Link>
        </div>
      </section>

      <section className="wrap section" id="como-funciona">
        <h2>Cómo funciona</h2>
        <ol className="steps">
          <li>
            <h3>1. Elige un destino</h3>
            <p>La lista muestra el país y las actividades populares. Esos datos vienen de una API REST.</p>
          </li>
          <li>
            <h3>2. Revisa vuelos y hoteles</h3>
            <p>Entran precios, fechas y cupos del destino elegido. Esa consulta se hace con GraphQL.</p>
          </li>
          <li>
            <h3>3. Arma un plan</h3>
            <p>Marcas un vuelo y un hotel, y la página muestra el total estimado.</p>
          </li>
        </ol>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2>Destinos destacados</h2>
          <Link to="/destinos">Ver todos</Link>
        </div>
        {status === 'error' ? (
          <ErrorState
            message="No se pudo cargar la lista de destinos."
            onRetry={() => setAttempt((value) => value + 1)}
          />
        ) : null}
        {status === 'loading' ? <SkeletonGrid /> : null}
        {status === 'ready' ? (
          <div className="card-grid">
            {featured.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}
