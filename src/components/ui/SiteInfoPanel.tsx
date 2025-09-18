import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  Globe
} from 'lucide-react';
import { HeritageSite, AudioTour } from '@/types/heritage';

interface SiteInfoPanelProps {
  site: HeritageSite | null;
  isVisible: boolean;
  onClose: () => void;
}

interface AudioPlayerProps {
  audioTour: AudioTour;
}

function AudioPlayer({ audioTour }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!audioTour || !audioTour.chapters || audioTour.chapters.length === 0) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <p className="text-gray-500 text-sm">No audio tour available</p>
        </CardContent>
      </Card>
    );
  }

  const currentChapterData = audioTour.chapters[currentChapter];
  const totalDuration = audioTour.duration || 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg text-blue-900">
              {audioTour.title || 'Audio Tour'}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {formatTime(totalDuration)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Chapter Info */}
        <div className="bg-white/70 rounded-lg p-3">
          <h4 className="font-medium text-gray-900 mb-1">
            {currentChapterData?.title || 'Chapter'}
          </h4>
          <p className="text-sm text-gray-600">
            Chapter {currentChapter + 1} of {audioTour.chapters.length}
          </p>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
            disabled={currentChapter === 0}
            className="border-blue-200 hover:bg-blue-50"
          >
            Previous
          </Button>
          
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentChapter(Math.min(audioTour.chapters.length - 1, currentChapter + 1))}
            disabled={currentChapter === audioTour.chapters.length - 1}
            className="border-blue-200 hover:bg-blue-50"
          >
            Next
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="text-blue-600 hover:bg-blue-50"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Chapter List Toggle */}
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-blue-600 hover:bg-blue-50"
        >
          <span className="mr-2">All Chapters</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {/* Chapter List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {audioTour.chapters.map((chapter, index) => (
                    <Button
                      key={chapter.id}
                      variant={index === currentChapter ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentChapter(index)}
                      className={`w-full justify-start text-left ${
                        index === currentChapter 
                          ? 'bg-blue-600 text-white' 
                          : 'text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{chapter.title}</div>
                        <div className="text-xs opacity-70">
                          {formatTime(chapter.duration || 0)}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export default function SiteInfoPanel({ site, isVisible, onClose }: SiteInfoPanelProps) {
  if (!site) {
    return null;
  }

  const {
    name = 'Unknown Site',
    description = 'No description available',
    location = { city: 'Unknown', state: 'Unknown' },
    historicalPeriod = 'Unknown Period',
    audioTour
  } = site;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 border-l border-gray-200"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {name}
                  </h2>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {location.city}, {location.state}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{historicalPeriod}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                  <Star className="w-3 h-3 mr-1" />
                  UNESCO Heritage
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Globe className="w-3 h-3 mr-1" />
                  AR/VR Ready
                </Badge>
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-blue-600" />
                    About
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {description}
                  </p>
                </div>

                <Separator />

                {/* Quick Facts */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-600" />
                    Quick Facts
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Historical Period</div>
                      <div className="font-medium text-gray-900">{historicalPeriod}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Location</div>
                      <div className="font-medium text-gray-900">
                        {location.city}, {location.state}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Status</div>
                      <div className="font-medium text-gray-900">UNESCO World Heritage Site</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Audio Tour */}
                {audioTour && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Volume2 className="w-5 h-5 mr-2 text-purple-600" />
                      Audio Experience
                    </h3>
                    <AudioPlayer audioTour={audioTour} />
                  </div>
                )}

                {/* Virtual Experience */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-indigo-600" />
                    Virtual Experience
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      size="sm"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      AR View
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      size="sm"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      VR Tour
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}