import { motion } from 'framer-motion'
import { 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi'
import { useState, useEffect } from 'react'

const AnimatedStats = ({ stats }) => {
  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    efficiency: 0
  })

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      
      setAnimatedStats({
        total: Math.min(Math.floor(stats.total * (currentStep / steps)), stats.total),
        completed: Math.min(Math.floor(stats.completed * (currentStep / steps)), stats.completed),
        pending: Math.min(Math.floor(stats.pending * (currentStep / steps)), stats.pending),
        inProgress: Math.min(Math.floor(stats.inProgress * (currentStep / steps)), stats.inProgress),
        efficiency: Math.min(Math.floor(stats.efficiency * (currentStep / steps)), stats.efficiency)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [stats])

  const statCards = [
    {
      label: 'Total Tasks',
      value: animatedStats.total,
      icon: FiActivity,
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-gradient-to-br from-blue-500/10 to-cyan-400/10',
      delay: 0.1
    },
    {
      label: 'Completed',
      value: animatedStats.completed,
      icon: FiCheckCircle,
      color: 'from-green-500 to-emerald-400',
      bgColor: 'bg-gradient-to-br from-green-500/10 to-emerald-400/10',
      delay: 0.2
    },
    {
      label: 'Pending',
      value: animatedStats.pending,
      icon: FiClock,
      color: 'from-yellow-500 to-amber-400',
      bgColor: 'bg-gradient-to-br from-yellow-500/10 to-amber-400/10',
      delay: 0.3
    },
    {
      label: 'In Progress',
      value: animatedStats.inProgress,
      icon: FiAlertCircle,
      color: 'from-orange-500 to-red-400',
      bgColor: 'bg-gradient-to-br from-orange-500/10 to-red-400/10',
      delay: 0.4
    },
    {
      label: 'Efficiency',
      value: `${animatedStats.efficiency}%`,
      icon: FiTrendingUp,
      color: 'from-purple-500 to-pink-400',
      bgColor: 'bg-gradient-to-br from-purple-500/10 to-pink-400/10',
      delay: 0.5
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: stat.delay, type: 'spring', stiffness: 100 }}
          whileHover={{ y: -10, scale: 1.05 }}
          className={`stats-card transform-3d ${stat.bgColor} border border-white/10 hover:shadow-glow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ delay: 2 + stat.delay, duration: 1, repeat: Infinity, repeatDelay: 3 }}
              className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
            >
              <stat.icon size={24} className="text-white" />
            </motion.div>
          </div>
          <div className="mt-4">
            <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (animatedStats[stat.label.toLowerCase().replace(' ', '')] || 0) * 10)}%` }}
                transition={{ delay: stat.delay + 0.5, duration: 1 }}
                className={`h-full bg-gradient-to-r ${stat.color}`}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default AnimatedStats