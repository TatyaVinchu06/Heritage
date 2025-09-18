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
    latitude: number;
    longitude: number;
    address: string;
    state: string;
  };
  description: string;
  historicalPeriod: string;
  significance: string;
  imageUrl: string;
  thumbnailUrl: string;
  model3D: {
    lowRes: string;
    medRes: string;
    highRes: string;
  };
  viewpoints: Viewpoint[];
  hotspots: Hotspot[];
  audioTour?: AudioTour;
}

export interface Viewpoint {
  id: string;
  position: Vector3;
  rotation: Vector3;
  name: string;
  description?: string;
  isDefault: boolean;
  connections: string[]; // IDs of connected viewpoints
}

export interface Hotspot {
  id: string;
  position: Vector3;
  type: 'info' | 'audio' | 'image';
  title: string;
  content: {
    text?: string;
    imageUrl?: string;
    audioUrl?: string;
  };
  visibility: boolean;
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