
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useBank } from '../context/BankContext';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setView, t, language } = useBank();

  const SLIDES = useMemo(() => [
    {
      id: 1,
      title: t('hero.slide1.title'),
      subtitle: t('hero.slide1.subtitle'),
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      cta: t('hero.slide1.cta'),
      action: () => setView('REGISTER')
    },
    {
      id: 2,
      title: t('hero.slide2.title'),
      subtitle: t('hero.slide2.subtitle'),
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      cta: t('hero.slide2.cta'),
      action: () => setView('SERVICES')
    },
    {
      id: 3,
      title: t('hero.slide3.title'),
      subtitle: t('hero.slide3.subtitle'),
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      cta: t('hero.slide3.cta'),
      action: () => setView('REGISTER')
    }
  ], [t, language, setView]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [SLIDES.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));

  return (
    <div id="home" className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          
          {/* Content - pb-12 adds padding bottom to shift center slightly up */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 pb-12 md:pb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-5 md:mb-6 tracking-tight animate-fade-in-up leading-tight">
              {slide.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-7 md:mb-8 max-w-xl sm:max-w-2xl mx-auto px-2 sm:px-0 leading-relaxed">
              {slide.subtitle}
            </p>
            <button
              onClick={slide.action}
              className="group bg-teal-400 hover:bg-teal-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-2 w-auto"
            >
              {slide.cta}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm touch-manipulation"
        aria-label={t('hero.previousSlide')}
      >
        <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm touch-manipulation"
        aria-label={t('hero.nextSlide')}
      >
        <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>

      {/* Indicators - Moved to bottom-24 to sit between button and stats card */}
      <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 sm:h-3 rounded-full transition-all touch-manipulation ${
              index === currentSlide ? 'bg-teal-400 w-6 sm:w-8' : 'bg-white/50 hover:bg-white w-2 sm:w-3'
            }`}
            aria-label={`${t('hero.goToSlide')} ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
