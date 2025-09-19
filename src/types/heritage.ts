
// Core types for Heritage Explorer MVP
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface HeritageSite {
  id: string;
  name: string;
  location: {
    city: string;
    state: string;
    coordinates: { lat: number; lng: number };
  };
  description: string;
  historicalPeriod: string;
  thumbnailUrl: string;
  viewpoints: Viewpoint[];
  audioTour?: AudioTour;
}

export interface Viewpoint {
  id: string;
  position: Vector3;
  name: string;
  description?: string;
  hotspots?: Hotspot[];
}

export interface Hotspot {
  id: string;
  position: Vector3;
  type: 'info' | 'audio' | 'image';
  title: string;
  content: string;
}

export interface AudioTour {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  chapters: AudioChapter[];
  narrator: {
    name: string;
    bio: string;
  };
}

export interface AudioChapter {
  id: string;
  title: string;
  audioUrl: string;
  duration: number;
  viewpointId: string;
  transcript: string;
  order: number;
}

export interface ViewerState {
  currentSite: HeritageSite | null;
  currentViewpoint: Viewpoint | null;
  isLoading: boolean;
  selectedHotspot: Hotspot | null;
  audioTourPlaying: boolean;
  currentChapter: number;
}