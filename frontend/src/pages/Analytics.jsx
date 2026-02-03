import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import { motion } from 'framer-motion'
import EnhancedNavbar from '../components/EnhancedNavbar'
import { 
  FiTrendingUp, 
  FiBarChart2, 
  FiPieChart,
  FiUsers,
  FiClock,
  FiTarget,
  FiActivity,
  FiDollarSign,
  FiDownload,
  FiRefreshCw,
  FiEyeOff
} from 'react-icons/fi'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

const Analytics = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [metrics, setMetrics] = useState({
    productivity: 85,
    efficiency: 92,
    completionRate: 78,
    avgCompletionTime: 3.2,
    taskVolume: 42,
    teamCollaboration: 65
  })
  const [showRevenue, setShowRevenue] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/tasks`)
      const tasksData = response.data
      setTasks(tasksData)
      
      // Calculate metrics from tasks
      const totalTasks = tasksData.length
      const completedTasks = tasksData.filter(t => t.status === 'completed').length
      const inProgressTasks = tasksData.filter(t => t.status === 'in-progress').length
      
      setMetrics({
        productivity: Math.round((completedTasks / Math.max(1, totalTasks)) * 100),
        efficiency: Math.round(((completedTasks + inProgressTasks * 0.5) / Math.max(1, totalTasks)) * 100),
        completionRate: Math.round((completedTasks / Math.max(1, totalTasks)) * 100),
        avgCompletionTime: 3.2, // Mock data
        taskVolume: totalTasks,
        teamCollaboration: Math.round((inProgressTasks / Math.max(1, totalTasks)) * 100)
      })
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for charts
  const productivityData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 78 },
    { day: 'Wed', value: 85 },
    { day: 'Thu', value: 92 },
    { day: 'Fri', value: 88 },
    { day: 'Sat', value: 76 },
    { day: 'Sun', value: 70 }
  ]

  const taskDistributionData = [
    { name: 'Completed', value: 35, color: '#10b981' },
    { name: 'In Progress', value: 25, color: '#0ea5e9' },
    { name: 'Pending', value: 20, color: '#f59e0b' },
    { name: 'Overdue', value: 10, color: '#ef4444' },
    { name: 'Blocked', value: 10, color: '#8b5cf6' }
  ]

  const priorityData = [
    { priority: 'High', tasks: 15, completed: 10 },
    { priority: 'Medium', tasks: 25, completed: 18 },
    { priority: 'Low', tasks: 20, completed: 16 }
  ]

  const timeSpentData = [
    { category: 'Planning', hours: 12 },
    { category: 'Development', hours: 40 },
    { category: 'Testing', hours: 18 },
    { category: 'Meetings', hours: 10 },
    { category: 'Research', hours: 8 }
  ]

  const revenueData = [
    { month: 'Jan', revenue: 42000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 61000 },
    { month: 'Apr', revenue: 58000 },
    { month: 'May', revenue: 72000 },
    { month: 'Jun', revenue: 89000 },
    { month: 'Jul', revenue: 95000 }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  const chartVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 50
      }
    }
  }

  const timeRanges = [
    { id: 'day', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'This Year' }
  ]

  const metricCards = [
    { 
      label: 'Productivity Score', 
      value: `${metrics.productivity}%`, 
      icon: FiTrendingUp, 
      color: 'from-green-500 to-emerald-500',
      change: '+12%'
    },
    { 
      label: 'Task Efficiency', 
      value: `${metrics.efficiency}%`, 
      icon: FiBarChart2, 
      color: 'from-blue-500 to-cyan-500',
      change: '+8%'
    },
    { 
      label: 'Completion Rate', 
      value: `${metrics.completionRate}%`, 
      icon: FiTarget, 
      color: 'from-purple-500 to-pink-500',
      change: '+5%'
    },
    { 
      label: 'Avg. Completion Time', 
      value: `${metrics.avgCompletionTime}h`, 
      icon: FiClock, 
      color: 'from-orange-500 to-yellow-500',
      change: '-1.2h'
    },
    { 
      label: 'Task Volume', 
      value: metrics.taskVolume, 
      icon: FiActivity, 
      color: 'from-red-500 to-rose-500',
      change: '+18%'
    },
    { 
      label: 'Team Collaboration', 
      value: `${metrics.teamCollaboration}%`, 
      icon: FiUsers, 
      color: 'from-indigo-500 to-violet-500',
      change: '+22%'
    }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-dark rounded-lg p-4 border border-white/10 shadow-2xl">
          <p className="font-bold text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <EnhancedNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Analytics Dashboard</h1>
              <p className="text-gray-400 mt-2">Real-time insights and performance metrics</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-6 lg:mt-0">
              <div className="flex rounded-xl bg-white/5 p-1">
                {timeRanges.map((range) => (
                  <motion.button
                    key={range.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeRange(range.id)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      timeRange === range.id
                        ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {range.label}
                  </motion.button>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchAnalyticsData}
                className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <FiRefreshCw size={20} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary-3d flex items-center space-x-3 px-6 py-3"
              >
                <FiDownload size={20} />
                <span>Export</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {metricCards.map((metric, index) => (
            <motion.div
              key={metric.label}
              custom={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-dark rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity group-hover:opacity-20" />
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">{metric.label}</p>
                    <p className="text-3xl font-bold text-white">{metric.value}</p>
                    <p className={`text-sm mt-2 ${
                      metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.change} from last period
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color}`}>
                    <metric.icon size={24} className="text-white" />
                  </div>
                </div>
                
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${parseInt(metric.value)}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                    className={`h-full bg-gradient-to-r ${metric.color}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Productivity Trend */}
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            className="glass-dark rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold gradient-text">Productivity Trend</h3>
                <p className="text-gray-400 text-sm">Weekly performance overview</p>
              </div>
              <FiTrendingUp className="text-primary-400" size={24} />
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, fill: '#0ea5e9' }}
                    name="Productivity %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Task Distribution */}
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            className="glass-dark rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold gradient-text">Task Distribution</h3>
                <p className="text-gray-400 text-sm">Status breakdown across tasks</p>
              </div>
              <FiPieChart className="text-purple-400" size={24} />
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Priority Analysis */}
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="glass-dark rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold gradient-text">Priority Analysis</h3>
                <p className="text-gray-400 text-sm">Tasks by priority level</p>
              </div>
              <FiBarChart2 className="text-green-400" size={24} />
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="priority" 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="tasks" 
                    name="Total Tasks" 
                    fill="#0ea5e9" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="completed" 
                    name="Completed" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Time Spent Analysis */}
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="glass-dark rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold gradient-text">Time Allocation</h3>
                <p className="text-gray-400 text-sm">Hours spent per category</p>
              </div>
              <FiClock className="text-yellow-400" size={24} />
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSpentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="category" 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="hours" 
                    name="Hours" 
                    fill="#8b5cf6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Revenue Chart */}
        {showRevenue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold gradient-text">Revenue Growth</h3>
                <p className="text-gray-400 text-sm">Monthly revenue performance</p>
              </div>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRevenue(false)}
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <FiEyeOff size={20} />
                </motion.button>
                <FiDollarSign className="text-green-400" size={24} />
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, fill: '#10b981' }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Insights & Recommendations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-dark rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold gradient-text mb-6">Insights & Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FiTrendingUp className="text-blue-400" size={20} />
                </div>
                <h4 className="font-bold text-white">Peak Productivity</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Your most productive hours are between 10 AM - 2 PM. Schedule important tasks during this window.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <FiTarget className="text-green-400" size={20} />
                </div>
                <h4 className="font-bold text-white">Goal Progress</h4>
              </div>
              <p className="text-gray-300 text-sm">
                You're on track to complete 92% of weekly goals. High priority tasks need more attention.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <FiUsers className="text-purple-400" size={20} />
                </div>
                <h4 className="font-bold text-white">Team Collaboration</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Collaboration rate increased by 22%. Consider scheduling more team syncs for complex projects.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10">
            <h4 className="text-lg font-bold text-white mb-4">Action Items</h4>
            <div className="space-y-3">
              {[
                'Review overdue tasks by EOD',
                'Schedule team meeting for project alignment',
                'Update quarterly goals based on current progress',
                'Optimize task distribution for better efficiency'
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  <span className="text-gray-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics