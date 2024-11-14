import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create((set) => ({
  userData: null,
  setUserData: (data) => set({ userData: data }),
}));

export default useStore;
