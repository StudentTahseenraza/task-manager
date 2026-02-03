import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { 
  FiLogOut, 
  FiUser, 
  FiHome, 
  FiCheckSquare,
  FiBell,
  FiSettings,
  FiMoon,
  FiSun
} from 'react-icons/fi'
import { useState } from 'react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiHome },
  { path: '/tasks', label: 'Tasks', icon: FiCheckSquare },
]

const EnhancedNavbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="glass backdrop-blur-xl sticky top-0 z-50 border-b border-white/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl rotate-45 group-hover:rotate-90 transition-transform duration-500 shadow-glow" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-primary-400 rounded-xl opacity-70 blur group-hover:opacity-100 transition-all duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text">TaskSphere</span>
              <span className="text-xs text-gray-400">3D Task Manager</span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-300' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} className={isActive ? 'text-primary-400' : ''} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 to-purple-400 rounded-full"
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 group"
            >
              {darkMode ? (
                <FiSun size={20} className="text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <FiMoon size={20} className="text-gray-400 group-hover:rotate-180 transition-transform duration-500" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 relative">
                <FiBell size={20} className="text-gray-300" />
                {notificationCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center"
                  >
                    {notificationCount}
                  </motion.span>
                )}
              </button>
            </div>

            {/* Settings */}
            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300">
              <FiSettings size={20} className="text-gray-300" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center">
                  <FiUser size={16} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-gray-400">{user?.email}</span>
                </div>
              </div>

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 hover:from-red-500/30 hover:to-pink-500/30 hover:text-red-200 transition-all duration-300"
              >
                <FiLogOut size={18} />
                <span className="hidden md:inline font-medium">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default EnhancedNavbar