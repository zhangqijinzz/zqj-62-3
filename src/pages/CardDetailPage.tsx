import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MessageCircle,
  Heart,
  Flame,
  Clock,
  Send,
  Sparkles,
  Puzzle,
  Trash2,
} from 'lucide-react'
import PageWrapper from '@/components/PageWrapper'
import Tape from '@/components/Tape'
import { useAppStore } from '@/store/useAppStore'
import { identityFragments } from '@/data/identityFragments'
import type { CardResponse, FragmentCategory } from '@/types'

const categoryConfig: Record<FragmentCategory, { color: string; bgColor: string; label: string }> = {
  教育: { color: 'bg-neon-orange', bgColor: 'bg-neon-orange/15', label: '📚 教育' },
  家庭: { color: 'bg-neon-pink', bgColor: 'bg-neon-pink/15', label: '👨‍👩‍👧 家庭' },
  迁徙: { color: 'bg-electric-teal', bgColor: 'bg-electric-teal/15', label: '🚄 迁徙' },
  兴趣: { color: 'bg-alley-green text-white', bgColor: 'bg-alley-green/15', label: '🎨 兴趣' },
  友情: { color: 'bg-yellow-400', bgColor: 'bg-yellow-400/15', label: '🤝 友情' },
  挑战: { color: 'bg-earth-brown text-white', bgColor: 'bg-earth-brown/15', label: '💪 挑战' },
}

const PAGE_SIZE = 5

