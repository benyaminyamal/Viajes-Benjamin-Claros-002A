const FLIGHT_FIELDS = `
  id
  destinationId
  airline
  flightNumber
  originCity
  originCode
  destinationCity
  destinationCode
  departureDate
  departureTime
  arrivalTime
  returnDate
  returnTime
  price
  currency
  availableSeats
  available
  duration
  durationMinutes
  stops
  cabin
`;

const HOTEL_FIELDS = `
  id
  destinationId
  name
  stars
  guestScore
  neighborhood
  address
  pricePerNight
  currency
  availableRooms
  available
  checkIn
  checkOut
  amenities
`;

async function graphql(query, variables, signal) {
  let response;
  try {
    response = await fetch('/graphql', {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    const failure = new Error(
      'No se pudo conectar con la API GraphQL. Revisa que el servidor mock esté en el puerto 4000.',
    );
    failure.cause = error;
    throw failure;
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error('La API GraphQL devolvió una respuesta inválida.');
  }

  if (!response.ok || payload.errors?.length) {
    throw new Error(payload.errors?.[0]?.message || 'La API GraphQL respondió con un error.');
  }

  return payload.data;
}

export function getFlights(destinationId, signal) {
  return graphql(
    `query Flights($destinationId: ID!) {
      flights(destinationId: $destinationId) { ${FLIGHT_FIELDS} }
    }`,
    { destinationId },
    signal,
  ).then((data) => data.flights);
}

export function getHotels(destinationId, signal) {
  return graphql(
    `query Hotels($destinationId: ID!) {
      hotels(destinationId: $destinationId) { ${HOTEL_FIELDS} }
    }`,
    { destinationId },
    signal,
  ).then((data) => data.hotels);
}

export function getTripOptions(destinationId, signal) {
  return graphql(
    `query TripPlan($destinationId: ID!) {
      flights(destinationId: $destinationId) { ${FLIGHT_FIELDS} }
      hotels(destinationId: $destinationId) { ${HOTEL_FIELDS} }
    }`,
    { destinationId },
    signal,
  );
}
