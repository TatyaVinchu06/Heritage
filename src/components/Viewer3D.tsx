import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Info, X, RotateCcw, Navigation, Play, Pause } from 'lucide-react';
import { HeritageSite, Viewpoint, Hotspot } from '@/types/heritage';

interface Viewer3DProps {
  site: HeritageSite;
  // New interface props (for SiteViewer)
  currentViewpoint?: Viewpoint;
  onViewpointChange?: (viewpoint: Viewpoint) => void;
  onHotspotClick?: (hotspot: Hotspot) => void;
  selectedHotspot?: Hotspot | null;
  // Old interface props (for SiteCard)
  onClose?: () => void;
}

// Google Street View viewpoints for Taj Mahal (1-10 left to right)
const TAJ_MAHAL_VIEWPOINTS = [
  {
    id: 'entrance',
    name: '1. Entrance (front gate)',
    description: 'Main entrance view of the Taj Mahal with the iconic gateway',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1758252688188!5m2!1sen!2sin!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJREN0ckhjeWdF!2m2!1d27.17051237082263!2d78.04212718278505!3f355.9332582320632!4f4.787515290082638!5f0.7820865974627469'
  },
  {
    id: 'west-side',
    name: '2. Side wall (west side)',
    description: 'Western side view showcasing the symmetrical architecture',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1758252800214!5m2!1sen!2sin!6m8!1m7!1s84nlT6vdhyD61uJPtlRgyQ!2m2!1d27.17327474648006!2d78.04085991561543!3f270.8229911347972!4f-3.539825267751283!5f0.7820865974627469'
  },
  {
    id: 'east-side',
    name: '3. Side wall (east side)',
    description: 'Eastern side view highlighting the architectural details',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1758252836506!5m2!1sen!2sin!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRDR6dkhjMndF!2m2!1d27.17313033680322!2d78.04319067248423!3f97.78862246726834!4f6.3119032566490745!5f0.7820865974627469'
  },
  {
    id: 'back-view',
    name: '4. Back view (rear of mausoleum)',
    description: 'Rear view of the mausoleum overlooking the Yamuna River',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1758252878337!5m2!1sen!2sin!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRGV0ZVAwY3c.!2m2!1d27.17553709027824!2d78.04198463448104!3f0.13232262867705913!4f-3.2123040742645514!5f0.7820865974627469'
  },
  {
    id: 'jawab',
    name: '5. Jawab Masjid',
    description: 'Close-up view of the Jawab (guest house) architectural details',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1758252929084!5m2!1sen!2sin!6m8!1m7!1s0BJwbCIk6kv-DX7HW65-MQ!2m2!1d27.17463655722395!2d78.04232049783626!3f336.5054992047972!4f5.379196538167264!5f0.7820865974627469'
  },
  {
    id: 'mehman',
    name: '6. Mehman-Khana',
    description: 'View of the guest house (Mehman-Khana) complex',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1758253065418!5m2!1sen!2sin!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ20zYnZEZlE.!2m2!1d27.1750409789746!2d78.04330021663527!3f93.71372473122841!4f8.93959815620478!5f0.7820865974627469'
  },
  {
    id: 'gardens-front',
    name: '7. View from gardens (front)',
    description: 'Panoramic view from the gardens showing the full facade',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1758253025668!5m2!1sen!2sin!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRHEzWmJwS1E.!2m2!1d27.17395403127484!2d78.04186202711365!3f84.86688163798307!4f2.4452069921593704!5f0.7820865974627469'
  },
  {
    id: 'entrance-arch',
    name: '8. Close up on entrance arch',
    description: 'Detailed view of the entrance arch and calligraphy',
    streetViewUrl: 'https://www.google.com/maps/embed/v1/streetview?key=YOUR_API_KEY&location=27.1751,78.0420&heading=0&pitch=10&fov=60'
  },
  {
    id: 'minaret-view',
    name: '9. Side minaret view',
    description: 'Close-up view of one of the four minarets',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1758253138682!5m2!1sen!2sin!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJREV0OWpGYlE.!2m2!1d27.17298759868659!2d78.04215626714387!3f174.1479667039376!4f9.318635011710398!5f0.7820865974627469'
  },
  {
    id: 'front',
    name: '10. Front view',
    description: 'Complete frontal view with architectural symmetry',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1758253191354!5m2!1sen!2sin!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRHFwYnVVaEFF!2m2!1d27.17317386366545!2d78.04248646984969!3f309.3002870453596!4f25.30568743987905!5f0.7820865974627469'
  }
];

