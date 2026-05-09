"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaLeaf, 
  FaHeart, 
  FaUsers, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaQuoteLeft,
  FaInstagram,
  FaCamera,
  FaRegClock,
  FaStar,
  FaChevronRight,
  FaRegHeart,
  FaShareAlt,
  FaBookmark,
  FaTree,
  FaChair,
  FaTimes,
  FaCheck,
  FaCommentAlt,
  FaSortAmountDown,
  FaFilter
} from "react-icons/fa";
import { GiOlive } from "react-icons/gi";
import { TbFlower } from "react-icons/tb";

// Custom Olive Branch Icon
const FaOliveBranchIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.5 3.5c-2 1.5-3 3.5-3 6 0 4 3 8 7 9 4-1 7-5 7-9 0-2.5-1-4.5-3-6" />
    <path d="M12 12c-2.5 0-5-1-5-4" />
    <path d="M12 12c2.5 0 5-1 5-4" />
    <path d="M12 12v8" />
    <circle cx="12" cy="3" r="1.5" />
    <circle cx="7.5" cy="3.5" r="1" />
    <circle cx="16.5" cy="3.5" r="1" />
  </svg>
);

// Types for blog posts
interface BlogPost {
  id: number;
  author: string;
  authorHandle: string;
  content: string;
  likes: number;
  comments: number;
  date: string;
  verified: boolean;
  image?: string;
  userLiked?: boolean;
  category?: 'food' | 'garden' | 'experience' | 'drinks';
}

// Sort options
type SortOption = 'newest' | 'oldest' | 'mostLiked' | 'mostCommented';

// Generate random dates in March and April 2026
const getRandomMarchAprilDate = (index: number) => {
  const months = ['March', 'April'];
  const month = months[index % 2];
  const day = Math.floor(Math.random() * 28) + 1;
  return `${month} ${day}, 2026`;
};

// Sample initial blog posts with March and April 2026 dates
const initialBlogPosts: BlogPost[] = [
  {
    id: 1,
    author: "Sarah Johnson",
    authorHandle: "@sarah_eats_cpt",
    content: "The most peaceful lunch spot in Constantia! Sat at Garden & Grains with the most incredible view of the rose garden. The Power Bowl was absolutely incredible. 🌹✨",
    likes: 47,
    comments: 12,
    date: "March 28, 2026",
    verified: true,
    userLiked: false,
    category: 'food'
  },
  {
    id: 2,
    author: "Michael Chen",
    authorHandle: "@michael_foodie",
    content: "Found my new happy place! The rose garden view from the restaurant is spectacular, and the olive trees provide the perfect backdrop. Highly recommend the Smoky Chipotle Chicken Bowl. 🌿🔥",
    likes: 89,
    comments: 23,
    date: "March 25, 2026",
    verified: false,
    userLiked: false,
    category: 'food'
  },
  {
    id: 3,
    author: "Lisa Van der Merwe",
    authorHandle: "@lisavdm",
    content: "This is what Sunday lunch should look like. Great food, beautiful rose garden view, amazing company. Garden & Grains, you've created something special. ❤️🌹",
    likes: 156,
    comments: 34,
    date: "April 15, 2026",
    verified: true,
    userLiked: false,
    category: 'experience'
  },
  {
    id: 4,
    author: "David Williams",
    authorHandle: "@david_ct_foodie",
    content: "That view though! Sitting at Garden & Grains, looking out at the rose garden while enjoying their famous Harvest Bowl. Perfect way to spend an autumn afternoon. 🍂🌹",
    likes: 234,
    comments: 45,
    date: "April 10, 2026",
    verified: false,
    userLiked: false,
    category: 'garden'
  },
  {
    id: 5,
    author: "Emma Thompson",
    authorHandle: "@emma_thompson",
    content: "Finally made it to Garden & Grains! The rose garden view did not disappoint. The High Protein Breakfast Bowl was exactly what I needed. Will definitely be back! 💪🌹",
    likes: 178,
    comments: 28,
    date: "April 5, 2026",
    verified: true,
    userLiked: false,
    category: 'food'
  },
  {
    id: 6,
    author: "James Wilson",
    authorHandle: "@james_wine_lover",
    content: "Their fresh juices are incredible! Had the GLOW juice with my lunch while enjoying the rose garden. Perfect pairing! 🥤🌹",
    likes: 67,
    comments: 9,
    date: "March 20, 2026",
    verified: false,
    userLiked: false,
    category: 'drinks'
  }
];

