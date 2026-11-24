# Agencia de viajes

Frontend en React para explorar destinos, ver vuelos y hoteles, y armar un plan. Los destinos salen de una API REST mock. Los vuelos y hoteles salen de una API GraphQL mock. La navegación usa React Router.

## Cómo ejecutarlo

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

- Sitio: http://localhost:5173
- API mock: http://localhost:4000

`npm run dev` levanta los dos procesos. Vite reenvía `/api` y `/graphql` al servidor, así el navegador habla con un solo origen.

## Rutas del sitio

| Ruta | Qué muestra |
| --- | --- |
| `/` | Inicio |
| `/destinos` | Lista de destinos (REST). Acepta `?region=` y `?q=` |
| `/destinos/:id` | Ficha: país, temporada y actividades populares |
| `/destinos/:id/vuelos` | Vuelos del destino (GraphQL) |
| `/destinos/:id/hoteles` | Hoteles del destino (GraphQL) |
| `/destinos/:id/plan` | Vuelos y hoteles juntos, con total estimado |

## API REST

```bash
curl http://localhost:4000/api/destinations
curl "http://localhost:4000/api/destinations?region=Europa"
curl http://localhost:4000/api/destinations/cusco
```

Cada destino incluye país, región y `popularActivities`. Esta API no devuelve precios de vuelos ni de hoteles.

## API GraphQL

El endpoint es `POST /graphql`.

```bash
curl http://localhost:4000/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"query ($id: ID!) { flights(destinationId: $id) { airline price departureDate available } hotels(destinationId: $id) { name pricePerNight available checkIn } }","variables":{"id":"cusco"}}'
```

Consultas disponibles:

- `flights(destinationId: ID!)` — tarifa, fechas, duración y asientos
- `hotels(destinationId: ID!)` — tarifa por noche, estadía y habitaciones
- `flight(id: ID!)` y `hotel(id: ID!)`

La pantalla de vuelos pide solo vuelos, la de hoteles pide solo hoteles, y Planificar pide las dos listas en una sola consulta.

## Flujo

1. En Destinos se elige una ciudad.
2. En Vuelos y Hoteles se compara lo disponible para esa ciudad. Lo agotado se ve, pero no se puede elegir.
3. En Planificar el total es el pasaje de ida y vuelta más las noches del hotel. Confirmar genera un código de demostración: no hay cobro ni bloqueo de cupo.
