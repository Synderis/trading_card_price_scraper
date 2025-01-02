import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import InputRows from './Pages/InputRows';
import ResultsPage from './Pages/ResultsPage';
import MagicResultsPage from './Pages/MagicResultsPage';
import AboutMe from './Pages/AboutMe';
import HowTo from './Pages/HowTo';
import DarkMode from './Components/DarkMode';
import Success from './Pages/SuccessPage';

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
        <Route path="?success=true" element={<Success />} />
        <Route path="/results-page" element={<ResultsPage />} />
        <Route path="/magic-results-page" element={<MagicResultsPage />} />
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
