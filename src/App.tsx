// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Classifier from './components/Classifier';
import About from './pages/About';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Classifier />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};

export default App;
