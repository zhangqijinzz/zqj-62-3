import { motion } from 'framer-motion'
import PageWrapper from '@/components/PageWrapper'
import FeatureCard from '@/components/FeatureCard'
import { Camera, Package, PersonStanding, Puzzle } from 'lucide-react'

const features = [
  {
    title: '街区扫描仪',
    subtitle: 'STREET SCANNER',
    description: '用手机拍摄城中村的招牌、涂鸦、小广告、方言标语，系统自动生成"街头艺术档案"和故事解读。',
    icon: Camera,
    color: 'bg-neon-orange',
    bgColor: 'bg-neon-orange/15',
    path: '/scanner',
    rotate: -3,
    delay: 0.2,
  },
  {
    title: '搬家打包游戏',
    subtitle: 'PACKING GAME',
    description: '将频繁搬家的经历转化为整理记忆物品的策略游戏，每件物品触发一段家庭往事。',
    icon: Package,
    color: 'bg-electric-teal',
    bgColor: 'bg-electric-teal/15',
    path: '/packing',
    rotate: 2,
    delay: 0.3,
  },
  {
    title: '城市边缘跑酷',
    subtitle: 'ALLEY PARKOUR',
    description: '以真实的城中村巷道为地图，操控角色在屋顶、窄巷、菜市场间穿梭，收集"城市碎片"。',
    icon: PersonStanding,
    color: 'bg-neon-pink',
    bgColor: 'bg-neon-pink/15',
    path: '/parkour',
    rotate: -1,
    delay: 0.4,
  },
  {
    title: '身份拼图',
    subtitle: 'IDENTITY PUZZLE',
    description: '通过选择不同的成长经历碎片，生成个人"流动少年身份卡"，发现你我之间的群体共性。',
    icon: Puzzle,
    color: 'bg-alley-green text-white',
    bgColor: 'bg-alley-green/15',
    path: '/identity',
    rotate: 3,
    delay: 0.5,
  },
]

const showcaseItems = [
  { type: '档案', title: '阿明理发店', emoji: '💈', rotate: -4, color: 'bg-neon-orange' },
  { type: '身份卡', title: '阿杰的卡', emoji: '🪪', rotate: 2, color: 'bg-electric-teal' },
  { type: '成就', title: '收集达人', emoji: '🏆', rotate: -2, color: 'bg-neon-pink' },
  { type: '故事', title: '屋顶星空', emoji: '🌟', rotate: 4, color: 'bg-alley-green text-white' },
  { type: '档案', title: '巷口涂鸦', emoji: '🎨', rotate: -3, color: 'bg-wall-cream' },
  { type: '时间线', title: '搬家史', emoji: '📦', rotate: 1, color: 'bg-electric-teal' },
]

export default function HomePage() {
  return (
    <PageWrapper>
      <section className="relative py-12 md:py-20 mb-16">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-10 -left-10 text-8xl md:text-9xl opacity-10"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 20 }}
          >
            🏘️
          </motion.div>
          <motion.div
            className="absolute top-20 right-0 text-6xl md:text-8xl opacity-10"
            animate={{ rotate: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 15, delay: 2 }}
          >
            🎨
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-1/3 text-7xl md:text-8xl opacity-10"
            animate={{ rotate: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 18, delay: 4 }}
          >
            ⚽
          </motion.div>
          <motion.div
            className="absolute bottom-10 right-10 text-5xl md:text-7xl opacity-10"
            animate={{ rotate: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 22, delay: 1 }}
          >
            📦
          </motion.div>
        </div>

        <div className="relative z-10 text-center">
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: -3 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          >
            <span className="inline-block px-5 py-2 bg-neon-pink border-3 border-ink-black text-ink-black font-bold"
              style={{ boxShadow: '4px 4px 0 #1A1A1A' }}>
              ✨ 献给在城市边缘长大的你
            </span>
          </motion.div>

          <motion.h1
            className="handwritten text-5xl md:text-7xl lg:text-8xl text-ink-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="inline-block text-neon-orange">城中村</span>
            <span className="inline-block mx-2">少年</span>
            <br className="md:hidden" />
            <span className="inline-block text-alley-green">街头</span>
            <span className="inline-block text-neon-pink">博物馆</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-ink-black/70 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            在这里，每一块招牌都有故事，每一次搬家都是成长，
            <br className="hidden md:block" />
            每一条小巷都是属于你的专属记忆。
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.a
              href="#features"
              className="sticker-btn bg-neon-orange text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 开始探索
            </motion.a>
          </motion.div>
        </div>
      </section>

      <section id="features" className="mb-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="handwritten text-4xl md:text-5xl text-ink-black mb-3">
            四大主题体验
          </h2>
          <p className="text-ink-black/60">选择一个感兴趣的入口，开始你的街头博物馆之旅</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {features.map((feature) => (
            <FeatureCard key={feature.path} {...feature} />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="handwritten text-4xl md:text-5xl text-ink-black mb-3">
            创作展示墙
          </h2>
          <p className="text-ink-black/60">看看其他少年们在这里留下了什么</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={index}
              className={`relative ${item.color} sticker-border p-4 text-center cursor-pointer group`}
              style={{ transform: `rotate(${item.rotate}deg)` }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={{
                rotate: 0,
                scale: 1.05,
                zIndex: 10,
                boxShadow: '6px 6px 0 #1A1A1A',
              }}
            >
              <motion.div
                className="text-4xl md:text-5xl mb-2"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2 + index * 0.3 }}
              >
                {item.emoji}
              </motion.div>
              <p className="text-xs font-bold text-ink-black/60 mb-1">{item.type}</p>
              <p className="handwritten text-lg text-ink-black">{item.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <motion.div
          className="relative bg-alley-green sticker-border p-8 md:p-12 text-center overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring' }}
        >
          <motion.div
            className="absolute top-4 left-4 text-5xl opacity-30"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 8 }}
          >
            💫
          </motion.div>
          <motion.div
            className="absolute bottom-4 right-4 text-5xl opacity-30"
            animate={{ rotate: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 10, delay: 1 }}
          >
            🌟
          </motion.div>

          <h3 className="handwritten text-3xl md:text-5xl text-white mb-4">
            你的故事，值得被看见
          </h3>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            在城中村长大，不是一种标签，而是一份独一无二的经历。
            <br />
            你的每一段记忆，都是这座城市最生动的注脚。
          </p>
        </motion.div>
      </section>
    </PageWrapper>
  )
}
