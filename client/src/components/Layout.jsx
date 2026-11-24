import { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

function navClass({ isActive }) {
  return isActive ? 'nav-link is-active' : 'nav-link';
}

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="shell">
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <header className="nav">
        <NavLink to="/" className="brand" end>
          <span className="brand-mark" aria-hidden="true">
            ✈
          </span>
          <strong>Agencia de Viajes</strong>
        </NavLink>
        <nav className="nav-links" aria-label="Principal">
          <NavLink to="/" end className={navClass}>
            Inicio
          </NavLink>
          <NavLink to="/destinos" className={navClass}>
            Destinos
          </NavLink>
        </nav>
        <NavLink to="/destinos" className="nav-cta">
          Ver destinos
        </NavLink>
      </header>
      <main id="contenido">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="wrap footer-grid">
          <p>
            <strong>Agencia de Viajes</strong>
            <br />
            Proyecto integrador. Los destinos se cargan con REST y los vuelos y hoteles con GraphQL.
          </p>
        </div>
      </footer>
    </div>
  );
}
