import cors from 'cors';
import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { findDestination, listDestinations, listRegions } from './data.js';
import { root, schema } from './schema.js';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.get('/', (_req, res) => {
  res.json({
    name: 'Agencia de viajes mock API',
    rest: {
      destinations: '/api/destinations',
      destination: '/api/destinations/:id',
      regions: '/api/destinations/regions',
    },
    graphql: {
      endpoint: '/graphql',
      queries: [
        'flights(destinationId: ID!)',
        'hotels(destinationId: ID!)',
        'flight(id: ID!)',
        'hotel(id: ID!)',
      ],
    },
  });
});

app.get('/api/destinations/regions', (_req, res) => {
  res.json(listRegions());
});

app.get('/api/destinations', (req, res) => {
  const region = typeof req.query.region === 'string' ? req.query.region : '';
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  res.json(listDestinations({ region, q }));
});

app.get('/api/destinations/:id', (req, res) => {
  const destination = findDestination(req.params.id);
  if (!destination) {
    res.status(404).json({ error: 'Destino no encontrado' });
    return;
  }
  res.json(destination);
});

app.use(
  '/graphql',
  createHandler({
    schema,
    rootValue: root,
  }),
);

const server = app.listen(port, () => {
  console.log(`API mock lista en http://localhost:${port}`);
  console.log(`REST  http://localhost:${port}/api/destinations`);
  console.log(`GraphQL  http://localhost:${port}/graphql`);
});

server.on('error', (error) => {
  console.error(error.message);
  process.exit(1);
});
