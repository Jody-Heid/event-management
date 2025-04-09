import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  ChevronRight, 
  Search, 
  Menu, 
  X, 
  ChevronLeft,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Tag
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface IndexProps {
  events: {
    data: Event[];
  };
}

const eventCategories = [
  { id: 1, name: 'Featured Active', href: '/events/featured-active' },
  { id: 2, name: 'Fitness Classes', href: '/events/fitness' },
  { id: 3, name: 'MTB', href: '/events/mtb' },
  { id: 4, name: 'Music', href: '/events/music' },
  { id: 5, name: 'Multisport', href: '/events/multisport' },
  { id: 6, name: 'Road Cycling', href: '/events/cycling' },
  { id: 7, name: 'Theatre', href: '/events/theatre' },
  { id: 8, name: 'Road Running', href: '/events/running' },
  { id: 9, name: 'Tourism', href: '/events/tourism' },
];

// Function to generate random price
const generateRandomPrice = (): string => {
  const basePrice = Math.floor(Math.random() * 200) + 50;
  const maxPrice = basePrice + Math.floor(Math.random() * 150);
  
  if (Math.random() > 0.5) {
    return `R${basePrice}`;
  } else {
    return `R${basePrice} - R${maxPrice}`;
  }
};

// Function to format date
const formatDate = (date: Date): string => {
  if (!date) return '';
  
  const eventDate = new Date(date);
  
  // Format: "FROM DD MMM YYYY"
  return `FROM ${eventDate.getDate()} ${eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()} ${eventDate.getFullYear()}`;
};

// Function to generate random tags for events
const generateRandomTags = (): string[] => {
  const allTags = ['Music', 'Sports', 'Conference', 'Festival', 'Workshop', 'Exhibition', 'Networking', 'Comedy', 'Theater', 'Dance'];
  const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 tags per event
  const shuffled = [...allTags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numTags);
};

