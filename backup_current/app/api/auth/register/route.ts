import { NextRequest } from 'next/server';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return new Response(JSON.stringify({ 
        error: 'Email, password, and name are required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      phone: phone || '',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ 
      message: 'User registered successfully',
      user: { uid: user.uid, email: user.email, name }
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    // Proper error handling without 'any'
    let errorMessage = 'Registration failed';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific Firebase Auth errors
      if (errorMessage.includes('email-already-in-use')) {
        errorMessage = 'This email is already registered. Please use a different email or sign in.';
      } else if (errorMessage.includes('weak-password')) {
        errorMessage = 'Password should be at least 6 characters long.';
      } else if (errorMessage.includes('invalid-email')) {
        errorMessage = 'Please provide a valid email address.';
      } else if (errorMessage.includes('network-request-failed')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
    }
    
    console.error('Registration error:', error);
    
    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}