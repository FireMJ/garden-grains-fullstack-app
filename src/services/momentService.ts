import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  increment,
  where,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';

export interface Moment {
  id: string;
  author: string;
  authorHandle: string;
  content: string;
  likes: number;
  comments: number;
  date: Date | Timestamp;
  verified: boolean;
  category: string;
  imageUrl?: string;
  userId?: string;
  userLiked?: boolean;
}

export interface Comment {
  id: string;
  momentId: string;
  author: string;
  content: string;
  date: Date | Timestamp;
  likes: number;
}

class MomentService {
  private momentsCollection = collection(db, 'moments');
  private commentsCollection = collection(db, 'comments');

  // Create a new moment
  async createMoment(moment: Omit<Moment, 'id' | 'date' | 'likes' | 'comments'>): Promise<string> {
    try {
      const docRef = await addDoc(this.momentsCollection, {
        ...moment,
        likes: 0,
        comments: 0,
        date: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating moment:', error);
      throw error;
    }
  }

  // Get all moments with real-time listener
  subscribeToMoments(callback: (moments: Moment[]) => void, limit_count: number = 50) {
    const q = query(
      this.momentsCollection, 
      orderBy('date', 'desc'),
      limit(limit_count)
    );
    
    return onSnapshot(q, (snapshot) => {
      const moments = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate?.() || new Date(),
          userLiked: false
        } as Moment;
      });
      callback(moments);
    });
  }

  // Like a moment
  async likeMoment(momentId: string): Promise<void> {
    const momentRef = doc(this.momentsCollection, momentId);
    await updateDoc(momentRef, {
      likes: increment(1)
    });
  }

  // Unlike a moment
  async unlikeMoment(momentId: string): Promise<void> {
    const momentRef = doc(this.momentsCollection, momentId);
    await updateDoc(momentRef, {
      likes: increment(-1)
    });
  }

  // Add a comment to a moment
  async addComment(momentId: string, comment: Omit<Comment, 'id' | 'date' | 'likes'>): Promise<string> {
    try {
      const docRef = await addDoc(this.commentsCollection, {
        ...comment,
        momentId,
        likes: 0,
        date: serverTimestamp()
      });
      
      // Update comment count on moment
      const momentRef = doc(this.momentsCollection, momentId);
      await updateDoc(momentRef, {
        comments: increment(1)
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Get comments for a moment
  subscribeToComments(momentId: string, callback: (comments: Comment[]) => void) {
    const q = query(
      this.commentsCollection,
      where('momentId', '==', momentId),
      orderBy('date', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate?.() || new Date()
        } as Comment;
      });
      callback(comments);
    });
  }

  // Like a comment
  async likeComment(commentId: string): Promise<void> {
    const commentRef = doc(this.commentsCollection, commentId);
    await updateDoc(commentRef, {
      likes: increment(1)
    });
  }
}

export const momentService = new MomentService();
