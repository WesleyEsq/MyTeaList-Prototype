import React, { useState, useEffect, useCallback } from 'react';
import '../styles/InfoCarousel.css';

// --- Datos para las diapositivas ---
const slides = [
  {
    image: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=2070&auto=format&fit=crop",
    title: "Catalog Your Collections",
    description: "Keep track of the books you've read, the movies you've seen, or the vinyls you own."
  },
  {
    image: "https://images.unsplash.com/photo-1754039984995-a91721ce1870?q=80&w=1561&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Manage Personal Projects",
    description: "Organize tasks, track progress, and structure your ideas in a clear, visual way."
  },
  {
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=1974&auto=format&fit=crop",
    title: "Share Your Passions",
    description: "Create and share beautiful, detailed lists about your favorite hobbies with others."
  }
];

function InfoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = useCallback(() => {
    const isLastSlide = activeIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
  }, [activeIndex]);

  useEffect(() => {
    // Cambia de diapositiva cada 5 segundos
    const timer = setTimeout(() => {
      goToNext();
    }, 5000);

    // Limpia el temporizador si el componente se desmonta o el índice cambia
    return () => clearTimeout(timer);
  }, [activeIndex, goToNext]);

  return (
    <div className="carousel-container">
      <div className="carousel-inner" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div className="slide-card" key={index}>
            <img src={slide.image} alt={slide.title} className="slide-image" />
            <div className="slide-content">
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`dot ${activeIndex === index ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default InfoCarousel;

