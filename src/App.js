import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UrlShortenerForm from './components/UrlShortenerForm';
import UrlRedirectHandler from './components/UrlRedirectHandler';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UrlShortenerForm />} />
        <Route path="/:shortcode" element={<UrlRedirectHandler />} />
      </Routes>
    </Router>
  );
}

export default App;
