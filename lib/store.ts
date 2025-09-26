import { create } from 'zustand';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface AppState {
  selectedPost: Post | null;
  favoriteIds: number[];
  setSelectedPost: (post: Post | null) => void;
  toggleFavorite: (postId: number) => void;
  isFavorite: (postId: number) => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedPost: null,
  favoriteIds: [],
  setSelectedPost: (post) => set({ selectedPost: post }),
  toggleFavorite: (postId) => 
    set((state) => ({
      favoriteIds: state.favoriteIds.includes(postId)
        ? state.favoriteIds.filter(id => id !== postId)
        : [...state.favoriteIds, postId]
    })),
  isFavorite: (postId) => get().favoriteIds.includes(postId),
}));