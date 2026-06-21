import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import PageWrapper from '@/components/PageWrapper'
import Tape from '@/components/Tape'
import { useAppStore } from '@/store/useAppStore'
import type { StreetCategory } from '@/types'

const categoryColors: Record<StreetCategory, string> = {
  '招牌': 'bg-neon-orange',
  '涂鸦': 'bg-neon-pink',
  '小广告': 'bg-electric-teal',
  '方言标语': 'bg-alley-green text-white',
  '其他': 'bg-earth-brown text-white',
}

export default function ArchivePage() {
  const archives = useAppStore((state) => state.archives)
  const removeArchive = useAppStore((state) => state.removeArchive)

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/scanner"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-3 border-ink-black font-bold text-ink-black"
          style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
        >
          <ArrowLeft size={18} />
          返回扫描仪
        </Link>
        <h1 className="handwritten text-3xl md:text-4xl text-ink-black">
          📁 我的街头档案 ({archives.length})
        </h1>
        <div className="w-[140px]" />
      </div>

      {archives.length === 0 ? (
        <motion.div
          className="text-center py-20 bg-white sticker-border"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">📭</div>
          <h3 className="handwritten text-2xl text-ink-black mb-2">档案夹是空的</h3>
          <p className="text-ink-black/60 mb-6">快去扫描一些街头元素吧！</p>
          <Link
            to="/scanner"
            className="sticker-btn bg-neon-orange text-white inline-flex items-center"
          >
            📸 去扫描
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {archives.map((archive, index) => (
            <motion.div
              key={archive.id}
              className="relative bg-white sticker-border overflow-hidden group"
              style={{ transform: `rotate(${(index % 3 - 1) * 2}deg)` }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={{ rotate: 0, y: -4, boxShadow: '8px 8px 0 #1A1A1A' }}
            >
              <Tape color="yellow" rotate={-4} width={60} className="top-0 left-4" />

              <div className="relative aspect-square overflow-hidden">
                <img
                  src={archive.imageUrl}
                  alt={archive.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`inline-block px-2 py-1 text-xs font-bold border-2 border-ink-black ${categoryColors[archive.category]}`}>
                    {archive.category}
                  </span>
                </div>
                <motion.button
                  className="absolute bottom-2 right-2 p-2 bg-neon-pink text-white border-2 border-ink-black opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
                  onClick={() => removeArchive(archive.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>

              <div className="p-4">
                <h3 className="handwritten text-xl text-ink-black mb-2">{archive.title}</h3>
                <p className="text-sm text-ink-black/70 line-clamp-3 leading-relaxed">
                  {archive.story}
                </p>
                <p className="text-xs text-ink-black/40 mt-3">
                  {new Date(archive.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
