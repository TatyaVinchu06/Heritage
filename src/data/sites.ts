import { HeritageSite } from '@/types/heritage';

// Heritage site image URLs
const heritageImages = {
  tajMahal: {
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1200px-Taj_Mahal_%28Edited%29.jpeg',
    card: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1200px-Taj_Mahal_%28Edited%29.jpeg'
  },
  redFort: {
    hero: 'https://cdn.britannica.com/20/189820-050-D650A54D/Red-Fort-Old-Delhi-India.jpg',
    card: 'https://cdn.britannica.com/20/189820-050-D650A54D/Red-Fort-Old-Delhi-India.jpg'
  }
};

export const heritageSites: HeritageSite[] = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    description: 'An ivory-white marble mausoleum on the right bank of the river Yamuna in Agra, Uttar Pradesh. Built by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal, it is considered the finest example of Mughal architecture and a symbol of eternal love.',
    location: {
      city: 'Agra',
      state: 'Uttar Pradesh',
      coordinates: { lat: 27.1751, lng: 78.0421 }
    },
    historicalPeriod: '1632-1653 CE',
    thumbnailUrl: heritageImages.tajMahal.card,
    viewpoints: [
      {
        id: 'main-gate',
        name: 'Main Gateway',
        position: { x: 0, y: 0, z: 0 },
        description: 'The grand red sandstone gateway with intricate Islamic calligraphy',
        hotspots: [
          {
            id: 'gateway-arch',
            position: { x: 0, y: 5, z: -2 },
            title: 'Islamic Calligraphy',
            content: 'Beautiful verses from the Quran inscribed in marble',
            type: 'info'
          }
        ]
      },
      {
        id: 'main-dome',
        name: 'Central Dome',
        position: { x: 0, y: 10, z: -50 },
        description: 'The iconic central dome with four smaller domes',
        hotspots: [
          {
            id: 'dome-architecture',
            position: { x: 0, y: 15, z: -45 },
            title: 'Dome Architecture',
            content: 'The double-dome construction technique used in Mughal architecture',
            type: 'info'
          }
        ]
      },
      {
        id: 'gardens',
        name: 'Charbagh Gardens',
        position: { x: 0, y: 0, z: -25 },
        description: 'The symmetrical Mughal gardens representing paradise',
        hotspots: [
          {
            id: 'water-channels',
            position: { x: 0, y: 0, z: -20 },
            title: 'Water Channels',
            content: 'The four water channels representing the rivers of paradise',
            type: 'info'
          }
        ]
      }
    ],
    audioTour: {
      title: 'Taj Mahal: A Monument of Love',
      duration: 1800, // 30 minutes
      chapters: [
        {
          id: 'introduction',
          title: 'Introduction to Taj Mahal',
          duration: 300,
          audioUrl: '/audio/taj-intro.mp3'
        },
        {
          id: 'architecture',
          title: 'Architectural Marvel',
          duration: 450,
          audioUrl: '/audio/taj-architecture.mp3'
        },
        {
          id: 'history',
          title: 'Love Story of Shah Jahan',
          duration: 600,
          audioUrl: '/audio/taj-history.mp3'
        },
        {
          id: 'gardens',
          title: 'The Paradise Gardens',
          duration: 450,
          audioUrl: '/audio/taj-gardens.mp3'
        }
      ]
    }
  },
  {
    id: 'red-fort',
    name: 'Red Fort (Lal Qila)',
    description: 'A historic walled city in Delhi, India, that served as the main residence of the Mughal emperors for nearly 200 years. Built by Emperor Shah Jahan, it represents the peak of Mughal architecture and is a UNESCO World Heritage Site.',
    location: {
      city: 'Delhi',
      state: 'Delhi',
      coordinates: { lat: 28.6562, lng: 77.2410 }
    },
    historicalPeriod: '1638-1648 CE',
    thumbnailUrl: heritageImages.redFort.card,
    viewpoints: [
      {
        id: 'lahori-gate',
        name: 'Lahori Gate',
        position: { x: 0, y: 0, z: 0 },
        description: 'The main entrance to the Red Fort, facing towards Lahore',
        hotspots: [
          {
            id: 'gate-architecture',
            position: { x: 0, y: 8, z: -3 },
            title: 'Mughal Gateway',
            content: 'Massive red sandstone gateway with Islamic architectural elements',
            type: 'info'
          }
        ]
      },
      {
        id: 'diwan-i-am',
        name: 'Diwan-i-Am',
        position: { x: -20, y: 0, z: -30 },
        description: 'The Hall of Public Audience where the emperor met common people',
        hotspots: [
          {
            id: 'throne-platform',
            position: { x: -20, y: 3, z: -35 },
            title: 'Peacock Throne Platform',
            content: 'Where the famous Peacock Throne was placed for public audiences',
            type: 'info'
          }
        ]
      },
      {
        id: 'diwan-i-khas',
        name: 'Diwan-i-Khas',
        position: { x: 20, y: 0, z: -40 },
        description: 'The Hall of Private Audience for important meetings',
        hotspots: [
          {
            id: 'famous-inscription',
            position: { x: 20, y: 4, z: -42 },
            title: 'Famous Inscription',
            content: 'If there is paradise on earth, it is here, it is here, it is here',
            type: 'info'
          }
        ]
      }
    ],
    audioTour: {
      title: 'Red Fort: Seat of Mughal Power',
      duration: 2100, // 35 minutes
      chapters: [
        {
          id: 'introduction',
          title: 'Introduction to Red Fort',
          duration: 300,
          audioUrl: '/audio/redfort-intro.mp3'
        },
        {
          id: 'construction',
          title: 'Construction and Design',
          duration: 450,
          audioUrl: '/audio/redfort-construction.mp3'
        },
        {
          id: 'mughal-court',
          title: 'Life in the Mughal Court',
          duration: 600,
          audioUrl: '/audio/redfort-court.mp3'
        },
        {
          id: 'independence',
          title: 'Symbol of Independence',
          duration: 450,
          audioUrl: '/audio/redfort-independence.mp3'
        },
        {
          id: 'architecture-details',
          title: 'Architectural Details',
          duration: 300,
          audioUrl: '/audio/redfort-architecture.mp3'
        }
      ]
    }
  }
];

// Helper function to get site by ID
export const getSiteById = (id: string): HeritageSite | undefined => {
  return heritageSites.find(site => site.id === id);
};

// Export heritage images for use in other components
export { heritageImages };