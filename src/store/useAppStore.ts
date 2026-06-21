import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  StreetArchive,
  MovingRecord,
  CityStory,
  IdentityCard,
  UserProfile,
  PackedItem,
} from '@/types'
import { cityStories as initialCityStories } from '@/data/cityStories'

interface AppState {
  profile: UserProfile
  archives: StreetArchive[]
  movingRecords: MovingRecord[]
  currentPackingItems: PackedItem[]
  cityStories: CityStory[]
  identityCards: IdentityCard[]
  setProfile: (profile: UserProfile) => void
  addArchive: (archive: StreetArchive) => void
  removeArchive: (id: string) => void
  addMovingRecord: (record: MovingRecord) => void
  setCurrentPackingItems: (items: PackedItem[]) => void
  unlockStory: (storyId: string) => void
  addIdentityCard: (card: IdentityCard) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: {
        nickname: '流动少年',
        avatar: '🧑',
      },
      archives: [],
      movingRecords: [],
      currentPackingItems: [],
      cityStories: initialCityStories,
      identityCards: [],
      setProfile: (profile) => set({ profile }),
      addArchive: (archive) =>
        set((state) => ({ archives: [archive, ...state.archives] })),
      removeArchive: (id) =>
        set((state) => ({ archives: state.archives.filter((a) => a.id !== id) })),
      addMovingRecord: (record) =>
        set((state) => ({ movingRecords: [record, ...state.movingRecords] })),
      setCurrentPackingItems: (items) => set({ currentPackingItems: items }),
      unlockStory: (storyId) =>
        set((state) => ({
          cityStories: state.cityStories.map((s) =>
            s.id === storyId ? { ...s, unlocked: true } : s,
          ),
        })),
      addIdentityCard: (card) =>
        set((state) => ({ identityCards: [card, ...state.identityCards] })),
    }),
    {
      name: 'street-museum-storage',
    },
  ),
)
