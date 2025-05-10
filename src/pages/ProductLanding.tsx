
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Restaurant type definition
type Restaurant = {
  id: number;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: string;
  location: string;
  featured: boolean;
};

// Fetch restaurants from API
const fetchRestaurants = async (): Promise<Restaurant[]> => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch('https://api.example.com/restaurants');
    
    // For development purposes, if the API fails, return mock data
    if (!response.ok) {
      console.log('Using mock restaurant data');
      return [
        {
          id: 1,
          name: "Pizza Paradise",
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
          cuisine: "Italian",
          rating: 4.8,
          reviewCount: 243,
          deliveryTime: "20-30 min",
          deliveryFee: "$2.99",
          location: "123 Main Street, Downtown",
          featured: true
        },
        {
          id: 2,
          name: "Burger Bliss",
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
          cuisine: "American",
          rating: 4.5,
          reviewCount: 187,
          deliveryTime: "15-25 min",
          deliveryFee: "$1.99",
          location: "456 Oak Avenue, Westside",
          featured: false
        },
        {
          id: 3,
          name: "Sushi Supreme",
          image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
          cuisine: "Japanese",
          rating: 4.9,
          reviewCount: 312,
          deliveryTime: "25-35 min",
          deliveryFee: "$3.99",
          location: "789 Pine Street, Eastside",
          featured: true
        },
        {
          id: 4,
          name: "Taco Town",
          image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
          cuisine: "Mexican",
          rating: 4.7,
          reviewCount: 156,
          deliveryTime: "15-25 min",
          deliveryFee: "$2.49",
          location: "101 Maple Road, Southside",
          featured: false
        }
      ];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw new Error('Failed to fetch restaurants');
  }
};

