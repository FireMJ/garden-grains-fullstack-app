import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const { userId, email, name } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    // Check if user already has restaurant staff role
    const staffRef = doc(db, 'restaurant_staff', userId);
    const staffSnap = await getDoc(staffRef);
    
    if (staffSnap.exists()) {
      return NextResponse.json({ message: 'User is already restaurant staff' });
    }
    
    // Add restaurant staff role
    await setDoc(staffRef, {
      uid: userId,
      email: email || '',
      name: name || '',
      role: 'restaurant_staff',
      permissions: ['view_orders', 'update_status', 'manage_menu'],
      createdAt: new Date(),
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'User added as restaurant staff successfully' 
    });
  } catch (error) {
    console.error('Error adding restaurant staff:', error);
    return NextResponse.json({ error: 'Failed to add restaurant staff' }, { status: 500 });
  }
}
