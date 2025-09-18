import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { HeritageSite } from '@/types/heritage';

interface InteractiveMapProps {
  sites: HeritageSite[];
  onSiteSelect: (site: HeritageSite) => void;
}

export default function InteractiveMap({ sites, onSiteSelect }: InteractiveMapProps) {
  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl overflow-hidden border-2 border-orange-200">
      {/* Simplified India Map Background */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <path
            d="M100 50 L300 50 L320 80 L310 120 L290 150 L270 180 L250 200 L200 220 L150 210 L120 190 L100 160 L90 120 L95 80 Z"
            fill="currentColor"
            className="text-orange-300"
          />
        </svg>
      </div>

      {/* Site Markers */}
      {sites.map((site, index) => {
        const positions = [
          { x: '45%', y: '40%' }, // Taj Mahal (Agra)
          { x: '35%', y: '35%' }, // Red Fort (Delhi)
        ];
        
        const position = positions[index] || { x: '50%', y: '50%' };
        
        return (
          <motion.div
            key={site.id}
            className="absolute cursor-pointer group"
            style={{ left: position.x, top: position.y }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => onSiteSelect(site)}
          >
            {/* Pulsing Ring */}
            <motion.div
              className="absolute inset-0 w-8 h-8 bg-orange-500 rounded-full opacity-30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Main Marker */}
            <div className="relative w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            
            {/* Tooltip */}
            <motion.div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ y: 10, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
            >
              <div className="font-semibold">{site.name}</div>
              <div className="text-xs text-gray-300">{site.location.state}</div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black" />
            </motion.div>
          </motion.div>
        );
      })}
      
      {/* Decorative Elements */}
      <motion.div
        className="absolute top-4 right-4 text-orange-600"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Navigation className="w-6 h-6" />
      </motion.div>
      
      <div className="absolute bottom-4 left-4 text-sm text-gray-600 font-medium">
        Interactive Heritage Map
      </div>
    </div>
  );
}