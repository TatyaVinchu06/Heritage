import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Share2, Heart } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Viewer3D from '@/components/Viewer3D';
import SiteInfoPanel from '@/components/SiteInfoPanel';
import AudioTourPlayer from '@/components/AudioTourPlayer';
import { getSiteById } from '@/data/sites';
import { HeritageSite, Viewpoint, Hotspot, ViewerState } from '@/types/heritage';

export default function SiteViewer() {
  const { siteId } = useParams<{ siteId: string }>();
  const [viewerState, setViewerState] = useState<ViewerState>({
    currentSite: null,
    currentViewpoint: null,
    isLoading: true,
    selectedHotspot: null,
    audioTourPlaying: false,
    currentChapter: 0
  });

  useEffect(() => {
    if (siteId) {
      // Simulate loading delay
      setTimeout(() => {
        const site = getSiteById(siteId);
        if (site) {
          const defaultViewpoint = site.viewpoints.find(vp => vp.isDefault) || site.viewpoints[0];
          setViewerState(prev => ({
            ...prev,
            currentSite: site,
            currentViewpoint: defaultViewpoint,
            isLoading: false
          }));
        } else {
          setViewerState(prev => ({ ...prev, isLoading: false }));
        }
      }, 1500);
    }
  }, [siteId]);

  const handleViewpointChange = (viewpoint: Viewpoint) => {
    setViewerState(prev => ({
      ...prev,
      currentViewpoint: viewpoint,
      selectedHotspot: null // Clear selected hotspot when changing viewpoint
    }));
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    setViewerState(prev => ({
      ...prev,
      selectedHotspot: prev.selectedHotspot?.id === hotspot.id ? null : hotspot
    }));
  };

  const handleAudioTourStart = () => {
    setViewerState(prev => ({
      ...prev,
      audioTourPlaying: true,
      currentChapter: 0
    }));
  };

  const handleAudioTourStop = () => {
    setViewerState(prev => ({
      ...prev,
      audioTourPlaying: false,
      currentChapter: 0
    }));
  };

  const handleChapterChange = (chapterIndex: number) => {
    setViewerState(prev => ({
      ...prev,
      currentChapter: chapterIndex
    }));
    
    // Navigate to the viewpoint associated with this chapter
    if (viewerState.currentSite?.audioTour) {
      const chapter = viewerState.currentSite.audioTour.chapters[chapterIndex];
      const viewpoint = viewerState.currentSite.viewpoints.find(vp => vp.id === chapter.viewpointId);
      if (viewpoint) {
        handleViewpointChange(viewpoint);
      }
    }
  };

  if (viewerState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
            <h2 className="text-xl font-semibold mb-2">Loading Heritage Site</h2>
            <p className="text-gray-600">Preparing your virtual tour experience...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!viewerState.currentSite || !viewerState.currentViewpoint) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Site Not Found</h2>
            <p className="text-gray-600 mb-4">The heritage site you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sites</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{viewerState.currentSite.name}</h1>
              <p className="text-sm text-gray-600">{viewerState.currentSite.location.state}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {viewerState.currentViewpoint.name}
            </Badge>
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-8rem)]">
        {/* 3D Viewer */}
        <div className="flex-1 relative">
          <Viewer3D
            site={viewerState.currentSite}
            currentViewpoint={viewerState.currentViewpoint}
            onViewpointChange={handleViewpointChange}
            onHotspotClick={handleHotspotClick}
            selectedHotspot={viewerState.selectedHotspot}
          />
        </div>

        {/* Info Panel */}
        <SiteInfoPanel
          site={viewerState.currentSite}
          selectedHotspot={viewerState.selectedHotspot}
          onAudioTourStart={handleAudioTourStart}
          isAudioTourPlaying={viewerState.audioTourPlaying}
        />
      </div>

      {/* Audio Tour Player */}
      {viewerState.audioTourPlaying && viewerState.currentSite.audioTour && (
        <AudioTourPlayer
          audioTour={viewerState.currentSite.audioTour}
          isPlaying={viewerState.audioTourPlaying}
          onPlay={() => setViewerState(prev => ({ ...prev, audioTourPlaying: true }))}
          onPause={() => setViewerState(prev => ({ ...prev, audioTourPlaying: false }))}
          onStop={handleAudioTourStop}
          onChapterChange={handleChapterChange}
          currentChapter={viewerState.currentChapter}
        />
      )}
    </div>
  );
}