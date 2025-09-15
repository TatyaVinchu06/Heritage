import React from 'react';
import { Eye, MapPin, Camera, Clock, Users, Star, ArrowRight, Play } from 'lucide-react';

interface LandingPageProps {
  onStartExploration: () => void;
}

export default function LandingPage({ onStartExploration }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F97316' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl shadow-lg">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Fort Explorer</h1>
                <p className="text-sm text-orange-600">Virtual Heritage Experience</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-orange-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-orange-600 transition-colors">About</a>
              <button
                onClick={onStartExploration}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg"
              >
                Start Exploring
              </button>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="h-4 w-4 mr-2" />
                Immersive 360° Experience
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Explore India's
                <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"> Majestic Forts</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Step into history with our immersive virtual tour. Experience the grandeur of ancient Indian architecture through interactive 360° views, just like Google Street View.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={onStartExploration}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-xl flex items-center justify-center group"
                >
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Begin Virtual Tour
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="border-2 border-orange-300 text-orange-700 px-8 py-4 rounded-xl hover:bg-orange-50 transition-all duration-200 flex items-center justify-center">
                  <Camera className="h-5 w-5 mr-2" />
                  View Gallery
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4</div>
                  <div className="text-sm text-gray-600">Locations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">360°</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">12+</div>
                  <div className="text-sm text-gray-600">Hotspots</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/3573383/pexels-photo-3573383.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Indian Fort"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Play Button Overlay */}
                <button
                  onClick={onStartExploration}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:bg-white/30 transition-all duration-200 group-hover:scale-110">
                    <Play className="h-12 w-12 text-white ml-1" />
                  </div>
                </button>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg border border-orange-100">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium">4 Locations</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg border border-orange-100">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium">360° Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Immersive Fort Exploration
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the rich history and architectural marvels of Indian forts through cutting-edge virtual reality technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl w-fit mb-6">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">360° Panoramic Views</h3>
              <p className="text-gray-600">
                Navigate through the fort just like Google Street View. Drag to look around and explore every corner of these magnificent structures.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-100">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl w-fit mb-6">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Interactive Hotspots</h3>
              <p className="text-gray-600">
                Click on glowing markers to discover fascinating historical facts, architectural details, and cultural significance of each location.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-2xl border border-red-100">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl w-fit mb-6">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rich Historical Content</h3>
              <p className="text-gray-600">
                Learn about the fascinating history, architectural techniques, and cultural importance of each fort section through detailed descriptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Preserving Heritage Through Technology
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our virtual fort explorer brings India's magnificent architectural heritage to your screen. Experience the grandeur of ancient forts, learn about their history, and appreciate the craftsmanship of bygone eras.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-gray-700">Educational experience for all ages</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Camera className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-gray-700">High-quality panoramic imagery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-gray-700">Multiple fort locations to explore</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Fort Architecture"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Explore?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Begin your virtual journey through India's most magnificent forts and discover centuries of history and architecture.
          </p>
          <button
            onClick={onStartExploration}
            className="bg-white text-orange-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-xl font-semibold text-lg flex items-center mx-auto group"
          >
            Start Your Virtual Tour
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold">Fort Explorer</h3>
                <p className="text-sm text-gray-400">Virtual Heritage Experience</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Fort Explorer. Preserving heritage through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}