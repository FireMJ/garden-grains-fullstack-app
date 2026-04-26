import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.slice(0, limit).map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Calculate average rating
    const allReviews = snapshot.docs.map(doc => doc.data());
    const avgRating = allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / (allReviews.length || 1);
    
    return NextResponse.json({ success: true, reviews, averageRating: avgRating, total: allReviews.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, rating, comment, orderId } = await req.json();
    
    if (!name || !rating || !comment) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const reviewsRef = collection(db, 'reviews');
    const docRef = await addDoc(reviewsRef, {
      name,
      rating,
      comment,
      orderId: orderId || null,
      verified: false,
      status: 'pending',
      createdAt: new Date().toISOString(),
      helpful: 0,
    });
    
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, action, reply } = await req.json();
    const reviewRef = doc(db, 'reviews', id);
    
    if (action === 'approve') {
      await updateDoc(reviewRef, { status: 'approved', verified: true });
    } else if (action === 'reject') {
      await updateDoc(reviewRef, { status: 'rejected' });
    } else if (action === 'reply' && reply) {
      await updateDoc(reviewRef, { 
        adminReply: reply,
        repliedAt: new Date().toISOString(),
        status: 'approved'
      });
    } else if (action === 'delete') {
      await deleteDoc(reviewRef);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update review' }, { status: 500 });
  }
}
