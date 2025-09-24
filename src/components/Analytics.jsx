import { useEffect } from 'react';

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

export default function Analytics() {
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          'custom_parameter_1': 'wallpaper_category',
          'custom_parameter_2': 'user_action'
        }
      });
    `;
    document.head.appendChild(script2);

    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }

    return () => {
      if (document.head.contains(script1)) {
        document.head.removeChild(script1);
      }
      if (document.head.contains(script2)) {
        document.head.removeChild(script2);
      }
    };
  }, []);

  const trackEvent = (eventName, parameters = {}) => {
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: parameters.category || 'engagement',
        event_label: parameters.label || '',
        value: parameters.value || 0,
        ...parameters
      });
    }
  };

  const trackWallpaperView = (wallpaperId, category) => {
    trackEvent('wallpaper_view', {
      category: 'wallpaper_interaction',
      label: category,
      wallpaper_id: wallpaperId
    });
  };

  const trackWallpaperDownload = (wallpaperId, category) => {
    trackEvent('wallpaper_download', {
      category: 'wallpaper_interaction',
      label: category,
      wallpaper_id: wallpaperId
    });
  };

  const trackSearch = (searchTerm, resultsCount) => {
    trackEvent('search', {
      category: 'user_interaction',
      label: searchTerm,
      value: resultsCount
    });
  };

  const trackCategoryView = (category) => {
    trackEvent('category_view', {
      category: 'navigation',
      label: category
    });
  };

  const trackFavoriteToggle = (wallpaperId, isAdded) => {
    trackEvent('favorite_toggle', {
      category: 'user_interaction',
      label: isAdded ? 'add_favorite' : 'remove_favorite',
      wallpaper_id: wallpaperId
    });
  };

  useEffect(() => {
    window.analytics = {
      trackWallpaperView,
      trackWallpaperDownload,
      trackSearch,
      trackCategoryView,
      trackFavoriteToggle
    };
  }, []);

  return null;
}

export const useAnalytics = () => {
  const trackEvent = (eventName, parameters = {}) => {
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  };

  return { trackEvent };
};