function ResponseItem({ response }: { response: CardResponse }) {
  const fragment = response.fragmentId
    ? identityFragments.find((f) => f.id === response.fragmentId)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-ink-black p-4 mb-3"
      style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-neon-pink border-2 border-ink-black flex items-center justify-center text-base shrink-0">
          {response.responderAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-sm text-ink-black">
              {response.responderNickname}
            </span>
            <span className="text-[10px] text-ink-black/40">
              {new Date(response.createdAt).toLocaleString('zh-CN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            {response.type === 'fragment' && fragment && (
              <span
                className={`text-[10px] px-1.5 py-0.5 border border-ink-black/40 ${categoryConfig[fragment.category].color}`}
              >
                同感碎片
              </span>
            )}
            {response.type === 'encouragement' && (
              <span className="text-[10px] px-1.5 py-0.5 bg-neon-orange/20 text-neon-orange border border-neon-orange/40">
                鼓励语
              </span>
            )}
          </div>
          <p className="text-sm text-ink-black/80 leading-relaxed">
            {response.type === 'encouragement' ? `"${response.content}"` : response.content}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function QuickResponseInput({
  cardId,
  onSuccess,
}: {
  cardId: string
  onSuccess: () => void
}) {
  const profile = useAppStore((state) => state.profile)
  const addResponse = useAppStore((state) => state.addResponse)
  const [responseType, setResponseType] = useState<'encouragement' | 'fragment'>('encouragement')
  const [encouragement, setEncouragement] = useState('')
  const [selectedFragment, setSelectedFragment] = useState<string | null>(null)
  const [showFragmentPicker, setShowFragmentPicker] = useState(false)

  const handleSubmit = () => {
    if (responseType === 'encouragement' && encouragement.trim()) {
      addResponse({
        id: `resp-${Date.now()}`,
        cardId,
        type: 'encouragement',
        content: encouragement.trim(),
        responderNickname: profile.nickname,
        responderAvatar: profile.avatar,
        createdAt: Date.now(),
      })
      setEncouragement('')
      onSuccess()
    } else if (responseType === 'fragment' && selectedFragment) {
      const frag = identityFragments.find((f) => f.id === selectedFragment)
      if (frag) {
        addResponse({
          id: `resp-${Date.now()}`,
          cardId,
          type: 'fragment',
          content: `${frag.emoji} ${frag.content}`,
          fragmentId: selectedFragment,
          responderNickname: profile.nickname,
          responderAvatar: profile.avatar,
          createdAt: Date.now(),
        })
        setSelectedFragment(null)
        setShowFragmentPicker(false)
        onSuccess()
      }
    }
  }

  const isValid =
    (responseType === 'encouragement' && encouragement.trim().length > 0) ||
    (responseType === 'fragment' && selectedFragment)

  return (
    <div className="bg-wall-cream border-3 border-ink-black p-4 mt-4" style={{ boxShadow: '3px 3px 0 #1A1A1A' }}>
      <div className="flex gap-2 mb-3">
        <button
          className={`flex-1 py-1.5 px-3 text-xs font-bold border-2 border-ink-black transition-colors ${
            responseType === 'encouragement'
              ? 'bg-neon-orange text-white'
              : 'bg-white hover:bg-wall-cream'
          }`}
          onClick={() => {
            setResponseType('encouragement')
            setShowFragmentPicker(false)
          }}
        >
          <Sparkles size={12} className="inline mr-1" />
          鼓励语
        </button>
        <button
          className={`flex-1 py-1.5 px-3 text-xs font-bold border-2 border-ink-black transition-colors ${
            responseType === 'fragment'
              ? 'bg-electric-teal text-white'
              : 'bg-white hover:bg-wall-cream'
          }`}
          onClick={() => {
            setResponseType('fragment')
            setShowFragmentPicker(true)
          }}
        >
          <Puzzle size={12} className="inline mr-1" />
          同感碎片
        </button>
      </div>

      {responseType === 'encouragement' ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={encouragement}
            onChange={(e) => setEncouragement(e.target.value)}
            placeholder="写下一句鼓励..."
            maxLength={100}
            className="flex-1 px-3 py-2 border-2 border-ink-black bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-orange"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isValid) {
                handleSubmit()
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-4 py-2 font-bold border-2 border-ink-black flex items-center gap-1 ${
              isValid
                ? 'bg-alley-green text-white hover:bg-alley-green/90'
                : 'bg-ink-black/20 text-ink-black/40 cursor-not-allowed'
            }`}
            style={{ boxShadow: isValid ? '2px 2px 0 #1A1A1A' : 'none' }}
          >
            <Send size={14} />
          </button>
        </div>
      ) : (
        <div>
          {selectedFragment ? (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {identityFragments.find((f) => f.id === selectedFragment)?.emoji}{' '}
                  {identityFragments.find((f) => f.id === selectedFragment)?.content}
                </span>
                <button
                  onClick={() => setSelectedFragment(null)}
                  className="text-xs text-ink-black/50 hover:text-ink-black"
                >
                  更换
                </button>
              </div>
              <button
                onClick={handleSubmit}
                className="px-3 py-1 bg-alley-green text-white text-xs font-bold border-2 border-ink-black"
                style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
              >
                发送
              </button>
            </div>
          ) : null}

          <AnimatePresence>
            {showFragmentPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs font-bold text-ink-black mb-2">选择一个你也有同感的碎片：</p>
                <div className="max-h-40 overflow-y-auto grid grid-cols-2 gap-2 pr-1">
                  {identityFragments.map((f) => (
                    <button
                      key={f.id}
                      className={`p-2 text-left text-xs border-2 border-ink-black transition-all ${
                        selectedFragment === f.id
                          ? `${categoryConfig[f.category].color}`
                          : 'bg-white hover:bg-wall-cream'
                      } ${selectedFragment === f.id && (f.category === '兴趣' || f.category === '挑战') ? 'text-white' : ''}`}
                      onClick={() => setSelectedFragment(f.id)}
                    >
                      <span className="mr-1">{f.emoji}</span>
                      {f.content}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default function CardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const identityCards = useAppStore((state) => state.identityCards)
  const cardResponses = useAppStore((state) => state.cardResponses)
  const getResponsesForCard = useAppStore((state) => state.getResponsesForCard)
  const getCardsWithStats = useAppStore((state) => state.getCardsWithStats)
  const removeIdentityCard = useAppStore((state) => state.removeIdentityCard)
  const profile = useAppStore((state) => state.profile)

  const [currentPage, setCurrentPage] = useState(1)
  const [responses, setResponses] = useState<CardResponse[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const card = useMemo(() => identityCards.find((c) => c.id === id), [identityCards, id])

  const cardWithStats = useMemo(() => {
    const stats = getCardsWithStats()
    return stats.find((c) => c.id === id)
  }, [getCardsWithStats, id, identityCards, cardResponses])

  const fragments = useMemo(() => {
    if (!card) return []
    return card.selectedFragments
      .map((fid) => identityFragments.find((f) => f.id === fid))
      .filter(Boolean)
  }, [card])

  const isOwner = card && (card.ownerId === 'current' || card.nickname === profile.nickname)

  const loadResponses = useCallback(
    (page: number, reset = false) => {
      if (!id) return
      setLoading(true)
      setTimeout(() => {
        const result = getResponsesForCard(id, page, PAGE_SIZE)
        if (reset) {
          setResponses(result.responses)
        } else {
          setResponses((prev) => [...prev, ...result.responses])
        }
        setTotal(result.total)
        setHasMore(result.hasMore)
        setLoading(false)
      }, 200)
    },
    [id, getResponsesForCard],
  )

  useEffect(() => {
    if (id) {
      loadResponses(1, true)
      setCurrentPage(1)
    }
  }, [id, loadResponses])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      loadResponses(nextPage)
    }
  }

  const handleNewResponse = useCallback(() => {
    loadResponses(1, true)
    setCurrentPage(1)
  }, [loadResponses])

  const handleDelete = useCallback(() => {
    if (!id) return
    removeIdentityCard(id)
    navigate('/identity/resonance')
  }, [id, removeIdentityCard, navigate])

  if (!card) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🤔</div>
          <h3 className="handwritten text-2xl text-ink-black mb-3">卡片不存在</h3>
          <p className="text-ink-black/60 mb-6">这张身份卡可能已被删除，或者链接有误。</p>
          <Link
            to="/identity/resonance"
            className="inline-flex items-center gap-2 px-5 py-2 bg-neon-orange text-white font-bold border-3 border-ink-black"
            style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
          >
            <ArrowLeft size={16} />
            返回共鸣墙
          </Link>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/identity/resonance"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-3 border-ink-black font-bold text-ink-black"
            style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
          >
            <ArrowLeft size={18} />
            返回共鸣墙
          </Link>
          <h1 className="handwritten text-2xl md:text-3xl text-ink-black">
            📇 身份卡详情
          </h1>
          <div className="w-[120px]" />
        </div>

        <div className="relative bg-wall-cream sticker-border p-6 mb-6" style={{ boxShadow: '4px 4px 0 #1A1A1A' }}>
          <Tape color="yellow" rotate={-5} width={80} className="top-0 left-6 z-10" />

          {isOwner && (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="absolute top-4 right-4 p-2 text-ink-black/40 hover:text-red-500 hover:bg-red-50 rounded transition-colors z-20"
              title="删除我的卡片"
            >
              <Trash2 size={18} />
            </button>
          )}

          <div className="pt-4">
            <div className="bg-white border-3 border-ink-black p-5 mb-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-neon-pink border-3 border-ink-black flex items-center justify-center text-3xl shrink-0">
                  🧑
                </div>
                <div>
                  <p className="text-xs text-ink-black/50">昵称</p>
                  <p className="handwritten text-2xl text-ink-black">{card.nickname}</p>
                </div>
              </div>

              {cardWithStats && (
                <div className="flex items-center gap-6 py-3 border-y-2 border-dashed border-ink-black/20">
                  <div className="flex items-center gap-1.5 text-sm">
                    <MessageCircle size={14} className="text-ink-black/50" />
                    <span className="text-ink-black/50">回应</span>
                    <span className="font-bold text-ink-black">{cardWithStats.responseCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Heart size={14} className="text-ink-black/50" />
                    <span className="text-ink-black/50">共鸣</span>
                    <span className="font-bold text-ink-black">{cardWithStats.fragmentMatches}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Flame size={14} className="text-neon-orange" />
                    <span className="text-ink-black/50">热度</span>
                    <span className="font-bold text-neon-orange">{cardWithStats.hotScore.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock size={14} className="text-ink-black/50" />
                    <span className="text-ink-black/50">创建</span>
                    <span className="font-bold text-ink-black">
                      {new Date(card.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <p className="text-xs text-ink-black/50 mb-2">💬 座右铭</p>
                <p className="text-base text-ink-black/80 italic leading-relaxed">
                  "{card.personalQuote}"
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-ink-black mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-neon-orange text-white flex items-center justify-center text-xs border-2 border-ink-black">
                  {fragments.length}
                </span>
                个身份标签
              </p>
              <div className="flex flex-wrap gap-2">
                {fragments.map((f) =>
                  f ? (
                    <span
                      key={f.id}
                      className={`text-sm px-3 py-1.5 border-2 border-ink-black ${categoryConfig[f.category].bgColor}`}
                      style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
                    >
                      {f.emoji} {f.content}
                    </span>
                  ) : null,
                )}
              </div>
            </div>
          </div>
        </div>

        <QuickResponseInput cardId={card.id} onSuccess={handleNewResponse} />

        <div className="mt-8">
          <h3 className="handwritten text-xl text-ink-black mb-4 flex items-center gap-2">
            <MessageCircle size={20} />
            回应 ({total})
          </h3>

          {responses.length === 0 && !loading ? (
            <motion.div
              className="text-center py-12 bg-white sticker-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-4xl mb-3">💬</div>
              <h4 className="handwritten text-lg text-ink-black mb-2">还没有回应</h4>
              <p className="text-sm text-ink-black/50">
                成为第一个给 {card.nickname} 留下鼓励的人吧！
              </p>
            </motion.div>
          ) : (
            <>
              <div>
                {responses.map((response) => (
                  <ResponseItem key={response.id} response={response} />
                ))}
              </div>

              {loading && (
                <div className="text-center py-4">
                  <div className="inline-block w-6 h-6 border-2 border-ink-black/30 border-t-ink-black rounded-full animate-spin" />
                </div>
              )}

              {hasMore && !loading && (
                <div className="text-center mt-4">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-2 bg-white font-bold border-2 border-ink-black text-sm hover:bg-wall-cream transition-colors"
                    style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
                  >
                    加载更多 ({responses.length}/{total})
                  </button>
                </div>
              )}

              {!hasMore && responses.length > 0 && (
                <p className="text-center text-xs text-ink-black/40 py-4">
                  — 已显示全部回应 —
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {deleteConfirm && (
        <motion.div
          className="fixed inset-0 bg-ink-black/70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setDeleteConfirm(false)}
        >
          <motion.div
            className="relative w-full max-w-sm bg-white sticker-border p-6 text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
          >
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="handwritten text-xl text-ink-black mb-2">确定删除这张卡片吗？</h3>
            <p className="text-sm text-ink-black/60 mb-5">
              删除后这张身份卡及其所有 {total} 条回应都会被清除，且无法恢复。
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-5 py-2 bg-white font-bold border-2 border-ink-black text-sm"
                style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
              >
                再想想
              </button>
              <button
                onClick={handleDelete}
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
