// @ts-nocheck
import { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Generate from './pages/Generate';
import Compare from './pages/Compare';
import Dataset from './pages/Dataset';
import { ImageProvider } from "./context/ImageContext";

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleNavigate = (event:any) => {
      setCurrentPage(event.detail);
    };

    window.addEventListener('navigate', handleNavigate);

    return () => {
      window.removeEventListener('navigate', handleNavigate);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'generate':
        return <Generate />;
      case 'compare':
        return <Compare />;
      case 'dataset':
        return <Dataset />;
      default:
        return <Home />;
    }
  };

  return (
    <ImageProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        {renderPage()}
      </div>
    </ImageProvider>
  );
}

export default App;
