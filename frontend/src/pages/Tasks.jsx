import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import TaskModal from '../components/TaskModal'
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiPlus, FiCalendar } from 'react-icons/fi'
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

  useEffect(() => {
    fetchTasks()
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border border-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border border-blue-200'
      default: return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      default: return 'bg-green-100 text-green-800 border border-green-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
            <p className="text-gray-600 mt-2">Manage your tasks and stay organized</p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null)
              setShowModal(true)
            }}
            className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
          >
            <FiPlus size={20} />
            <span>New Task</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="input-field pl-10 appearance-none"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
                className="input-field pl-10 appearance-none"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filters.sort}
                onChange={(e) => setFilters({...filters, sort: e.target.value})}
                className="input-field pl-10 appearance-none"
              >
                <option value="createdAt">Created Date</option>
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="card overflow-hidden animate-fade-in">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : tasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">{task.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {task.dueDate ? (
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <FiCalendar size={14} />
                            <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No due date</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingTask(task)
                              setShowModal(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FiFilter size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || filters.status || filters.priority 
                  ? 'Try adjusting your search or filters to find what you\'re looking for.' 
                  : 'Create your first task to get started with task management.'}
              </p>
              <button
                onClick={() => {
                  setEditingTask(null)
                  setShowModal(true)
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 mx-auto"
              >
                <FiPlus size={20} />
                <span>Create New Task</span>
              </button>
            </div>
          )}
        </div>

        {/* Task Modal */}
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
      </div>
    </div>
  )
}

export default Tasks