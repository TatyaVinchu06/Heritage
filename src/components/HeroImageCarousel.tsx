import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const images = [
    { 
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1200px-Taj_Mahal_%28Edited%29.jpeg', 
      alt: 'Taj Mahal - Symbol of eternal love', 
      name: 'Taj Mahal',
      description: 'Agra, Uttar Pradesh'
    },
    { 
      src: 'https://cdn.britannica.com/20/189820-050-D650A54D/Red-Fort-Old-Delhi-India.jpg', 
      alt: 'Red Fort - Seat of Mughal power', 
      name: 'Red Fort',
      description: 'Delhi, India'
    }
  ];

  // Preload images to prevent white flashes
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = images.map((img) => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = resolve;
          image.onerror = reject;
          image.src = img.src;
        });
      });
      
      try {
        await Promise.all(imagePromises);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to preload images:', error);
        setIsLoaded(true); // Still show the carousel even if preload fails
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [images.length, isLoaded]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!isLoaded) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading Heritage Images...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base background to prevent white flashes */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
      
      {/* Image layers for crossfade effect */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1 : 1.05
            }}
            transition={{ 
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 8, ease: "linear" }
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${image.src})`,
                filter: 'brightness(0.7) contrast(1.1)'
              }}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Consistent gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-red-900/30 to-pink-900/40" />

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {images.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              index === currentIndex 
                ? 'bg-white shadow-lg scale-110' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            whileHover={{ scale: index === currentIndex ? 1.1 : 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Heritage Site Info with smooth transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`info-${currentIndex}`}
          className="absolute bottom-20 left-8 text-white z-20"
          initial={{ opacity: 0, y: 20, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-2xl">
            <motion.h3 
              className="text-lg font-bold mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {images[currentIndex].name}
            </motion.h3>
            <motion.p 
              className="text-sm text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {images[currentIndex].description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Smooth progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-400 via-red-400 to-pink-400"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
          key={`progress-${currentIndex}`}
        />
      </div>
    </div>
  );
}