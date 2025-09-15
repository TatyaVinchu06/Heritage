import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import FortExplorer from './components/FortExplorer';
import TajMahalStreetView from './components/TajMahalStreetView';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'explorer' | 'taj-mahal'>('landing');

  const handleStartExploration = () => {
    setCurrentPage('explorer');
  };

  const handleStartTajMahal = () => {
    setCurrentPage('taj-mahal');
  };

  const handleBackToHome = () => {
    setCurrentPage('landing');
  };

  const handleBackToExplorer = () => {
    setCurrentPage('explorer');
  };

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage 
          onStartExploration={handleStartExploration}
          onStartTajMahal={handleStartTajMahal}
        />
      )}
      {currentPage === 'explorer' && (
        <FortExplorer onBackToHome={handleBackToHome} />
      )}
      {currentPage === 'taj-mahal' && (
        <TajMahalStreetView 
          onBackToHome={handleBackToHome}
          onBackToExplorer={handleBackToExplorer}
        />
      )}
    </>
  );
}

export default App;