const ProductLanding = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch restaurants using React Query
  const { data: restaurants, isLoading, isError } = useQuery({
    queryKey: ['restaurants'],
    queryFn: fetchRestaurants,
  });
  
  // Update filtered restaurants when data loads or search query changes
  useEffect(() => {
    if (restaurants) {
      if (!searchQuery) {
        setFilteredRestaurants(restaurants);
      } else {
        const filtered = restaurants.filter(restaurant => 
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRestaurants(filtered);
      }
    }
  }, [restaurants, searchQuery]);
  
  const handleRestaurantClick = (restaurantId: number) => {
    // Navigate to restaurant menu page (you can implement this later)
    navigate(`/menu?restaurant=${restaurantId}`);
    toast({
      title: "Restaurant selected",
      description: "Loading menu items for this restaurant...",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-grubzap-dark to-grubzap-dark/80 text-white py-20 md:py-32">
          <div className="absolute inset-0 bg-[url('/lovable-uploads/44d718c2-c665-4c4a-b504-d07049172178.png')] opacity-10 bg-repeat"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Find the Best Local 
                <span className="bg-clip-text text-transparent bg-orange-gradient block mt-2"> 
                  Restaurants Near You
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto">
                Discover amazing restaurants in your area and get your favorite food delivered to your doorstep in minutes.
              </p>
              <div className="relative max-w-lg mx-auto">
                <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg">
                  <MapPin className="h-5 w-5 text-gray-400 ml-4" />
                  <Input 
                    type="text" 
                    placeholder="Enter your location or restaurant name..." 
                    className="py-4 px-3 w-full text-gray-800 focus:outline-none border-none rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button className="m-1 bg-grubzap-orange hover:bg-grubzap-darkOrange rounded-full px-6">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Restaurant Listings */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-grubzap-dark">
                Explore <span className="text-grubzap-orange">Restaurants</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Sort by:</span>
                <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                  <option>Rating</option>
                  <option>Delivery Time</option>
                  <option>Distance</option>
                </select>
              </div>
            </div>
            
            {/* Restaurant Grid */}
            {isLoading ? (
              // Loading state
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Card key={item} className="overflow-hidden border-gray-100">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                      <div className="mt-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4">
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : isError ? (
              // Error state
              <div className="text-center py-12">
                <div className="text-red-500 mb-4 text-xl">Unable to load restaurants</div>
                <Button 
                  className="bg-grubzap-orange hover:bg-grubzap-darkOrange"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            ) : filteredRestaurants.length === 0 ? (
              // No results state
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">No restaurants found matching your search</div>
                <Button 
                  className="bg-grubzap-orange hover:bg-grubzap-darkOrange"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              // Results state
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <Card 
                    key={restaurant.id} 
                    className="overflow-hidden card-hover border-gray-100 cursor-pointer"
                    onClick={() => handleRestaurantClick(restaurant.id)}
                  >
                    <div className="relative h-48">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      {restaurant.featured && (
                        <Badge className="absolute top-3 left-3 bg-grubzap-orange border-none">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-grubzap-dark">{restaurant.name}</h3>
                          <p className="text-gray-500">{restaurant.cuisine}</p>
                        </div>
                        <div className="flex items-center bg-grubzap-yellow/20 px-2 py-1 rounded">
                          <Star className="h-4 w-4 fill-grubzap-yellow text-grubzap-yellow mr-1" />
                          <span className="text-sm font-medium">{restaurant.rating}</span>
                          <span className="text-xs text-gray-500 ml-1">({restaurant.reviewCount})</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <span>Delivery: {restaurant.deliveryTime}</span>
                          <span className="mx-2">•</span>
                          <span>Fee: {restaurant.deliveryFee}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{restaurant.location}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4">
                      <button className="bg-grubzap-orange hover:bg-grubzap-darkOrange text-white rounded-md px-4 py-2 w-full font-medium">
                        View Menu
                      </button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Show more button */}
            {filteredRestaurants.length > 0 && (
              <div className="text-center mt-10">
                <Button 
                  variant="outline" 
                  className="border-grubzap-orange text-grubzap-orange hover:bg-grubzap-orange/10"
                >
                  Load More Restaurants
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* App promotion banner */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-gradient-to-r from-grubzap-orange to-grubzap-red rounded-xl overflow-hidden shadow-lg">
              <div className="flex flex-col md:flex-row items-center p-6 md:p-10">
                <div className="md:w-3/5 mb-8 md:mb-0">
                  <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">Download the GrubZap App Today!</h2>
                  <p className="text-white/80 mb-6">Get exclusive deals and track your delivery in real-time.</p>
                  <div className="flex flex-wrap gap-4">
                    <Button className="bg-black hover:bg-black/80">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.5227 7.39905C17.3094 7.5614 16.9772 7.76944 16.5264 8.02319C16.0756 8.27695 15.7139 8.48499 15.4414 8.64734C14.3224 9.33414 13.7631 9.67753 13.7631 9.67753C13.7631 9.67753 13.7631 9.67753 13.7631 9.67753C13.2531 10.0001 12.6345 10.1614 11.9568 10.1614C11.2791 10.1614 10.6605 10.0001 10.1505 9.67753C10.1505 9.67753 10.1505 9.67753 10.1505 9.67753C10.1505 9.67753 9.59119 9.33414 8.47221 8.64734C8.19969 8.48499 7.83805 8.27695 7.38726 8.02319C6.93647 7.76944 6.6043 7.5614 6.39094 7.39905C5.67389 6.87448 5.11458 6.2729 4.71301 5.5943C4.31144 4.9157 4.11066 4.19141 4.11066 3.42143C4.11066 2.46564 4.42025 1.65799 5.03944 1.00848C5.65862 0.358968 6.45568 0.0342126 7.43061 0.0342126H16.483C17.4579 0.0342126 18.255 0.358968 18.8742 1.00848C19.4934 1.65799 19.803 2.46564 19.803 3.42143C19.803 4.19141 19.6022 4.9157 19.2006 5.5943C18.7991 6.2729 18.2398 6.87448 17.5227 7.39905Z" />
                      </svg>
                      App Store
                    </Button>
                    <Button className="bg-black hover:bg-black/80">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.16187 0.414062C3.02612 0.554687 2.95825 0.773437 2.95825 1.07031V22.9297C2.95825 23.2266 3.02612 23.4453 3.16187 23.5859L3.229 23.6531L13.9584 12.9531V12.8672L3.229 2.16797L3.16187 2.23438Z" />
                      </svg>
                      Google Play
                    </Button>
                  </div>
                </div>
                <div className="md:w-2/5">
                  <img 
                    src="/lovable-uploads/44d718c2-c665-4c4a-b504-d07049172178.png" 
                    alt="GrubZap App" 
                    className="h-48 md:h-64 w-auto mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductLanding;
