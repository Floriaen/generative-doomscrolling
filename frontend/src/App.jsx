import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';
import ImageCard from './ImageCard';
import { FaMoon, FaSun } from 'react-icons/fa';

function App() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [useAI, setUseAI] = useState(false);
  const [useCache, setUseCache] = useState(false);
  const [prompt, setPrompt] = useState('a beautiful sunset');
  const [inputPrompt, setInputPrompt] = useState('a beautiful sunset');
  const [inputUseAI, setInputUseAI] = useState(false);
  const [inputUseCache, setInputUseCache] = useState(false);
  const [started, setStarted] = useState(false);
  const [loadingImages, setLoadingImages] = useState([]);
  const [errorImages, setErrorImages] = useState([]);
  const [darkTheme, setDarkTheme] = useState(true);

  const getApiUrl = () => {
    const baseUrl = `http://localhost:50228/generate-image?seed=${encodeURIComponent(prompt)}&useAI=${useAI}&useCache=${useCache}`;
    if (!useCache) {
      // Add timestamp to force new image generation when cache is disabled
      return `${baseUrl}&t=${Date.now()}`;
    }
    return baseUrl;
  };

  const fetchMoreData = async () => {
    try {
      const res = await fetch(getApiUrl());
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setItems((prev) => [...prev, {
        url: `http://localhost:50228/image?path=${encodeURIComponent(data.imagePath)}`,
        caption: data.caption,
        prompt: data.prompt,
        revisedPrompt: data.revisedPrompt,
        createdAt: data.createdAt
      }]);
      setLoadingImages((prev) => [...prev, false]);
      setErrorImages((prev) => [...prev, false]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setHasMore(false);
      setLoadingImages((prev) => [...prev, false]);
      setErrorImages((prev) => [...prev, true]);
    }
  };

  // Only fetch data after submit
  useEffect(() => {
    if (started && items.length === 0) {
      fetchMoreData();
    }
    // eslint-disable-next-line
  }, [useAI, useCache, prompt, started]);

  const handlePromptChange = (e) => {
    setInputPrompt(e.target.value);
  };

  const handleInputUseAIChange = (e) => {
    setInputUseAI(e.target.checked);
  };

  const handleInputUseCacheChange = (e) => {
    setInputUseCache(e.target.checked);
  };

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    setPrompt(inputPrompt);
    setUseAI(inputUseAI);
    setUseCache(inputUseCache);
    setItems([]);
    setHasMore(true);
    setStarted(true);
    setLoadingImages([true]);
    setErrorImages([]);
  };

  const handleImageLoad = (idx) => {
    setLoadingImages((prev) => {
      const updated = [...prev];
      updated[idx] = false;
      return updated;
    });
  };

  const handleImageError = (idx) => {
    setLoadingImages((prev) => {
      const updated = [...prev];
      updated[idx] = false;
      return updated;
    });
    setErrorImages((prev) => {
      const updated = [...prev];
      updated[idx] = true;
      return updated;
    });
  };

  return (
    <div className={`App${darkTheme ? ' dark-theme' : ''}`}>
      {/* Theme toggle button */}
      <button
        onClick={() => setDarkTheme((v) => !v)}
        style={{
          position: 'fixed',
          top: 20,
          right: 30,
          zIndex: 100,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 26,
          color: darkTheme ? '#fff' : '#000',
        }}
        aria-label="Toggle dark mode"
      >
        {darkTheme ? <FaSun /> : <FaMoon />}
      </button>
      <h1>Generative Doomscrolling</h1>
      <form onSubmit={handlePromptSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={inputPrompt}
          onChange={handlePromptChange}
          style={{ width: 300, padding: '0.5rem', fontSize: '1rem' }}
        />
        <button type="submit" style={{ marginLeft: 10, padding: '0.5rem 1rem', fontSize: '1rem' }}>
          Generate
        </button>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <div className="toggle-container">
            <label>
              <input type="checkbox" checked={inputUseAI} onChange={handleInputUseAIChange} />
              {' '}Use DALL-E AI Generator
            </label>
          </div>
          <div className="toggle-container">
            <label>
              <input type="checkbox" checked={inputUseCache} onChange={handleInputUseCacheChange} />
              {' '}Use Cached Images
            </label>
          </div>
        </div>
      </form>
      {started && (
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={null}
        >
          {/* Render all image slots (loaded or loading) using ImageCard */}
          {Array.from({ length: Math.max(items.length, loadingImages.length) }).map((_, idx) => (
            <ImageCard
              key={idx}
              item={items[idx] || null}
              loading={loadingImages[idx]}
              error={errorImages[idx]}
              onLoad={handleImageLoad}
              onError={handleImageError}
              idx={idx}
            />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
}

export default App;
