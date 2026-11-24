import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDestinations, getRegions } from '../api/rest';
import { DestinationCard } from '../components/DestinationCard';
import { EmptyState, ErrorState, SkeletonGrid } from '../components/Status';
import { usePageTitle } from '../hooks/usePageTitle';

export function Destinations() {
  usePageTitle('Destinos');
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const regionParam = searchParams.get('region') || 'Todas';
  const [regions, setRegions] = useState([]);
  const region = regionParam === 'Todas' || regions.length === 0 || regions.includes(regionParam)
    ? regionParam
    : 'Todas';
  const [destinations, setDestinations] = useState([]);
  const [status, setStatus] = useState('loading');
  const [pending, setPending] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getRegions(controller.signal)
      .then(setRegions)
      .catch((error) => {
        if (error.name !== 'AbortError') setRegions([]);
      });
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      setPending(true);
      getDestinations({ region, q }, controller.signal)
        .then((data) => {
          setDestinations(data);
          setStatus('ready');
        })
        .catch((error) => {
          if (error.name === 'AbortError') return;
          setStatus('error');
        })
        .finally(() => {
          if (!controller.signal.aborted) setPending(false);
        });
    }, 180);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [region, q, attempt]);

  function updateParam(key, value) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (!value || value === 'Todas') next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  }

  const filters = ['Todas', ...regions];

  return (
    <section className="wrap page">
      <header className="page-head">
        <p className="eyebrow">API REST · país y actividades populares</p>
        <h1>Destinos</h1>
        <p className="lede">
          Esta lista sale de la API REST. Puedes filtrar por región o buscar por ciudad, país o
          actividad.
        </p>
      </header>

      <div className="toolbar">
        <div className="filters" role="group" aria-label="Filtrar por región">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              className={region === item ? 'chip is-on' : 'chip'}
              aria-pressed={region === item}
              onClick={() => updateParam('region', item)}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">Buscar por ciudad, país o actividad</span>
          <input
            type="search"
            value={q}
            placeholder="Ciudad, país o actividad"
            onChange={(event) => updateParam('q', event.target.value)}
          />
        </label>
      </div>

      <p className="meta" aria-live="polite">
        {status === 'ready'
          ? `${destinations.length} ${destinations.length === 1 ? 'destino' : 'destinos'}`
          : status === 'error'
            ? 'La lista no está disponible'
            : 'Cargando destinos…'}
        {pending && status === 'ready' ? ' · actualizando' : ''}
      </p>

      {status === 'loading' ? <SkeletonGrid /> : null}
      {status === 'error' ? (
        <ErrorState
          message="No se pudo leer /api/destinations."
          onRetry={() => setAttempt((value) => value + 1)}
        />
      ) : null}
      {status === 'ready' && destinations.length === 0 ? (
        <EmptyState
          title="Ningún destino coincide"
          text="Prueba con otra región o borra la búsqueda."
          action={
            <button className="button" type="button" onClick={() => setSearchParams(new URLSearchParams())}>
              Limpiar filtros
            </button>
          }
        />
      ) : null}
      {status === 'ready' && destinations.length > 0 ? (
        <div className={pending ? 'card-grid is-pending' : 'card-grid'}>
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
