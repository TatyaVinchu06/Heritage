import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import { AudioTour, AudioChapter } from '@/types/heritage';

interface AudioTourPlayerProps {
  audioTour: AudioTour;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onChapterChange: (chapterIndex: number) => void;
  currentChapter: number;
}

export default function AudioTourPlayer({
  audioTour,
  isPlaying,
  onPlay,
  onPause,
  onStop,
  onChapterChange,
  currentChapter
}: AudioTourPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const chapter = audioTour.chapters[currentChapter];

  useEffect(() => {
    if (isPlaying) {
      // Simulate audio playback progress
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          const progressPercent = (newTime / chapter.duration) * 100;
          setProgress(progressPercent);
          
          // Auto-advance to next chapter when current one ends
          if (newTime >= chapter.duration) {
            if (currentChapter < audioTour.chapters.length - 1) {
              onChapterChange(currentChapter + 1);
              return 0;
            } else {
              onStop();
              return 0;
            }
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, chapter.duration, currentChapter, audioTour.chapters.length, onChapterChange, onStop]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrevious = () => {
    if (currentChapter > 0) {
      onChapterChange(currentChapter - 1);
      setCurrentTime(0);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentChapter < audioTour.chapters.length - 1) {
      onChapterChange(currentChapter + 1);
      setCurrentTime(0);
      setProgress(0);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 bg-white shadow-lg rounded-lg border p-3 z-50">
        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            variant={isPlaying ? "secondary" : "default"}
            onClick={isPlaying ? onPause : onPlay}
            className="w-8 h-8 p-0"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{chapter.title}</p>
            <Progress value={progress} className="h-1 mt-1" />
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsMinimized(false)}
            className="w-8 h-8 p-0"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-96 bg-white shadow-xl border z-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-orange-600" />
            <span className="font-semibold text-sm">Audio Tour</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(true)}
              className="w-6 h-6 p-0"
            >
              <SkipBack className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onStop}
              className="w-6 h-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="font-medium text-sm mb-1">{chapter.title}</h3>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Chapter {currentChapter + 1} of {audioTour.chapters.length}</span>
            <Badge variant="outline" className="text-xs">
              {audioTour.narrator.name}
            </Badge>
          </div>
        </div>

        <div className="mb-4">
          <Progress value={progress} className="h-2 mb-2" />
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(chapter.duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentChapter === 0}
            className="w-8 h-8 p-0"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant={isPlaying ? "secondary" : "default"}
            onClick={isPlaying ? onPause : onPlay}
            className="w-10 h-10 p-0 rounded-full"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleNext}
            disabled={currentChapter === audioTour.chapters.length - 1}
            className="w-8 h-8 p-0"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Chapter transcript */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-medium text-gray-700 mb-1">Transcript</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            {chapter.transcript}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}