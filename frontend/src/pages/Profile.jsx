import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import EnhancedNavbar from '../components/EnhancedNavbar'
import { 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiEdit2,
  FiSave,
  FiActivity,
  FiAward,
  FiTrendingUp,
  FiSettings,
  FiGlobe,
  FiUpload,
  FiCheck,
  FiX,
  FiShield,
  FiDatabase,
  FiSmartphone
} from 'react-icons/fi'
import { format } from 'date-fns'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    phone: ''
  })
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    efficiency: 0,
    streak: 0,
    activeProjects: 0
  })
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        phone: user.phone || ''
      })
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      
      // Fetch user stats
      const tasksResponse = await axios.get(`${API_BASE_URL}/tasks`)
      const tasks = tasksResponse.data
      
      const totalTasks = tasks.length
      const completedTasks = tasks.filter(t => t.status === 'completed').length
      const efficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      
      setStats({
        totalTasks,
        completedTasks,
        efficiency,
        streak: Math.floor(Math.random() * 30) + 1, // Mock data
        activeProjects: Math.floor(Math.random() * 10) + 1
      })
      
      // Fetch recent activity (mock data for now)
      setActivity([
        { id: 1, action: 'Created task', description: 'Complete project documentation', time: '2 hours ago', icon: '📝' },
        { id: 2, action: 'Completed task', description: 'Fix login bug', time: '1 day ago', icon: '✅' },
        { id: 3, action: 'Updated profile', description: 'Changed profile picture', time: '2 days ago', icon: '🔄' },
        { id: 4, action: 'Achievement', description: '7 day streak!', time: '3 days ago', icon: '🏆' },
        { id: 5, action: 'Task overdue', description: 'Team meeting notes', time: '5 days ago', icon: '⏰' }
      ])
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    const result = await updateProfile(profileData)
    if (result.success) {
      setEditing(false)
      toast.success('Profile updated successfully!')
    }
  }

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploadingAvatar(true)
    try {
      // Mock upload - in real app, upload to cloud storage
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=0ea5e9&color=fff&size=200`
      setAvatarUrl(mockUrl)
      toast.success('Profile picture updated!')
    } catch (error) {
      toast.error('Failed to upload profile picture')
    } finally {
      setUploadingAvatar(false)
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
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  const statCardVariants = {
    hidden: { scale: 0, opacity: 0 },
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
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
    }
  }

  const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'settings', label: 'Settings', icon: FiSettings },
    { id: 'activity', label: 'Activity', icon: FiActivity },
    { id: 'security', label: 'Security', icon: FiShield }
  ]

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
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-2xl">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Profile" 
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-white">
                        {profileData.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <motion.label
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all"
                  >
                    <FiUpload className="text-gray-800" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </motion.label>
                </div>
              </motion.div>
              
              <div>
                <h1 className="text-4xl font-bold gradient-text">{profileData.name}</h1>
                <p className="text-gray-400 mt-2 flex items-center space-x-2">
                  <FiMail size={16} />
                  <span>{profileData.email}</span>
                </p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="px-4 py-2 rounded-full bg-primary-500/20 text-primary-300 flex items-center space-x-2">
                    <FiAward />
                    <span>Pro Member</span>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-green-500/20 text-green-300 flex items-center space-x-2">
                    <FiCalendar />
                    <span>Joined {user?.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'Recently'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditing(!editing)}
              className="btn-primary-3d flex items-center space-x-3 px-8 py-4"
            >
              {editing ? (
                <>
                  <FiX size={20} />
                  <span>Cancel Edit</span>
                </>
              ) : (
                <>
                  <FiEdit2 size={20} />
                  <span>Edit Profile</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12"
        >
          {[
            { label: 'Total Tasks', value: stats.totalTasks, icon: FiDatabase, color: 'from-blue-500 to-cyan-500', progress: 100 },
            { label: 'Completed', value: stats.completedTasks, icon: FiCheck, color: 'from-green-500 to-emerald-500', progress: stats.efficiency },
            { label: 'Efficiency', value: `${stats.efficiency}%`, icon: FiTrendingUp, color: 'from-purple-500 to-pink-500', progress: stats.efficiency },
            { label: 'Current Streak', value: `${stats.streak} days`, icon: FiActivity, color: 'from-orange-500 to-yellow-500', progress: 80 },
            { label: 'Active Projects', value: stats.activeProjects, icon: FiAward, color: 'from-red-500 to-rose-500', progress: 60 }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              custom={index}
              variants={statCardVariants}
              whileHover="hover"
              className="glass-dark rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-10" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progress}%` }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                    className={`h-full bg-gradient-to-r ${stat.color}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="glass-dark rounded-2xl p-2 mb-8">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {activeTab === 'profile' && (
              <>
                {/* Profile Form */}
                <motion.div
                  variants={itemVariants}
                  className="lg:col-span-2 glass-dark rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-bold mb-6 gradient-text">Personal Information</h2>
                  
                  {editing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
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
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="input-3d w-full"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          className="input-3d w-full h-32"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                            className="input-3d w-full"
                            placeholder="City, Country"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Website
                          </label>
                          <input
                            type="url"
                            value={profileData.website}
                            onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                            className="input-3d w-full"
                            placeholder="https://"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="input-3d w-full"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>
                      
                      <div className="flex space-x-4 pt-6">
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn-primary-3d flex items-center space-x-3 flex-1"
                        >
                          <FiSave />
                          <span>Save Changes</span>
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditing(false)}
                          className="flex-1 px-6 py-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors font-medium"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-white/5">
                            <label className="text-sm text-gray-400">Full Name</label>
                            <p className="text-lg font-medium text-white mt-1">{profileData.name}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5">
                            <label className="text-sm text-gray-400">Email</label>
                            <p className="text-lg font-medium text-white mt-1">{profileData.email}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5">
                            <label className="text-sm text-gray-400">Location</label>
                            <p className="text-lg font-medium text-white mt-1">
                              {profileData.location || 'Not specified'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-white/5">
                            <label className="text-sm text-gray-400">Bio</label>
                            <p className="text-lg font-medium text-white mt-1">
                              {profileData.bio || 'No bio provided'}
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5">
                            <label className="text-sm text-gray-400">Website</label>
                            <p className="text-lg font-medium text-white mt-1">
                              {profileData.website || 'Not specified'}
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5">
                            <label className="text-sm text-gray-400">Phone</label>
                            <p className="text-lg font-medium text-white mt-1">
                              {profileData.phone || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="glass-dark rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6 gradient-text">Recent Activity</h2>
                  <div className="space-y-4">
                    {activity.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="text-2xl">{item.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-white">{item.action}</div>
                          <div className="text-sm text-gray-400 mt-1">{item.description}</div>
                          <div className="text-xs text-gray-500 mt-2">{item.time}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {activeTab === 'settings' && (
              <div className="lg:col-span-3 glass-dark rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 gradient-text">Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-white/5">
                      <h3 className="text-lg font-bold text-white mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-300">Email notifications</span>
                          <div className="relative">
                            <input type="checkbox" className="sr-only" defaultChecked />
                            <div className="w-12 h-6 bg-gray-700 rounded-full shadow-inner"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform translate-x-6"></div>
                          </div>
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-300">Push notifications</span>
                          <div className="relative">
                            <input type="checkbox" className="sr-only" defaultChecked />
                            <div className="w-12 h-6 bg-gray-700 rounded-full shadow-inner"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform translate-x-6"></div>
                          </div>
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-300">Task reminders</span>
                          <div className="relative">
                            <input type="checkbox" className="sr-only" />
                            <div className="w-12 h-6 bg-gray-700 rounded-full shadow-inner"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition"></div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-white/5">
                      <h3 className="text-lg font-bold text-white mb-4">Appearance</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Theme</label>
                          <select className="input-3d w-full">
                            <option>Dark Mode</option>
                            <option>Light Mode</option>
                            <option>Auto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Language</label>
                          <select className="input-3d w-full">
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-white/5">
                      <h3 className="text-lg font-bold text-white mb-4">Data & Storage</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Storage Used</span>
                          <span className="text-primary-300">1.2 GB / 10 GB</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary-500 to-purple-500 w-1/6"></div>
                        </div>
                        <button className="w-full py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
                          Clear Cache
                        </button>
                        <button className="w-full py-3 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-white/5">
                      <h3 className="text-lg font-bold text-white mb-4">Export Data</h3>
                      <div className="space-y-3">
                        <button className="w-full py-3 rounded-xl bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 transition-colors">
                          Export Tasks as CSV
                        </button>
                        <button className="w-full py-3 rounded-xl bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors">
                          Export Profile Data
                        </button>
                        <button className="w-full py-3 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors">
                          Backup All Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="lg:col-span-3 glass-dark rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 gradient-text">Security</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-white/5">
                      <h3 className="text-lg font-bold text-white mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                          <input type="password" className="input-3d w-full" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">New Password</label>
                          <input type="password" className="input-3d w-full" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                          <input type="password" className="input-3d w-full" />
                        </div>
                        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-white/5">
                      <h3 className="text-lg font-bold text-white mb-4">Two-Factor Authentication</h3>
                      <div className="space-y-4">
                        <p className="text-gray-400 text-sm">
                          Add an extra layer of security to your account.
                        </p>
                        <button className="w-full py-3 rounded-xl bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-white/5">
                      <h3 className="text-lg font-bold text-white mb-4">Active Sessions</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                              <FiGlobe className="text-primary-300" />
                            </div>
                            <div>
                              <div className="font-medium text-white">Chrome • Windows</div>
                              <div className="text-xs text-gray-400">Current Session</div>
                            </div>
                          </div>
                          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                              <FiSmartphone className="text-gray-400" />
                            </div>
                            <div>
                              <div className="font-medium text-white">Safari • iPhone</div>
                              <div className="text-xs text-gray-400">2 days ago</div>
                            </div>
                          </div>
                          <button className="text-sm text-red-400 hover:text-red-300">
                            Revoke
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-white/5">
                      <h3 className="text-lg font-bold text-white mb-4">Login History</h3>
                      <div className="space-y-3">
                        {[
                          { location: 'New York, US', device: 'Chrome • Windows', time: '2 hours ago' },
                          { location: 'London, UK', device: 'Firefox • MacOS', time: '1 day ago' },
                          { location: 'Tokyo, JP', device: 'Safari • iPhone', time: '3 days ago' }
                        ].map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <div>
                              <div className="font-medium text-white">{session.location}</div>
                              <div className="text-xs text-gray-400">{session.device}</div>
                            </div>
                            <div className="text-sm text-gray-400">{session.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Profile