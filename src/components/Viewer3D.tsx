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

// Google Street View URLs for heritage sites
const HERITAGE_SITE_STREET_VIEW_URLS: Record<string, string> = {
  'taj-mahal': 'https://www.google.com/maps/embed?pb=!4v1601234567890!6m8!1m7!1sCrn9bAMnMpMAAAGuoZM_bg!2m2!1d27.1760372!2d78.040973!3f161.63!4f-23.45!5f0.7820865974627469',
  'red-fort': 'https://www.google.com/maps/embed?pb=!4v1601234567891!6m8!1m7!1sCAoSLEFGMVFpcE5fbFJ1dFJjYWw5R2V0QVhYWnVaQXJfdWFfWkE!2m2!1d28.6561592!2d77.2410203!3f320!4f10!5f0.7820865974627469'
};

export default function Viewer3D({ site, currentViewpoint, onViewpointChange, onHotspotClick, selectedHotspot, onClose }: Viewer3DProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [internalSelectedHotspot, setInternalSelectedHotspot] = useState<Hotspot | null>(null);
  const [internalCurrentViewpoint, setInternalCurrentViewpoint] = useState<Viewpoint | null>(null);

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
  const streetViewUrl = HERITAGE_SITE_STREET_VIEW_URLS[site.id] || HERITAGE_SITE_STREET_VIEW_URLS['taj-mahal'];

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
      <div className={`relative ${onClose ? 'w-full h-full' : 'w-full h-full'} bg-gray-100`}>
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

      {/* Google Street View Iframe */}
      <div className="w-full h-full" style={{ position: 'relative', paddingBottom: onClose ? '0' : '56.25%', height: onClose ? '100%' : '0', overflow: 'hidden' }}>
        <iframe 
          src={streetViewUrl}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={handleIframeLoad}
          title={`${site.name} - Street View`}
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
                {activeViewpoint.name}
              </Badge>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">{site.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              {site.location.city}, {site.location.state}
            </p>
            <p className="text-xs text-gray-500 line-clamp-2">
              {activeViewpoint.description}
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

      {/* Navigation Controls */}
      {site.viewpoints && site.viewpoints.length > 1 && (
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
                  {activeSelectedHotspot.content}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Hotspots Overlay */}
      {activeViewpoint.hotspots && activeViewpoint.hotspots.length > 0 && (
        <div className="absolute bottom-4 left-4 z-20">
          <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Interactive Points</span>
              </div>
              <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                {activeViewpoint.hotspots.map((hotspot) => (
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
  );

  return content;
}
