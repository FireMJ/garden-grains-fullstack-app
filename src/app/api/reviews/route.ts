import { NextRequest } from 'next/server';
import { collection, addDoc, getDocs, query, orderBy, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

// GET - Fetch all reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const menuItemId = searchParams.get('menuItemId');
    const limit = searchParams.get('limit');

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

    // Apply limit if specified
    if (limit) {
      reviews = reviews.slice(0, parseInt(limit));
    }

    return new Response(JSON.stringify({ 
      reviews 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Error fetching reviews:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to fetch reviews';

    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), {
      status: 500,
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
      }
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
      error: errorMessage 
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
      message: `Review ${status} successfully` 
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
      error: errorMessage 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}