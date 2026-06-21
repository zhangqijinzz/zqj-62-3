export type StreetCategory = '招牌' | '涂鸦' | '小广告' | '方言标语' | '其他'

export interface StreetElement {
  id: string
  category: StreetCategory
  keywords: string[]
  templateTitle: string
  templateStory: string
}

export interface StreetArchive {
  id: string
  imageUrl: string
  title: string
  category: StreetCategory
  story: string
  elements: { label: string; x: number; y: number }[]
  createdAt: number
}

export type ItemCategory = '家具' | '衣物' | '文具' | '玩具' | '纪念品' | '厨房用品'
export type ItemSize = 'small' | 'medium' | 'large'

export interface PackingItemTemplate {
  id: string
  name: string
  category: ItemCategory
  size: ItemSize
  memoryPrompts: string[]
  emoji: string
}

export interface PackedItem {
  id: string
  templateId: string
  name: string
  category: ItemCategory
  size: ItemSize
  memoryStory: string
  emoji: string
  gridX: number
  gridY: number
}

export interface MovingRecord {
  id: string
  fromAddress: string
  toAddress: string
  moveDate: string
  description: string
  items: PackedItem[]
}

export interface CityFragment {
  id: string
  type: '屋顶' | '窄巷' | '菜市场'
  x: number
  collected: boolean
  storyId: string
}

export interface CityStory {
  id: string
  title: string
  location: string
  content: string
  unlocked: boolean
}

export type FragmentCategory = '教育' | '家庭' | '迁徙' | '兴趣' | '友情' | '挑战'

export interface IdentityFragment {
  id: string
  category: FragmentCategory
  content: string
  emoji: string
}

export interface IdentityCard {
  id: string
  selectedFragments: string[]
  nickname: string
  personalQuote: string
  createdAt: number
  ownerId?: string
}

export type ResponseType = 'encouragement' | 'fragment'

export interface CardResponse {
  id: string
  cardId: string
  type: ResponseType
  content: string
  fragmentId?: string
  responderNickname: string
  responderAvatar: string
  createdAt: number
}

export interface CardWithStats extends IdentityCard {
  responseCount: number
  fragmentMatches: number
  hotScore: number
}

export interface UserProfile {
  nickname: string
  avatar: string
}
