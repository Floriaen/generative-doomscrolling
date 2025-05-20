import React from 'react';

function ImageCard({ item, loading, error, onLoad, onError, idx }) {
  if (!item) {
    // Render spinner placeholder for loading slot
    return (
      <div className="post">
        <div className="spinner-container">
          <div className="spinner" style={{ width: 60, height: 60, borderWidth: 8 }}></div>
        </div>
      </div>
    );
  }
  return (
    <div className="post" style={{ position: 'relative' }}>
      <img
        src={item.url}
        alt={item.prompt}
        className="post-image"
        onLoad={() => onLoad(idx)}
        onError={() => onError(idx)}
        style={{ opacity: loading ? 0.3 : 1, transition: 'opacity 0.3s' }}
      />
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      {error && !loading && (
        <div className="spinner-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <span style={{ color: 'red' }}>Failed to load image</span>
        </div>
      )}
      <p className="post-prompt">{item.prompt}</p>
    </div>
  );
}

export default ImageCard; 