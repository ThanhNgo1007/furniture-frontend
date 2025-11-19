import { Button } from '@mui/material'
import { useState } from 'react'
import loginImage from '../../../assets/afe3bb42-966a-406c-ade1-1b32c138af67_Homepage_Heroes_2022_MarA.webp'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  return (
    <div className="flex justify-center h-[90vh] items-center">
      <div className="max-w-2xl h-[85vh] rounded-md shadow-lg">
        <img className="w-full rounded-t-md" src={loginImage} alt="" />

        <div className="mt-8 px-10">
          {isLogin ? <LoginForm /> : <RegisterForm />}

          <div className="flex items-center gap-1 justify-center mt-5">
            <p>{isLogin && "Don't"} Have Account</p>
            <Button onClick={() => setIsLogin(!isLogin)} size="small">
              {isLogin ? 'Create Account' : 'Login'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
