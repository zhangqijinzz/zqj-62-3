import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Camera, Upload, Archive, Sparkles, X, Save } from 'lucide-react'
import PageWrapper from '@/components/PageWrapper'
import Tape from '@/components/Tape'
import { useAppStore } from '@/store/useAppStore'
import { streetElements } from '@/data/streetElements'
import type { StreetArchive, StreetCategory } from '@/types'

const categoryColors: Record<StreetCategory, string> = {
  '招牌': 'bg-neon-orange',
  '涂鸦': 'bg-neon-pink',
  '小广告': 'bg-electric-teal',
  '方言标语': 'bg-alley-green text-white',
  '其他': 'bg-earth-brown text-white',
}

const sampleImages = [
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20neon%20street%20signs%20in%20a%20narrow%20Chinese%20urban%20village%20alley%20at%20night%20with%20graffiti&image_size=square',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=old%20Chinese%20street%20shop%20front%20with%20handwritten%20signs%20warm%20evening%20light&image_size=square',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=urban%20village%20alley%20wall%20covered%20in%20colorful%20graffiti%20art%20and%20stickers&image_size=square',
]

export default function ScannerPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<StreetArchive | null>(null)
  const [showSaved, setShowSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addArchive = useAppStore((state) => state.addArchive)
  const archives = useAppStore((state) => state.archives)

  const handleImageSelect = useCallback((url: string) => {
    setImageUrl(url)
    setScanResult(null)
    setIsScanning(true)

    setTimeout(() => {
      const randomElement = streetElements[Math.floor(Math.random() * streetElements.length)]
      const elements = [
        { label: '主招牌', x: 20 + Math.random() * 30, y: 20 + Math.random() * 20 },
        { label: '涂鸦标记', x: 50 + Math.random() * 20, y: 40 + Math.random() * 20 },
        { label: '小字标语', x: 10 + Math.random() * 20, y: 60 + Math.random() * 20 },
      ]

      const result: StreetArchive = {
        id: `archive-${Date.now()}`,
        imageUrl: url,
        title: randomElement.templateTitle,
        category: randomElement.category,
        story: randomElement.templateStory,
        elements,
        createdAt: Date.now(),
      }

      setScanResult(result)
      setIsScanning(false)
    }, 2500)
  }, [])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        handleImageSelect(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [handleImageSelect])

  const handleSave = useCallback(() => {
    if (scanResult) {
      addArchive(scanResult)
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
    }
  }, [scanResult, addArchive])

  const handleReset = useCallback(() => {
    setImageUrl(null)
    setScanResult(null)
    setIsScanning(false)
  }, [])

  return (
    <PageWrapper>
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="handwritten text-4xl md:text-6xl text-ink-black mb-3">
          📸 街区扫描仪
        </h1>
        <p className="text-ink-black/60 max-w-lg mx-auto">
          拍下城中村的街头元素，让它们说出自己的故事
        </p>
        {archives.length > 0 && (
          <Link
            to="/scanner/archive"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white border-3 border-ink-black font-bold text-ink-black"
            style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
          >
            <Archive size={18} />
            我的档案夹 ({archives.length})
          </Link>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {!imageUrl && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <motion.div
                className="relative bg-white sticker-border p-8 cursor-pointer hover:bg-neon-orange/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ y: -4, boxShadow: '6px 6px 0 #1A1A1A' }}
                whileTap={{ y: 0, boxShadow: '2px 2px 0 #1A1A1A' }}
              >
                <Tape color="yellow" rotate={-5} width={80} className="top-0 left-6" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="pt-6 text-center">
                  <motion.div
                    className="inline-flex items-center justify-center w-20 h-20 bg-neon-orange border-3 border-ink-black mb-4"
                    style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Upload size={40} className="text-white" />
                  </motion.div>
                  <h3 className="handwritten text-2xl text-ink-black mb-2">上传照片</h3>
                  <p className="text-ink-black/60 text-sm">
                    从相册选择或点击上传一张街头照片
                  </p>
                </div>
              </motion.div>
            </div>

            <div>
              <p className="font-bold text-ink-black mb-3">🎲 或者试试这些示例照片：</p>
              <div className="grid grid-cols-3 gap-3">
                {sampleImages.map((url, index) => (
                  <motion.div
                    key={index}
                    className="relative aspect-square overflow-hidden sticker-border cursor-pointer group"
                    style={{ transform: `rotate(${(index - 1) * 3}deg)` }}
                    onClick={() => handleImageSelect(url)}
                    whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={url}
                      alt={`示例 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-ink-black/0 group-hover:bg-ink-black/20 transition-colors flex items-center justify-center">
                      <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {imageUrl && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="relative">
              <div className="relative sticker-border overflow-hidden bg-white">
                <Tape color="yellow" rotate={-4} width={70} className="top-0 left-6" />
                <Tape color="pink" rotate={5} width={60} className="top-0 right-6" />

                <div className="relative aspect-square">
                  <img
                    src={imageUrl}
                    alt="扫描的照片"
                    className="w-full h-full object-cover"
                  />

                  <AnimatePresence>
                    {isScanning && (
                      <motion.div
                        className="absolute inset-0 bg-electric-teal/10 overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          className="absolute left-0 right-0 h-1 bg-electric-teal shadow-[0_0_20px_#4ECDC4]"
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        />
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="bg-white border-3 border-ink-black px-6 py-3 flex items-center gap-3"
                            style={{ boxShadow: '4px 4px 0 #1A1A1A' }}>
                            <Sparkles className="animate-spin text-neon-orange" size={24} />
                            <span className="font-bold">正在识别街头元素...</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    {scanResult && !isScanning && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {scanResult.elements.map((el, i) => (
                          <motion.div
                            key={i}
                            className="absolute"
                            style={{ left: `${el.x}%`, top: `${el.y}%` }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.2, type: 'spring' }}
                          >
                            <motion.div
                              className="w-8 h-8 rounded-full bg-neon-pink border-3 border-ink-black flex items-center justify-center text-white font-bold text-sm cursor-pointer"
                              whileHover={{ scale: 1.3 }}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                            >
                              {i + 1}
                            </motion.div>
                            <motion.div
                              className="absolute left-10 top-0 bg-white border-2 border-ink-black px-2 py-1 text-xs font-bold whitespace-nowrap"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + i * 0.2 }}
                            >
                              {el.label}
                            </motion.div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <motion.button
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white border-3 border-ink-black font-bold text-ink-black"
                style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
                onClick={handleReset}
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={18} />
                重新拍摄
              </motion.button>
            </div>

            <div>
              <AnimatePresence mode="wait">
                {scanResult && !isScanning && (
                  <motion.div
                    key="archive"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  >
                    <div className="relative bg-wall-cream sticker-border p-6">
                      <Tape color="teal" rotate={-3} width={70} className="top-0 left-1/2 -translate-x-1/2" />

                      <div className="pt-4">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`inline-block px-3 py-1 font-bold text-sm border-3 border-ink-black ${categoryColors[scanResult.category]}`}>
                            {scanResult.category}
                          </span>
                          <span className="text-ink-black/50 text-sm">
                            #{String(scanResult.createdAt).slice(-6)}
                          </span>
                        </div>

                        <h3 className="handwritten text-3xl text-ink-black mb-4">
                          {scanResult.title}
                        </h3>

                        <div className="bg-white border-3 border-ink-black p-4 mb-4">
                          <h4 className="font-bold text-ink-black mb-2 flex items-center gap-2">
                            <Sparkles size={16} className="text-neon-orange" />
                            故事解读
                          </h4>
                          <motion.p
                            className="text-ink-black/80 leading-relaxed text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            {scanResult.story}
                          </motion.p>
                        </div>

                        <div className="bg-white/50 border-2 border-dashed border-ink-black/30 p-3 mb-4">
                          <p className="text-xs text-ink-black/50 mb-2">识别到的元素：</p>
                          <div className="flex flex-wrap gap-2">
                            {scanResult.elements.map((el, i) => (
                              <span key={i} className="text-xs bg-white px-2 py-1 border-2 border-ink-black/50">
                                {i + 1}. {el.label}
                              </span>
                            ))}
                          </div>
                        </div>

                        <AnimatePresence>
                          {showSaved ? (
                            <motion.div
                              className="inline-flex items-center gap-2 px-5 py-3 bg-alley-green text-white font-bold border-3 border-ink-black"
                              style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              ✅ 已保存到档案夹！
                            </motion.div>
                          ) : (
                            <motion.button
                              className="sticker-btn bg-neon-orange text-white inline-flex items-center gap-2"
                              onClick={handleSave}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Save size={18} />
                              保存到档案夹
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
