import React, { useState, useRef, useEffect } from 'react';
import { Navigation, Info, Camera, MapPin, RotateCcw, ZoomIn, ZoomOut, Compass, Eye, ArrowLeft } from 'lucide-react';

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

interface FortExplorerProps {
  onBackToHome: () => void;
}

const locations: Location[] = [
  {
    id: 'main-gate',
    name: 'Main Gate - Hathi Pol',
    image: 'https://media1.thrillophilia.com/filestore/rte153t147ug0dbxtskbieiglqfq_1603444761_Hathi_Pol.jpg?w=400&dpr=2',
    hotspots: [
      {
        id: 'gate-arch',
        x: 50,
        y: 40,
        title: 'Elephant Gate Arch',
        description: 'Massive archway designed for royal elephant processions',
        details: [
          'Built in 1559 during Akbar\'s reign',
          'Features iron spikes to prevent elephant attacks',
          'Intricate Mughal calligraphy adorns the entrance'
        ]
      },
      {
        id: 'guard-towers',
        x: 20,
        y: 30,
        title: 'Guard Towers',
        description: 'Strategic defensive positions flanking the entrance',
        details: [
          'Housed armed guards 24/7',
          'Connected by underground passages',
          'Features arrow slits for archers'
        ]
      }
    ],
    connections: [
      { id: 'courtyard', direction: 'Enter Fort', angle: 0 }
    ]
  },
  {
    id: 'courtyard',
    name: 'Royal Courtyard - Diwan-e-Aam',
    image: 'https://media.gettyimages.com/id/1888262096/photo/the-diwan-i-aam-or-hall-of-public-audience-is-being-showcased-at-the-royal-palace-in-fatehpur.jpg?s=612x612&w=gi&k=20&c=Z69sjeCacztcntrx0PwWTqBBSpVCEWUmZFK8kzJMBks=',
    hotspots: [
      {
        id: 'throne-platform',
        x: 60,
        y: 50,
        title: 'Royal Throne Platform',
        description: 'Elevated platform where the emperor held court',
        details: [
          'Made of white marble with precious stone inlay',
          'Could accommodate 1000+ courtiers',
          'Scene of important state ceremonies'
        ]
      },
      {
        id: 'pillared-hall',
        x: 30,
        y: 45,
        title: 'Pillared Hall',
        description: 'Grand hall with ornate columns and arches',
        details: [
          'Red sandstone pillars with intricate carvings',
          'Acoustic design amplifies the ruler\'s voice',
          'Features geometric Islamic patterns'
        ]
      }
    ],
    connections: [
      { id: 'main-gate', direction: 'Exit to Gate', angle: 180 },
      { id: 'palace', direction: 'Royal Palace', angle: 90 },
      { id: 'tower', direction: 'Watch Tower', angle: 270 }
    ]
  },
  {
    id: 'palace',
    name: 'Royal Palace - Raj Mahal',
    image: 'https://images.pexels.com/photos/3573383/pexels-photo-3573383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    hotspots: [
      {
        id: 'mirror-hall',
        x: 45,
        y: 35,
        title: 'Sheesh Mahal (Mirror Palace)',
        description: 'Dazzling hall covered in thousands of mirrors',
        details: [
          'Contains over 100,000 mirror pieces',
          'Creates magical light effects at night',
          'Used for royal celebrations and ceremonies'
        ]
      },
      {
        id: 'royal-chambers',
        x: 70,
        y: 40,
        title: 'Royal Living Quarters',
        description: 'Private chambers of the royal family',
        details: [
          'Features intricate jali work for ventilation',
          'Decorated with precious stone inlay',
          'Connected to secret escape passages'
        ]
      }
    ],
    connections: [
      { id: 'courtyard', direction: 'Back to Courtyard', angle: 270 }
    ]
  },
  {
    id: 'tower',
    name: 'Watch Tower - Burj-e-Nazar',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrfre-kA3tSZMnSgHkIa9P6hVSuaXFU3WVtQ&s',
    hotspots: [
      {
        id: 'observation-deck',
        x: 50,
        y: 25,
        title: 'Observation Deck',
        description: 'Strategic vantage point overlooking the landscape',
        details: [
          'Height of 40 meters above ground',
          'Provides 360-degree panoramic views',
          'Used for astronomical observations'
        ]
      },
      {
        id: 'signal-system',
        x: 75,
        y: 30,
        title: 'Signal Fire Platform',
        description: 'Communication system with other forts',
        details: [
          'Part of a network spanning hundreds of kilometers',
          'Used mirrors and fire signals',
          'Could relay messages across the empire in hours'
        ]
      }
    ],
    connections: [
      { id: 'courtyard', direction: 'Down to Courtyard', angle: 90 }
    ]
  }
];

export default function FortExplorer({ onBackToHome }: FortExplorerProps) {
  const [currentLocation, setCurrentLocation] = useState<Location>(locations[0]);
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
    const location = locations.find(loc => loc.id === locationId);
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
              onClick={onBackToHome}
              className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <h1 className="text-white font-bold text-lg flex items-center">
                <Eye className="h-5 w-5 mr-2 text-yellow-400" />
                {currentLocation.name}
              </h1>
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
          <h3 className="text-white font-bold mb-3 text-sm">Fort Layout</h3>
          <div className="grid grid-cols-2 gap-2">
            {locations.map((location) => (
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