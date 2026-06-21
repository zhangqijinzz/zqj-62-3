import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Tape from './Tape'
import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  title: string
  subtitle: string
  description: string
  icon: LucideIcon
  color: string
  bgColor: string
  path: string
  rotate: number
  delay: number
}

export default function FeatureCard({
  title,
  subtitle,
  description,
  icon: Icon,
  color,
  bgColor,
  path,
  rotate,
  delay,
}: FeatureCardProps) {
  return (
    <motion.div
      className={`relative ${bgColor} sticker-border p-6 cursor-pointer group`}
      style={{ transform: `rotate(${rotate}deg)` }}
      initial={{ opacity: 0, y: 50, rotate: rotate - 10 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{
        rotate: 0,
        y: -8,
        boxShadow: '8px 8px 0 #1A1A1A',
        transition: { type: 'spring', stiffness: 300 },
      }}
    >
      <Tape color="yellow" rotate={-6} width={70} className="top-0 left-4" />
      <Tape color="pink" rotate={5} width={60} className="top-0 right-6" />

      <Link to={path} className="block h-full">
        <div className="pt-4">
          <motion.div
            className={`inline-flex items-center justify-center w-16 h-16 ${color} border-3 border-ink-black mb-4`}
            style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Icon size={32} className="text-ink-black" />
          </motion.div>

          <p className="text-sm font-bold text-ink-black/60 mb-1">{subtitle}</p>
          <h3 className="handwritten text-3xl text-ink-black mb-3">{title}</h3>
          <p className="text-ink-black/80 mb-4 leading-relaxed">{description}</p>

          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-3 border-ink-black font-bold text-ink-black"
            style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
            whileHover={{ x: 4 }}
          >
            去看看
            <ArrowRight size={18} />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}
