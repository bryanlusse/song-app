import React, { useState, useEffect } from 'react';
import Hero from './Hero/Hero';
import Footer from './Footer/Footer';

import { PortfolioProvider } from '../context/context';

import {footerData } from '../mock/data';
import {heroData } from '../mock/data';


function App() {
  const [hero, setHero] = useState({});
  const [footer, setFooter] = useState({});

  useEffect(() => {
    setHero({ ...heroData });
    setFooter({ ...footerData });
  }, []);

  return (
    <PortfolioProvider value={{ hero, footer }}>
      <Hero />
      <Footer />
    </PortfolioProvider>
  );
}

export default App;
