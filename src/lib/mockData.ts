// Initial data for the application
// In a real app, this would be fetched from a backend/database

export const initialProjects = [
  { id: "1", title: "Sankalp Heights", location: "Pune West", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600", type: "3 BHK Premium", description: "Sankalp Heights defines modern urban living..." },
  { id: "2", title: "Sankalp Oasis", location: "Pune East", image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1600", type: "2 & 3 BHK Apartments", description: "A seamless blend of nature and architecture..." },
  { id: "3", title: "Sankalp Residency", location: "Central Pune", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600", type: "4 BHK Luxury", description: "Located in the heart of the city..." },
  { id: "4", title: "Sankalp Greens", location: "Hinjewadi", image: "https://images.unsplash.com/photo-1628611225249-6c3c7c689552?w=1600", type: "2 BHK Smart Homes", description: "Step into the future with Sankalp Greens..." },
  { id: "5", title: "Sankalp Villas", location: "Lonavala", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600", type: "5 BHK Villas", description: "Your private retreat in the hills..." },
];

export const initialBlogs = [
  { id: 1, title: "Sankalp Heights - Urban Luxury", category: "Premium 3BHK", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", date: "Oct 12, 2025" },
  { id: 2, title: "Sankalp Oasis - Natural Living", category: "Eco-Friendly", image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800", date: "Sep 22, 2025" },
  { id: 3, title: "Sankalp Residency Overview", category: "Luxury 4BHK", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", date: "Aug 15, 2025" },
  { id: 4, title: "Why Sankalp Greens?", category: "Smart Homes", image: "https://images.unsplash.com/photo-1628611225249-6c3c7c689552?w=800", date: "Jul 10, 2025" },
  { id: 5, title: "Sankalp Villas Retreat", category: "Villas", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", date: "Jun 05, 2025" },
  { id: 6, title: "Future of Real Estate in Pune", category: "Insights", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800", date: "May 20, 2025" },
];

export const initialAmenities = [
  { id: 1, name: "Luxury Clubhouse", icon: "Home" },
  { id: 2, name: "Swimming Pool", icon: "Droplets" },
  { id: 3, name: "Gymnasium", icon: "Dumbbell" },
  { id: 4, name: "Kids Play Area", icon: "Gamepad" },
  { id: 5, name: "Yoga Deck", icon: "Wind" },
  { id: 6, name: "Jogging Track", icon: "Timer" },
];

export const initialFloorPlans = [
  { id: 1, type: "2BHK", area: "1,150 sq.ft.", img: "https://images.unsplash.com/photo-1628192078696-6e47c1b8f106?w=600", project: "Sankalp Oasis" },
  { id: 2, type: "3BHK", area: "1,550 sq.ft.", img: "https://images.unsplash.com/photo-1596495577610-8b14e3049fb5?w=600", project: "Sankalp Heights" },
  { id: 3, type: "4BHK", area: "2,200 sq.ft.", img: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600", project: "Sankalp Residency" },
];

export const initialLeads = [
  { id: 1, name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 98765 43210", project: "Sankalp Heights", message: "Interested in a 3BHK high-floor unit.", status: "New", date: "2 hours ago" },
  { id: 2, name: "Sneha Patil", email: "sneha@gmail.com", phone: "+91 87654 32109", project: "Sankalp Oasis", message: "Looking for price list and brochure.", status: "Follow-up", date: "5 hours ago" },
  { id: 3, name: "Amit Verma", email: "amit.v@outlook.com", phone: "+91 76543 21098", project: "Sankalp Greens", message: "Want to schedule a site visit for this weekend.", status: "Completed", date: "Yesterday" },
];

export const initialTestimonials = [
  { id: 1, name: "Priya Gupta", role: "Homeowner, Sankalp Heights", quote: "Living in Sankalp Heights has been a dream come true. The quality of construction and the amenities are unparalleled.", rating: 5, avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 2, name: "Anil Mehta", role: "Investor, Sankalp Greens", quote: "I invested in Sankalp Greens and it has been a fantastic decision. The ROI is great and the location is perfect.", rating: 5, avatar: "https://i.pravatar.cc/150?img=7" },
  { id: 3, name: "Sunita Rao", role: "Resident, Sankalp Oasis", quote: "The serenity of Sankalp Oasis is unmatched. The green spaces and the community is what I love most.", rating: 5, avatar: "https://i.pravatar.cc/150?img=9" },
];

export const initialTeam = [
  { id: 1, name: "Rajesh Sankalp", role: "Founder & CEO", image: "https://i.pravatar.cc/300?img=68", bio: "20+ years in real estate development across Maharashtra." },
  { id: 2, name: "Meera Joshi", role: "Chief Architect", image: "https://i.pravatar.cc/300?img=47", bio: "Award-winning architect specializing in sustainable luxury housing." },
  { id: 3, name: "Vikram Nair", role: "Head of Sales", image: "https://i.pravatar.cc/300?img=52", bio: "Guided 1000+ families to their dream homes over 15 years." },
];

export const initialFAQs = [
  { id: 1, question: "What types of properties does Sankalp Constructions offer?", answer: "We offer 2BHK, 3BHK, and 4BHK premium apartments as well as luxury villas across key locations in Pune and surrounding areas." },
  { id: 2, question: "Are your projects RERA registered?", answer: "Yes, all our projects are fully RERA registered and compliant with all local government regulations." },
  { id: 3, question: "What is the typical possession timeline?", answer: "Our projects typically have a 2-3 year development timeline from booking to possession, with updates provided regularly to homebuyers." },
  { id: 4, question: "Do you offer home loan assistance?", answer: "Yes, we have tie-ups with all leading banks and NBFCs to help you get the best home loan rates and a seamless approval process." },
];

export const initialGallery = [
  { id: 1, title: "Sankalp Heights Lobby", category: "Interior", image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800", project: "Sankalp Heights" },
  { id: 2, title: "Swimming Pool Area", category: "Amenities", image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800", project: "Sankalp Oasis" },
  { id: 3, title: "Premium 3BHK Living Room", category: "Interior", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800", project: "Sankalp Heights" },
  { id: 4, title: "Aerial View - Sankalp Greens", category: "Exterior", image: "https://images.unsplash.com/photo-1628611225249-6c3c7c689552?w=800", project: "Sankalp Greens" },
  { id: 5, title: "Sankalp Villas Garden", category: "Exterior", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", project: "Sankalp Villas" },
  { id: 6, title: "Clubhouse Gymnasium", category: "Amenities", image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800", project: "Sankalp Residency" },
];

export const initialHeroBanner = [
  { id: 1, title: "Build Your Dream Home", subtitle: "Luxury Living Redefined", description: "Discover premium properties crafted with excellence across Pune's finest locations.", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920", ctaText: "Explore Projects", isActive: true },
  { id: 2, title: "Nature Meets Architecture", subtitle: "Sankalp Oasis - Now Open", description: "Experience eco-friendly luxury living surrounded by lush greenery and modern amenities.", image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1920", ctaText: "Know More", isActive: true },
];
