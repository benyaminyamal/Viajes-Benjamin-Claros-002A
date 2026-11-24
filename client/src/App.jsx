import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DestinationLayout } from './pages/DestinationLayout';
import { Destinations } from './pages/Destinations';
import { Flights } from './pages/Flights';
import { Home } from './pages/Home';
import { Hotels } from './pages/Hotels';
import { NotFound } from './pages/NotFound';
import { Overview } from './pages/Overview';
import { Plan } from './pages/Plan';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="destinos" element={<Destinations />} />
          <Route path="destinos/:id" element={<DestinationLayout />}>
            <Route index element={<Overview />} />
            <Route path="vuelos" element={<Flights />} />
            <Route path="hoteles" element={<Hotels />} />
            <Route path="plan" element={<Plan />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
