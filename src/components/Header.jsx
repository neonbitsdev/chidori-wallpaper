import { useState, useEffect } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header({ setUser, setSearchText }) {
  const [user, localSetUser] = useState(null);
  const [inputText, setInputText] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      localSetUser(currentUser);
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    setInputText(""); 
    if (setSearchText) setSearchText("");
  }, [location.pathname, setSearchText]);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      localSetUser(result.user);
      setUser(result.user);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localSetUser(null);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSearch = () => {
    const trimmed = inputText.trim();
    if (trimmed !== "") {
      setSearchText(trimmed);
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav id="nav-bar" className="nav-bar">
      <div className="logo-bar">
        <Link to="/" onClick={closeMobileMenu}>
          <div className="logo">
            <img src="/images/favicon.png" alt="Logo" />
            <h1>Chidori</h1>
          </div>
        </Link>
        <p id="savitar">
          Powered by{" "}
          <a href="https://savitar.ir/" target="_blank" rel="noreferrer">
            Savitar
          </a>
        </p>
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <i className={`fa-solid ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      <div className="search-bar">
        <input
          className="search"
          type="text"
          placeholder="Search ..."
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-label="Search wallpapers"
        />
        <button
          className="search-btn"
          onClick={handleSearch}
          aria-label="Search"
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      <ul className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
        <li className="nav-link">
          <Link to="/anime" onClick={closeMobileMenu}>Anime</Link>
        </li>
        <li className="nav-link">
          <Link to="/game" onClick={closeMobileMenu}>Game</Link>
        </li>
        <li className="nav-link">
          <Link to="/movie" onClick={closeMobileMenu}>Movie</Link>
        </li>
        <li className="nav-link">
          <Link to="/series" onClick={closeMobileMenu}>Series</Link>
        </li>
        <li className="nav-link">
          <Link to="/nature" onClick={closeMobileMenu}>Nature</Link>
        </li>
      </ul>

      <div className={`login-area ${isMobileMenuOpen ? 'login-area-open' : ''}`}>
        {user ? (
          <div className="user-info">
            <span className="user-name">
              <img src="/images/user.png" alt="User" /> {user.displayName}
            </span>
            <button onClick={logout} className="logout-btn" aria-label="Logout">
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="login-btn"
            aria-label="Login with Google"
          >
            Login with
            <span className="g-1"> G</span>
            <span className="o-1">o</span>
            <span className="o-2">o</span>
            <span className="g-2">g</span>
            <span className="l">l</span>
            <span className="e">e</span>
          </button>
        )}
      </div>
    </nav>
  );
}
