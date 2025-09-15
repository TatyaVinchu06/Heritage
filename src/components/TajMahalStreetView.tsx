import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, MapPin, Info, Camera, Compass, ZoomIn, ZoomOut, Eye, Navigation } from 'lucide-react';

interface TajMahalStreetViewProps {
  onBackToHome: () => void;
  onBackToExplorer: () => void;
}

interface Hotspot {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  description: string;
  details: string[];
}

const tajMahalHotspots: Hotspot[] = [
  {
    id: 'main-gate',
    position: { lat: 27.173007, lng: 78.042155 },
    title: 'Main Gate - Darwaza-i-Rauza',
    description: 'The grand entrance to the Taj Mahal complex',
    details: [
      'Built in 1648 from red sandstone',
      'Features intricate geometric patterns',
      'Contains verses from the Quran in calligraphy',
      'The gateway frames the first view of the Taj Mahal'
    ]
  },
  {
    id: 'main-tomb',
    position: { lat: 27.173891, lng: 78.042068 },
    title: 'Main Tomb - Rauza-i-Munawwara',
    description: 'The iconic white marble mausoleum',
    details: [
      'Completed in 1648 after 17 years of construction',
      'Built by Emperor Shah Jahan for his wife Mumtaz Mahal',
      'Made from white marble with precious stone inlay',
      'Perfect example of Mughal architecture',
      'One of the New Seven Wonders of the World'
    ]
  },
  {
    id: 'mosque',
    position: { lat: 27.173454, lng: 78.041455 },
    title: 'Red Sandstone Mosque',
    description: 'Western building providing symmetry to the complex',
    details: [
      'Built from red sandstone to contrast the white tomb',
      'Still used for prayer services',
      'Features three bulbous domes',
      'Faces Mecca for religious significance'
    ]
  },
  {
    id: 'garden',
    position: { lat: 27.173600, lng: 78.041800 },
    title: 'Charbagh Garden',
    description: 'Persian-style formal garden',
    details: [
      'Represents the Garden of Paradise from Islamic texts',
      'Divided into four quadrants by waterways',
      'Contains cypress trees symbolizing immortality',
      'Central reflecting pool enhances the tomb\'s beauty'
    ]
  }
];

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function TajMahalStreetView({ onBackToHome, onBackToExplorer }: TajMahalStreetViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const panoRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [panorama, setPanorama] = useState<any>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [currentLocation, setCurrentLocation] = useState(tajMahalHotspots[1]); // Start at main tomb
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeMap = () => {
      if (!window.google || !mapRef.current || !panoRef.current) {
        setTimeout(initializeMap, 100);
        return;
      }

      try {
        // Initialize the map
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: currentLocation.position,
          zoom: 16,
          mapTypeId: 'hybrid'
        });

        // Initialize the street view panorama
        const panoInstance = new window.google.maps.StreetViewPanorama(panoRef.current, {
          position: currentLocation.position,
          pov: {
            heading: 34,
            pitch: 10,
          },
          zoom: 1,
          addressControl: false,
          panControl: true,
          zoomControl: false,
          fullscreenControl: false,
          motionTracking: false,
          motionTrackingControl: false
        });

        // Connect map and panorama
        mapInstance.setStreetView(panoInstance);

        // Add markers for each hotspot
        tajMahalHotspots.forEach(hotspot => {
          const marker = new window.google.maps.Marker({
            position: hotspot.position,
            map: mapInstance,
            title: hotspot.title,
            icon: {
              url: 'data:image/svg+xml;base64,' + btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="12" fill="#FCD34D" stroke="#F59E0B" stroke-width="2"/>
                  <circle cx="16" cy="16" r="6" fill="#F59E0B"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32)
            }
          });

          marker.addListener('click', () => {
            panoInstance.setPosition(hotspot.position);
            setCurrentLocation(hotspot);
          });
        });

        setMap(mapInstance);
        setPanorama(panoInstance);
        setIsLoaded(true);

        // Listen for panorama position changes
        panoInstance.addListener('position_changed', () => {
          const position = panoInstance.getPosition();
          if (position) {
            // Find the closest hotspot
            let closestHotspot = tajMahalHotspots[0];
            let minDistance = calculateDistance(position, closestHotspot.position);

            tajMahalHotspots.forEach(hotspot => {
              const distance = calculateDistance(position, hotspot.position);
              if (distance < minDistance) {
                minDistance = distance;
                closestHotspot = hotspot;
              }
            });

            setCurrentLocation(closestHotspot);
          }
        });

      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    // Set up the global callback
    window.initMap = initializeMap;
    
    // If Google Maps is already loaded, initialize immediately
    if (window.google) {
      initializeMap();
    }

    return () => {
      if (window.initMap === initializeMap) {
        delete window.initMap;
      }
    };
  }, []);

  const calculateDistance = (pos1: any, pos2: { lat: number; lng: number }) => {
    const lat1 = typeof pos1.lat === 'function' ? pos1.lat() : pos1.lat;
    const lng1 = typeof pos1.lng === 'function' ? pos1.lng() : pos1.lng;
    const lat2 = pos2.lat;
    const lng2 = pos2.lng;

    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const navigateToHotspot = (hotspot: Hotspot) => {
    if (panorama) {
      panorama.setPosition(hotspot.position);
      setCurrentLocation(hotspot);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-bold mb-2">Loading Taj Mahal Street View...</h2>
          <p className="text-amber-200">Preparing your virtual journey</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      {/* Street View Container */}
      <div 
        ref={panoRef}
        className="w-full h-full"
        style={{ minHeight: '100vh' }}
      />

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
                {currentLocation.title}
              </h1>
              <p className="text-amber-200 text-sm">Taj Mahal, Agra</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedHotspot(currentLocation)}
              className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
            >
              <Info className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowMiniMap(!showMiniMap)}
              className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
            >
              <MapPin className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Panel */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 space-y-2 z-30">
        {tajMahalHotspots.map((hotspot, index) => (
          <button
            key={hotspot.id}
            onClick={() => navigateToHotspot(hotspot)}
            className={`block w-12 h-12 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20 ${
              currentLocation.id === hotspot.id
                ? 'bg-yellow-500 text-black'
                : 'bg-black/60 hover:bg-black/80 text-white'
            }`}
            title={hotspot.title}
          >
            <Navigation className="h-5 w-5 mx-auto" />
          </button>
        ))}
      </div>

      {/* Mini Map */}
      {showMiniMap && (
        <div className="absolute bottom-4 left-4 w-80 h-60 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 z-30 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-2">
            <h3 className="text-white font-bold text-sm">Taj Mahal Complex</h3>
          </div>
          <div 
            ref={mapRef}
            className="w-full h-48"
          />
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
            <span>Click arrows to move</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>Use navigation panel</span>
          </div>
        </div>
      </div>

      {/* Information Modal */}
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
                    <p className="text-amber-100 text-sm">Taj Mahal Complex</p>
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