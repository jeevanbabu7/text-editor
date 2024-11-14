import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Type definition for userData (optional if using TypeScript)

const useStore = create(
  persist(
    (set) => ({
      userData: JSON.parse(localStorage.getItem('user-storage') || 'null'), // Initial state from localStorage
      setUserData: (data) => set({ userData: data }),
    }),
    {
      name: 'user-storage', // Key in localStorage
      getStorage: () => localStorage, // Using localStorage for persistence
    }
  )
);

export default useStore;
