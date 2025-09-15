import React, { useState, useRef } from 'react';
import { ArrowLeft, MapPin, Info, Camera, Compass, ZoomIn, ZoomOut, Eye, Navigation } from 'lucide-react';

interface TajMahalStreetViewProps {
  onBackToHome: () => void;
  onBackToExplorer: () => void;
}

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  details: string[];
}

interface Location {
  id: string;
  name: string;
  image: string;
  hotspots: Hotspot[];
  connections: { id: string; direction: string; angle: number }[];
}

const tajMahalLocations: Location[] = [
  {
    id: 'main-gate',
    name: 'Main Gate - Darwaza-i-Rauza',
    image: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    hotspots: [
      {
        id: 'gate-arch',
        x: 50,
        y: 40,
        title: 'Grand Entrance Arch',
        description: 'The magnificent red sandstone gateway to the Taj Mahal',
        details: [
          'Built in 1648 from red sandstone',
          'Features intricate geometric patterns',
          'Contains verses from the Quran in calligraphy',
          'The gateway frames the first view of the Taj Mahal'
        ]
      },
      {
        id: 'calligraphy',
        x: 30,
        y: 35,
        title: 'Islamic Calligraphy',
        description: 'Beautiful Arabic inscriptions on the gateway',
        details: [
          'Verses from the Quran inscribed in Thuluth script',
          'Inlaid with black marble on red sandstone',
          'Welcomes visitors to the "Garden of Paradise"',
          'Masterpiece of Mughal calligraphic art'
        ]
      }
    ],
    connections: [
      { id: 'garden', direction: 'Enter Complex', angle: 0 }
    ]
  },
  {
    id: 'garden',
    name: 'Charbagh Garden',
    image: 'https://images.pexels.com/photos/2413613/pexels-photo-2413613.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    hotspots: [
      {
        id: 'central-pool',
        x: 50,
        y: 60,
        title: 'Central Reflecting Pool',
        description: 'The iconic reflecting pool that mirrors the Taj Mahal',
        details: [
          'Creates perfect reflection of the main tomb',
          'Part of the Persian Charbagh garden design',
          'Represents the rivers of Paradise in Islamic tradition',
          'Enhances the visual impact of the monument'
        ]
      },
      {
        id: 'cypress-trees',
        x: 25,
        y: 45,
        title: 'Cypress Trees',
        description: 'Symbolic trees representing immortality',
        details: [
          'Dark green cypress trees line the pathways',
          'Symbolize immortality and eternal life',
          'Provide contrast to the white marble tomb',
          'Part of the original 17th-century landscaping'
        ]
      }
    ],
    connections: [
      { id: 'main-gate', direction: 'Back to Gate', angle: 180 },
      { id: 'main-tomb', direction: 'To Main Tomb', angle: 0 }
    ]
  },
  {
    id: 'main-tomb',
    name: 'Main Tomb - Rauza-i-Munawwara',
    image: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    hotspots: [
      {
        id: 'main-dome',
        x: 50,
        y: 25,
        title: 'Central Dome',
        description: 'The iconic bulbous dome of the Taj Mahal',
        details: [
          'Height of 35 meters with a brass finial',
          'Double-shell construction for acoustic properties',
          'Topped with a lotus design and crescent moon',
          'Symbol of heavenly paradise in Islamic architecture'
        ]
      },
      {
        id: 'pietra-dura',
        x: 40,
        y: 50,
        title: 'Pietra Dura Inlay',
        description: 'Intricate precious stone inlay work',
        details: [
          'Semi-precious stones inlaid in white marble',
          'Floral patterns and Quranic verses',
          'Includes lapis lazuli, jade, crystal, and turquoise',
          'Technique perfected by Mughal craftsmen'
        ]
      },
      {
        id: 'minarets',
        x: 75,
        y: 40,
        title: 'Four Minarets',
        description: 'Elegant towers flanking the main tomb',
        details: [
          'Each minaret is 40 meters tall',
          'Slightly tilted outward for earthquake protection',
          'Crowned with chattris (domed pavilions)',
          'Provide perfect symmetry to the composition'
        ]
      }
    ],
    connections: [
      { id: 'garden', direction: 'Back to Garden', angle: 180 },
      { id: 'mosque', direction: 'To Mosque', angle: 270 }
    ]
  },
  {
    id: 'mosque',
    name: 'Red Sandstone Mosque',
    image: 'https://images.pexels.com/photos/3573383/pexels-photo-3573383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    hotspots: [
      {
        id: 'prayer-hall',
        x: 50,
        y: 45,
        title: 'Prayer Hall',
        description: 'Active mosque still used for prayers',
        details: [
          'Built from red sandstone to contrast the white tomb',
          'Faces Mecca for proper prayer orientation',
          'Features three bulbous domes',
          'Still used by local Muslim community for prayers'
        ]
      },
      {
        id: 'mihrab',
        x: 60,
        y: 50,
        title: 'Mihrab (Prayer Niche)',
        description: 'Ornate niche indicating direction of Mecca',
        details: [
          'Beautifully decorated prayer niche',
          'Points toward Mecca for prayer direction',
          'Features intricate geometric patterns',
          'Made from precious marble and stone inlay'
        ]
      }
    ],
    connections: [
      { id: 'main-tomb', direction: 'Back to Tomb', angle: 90 }
    ]
  }
];

