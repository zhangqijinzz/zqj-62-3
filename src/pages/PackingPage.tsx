import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Package, RotateCcw, Clock, CheckCircle2, X } from 'lucide-react'
import PageWrapper from '@/components/PageWrapper'
import Tape from '@/components/Tape'
import { useAppStore } from '@/store/useAppStore'
import { packingItemTemplates } from '@/data/packingItems'
import type { PackedItem, PackingItemTemplate, ItemSize } from '@/types'

const GRID_SIZE = 6
const sizeMap: Record<ItemSize, { w: number; h: number }> = {
  small: { w: 1, h: 1 },
  medium: { w: 2, h: 1 },
  large: { w: 2, h: 2 },
}

const sizeLabel: Record<ItemSize, string> = {
  small: '小',
  medium: '中',
  large: '大',
}

export default function PackingPage() {
  const [grid, setGrid] = useState<(PackedItem | null)[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)),
  )
  const [selectedItem, setSelectedItem] = useState<PackingItemTemplate | null>(null)
  const [currentMemory, setCurrentMemory] = useState<{ itemName: string; story: string; emoji: string } | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const movingRecords = useAppStore((state) => state.movingRecords)
  const addMovingRecord = useAppStore((state) => state.addMovingRecord)

  const availableItems = useMemo(() => {
    const usedIds = new Set(
      grid.flat().filter((i): i is PackedItem => i !== null).map((i) => i.templateId),
    )
    return packingItemTemplates.filter((t) => !usedIds.has(t.id))
  }, [grid])

  const packedItems = useMemo(
    () => grid.flat().filter((i): i is PackedItem => i !== null),
    [grid],
  )

  const canPlace = useCallback(
    (template: PackingItemTemplate, startX: number, startY: number): boolean => {
      const { w, h } = sizeMap[template.size]
      if (startX + w > GRID_SIZE || startY + h > GRID_SIZE) return false
      for (let y = startY; y < startY + h; y++) {
        for (let x = startX; x < startX + w; x++) {
          if (grid[y][x] !== null) return false
        }
      }
      return true
    },
    [grid],
  )

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (!selectedItem) {
        const item = grid[y][x]
        if (item) {
          setCurrentMemory({
            itemName: item.name,
            story: item.memoryStory,
            emoji: item.emoji,
          })
        }
        return
      }

      if (!canPlace(selectedItem, x, y)) return

      const { w, h } = sizeMap[selectedItem.size]
      const memory = selectedItem.memoryPrompts[
        Math.floor(Math.random() * selectedItem.memoryPrompts.length)
      ]

      const newItem: PackedItem = {
        id: `packed-${Date.now()}`,
        templateId: selectedItem.id,
        name: selectedItem.name,
        category: selectedItem.category,
        size: selectedItem.size,
        memoryStory: memory,
        emoji: selectedItem.emoji,
        gridX: x,
        gridY: y,
      }

      const newGrid = grid.map((row) => [...row])
      for (let yy = y; yy < y + h; yy++) {
        for (let xx = x; xx < x + w; xx++) {
          newGrid[yy][xx] = newItem
        }
      }

      setGrid(newGrid)
      setSelectedItem(null)
      setCurrentMemory({
        itemName: selectedItem.name,
        story: memory,
        emoji: selectedItem.emoji,
      })
    },
    [selectedItem, grid, canPlace],
  )

  const handleReset = () => {
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)))
    setSelectedItem(null)
    setCurrentMemory(null)
    setShowSuccess(false)
  }

  const handleFinish = () => {
    if (packedItems.length < 3) return
    const record = {
      id: `move-${Date.now()}`,
      fromAddress: '上一个城中村',
      toAddress: '下一个城中村',
      moveDate: new Date().toISOString().split('T')[0],
      description: `这次打包了 ${packedItems.length} 件充满回忆的物品`,
      items: packedItems,
    }
    addMovingRecord(record)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const usedCapacity = packedItems.reduce((sum, item) => {
    const { w, h } = sizeMap[item.size]
    return sum + w * h
  }, 0)
  const totalCapacity = GRID_SIZE * GRID_SIZE
  const capacityPercent = Math.round((usedCapacity / totalCapacity) * 100)

  return (
    <PageWrapper>
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="handwritten text-4xl md:text-6xl text-ink-black mb-3">
          📦 搬家打包游戏
        </h1>
        <p className="text-ink-black/60 max-w-lg mx-auto">
          在有限的纸箱空间里，选择你最想带走的记忆
        </p>
        {movingRecords.length > 0 && (
          <Link
            to="/packing/timeline"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white border-3 border-ink-black font-bold text-ink-black"
            style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
          >
            <Clock size={18} />
            我的搬家时间线 ({movingRecords.length})
          </Link>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="relative">
            <div
              className="relative bg-earth-brown/20 sticker-border p-4"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139,90,43,0.1) 10px, rgba(139,90,43,0.1) 20px)
                `,
              }}
            >
              <Tape color="yellow" rotate={-5} width={90} className="top-0 left-8" />
              <Tape color="orange" rotate={4} width={80} className="top-0 right-8" />

              <div className="pt-4 mb-4 flex items-center justify-between">
                <h3 className="handwritten text-2xl text-ink-black">搬家纸箱</h3>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-4 bg-white border-2 border-ink-black overflow-hidden">
                    <motion.div
                      className="h-full bg-neon-orange"
                      initial={{ width: 0 }}
                      animate={{ width: `${capacityPercent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-sm font-bold text-ink-black">
                    {usedCapacity}/{totalCapacity}
                  </span>
                </div>
              </div>

              <div className="relative aspect-square max-w-md mx-auto bg-wall-cream border-3 border-ink-black p-2">
                <div className="grid grid-cols-6 gap-0.5 w-full h-full">
                  {grid.map((row, y) =>
                    row.map((cell, x) => {
                      const isTopLeft =
                        cell && cell.gridX === x && cell.gridY === y
                      const { w, h } = cell
                        ? sizeMap[cell.size]
                        : { w: 1, h: 1 }
                      const canPlaceHere =
                        selectedItem && canPlace(selectedItem, x, y)

                      return (
                        <motion.div
                          key={`${x}-${y}`}
                          className={`relative border border-earth-brown/30 transition-colors cursor-pointer ${
                            canPlaceHere
                              ? 'bg-neon-orange/30 hover:bg-neon-orange/50'
                              : selectedItem
                                ? 'bg-white/50 hover:bg-neon-pink/20'
                                : 'bg-white/30 hover:bg-white/60'
                          }`}
                          onClick={() => handleCellClick(x, y)}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isTopLeft && (
                            <motion.div
                              className={`absolute inset-0 ${
                                cell.size === 'large'
                                  ? 'bg-electric-teal'
                                  : cell.size === 'medium'
                                    ? 'bg-neon-pink'
                                    : 'bg-neon-orange'
                              } border-2 border-ink-black flex items-center justify-center overflow-hidden z-10`}
                              style={{
                                width: `${w * 100}%`,
                                height: `${h * 100}%`,
                                boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
                              }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <span className="text-2xl md:text-3xl">{cell.emoji}</span>
                            </motion.div>
                          )}
                        </motion.div>
                      )
                    }),
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <motion.button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border-3 border-ink-black font-bold text-ink-black"
                  style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
                  onClick={handleReset}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw size={18} />
                  重新打包
                </motion.button>
                <AnimatePresence>
                  {packedItems.length >= 3 && !showSuccess && (
                    <motion.button
                      className="sticker-btn bg-alley-green text-white inline-flex items-center gap-2"
                      onClick={handleFinish}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <CheckCircle2 size={18} />
                      完成这次搬家
                    </motion.button>
                  )}
                  {showSuccess && (
                    <motion.div
                      className="inline-flex items-center gap-2 px-5 py-3 bg-alley-green text-white font-bold border-3 border-ink-black"
                      style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✅ 已记录到搬家时间线！
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="relative bg-white sticker-border p-5">
            <Tape color="pink" rotate={-3} width={60} className="top-0 left-4" />
            <h3 className="handwritten text-2xl text-ink-black mb-4 pt-2">
              待打包物品 ({availableItems.length})
            </h3>
            <p className="text-xs text-ink-black/50 mb-3">
              {selectedItem
                ? `已选「${selectedItem.name}」，点击纸箱空位放置`
                : '点击物品选择，再点击纸箱放置'}
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {availableItems.map((item) => (
                <motion.button
                  key={item.id}
                  className={`relative p-3 border-3 border-ink-black text-left transition-all ${
                    selectedItem?.id === item.id
                      ? 'bg-neon-orange text-white'
                      : 'bg-wall-cream hover:bg-wall-cream/80'
                  }`}
                  style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
                  onClick={() =>
                    setSelectedItem(selectedItem?.id === item.id ? null : item)
                  }
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <div className="text-xs font-bold truncate">{item.name}</div>
                  <div className="text-[10px] opacity-70">
                    {sizeLabel[item.size]} · {item.category}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentMemory && (
              <motion.div
                key="memory"
                className="relative bg-wall-cream sticker-border p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring' }}
              >
                <Tape color="teal" rotate={3} width={55} className="top-0 right-4" />
                <button
                  className="absolute top-2 left-2 p-1"
                  onClick={() => setCurrentMemory(null)}
                >
                  <X size={16} className="text-ink-black/50" />
                </button>
                <div className="pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-4xl">{currentMemory.emoji}</div>
                    <h4 className="handwritten text-xl text-ink-black">
                      {currentMemory.itemName}
                    </h4>
                  </div>
                  <div className="relative bg-white/70 border-2 border-dashed border-ink-black/30 p-4">
                    <div className="absolute -top-2 left-4 bg-wall-cream px-2 text-xs text-ink-black/50">
                      📝 记忆故事
                    </div>
                    <p className="text-sm text-ink-black/80 leading-relaxed italic">
                      "{currentMemory.story}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative bg-neon-orange/10 sticker-border p-4">
            <Package size={18} className="inline-block text-neon-orange mr-2" />
            <span className="text-sm text-ink-black/70">
              已装入 <b className="text-ink-black">{packedItems.length}</b> 件物品
              {packedItems.length < 3 && (
                <span className="text-neon-orange ml-2">
                  （至少装3件才能完成搬家）
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
