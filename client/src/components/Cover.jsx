import { useState } from 'react';

export function Cover({ src, alt, color = '#1f4d45', position = 'center', className = '' }) {
  const [visible, setVisible] = useState(true);

  return (
    <div
      className={`cover ${className}`.trim()}
      style={{ '--accent': color, '--pos': position }}
    >
      {visible && src ? (
        <img src={src} alt={alt} onError={() => setVisible(false)} />
      ) : (
        <span className="cover-fallback">{alt}</span>
      )}
    </div>
  );
}
