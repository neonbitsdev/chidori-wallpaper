import React, { useState, useEffect, useMemo } from 'react';
import imageDataBase from '../components/Wallpaper';
import { announceToScreenReader } from './AccessibilityAnnouncer';

export default function Card({ tag, searchText, user, shuffle = false }) {
  const [visibleCount, setVisibleCount] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);
  const [images] = useState(imageDataBase);
  const [toastMessage, setToastMessage] = useState('');

  const imagesForDisplay = useMemo(() => {
    return shuffle ? [...images].sort(() => 0.5 - Math.random()) : images;
  }, [images, shuffle]);

  const normalizedSearch = searchText.trim().toLowerCase().replace(/\s+/g, '');

  const filteredImages = imagesForDisplay.filter((image) => {
    const matchesTag = tag ? image.tags === tag : true;

    const searchableString = (
      image.title +
      ' ' +
      image.description +
      ' ' +
      image.tags +
      ' ' +
      image.keywords.join(' ')
    )
      .toLowerCase()
      .replace(/\s+/g, '');

    const matchesSearch = normalizedSearch
      ? searchableString.includes(normalizedSearch)
      : true;

    return matchesTag && matchesSearch;
  });

  const displayedImages = filteredImages.slice(0, visibleCount);

  useEffect(() => {
    let timeoutId;
    
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        if (
          window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
          visibleCount < filteredImages.length &&
          !loadingMore
        ) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 12); // Reduced batch size
            setLoadingMore(false);
          }, 500); // Reduced delay
        }
      }, 100); // Debounce scroll events
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [visibleCount, filteredImages.length, loadingMore]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 4700);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleDownloadClick = (e, imageTitle) => {
    // Commented out login requirement - allow downloads without login
    // if (!user) {
    //   e.preventDefault();
    //   setToastMessage('Log in to access and download your 4K wallpaper!');
    //   announceToScreenReader('Please log in to download wallpapers');
    // } else {
      announceToScreenReader(`Downloading ${imageTitle}`);
    // }
  };

  const handleImageLoad = (imageTitle) => {
    announceToScreenReader(`Image loaded: ${imageTitle}`);
  };

  const handleImageError = (imageTitle) => {
    announceToScreenReader(`Failed to load image: ${imageTitle}`);
  };

  return (
    <>
      {displayedImages.length ? (
        displayedImages.map((image) => (
          <div 
            className="card" 
            key={image.id}
            role="article"
            aria-label={`Wallpaper: ${image.title}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const downloadLink = e.target.querySelector('.download-link');
                if (downloadLink) {
                  downloadLink.click();
                }
              }
            }}
          >
            <div className="card-image-container">
              <img
                src={image.url}
                alt={`${image.title} wallpaper - ${image.description}`}
                className="card-img"
                onDragStart={(e) => e.preventDefault()}
                draggable={false}
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                onLoad={() => handleImageLoad(image.title)}
                onError={() => handleImageError(image.title)}
              />
              <div className="card-hover-overlay">
                <div className="download-btn">
                  <a
                    href={image.download}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleDownloadClick(e, image.title)}
                    className="download-link"
                    aria-label={`Download ${image.title} wallpaper`}
                    role="button"
                  >
                    <i className="fa-solid fa-download" aria-hidden="true"></i>
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="card-title">
              <div>
                <p>{image.title.toUpperCase()}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="not-found">
          <img src="/images/404.svg" alt="No Results" />
        </div>
      )}

      {loadingMore && (
        <div className="loading-spinner">
          <i className="fa-solid fa-hourglass-half fa-bounce"></i>
        </div>
      )}

      {toastMessage && <div className="toast">{toastMessage}</div>}
    </>
  );
}
