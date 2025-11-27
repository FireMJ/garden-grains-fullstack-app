import { User } from './types';

// In a real app, this would be a database
export const users: User[] = [
  {
    id: '1',
    email: 'admin@gardenandgrains.com',
    name: 'Garden & Grains Admin',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'staff@gardenandgrains.com',
    name: 'Kitchen Staff',
    role: 'staff',
    createdAt: new Date('2024-01-01'),
  },
];

// In a real app, use proper password hashing like bcrypt
export const validateUser = async (email: string, password: string): Promise<User | null> => {
  // For demo purposes - in production, use proper authentication
  const user = users.find(u => u.email === email);
  
  // Demo password check - replace with real authentication
  if (user && password === 'demo123') {
    return user;
  }
  
  return null;
};
