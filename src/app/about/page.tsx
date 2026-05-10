"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaLeaf, FaHeart, FaUsers, FaCalendarAlt, FaMapMarkerAlt, 
  FaQuoteLeft, FaInstagram, FaCamera, FaRegClock, FaStar,
  FaChevronRight, FaRegHeart, FaShareAlt, FaBookmark, FaTree,
  FaChair, FaTimes, FaCheck, FaCommentAlt, FaSortAmountDown,
  FaFilter, FaSpinner
} from "react-icons/fa";
import { GiOlive } from "react-icons/gi";
import { TbFlower } from "react-icons/tb";
import { momentService, Moment, Comment } from '@/services/momentService';

const FaOliveBranchIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7.5 3.5c-2 1.5-3 3.5-3 6 0 4 3 8 7 9 4-1 7-5 7-9 0-2.5-1-4.5-3-6" />
    <path d="M12 12c-2.5 0-5-1-5-4" />
    <path d="M12 12c2.5 0 5-1 5-4" />
    <path d="M12 12v8" />
    <circle cx="12" cy="3" r="1.5" />
    <circle cx="7.5" cy="3.5" r="1" />
    <circle cx="16.5" cy="3.5" r="1" />
  </svg>
);

type SortOption = 'newest' | 'oldest' | 'mostLiked' | 'mostCommented';

