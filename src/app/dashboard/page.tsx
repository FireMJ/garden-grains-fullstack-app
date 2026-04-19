'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaStar, FaShoppingBag, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHistory } from 'react-icons/fa';

interface Order {
  id: string;
  orderNumber: string;
  amount: number;
  status: string;
  date: string;
  items: any[];
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  itemName: string;
}

export default function DashboardPage() {
  const { user, updateUserProfile } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    averageRating: 0,
    memberSince: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setDisplayName(user.displayName || '');
    setPhoneNumber(user.phoneNumber || '');
    loadUserData();
  }, [user, router]);

  const loadUserData = () => {
    // Load orders from localStorage
    const ordersStr = localStorage.getItem('orders');
    const userOrders = ordersStr ? JSON.parse(ordersStr) : [];
    setOrders(userOrders.slice(0, 5));
    
    // Calculate stats
    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
    
    setStats({
      totalOrders,
      totalSpent,
      averageRating: 4.8,
      memberSince: user?.metadata?.creationTime 
        ? new Date(user.metadata.creationTime).toLocaleDateString() 
        : '2024',
    });
    
    // Mock reviews (replace with actual data later)
    setReviews([
      { id: '1', rating: 5, comment: 'Great food!', date: '2024-03-15', itemName: 'Creamy Butternut Soup' },
      { id: '2', rating: 4, comment: 'Delicious bowl', date: '2024-03-10', itemName: 'Smoky Chipotle Bowl' },
    ]);
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      await updateUserProfile(displayName);
      if (phoneNumber) {
        localStorage.setItem(`user_phone_${user?.uid}`, phoneNumber);
      }
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <FaUser className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="text-xl font-bold border rounded px-2 py-1"
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-gray-900">{displayName || 'User'}</h2>
                  )}
                  <p className="text-sm text-gray-500">Member since {stats.memberSince}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <FaEnvelope className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaPhone className="w-4 h-4" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Phone number"
                      className="flex-1 border rounded px-2 py-1 text-sm"
                    />
                  </div>
                ) : (
                  phoneNumber && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaPhone className="w-4 h-4" />
                      <span>{phoneNumber}</span>
                    </div>
                  )
                )}
              </div>
              
              <div className="mt-6 flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <FaShoppingBag className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
                <div className="text-xs text-gray-500">Total Orders</div>
              </div>
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <FaStar className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.averageRating}</div>
                <div className="text-xs text-gray-500">Avg Rating</div>
              </div>
            </div>
          </div>
          
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <Link href="/orders" className="text-sm text-green-600 hover:underline">View All →</Link>
              </div>
              
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No orders yet</p>
                  <Link href="/menu" className="text-green-600 hover:underline mt-2 inline-block">
                    Start Shopping →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-mono text-sm text-gray-600">{order.orderNumber}</p>
                          <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">R{order.amount?.toFixed(2) || '0.00'}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                            {order.status || 'Completed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Recent Reviews */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Reviews</h2>
                <Link href="/reviews" className="text-sm text-green-600 hover:underline">Write a Review →</Link>
              </div>
              
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaStar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{review.itemName}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                        </div>
                        <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Link href="/profile/addresses" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-lg transition">
            <FaMapMarkerAlt className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium">Addresses</span>
          </Link>
          <Link href="/orders" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-lg transition">
            <FaHistory className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium">Order History</span>
          </Link>
          <Link href="/profile/notifications" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-lg transition">
            <FaCalendarAlt className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium">Notifications</span>
          </Link>
          <Link href="/reserve" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-lg transition">
            <FaStar className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium">Write Review</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
