import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navigation from '@/components/Navigation';
import SiteCard from '@/components/SiteCard';
import ParticleBackground from '@/components/ParticleBackground';
import TypewriterText from '@/components/TypewriterText';
import AnimatedCounter from '@/components/AnimatedCounter';
import FloatingCard from '@/components/FloatingCard';
import HeroImageCarousel from '@/components/HeroImageCarousel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Users, Globe, Star, Award, Eye, Clock, Zap, Play } from 'lucide-react';
import { heritageSites } from '@/data/sites';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  const filteredSites = heritageSites.filter(site =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.location.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const typewriterTexts = [
    "Heritage Sites",
    "Ancient Monuments", 
    "Cultural Treasures",
    "Historical Wonders"
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section with Heritage Images */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Carousel */}
        <HeroImageCarousel />
        
        {/* Particle Overlay */}
        <div className="absolute inset-0 z-10">
          <ParticleBackground />
        </div>
        
        {/* Floating Heritage Elements */}
        <motion.div
          className="absolute inset-0 z-10"
          style={{ y: y1, opacity }}
        >
          {/* Floating Taj Mahal silhouette */}
          <motion.div
            className="absolute top-20 right-10 w-32 h-32 opacity-10"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <div className="w-full h-full bg-white/20 rounded-full blur-xl" />
          </motion.div>
          
          {/* Floating Red Fort elements */}
          <motion.div
            className="absolute bottom-32 left-16 w-24 h-24 opacity-10"
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
          >
            <div className="w-full h-full bg-orange-300/30 rounded-full blur-2xl" />
          </motion.div>
        </motion.div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* Main Heading with Enhanced Animation */}
            <motion.div className="mb-8">
              <motion.h1 
                className="text-5xl md:text-8xl font-bold mb-4 leading-tight text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.3 }}
              >
                <motion.span
                  className="block bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Experience India's
                </motion.span>
                <motion.span 
                  className="block text-yellow-300 mt-4"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, delay: 1 }}
                >
                  <TypewriterText texts={typewriterTexts} className="inline-block" />
                </motion.span>
              </motion.h1>
            </motion.div>

            <motion.p 
              className="text-xl md:text-2xl mb-12 text-white/95 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              Step into history with immersive AR/VR virtual tours. 
              <span className="text-yellow-200 font-medium"> Explore the Taj Mahal and Red Fort</span> like never before with cutting-edge technology.
            </motion.p>

            {/* Enhanced CTA Section */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2 }}
            >
              <motion.div 
                className="relative flex-1 w-full max-w-lg"
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
              >
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <Input
                  type="text"
                  placeholder="Search Taj Mahal, Red Fort, or other heritage sites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-6 py-5 bg-white/95 backdrop-blur-sm border-0 text-gray-900 placeholder-gray-600 rounded-2xl text-lg shadow-2xl font-medium"
                />
              </motion.div>
              
              <motion.div className="flex gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    className="px-8 py-5 text-lg font-bold rounded-2xl shadow-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0"
                    onClick={() => document.getElementById('heritage-sites')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Zap className="w-6 h-6 mr-2" />
                    Start AR Experience
                  </Button>
                </motion.div>

              </motion.div>
            </motion.div>

            {/* Enhanced Statistics */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.5 }}
            >
              {[
                { icon: Eye, label: "AR Experiences", value: 0, suffix: "+", color: "text-blue-300" },
                { icon: MapPin, label: "Heritage Sites", value: 2, suffix: "", color: "text-green-300" },
                { icon: Award, label: "UNESCO Sites", value: 2, suffix: "", color: "text-yellow-300" },
                { icon: Clock, label: "VR Content Hours", value: 0, suffix: "+", color: "text-purple-300" }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2.7 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center bg-white/10 backdrop-blur-sm">
            <motion.div 
              className="w-2 h-4 bg-white/80 rounded-full mt-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Heritage Sites Section - Enhanced with Images */}
      <section id="heritage-sites" className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')] bg-repeat opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-5xl md:text-7xl font-bold text-white mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                AR Heritage
              </span>
              <br />
              <span className="text-white">Experience</span>
            </motion.h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-10 leading-relaxed">
              Immerse yourself in India's most iconic heritage sites through augmented reality. 
              Walk through the <span className="text-yellow-300 font-semibold">Taj Mahal</span> and 
              explore the <span className="text-red-300 font-semibold">Red Fort</span> like never before.
            </p>
            <div className="flex justify-center gap-4 mb-12">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 border-0">
                  <Star className="w-6 h-6 mr-3" />
                  UNESCO World Heritage
                </Badge>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0">
                  <Globe className="w-6 h-6 mr-3" />
                  AR/VR Ready
                </Badge>
              </motion.div>
            </div>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-16">
            {filteredSites.map((site, index) => (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
              >
                <SiteCard site={site} />
              </motion.div>
            ))}
          </div>
          
          {filteredSites.length === 0 && heritageSites.length > 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-400 text-2xl mb-8">
                No heritage sites found matching your search.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                  className="px-10 py-4 text-lg border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Clear Search
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-white to-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              Revolutionary Heritage Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Experience India's architectural marvels through cutting-edge AR/VR technology and interactive storytelling
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Globe,
                title: "Augmented Reality Tours",
                description: "Experience heritage sites in your own space with AR technology. Point your device and watch the Taj Mahal and Red Fort come alive around you.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: MapPin,
                title: "Interactive Hotspots",
                description: "Discover hidden stories and historical details through interactive AR markers and multimedia experiences at every corner.",
                color: "from-blue-500 to-purple-500"
              },
              {
                icon: Users,
                title: "Virtual Reality Immersion",
                description: "Step inside monuments with full VR support. Walk through ancient halls of the Red Fort and experience the Taj Mahal's beauty firsthand.",
                color: "from-green-500 to-teal-500"
              }
            ].map((feature, index) => (
              <FloatingCard key={feature.title} delay={index * 0.2}>
                <div className="p-10 text-center h-full">
                  <motion.div
                    className={`w-24 h-24 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <feature.icon className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="flex items-center justify-center space-x-4 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-2xl">HE</span>
              </div>
              <div className="text-left">
                <span className="text-4xl font-bold">Heritage Explorer</span>
                <div className="text-orange-300 text-sm font-medium">AR/VR Heritage Experience</div>
              </div>
            </motion.div>
            <p className="text-gray-300 mb-10 text-xl max-w-3xl mx-auto leading-relaxed">
              Revolutionizing heritage preservation through AR/VR technology and immersive digital experiences. 
              Bringing the Taj Mahal and Red Fort to life for future generations.
            </p>
            <motion.p 
              className="text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              © 2024 Heritage Explorer • Smart India Hackathon 2024 • Built with ❤️ for Digital India
            </motion.p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
