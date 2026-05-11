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
  imageUrl?: string | null;
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

  async createMoment(moment: Omit<Moment, 'id' | 'date' | 'likes' | 'comments'>): Promise<string> {
    try {
      const cleanMoment: any = {
        author: moment.author,
        authorHandle: moment.authorHandle,
        content: moment.content,
        likes: 0,
        comments: 0,
        date: serverTimestamp(),
        verified: moment.verified || false,
        category: moment.category || 'experience',
      };
      
      if (moment.imageUrl && moment.imageUrl !== 'undefined') {
        cleanMoment.imageUrl = moment.imageUrl;
      }
      
      const docRef = await addDoc(this.momentsCollection, cleanMoment);
      return docRef.id;
    } catch (error) {
      console.error('Error creating moment:', error);
      throw error;
    }
  }

  subscribeToMoments(callback: (moments: Moment[]) => void, limit_count: number = 50) {
    const q = query(this.momentsCollection, orderBy('date', 'desc'), limit(limit_count));
    
    return onSnapshot(q, 
      (snapshot) => {
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
      },
      (error) => {
        console.error('Error fetching moments:', error);
        callback([]);
      }
    );
  }

  async likeMoment(momentId: string): Promise<void> {
    try {
      const momentRef = doc(this.momentsCollection, momentId);
      await updateDoc(momentRef, { likes: increment(1) });
    } catch (error) {
      console.error('Error liking moment:', error);
    }
  }

  async unlikeMoment(momentId: string): Promise<void> {
    try {
      const momentRef = doc(this.momentsCollection, momentId);
      await updateDoc(momentRef, { likes: increment(-1) });
    } catch (error) {
      console.error('Error unliking moment:', error);
    }
  }

  async addComment(momentId: string, comment: Omit<Comment, 'id' | 'date' | 'likes'>): Promise<string> {
    try {
      const docRef = await addDoc(this.commentsCollection, {
        ...comment,
        momentId,
        likes: 0,
        date: serverTimestamp()
      });
      
      const momentRef = doc(this.momentsCollection, momentId);
      await updateDoc(momentRef, { comments: increment(1) });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  subscribeToComments(momentId: string, callback: (comments: Comment[]) => void) {
    const q = query(this.commentsCollection, where('momentId', '==', momentId), orderBy('date', 'asc'));
    
    return onSnapshot(q, 
      (snapshot) => {
        const comments = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date?.toDate?.() || new Date()
          } as Comment;
        });
        callback(comments);
      },
      (error) => {
        console.error('Error fetching comments:', error);
        callback([]);
      }
    );
  }

  async likeComment(commentId: string): Promise<void> {
    try {
      const commentRef = doc(this.commentsCollection, commentId);
      await updateDoc(commentRef, { likes: increment(1) });
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  }
}

export const momentService = new MomentService();
