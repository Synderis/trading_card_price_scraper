import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InputRows from './Components/InputRows';
import ResultsPage from './Components/ResultsPage';
import AboutMe from './Components/AboutMe';
import HowTo from './Components/HowTo';
import DarkMode from './Components/DarkMode';

const App: React.FC = () => {
  return (
    <Router>
      <DarkMode />
      
      <nav>
        <Link to="/">
          <button className="nav-button">Home</button>
        </Link>
        <Link to="/about">
          <button className="nav-button" style={{margin: '10px 10px'}}>About Me</button>
        </Link>
        <Link to="/how-to">
          <button className="nav-button">How To</button>
        </Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<InputRows />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="/how-to" element={<HowTo />} />
      </Routes>
    </Router>
  );
};

export default App;
