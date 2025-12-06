import { NextRequest } from 'next/server';
import { collection, addDoc, getDocs, query, orderBy, where, doc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseAvailable } from '@/lib/firebase';

interface ReviewData {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  status?: 'pending' | 'approved' | 'rejected';
  menuItemId?: string;
  menuItemName?: string;
  adminNotes?: string;
}

interface CreateReviewRequest {
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  menuItemId?: string;
  menuItemName?: string;
}

// Mock reviews for demo mode
const MOCK_REVIEWS: ReviewData[] = [
  {
    id: 'mock-1',
    userId: 'user-123',
    userName: 'Sarah M.',
    userEmail: 'sarah@example.com',
    rating: 5,
    comment: 'The best healthy bowls in town! Fresh ingredients and amazing flavors.',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    status: 'approved',
    menuItemId: 'beef-glow-bowl',
    menuItemName: 'Beef Glow Bowl'
  },
  {
    id: 'mock-2',
    userId: 'user-456',
    userName: 'John D.',
    userEmail: 'john@example.com',
    rating: 4,
    comment: 'Great food and fast delivery. Will definitely order again!',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    status: 'approved',
    menuItemId: 'chicken-power-bowl',
    menuItemName: 'Chicken Power Bowl'
  },
  {
    id: 'mock-3',
    userId: 'user-789',
    userName: 'Emily R.',
    userEmail: 'emily@example.com',
    rating: 5,
    comment: 'Love the customization options. Perfect for my dietary needs.',
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
    status: 'approved',
    menuItemId: 'veggie-delight-bowl',
    menuItemName: 'Veggie Delight Bowl'
  },
  {
    id: 'mock-4',
    userId: 'user-101',
    userName: 'Michael T.',
    userEmail: 'michael@example.com',
    rating: 4,
    comment: 'Quality ingredients and generous portions. Very satisfied!',
    createdAt: '2024-01-01T11:45:00Z',
    updatedAt: '2024-01-01T11:45:00Z',
    status: 'approved'
  },
  {
    id: 'mock-5',
    userId: 'user-202',
    userName: 'Jessica L.',
    userEmail: 'jessica@example.com',
    rating: 5,
    comment: 'The glow bowls are amazing! My skin has never looked better.',
    createdAt: '2023-12-28T16:30:00Z',
    updatedAt: '2023-12-28T16:30:00Z',
    status: 'approved',
    menuItemId: 'beef-glow-bowl',
    menuItemName: 'Beef Glow Bowl'
  },
  {
    id: 'mock-6',
    userId: 'user-303',
    userName: 'David K.',
    userEmail: 'david@example.com',
    rating: 5,
    comment: 'Excellent customer service and delicious food. Highly recommended!',
    createdAt: '2023-12-20T13:10:00Z',
    updatedAt: '2023-12-20T13:10:00Z',
    status: 'approved'
  }
];

