import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Filter,
  Clock,
  Flame,
  MessageCircle,
  Heart,
  Trash2,
} from 'lucide-react'
import PageWrapper from '@/components/PageWrapper'
import Tape from '@/components/Tape'
import { useAppStore } from '@/store/useAppStore'
import { identityFragments } from '@/data/identityFragments'
import type { FragmentCategory, CardWithStats } from '@/types'

const categoryConfig: Record<FragmentCategory | 'all', { color: string; bgColor: string; label: string }> = {
  all: { color: 'bg-ink-black text-white', bgColor: 'bg-ink-black/10', label: '✨ 全部' },
  教育: { color: 'bg-neon-orange', bgColor: 'bg-neon-orange/15', label: '📚 教育' },
  家庭: { color: 'bg-neon-pink', bgColor: 'bg-neon-pink/15', label: '👨‍👩‍👧 家庭' },
  迁徙: { color: 'bg-electric-teal', bgColor: 'bg-electric-teal/15', label: '🚄 迁徙' },
  兴趣: { color: 'bg-alley-green text-white', bgColor: 'bg-alley-green/15', label: '🎨 兴趣' },
  友情: { color: 'bg-yellow-400', bgColor: 'bg-yellow-400/15', label: '🤝 友情' },
  挑战: { color: 'bg-earth-brown text-white', bgColor: 'bg-earth-brown/15', label: '💪 挑战' },
}

type SortType = 'time' | 'hot'

