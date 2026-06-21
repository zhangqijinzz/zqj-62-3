import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Users, Sparkles } from 'lucide-react'
import PageWrapper from '@/components/PageWrapper'
import Tape from '@/components/Tape'
import { useAppStore } from '@/store/useAppStore'
import { identityFragments } from '@/data/identityFragments'

export default function CommunityPage() {
  const identityCards = useAppStore((state) => state.identityCards)
  const getFragmentPopularity = useAppStore((state) => state.getFragmentPopularity)

  const topFragments = getFragmentPopularity()
    .slice(0, 10)
    .map((item) => ({
      fragment: item.fragment,
      count: item.count,
    }))

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/identity"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-3 border-ink-black font-bold text-ink-black"
          style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
        >
          <ArrowLeft size={18} />
          返回拼图
        </Link>
        <h1 className="handwritten text-3xl md:text-4xl text-ink-black">
          👥 群体共鸣
        </h1>
        <Link
          to="/identity/resonance"
          className="inline-flex items-center gap-2 px-4 py-2 bg-neon-orange text-white border-3 border-ink-black font-bold"
          style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
        >
          <Sparkles size={18} />
          共鸣墙
        </Link>
      </div>

      {identityCards.length === 0 ? (
        <motion.div
          className="text-center py-20 bg-white sticker-border"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">🤝</div>
          <h3 className="handwritten text-2xl text-ink-black mb-2">还没有身份卡</h3>
          <p className="text-ink-black/60 mb-6">先去生成你的第一张身份卡，然后看看你和多少人有共鸣！</p>
          <Link to="/identity" className="sticker-btn bg-neon-orange text-white inline-flex items-center">
            🧩 去生成身份卡
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative bg-white sticker-border p-6">
            <Tape color="pink" rotate={-4} width={70} className="top-0 left-6" />
            <div className="pt-2">
              <h3 className="handwritten text-2xl text-ink-black mb-4 flex items-center gap-2">
                <Users size={22} />
                最普遍的经历 TOP 10
              </h3>
              <p className="text-sm text-ink-black/50 mb-4">
                共有 {identityCards.length} 位少年参与了拼图
              </p>
              <div className="space-y-3">
                {topFragments.map((item, index) => {
                  if (!item.fragment) return null
                  const maxCount = topFragments[0]?.count || 1
                  const percent = Math.round((item.count / maxCount) * 100)
                  return (
                    <motion.div
                      key={item.fragment.id}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="w-8 h-8 flex items-center justify-center font-bold text-sm bg-neon-orange text-white border-2 border-ink-black shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold flex items-center gap-1.5">
                            <span>{item.fragment.emoji}</span>
                            {item.fragment.content}
                          </span>
                          <span className="text-xs text-ink-black/50">
                            {item.count} 人
                          </span>
                        </div>
                        <div className="h-3 bg-ink-black/10 border border-ink-black/30">
                          <motion.div
                            className="h-full bg-gradient-to-r from-neon-orange to-neon-pink"
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ delay: 0.3 + index * 0.05, duration: 0.6 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="relative bg-electric-teal/10 sticker-border p-6">
              <Tape color="teal" rotate={3} width={65} className="top-0 right-6" />
              <div className="pt-2">
                <h3 className="handwritten text-2xl text-ink-black mb-4">
                  💡 你并不孤单
                </h3>
                <div className="space-y-3 text-ink-black/80 text-sm leading-relaxed">
                  <p>
                    数据显示，<b className="text-neon-orange">很多孩子和你一样</b>，
                    转过好几次学、搬过好几次家。
                  </p>
                  <p>
                    有超过 <b className="text-alley-green">70%</b> 的少年选择了
                    "学会了自己照顾自己"这条经历。
                  </p>
                  <p>
                    每一个看似平凡的日常，都是你<b>独特成长轨迹</b>的一部分。
                  </p>
                  <p className="handwritten text-lg text-ink-black pt-2">
                    "流动"不是遗憾，而是你的超能力。✨
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="handwritten text-xl text-ink-black mb-3">
                📇 已生成的身份卡 ({identityCards.length})
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {identityCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    className="relative bg-wall-cream sticker-border p-3"
                    style={{ transform: `rotate(${(index % 3 - 1) * 2}deg)` }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ rotate: 0, y: -2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-neon-pink border-2 border-ink-black flex items-center justify-center text-lg">
                        🧑
                      </div>
                      <div>
                        <p className="text-xs text-ink-black/50">昵称</p>
                        <p className="handwritten text-sm text-ink-black">{card.nickname}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-0.5">
                      {card.selectedFragments.slice(0, 6).map((id) => {
                        const frag = identityFragments.find((f) => f.id === id)
                        return frag ? (
                          <span key={id} className="text-sm">{frag.emoji}</span>
                        ) : null
                      })}
                    </div>
                    <p className="text-[10px] text-ink-black/40 mt-2">
                      {new Date(card.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
