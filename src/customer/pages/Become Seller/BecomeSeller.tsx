import { Button } from '@mui/material';
import { useEffect, useState } from 'react'; // Import useEffect
import { useLocation } from 'react-router-dom'; // Import useLocation
import SellerAccountForm from './SellerAccountForm';
import SellerLoginForm from './SellerLoginForm';

const BecomeSeller = () => {
  const [isLogin, setIsLogin] = useState(false)
  const location = useLocation(); // Hook để lấy dữ liệu truyền qua navigate

  // Logic: Nếu có state "login: true" được truyền tới -> Bật form Login
  useEffect(() => {
    if (location.state?.login) {
      setIsLogin(true);
    }
  }, [location.state]);

  const handleShowPage = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="flex justify-center min-h-screen items-center bg-gray-50 py-10">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row mx-5 min-h-[700px]">
        
        {/* Left Side - Form */}
        <section className="w-full md:w-1/2 p-10 flex flex-col justify-center relative">
          <div className="w-full max-w-md mx-auto">
            {!isLogin ? <SellerAccountForm /> : <SellerLoginForm />}

            <div className="mt-8 pt-5 border-t border-gray-100 text-center space-y-2">
              <h1 className="text-sm font-medium text-gray-500">
                {isLogin ? "Don't have a seller account?" : "Already have a seller account?"}
              </h1>
              <Button
                onClick={handleShowPage}
                fullWidth
                variant="outlined"
                sx={{
                  py: '10px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#0d9488',
                  color: '#0d9488',
                  '&:hover': {
                    borderColor: '#0f766e',
                    bgcolor: '#f0fdfa'
                  }
                }}
              >
                {isLogin ? 'Register as Seller' : 'Login as Seller'}
              </Button>
            </div>
          </div>
        </section>

        {/* Right Side - Image/Promo */}
        <section className="hidden md:block md:w-1/2 relative bg-teal-600">
           <img
                className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                src="https://res.cloudinary.com/dtlxpw3eh/image/upload/v1762946103/Becoming_an_online_seller_ndq5bx.jpg"
                alt="Become a Seller"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-10 text-white z-10 space-y-4">
              <div className="space-y-2">
                <p className="text-4xl font-bold leading-tight">Join AptDeco Business</p>
                <p className="text-xl text-teal-100 font-light">Boost your sales today with our professional tools.</p>
              </div>
              <div className="flex gap-2 pt-4">
                 <div className="h-1 w-10 bg-white rounded-full"></div>
                 <div className="h-1 w-2 bg-white/50 rounded-full"></div>
                 <div className="h-1 w-2 bg-white/50 rounded-full"></div>
              </div>
            </div>
        </section>

      </div>
    </div>
  )
}

export default BecomeSeller