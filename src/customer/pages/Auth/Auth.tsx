import { Button } from '@mui/material'
import { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  return (
    <div className="flex justify-center min-h-screen items-center bg-gray-50 py-10">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row mx-5 min-h-[700px]">
        
        {/* Left Side - Image */}
        <section className="hidden md:block md:w-1/2 relative bg-gray-900">
             <img
                className="w-full h-full object-cover opacity-80"
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                alt="Login Banner"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
             
             <div className="absolute bottom-0 left-0 p-12 text-white z-10 space-y-4">
               <h2 className="text-4xl font-bold leading-tight">Welcome Back</h2>
               <p className="text-gray-200 text-lg font-light">Discover premium furniture for your dream home.</p>
             </div>
        </section>

        {/* Right Side - Form */}
        <section className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 relative">
          
          {/* Form Content */}
          <div className="w-full max-w-md mx-auto">
             {isLogin ? <LoginForm /> : <RegisterForm />}

             <div className="flex items-center gap-2 justify-center mt-8 pt-5 border-t border-gray-100">
                <p className="text-gray-500 text-sm">{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
                <Button 
                  onClick={() => setIsLogin(!isLogin)} 
                  size="small"
                  sx={{ fontWeight: 600, textTransform: 'none', color: '#0d9488' }}
                >
                  {isLogin ? 'Create Account' : 'Login'}
                </Button>
              </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Auth
