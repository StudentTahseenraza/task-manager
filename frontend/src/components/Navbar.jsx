import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiLogOut, FiUser, FiHome, FiCheckSquare } from 'react-icons/fi'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2 text-primary-600 font-bold text-lg">
              <FiHome size={24} />
              <span>Task Manager</span>
            </Link>
            <Link to="/tasks" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
              <FiCheckSquare size={20} />
              <span>Tasks</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-gray-700 px-4 py-2 rounded-lg bg-gray-50">
              <FiUser size={18} />
              <span className="font-medium">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar