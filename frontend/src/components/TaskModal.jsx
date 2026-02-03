import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiX, 
  FiCalendar, 
  FiFileText,
  FiFlag,
  FiActivity,
  FiSave,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiChevronUp
} from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional().refine(
    (date) => !date || !isNaN(Date.parse(date)),
    'Invalid date format'
  )
})

const TaskModal = ({ task, onSubmit, onClose }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'pending',
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    }
  })

  const modalRef = useRef(null)
  const contentRef = useRef(null)
  const [shake, setShake] = useState(false)
  const [priorityHover, setPriorityHover] = useState(null)
  const [statusHover, setStatusHover] = useState(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Watch form values for real-time preview
  const watchedTitle = watch('title')
  const watchedDescription = watch('description')
  const watchedStatus = watch('status')
  const watchedPriority = watch('priority')
  const watchedDueDate = watch('dueDate')

  // Handle scroll inside modal
  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      const scrolled = scrollTop > 100
      const nearBottom = scrollHeight - scrollTop - clientHeight < 50
      
      setShowScrollTop(scrolled)
      
      // Auto-scroll to show buttons if near bottom
      if (nearBottom) {
        setTimeout(() => {
          contentRef.current?.scrollBy({ top: 10, behavior: 'smooth' })
        }, 100)
      }
    }
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])

  // Focus first input when modal opens
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstInput = document.querySelector('input[name="title"]')
      if (firstInput) firstInput.focus()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Add scroll event listener
  useEffect(() => {
    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll)
      return () => contentElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    // Trigger shake animation on error
    if (Object.keys(errors).length > 0) {
      setShake(true)
      const timer = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(timer)
    }
  }, [errors])

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Task submission error:', error)
    }
  }

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'smooth' })
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-br from-red-500 to-pink-500'
      case 'medium': return 'bg-gradient-to-br from-yellow-500 to-orange-500'
      case 'low': return 'bg-gradient-to-br from-green-500 to-emerald-500'
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-br from-green-500 to-emerald-500'
      case 'in-progress': return 'bg-gradient-to-br from-blue-500 to-cyan-500'
      case 'pending': return 'bg-gradient-to-br from-yellow-500 to-amber-500'
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return FiCheckCircle
      case 'in-progress': return FiActivity
      case 'pending': return FiClock
      default: return FiAlertCircle
    }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: -50,
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        mass: 1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    }
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          className="relative w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
          ref={modalRef}
        >
          {/* Animated Background Effects */}
          <div className="absolute -inset-8 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
          
          <div className="relative glass-dark rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[85vh]">
            {/* Modal Header with 3D Effect - Fixed */}
            <div className="relative p-6 border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-purple-500/5" />
              <div className="relative flex justify-between items-center">
                <div>
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold gradient-text"
                  >
                    {task ? 'Edit Task' : 'Create New Task'}
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-400 text-sm mt-1"
                  >
                    {task ? 'Update your task details' : 'Add a new task to your 3D workspace'}
                  </motion.p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 group"
                >
                  <FiX size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                </motion.button>
              </div>
            </div>

            {/* Scrollable Content Area - FIXED */}
            <div 
              ref={contentRef}
              className="overflow-y-auto"
              style={{
                maxHeight: 'calc(85vh - 200px)', // Height minus header and footer
                scrollBehavior: 'smooth'
              }}
            >
              {/* Live Preview Section */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 border-b border-white/10 bg-gradient-to-br from-white/5 to-transparent"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-2 truncate">
                      {watchedTitle || 'Task Preview'}
                    </h3>
                    {watchedDescription && (
                      <p className="text-gray-400 text-sm line-clamp-2">{watchedDescription}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 ml-4">
                    <div className={`px-3 py-1.5 rounded-full ${getStatusColor(watchedStatus)} text-white text-sm font-medium flex items-center space-x-2 min-w-max`}>
                      {(() => {
                        const StatusIcon = getStatusIcon(watchedStatus)
                        return <StatusIcon size={14} />
                      })()}
                      <span className="capitalize">{watchedStatus.replace('-', ' ')}</span>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full ${getPriorityColor(watchedPriority)} text-white text-sm font-medium capitalize min-w-max`}>
                      {watchedPriority}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Form with Enhanced Styling */}
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSubmit(handleFormSubmit)}
                className="p-6 space-y-6"
              >
                {/* Title Input */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 text-md font-medium text-white">
                    <FiFileText className="text-primary-400" size={18} />
                    <span>Task Title</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    <motion.input
                      {...register('title')}
                      type="text"
                      name="title"
                      animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                      className="input-3d w-full text-base px-4 py-3"
                      placeholder="What needs to be done?"
                    />
                  </div>
                  {errors.title && (
                    <motion.p 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-red-400 text-sm flex items-center space-x-2"
                    >
                      <FiAlertCircle size={14} />
                      <span>{errors.title.message}</span>
                    </motion.p>
                  )}
                </div>

                {/* Description Input */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 text-md font-medium text-white">
                    <FiFileText className="text-primary-400" size={18} />
                    <span>Description</span>
                    <span className="text-xs text-gray-400">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="input-3d w-full resize-none px-4 py-3"
                      placeholder="Add details, notes, or instructions..."
                    />
                  </div>
                </div>

                {/* Status & Priority Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status Selector */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 text-md font-medium text-white">
                      <FiActivity className="text-primary-400" size={18} />
                      <span>Status</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['pending', 'in-progress', 'completed'].map((status) => {
                        const StatusIcon = getStatusIcon(status)
                        return (
                          <motion.label
                            key={status}
                            whileHover={{ scale: 1.05, y: -3 }}
                            whileTap={{ scale: 0.95 }}
                            onMouseEnter={() => setStatusHover(status)}
                            onMouseLeave={() => setStatusHover(null)}
                            className={`relative cursor-pointer`}
                          >
                            <input
                              type="radio"
                              value={status}
                              {...register('status')}
                              className="sr-only"
                            />
                            <div className={`p-3 rounded-xl transition-all duration-300 ${
                              watchedStatus === status
                                ? getStatusColor(status) + ' text-white shadow-lg'
                                : statusHover === status
                                ? 'bg-white/10'
                                : 'bg-white/5'
                            }`}>
                              <div className="flex flex-col items-center space-y-1">
                                <StatusIcon size={18} className={
                                  watchedStatus === status ? 'text-white' : 'text-gray-400'
                                } />
                                <span className="text-xs font-medium capitalize mt-1">
                                  {status.replace('-', ' ')}
                                </span>
                              </div>
                            </div>
                            {watchedStatus === status && (
                              <motion.div
                                layoutId="status-indicator"
                                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"
                              />
                            )}
                          </motion.label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Priority Selector */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 text-md font-medium text-white">
                      <FiFlag className="text-primary-400" size={18} />
                      <span>Priority</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['low', 'medium', 'high'].map((priority) => (
                        <motion.label
                          key={priority}
                          whileHover={{ scale: 1.05, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          onMouseEnter={() => setPriorityHover(priority)}
                          onMouseLeave={() => setPriorityHover(null)}
                          className={`relative cursor-pointer`}
                        >
                          <input
                            type="radio"
                            value={priority}
                            {...register('priority')}
                            className="sr-only"
                          />
                          <div className={`p-3 rounded-xl transition-all duration-300 ${
                            watchedPriority === priority
                              ? getPriorityColor(priority) + ' text-white shadow-lg'
                              : priorityHover === priority
                              ? 'bg-white/10'
                              : 'bg-white/5'
                          }`}>
                            <div className="flex flex-col items-center space-y-1">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                watchedPriority === priority ? 'bg-white/20' : 'bg-white/5'
                              }`}>
                                <span className="text-xs font-bold">
                                  {priority === 'high' ? '!!!' : priority === 'medium' ? '!!' : '!'}
                                </span>
                              </div>
                              <span className="text-xs font-medium capitalize mt-1">
                                {priority}
                              </span>
                            </div>
                          </div>
                          {watchedPriority === priority && (
                            <motion.div
                              layoutId="priority-indicator"
                              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"
                            />
                          )}
                        </motion.label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Due Date Selector */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 text-md font-medium text-white">
                    <FiCalendar className="text-primary-400" size={18} />
                    <span>Due Date</span>
                    <span className="text-xs text-gray-400">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    <div className="relative">
                      <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={18} />
                      <input
                        {...register('dueDate')}
                        type="date"
                        className="input-3d w-full pl-12 pr-4 py-3"
                      />
                      {watchedDueDate && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-300 text-xs"
                        >
                          {new Date(watchedDueDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </motion.div>
                      )}
                    </div>
                  </div>
                  {errors.dueDate && (
                    <motion.p 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-red-400 text-sm flex items-center space-x-2"
                    >
                      <FiAlertCircle size={14} />
                      <span>{errors.dueDate.message}</span>
                    </motion.p>
                  )}
                </div>

                {/* Scroll indicator */}
                {showScrollTop && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center pt-4"
                  >
                    <button
                      type="button"
                      onClick={scrollToTop}
                      className="text-xs text-gray-400 hover:text-white flex items-center space-x-1"
                    >
                      <FiChevronUp size={12} />
                      <span>Scroll to top</span>
                    </button>
                  </motion.div>
                )}

                {/* Extra spacing for buttons */}
                <div className="h-4"></div>
              </motion.form>
            </div>

            {/* Fixed Footer with Action Buttons */}
            <div className="p-6 border-t border-white/10 bg-gradient-to-t from-gray-900/90 to-transparent backdrop-blur-sm">
              <div className="flex space-x-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium text-base border border-white/10"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit(handleFormSubmit)}
                  className="btn-primary-3d flex-1 px-4 py-3 text-base font-bold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{task ? 'Saving...' : 'Creating...'}</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <FiSave size={18} />
                      <span>{task ? 'Update Task' : 'Create Task'}</span>
                    </span>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-full -translate-y-12 translate-x-12 blur-xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full translate-y-16 -translate-x-16 blur-xl" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TaskModal