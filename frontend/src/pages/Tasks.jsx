import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import EnhancedNavbar from '../components/EnhancedNavbar'
import TaskModal from '../components/TaskModal'
import { 
  FiSearch, 
  FiFilter, 
  FiEdit2, 
  FiTrash2, 
  FiPlus,
  FiCalendar,
  FiChevronDown,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiGrid,
  FiList,
  FiRefreshCw
} from 'react-icons/fi'
import { format } from 'date-fns'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

const Tasks = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    sort: 'createdAt',
    order: 'desc'
  })
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [selectedTask, setSelectedTask] = useState(null)
  const searchInputRef = useRef(null)

  useEffect(() => {
    fetchTasks()
    // Focus search input on mount
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [filters, searchTerm])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filters.status) params.append('status', filters.status)
      if (filters.priority) params.append('priority', filters.priority)
      params.append('sort', filters.sort)
      params.append('order', filters.order)

      const response = await axios.get(`${API_BASE_URL}/tasks?${params}`)
      setTasks(response.data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      await axios.post(`${API_BASE_URL}/tasks`, taskData)
      toast.success('Task created successfully!')
      fetchTasks()
      setShowModal(false)
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create task'
      toast.error(message)
    }
  }

  const handleUpdateTask = async (taskData) => {
    try {
      await axios.put(`${API_BASE_URL}/tasks/${editingTask._id}`, taskData)
      toast.success('Task updated successfully!')
      fetchTasks()
      setEditingTask(null)
      setShowModal(false)
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update task'
      toast.error(message)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`)
      toast.success('Task deleted successfully!')
      fetchTasks()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete task'
      toast.error(message)
    }
  }

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = {
        ...task,
        status: task.status === 'completed' ? 'pending' : 'completed'
      }
      
      await axios.put(`${API_BASE_URL}/tasks/${task._id}`, updatedTask)
      toast.success(`Task marked as ${updatedTask.status === 'completed' ? 'completed' : 'pending'}!`)
      fetchTasks()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update task'
      toast.error(message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-br from-green-500 to-emerald-500'
      case 'in-progress': return 'bg-gradient-to-br from-blue-500 to-cyan-500'
      default: return 'bg-gradient-to-br from-yellow-500 to-amber-500'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return FiCheck
      case 'in-progress': return FiClock
      default: return FiAlertCircle
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-br from-red-500 to-pink-500'
      case 'medium': return 'bg-gradient-to-br from-orange-500 to-yellow-500'
      default: return 'bg-gradient-to-br from-green-500 to-emerald-500'
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({
      status: '',
      priority: '',
      sort: 'createdAt',
      order: 'desc'
    })
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
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  const taskCardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 100
      }
    }),
    hover: {
      y: -10,
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400
      }
    },
    tap: {
      scale: 0.95
    }
  }

  const emptyStateVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        delay: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <EnhancedNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
        >
          <div className="mb-6 md:mb-0">
            <motion.div
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              className="inline-flex items-center space-x-3 mb-3"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-glow">
                <FiCalendar size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">Tasks</h1>
                <p className="text-gray-400 mt-2">Manage your tasks in immersive 3D space</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4 mt-4"
            >
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>{tasks.filter(t => t.status === 'completed').length} completed</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>{tasks.filter(t => t.status === 'in-progress').length} in progress</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span>{tasks.filter(t => t.status === 'pending').length} pending</span>
              </div>
            </motion.div>
          </div>
          
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setEditingTask(null)
              setShowModal(true)
            }}
            className="btn-primary-3d flex items-center space-x-3 px-8 py-4"
          >
            <FiPlus size={22} />
            <span className="font-bold">New Task</span>
          </motion.button>
        </motion.div>

        {/* Search and Filters with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-3d w-full pl-12 pr-4"
                />
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    ✕
                  </motion.button>
                )}
              </motion.div>
            </div>

            {/* Status Filter */}
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="input-3d w-full pl-12 pr-10 appearance-none"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </motion.div>
            </div>

            {/* Priority Filter */}
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({...filters, priority: e.target.value})}
                  className="input-3d w-full pl-12 pr-10 appearance-none"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </motion.div>
            </div>

            {/* View Mode & Actions */}
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-300' 
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {viewMode === 'grid' ? <FiList size={20} /> : <FiGrid size={20} />}
                <span className="hidden sm:inline">{viewMode === 'grid' ? 'List' : 'Grid'}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <FiRefreshCw size={18} />
                <span className="hidden sm:inline">Clear</span>
              </motion.button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || filters.status || filters.priority) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm text-gray-400">Active filters:</span>
                <AnimatePresence>
                  {searchTerm && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-sm flex items-center space-x-2"
                    >
                      <span>Search: "{searchTerm}"</span>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="hover:text-white"
                      >
                        ✕
                      </button>
                    </motion.div>
                  )}
                  
                  {filters.status && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm flex items-center space-x-2"
                    >
                      <span>Status: {filters.status}</span>
                      <button
                        onClick={() => setFilters({...filters, status: ''})}
                        className="hover:text-white"
                      >
                        ✕
                      </button>
                    </motion.div>
                  )}
                  
                  {filters.priority && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm flex items-center space-x-2"
                    >
                      <span>Priority: {filters.priority}</span>
                      <button
                        onClick={() => setFilters({...filters, priority: ''})}
                        className="hover:text-white"
                      >
                        ✕
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Tasks Grid/List with Animation */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-primary-500/30 rounded-full" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiRefreshCw className="text-primary-400" size={32} />
                </div>
              </div>
              <p className="mt-6 text-gray-400 animate-pulse">Loading your 3D tasks...</p>
            </motion.div>
          ) : tasks.length > 0 ? (
            <motion.div
              key="tasks"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
            >
              <AnimatePresence>
                {tasks.map((task, index) => {
                  const StatusIcon = getStatusIcon(task.status)
                  
                  return (
                    <motion.div
                      key={task._id}
                      custom={index}
                      variants={viewMode === 'grid' ? taskCardVariants : itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      whileTap="tap"
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                      className={viewMode === 'grid' ? 'task-card group' : 'glass-dark rounded-2xl p-6 hover:shadow-glow transition-all duration-300'}
                      onClick={() => setSelectedTask(selectedTask?._id === task._id ? null : task)}
                    >
                      {viewMode === 'grid' ? (
                        // Grid View
                        <>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <motion.button
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.8 }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleComplete(task)
                                  }}
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                    task.status === 'completed'
                                      ? 'border-green-500 bg-green-500'
                                      : 'border-gray-400 hover:border-primary-500'
                                  }`}
                                >
                                  {task.status === 'completed' && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                    >
                                      <FiCheck className="text-white" size={14} />
                                    </motion.div>
                                  )}
                                </motion.button>
                                <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors duration-300">
                                  {task.title}
                                </h3>
                              </div>
                              {task.description && (
                                <p className="text-gray-400 text-sm line-clamp-2">{task.description}</p>
                              )}
                            </div>
                            <motion.div
                              whileHover={{ rotate: 90 }}
                              className={`w-3 h-12 rounded-full ${getPriorityColor(task.priority)}`}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center space-x-2">
                              <div className={`p-2 rounded-lg ${getStatusColor(task.status)}`}>
                                <StatusIcon size={16} className="text-white" />
                              </div>
                              <span className="text-sm font-medium capitalize">
                                {task.status.replace('-', ' ')}
                              </span>
                            </div>
                            
                            {task.dueDate && (
                              <div className="flex items-center space-x-2 text-sm text-gray-400">
                                <FiCalendar size={14} />
                                <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
                              </div>
                            )}
                          </div>
                          
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ 
                              opacity: selectedTask?._id === task._id ? 1 : 0,
                              height: selectedTask?._id === task._id ? 'auto' : 0
                            }}
                            className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
                          >
                            <div className="flex space-x-3">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingTask(task)
                                  setShowModal(true)
                                }}
                                className="flex-1 py-2 rounded-lg bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 transition-colors"
                              >
                                Edit
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteTask(task._id)
                                }}
                                className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                              >
                                Delete
                              </motion.button>
                            </div>
                          </motion.div>
                          
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>Created {format(new Date(task.createdAt), 'MMM dd')}</span>
                              <span className="group-hover:text-primary-400 transition-colors duration-300">
                                {selectedTask?._id === task._id ? '▲ Collapse' : '▼ Expand'}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        // List View
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleComplete(task)
                              }}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                task.status === 'completed'
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-400 hover:border-primary-500'
                              }`}
                            >
                              {task.status === 'completed' && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                >
                                  <FiCheck className="text-white" size={14} />
                                </motion.div>
                              )}
                            </motion.button>
                            
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white">{task.title}</h3>
                              {task.description && (
                                <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                              <span className="text-sm text-gray-400 capitalize">{task.priority}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <div className={`p-2 rounded-lg ${getStatusColor(task.status)}`}>
                                <StatusIcon size={16} className="text-white" />
                              </div>
                              <span className="text-sm font-medium capitalize">
                                {task.status.replace('-', ' ')}
                              </span>
                            </div>
                            
                            {task.dueDate && (
                              <div className="flex items-center space-x-2 text-sm text-gray-400">
                                <FiCalendar size={14} />
                                <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                              </div>
                            )}
                            
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingTask(task)
                                  setShowModal(true)
                                }}
                                className="p-2 rounded-lg bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 transition-colors"
                              >
                                <FiEdit2 size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteTask(task._id)
                                }}
                                className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                              >
                                <FiTrash2 size={16} />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              variants={emptyStateVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="w-48 h-48 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 border-8 border-primary-500/30 rounded-full flex items-center justify-center">
                    <FiCalendar size={64} className="text-primary-400/50" />
                  </div>
                  <div className="absolute w-24 h-24 border-4 border-transparent border-t-primary-500 rounded-full animate-spin-slow" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8"
              >
                <h3 className="text-2xl font-bold gradient-text mb-2">
                  {searchTerm || filters.status || filters.priority 
                    ? 'No tasks found' 
                    : 'Your task universe is empty!'}
                </h3>
                <p className="text-gray-400 mb-8 max-w-md">
                  {searchTerm || filters.status || filters.priority 
                    ? 'Try adjusting your search or filters to find what you\'re looking for.' 
                    : 'Create your first task to get started with 3D task management.'}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setEditingTask(null)
                      setShowModal(true)
                    }}
                    className="btn-primary-3d flex items-center justify-center space-x-3 px-8 py-4"
                  >
                    <FiPlus size={22} />
                    <span className="font-bold">Create New Task</span>
                  </motion.button>
                  
                  {(searchTerm || filters.status || filters.priority) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="px-8 py-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors font-medium"
                    >
                      Clear All Filters
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button for Mobile */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setEditingTask(null)
            setShowModal(true)
          }}
          className="fixed bottom-8 right-8 md:hidden z-50 w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 shadow-glow-lg flex items-center justify-center"
        >
          <FiPlus size={24} className="text-white" />
        </motion.button>

        {/* Task Modal */}
        <AnimatePresence>
          {showModal && (
            <TaskModal
              task={editingTask}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onClose={() => {
                setShowModal(false)
                setEditingTask(null)
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Tasks