export default function Homepage({ events }: IndexProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentEventSlide, setCurrentEventSlide] = useState(0);
  const [favoriteEvents, setFavoriteEvents] = useState<Record<number, boolean>>({});
 
  // Generate random prices and tags for events once on component mount
  const [eventPrices] = useState(() => {
    const prices: Record<number, string> = {};
    events.data.forEach(event => {
      prices[event.id] = generateRandomPrice();
    });
    return prices;
  });

  const [eventTags] = useState(() => {
    const tags: Record<number, string[]> = {};
    events.data.forEach(event => {
      tags[event.id] = generateRandomTags();
    });
    return tags;
  });

  // Limit events to 8 (2 rows of 4)
  const limitedEvents = events.data.slice(0, 8);
  const totalEventSlides = Math.ceil(limitedEvents.length / 4);
  
  // Get featured events for the main carousel (first 3 events)
  const featuredCarouselEvents = events.data.slice(0, 3);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredCarouselEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredCarouselEvents.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredCarouselEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredCarouselEvents.length) % featuredCarouselEvents.length);
  };

  const nextEventSlide = () => {
    setCurrentEventSlide((prev) => (prev + 1) % totalEventSlides);
  };

  const prevEventSlide = () => {
    setCurrentEventSlide((prev) => (prev - 1 + totalEventSlides) % totalEventSlides);
  };

  const toggleFavorite = (eventId: number) => {
    setFavoriteEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  return (
    <>
      <Head title="Welcome to EventHub" />
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">EventHub</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium">Home</Link>
            <Link href="/events" className="text-gray-700 hover:text-primary font-medium">Events</Link>
            <Link href="/about" className="text-gray-700 hover:text-primary font-medium">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary font-medium">Contact</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href={route('login')}>
              <Button variant="outline" size="sm">Log in</Button>
            </Link>
            <Link href={route('register')}>
              <Button size="sm">Register</Button>
            </Link>
            
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-primary font-medium">Home</Link>
              <Link href="/events" className="text-gray-700 hover:text-primary font-medium">Events</Link>
              <Link href="/about" className="text-gray-700 hover:text-primary font-medium">About</Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary font-medium">Contact</Link>
            </div>
          </div>
        )}
      </header>
      
      <section className="relative h-[600px] overflow-hidden">
        <div className="relative h-full">
          {featuredCarouselEvents.map((event, index) => (
            <div
              key={event.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/80">
                <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
                  <h1 className="text-5xl font-bold mb-6">{event.title}</h1>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{event.address}</span>
                    </div>
                  </div>
                  <Link 
                    href={`/events/${event.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
                  >
                    View Event Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg className="w-full h-24 fill-current text-white" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
            </svg>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {featuredCarouselEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="container mx-auto px-4 pb-8">
            <div className="max-w-4xl mx-auto">
              <div 
                className={`flex flex-col sm:flex-row gap-2 p-4 bg-white rounded-lg shadow-lg transition-all ${
                  isSearchFocused ? 'sm:scale-105' : ''
                }`}
              >
                <div className="relative flex-grow">
                  <input 
                    type="text" 
                    placeholder="Search for events, venues, or artists..." 
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button size="lg" className="whitespace-nowrap">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 text-2xl">★</span>
              <h2 className="text-2xl font-semibold text-gray-800">Featured Events</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {currentEventSlide + 1} of {totalEventSlides}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-6 border-b border-gray-200">
              {eventCategories.map((category) => (
                <Link
                  key={category.id}
                  href={category.href}
                  className={`text-gray-600 hover:text-primary whitespace-nowrap text-sm py-4 border-b-2 transition-colors ${
                    category.id === 1 ? 'border-primary text-primary font-medium' : 'border-transparent'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="flex overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentEventSlide * 100}%)` }}
              >
                {limitedEvents.map((event) => {
                  return (
                    <div 
                      key={event.id}
                      className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-2"
                    >
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img 
                            src={event.image}
                            alt={event.title} 
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <button 
                            className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(event.id);
                            }}
                          >
                            <Heart 
                              className={`h-5 w-5 ${favoriteEvents[event.id] ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} 
                            />
                          </button>
                        </div>
                        <div className="p-4">
                          <div className="text-sm text-gray-600 mb-2">
                            {formatDate(event.start_date)}
                          </div>
                          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-primary transition-colors duration-200">
                            {event.title}
                          </h3>
                          <div className="text-sm text-gray-500 mb-2">
                            {event.address}
                          </div>
                          <div className="text-sm font-medium text-gray-900 mb-3">
                            {eventPrices[event.id]}
                          </div>
                          
                          {/* Event Tags */}
                          <div className="flex flex-wrap gap-2">
                            {eventTags[event.id]?.map((tag, index) => (
                              <Link 
                                key={index}
                                href={`/events?tag=${encodeURIComponent(tag)}`}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={prevEventSlide}
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={nextEventSlide}
              className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
            
            {/* Slide indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalEventSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentEventSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentEventSlide ? 'bg-primary w-6' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              href="/events" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
            >
              Explore All Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-8 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates about new events and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
            <Button variant="secondary" className="whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">EventHub</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your one-stop platform for discovering and booking amazing events.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="/events" className="text-gray-400 hover:text-white">Events</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Event Categories</h3>
              <ul className="space-y-2">
                <li><a href="/events?category=music" className="text-gray-400 hover:text-white">Music</a></li>
                <li><a href="/events?category=sports" className="text-gray-400 hover:text-white">Sports</a></li>
                <li><a href="/events?category=conference" className="text-gray-400 hover:text-white">Conferences</a></li>
                <li><a href="/events?category=festival" className="text-gray-400 hover:text-white">Festivals</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">123 Event Street</li>
                <li className="text-gray-400">New York, NY 10001</li>
                <li className="text-gray-400">info@eventhub.com</li>
                <li className="text-gray-400">+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}