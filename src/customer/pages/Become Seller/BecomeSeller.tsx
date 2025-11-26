import { Button } from '@mui/material'
import { useEffect, useState } from 'react'; // Import useEffect
import { useLocation } from 'react-router-dom'; // Import useLocation
import SellerAccountForm from './SellerAccountForm'
import SellerLoginForm from './SellerLoginForm'

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
    <div className="grid md:gap-10 grid-cols-3 min-h-screen">
      <section className="lg:col-span-1 md:col-span-2 col-span-3 p-10 shadow-lg rounded-b-md">
        {!isLogin ? <SellerAccountForm /> : <SellerLoginForm />}

        <div className="mt-10 space-y-2">
          <h1 className="text-center text-sm font-medium">Have Account ?</h1>
          <Button
            onClick={handleShowPage}
            fullWidth
            variant="outlined"
            sx={{
              py: '11px',
              bgcolor: 'white',
              color: '#E27E6A',
              borderColor: '#E27E6A'
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </Button>
        </div>
      </section>
      <section className="hidden md:col-span-1 lg:col-span-2 md:flex justify-center items-center">
        <div className="lg:w-full px-5 space-y-10">
          <div className="space-y-2 font-bold text-center">
            <p className="text-4xl">Join AptDeco Bussiness</p>
            <p className="text-xl text-teal-500">Boost your sales today</p>
          </div>
            <img
                src="https://res.cloudinary.com/dtlxpw3eh/image/upload/v1762946103/Becoming_an_online_seller_ndq5bx.jpg"
                alt="img"
            />
        </div>
      </section>
    </div>
  )
}

export default BecomeSeller