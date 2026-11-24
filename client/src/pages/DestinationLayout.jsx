import { useEffect, useState } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { getDestination } from '../api/rest';
import { Cover } from '../components/Cover';
import { ErrorState } from '../components/Status';
import { TripProvider, useTrip } from '../context/TripContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { NotFound } from './NotFound';

export function DestinationLayout() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);

  usePageTitle(destination?.name || (status === 'missing' ? 'Destino no encontrado' : 'Destino'));

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    setDestination(null);
    getDestination(id, controller.signal)
      .then((data) => {
        setDestination(data);
        setStatus('ready');
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setStatus(error.status === 404 ? 'missing' : 'error');
      });
    return () => controller.abort();
  }, [id, attempt]);

  if (status === 'loading') {
    return <p className="wrap page">Cargando destino...</p>;
  }

  if (status === 'missing') {
    return (
      <NotFound
        suppressTitle
        title="Destino no encontrado"
        text="Ese destino no está en la lista. Vuelve a destinos y elige otro."
      />
    );
  }

  if (status === 'error' || !destination) {
    return (
      <div className="wrap page">
        <ErrorState
          message="No se pudo leer la ficha del destino en la API REST."
          onRetry={() => setAttempt((value) => value + 1)}
        />
      </div>
    );
  }

  return (
    <TripProvider key={destination.id}>
      <section className="destination-banner">
        <Cover
          src={destination.image}
          alt={`Foto de ${destination.name}`}
          color={destination.accent}
          position={destination.imagePosition}
        />
      </section>
      <DestinationNav />
      <div className="wrap page-section">
        <header className="page-head">
          <p className="eyebrow">
            {destination.country} · {destination.region}
          </p>
          <h1>{destination.name}</h1>
          <p>{destination.tagline}</p>
        </header>
        <Outlet context={{ destination }} />
      </div>
    </TripProvider>
  );
}

function DestinationNav() {
  const { flightId, hotelId } = useTrip();
  const ready = Boolean(flightId && hotelId);

  return (
    <nav className="subnav" aria-label="Secciones del destino">
      <div className="wrap subnav-inner">
        <NavLink to="." end>
          Resumen
        </NavLink>
        <NavLink to="vuelos">Vuelos</NavLink>
        <NavLink to="hoteles">Hoteles</NavLink>
        <NavLink to="plan">
          Planificar
          {ready ? <span className="dot" aria-label="Vuelo y hotel elegidos" /> : null}
        </NavLink>
      </div>
    </nav>
  );
}
