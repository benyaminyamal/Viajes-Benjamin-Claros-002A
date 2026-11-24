import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export function NotFound({
  title = 'Página no encontrada',
  text = 'La dirección no existe. Puedes volver al inicio o ver los destinos.',
  suppressTitle = false,
}) {
  usePageTitle(suppressTitle ? '' : 'Página no encontrada');

  return (
    <section className="wrap page">
      <div className="status-block">
        <p className="eyebrow">404</p>
        <h1>{title}</h1>
        <p>{text}</p>
        <div className="hero-actions">
          <Link className="button" to="/destinos">
            Ver destinos
          </Link>
          <Link className="button button-ghost" to="/">
            Ir al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