export default function AboutPage() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [filteredMoments, setFilteredMoments] = useState<Moment[]>([]);
  const [newMomentContent, setNewMomentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [authorHandle, setAuthorHandle] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const categories = [
    { id: 'all', name: 'All Moments', icon: FaStar },
    { id: 'food', name: 'Food', icon: FaLeaf },
    { id: 'garden', name: 'Garden Views', icon: TbFlower },
    { id: 'experience', name: 'Experiences', icon: FaHeart },
    { id: 'drinks', name: 'Drinks', icon: FaCommentAlt }
  ];

  useEffect(() => {
    const unsubscribe = momentService.subscribeToMoments((loadedMoments) => {
      setMoments(loadedMoments);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = [...moments];
    if (selectedCategory !== 'all') {
      result = result.filter(moment => moment.category === selectedCategory);
    }
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
    setFilteredMoments(result);
  }, [moments, sortBy, selectedCategory]);

  const handleLike = async (momentId: string, currentLiked: boolean) => {
    if (currentLiked) {
      await momentService.unlikeMoment(momentId);
    } else {
      await momentService.likeMoment(momentId);
    }
  };

  const handleShareMoment = async () => {
    if (!newMomentContent.trim() && !selectedImage) return;
    setIsSubmitting(true);
    
    await momentService.createMoment({
      author: authorName || "Garden & Grains Guest",
      authorHandle: authorHandle || "@gardenandgrains",
      content: newMomentContent,
      verified: false,
      category: 'experience',
      imageUrl: imagePreview || undefined
    });
    
    setNewMomentContent("");
    setSelectedImage(null);
    setImagePreview(null);
    setAuthorName("");
    setAuthorHandle("");
    setIsSubmitting(false);
  };

  const handleViewComments = async (moment: Moment) => {
    setSelectedMoment(moment);
    setShowComments(true);
    const unsubscribe = momentService.subscribeToComments(moment.id, (loadedComments) => {
      setComments(loadedComments);
    });
    return () => unsubscribe();
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedMoment) return;
    await momentService.addComment(selectedMoment.id, {
      author: "Guest",
      content: newComment
    });
    setNewComment("");
  };

  const stats = [
    { value: "300+", label: "Years of Heritage", icon: FaCalendarAlt, description: "Constantia's farming legacy" },
    { value: "100+", label: "Rose Varieties", icon: TbFlower, description: "Fragrant blooms" },
    { value: "50+", label: "Olive & Lemon Trees", icon: FaTree, description: "Shade and serenity" },
    { value: `${moments.length}+`, label: "Moments Shared", icon: FaStar, description: "Live community feed" },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/banners/rose_garden.jpeg" alt="Rose Garden" fill className="object-cover" priority />
            sizes="(max-width: 768px) 100vw, 50vw"
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center z-10">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                <FaOliveBranchIcon className="w-5 h-5 text-green-300" />
                <span className="text-white text-sm">A Constantia Moment</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Garden & Grains</h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto px-4">Where roses bloom, lemons ripen, and lunch lingers</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <FaQuoteLeft className="w-12 h-12 text-green-600 mx-auto mb-4 opacity-50" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">A <span className="text-green-600">Constantia Moment</span>, Grown Here</h2>
          </div>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">Constantia has been growing things for over 300 years. The soil here remembers what good food tastes like.</p>
            <p className="text-lg"><strong>Garden & Grains</strong> sits at Heritage Market on Constantia Uitsig. We're bringing lunch back to where it belongs: <strong className="text-green-600">slow, fresh, and grown close to where you eat it.</strong></p>
            <p className="text-lg">From our restaurant, you'll enjoy a magnificent view of the rose garden with <strong>over 100 rose varieties</strong>, surrounded by mature <strong>lemon and olive trees</strong>.</p>
            <div className="bg-amber-50 p-6 rounded-xl border-l-4 border-amber-500 my-8">
              <p className="text-lg italic text-gray-800">"We build our bowls with honest, local ingredients. Avo from George. Free-range chicken from Overberg. Quinoa from Karoo."</p>
            </div>
            <div className="text-center pt-6 bg-green-50 p-8 rounded-xl">
              <p className="text-xl font-semibold text-green-800">Take a seat on Garden & Grains restaurant seat. Share a bowl with a view of the majestic rose garden. This is your Constantia moment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <stat.icon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-green-800">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-800">{stat.label}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Feed Section */}
      <section className="py-16 bg-gray-50" id="moments">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <FaCamera className="text-green-600" />
              <span className="text-green-700 text-sm font-medium">Live Feed</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Live <span className="text-green-600">#ConstantiaMoment</span> Feed</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Real-time moments shared by our community. Share yours below!</p>
          </div>

          {/* Share Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Your Constantia Moment</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
                <input type="text" placeholder="Instagram Handle (optional)" value={authorHandle} onChange={(e) => setAuthorHandle(e.target.value)} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <textarea placeholder="Share your #ConstantiaMoment..." value={newMomentContent} onChange={(e) => setNewMomentContent(e.target.value)} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
              <div className="flex items-center gap-4 flex-wrap">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition flex items-center gap-2">
                  <FaCamera /> <span>Add Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedImage(file);
                      const reader = new FileReader();
                      reader.onloadend = () => setImagePreview(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>
                {imagePreview && <img src={imagePreview} alt="Preview" className="h-12 w-12 object-cover rounded" />}
                <button onClick={handleShareMoment} disabled={isSubmitting || (!newMomentContent.trim() && !selectedImage)} className={`ml-auto px-6 py-2 rounded-lg transition flex items-center gap-2 ${isSubmitting || (!newMomentContent.trim() && !selectedImage) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                  {isSubmitting ? <><FaSpinner className="animate-spin" /> Sharing...</> : <><FaShareAlt /> Share Moment</>}
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex gap-2">
              <div className="relative">
                <button onClick={() => setShowFilterMenu(!showFilterMenu)} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                  <FaFilter /> <span className="text-sm">Filter</span>
                </button>
                {showFilterMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-20 min-w-[150px]">
                    {categories.map(cat => (
                      <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setShowFilterMenu(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 ${selectedCategory === cat.id ? 'bg-green-50 text-green-600' : ''}`}>
                        <cat.icon /> <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button onClick={() => setShowSortMenu(!showSortMenu)} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                  <FaSortAmountDown /> <span className="text-sm">Sort</span>
                </button>
                {showSortMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-20 min-w-[150px]">
                    <button onClick={() => { setSortBy('newest'); setShowSortMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Newest First</button>
                    <button onClick={() => { setSortBy('oldest'); setShowSortMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Oldest First</button>
                    <button onClick={() => { setSortBy('mostLiked'); setShowSortMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Most Liked</button>
                    <button onClick={() => { setSortBy('mostCommented'); setShowSortMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Most Discussed</button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500">{filteredMoments.length} live moments</p>
          </div>

          {/* Moments Feed */}
          {isLoading ? (
            <div className="text-center py-12"><FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" /><p>Loading moments...</p></div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {filteredMoments.map((moment) => (
                  <motion.div key={moment.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{moment.author}</span>
                          {moment.verified && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1"><FaCheck size={10} /> Verified</span>}
                          <span className="text-xs text-gray-400">{moment.authorHandle}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{moment.category}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1"><FaRegClock className="text-xs text-gray-400" /><span className="text-xs text-gray-400">{moment.date instanceof Date ? moment.date.toLocaleDateString() : 'Just now'}</span></div>
                      </div>
                      <button className="text-gray-400 hover:text-green-600"><FaBookmark /></button>
                    </div>
                    <p className="text-gray-700 mb-3">{moment.content}</p>
                    <p className="text-sm text-green-600 mb-3">#ConstantiaMoment #GardenAndGrains</p>
                    {moment.imageUrl && <img src={moment.imageUrl} alt="Moment" className="w-full h-64 object-cover rounded-lg mb-3" />}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <button onClick={() => handleLike(moment.id, moment.userLiked || false)} className={`flex items-center gap-2 transition ${moment.userLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
                        <FaRegHeart /> <span>{moment.likes}</span>
                      </button>
                      <button onClick={() => handleViewComments(moment)} className="flex items-center gap-2 hover:text-green-600 transition">
                        <FaCommentAlt /> <span>{moment.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-blue-600 transition"><FaShareAlt /> Share</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Comments Modal */}
      {showComments && selectedMoment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowComments(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b">
              <div className="flex justify-between items-center"><h3 className="text-xl font-bold">Comments</h3><button onClick={() => setShowComments(false)} className="text-gray-500 hover:text-gray-700"><FaTimes /></button></div>
              <p className="text-sm text-gray-500 mt-1">{selectedMoment.content}</p>
            </div>
            <div className="p-6 overflow-y-auto max-h-[400px] space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="border-b pb-3"><span className="font-semibold text-sm">{comment.author}</span><p className="text-gray-700 mt-1">{comment.content}</p></div>
              ))}
            </div>
            <div className="p-6 border-t">
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className="w-full px-4 py-2 border rounded-lg" rows={2} />
              <div className="flex justify-end mt-2"><button onClick={handleAddComment} disabled={!newComment.trim()} className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50">Post Comment</button></div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Sections */}
      <section className="py-16 bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="container mx-auto px-4 text-center">
          <FaInstagram className="w-12 h-12 text-pink-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Share Your <span className="text-pink-600">#ConstantiaMoment</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">Tag <strong className="text-green-600">@gardenandgrains</strong> and use <strong className="text-green-600">#ConstantiaMoment</strong></p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://instagram.com/gardenandgrains" target="_blank" className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-3 rounded-lg hover:scale-105 transition font-semibold inline-flex items-center gap-2"><FaInstagram /> Follow on Instagram</a>
            <Link href="/menu" className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold inline-flex items-center gap-2">View Our Menu <FaChevronRight /></Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Us at <span className="text-green-600">Heritage Market</span></h2>
              <div className="w-20 h-1 bg-green-600 mb-6" />
              <div className="space-y-4">
                <div className="flex gap-3"><FaMapMarkerAlt className="text-green-600 mt-1" /><div><p className="font-semibold">Heritage Market, Constantia Uitsig</p><p className="text-gray-600">Spaanschemat River Rd, Fir Grove, Cape Town, 7806</p></div></div>
                <div className="flex gap-3"><FaRegClock className="text-green-600 mt-1" /><div><p className="font-semibold">Opening Hours</p><p className="text-gray-600">Sun-Wed: 9am-5:30pm • Thu-Sat: 9am-9pm</p><p className="text-gray-500 text-sm">Closed daily 4pm-5pm for dinner prep</p></div></div>
              </div>
              <div className="mt-6 flex gap-3">
                <a href="https://maps.google.com/?q=Uitsig+Wine+Farm" target="_blank" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">Get Directions</a>
                <Link href="/reserve" className="border-2 border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition">Reserve a Table</Link>
              </div>
            </div>
            <div className="h-80 rounded-xl overflow-hidden shadow-lg relative">
              <Image src="/images/banners/rose_garden.jpeg" alt="Rose Garden" fill className="object-cover" />
            sizes="(max-width: 768px) 100vw, 50vw"
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
          <p className="text-green-100 mb-8">Be the first to know about seasonal menus, rose garden events, and Constantia moments.</p>
          <div className="flex max-w-md mx-auto gap-3"><input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded-lg text-gray-900" /><button className="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-lg font-semibold transition">Subscribe</button></div>
        </div>
      </section>
    </main>
  );
}
