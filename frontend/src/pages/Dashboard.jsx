import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import { motion } from 'framer-motion'
import EnhancedNavbar from '../components/EnhancedNavbar'
import AnimatedStats from '../components/AnimatedStats'
import TaskVisualization from '../components/TaskVisualization'
import ThreeDCube from '../components/3DCube'
import {
  FiPlus,
  FiEdit,
  FiCalendar,
  FiTrendingUp,
  FiZap,
  FiTarget,
  FiChevronRight,
  FiUser
} from 'react-icons/fi'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

const Dashboard = () => {
  const { user, updateProfile } = useAuth()
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    efficiency: 85
  })
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({ name: '', email: '' })

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', email: user.email || '' })
      fetchTasks()
    }
  }, [user])

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`)
      const tasksData = response.data
      setTasks(tasksData)

      // Calculate stats
      const total = tasksData.length
      const completed = tasksData.filter(task => task.status === 'completed').length
      const pending = tasksData.filter(task => task.status === 'pending').length
      const inProgress = tasksData.filter(task => task.status === 'in-progress').length

      setStats({
        total,
        completed,
        pending,
        inProgress,
        efficiency: total > 0 ? Math.round((completed / total) * 100) : 0
      })
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    const result = await updateProfile(profileData)
    if (result.success) {
      setEditingProfile(false)
    }
  }

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
      opacity: 1
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <EnhancedNavbar />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section with 3D Effects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 relative"
        >
          <div className="absolute -inset-8 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-3xl" />
          <div className="relative glass-dark rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex-1">
                <motion.div
                  initial={{ x: -50 }}
                  animate={{ x: 0 }}
                  className="inline-flex items-center space-x-3 mb-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-glow animate-pulse-glow">
                    <FiZap size={28} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold gradient-text">
                      Welcome back, <span className="text-white">{user?.name}</span>!
                    </h1>
                    <p className="text-gray-400 mt-2">Here's your productivity dashboard in 3D</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
                >
                  {[
                    { label: 'Productivity Score', value: 'A+', icon: FiTrendingUp, color: 'from-green-500 to-emerald-400' },
                    { label: 'Weekly Goal', value: '78%', icon: FiTarget, color: 'from-blue-500 to-cyan-400' },
                    { label: 'Streak', value: '14 days', icon: FiCalendar, color: 'from-purple-500 to-pink-400' },
                    { label: 'Focus Time', value: '3.2h', icon: FiZap, color: 'from-orange-500 to-yellow-400' }
                  ].map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`bg-gradient-to-br ${metric.color} p-4 rounded-xl shadow-lg`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white/80">{metric.label}</p>
                          <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                        </div>
                        <metric.icon size={24} className="text-white" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="hidden lg:block ml-12"
              >
                <div className="w-48 h-48">
                  <ThreeDCube />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Animated Stats */}
        <AnimatedStats stats={stats} />

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Task Visualization */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <TaskVisualization tasks={tasks} />
          </motion.div>

          {/* Quick Actions & Profile */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Quick Actions */}
            <div className="glass-dark rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6 gradient-text">Quick Actions</h3>
              <div className="space-y-4">
                {[
                  {
                    label: 'New Task',
                    icon: FiPlus,
                    color: 'from-primary-500 to-blue-500',
                    link: '/tasks',
                    type: 'link'
                  },
                  {
                    label: 'Edit Profile',
                    icon: FiEdit,
                    color: 'from-purple-500 to-pink-500',
                    action: () => setEditingProfile(true),
                    type: 'button'
                  },
                  {
                    label: 'View Profile',
                    icon: FiUser,
                    color: 'from-green-500 to-emerald-500',
                    link: '/profile',
                    type: 'link'
                  },
                  {
                    label: 'Analytics',
                    icon: FiTrendingUp,
                    color: 'from-orange-500 to-yellow-500',
                    link: '/analytics',
                    type: 'link'
                  }
                ].map((action) => (
                  action.type === 'link' ? (
                    <motion.div
                      key={action.label}
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full"
                    >
                      <Link
                        to={action.link}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                            <action.icon size={20} className="text-white" />
                          </div>
                          <span className="font-medium text-gray-200">{action.label}</span>
                        </div>
                        <FiChevronRight className="text-gray-400 group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.button
                      key={action.label}
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={action.action}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                          <action.icon size={20} className="text-white" />
                        </div>
                        <span className="font-medium text-gray-200">{action.label}</span>
                      </div>
                      <FiChevronRight className="text-gray-400 group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
                    </motion.button>
                  )
                ))}
              </div>
            </div>

            {/* Profile Section */}
            <div className="glass-dark rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold gradient-text">Your Profile</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-300 hover:from-primary-500/30 hover:to-purple-500/30 transition-all duration-300"
                >
                  {editingProfile ? 'Cancel' : 'Edit'}
                </motion.button>
              </div>

              {editingProfile ? (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleProfileUpdate}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="input-3d w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="input-3d w-full"
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-300"
                  >
                    Save Changes
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-glow">
                      <span className="text-2xl font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{user?.name}</h4>
                      <p className="text-gray-400">{user?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                      <span className="text-gray-400">Member Since</span>
                      <span className="text-white font-medium">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                      <span className="text-gray-400">Task Completion</span>
                      <span className="text-white font-medium">
                        {stats.efficiency}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                      <span className="text-gray-400">Productivity Level</span>
                      <span className="text-green-400 font-medium">Pro</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Tasks Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold gradient-text">Recent Tasks</h2>
            <Link
              to="/tasks"
              className="btn-primary-3d flex items-center space-x-2"
            >
              <FiPlus />
              <span>View All Tasks</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.slice(0, 6).map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="task-card group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors duration-300">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-400 mt-2 line-clamp-2">{task.description}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${task.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                    {task.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {task.status.replace('-', ' ')}
                  </span>

                  {task.dueDate && (
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <FiCalendar size={14} />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                    <span className="group-hover:text-primary-400 transition-colors duration-300">
                      Click to edit →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard