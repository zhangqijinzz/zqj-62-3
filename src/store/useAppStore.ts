import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  StreetArchive,
  MovingRecord,
  CityStory,
  IdentityCard,
  UserProfile,
  PackedItem,
  CardResponse,
  CardWithStats,
} from '@/types'
import { cityStories as initialCityStories } from '@/data/cityStories'
import { identityFragments } from '@/data/identityFragments'

const HOT_SCORE_RESPONSE_WEIGHT = 3
const HOT_SCORE_TIME_DECAY_HOURS = 72

const calculateHotScore = (card: IdentityCard, responseCount: number): number => {
  const ageHours = (Date.now() - card.createdAt) / (1000 * 60 * 60)
  const decay = Math.pow(0.5, ageHours / HOT_SCORE_TIME_DECAY_HOURS)
  const baseScore = 1 + responseCount * HOT_SCORE_RESPONSE_WEIGHT
  return Math.round(baseScore * decay * 100) / 100
}

const getFragmentMatches = (card: IdentityCard, allCards: IdentityCard[]): number => {
  let matches = 0
  for (const other of allCards) {
    if (other.id === card.id) continue
    for (const fragId of card.selectedFragments) {
      if (other.selectedFragments.includes(fragId)) {
        matches++
        break
      }
    }
  }
  return matches
}

interface AppState {
  profile: UserProfile
  archives: StreetArchive[]
  movingRecords: MovingRecord[]
  currentPackingItems: PackedItem[]
  cityStories: CityStory[]
  identityCards: IdentityCard[]
  cardResponses: CardResponse[]
  setProfile: (profile: UserProfile) => void
  addArchive: (archive: StreetArchive) => void
  removeArchive: (id: string) => void
  addMovingRecord: (record: MovingRecord) => void
  setCurrentPackingItems: (items: PackedItem[]) => void
  unlockStory: (storyId: string) => void
  addIdentityCard: (card: IdentityCard) => void
  removeIdentityCard: (cardId: string) => void
  addResponse: (response: CardResponse) => void
  getResponsesForCard: (cardId: string, page?: number, pageSize?: number) => {
    responses: CardResponse[]
    total: number
    hasMore: boolean
  }
  getCardsWithStats: () => CardWithStats[]
  getFragmentPopularity: () => { fragmentId: string; count: number; fragment: typeof identityFragments[0] }[]
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: {
        nickname: '流动少年',
        avatar: '🧑',
      },
      archives: [],
      movingRecords: [],
      currentPackingItems: [],
      cityStories: initialCityStories,
      identityCards: [],
      cardResponses: [],
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
      removeIdentityCard: (cardId) =>
        set((state) => ({
          identityCards: state.identityCards.filter((c) => c.id !== cardId),
          cardResponses: state.cardResponses.filter((r) => r.cardId !== cardId),
        })),
      addResponse: (response) =>
        set((state) => ({ cardResponses: [response, ...state.cardResponses] })),
      getResponsesForCard: (cardId, page = 1, pageSize = 10) => {
        const state = get()
        const allResponses = state.cardResponses
          .filter((r) => r.cardId === cardId)
          .sort((a, b) => b.createdAt - a.createdAt)
        const total = allResponses.length
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const responses = allResponses.slice(start, end)
        return {
          responses,
          total,
          hasMore: end < total,
        }
      },
      getCardsWithStats: () => {
        const state = get()
        return state.identityCards.map((card) => {
          const responseCount = state.cardResponses.filter((r) => r.cardId === card.id).length
          const fragmentMatches = getFragmentMatches(card, state.identityCards)
          const hotScore = calculateHotScore(card, responseCount)
          return {
            ...card,
            responseCount,
            fragmentMatches,
            hotScore,
          }
        })
      },
      getFragmentPopularity: () => {
        const state = get()
        const fragmentCounts: Record<string, number> = {}
        for (const card of state.identityCards) {
          for (const id of card.selectedFragments) {
            fragmentCounts[id] = (fragmentCounts[id] || 0) + 1
          }
        }
        return Object.entries(fragmentCounts)
          .map(([fragmentId, count]) => {
            const fragment = identityFragments.find((f) => f.id === fragmentId)
            return { fragmentId, count, fragment: fragment! }
          })
          .filter((x) => x.fragment)
          .sort((a, b) => b.count - a.count)
      },
    }),
    {
      name: 'street-museum-storage',
    },
  ),
)
