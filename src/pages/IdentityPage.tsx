import { useState, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Sparkles, Download, RotateCcw, Check } from 'lucide-react'
import PageWrapper from '@/components/PageWrapper'
import Tape from '@/components/Tape'
import { useAppStore } from '@/store/useAppStore'
import { identityFragments } from '@/data/identityFragments'
import type { FragmentCategory } from '@/types'

const categoryConfig: Record<FragmentCategory, { color: string; bgColor: string; label: string }> = {
  教育: { color: 'bg-neon-orange', bgColor: 'bg-neon-orange/15', label: '📚 教育' },
  家庭: { color: 'bg-neon-pink', bgColor: 'bg-neon-pink/15', label: '👨‍👩‍👧 家庭' },
  迁徙: { color: 'bg-electric-teal', bgColor: 'bg-electric-teal/15', label: '🚄 迁徙' },
  兴趣: { color: 'bg-alley-green text-white', bgColor: 'bg-alley-green/15', label: '🎨 兴趣' },
  友情: { color: 'bg-yellow-400', bgColor: 'bg-yellow-400/15', label: '🤝 友情' },
  挑战: { color: 'bg-earth-brown text-white', bgColor: 'bg-earth-brown/15', label: '💪 挑战' },
}

export default function IdentityPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<FragmentCategory | 'all'>('all')
  const [nickname, setNickname] = useState('')
  const [quote, setQuote] = useState('')
  const [showCard, setShowCard] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const addIdentityCard = useAppStore((state) => state.addIdentityCard)
  const identityCards = useAppStore((state) => state.identityCards)

  const filteredFragments = useMemo(() => {
    if (activeCategory === 'all') return identityFragments
    return identityFragments.filter((f) => f.category === activeCategory)
  }, [activeCategory])

  const toggleFragment = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const selectedFragments = identityFragments.filter((f) => selectedIds.includes(f.id))

  const handleGenerate = () => {
    if (selectedIds.length < 5) return
    const card = {
      id: `card-${Date.now()}`,
      selectedFragments: selectedIds,
      nickname: nickname || '流动少年',
      personalQuote: quote || '我的故事，还在继续书写中...',
      createdAt: Date.now(),
      ownerId: 'current',
    }
    addIdentityCard(card)
    setShowCard(true)
  }

  const handleReset = () => {
    setSelectedIds([])
    setNickname('')
    setQuote('')
    setShowCard(false)
    setSaveSuccess(false)
  }

  const drawIdentityCard = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = 600
    const h = 800
    canvas.width = w
    canvas.height = h

    const bgColor = '#F4E4C1'
    const cardBg = '#FFFFFF'
    const accentColor = '#E85D2B'
    const pinkColor = '#FF6B9D'
    const inkColor = '#1A1A1A'

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, w, h)

    ctx.save()
    ctx.translate(30, 40)
    ctx.rotate(-6 * Math.PI / 180)
    ctx.fillStyle = 'rgba(255, 230, 120, 0.7)'
    ctx.fillRect(0, 0, 120, 35)
    ctx.restore()

    ctx.save()
    ctx.translate(w - 150, 40)
    ctx.rotate(4 * Math.PI / 180)
    ctx.fillStyle = 'rgba(255, 230, 120, 0.7)'
    ctx.fillRect(0, 0, 100, 30)
    ctx.restore()

    const cardX = 50
    const cardY = 100
    const cardW = w - 100
    const cardH = h - 180

    ctx.fillStyle = cardBg
    ctx.fillRect(cardX, cardY, cardW, cardH)
    ctx.lineWidth = 4
    ctx.strokeStyle = inkColor
    ctx.strokeRect(cardX, cardY, cardW, cardH)

    ctx.save()
    ctx.translate(w - 130, cardY + 25)
    ctx.rotate(5 * Math.PI / 180)
    ctx.fillStyle = accentColor
    ctx.fillRect(0, 0, 70, 26)
    ctx.strokeStyle = inkColor
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, 70, 26)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 12px "Noto Sans SC", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('OFFICIAL', 35, 17)
    ctx.restore()

    ctx.font = '36px "ZCOOL KuaiLe", sans-serif'
    ctx.fillStyle = inkColor
    ctx.textAlign = 'center'
    ctx.fillText('🪪', w / 2, cardY + 70)

    ctx.font = 'bold 28px "ZCOOL KuaiLe", sans-serif'
    ctx.fillText('流动少年身份卡', w / 2, cardY + 110)

    ctx.font = '12px "Noto Sans SC", sans-serif'
    ctx.fillStyle = 'rgba(26, 26, 26, 0.5)'
    ctx.fillText(`ID: ${String(Date.now()).slice(-8)}`, w / 2, cardY + 135)

    const infoBoxY = cardY + 170
    const infoBoxH = 140
    ctx.fillStyle = cardBg
    ctx.fillRect(cardX + 30, infoBoxY, cardW - 60, infoBoxH)
    ctx.lineWidth = 3
    ctx.strokeStyle = inkColor
    ctx.strokeRect(cardX + 30, infoBoxY, cardW - 60, infoBoxH)

    const avatarSize = 80
    const avatarX = cardX + 55
    const avatarY = infoBoxY + 30
    ctx.fillStyle = pinkColor
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize)
    ctx.lineWidth = 3
    ctx.strokeStyle = inkColor
    ctx.strokeRect(avatarX, avatarY, avatarSize, avatarSize)

    ctx.font = '40px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🧑', avatarX + avatarSize / 2, avatarY + 55)

    const nameX = avatarX + avatarSize + 25
    ctx.font = '12px "Noto Sans SC", sans-serif'
    ctx.fillStyle = 'rgba(26, 26, 26, 0.5)'
    ctx.textAlign = 'left'
    ctx.fillText('昵称', nameX, infoBoxY + 50)

    ctx.font = 'bold 24px "ZCOOL KuaiLe", sans-serif'
    ctx.fillStyle = inkColor
    ctx.fillText(nickname || '流动少年', nameX, infoBoxY + 80)

    ctx.beginPath()
    ctx.moveTo(cardX + 30, infoBoxY + 100)
    ctx.lineTo(cardX + cardW - 30, infoBoxY + 100)
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.3)'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.stroke()
    ctx.setLineDash([])

    ctx.font = '11px "Noto Sans SC", sans-serif'
    ctx.fillStyle = 'rgba(26, 26, 26, 0.5)'
    ctx.fillText('个人标签', cardX + 45, infoBoxY + 122)

    const emojis = selectedFragments.slice(0, 12).map((f) => f.emoji)
    ctx.font = '20px sans-serif'
    ctx.fillStyle = inkColor
    let emojiX = cardX + 45
    const emojiY = infoBoxY + 125
    emojis.forEach((emoji, i) => {
      ctx.fillText(emoji, emojiX + i * 26, emojiY + 20)
    })
    if (selectedFragments.length > 12) {
      ctx.font = '12px "Noto Sans SC", sans-serif'
      ctx.fillStyle = 'rgba(26, 26, 26, 0.5)'
      ctx.fillText(`+${selectedFragments.length - 12}`, emojiX + 12 * 26 + 10, emojiY + 20)
    }

    const quoteBoxY = infoBoxY + infoBoxH + 20
    const quoteBoxH = 110
    ctx.fillStyle = 'rgba(232, 93, 43, 0.08)'
    ctx.fillRect(cardX + 30, quoteBoxY, cardW - 60, quoteBoxH)
    ctx.strokeStyle = 'rgba(232, 93, 43, 0.3)'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.strokeRect(cardX + 30, quoteBoxY, cardW - 60, quoteBoxH)
    ctx.setLineDash([])

    ctx.font = 'bold 12px "Noto Sans SC", sans-serif'
    ctx.fillStyle = accentColor
    ctx.fillText('💬 我的座右铭', cardX + 45, quoteBoxY + 25)

    const quoteText = quote || '我的故事，还在继续书写中...'
    ctx.font = 'italic 14px "Noto Sans SC", sans-serif'
    ctx.fillStyle = 'rgba(26, 26, 26, 0.8)'
    ctx.textAlign = 'left'

    const maxWidth = cardW - 100
    const words = quoteText.split('')
    let line = ''
    let lines: string[] = []
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && i > 0) {
        lines.push(line)
        line = words[i]
      } else {
        line = testLine
      }
    }
    lines.push(line)

    const lineHeight = 22
    const startY = quoteBoxY + 50
    lines.slice(0, 3).forEach((l, i) => {
      ctx.fillText(`"${l}${i === 2 && lines.length > 3 ? '...' : ''}"`, cardX + 45, startY + i * lineHeight)
    })

    ctx.font = '11px "Noto Sans SC", sans-serif'
    ctx.fillStyle = 'rgba(26, 26, 26, 0.4)'
    ctx.textAlign = 'center'
    ctx.fillText(
      `签发于 ${new Date().toLocaleDateString('zh-CN')} · 城中村少年街头博物馆`,
      w / 2,
      cardY + cardH - 30
    )

    ctx.save()
    ctx.translate(w / 2 + 100, cardY + cardH - 60)
    ctx.rotate(-8 * Math.PI / 180)
    ctx.strokeStyle = 'rgba(27, 67, 50, 0.6)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(0, 0, 30, 0, Math.PI * 2)
    ctx.stroke()
    ctx.font = 'bold 11px "ZCOOL KuaiLe", sans-serif'
    ctx.fillStyle = 'rgba(27, 67, 50, 0.6)'
    ctx.textAlign = 'center'
    ctx.fillText('街头博物', 0, -5)
    ctx.fillText('馆认证', 0, 10)
    ctx.restore()
  }, [nickname, quote, selectedFragments])

  const handleSaveImage = useCallback(async () => {
    if (isSaving) return
    setIsSaving(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 50))
      drawIdentityCard()

      const canvas = canvasRef.current
      if (!canvas) throw new Error('Canvas not found')

      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `流动少年身份卡_${nickname || '匿名'}_${Date.now()}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    } catch (error) {
      console.error('保存图片失败:', error)
    } finally {
      setIsSaving(false)
    }
  }, [drawIdentityCard, isSaving, nickname])

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {}
    for (const f of selectedFragments) {
      stats[f.category] = (stats[f.category] || 0) + 1
    }
    return stats
  }, [selectedFragments])

  return (
    <PageWrapper>
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="handwritten text-4xl md:text-6xl text-ink-black mb-3">
          🧩 身份拼图
        </h1>
        <p className="text-ink-black/60 max-w-lg mx-auto">
          选择属于你的经历碎片，拼出独一无二的"流动少年身份卡"
        </p>
        {identityCards.length > 0 && (
          <div className="flex gap-3 justify-center mt-4">
            <Link
              to="/identity/community"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border-3 border-ink-black font-bold text-ink-black"
              style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
            >
              <Users size={18} />
              群体共鸣 ({identityCards.length})
            </Link>
            <Link
              to="/identity/resonance"
              className="inline-flex items-center gap-2 px-4 py-2 bg-neon-orange text-white border-3 border-ink-black font-bold"
              style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
            >
              <Sparkles size={18} />
              共鸣墙
            </Link>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="mb-4 flex flex-wrap gap-2">
            <motion.button
              className={`px-4 py-2 text-sm font-bold border-3 border-ink-black ${
                activeCategory === 'all' ? 'bg-ink-black text-white' : 'bg-white'
              }`}
              style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
              onClick={() => setActiveCategory('all')}
              whileTap={{ scale: 0.95 }}
            >
              全部 ({identityFragments.length})
            </motion.button>
            {(Object.keys(categoryConfig) as FragmentCategory[]).map((cat) => {
              const count = identityFragments.filter((f) => f.category === cat).length
              return (
                <motion.button
                  key={cat}
                  className={`px-4 py-2 text-sm font-bold border-3 border-ink-black ${
                    activeCategory === cat ? categoryConfig[cat].color : 'bg-white'
                  } ${activeCategory === cat && cat === ('兴趣' as FragmentCategory) ? 'text-white' : ''}`}
                  style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
                  onClick={() => setActiveCategory(cat)}
                  whileTap={{ scale: 0.95 }}
                >
                  {categoryConfig[cat].label} ({count})
                </motion.button>
              )
            })}
          </div>

          <div className="relative bg-wall-cream/50 sticker-border p-4 max-h-[500px] overflow-y-auto">
            <Tape color="yellow" rotate={-4} width={70} className="top-0 left-6 z-10" />
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredFragments.map((fragment, index) => {
                const isSelected = selectedIds.includes(fragment.id)
                const cfg = categoryConfig[fragment.category]
                return (
                  <motion.button
                    key={fragment.id}
                    className={`relative p-3 border-3 border-ink-black text-left transition-all ${
                      isSelected ? cfg.color : 'bg-white hover:bg-wall-cream'
                    } ${isSelected && (fragment.category === '兴趣' || fragment.category === '挑战') ? 'text-white' : ''}`}
                    style={{
                      boxShadow: isSelected ? '4px 4px 0 #1A1A1A' : '2px 2px 0 #1A1A1A',
                      transform: `rotate(${(index % 5 - 2) * 1.5}deg)`,
                    }}
                    onClick={() => toggleFragment(fragment.id)}
                    whileHover={{ y: isSelected ? 0 : -2, rotate: 0 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSelected && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 bg-neon-orange border-2 border-ink-black rounded-full flex items-center justify-center text-white text-xs font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        ✓
                      </motion.div>
                    )}
                    <div className="text-xl mb-1">{fragment.emoji}</div>
                    <div className="text-xs font-bold leading-snug">{fragment.content}</div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="relative bg-white sticker-border p-5">
            <Tape color="pink" rotate={-3} width={60} className="top-0 left-4" />
            <h3 className="handwritten text-2xl text-ink-black mb-4 pt-2">
              我的选择 ({selectedIds.length})
            </h3>

            {selectedIds.length < 5 && (
              <p className="text-sm text-neon-orange mb-3">
                至少选择 5 个碎片才能生成身份卡哦～还差 {5 - selectedIds.length} 个
              </p>
            )}

            {Object.keys(categoryStats).length > 0 && (
              <div className="mb-4 space-y-2">
                {Object.entries(categoryStats).map(([cat, count]) => {
                  const cfg = categoryConfig[cat as FragmentCategory]
                  const total = identityFragments.filter((f) => f.category === cat).length
                  const percent = Math.round((count / total) * 100)
                  return (
                    <div key={cat} className="text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold">{cfg.label}</span>
                        <span className="text-ink-black/50">{count}/{total}</span>
                      </div>
                      <div className="h-2 bg-ink-black/10 border border-ink-black/30">
                        <motion.div
                          className={`h-full ${cfg.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {selectedFragments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {selectedFragments.map((f) => (
                  <span
                    key={f.id}
                    className="text-xs bg-wall-cream px-2 py-1 border-2 border-ink-black/50"
                  >
                    {f.emoji} {f.content}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="relative bg-electric-teal/10 sticker-border p-5">
            <Tape color="teal" rotate={3} width={55} className="top-0 right-4" />
            <div className="pt-2 space-y-3">
              <div>
                <label className="block text-sm font-bold text-ink-black mb-1">
                  我的昵称（可选）
                </label>
                <input
                  type="text"
                  placeholder="给自己起个名字吧"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-3 py-2 border-3 border-ink-black bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-orange"
                  style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink-black mb-1">
                  我的座右铭（可选）
                </label>
                <textarea
                  placeholder="一句话介绍自己..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border-3 border-ink-black bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-orange resize-none"
                  style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border-3 border-ink-black font-bold text-ink-black"
              style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={18} />
              清空
            </motion.button>
            <motion.button
              className={`flex-[2] inline-flex items-center justify-center gap-2 px-4 py-3 font-bold border-3 border-ink-black ${
                selectedIds.length >= 5
                  ? 'bg-neon-orange text-white sticker-btn'
                  : 'bg-ink-black/20 text-ink-black/40 cursor-not-allowed'
              }`}
              style={{
                boxShadow: selectedIds.length >= 5 ? '3px 3px 0 #1A1A1A' : 'none',
              }}
              onClick={handleGenerate}
              disabled={selectedIds.length < 5}
              whileHover={selectedIds.length >= 5 ? { scale: 1.03 } : {}}
              whileTap={selectedIds.length >= 5 ? { scale: 0.97 } : {}}
            >
              <Sparkles size={18} />
              生成身份卡
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCard && (
          <motion.div
            className="fixed inset-0 bg-ink-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCard(false)}
          >
            <motion.div
              className="relative w-full max-w-md"
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: -2 }}
              exit={{ scale: 0.8, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Tape color="yellow" rotate={-6} width={90} className="top-0 left-1/2 -translate-x-1/2 z-20" />

              <div className="relative bg-wall-cream sticker-border p-6">
                <div className="absolute top-4 right-4 px-3 py-1 bg-neon-orange text-white text-xs font-bold border-2 border-ink-black"
                  style={{ transform: 'rotate(5deg)', boxShadow: '2px 2px 0 #1A1A1A' }}>
                  OFFICIAL
                </div>

                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">🪪</div>
                  <h3 className="handwritten text-3xl text-ink-black">流动少年身份卡</h3>
                  <p className="text-xs text-ink-black/50 mt-1">
                    ID: {String(Date.now()).slice(-8)}
                  </p>
                </div>

                <div className="bg-white border-3 border-ink-black p-4 mb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 bg-neon-pink border-3 border-ink-black flex items-center justify-center text-3xl">
                      🧑
                    </div>
                    <div>
                      <p className="text-xs text-ink-black/50">昵称</p>
                      <p className="handwritten text-xl text-ink-black">
                        {nickname || '流动少年'}
                      </p>
                    </div>
                  </div>
                  <div className="border-t-2 border-dashed border-ink-black/20 pt-3">
                    <p className="text-xs text-ink-black/50 mb-1">个人标签</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFragments.slice(0, 8).map((f) => (
                        <span key={f.id} className="text-xs bg-wall-cream px-2 py-0.5 border border-ink-black/30">
                          {f.emoji}
                        </span>
                      ))}
                      {selectedFragments.length > 8 && (
                        <span className="text-xs text-ink-black/50">+{selectedFragments.length - 8}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-neon-orange/10 border-2 border-dashed border-neon-orange/30 p-3 mb-4">
                  <p className="text-xs text-neon-orange mb-1">💬 我的座右铭</p>
                  <p className="text-sm text-ink-black/80 italic">
                    "{quote || '我的故事，还在继续书写中...'}"
                  </p>
                </div>

                <p className="text-center text-xs text-ink-black/40">
                  签发于 {new Date().toLocaleDateString('zh-CN')} · 城中村少年街头博物馆
                </p>
              </div>

              <div className="mt-4 flex gap-3 justify-center">
                <motion.button
                  className={`inline-flex items-center gap-2 px-5 py-2 font-bold border-3 border-ink-black ${
                    saveSuccess
                      ? 'bg-alley-green text-white'
                      : 'bg-alley-green text-white'
                  }`}
                  style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
                  onClick={handleSaveImage}
                  disabled={isSaving}
                  whileTap={{ scale: 0.95 }}
                  whileHover={!isSaving && !saveSuccess ? { scale: 1.05 } : {}}
                >
                  {saveSuccess ? (
                    <>
                      <Check size={16} />
                      已保存
                    </>
                  ) : isSaving ? (
                    <>
                      <Download size={16} className="animate-pulse" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      保存图片
                    </>
                  )}
                </motion.button>
                <motion.button
                  className="inline-flex items-center gap-2 px-5 py-2 bg-white font-bold border-3 border-ink-black"
                  style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
                  onClick={() => setShowCard(false)}
                  whileTap={{ scale: 0.95 }}
                >
                  关闭
                </motion.button>
              </div>

              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
