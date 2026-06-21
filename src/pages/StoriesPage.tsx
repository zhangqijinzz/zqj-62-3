import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Lock, Unlock, MapPin } from 'lucide-react'
import PageWrapper from '@/components/PageWrapper'
import Tape from '@/components/Tape'
import { useAppStore } from '@/store/useAppStore'

const storyImages: Record<string, string> = {
  cs1: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=a%20boy%20doing%20homework%20on%20a%20city%20rooftop%20at%20sunset%20with%20distant%20skyscrapers%20warm%20lighting&image_size=square',
  cs2: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=children%20playing%20football%20soccer%20in%20a%20narrow%20Chinese%20alley%20urban%20village%20happy&image_size=square',
  cs3: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=a%20girl%20reading%20textbook%20at%20a%20wet%20market%20fish%20stall%20early%20morning%20China&image_size=square',
  cs4: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=a%20boy%20drawing%20in%20a%20dimly%20lit%20stairwell%20colorful%20drawings%20on%20wall%20China&image_size=square',
  cs5: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=rooftop%20vegetable%20garden%20tomatoes%20cucumbers%20elderly%20Chinese%20woman%20urban%20village&image_size=square',
  cs6: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=a%20lonely%20child%20using%20a%20public%20payphone%20at%20night%20small%20shop%20urban%20village%20China&image_size=square',
}

export default function StoriesPage() {
  const cityStories = useAppStore((state) => state.cityStories)
  const unlocked = cityStories.filter((s) => s.unlocked).length

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/parkour"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-3 border-ink-black font-bold text-ink-black"
          style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
        >
          <ArrowLeft size={18} />
          返回跑酷
        </Link>
        <h1 className="handwritten text-3xl md:text-4xl text-ink-black">
          📖 城市故事集 ({unlocked}/{cityStories.length})
        </h1>
        <div className="w-[140px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cityStories.map((story, index) => (
          <motion.div
            key={story.id}
            className={`relative sticker-border overflow-hidden ${
              story.unlocked ? 'bg-white' : 'bg-ink-black/5'
            }`}
            style={{ transform: `rotate(${(index % 3 - 1) * 1.5}deg)` }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ rotate: 0, y: -4, boxShadow: '8px 8px 0 #1A1A1A' }}
          >
            <Tape
              color={story.unlocked ? 'orange' : 'yellow'}
              rotate={-4}
              width={60}
              className="top-0 left-6"
            />

            <div className="relative aspect-video overflow-hidden">
              {story.unlocked ? (
                <img
                  src={storyImages[story.id]}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-ink-black/20 flex items-center justify-center">
                  <Lock size={48} className="text-ink-black/40" />
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                {story.unlocked ? (
                  <Unlock size={16} className="text-neon-orange" />
                ) : (
                  <Lock size={16} className="text-ink-black/40" />
                )}
                <span className={`text-sm font-bold ${story.unlocked ? 'text-neon-orange' : 'text-ink-black/40'}`}>
                  {story.unlocked ? '已解锁' : '未解锁 — 去跑酷收集碎片吧！'}
                </span>
              </div>

              <h3 className={`handwritten text-2xl mb-2 ${story.unlocked ? 'text-ink-black' : 'text-ink-black/40'}`}>
                {story.unlocked ? story.title : '???'}
              </h3>

              {story.unlocked && (
                <>
                  <div className="flex items-center gap-1 text-sm text-ink-black/50 mb-3">
                    <MapPin size={14} />
                    {story.location}
                  </div>
                  <p className="text-ink-black/70 leading-relaxed text-sm">
                    {story.content}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  )
}
