import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import FortExplorer from './components/FortExplorer';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'explorer'>('landing');

  const handleStartExploration = () => {
    setCurrentPage('explorer');
  };

  const handleBackToHome = () => {
    setCurrentPage('landing');
  };

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage onStartExploration={handleStartExploration} />
      )}
      {currentPage === 'explorer' && (
        <FortExplorer onBackToHome={handleBackToHome} />
      )}
    </>
  );
}

export default App;