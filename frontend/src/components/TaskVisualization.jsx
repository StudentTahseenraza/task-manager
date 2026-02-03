import { motion } from 'framer-motion'
import { FiCheck, FiX, FiLoader, FiPieChart } from 'react-icons/fi'

const TaskVisualization = ({ tasks }) => {
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length
  const pendingTasks = tasks.filter(t => t.status === 'pending').length
  const totalTasks = tasks.length

  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Progress Ring */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-dark rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5" />
        <h3 className="text-xl font-bold mb-6 gradient-text flex items-center space-x-3">
          <FiPieChart />
          <span>Task Progress</span>
        </h3>
        
        <div className="flex items-center justify-center py-8">
          <div className="relative w-64 h-64">
            {/* Background Circle */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: "283", strokeDashoffset: "283" }}
                animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                transition={{ duration: 2, ease: "easeOut" }}
                transform="rotate(-90 50 50)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
                className="text-4xl font-bold gradient-text"
              >
                {Math.round(progress)}%
              </motion.div>
              <div className="text-gray-400 mt-2">Completion Rate</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { label: 'Completed', value: completedTasks, color: 'text-green-400', icon: FiCheck },
            { label: 'In Progress', value: inProgressTasks, color: 'text-blue-400', icon: FiLoader },
            { label: 'Pending', value: pendingTasks, color: 'text-yellow-400', icon: FiX }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div className={`text-2xl font-bold ${item.color} flex items-center justify-center space-x-2`}>
                <item.icon />
                <span>{item.value}</span>
              </div>
              <div className="text-sm text-gray-400 mt-1">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Priority Distribution */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-dark rounded-2xl p-8"
      >
        <h3 className="text-xl font-bold mb-6 gradient-text">Priority Distribution</h3>
        
        <div className="space-y-6">
          {[
            { level: 'High', count: tasks.filter(t => t.priority === 'high').length, color: 'from-red-500 to-pink-500' },
            { level: 'Medium', count: tasks.filter(t => t.priority === 'medium').length, color: 'from-yellow-500 to-orange-500' },
            { level: 'Low', count: tasks.filter(t => t.priority === 'low').length, color: 'from-green-500 to-emerald-500' }
          ].map((priority, index) => (
            <motion.div
              key={priority.level}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{priority.level} Priority</span>
                <span className="text-white font-semibold">{priority.count} tasks</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(priority.count / Math.max(1, totalTasks)) * 100}%` 
                  }}
                  transition={{ delay: 1 + index * 0.2, duration: 1 }}
                  className={`h-full bg-gradient-to-r ${priority.color} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Task Timeline */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <h4 className="text-lg font-semibold mb-4 text-gray-300">Recent Activity</h4>
          <div className="space-y-4">
            {tasks.slice(0, 3).map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className={`w-3 h-3 rounded-full ${
                  task.priority === 'high' ? 'bg-red-500' :
                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <div className="font-medium text-white">{task.title}</div>
                  <div className="text-xs text-gray-400">
                    {task.status} • Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default TaskVisualization