import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Eye, Star, ArrowRight, Zap } from 'lucide-react';
import { HeritageSite } from '@/types/heritage';
import StreetViewer from './StreetViewer';

interface SiteCardProps {
  site: HeritageSite;
}

export default function SiteCard({ site }: SiteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showStreetViewer, setShowStreetViewer] = useState(false);

  const handleStreetViewExplore = () => {
    setShowStreetViewer(true);
  };

  const closeStreetViewer = () => {
    setShowStreetViewer(false);
  };

  return (
    <>
      <motion.div
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Enhanced Glowing Background Effect */}
        <motion.div
          className="absolute -inset-2 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700"
          animate={isHovered ? { scale: 1.05, rotate: 1 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.5 }}
        />
        
        <Card className="relative overflow-hidden bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 shadow-2xl rounded-3xl text-white">
          {/* Enhanced Image Section */}
          <div className="aspect-video relative overflow-hidden">
            <motion.img
              src={site.thumbnailUrl}
              alt={site.name}
              className="w-full h-full object-cover"
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.style.background = 
                  site.id === 'taj-mahal' 
                    ? 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
                    : 'linear-gradient(135deg, #7c2d12 0%, #a16207 100%)';
              }}
            />
            
            {/* Enhanced Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-500/40 to-red-500/40"
              animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Floating Badges with Enhanced Animation */}
            <div className="absolute top-4 left-4 flex gap-2">
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.4 }}
              >
                <Badge className="bg-orange-600/95 text-white font-semibold px-3 py-1.5 shadow-xl border-0 backdrop-blur-sm">
                  <Star className="w-3 h-3 mr-1 text-yellow-300" />
                  UNESCO Heritage
                </Badge>
              </motion.div>
            </div>
            
            {/* Enhanced AR/VR Indicator */}
            <motion.div
              className="absolute top-4 right-4"
              initial={{ scale: 0, rotate: 15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.4 }}
            >
              <motion.div
                className="w-14 h-14 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl cursor-pointer border-2 border-white/20"
                whileHover={{ scale: 1.15, rotate: 10, boxShadow: "0 0 30px rgba(99, 102, 241, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStreetViewExplore}
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>
            
            {/* Enhanced Site Name Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <motion.h3
                className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-2xl"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {site.name}
              </motion.h3>
              <motion.div
                className="flex items-center text-white/95 text-sm backdrop-blur-sm bg-black/30 rounded-full px-3 py-1 w-fit"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <MapPin className="w-4 h-4 mr-1" />
                {site.location.address}
              </motion.div>
            </div>
          </div>
          
          <CardHeader className="pb-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <CardDescription className="text-base text-gray-300 leading-relaxed line-clamp-3 mb-4">
                {site.description}
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Enhanced Info Grid */}
            <motion.div
              className="grid grid-cols-2 gap-4 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="flex items-center text-sm text-gray-300 bg-gray-700/60 rounded-xl p-3 backdrop-blur-sm">
                <Clock className="w-4 h-4 mr-2 text-orange-400" />
                <div>
                  <div className="font-medium text-white">Period</div>
                  <div className="text-xs">{site.historicalPeriod}</div>
                </div>
              </div>
              
              {site.audioTour && (
                <div className="flex items-center text-sm text-blue-300 bg-blue-900/40 rounded-xl p-3 backdrop-blur-sm">
                  <Eye className="w-4 h-4 mr-2" />
                  <div>
                    <div className="font-medium text-blue-200">Street View</div>
                    <div className="text-xs text-blue-300">
                      Interactive Street View
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* Enhanced CTA Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Button 
                onClick={handleStreetViewExplore}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 text-white font-semibold py-4 rounded-2xl shadow-2xl border-0 transition-all duration-300"
              >
                <motion.div
                  className="flex items-center justify-center relative z-10"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  <span className="text-lg">Explore Street View</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.div>
                
                {/* Enhanced Button Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                  animate={isHovered ? { x: ['-100%', '100%'] } : { x: '-100%' }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Street Viewer Modal */}
      {showStreetViewer && (
        <StreetViewer site={site} onClose={closeStreetViewer} />
      )}
    </>
  );
}