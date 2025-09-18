import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Info, X, Volume2, VolumeX, RotateCcw, Navigation, Play, Pause } from 'lucide-react';
import { HeritageSite, Viewpoint, Hotspot } from '@/types/heritage';
import * as THREE from 'three';

interface Viewer3DProps {
  site: HeritageSite;
  onClose: () => void;
}

interface HotspotMeshProps {
  hotspot: Hotspot;
  onClick: (hotspot: Hotspot) => void;
  isSelected: boolean;
}

function HotspotMesh({ hotspot, onClick, isSelected }: HotspotMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      const scale = isSelected ? 1.5 : hovered ? 1.3 : 1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[hotspot.position.x, hotspot.position.y, hotspot.position.z]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(hotspot);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#ff6b35' : hovered ? '#4f46e5' : '#3b82f6'}
          emissive={isSelected ? '#ff6b35' : hovered ? '#4f46e5' : '#3b82f6'}
          emissiveIntensity={0.4}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Pulsing Ring Effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.5, 16]} />
        <meshBasicMaterial
          color={isSelected ? '#ff6b35' : '#3b82f6'}
          transparent
          opacity={hovered ? 0.6 : 0.3}
        />
      </mesh>
      
      {(hovered || isSelected) && (
        <Html distanceFactor={8} position={[0, 0.8, 0]}>
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none shadow-lg border border-white/20">
            <div className="font-semibold">{hotspot.title}</div>
            <div className="text-xs text-gray-300 capitalize">{hotspot.type}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function TajMahalModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Platform */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 1, 12]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
      
      {/* Main Building */}
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[8, 4, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Central Dome */}
      <mesh position={[0, 7, 0]} castShadow>
        <sphereGeometry args={[2.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f8f8ff" />
      </mesh>
      
      {/* Dome Finial */}
      <mesh position={[0, 9.5, 0]} castShadow>
        <coneGeometry args={[0.3, 1, 8]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
      
      {/* Four Minarets */}
      {[[-6, 6], [6, 6], [-6, -6], [6, -6]].map(([x, z], index) => (
        <group key={index}>
          <mesh position={[x, 5, z]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 10]} />
            <meshStandardMaterial color="#f5f5dc" />
          </mesh>
          <mesh position={[x, 10.5, z]} castShadow>
            <sphereGeometry args={[0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#f8f8ff" />
          </mesh>
        </group>
      ))}
      
      {/* Decorative Arches */}
      {[-3, 0, 3].map((x, index) => (
        <mesh key={index} position={[x, 4, 4.1]} castShadow>
          <boxGeometry args={[1.5, 2, 0.2]} />
          <meshStandardMaterial color="#e6e6fa" />
        </mesh>
      ))}
    </group>
  );
}

function RedFortModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Fort Structure */}
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 6, 12]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      
      {/* Fort Walls */}
      {[
        [-7, 3, 0, [2, 6, 12]], // Left wall
        [7, 3, 0, [2, 6, 12]],  // Right wall
        [0, 3, -7, [12, 6, 2]], // Back wall
        [0, 3, 7, [12, 6, 2]]   // Front wall
      ].map(([x, y, z, dimensions], index) => (
        <mesh key={index} position={[x, y, z]} castShadow>
          <boxGeometry args={dimensions as [number, number, number]} />
          <meshStandardMaterial color="#a0522d" />
        </mesh>
      ))}
      
      {/* Corner Towers */}
      {[[-6, 6, -6], [6, 6, -6], [-6, 6, 6], [6, 6, 6]].map(([x, y, z], index) => (
        <group key={index}>
          <mesh position={[x, y, z]} castShadow>
            <cylinderGeometry args={[1, 1, 6]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
          <mesh position={[x, y + 4, z]} castShadow>
            <coneGeometry args={[1.2, 2, 8]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
        </group>
      ))}
      
      {/* Main Gate */}
      <mesh position={[0, 2, 7.1]} castShadow>
        <boxGeometry args={[3, 4, 0.2]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Gate Arch */}
      <mesh position={[0, 3.5, 7.2]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.3, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    </group>
  );
}

function Scene({ site, onHotspotClick, selectedHotspot }: { 
  site: HeritageSite; 
  onHotspotClick: (hotspot: Hotspot) => void;
  selectedHotspot: Hotspot | null;
}) {
  const { camera } = useThree();
  const viewpoints = site.viewpoints || [];
  const currentViewpoint = viewpoints[0];
  const hotspots = currentViewpoint?.hotspots || [];

  // Set camera position on mount
  useEffect(() => {
    if (camera) {
      if (site.id === 'taj-mahal') {
        camera.position.set(12, 8, 12);
      } else {
        camera.position.set(15, 10, 15);
      }
      camera.lookAt(0, 3, 0);
    }
  }, [camera, site.id]);

  return (
    <>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[20, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-15, 10, -15]} intensity={0.5} color="#ffa500" />
      <pointLight position={[15, 10, 15]} intensity={0.5} color="#87ceeb" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>

      {/* Heritage Monument */}
      {site.id === 'taj-mahal' ? <TajMahalModel /> : <RedFortModel />}

      {/* Interactive Hotspots */}
      {hotspots.map((hotspot) => (
        <HotspotMesh
          key={hotspot.id}
          hotspot={hotspot}
          onClick={onHotspotClick}
          isSelected={selectedHotspot?.id === hotspot.id}
        />
      ))}

      {/* Site Title */}
      <Text
        position={[0, 12, 0]}
        fontSize={1.5}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        {site.name}
      </Text>

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 3, 0]}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
}

