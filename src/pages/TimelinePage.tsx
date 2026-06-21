import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Package, Calendar, MapPin } from 'lucide-react'
import PageWrapper from '@/components/PageWrapper'
import Tape from '@/components/Tape'
import { useAppStore } from '@/store/useAppStore'

export default function TimelinePage() {
  const movingRecords = useAppStore((state) => state.movingRecords)

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/packing"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-3 border-ink-black font-bold text-ink-black"
          style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
        >
          <ArrowLeft size={18} />
          返回打包游戏
        </Link>
        <h1 className="handwritten text-3xl md:text-4xl text-ink-black">
          🕰️ 我的搬家时间线
        </h1>
        <div className="w-[140px]" />
      </div>

      {movingRecords.length === 0 ? (
        <motion.div
          className="text-center py-20 bg-white sticker-border"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">🏚️</div>
          <h3 className="handwritten text-2xl text-ink-black mb-2">还没有搬家记录</h3>
          <p className="text-ink-black/60 mb-6">去打包游戏，记录你的第一次搬家吧！</p>
          <Link to="/packing" className="sticker-btn bg-neon-orange text-white inline-flex items-center">
            📦 去打包
          </Link>
        </motion.div>
      ) : (
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-earth-brown/30 -translate-x-1/2 hidden md:block" />

          <div className="space-y-10">
            {movingRecords.map((record, index) => {
              const isLeft = index % 2 === 0
              return (
                <motion.div
                  key={record.id}
                  className={`relative md:grid md:grid-cols-2 md:gap-8 ${
                    isLeft ? '' : 'md:[&>div:first-child]:col-start-2'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="hidden md:flex absolute left-1/2 top-6 w-4 h-4 -translate-x-1/2 bg-neon-orange border-3 border-ink-black rounded-full z-10" />

                  <div className={`${isLeft ? 'md:pr-8' : 'md:pl-8 md:col-start-2'}`}>
                    <div className="relative bg-white sticker-border p-5">
                      <Tape
                        color={isLeft ? 'yellow' : 'pink'}
                        rotate={isLeft ? -4 : 4}
                        width={65}
                        className={`top-0 ${isLeft ? 'left-6' : 'right-6'}`}
                      />

                      <div className="pt-2">
                        <div className="flex items-center gap-2 text-ink-black/50 text-sm mb-3">
                          <Calendar size={14} />
                          {record.moveDate}
                          <span className="ml-auto text-neon-orange font-bold">
                            第 {movingRecords.length - index} 次搬家
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-3 text-sm">
                          <MapPin size={14} className="text-neon-pink" />
                          <span className="text-ink-black/70">{record.fromAddress}</span>
                          <span className="text-ink-black/40">→</span>
                          <span className="text-ink-black/70">{record.toAddress}</span>
                        </div>

                        <p className="text-ink-black/60 text-sm mb-4">{record.description}</p>

                        <div className="border-t-2 border-dashed border-ink-black/20 pt-3">
                          <div className="flex items-center gap-2 text-sm font-bold text-ink-black/70 mb-2">
                            <Package size={14} />
                            带走了 {record.items.length} 件记忆：
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {record.items.map((item) => (
                              <motion.div
                                key={item.id}
                                className="flex items-center gap-1.5 px-2 py-1 bg-wall-cream border-2 border-ink-black/50 text-xs"
                                whileHover={{ y: -2 }}
                                title={item.memoryStory}
                              >
                                <span>{item.emoji}</span>
                                <span className="truncate max-w-[80px]">{item.name}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
