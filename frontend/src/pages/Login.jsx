import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { 
  FiMail, 
  FiLock,
  FiArrowRight,
  FiZap,
  FiStar,
  FiAward
} from 'react-icons/fi'
import { Sparkles } from 'lucide-react'  // Alternative for Sparkles
import { useState } from 'react'
import ThreeDCube from '../components/3DCube'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password)
    if (result.success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]"
        >
          {/* Left Column - 3D Visualization */}
          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-8 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                <ThreeDCube />
                <div className="mt-8 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="text-primary-400 animate-pulse" size={20} />
                    <span className="text-lg font-semibold gradient-text">Interactive 3D Task Management</span>
                  </div>
                  <p className="text-gray-400">
                    Experience task management like never before with our cutting-edge 3D interface, real-time animations, and immersive visualizations.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-dark rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl mb-4 shadow-glow"
              >
                <FiZap size={28} className="text-white" />
              </motion.div>
              <h1 className="text-4xl font-bold mb-2 gradient-text">Welcome Back</h1>
              <p className="text-gray-400">Sign in to access your 3D task universe</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                    <input
                      {...register('email')}
                      type="email"
                      className="input-3d w-full pl-12 pr-4 py-4"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-400 flex items-center space-x-2"
                  >
                    <span>⚠</span>
                    <span>{errors.email.message}</span>
                  </motion.p>
                )}
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                    <input
                      {...register('password')}
                      type="password"
                      className="input-3d w-full pl-12 pr-4 py-4"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-400 flex items-center space-x-2"
                  >
                    <span>⚠</span>
                    <span>{errors.password.message}</span>
                  </motion.p>
                )}
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="btn-primary-3d w-full py-4 text-lg font-semibold group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center space-x-3">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Entering 3D Space...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <motion.div
                        animate={{ x: isHovered ? 5 : 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <FiArrowRight size={20} />
                      </motion.div>
                    </>
                  )}
                </span>
              </motion.button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="gradient-text font-semibold hover:underline transition-all duration-300">
                  Create one now
                </Link>
              </p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 p-4 glass rounded-xl border border-white/10"
            >
              <p className="text-sm text-center">
                <span className="gradient-text font-semibold">Demo Credentials:</span>
                <div className="mt-2 space-y-1 text-gray-300">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-primary-400">Email:</span>
                    <span>demo@example.com</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-primary-400">Password:</span>
                    <span>demo123</span>
                  </div>
                </div>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login