// Fixed LoadingFallback component
function LoadingFallback({ siteName }: { siteName?: string }) {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="text-white text-center">
        <motion.div 
          className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-lg">Loading 3D Heritage Experience...</p>
        <p className="text-sm text-white/70 mt-2">
          Preparing {siteName || 'monument'} for exploration
        </p>
      </div>
    </div>
  );
}

// Error Boundary Component
class ThreeDErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Viewer Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default function Viewer3D({ site, onClose }: Viewer3DProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentViewpointIndex, setCurrentViewpointIndex] = useState(0);
  const [is3DReady, setIs3DReady] = useState(false);

  const viewpoints = site?.viewpoints || [];
  const currentViewpoint = viewpoints[currentViewpointIndex];

  const handleHotspotClick = (hotspot: Hotspot) => {
    setSelectedHotspot(selectedHotspot?.id === hotspot.id ? null : hotspot);
  };

  const resetView = () => {
    setSelectedHotspot(null);
    setCurrentViewpointIndex(0);
  };

  const nextViewpoint = () => {
    if (viewpoints.length > 1) {
      setCurrentViewpointIndex((prev) => (prev + 1) % viewpoints.length);
      setSelectedHotspot(null);
    }
  };

  const prevViewpoint = () => {
    if (viewpoints.length > 1) {
      setCurrentViewpointIndex((prev) => (prev - 1 + viewpoints.length) % viewpoints.length);
      setSelectedHotspot(null);
    }
  };

  // Set 3D ready after a short delay to ensure proper initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIs3DReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!site) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <Info className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Site Not Found</h2>
          <p className="text-gray-400 mb-6">The requested heritage site could not be loaded.</p>
          <Button onClick={onClose} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const ErrorFallback = (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-900 to-gray-900">
      <div className="text-white text-center">
        <X className="w-16 h-16 mx-auto mb-4 text-red-400" />
        <h2 className="text-xl font-bold mb-2">3D Viewer Error</h2>
        <p className="text-gray-300 mb-4">Unable to load 3D experience</p>
        <Button onClick={onClose} variant="outline">
          Go Back
        </Button>
      </div>
    </div>
  );

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">{site.name}</h1>
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            3D Heritage Experience
          </Badge>
          {currentViewpoint && (
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              {currentViewpoint.name}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Viewpoint Navigation */}
          {viewpoints.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevViewpoint}
                className="text-white hover:bg-white/10"
              >
                <Navigation className="w-4 h-4 rotate-180" />
              </Button>
              <span className="text-white text-sm">
                {currentViewpointIndex + 1}/{viewpoints.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextViewpoint}
                className="text-white hover:bg-white/10"
              >
                <Navigation className="w-4 h-4" />
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAudioPlaying(!isAudioPlaying)}
            className="text-white hover:bg-white/10"
          >
            {isAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetView}
            className="text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <ThreeDErrorBoundary fallback={ErrorFallback}>
          {is3DReady ? (
            <Suspense fallback={<LoadingFallback siteName={site.name} />}>
              <Canvas
                camera={{ position: [12, 8, 12], fov: 60 }}
                shadows
                gl={{ 
                  antialias: true, 
                  alpha: false,
                  powerPreference: "high-performance"
                }}
                style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #98D8E8 50%, #F0E68C 100%)' }}
                onCreated={(state) => {
                  console.log('Canvas created successfully');
                  state.gl.setClearColor('#87CEEB');
                }}
              >
                <Scene 
                  site={site} 
                  onHotspotClick={handleHotspotClick}
                  selectedHotspot={selectedHotspot}
                />
              </Canvas>
            </Suspense>
          ) : (
            <LoadingFallback siteName={site.name} />
          )}
        </ThreeDErrorBoundary>

        {/* Hotspot Info Panel */}
        <AnimatePresence>
          {selectedHotspot && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-4 right-4 w-80 z-10"
            >
              <Card className="bg-black/90 backdrop-blur-sm border-gray-700 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {selectedHotspot.title}
                      </h3>
                      <Badge className="bg-blue-600 text-white text-xs">
                        {selectedHotspot.type}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedHotspot(null)}
                      className="text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedHotspot.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls Info */}
        <div className="absolute bottom-4 left-4 z-10">
          <Card className="bg-black/90 backdrop-blur-sm border-gray-700">
            <CardContent className="p-4">
              <div className="text-white text-sm space-y-2">
                <div className="flex items-center space-x-2 font-semibold">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span>3D Navigation Controls</span>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div>• <strong>Mouse Drag:</strong> Rotate view</div>
                  <div>• <strong>Scroll:</strong> Zoom in/out</div>
                  <div>• <strong>Click Blue Spheres:</strong> View information</div>
                  <div>• <strong>Navigation Arrows:</strong> Change viewpoints</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Viewpoint Description */}
        {currentViewpoint && (
          <motion.div
            className="absolute bottom-4 right-4 z-10 max-w-md"
            key={currentViewpointIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-black/80 backdrop-blur-sm border-gray-700">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-2">{currentViewpoint.name}</h4>
                <p className="text-gray-300 text-sm">{currentViewpoint.description}</p>
                {currentViewpoint.hotspots && currentViewpoint.hotspots.length > 0 && (
                  <div className="mt-3 text-xs text-blue-300">
                    {currentViewpoint.hotspots.length} interactive points available
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}