export default function TajMahalStreetView({ onBackToHome, onBackToExplorer }: TajMahalStreetViewProps) {
  const [currentLocation, setCurrentLocation] = useState<Location>(tajMahalLocations[2]); // Start at main tomb
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showMiniMap, setShowMiniMap] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    setRotation(prev => prev + deltaX * 0.5);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const navigateToLocation = (locationId: string) => {
    const location = tajMahalLocations.find(loc => loc.id === locationId);
    if (location) {
      setCurrentLocation(location);
      setSelectedHotspot(null);
      setRotation(0);
      setZoom(1);
    }
  };

  const adjustZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      {/* Main Panoramic View */}
      <div
        ref={containerRef}
        className="w-full h-full relative cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Panoramic Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `url(${currentLocation.image})`,
            transform: `translateX(${-rotation}px) scale(${zoom})`,
            width: '200%',
            height: '120%',
            left: '-50%',
            top: '-10%'
          }}
        />

        {/* Hotspots */}
        {currentLocation.hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: `translateX(${rotation * 0.3}px) scale(${zoom})`
            }}
            onClick={() => setSelectedHotspot(hotspot)}
          >
            {/* Pulsing ring */}
            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-60"></div>
            
            {/* Main hotspot */}
            <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white rounded-full p-3 shadow-2xl transition-all duration-200 transform hover:scale-125 border-2 border-white">
              <Info className="h-4 w-4" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-black/80 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap shadow-xl backdrop-blur-sm">
                {hotspot.title}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
              </div>
            </div>
          </button>
        ))}

        {/* Navigation Arrows */}
        {currentLocation.connections.map((connection) => (
          <button
            key={connection.id}
            className="absolute top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-4 rounded-full shadow-2xl transition-all duration-200 hover:scale-110 backdrop-blur-sm border border-white/20 z-20"
            style={{
              [connection.angle === 0 ? 'right' : connection.angle === 180 ? 'left' : connection.angle === 90 ? 'top' : 'bottom']: '2rem',
              ...(connection.angle === 90 && { top: '2rem', left: '50%', transform: 'translateX(-50%)' }),
              ...(connection.angle === 270 && { bottom: '2rem', left: '50%', transform: 'translateX(-50%)' })
            }}
            onClick={() => navigateToLocation(connection.id)}
          >
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5" />
              <span className="text-sm font-medium">{connection.direction}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Top UI Bar */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToExplorer}
              className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <h1 className="text-white font-bold text-lg flex items-center">
                <Eye className="h-5 w-5 mr-2 text-yellow-400" />
                {currentLocation.name}
              </h1>
              <p className="text-amber-200 text-sm">Taj Mahal, Agra</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMiniMap(!showMiniMap)}
              className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
            >
              <MapPin className="h-5 w-5" />
            </button>
            <button
              onClick={() => setRotation(0)}
              className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
            >
              <Compass className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-30">
        <button
          onClick={() => adjustZoom(0.2)}
          className="bg-black/60 hover:bg-black/80 text-white p-3 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          onClick={() => adjustZoom(-0.2)}
          className="bg-black/60 hover:bg-black/80 text-white p-3 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
      </div>

      {/* Mini Map */}
      {showMiniMap && (
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20 z-30">
          <h3 className="text-white font-bold mb-3 text-sm">Taj Mahal Complex</h3>
          <div className="grid grid-cols-2 gap-2">
            {tajMahalLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => navigateToLocation(location.id)}
                className={`text-xs p-2 rounded transition-colors ${
                  currentLocation.id === location.id
                    ? 'bg-yellow-500 text-black font-bold'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {location.name.split(' - ')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls Help */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20 z-30">
        <div className="text-white text-xs space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>Drag to look around</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>Click hotspots for info</span>
          </div>
        </div>
      </div>

      {/* Hotspot Modal */}
      {selectedHotspot && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl max-w-2xl w-full shadow-2xl border-2 border-yellow-400/30">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Camera className="h-6 w-6 text-yellow-300" />
                  <div>
                    <h2 className="text-xl font-bold">{selectedHotspot.title}</h2>
                    <p className="text-amber-100 text-sm">{currentLocation.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-white hover:text-gray-200 text-2xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {selectedHotspot.description}
              </p>

              <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-xl border border-orange-200">
                <h3 className="font-bold text-orange-800 mb-3 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Historical Details
                </h3>
                <ul className="space-y-2">
                  {selectedHotspot.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-orange-700 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all duration-200"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}