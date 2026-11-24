import { buildSchema } from 'graphql';
import { findFlight, findHotel, listFlights, listHotels } from './data.js';

export const schema = buildSchema(`
  """Vuelo de ida y vuelta asociado a un destino."""
  type Flight {
    id: ID!
    destinationId: ID!
    airline: String!
    flightNumber: String!
    originCity: String!
    originCode: String!
    destinationCity: String!
    destinationCode: String!
    departureDate: String!
    departureTime: String!
    arrivalTime: String!
    returnDate: String!
    returnTime: String!
    price: Float!
    currency: String!
    availableSeats: Int!
    available: Boolean!
    duration: String!
    durationMinutes: Int!
    stops: Int!
    cabin: String!
  }

  """Hotel con tarifa por noche, fechas de estadía y cupo."""
  type Hotel {
    id: ID!
    destinationId: ID!
    name: String!
    stars: Int!
    guestScore: Float!
    neighborhood: String!
    address: String!
    pricePerNight: Float!
    currency: String!
    availableRooms: Int!
    available: Boolean!
    checkIn: String!
    checkOut: String!
    amenities: [String!]!
  }

  type Query {
    """Vuelos del destino, con precio, fechas y disponibilidad."""
    flights(destinationId: ID!): [Flight!]!
    """Hoteles del destino, con tarifa, fechas y habitaciones libres."""
    hotels(destinationId: ID!): [Hotel!]!
    flight(id: ID!): Flight
    hotel(id: ID!): Hotel
  }
`);

export const root = {
  flights: ({ destinationId }) => listFlights(destinationId),
  hotels: ({ destinationId }) => listHotels(destinationId),
  flight: ({ id }) => findFlight(id),
  hotel: ({ id }) => findHotel(id),
};