// Google Street View URLs for heritage sites
const HERITAGE_SITE_STREET_VIEW_URLS: Record<string, string> = {
  'taj-mahal': TAJ_MAHAL_VIEWPOINTS[0].streetViewUrl,
  'red-fort': 'https://www.google.com/maps/embed?pb=!4v1601234567891!6m8!1m7!1sCAoSLEFGMVFpcE5fbFJ1dFJjYWw5R2V0QVhYWnVaQXJfdWFfWkE!2m2!1d28.6561592!2d77.2410203!3f320!4f10!5f0.7820865974627469'
};

export default function Viewer3D({ site, currentViewpoint, onViewpointChange, onHotspotClick, selectedHotspot, onClose }: Viewer3DProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [internalSelectedHotspot, setInternalSelectedHotspot] = useState<Hotspot | null>(null);
  const [internalCurrentViewpoint, setInternalCurrentViewpoint] = useState<Viewpoint | null>(null);
  const [currentStreetViewIndex, setCurrentStreetViewIndex] = useState(0);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (onClose) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [onClose]);

  // Initialize internal viewpoint if not provided
  React.useEffect(() => {
    if (!currentViewpoint && site?.viewpoints?.length > 0) {
      setInternalCurrentViewpoint(site.viewpoints[0]);
    }
  }, [site, currentViewpoint]);

  // Use provided viewpoint or internal one
  const activeViewpoint = currentViewpoint || internalCurrentViewpoint;
  const activeSelectedHotspot = selectedHotspot !== undefined ? selectedHotspot : internalSelectedHotspot;

  // Handle viewpoint change
  const handleViewpointChange = (viewpoint: Viewpoint) => {
    if (onViewpointChange) {
      onViewpointChange(viewpoint);
    } else {
      setInternalCurrentViewpoint(viewpoint);
    }
  };

  // Handle hotspot click
  const handleHotspotClick = (hotspot: Hotspot) => {
    if (onHotspotClick) {
      onHotspotClick(hotspot);
    } else {
      setInternalSelectedHotspot(activeSelectedHotspot?.id === hotspot.id ? null : hotspot);
    }
  };

  // Get the Street View URL for the current site
  const getStreetViewUrl = () => {
    if (site.id === 'taj-mahal') {
      return TAJ_MAHAL_VIEWPOINTS[currentStreetViewIndex].streetViewUrl;
    }
    return HERITAGE_SITE_STREET_VIEW_URLS[site.id] || HERITAGE_SITE_STREET_VIEW_URLS['taj-mahal'];
  };
  
  const streetViewUrl = getStreetViewUrl();
  
  // Get current viewpoint info for Taj Mahal
  const getCurrentViewpointInfo = () => {
    if (site.id === 'taj-mahal') {
      return TAJ_MAHAL_VIEWPOINTS[currentStreetViewIndex];
    }
    return { name: activeViewpoint?.name || 'Default View', description: activeViewpoint?.description || '' };
  };
  
  const currentViewpointInfo = getCurrentViewpointInfo();

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!site || !activeViewpoint) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <Info className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold mb-2">Site Not Found</h2>
          <p className="text-gray-600 mb-4">The requested heritage site could not be loaded.</p>
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Go Back
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Modal wrapper for SiteCard usage
  const content = (
    <div className={`${onClose ? 'fixed inset-0 z-50 bg-black/80 backdrop-blur-md' : 'relative w-full h-full'}`}>
      {onClose && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
      )}
      <div className={`relative ${onClose ? 'w-full h-full' : 'w-full h-full'} bg-gray-100 flex`}>
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center">
            <motion.div 
              className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-lg font-semibold text-gray-700">Loading Street View...</p>
            <p className="text-sm text-gray-500 mt-2">
              Preparing {site.name} virtual tour
            </p>
          </div>
        </div>
      )}

      {/* Left Sidebar with Viewpoints */}
      {site.id === 'taj-mahal' && (
        <div className="w-80 bg-white/95 backdrop-blur-sm border-r shadow-lg flex flex-col">
          <div className="p-4 border-b bg-blue-50">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Viewpoints</h3>
            <p className="text-sm text-gray-600">Explore different perspectives</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-2">
              {TAJ_MAHAL_VIEWPOINTS.map((viewpoint, index) => (
                <motion.div
                  key={viewpoint.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    currentStreetViewIndex === index 
                      ? 'bg-blue-100 border-blue-300 shadow-md' 
                      : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setCurrentStreetViewIndex(index);
                    setIsLoading(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStreetViewIndex === index 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-semibold mb-1 ${
                        currentStreetViewIndex === index ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {viewpoint.name}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {viewpoint.description}
                      </p>
                    </div>
                  </div>
                  {currentStreetViewIndex === index && (
                    <motion.div 
                      className="mt-2 pt-2 border-t border-blue-200"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <Badge className="bg-blue-600 text-white text-xs">
                        Currently Viewing
                      </Badge>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Street View Container */}
      <div className="flex-1 relative">
        {/* Google Street View Iframe */}
        <div className="w-full h-full" style={{ position: 'relative', paddingBottom: onClose ? '0' : '56.25%', height: onClose ? '100%' : '0', overflow: 'hidden' }}>
          <iframe 
            key={streetViewUrl} // Force reload when URL changes
            src={streetViewUrl}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={handleIframeLoad}
            title={`${site.name} - ${currentViewpointInfo.name}`}
          />
        </div>

        {/* Site Information Overlay */}
        <div className="absolute top-4 left-4 z-20">
          <Card className="bg-white/95 backdrop-blur-sm border shadow-lg max-w-xs sm:max-w-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <Badge className="bg-blue-600 text-white text-xs">
                  Street View
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentViewpointInfo.name}
                </Badge>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">{site.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                Agra, Uttar Pradesh
              </p>
              <p className="text-xs text-gray-500 line-clamp-2">
                {currentViewpointInfo.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Close Button for Modal Mode */}
        {onClose && (
          <div className="absolute top-4 right-4 z-30">
            <Button
              variant="outline"
              size="lg"
              onClick={onClose}
              className="bg-white/95 backdrop-blur-sm border shadow-lg hover:bg-white text-gray-800 hover:text-gray-900 px-4 py-2"
            >
              <X className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Close</span>
            </Button>
          </div>
        )}

        {/* Navigation Controls - Only show for non-Taj Mahal sites */}
        {site.id !== 'taj-mahal' && site.viewpoints && site.viewpoints.length > 1 && (
          <div className="absolute top-4 right-20 sm:right-32 z-20">
            <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
              <CardContent className="p-2 sm:p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">Viewpoints:</span>
                  <div className="flex space-x-1">
                    {site.viewpoints.map((viewpoint, index) => (
                      <Button
                        key={viewpoint.id}
                        variant={activeViewpoint.id === viewpoint.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleViewpointChange(viewpoint)}
                        className="text-xs px-2 py-1 min-w-[28px]"
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hotspot Information Panel */}
        <AnimatePresence>
          {activeSelectedHotspot && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 w-72 sm:w-80 z-20"
            >
              <Card className="bg-white/95 backdrop-blur-sm border shadow-xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        {activeSelectedHotspot.title}
                      </h3>
                      <Badge className="bg-green-600 text-white text-xs">
                        {activeSelectedHotspot.type}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHotspotClick(activeSelectedHotspot)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {typeof activeSelectedHotspot.content === 'string' ? activeSelectedHotspot.content : activeSelectedHotspot.content?.text || ''}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Hotspots Overlay - Show for viewpoints with hotspots */}
        {activeViewpoint && (activeViewpoint as any).hotspots && (activeViewpoint as any).hotspots.length > 0 && (
          <div className="absolute bottom-4 left-4 z-20">
            <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Interactive Points</span>
                </div>
                <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                  {((activeViewpoint as any).hotspots || []).map((hotspot: any) => (
                    <Button
                      key={hotspot.id}
                      variant={activeSelectedHotspot?.id === hotspot.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleHotspotClick(hotspot)}
                      className="w-full justify-start text-left text-xs sm:text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                        <span className="truncate">{hotspot.title}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Audio Controls */}
        <div className="absolute bottom-4 right-4 z-20">
          <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
            <CardContent className="p-2 sm:p-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                  className="flex items-center space-x-1 text-xs sm:text-sm"
                >
                  {isAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="hidden sm:inline">Audio Tour</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );

  return content;
}