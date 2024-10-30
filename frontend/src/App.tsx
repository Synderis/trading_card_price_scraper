import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import InputRows from './Components/InputRows';
import ResultsPage from './Components/ResultsPage';
import AboutMe from './Components/AboutMe';
import HowTo from './Components/HowTo';
import DarkMode from './Components/DarkMode';

const App: React.FC = () => {
  const location = useLocation(); // Get the current location

  return (
    <div>
      <DarkMode />
      <nav>
        {/* Conditionally render buttons based on the current path */}
        <div style={{margin: '10px 10px 0px 0px', display: 'flex', gap: '10px'}}>
          {location.pathname !== '/' && (
            <Link to="/">
              <button className="nav-button">Home</button>
            </Link>
          )}
          {location.pathname !== '/about' && (
            <Link to="/about">
              <button className="nav-button">About Me</button>
            </Link>
          )}
          {location.pathname !== '/how-to' && (
            <Link to="/how-to">
              <button className="nav-button">How To</button>
            </Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<InputRows />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="/how-to" element={<HowTo />} />
      </Routes>
    </div>
  );
};

// Wrap the App component with Router in the main entry file (e.g., index.tsx)
const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
