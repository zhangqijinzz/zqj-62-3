import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Play, RotateCcw, Trophy, BookOpen, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import PageWrapper from '@/components/PageWrapper'
import Tape from '@/components/Tape'
import { useAppStore } from '@/store/useAppStore'

interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: 'box' | 'awning' | 'cart'
}

interface Fragment {
  x: number
  y: number
  collected: boolean
  storyId: string
  id: string
}

interface Player {
  x: number
  y: number
  vy: number
  onGround: boolean
}

const GAME_WIDTH = 800
const GAME_HEIGHT = 400
const PLAYER_SIZE = 40
const GRAVITY = 0.8
const JUMP_FORCE = -15
const GROUND_Y = 320
const SCROLL_SPEED = 4

const sceneColors = [
  { bg: '#E85D2B', name: '屋顶', accent: '#F4E4C1' },
  { bg: '#1B4332', name: '窄巷', accent: '#4ECDC4' },
  { bg: '#8B5A2B', name: '菜市场', accent: '#FF6B9D' },
]

export default function ParkourPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused'>('idle')
  const [score, setScore] = useState(0)
  const [collected, setCollected] = useState<string[]>([])
  const [sceneIndex, setSceneIndex] = useState(0)
  const [showUnlocked, setShowUnlocked] = useState<string | null>(null)

  const unlockStory = useAppStore((state) => state.unlockStory)
  const cityStories = useAppStore((state) => state.cityStories)

  const playerRef = useRef<Player>({ x: 80, y: GROUND_Y - PLAYER_SIZE, vy: 0, onGround: true })
  const obstaclesRef = useRef<Obstacle[]>([])
  const fragmentsRef = useRef<Fragment[]>([])
  const scrollXRef = useRef(0)
  const animationRef = useRef<number>(0)
  const keysRef = useRef<Record<string, boolean>>({})
  const lastSpawnRef = useRef(0)

  const resetGame = useCallback(() => {
    playerRef.current = { x: 80, y: GROUND_Y - PLAYER_SIZE, vy: 0, onGround: true }
    obstaclesRef.current = []
    fragmentsRef.current = []
    scrollXRef.current = 0
    lastSpawnRef.current = 0
    setScore(0)
    setCollected([])
    setSceneIndex(0)
  }, [])

  const spawnEntities = useCallback(() => {
    const scrollX = scrollXRef.current

    if (scrollX - lastSpawnRef.current > 300) {
      lastSpawnRef.current = scrollX

      if (Math.random() < 0.7) {
        const type = Math.random() < 0.5 ? 'box' : Math.random() < 0.5 ? 'awning' : 'cart'
        const height = type === 'awning' ? 30 : type === 'box' ? 60 : 80
        const width = type === 'awning' ? 80 : 50
        obstaclesRef.current.push({
          x: GAME_WIDTH + 50,
          y: GROUND_Y - height,
          width,
          height,
          type,
        })
      }

      if (Math.random() < 0.6) {
        const storyIndex = Math.floor(Math.random() * cityStories.length)
        const story = cityStories[storyIndex]
        fragmentsRef.current.push({
          x: GAME_WIDTH + 100 + Math.random() * 100,
          y: GROUND_Y - 100 - Math.random() * 120,
          collected: false,
          storyId: story.id,
          id: `frag-${Date.now()}-${Math.random()}`,
        })
      }
    }
  }, [cityStories])

  const checkCollision = useCallback(
    (rect1: { x: number; y: number; width: number; height: number }, rect2: { x: number; y: number; width: number; height: number }) => {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      )
    },
    [],
  )

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const player = playerRef.current
    const scene = sceneColors[sceneIndex % sceneColors.length]

    if (keysRef.current['ArrowUp'] || keysRef.current[' '] || keysRef.current['w']) {
      if (player.onGround) {
        player.vy = JUMP_FORCE
        player.onGround = false
      }
    }
    if ((keysRef.current['ArrowDown'] || keysRef.current['s']) && !player.onGround) {
      player.vy += 2
    }

    player.vy += GRAVITY
    player.y += player.vy

    if (player.y >= GROUND_Y - PLAYER_SIZE) {
      player.y = GROUND_Y - PLAYER_SIZE
      player.vy = 0
      player.onGround = true
    }

    scrollXRef.current += SCROLL_SPEED
    setScore((s) => s + 1)

    const newSceneIndex = Math.floor(scrollXRef.current / 3000) % sceneColors.length
    if (newSceneIndex !== sceneIndex) {
      setSceneIndex(newSceneIndex)
    }

    obstaclesRef.current = obstaclesRef.current
      .map((o) => ({ ...o, x: o.x - SCROLL_SPEED }))
      .filter((o) => o.x + o.width > -50)

    fragmentsRef.current = fragmentsRef.current
      .map((f) => ({ ...f, x: f.x - SCROLL_SPEED }))
      .filter((f) => f.x > -50)

    spawnEntities()

    for (const obstacle of obstaclesRef.current) {
      if (
        checkCollision(
          { x: player.x, y: player.y, width: PLAYER_SIZE, height: PLAYER_SIZE },
          obstacle,
        )
      ) {
        player.y = obstacle.y - PLAYER_SIZE
        if (player.y < GROUND_Y - PLAYER_SIZE) {
          player.onGround = true
          player.vy = 0
        }
      }
    }

    for (const fragment of fragmentsRef.current) {
      if (!fragment.collected) {
        if (
          checkCollision(
            { x: player.x, y: player.y, width: PLAYER_SIZE, height: PLAYER_SIZE },
            { x: fragment.x, y: fragment.y, width: 30, height: 30 },
          )
        ) {
          fragment.collected = true
          setCollected((c) => {
            if (!c.includes(fragment.storyId)) {
              unlockStory(fragment.storyId)
              setShowUnlocked(fragment.storyId)
              setTimeout(() => setShowUnlocked(null), 2500)
              return [...c, fragment.storyId]
            }
            return c
          })
        }
      }
    }

    ctx.fillStyle = scene.bg
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

    for (let i = 0; i < 8; i++) {
      const x = ((i * 150 - scrollXRef.current * 0.3) % (GAME_WIDTH + 200)) - 100
      ctx.fillStyle = `${scene.accent}22`
      ctx.fillRect(x, 50, 80, 200)
      ctx.fillStyle = `${scene.accent}44`
      ctx.fillRect(x + 85, 80, 60, 170)
    }

    ctx.fillStyle = '#1A1A1A'
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y)

    ctx.strokeStyle = scene.accent
    ctx.lineWidth = 3
    ctx.setLineDash([20, 10])
    ctx.beginPath()
    ctx.moveTo(0, GROUND_Y)
    ctx.lineTo(GAME_WIDTH, GROUND_Y)
    ctx.stroke()
    ctx.setLineDash([])

    for (const obstacle of obstaclesRef.current) {
      if (obstacle.type === 'box') {
        ctx.fillStyle = '#8B5A2B'
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        ctx.strokeStyle = '#1A1A1A'
        ctx.lineWidth = 3
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        ctx.beginPath()
        ctx.moveTo(obstacle.x, obstacle.y + obstacle.height / 2)
        ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height / 2)
        ctx.stroke()
      } else if (obstacle.type === 'awning') {
        ctx.fillStyle = '#FF6B9D'
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        ctx.strokeStyle = '#1A1A1A'
        ctx.lineWidth = 2
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        for (let i = 0; i < obstacle.width; i += 15) {
          ctx.beginPath()
          ctx.moveTo(obstacle.x + i, obstacle.y + obstacle.height)
          ctx.lineTo(obstacle.x + i + 7, obstacle.y + obstacle.height + 8)
          ctx.lineTo(obstacle.x + i + 15, obstacle.y + obstacle.height)
          ctx.stroke()
        }
      } else {
        ctx.fillStyle = '#4ECDC4'
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        ctx.fillStyle = '#F4E4C1'
        ctx.fillRect(obstacle.x + 5, obstacle.y + 5, obstacle.width - 10, 20)
        ctx.strokeStyle = '#1A1A1A'
        ctx.lineWidth = 2
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      }
    }

    for (const fragment of fragmentsRef.current) {
      if (!fragment.collected) {
        const pulse = Math.sin(Date.now() / 200) * 5
        ctx.fillStyle = '#FFD700'
        ctx.beginPath()
        ctx.arc(fragment.x + 15, fragment.y + 15, 15 + pulse, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#1A1A1A'
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.fillStyle = '#1A1A1A'
        ctx.font = 'bold 16px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('✨', fragment.x + 15, fragment.y + 15)
      }
    }

    ctx.save()
    ctx.translate(player.x + PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2)
    const stretch = player.onGround ? 1 : 0.9
    ctx.scale(1.1, stretch)
    ctx.fillStyle = '#F4E4C1'
    ctx.beginPath()
    ctx.arc(0, 0, PLAYER_SIZE / 2.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#1A1A1A'
    ctx.lineWidth = 4
    ctx.stroke()
    ctx.fillStyle = '#1A1A1A'
    ctx.beginPath()
    ctx.arc(-6, -4, 3, 0, Math.PI * 2)
    ctx.arc(6, -4, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#1A1A1A'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 4, 8, 0, Math.PI)
    ctx.stroke()
    ctx.restore()

    animationRef.current = requestAnimationFrame(gameLoop)
  }, [sceneIndex, spawnEntities, checkCollision, unlockStory])

  useEffect(() => {
    if (gameState !== 'playing') {
      cancelAnimationFrame(animationRef.current)
      return
    }

    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = GAME_WIDTH
      canvas.height = GAME_HEIGHT
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => cancelAnimationFrame(animationRef.current)
  }, [gameState, gameLoop])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true
      if (e.key === ' ' || e.key.startsWith('Arrow')) e.preventDefault()
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const handleMobileControl = (key: string, pressed: boolean) => {
    keysRef.current[key] = pressed
  }

  const unlockedStories = cityStories.filter((s) => s.unlocked).length

  return (
    <PageWrapper>
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="handwritten text-4xl md:text-6xl text-ink-black mb-3">
          🏃 城市边缘跑酷
        </h1>
        <p className="text-ink-black/60 max-w-lg mx-auto">
          在屋顶、窄巷、菜市场之间穿梭，收集闪闪发光的城市碎片
        </p>
        <Link
          to="/parkour/stories"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white border-3 border-ink-black font-bold text-ink-black"
          style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
        >
          <BookOpen size={18} />
          城市故事集 ({unlockedStories}/{cityStories.length})
        </Link>
      </motion.div>

      <div className="relative">
        <div className="relative bg-white sticker-border overflow-hidden">
          <Tape color="yellow" rotate={-4} width={70} className="top-0 left-6 z-20" />
          <Tape color="pink" rotate={5} width={60} className="top-0 right-6 z-20" />

          <div className="flex items-center justify-between px-4 py-2 border-b-3 border-ink-black bg-wall-cream/50">
            <div className="flex items-center gap-4">
              <span className="font-bold text-ink-black">
                🏃 距离: {Math.floor(score / 10)}m
              </span>
              <span className="font-bold text-neon-orange">
                ✨ 碎片: {collected.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 text-sm font-bold border-2 border-ink-black"
                style={{ backgroundColor: sceneColors[sceneIndex].accent }}
              >
                {sceneColors[sceneIndex].name}
              </span>
              {gameState === 'playing' ? (
                <motion.button
                  className="px-3 py-1 bg-neon-pink border-2 border-ink-black font-bold text-white text-sm"
                  style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
                  onClick={() => setGameState('idle')}
                  whileTap={{ scale: 0.95 }}
                >
                  暂停
                </motion.button>
              ) : (
                <motion.button
                  className="inline-flex items-center gap-1 px-3 py-1 bg-alley-green border-2 border-ink-black font-bold text-white text-sm"
                  style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
                  onClick={() => {
                    if (gameState === 'idle' && score === 0) resetGame()
                    setGameState('playing')
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={14} />
                  {score === 0 ? '开始' : '继续'}
                </motion.button>
              )}
              {score > 0 && (
                <motion.button
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white border-2 border-ink-black font-bold text-sm"
                  style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
                  onClick={() => {
                    resetGame()
                    setGameState('idle')
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw size={14} />
                  重来
                </motion.button>
              )}
            </div>
          </div>

          <div className="relative bg-ink-black/10">
            <canvas
              ref={canvasRef}
              className="w-full h-auto block"
              style={{ maxHeight: '500px' }}
            />

            <AnimatePresence>
              {gameState === 'idle' && score === 0 && (
                <motion.div
                  className="absolute inset-0 bg-ink-black/70 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center text-white p-8">
                    <div className="text-6xl mb-4">🏃‍♂️</div>
                    <h3 className="handwritten text-3xl mb-3">准备好了吗？</h3>
                    <p className="text-white/80 mb-2">按 ↑ 或 空格 跳跃</p>
                    <p className="text-white/80 mb-6">按 ↓ 快速下落</p>
                    <motion.button
                      className="sticker-btn bg-neon-orange text-white inline-flex items-center gap-2"
                      onClick={() => {
                        resetGame()
                        setGameState('playing')
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play size={20} />
                      开始跑酷
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {showUnlocked && (
                <motion.div
                  className="absolute top-20 left-1/2 -translate-x-1/2 bg-neon-orange border-3 border-ink-black px-6 py-3 z-10"
                  style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, y: -20 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Trophy size={20} className="inline-block mr-2 text-white" />
                  <span className="font-bold text-white">解锁新故事！</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="md:hidden border-t-3 border-ink-black p-3">
            <div className="flex justify-center gap-3">
              <motion.button
                className="w-20 h-20 bg-neon-orange border-3 border-ink-black flex items-center justify-center text-white"
                style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
                onTouchStart={() => handleMobileControl('ArrowUp', true)}
                onTouchEnd={() => handleMobileControl('ArrowUp', false)}
                onMouseDown={() => handleMobileControl('ArrowUp', true)}
                onMouseUp={() => handleMobileControl('ArrowUp', false)}
                onMouseLeave={() => handleMobileControl('ArrowUp', false)}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowUp size={36} />
              </motion.button>
              <motion.button
                className="w-20 h-20 bg-electric-teal border-3 border-ink-black flex items-center justify-center text-white"
                style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
                onTouchStart={() => handleMobileControl('ArrowDown', true)}
                onTouchEnd={() => handleMobileControl('ArrowDown', false)}
                onMouseDown={() => handleMobileControl('ArrowDown', true)}
                onMouseUp={() => handleMobileControl('ArrowDown', false)}
                onMouseLeave={() => handleMobileControl('ArrowDown', false)}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowDown size={36} />
              </motion.button>
            </div>
            <p className="text-center text-xs text-ink-black/50 mt-2">
              ↑ 跳跃 &nbsp;&nbsp; ↓ 快速下落 &nbsp;&nbsp; （PC 可用键盘方向键/空格）
            </p>
          </div>
        </div>

        <div className="hidden md:block mt-4 text-center text-sm text-ink-black/50">
          <ArrowUp className="inline mx-1" size={16} /> / 空格 跳跃 &nbsp;·&nbsp;
          <ArrowDown className="inline mx-1" size={16} /> / S 快速下落 &nbsp;·&nbsp;
          <ArrowLeft className="inline mx-1" size={16} />
          <ArrowRight className="inline mx-1" size={16} /> 预留
        </div>
      </div>
    </PageWrapper>
  )
}