function IdentityCardComponent({
  card,
  onDelete,
  onRespond,
  index,
}: {
  card: CardWithStats
  onDelete: (id: string) => void
  onRespond: (card: CardWithStats) => void
  index: number
}) {
  const navigate = useNavigate()
  const profile = useAppStore((state) => state.profile)
  const isOwner = card.ownerId === 'current' || card.nickname === profile.nickname

  const fragments = card.selectedFragments
    .map((id) => identityFragments.find((f) => f.id === id))
    .filter(Boolean)

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button')) return
    navigate(`/identity/resonance/${card.id}`)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.03 }}
      className="break-inside-avoid mb-4"
    >
      <motion.div
        className="relative bg-wall-cream sticker-border overflow-hidden cursor-pointer group"
        style={{
          transform: `rotate(${(index % 5 - 2) * 1.2}deg)`,
          boxShadow: '3px 3px 0 #1A1A1A',
        }}
        onClick={handleCardClick}
        whileHover={{
          rotate: 0,
          y: -4,
          boxShadow: '5px 6px 0 #1A1A1A',
        }}
      >
        {index % 3 === 0 && (
          <Tape color="yellow" rotate={-6} width={60} className="top-0 left-4 z-10" />
        )}
        {index % 3 === 1 && (
          <Tape color="pink" rotate={4} width={55} className="top-0 right-4 z-10" />
        )}
        {index % 3 === 2 && (
          <Tape color="teal" rotate={-3} width={50} className="top-0 left-1/2 -translate-x-1/2 z-10" />
        )}

        <div className="p-4 pt-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-neon-pink border-2 border-ink-black flex items-center justify-center text-xl shrink-0">
                🧑
              </div>
              <div>
                <p className="handwritten text-base text-ink-black font-bold leading-tight">
                  {card.nickname}
                </p>
                <p className="text-[10px] text-ink-black/40">
                  {new Date(card.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>
            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(card.id)
                }}
                className="p-1.5 text-ink-black/40 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                title="删除我的卡片"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <div className="bg-white border-2 border-ink-black p-3 mb-3">
            <p className="text-[11px] text-ink-black/50 mb-1">💬 座右铭</p>
            <p className="text-sm text-ink-black/80 italic leading-relaxed">
              "{card.personalQuote}"
            </p>
          </div>

          <div className="mb-3">
            <p className="text-[10px] text-ink-black/50 mb-1.5">身份标签</p>
            <div className="flex flex-wrap gap-1">
              {fragments.slice(0, 8).map((f) =>
                f ? (
                  <span
                    key={f.id}
                    className={`text-[10px] px-1.5 py-0.5 border border-ink-black/40 ${
                      categoryConfig[f.category].bgColor
                    }`}
                  >
                    {f.emoji} {f.content}
                  </span>
                ) : null,
              )}
              {fragments.length > 8 && (
                <span className="text-[10px] text-ink-black/50 px-1.5 py-0.5">
                  +{fragments.length - 8}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-ink-black/15">
            <div className="flex items-center gap-3 text-xs text-ink-black/50">
              <span className="flex items-center gap-1">
                <MessageCircle size={12} />
                {card.responseCount}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={12} />
                {card.fragmentMatches}
              </span>
              <span className="flex items-center gap-1 text-neon-orange">
                <Flame size={12} />
                {card.hotScore.toFixed(1)}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRespond(card)
              }}
              className="px-3 py-1 bg-neon-orange text-white text-xs font-bold border-2 border-ink-black hover:bg-neon-orange/90 transition-colors"
              style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
            >
              回应
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ResponseModal({
  card,
  onClose,
  onSubmit,
}: {
  card: CardWithStats | null
  onClose: () => void
  onSubmit: (type: 'encouragement' | 'fragment', content: string, fragmentId?: string) => void
}) {
  const [responseType, setResponseType] = useState<'encouragement' | 'fragment'>('encouragement')
  const [encouragement, setEncouragement] = useState('')
  const [selectedFragment, setSelectedFragment] = useState<string | null>(null)

  if (!card) return null

  const cardFragments = card.selectedFragments
    .map((id) => identityFragments.find((f) => f.id === id))
    .filter(Boolean)

  const handleSubmit = () => {
    if (responseType === 'encouragement' && encouragement.trim()) {
      onSubmit('encouragement', encouragement.trim())
      setEncouragement('')
    } else if (responseType === 'fragment' && selectedFragment) {
      const frag = identityFragments.find((f) => f.id === selectedFragment)
      if (frag) {
        onSubmit('fragment', `${frag.emoji} ${frag.content}`, selectedFragment)
      }
      setSelectedFragment(null)
    }
  }

  const isValid =
    (responseType === 'encouragement' && encouragement.trim().length > 0) ||
    (responseType === 'fragment' && selectedFragment)

  return (
    <motion.div
      className="fixed inset-0 bg-ink-black/70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-lg bg-wall-cream sticker-border p-6"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '5px 5px 0 #1A1A1A' }}
      >
        <Tape color="yellow" rotate={-4} width={70} className="top-0 left-6 z-10" />

        <div className="pt-2">
          <h3 className="handwritten text-2xl text-ink-black mb-4">
            💬 给 {card.nickname} 的回应
          </h3>

          <div className="flex gap-2 mb-4">
            <button
              className={`flex-1 py-2 px-4 text-sm font-bold border-2 border-ink-black transition-colors ${
                responseType === 'encouragement'
                  ? 'bg-neon-orange text-white'
                  : 'bg-white hover:bg-wall-cream'
              }`}
              onClick={() => setResponseType('encouragement')}
            >
              ✨ 鼓励语
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-bold border-2 border-ink-black transition-colors ${
                responseType === 'fragment'
                  ? 'bg-electric-teal text-white'
                  : 'bg-white hover:bg-wall-cream'
              }`}
              onClick={() => setResponseType('fragment')}
            >
              🧩 同感碎片
            </button>
          </div>

          {responseType === 'encouragement' ? (
            <div className="mb-4">
              <label className="block text-sm font-bold text-ink-black mb-2">
                写下一句鼓励的话
              </label>
              <textarea
                value={encouragement}
                onChange={(e) => setEncouragement(e.target.value)}
                placeholder="加油！你的故事很动人..."
                rows={3}
                maxLength={100}
                className="w-full px-3 py-2 border-2 border-ink-black bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-orange resize-none"
              />
              <p className="text-right text-xs text-ink-black/40 mt-1">
                {encouragement.length}/100
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-bold text-ink-black mb-2">
                选择一个你也有同感的碎片
              </label>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {cardFragments.map((f) =>
                  f ? (
                    <button
                      key={f.id}
                      className={`w-full p-2 text-left border-2 border-ink-black text-sm transition-all ${
                        selectedFragment === f.id
                          ? `${categoryConfig[f.category].color} border-ink-black`
                          : 'bg-white hover:bg-wall-cream'
                      } ${selectedFragment === f.id && (f.category === '兴趣' || f.category === '挑战') ? 'text-white' : ''}`}
                      onClick={() => setSelectedFragment(f.id)}
                    >
                      <span className="mr-2">{f.emoji}</span>
                      {f.content}
                      <span className="ml-2 text-xs opacity-60">
                        ({categoryConfig[f.category].label.split(' ')[1]})
                      </span>
                    </button>
                  ) : null,
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-white font-bold border-2 border-ink-black text-sm"
              style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`px-5 py-2 font-bold border-2 border-ink-black text-sm ${
                isValid
                  ? 'bg-alley-green text-white hover:bg-alley-green/90'
                  : 'bg-ink-black/20 text-ink-black/40 cursor-not-allowed'
              }`}
              style={{ boxShadow: isValid ? '2px 2px 0 #1A1A1A' : 'none' }}
            >
              发送回应
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function EmptyState() {
  const navigate = useNavigate()
  return (
    <motion.div
      className="text-center py-20 bg-white sticker-border"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
    >
      <div className="text-7xl mb-4">🧱</div>
      <h3 className="handwritten text-3xl text-ink-black mb-3">共鸣墙还是空的</h3>
      <p className="text-ink-black/60 mb-6 max-w-md mx-auto">
        还没有身份卡被展示在这里。生成你的身份卡，成为第一个上墙的少年吧！
        <br />
        你的故事会被更多人看见，也会收到更多共鸣。
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => navigate('/identity')}
          className="px-6 py-3 bg-neon-orange text-white font-bold border-3 border-ink-black inline-flex items-center gap-2"
          style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
        >
          🧩 去生成身份卡
        </button>
        <button
          onClick={() => navigate('/identity/community')}
          className="px-6 py-3 bg-white font-bold border-3 border-ink-black inline-flex items-center gap-2"
          style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
        >
          👥 看群体共鸣
        </button>
      </div>
    </motion.div>
  )
}

export default function ResonanceWallPage() {
  const navigate = useNavigate()
  const profile = useAppStore((state) => state.profile)
  const identityCards = useAppStore((state) => state.identityCards)
  const cardResponses = useAppStore((state) => state.cardResponses)
  const addResponse = useAppStore((state) => state.addResponse)
  const removeIdentityCard = useAppStore((state) => state.removeIdentityCard)
  const getCardsWithStats = useAppStore((state) => state.getCardsWithStats)

  const [activeCategory, setActiveCategory] = useState<FragmentCategory | 'all'>('all')
  const [sortType, setSortType] = useState<SortType>('hot')
  const [responseModalCard, setResponseModalCard] = useState<CardWithStats | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const cardsWithStats = useMemo(
    () => getCardsWithStats(),
    [getCardsWithStats, identityCards, cardResponses],
  )

  const filteredAndSortedCards = useMemo(() => {
    let result = [...cardsWithStats]

    if (activeCategory !== 'all') {
      result = result.filter((card) =>
        card.selectedFragments.some((id) => {
          const f = identityFragments.find((frag) => frag.id === id)
          return f?.category === activeCategory
        }),
      )
    }

    if (sortType === 'time') {
      result.sort((a, b) => b.createdAt - a.createdAt)
    } else {
      result.sort((a, b) => b.hotScore - a.hotScore)
    }

    return result
  }, [cardsWithStats, activeCategory, sortType])

  const handleDelete = useCallback(
    (cardId: string) => {
      setDeleteConfirmId(cardId)
    },
    [],
  )

  const confirmDelete = useCallback(() => {
    if (deleteConfirmId) {
      removeIdentityCard(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }, [deleteConfirmId, removeIdentityCard])

  const handleRespond = useCallback(
    (card: CardWithStats) => {
      setResponseModalCard(card)
    },
    [],
  )

  const handleSubmitResponse = useCallback(
    (type: 'encouragement' | 'fragment', content: string, fragmentId?: string) => {
      if (!responseModalCard) return
      const response = {
        id: `resp-${Date.now()}`,
        cardId: responseModalCard.id,
        type,
        content,
        fragmentId,
        responderNickname: profile.nickname,
        responderAvatar: profile.avatar,
        createdAt: Date.now(),
      }
      addResponse(response)
      setResponseModalCard(null)
    },
    [responseModalCard, profile, addResponse],
  )

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/identity/community"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-3 border-ink-black font-bold text-ink-black"
            style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
          >
            <ArrowLeft size={18} />
            返回群体共鸣
          </Link>
          <h1 className="handwritten text-3xl md:text-4xl text-ink-black">
            🧱 共鸣墙
          </h1>
          <div className="w-[140px]" />
        </div>

        <p className="text-center text-ink-black/60 max-w-xl mx-auto mb-6">
          每一张身份卡都是一个独特的故事。在这里，你可以看见他人，也被他人看见。
          留下一句鼓励，或是找到和你有同样经历的同路人。
        </p>

        {cardsWithStats.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Filter size={16} className="text-ink-black/50" />
              <div className="flex flex-wrap gap-2 flex-1">
                {(Object.keys(categoryConfig) as (FragmentCategory | 'all')[]).map((cat) => {
                  const count =
                    cat === 'all'
                      ? cardsWithStats.length
                      : cardsWithStats.filter((card) =>
                          card.selectedFragments.some((id) => {
                            const f = identityFragments.find((frag) => frag.id === id)
                            return f?.category === cat
                          }),
                        ).length
                  if (count === 0 && cat !== 'all') return null
                  return (
                    <motion.button
                      key={cat}
                      className={`px-3 py-1.5 text-xs font-bold border-2 border-ink-black transition-all ${
                        activeCategory === cat
                          ? categoryConfig[cat].color
                          : 'bg-white hover:bg-wall-cream'
                      } ${activeCategory === cat && (cat === '兴趣' || cat === '挑战') ? 'text-white' : ''}`}
                      style={{
                        boxShadow: activeCategory === cat ? '2px 2px 0 #1A1A1A' : '1px 1px 0 #1A1A1A',
                      }}
                      onClick={() => setActiveCategory(cat)}
                      whileTap={{ scale: 0.95 }}
                    >
                      {categoryConfig[cat].label} ({count})
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-ink-black/50">
                共 {filteredAndSortedCards.length} 张卡片
              </p>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1.5 text-xs font-bold border-2 border-ink-black flex items-center gap-1.5 ${
                    sortType === 'hot'
                      ? 'bg-neon-orange text-white'
                      : 'bg-white hover:bg-wall-cream'
                  }`}
                  style={{
                    boxShadow: sortType === 'hot' ? '2px 2px 0 #1A1A1A' : '1px 1px 0 #1A1A1A',
                  }}
                  onClick={() => setSortType('hot')}
                >
                  <Flame size={14} />
                  热度
                </button>
                <button
                  className={`px-3 py-1.5 text-xs font-bold border-2 border-ink-black flex items-center gap-1.5 ${
                    sortType === 'time'
                      ? 'bg-electric-teal text-white'
                      : 'bg-white hover:bg-wall-cream'
                  }`}
                  style={{
                    boxShadow: sortType === 'time' ? '2px 2px 0 #1A1A1A' : '1px 1px 0 #1A1A1A',
                  }}
                  onClick={() => setSortType('time')}
                >
                  <Clock size={14} />
                  最新
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {cardsWithStats.length === 0 ? (
        <EmptyState />
      ) : filteredAndSortedCards.length === 0 ? (
        <motion.div
          className="text-center py-16 bg-white sticker-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="handwritten text-xl text-ink-black mb-2">
            这个分类下还没有卡片
          </h3>
          <p className="text-ink-black/50 mb-4">
            换一个分类看看，或者生成第一张这个类型的身份卡吧！
          </p>
          <button
            onClick={() => setActiveCategory('all')}
            className="px-4 py-2 bg-neon-orange text-white font-bold border-2 border-ink-black text-sm"
            style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
          >
            查看全部卡片
          </button>
        </motion.div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {filteredAndSortedCards.map((card, index) => (
            <IdentityCardComponent
              key={card.id}
              card={card}
              onDelete={handleDelete}
              onRespond={handleRespond}
              index={index}
            />
          ))}
        </div>
      )}

      {responseModalCard && (
        <ResponseModal
          card={responseModalCard}
          onClose={() => setResponseModalCard(null)}
          onSubmit={handleSubmitResponse}
        />
      )}

      {deleteConfirmId && (
        <motion.div
          className="fixed inset-0 bg-ink-black/70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setDeleteConfirmId(null)}
        >
          <motion.div
            className="relative w-full max-w-sm bg-white sticker-border p-6 text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
          >
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="handwritten text-xl text-ink-black mb-2">确定删除吗？</h3>
            <p className="text-sm text-ink-black/60 mb-5">
              删除后这张身份卡及其所有回应都会被清除，且无法恢复。
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2 bg-white font-bold border-2 border-ink-black text-sm"
                style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
              >
                再想想
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-500 text-white font-bold border-2 border-ink-black text-sm"
                style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
              >
                确认删除
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </PageWrapper>
  )
}
