import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User } from '@/types';
import { router } from 'expo-router';

// Mock user data for demo purposes
const mockUsers = [
  {
    id: '1',
    email: 'NNT@gmail.com',
    password: '30042003',
    name: 'NNT',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find user (in a real app, this would be an API call)
          const user = mockUsers.find(
            u => u.email === email && u.password === password
          );
          
          if (!user) {
            throw new Error('Email hoặc mật khẩu sai. Vui lòng nhặp lại');
          }
          
          // Remove password from user object before storing
          const { password: _, ...userWithoutPassword } = user;
          
          set({
            user: userWithoutPassword as User,
            isAuthenticated: true,
            isLoading: false,
          });
          
          router.replace('/(tabs)');
        } catch (error: any) {
          set({
            error: error.message || 'Failed to login',
            isLoading: false,
          });
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user already exists
          const existingUser = mockUsers.find(u => u.email === email);
          
          if (existingUser) {
            throw new Error('User with this email already exists');
          }
          
          // Create new user (in a real app, this would be an API call)
          const newUser = {
            id: String(mockUsers.length + 1),
            email,
            name,
          };
          
          mockUsers.push({ ...newUser, password });
          
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          });
          
          router.replace('/(tabs)');
        } catch (error: any) {
          set({
            error: error.message || 'Failed to register',
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
        router.replace('/login');
      },

      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentUser = get().user;
          
          if (!currentUser) {
            throw new Error('User not found');
          }
          
          const updatedUser = {
            ...currentUser,
            ...userData,
          };
          
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Failed to update profile',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);