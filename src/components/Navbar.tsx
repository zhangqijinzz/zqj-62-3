import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Camera, Package, PersonStanding, Puzzle } from 'lucide-react'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/scanner', label: '扫描仪', icon: Camera },
  { path: '/packing', label: '打包游戏', icon: Package },
  { path: '/parkour', label: '跑酷', icon: PersonStanding },
  { path: '/identity', label: '身份拼图', icon: Puzzle },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-wall-cream/95 backdrop-blur-sm border-b-3 border-ink-black">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              🏘️
            </motion.span>
            <span className="handwritten text-xl md:text-2xl text-ink-black group-hover:text-neon-orange transition-colors">
              城中村少年街头博物馆
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative"
                >
                  <motion.div
                    className={`flex items-center gap-1.5 px-4 py-2 font-bold border-3 border-ink-black transition-colors ${
                      isActive
                        ? 'bg-neon-orange text-white'
                        : 'bg-white text-ink-black hover:bg-neon-pink/20'
                    }`}
                    style={{
                      boxShadow: isActive ? '3px 3px 0 #1A1A1A' : '2px 2px 0 #1A1A1A',
                    }}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 1 }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          <div className="md:hidden flex items-center gap-1 overflow-x-auto max-w-[60%] pb-1">
            {navItems.map((item) => {
              const isActive = item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)
              const Icon = item.icon
              return (
                <Link key={item.path} to={item.path} className="flex-shrink-0">
                  <motion.div
                    className={`flex items-center gap-1 px-2 py-1.5 text-sm font-bold border-2 border-ink-black ${
                      isActive ? 'bg-neon-orange text-white' : 'bg-white text-ink-black'
                    }`}
                    style={{ boxShadow: '2px 2px 0 #1A1A1A' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
