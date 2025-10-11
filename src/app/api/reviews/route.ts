import { NextRequest, NextResponse } from 'next/server';

// Mock data for testing
const mockReviews = {
  'juice-1': [
    { 
      id: '1', 
      author: 'John D.', 
      rating: 5, 
      comment: 'Amazing juice! So fresh and healthy.', 
      createdAt: '2024-01-15T10:30:00Z' 
    },
    { 
      id: '2', 
      author: 'Sarah M.', 
      rating: 4, 
      comment: 'Very refreshing, will order again!', 
      createdAt: '2024-01-10T14:20:00Z' 
    },
    { 
      id: '3', 
      author: 'Mike T.', 
      rating: 5, 
      comment: 'Best green juice I have ever tasted!', 
      createdAt: '2024-01-08T09:15:00Z' 
    },
  ],
  'juice-2': [
    { 
      id: '4', 
      author: 'Lisa K.', 
      rating: 5, 
      comment: 'Perfect ginger shot - strong and effective!', 
      createdAt: '2024-01-12T16:45:00Z' 
    },
  ],
  'juice-3': [
    { 
      id: '5', 
      author: 'David P.', 
      rating: 4, 
      comment: 'Love the fruit punch, very tropical!', 
      createdAt: '2024-01-14T11:20:00Z' 
    },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const take = parseInt(searchParams.get('take') || '10');

    console.log('API Called with:', { itemId, take });

    if (!itemId) {
      return NextResponse.json(
        { error: 'itemId parameter is required' },
        { status: 400 }
      );
    }

    // Get reviews for this item or return empty array
    const reviews = mockReviews[itemId as keyof typeof mockReviews] || [];
    
    // Limit the number of reviews returned
    const limitedReviews = reviews.slice(0, take);

    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    return NextResponse.json({
      reviews: limitedReviews,
      total: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10 // Round to 1 decimal
    });

  } catch (error) {
    console.error('Error in reviews API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: POST method for submitting reviews
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, rating, comment, author = 'Anonymous' } = body;

    // Validate required fields
    if (!itemId || !rating) {
      return NextResponse.json(
        { error: 'itemId and rating are required' },
        { status: 400 }
      );
    }

    // Create new review (in real app, save to database)
    const newReview = {
      id: Date.now().toString(),
      itemId,
      rating: parseInt(rating),
      comment,
      author,
      createdAt: new Date().toISOString(),
    };

    console.log('New review submitted:', newReview);

    return NextResponse.json(newReview, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}