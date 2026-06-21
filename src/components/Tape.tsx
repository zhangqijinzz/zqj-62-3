import { motion } from 'framer-motion'

interface TapeProps {
  color?: 'yellow' | 'pink' | 'teal' | 'orange'
  rotate?: number
  width?: number
  className?: string
}

const colorMap = {
  yellow: 'bg-yellow-300/70',
  pink: 'bg-neon-pink/50',
  teal: 'bg-electric-teal/50',
  orange: 'bg-neon-orange/50',
}

export default function Tape({
  color = 'yellow',
  rotate = -4,
  width = 80,
  className = '',
}: TapeProps) {
  return (
    <motion.div
      className={`absolute ${colorMap[color]} h-7 ${className}`}
      style={{
        width: `${width}px`,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
    />
  )
}
