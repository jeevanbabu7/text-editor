import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      userData: null,
      setUserData: (data) => set({ userData: data }), 
    }),
    {
      name: 'user-storage', 
      getStorage: () => localStorage, 
    }
  )
);

export default useStore;