// GET - Fetch all reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'approved';
    const menuItemId = searchParams.get('menuItemId');
    const limit = searchParams.get('limit');

    // Check if Firebase is available
    if (!isFirebaseAvailable()) {
      console.log('Firebase not available, returning mock reviews');
      
      let reviews = MOCK_REVIEWS;
      
      // Apply filters to mock data
      if (status) {
        reviews = reviews.filter(review => review.status === status);
      }
      
      if (menuItemId) {
        reviews = reviews.filter(review => review.menuItemId === menuItemId);
      }
      
      // Apply limit if specified
      if (limit) {
        reviews = reviews.slice(0, parseInt(limit));
      }
      
      return new Response(JSON.stringify({
        reviews,
        source: 'mock-data',
        message: 'Using mock data (Firebase not configured)'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Firebase is available - fetch real data
    let reviewsQuery = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));

    // Apply filters if provided
    if (status) {
      reviewsQuery = query(reviewsQuery, where('status', '==', status));
    }

    if (menuItemId) {
      reviewsQuery = query(reviewsQuery, where('menuItemId', '==', menuItemId));
    }

    const reviewsSnapshot = await getDocs(reviewsQuery);
    let reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ReviewData[];

    // If no reviews in Firebase, return mock data
    if (reviews.length === 0) {
      reviews = MOCK_REVIEWS;
    }

    // Apply limit if specified
    if (limit) {
      reviews = reviews.slice(0, parseInt(limit));
    }

    return new Response(JSON.stringify({
      reviews,
      source: 'firebase'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Error fetching reviews:', error);

    // Return mock data on error
    return new Response(JSON.stringify({
      reviews: MOCK_REVIEWS,
      source: 'mock-data-fallback',
      error: error instanceof Error ? error.message : 'Failed to fetch reviews'
    }), {
      status: 200, // Still return 200 with mock data
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body: CreateReviewRequest = await request.json();
    const { userId, userName, userEmail, rating, comment, menuItemId, menuItemName } = body;

    // Validate required fields
    if (!userId || !userName || !userEmail || !rating || !comment) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: userId, userName, userEmail, rating, and comment are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return new Response(JSON.stringify({
        error: 'Rating must be between 1 and 5'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if Firebase is available
    if (!isFirebaseAvailable()) {
      // Return success with mock ID in demo mode
      const mockReview: ReviewData = {
        id: `mock-${Date.now()}`,
        userId,
        userName,
        userEmail,
        rating,
        comment,
        menuItemId: menuItemId || '',
        menuItemName: menuItemName || '',
        status: 'approved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return new Response(JSON.stringify({
        message: 'Review submitted successfully (demo mode)',
        reviewId: mockReview.id,
        review: mockReview,
        source: 'mock-data'
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user has already reviewed this menu item (if menuItemId is provided)
    if (menuItemId) {
      const existingReviewQuery = query(
        collection(db, 'reviews'),
        where('userId', '==', userId),
        where('menuItemId', '==', menuItemId)
      );

      const existingReviewSnapshot = await getDocs(existingReviewQuery);
      if (!existingReviewSnapshot.empty) {
        return new Response(JSON.stringify({
          error: 'You have already reviewed this menu item'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    const reviewData: Omit<ReviewData, 'id'> = {
      userId,
      userName,
      userEmail,
      rating,
      comment,
      menuItemId: menuItemId || '',
      menuItemName: menuItemName || '',
      status: 'pending', // Default status, can be approved by admin
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add review to Firestore
    const docRef = await addDoc(collection(db, 'reviews'), reviewData);

    return new Response(JSON.stringify({
      message: 'Review submitted successfully',
      reviewId: docRef.id,
      review: {
        id: docRef.id,
        ...reviewData
      },
      source: 'firebase'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Error creating review:', error);

    const errorMessage = error instanceof Error
      ? error.message
      : 'Failed to create review';

    return new Response(JSON.stringify({
      error: errorMessage,
      source: 'error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT - Update review status (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, status, adminNotes } = body;

    if (!reviewId || !status) {
      return new Response(JSON.stringify({
        error: 'Review ID and status are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({
        error: `Status must be one of: ${validStatuses.join(', ')}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if Firebase is available
    if (!isFirebaseAvailable()) {
      return new Response(JSON.stringify({
        message: `Review ${status} successfully (demo mode)`,
        source: 'mock-data'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const reviewRef = doc(db, 'reviews', reviewId);
    const updateData: Partial<ReviewData> = {
      status: status as 'pending' | 'approved' | 'rejected',
      updatedAt: new Date().toISOString()
    };

    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    await updateDoc(reviewRef, updateData);

    return new Response(JSON.stringify({
      message: `Review ${status} successfully`,
      source: 'firebase'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Error updating review:', error);

    const errorMessage = error instanceof Error
      ? error.message
      : 'Failed to update review';

    return new Response(JSON.stringify({
      error: errorMessage,
      source: 'error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
