import React from "react";
import Hero from "../components/Hero";
import NewsSection from "../components/NewsSection";
import Footer from "../components/Footer";
import EcoTipSubscribe from "../components/EcoTipSubscribe";

const Home = () => {
  return (
    <>
      <Hero />
      <NewsSection />
      <EcoTipSubscribe />
      <Footer />
    </>
  );
};

export default Home;
