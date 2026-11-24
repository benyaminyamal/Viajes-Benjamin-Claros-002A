async function request(url, signal) {
  let response;
  try {
    response = await fetch(url, {
      signal,
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    const failure = new Error(
      'No se pudo conectar con la API REST. Revisa que el servidor mock esté en el puerto 4000.',
    );
    failure.cause = error;
    throw failure;
  }

  if (response.status === 404) {
    const failure = new Error('No encontrado');
    failure.status = 404;
    throw failure;
  }

  if (!response.ok) {
    throw new Error('La API REST respondió con un error.');
  }

  return response.json();
}

export function getRegions(signal) {
  return request('/api/destinations/regions', signal);
}

export function getDestinations({ region, q } = {}, signal) {
  const params = new URLSearchParams();
  if (region && region !== 'Todas') params.set('region', region);
  if (q?.trim()) params.set('q', q.trim());
  const query = params.toString();
  return request(`/api/destinations${query ? `?${query}` : ''}`, signal);
}

export function getDestination(id, signal) {
  return request(`/api/destinations/${encodeURIComponent(id)}`, signal);
}
