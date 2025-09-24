import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from "./pages/Home.jsx";
import Anime from "./pages/Anime.jsx";
import Movie from "./pages/Movie.jsx";
import Game from "./pages/Game.jsx";
import Series from './pages/Series.jsx';
import Nature from "./pages/Nature.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import Analytics from "./components/Analytics.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import AccessibilityAnnouncer from "./components/AccessibilityAnnouncer.jsx";
import NetworkStatus from "./components/NetworkStatus.jsx";

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
}
document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('keydown', (e) => {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
    (e.ctrlKey && e.key === 'U')
  ) {
    e.preventDefault();
  }
});

function AppRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <ErrorBoundary>
      <AccessibilityAnnouncer />
      <NetworkStatus />
      <Analytics />
      {loading && <LoadingSpinner />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/nature" element={<Nature />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/series" element={<Series />} />
        <Route path="/game" element={<Game />} />
        <Route path="/search" element={<ResultPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
