import { create } from 'zustand';
import { persist } from 'zustand/middleware';


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
