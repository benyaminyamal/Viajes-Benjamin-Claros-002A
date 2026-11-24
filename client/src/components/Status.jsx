import { Component } from 'react';

export function SkeletonCards({ count = 3 }) {
  return (
    <div className="stack" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-card" key={index} />
      ))}
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="card-grid" aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="skeleton-destination" key={index} />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="status-block" role="alert">
      <h2>Error al cargar</h2>
      <p>{message}</p>
      {onRetry ? (
        <button className="button" type="button" onClick={onRetry}>
          Reintentar
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="status-block">
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="shell">
          <main className="wrap">
            <ErrorState message="Ocurrió un problema al dibujar la página. Recarga e inténtalo de nuevo." />
          </main>
        </div>
      );
    }
    return this.props.children;
  }
}
