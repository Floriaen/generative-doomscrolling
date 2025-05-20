import React from 'react';
import { FaRegHeart, FaRegComment, FaRegPaperPlane } from 'react-icons/fa';

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

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
  // Use the original prompt as the account name
  const accountName = truncate(item.prompt || 'user', 18);
  return (
    <div className="post" style={{ position: 'relative' }}>
      {/* Top bar with account name */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px 8px 18px', gap: 10 }}>
        {/* Placeholder profile pic */}
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f0f0f0', marginRight: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          <span role="img" aria-label="profile">🧑</span>
        </div>
        <span style={{ fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{accountName}</span>
        {/* Time placeholder */}
        <span style={{ color: '#888', fontSize: 13, marginLeft: 8, whiteSpace: 'nowrap' }}>· 1h</span>
      </div>
      <img
        src={item.url}
        alt={item.caption || item.prompt || "No description available"}
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
      {/* Action bar with icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '10px 15px 0 15px', fontSize: 22, marginBottom: 8 }}>
        <FaRegHeart style={{ cursor: 'pointer' }} />
        <FaRegComment style={{ cursor: 'pointer' }} />
        <FaRegPaperPlane style={{ cursor: 'pointer' }} />
      </div>
      {/* Description with account name in bold */}
      <p className="post-prompt" style={{ textAlign: 'left', marginTop: 10 }}>
        <span style={{ fontWeight: 600, marginRight: 6 }}>{accountName}</span>
        {item.caption || item.prompt || "No description available"}
      </p>
    </div>
  );
}

export default ImageCard; 