export default function AboutPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [authorHandle, setAuthorHandle] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Moments', icon: FaStar },
    { id: 'food', name: 'Food', icon: FaLeaf },
    { id: 'garden', name: 'Garden Views', icon: TbFlower },
    { id: 'experience', name: 'Experiences', icon: FaHeart },
    { id: 'drinks', name: 'Drinks', icon: FaCommentAlt }
  ];

  // Sort and filter posts
  useEffect(() => {
    let result = [...blogPosts];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(post => post.category === selectedCategory);
    }
    
    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'mostLiked':
        result.sort((a, b) => b.likes - a.likes);
        break;
      case 'mostCommented':
        result.sort((a, b) => b.comments - a.comments);
        break;
    }
    
    setFilteredPosts(result);
  }, [blogPosts, sortBy, selectedCategory]);

  // Handle like functionality
  const handleLike = (postId: number) => {
    setBlogPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.userLiked ? post.likes - 1 : post.likes + 1,
            userLiked: !post.userLiked 
          }
        : post
    ));
  };

  // Handle share moment
  const handleShareMoment = async () => {
    if (!newPostContent.trim() && !selectedImage) return;
    
    setIsSubmitting(true);
    
    // Get current month (March or April based on date)
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June'];
    const currentMonth = monthNames[month - 1];
    
    const newPost: BlogPost = {
      id: blogPosts.length + 1,
      author: authorName || "Garden & Grains Guest",
      authorHandle: authorHandle || "@gardenandgrains",
      content: newPostContent + " #ConstantiaMoment",
      likes: 0,
      comments: 0,
      date: `${currentMonth} ${currentDate.getDate()}, 2026`,
      verified: false,
      userLiked: false,
      category: 'experience'
    };
    
    setBlogPosts([newPost, ...blogPosts]);
    setNewPostContent("");
    setSelectedImage(null);
    setImagePreview(null);
    setAuthorName("");
    setAuthorHandle("");
    setIsSubmitting(false);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate loading more posts
  const loadMorePosts = () => {
    setIsLoading(true);
    setTimeout(() => {
      const morePosts: BlogPost[] = [
        {
          id: blogPosts.length + 1,
          author: "Natalie Brown",
          authorHandle: "@natalie_brown",
          content: "The service here is amazing! Staff are so friendly and the view of the rose garden while eating is unbeatable. 🌹✨",
          likes: 45,
          comments: 8,
          date: "March 15, 2026",
          verified: false,
          userLiked: false,
          category: 'experience'
        },
        {
          id: blogPosts.length + 2,
          author: "Thomas Anderson",
          authorHandle: "@thomas_ct",
          content: "Best breakfast spot in Constantia! The Avo on Toast with the rose garden view is a match made in heaven. 🥑🌹",
          likes: 92,
          comments: 15,
          date: "April 18, 2026",
          verified: true,
          userLiked: false,
          category: 'food'
        }
      ];
      setBlogPosts([...blogPosts, ...morePosts]);
      setIsLoading(false);
    }, 1000);
  };

  const generateHashtags = () => {
    return "#ConstantiaMoment #GardenAndGrains #ConstantiaEats #RoseGarden #CapeTownFood";
  };

  const stats = [
    { value: "300+", label: "Years of Heritage", icon: FaCalendarAlt, description: "Constantia's farming legacy" },
    { value: "100+", label: "Rose Varieties", icon: TbFlower, description: "Fragrant blooms in the garden" },
    { value: "50+", label: "Olive & Lemon Trees", icon: FaTree, description: "Shade and serenity" },
    { value: "4.9", label: "Customer Rating", icon: FaStar, description: "From 1,000+ reviews" },
  ];

  const features = [
    {
      title: "Rose Garden View",
      description: "Dine with a breathtaking view of over 100 varieties of roses right in front of the restaurant.",
      icon: TbFlower,
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "Peaceful Benches",
      description: "Take a moment on our garden benches - perfect for quiet reflection.",
      icon: FaChair,
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Shade & Shelter",
      description: "Mature olive trees provide natural shade, plus heaters for cooler days.",
      icon: FaTree,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Heritage Estate",
      description: "Part of Constantia Uitsig's 300-year farming legacy.",
      icon: GiOlive,
      color: "from-purple-500 to-violet-600"
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Rose Garden Background */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/banners/rose_garden.jpeg"
            alt="Rose Garden at Garden & Grains - Beautiful rose garden in front of the restaurant"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.style.background = "linear-gradient(135deg, #1e4259 0%, #2a5568 100%)";
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                <FaOliveBranchIcon className="w-5 h-5 text-green-300" />
                <span className="text-white text-sm">A Constantia Moment</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Garden & Grains</h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto px-4">
                Where roses bloom, lemons ripen, and lunch lingers
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <FaQuoteLeft className="w-12 h-12 text-green-600 mx-auto mb-4 opacity-50" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              A <span className="text-green-600">Constantia Moment</span>, Grown Here
            </h2>
          </div>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
              Constantia has been growing things for over 300 years. First vines, then fruit, then roses. 
              The soil here remembers what good food tastes like.
            </p>
            
            <p className="text-lg">
              <strong>Garden & Grains</strong> sits in the heart of it, at Heritage Market on Constantia Uitsig. 
              We're not trying to reinvent lunch. We're trying to bring it back to where it belongs: 
              <strong className="text-green-600"> slow, fresh, and grown close to where you eat it.</strong>
            </p>

            <p className="text-lg">
              From our restaurant, you'll enjoy a magnificent view of the rose garden right in front of you. 
              With <strong>over 100 rose varieties</strong>, surrounded by mature <strong>lemon and olive trees</strong> 
              that provide natural shade and a beautiful fragrance. Wooden benches invite you to sit, breathe, 
              and enjoy the peaceful surroundings.
            </p>

            <div className="bg-amber-50 p-6 rounded-xl border-l-4 border-amber-500 my-8">
              <p className="text-lg italic text-gray-800">
                "We build our bowls with honest, local ingredients while you sit with a view of the roses. 
                Flame-grilled free-range chicken from the Overberg. Avo from George. 
                Quinoa from the Karoo. And the scent of lemon blossoms in the air."
              </p>
            </div>

            <p className="text-lg">
              Everything here moves a little slower. The wind gets caught by the trees. 
              The heaters keep the garden view enjoyable even when the southeaster rolls in. 
              <strong> You sit, you breathe, you taste what's in season.</strong>
            </p>

            <div className="text-center pt-6 bg-green-50 p-8 rounded-xl">
              <p className="text-xl font-semibold text-green-800">
                Take a seat on Garden & Grains restaurant seat. 
                Share a bowl with a view of the majestic rose garden. 
                This is your Constantia moment.
              </p>
              <p className="text-lg mt-4 text-gray-600">
                No sad desk lunches. No shortcuts. <strong>Just a Constantia moment, served daily.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <stat.icon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-green-800">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-800">{stat.label}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The <span className="text-green-600">Garden & Grains</span> Experience
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover what makes dining with a view of the roses so special
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition text-center group border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* #ConstantiaMoment Blog Section - Live Feed */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <FaCamera className="text-green-600" />
              <span className="text-green-700 text-sm font-medium">Share Your Story</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your <span className="text-green-600">#ConstantiaMoment</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Share your experience at Garden & Grains. Tag <strong className="text-green-600">#ConstantiaMoment</strong> to be featured!
            </p>
          </div>

          {/* Share Your Moment Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Your Constantia Moment</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Instagram/Twitter Handle (optional)"
                  value={authorHandle}
                  onChange={(e) => setAuthorHandle(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <textarea
                placeholder="Share your #ConstantiaMoment... What was blooming? How was the view of the rose garden?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="flex items-center gap-4 flex-wrap">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition flex items-center gap-2">
                  <FaCamera />
                  <span>Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="h-12 w-12 object-cover rounded" />
                    <button
                      onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                )}
                <button
                  onClick={handleShareMoment}
                  disabled={isSubmitting || (!newPostContent.trim() && !selectedImage)}
                  className={`ml-auto px-6 py-2 rounded-lg transition flex items-center gap-2 ${
                    isSubmitting || (!newPostContent.trim() && !selectedImage)
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSubmitting ? 'Sharing...' : 'Share Moment'}
                  <FaShareAlt />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Tip: Include <strong className="text-green-600">#ConstantiaMoment</strong> for a chance to be featured!
            </p>
          </div>

          {/* Sort and Filter Controls */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex gap-2">
              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <FaFilter className="text-gray-500" />
                  <span className="text-sm">Filter</span>
                </button>
                {showFilterMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[150px]">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition flex items-center gap-2 ${
                          selectedCategory === category.id ? 'bg-green-50 text-green-600' : ''
                        }`}
                      >
                        <category.icon className="text-sm" />
                        <span className="text-sm">{category.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Button */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <FaSortAmountDown className="text-gray-500" />
                  <span className="text-sm">Sort</span>
                </button>
                {showSortMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[150px]">
                    <button
                      onClick={() => { setSortBy('newest'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition ${sortBy === 'newest' ? 'bg-green-50 text-green-600' : ''}`}
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => { setSortBy('oldest'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition ${sortBy === 'oldest' ? 'bg-green-50 text-green-600' : ''}`}
                    >
                      Oldest First
                    </button>
                    <button
                      onClick={() => { setSortBy('mostLiked'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition ${sortBy === 'mostLiked' ? 'bg-green-50 text-green-600' : ''}`}
                    >
                      Most Liked
                    </button>
                    <button
                      onClick={() => { setSortBy('mostCommented'); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition ${sortBy === 'mostCommented' ? 'bg-green-50 text-green-600' : ''}`}
                    >
                      Most Discussed
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500">{filteredPosts.length} stories shared</p>
          </div>

          {/* Live Blog Posts Feed */}
          <div className="space-y-6">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">{post.author}</span>
                        {post.verified && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <FaCheck size={10} /> Verified Customer
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{post.authorHandle}</span>
                        {post.category && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {post.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <FaRegClock className="text-xs text-gray-400" />
                        <span className="text-xs text-gray-400">{post.date}</span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-green-600 transition">
                      <FaBookmark />
                    </button>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  <p className="text-sm text-green-600 mb-3">{generateHashtags()}</p>
                  
                  {post.image && !imageErrors[post.id] && (
                    <div className="relative h-64 rounded-lg overflow-hidden mb-3">
                      <Image 
                        src={post.image} 
                        alt="Constantia Moment" 
                        fill 
                        className="object-cover"
                        onError={() => setImageErrors(prev => ({ ...prev, [post.id]: true }))}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 transition ${post.userLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                    >
                      <FaRegHeart className={post.userLiked ? 'fill-red-500 text-red-500' : ''} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-green-600 transition">
                      <FaCommentAlt />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-blue-600 transition">
                      <FaShareAlt />
                      <span>Share</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Load More Button */}
            {filteredPosts.length < blogPosts.length && (
              <div className="text-center pt-4">
                <button
                  onClick={loadMorePosts}
                  disabled={isLoading}
                  className="px-6 py-2 bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Load More Moments'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Instagram Callout */}
      <section className="py-16 bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="container mx-auto px-4 text-center">
          <FaInstagram className="w-12 h-12 text-pink-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Share Your <span className="text-pink-600">#ConstantiaMoment</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join our community. Share your meal, your view of the rose garden, your peaceful moment.
            Tag <strong className="text-green-600">@gardenandgrains</strong> and use <strong className="text-green-600">#ConstantiaMoment</strong>
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://instagram.com/gardenandgrains"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-3 rounded-lg hover:scale-105 transition font-semibold inline-flex items-center gap-2"
            >
              <FaInstagram />
              Follow on Instagram
            </a>
            <Link
              href="/menu"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold inline-flex items-center gap-2"
            >
              View Our Menu
              <FaChevronRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Visit Us at <span className="text-green-600">Heritage Market</span>
              </h2>
              <div className="w-20 h-1 bg-green-600 mb-6" />
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Heritage Market, Constantia Uitsig</p>
                    <p className="text-gray-600">Spaanschemat River Rd, Fir Grove</p>
                    <p className="text-gray-600">Cape Town, 7806</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaRegClock className="text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Opening Hours</p>
                    <p className="text-gray-600">Sunday - Wednesday: 9:00 AM - 5:30 PM</p>
                    <p className="text-gray-600">Thursday - Saturday: 9:00 AM - 9:00 PM</p>
                    <p className="text-gray-500 text-sm mt-1">Closed daily 4:00 PM - 5:00 PM for dinner prep</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaLeaf className="text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Fresh Ingredients</p>
                    <p className="text-gray-600">Avo from George • Free-range chicken from Overberg • Quinoa from Karoo</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <a
                  href="https://maps.google.com/?q=Uitsig+Wine+Farm+Spaanschemat+River+Rd+Fir+Grove+Cape+Town"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Get Directions
                </a>
                <Link
                  href="/reserve"
                  className="border-2 border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition"
                >
                  Reserve a Table
                </Link>
              </div>
            </div>
            
            <div className="h-80 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center relative">
              <Image
                src="/images/banners/rose_garden.jpeg"
                alt="Rose Garden view from Garden & Grains"
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white">
                  <FaMapMarkerAlt className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Heritage Market</p>
                  <p className="text-sm">Constantia Uitsig, Cape Town</p>
                  <a 
                    href="https://maps.google.com/?q=Uitsig+Wine+Farm+Spaanschemat+River+Rd+Fir+Grove+Cape+Town"
                    target="_blank"
                    className="text-white text-sm mt-2 inline-block hover:underline bg-black/50 px-3 py-1 rounded-full"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Be the first to know about seasonal menus, rose garden events, and Constantia moments.
          </p>
          <div className="flex max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <button className="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-lg font-semibold transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
