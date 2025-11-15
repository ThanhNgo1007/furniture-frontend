import { useState } from 'react'
import SellerLoginForm from './SellerLoginForm';
import SellerAccountForm from './SellerAccountForm';
import { Button } from '@mui/material';

const BecomeSeller = () => {

    const [isLogin, setIsLogin] = useState(false);

    const handleShowPage = () => {
        setIsLogin(!isLogin);
    }


  return (
    <div className='grid md:gap-10 grid-cols-3 min-h-screen'>
        <section className='lg:col-span-1 md:col-span-2 col-span-3 p-10 shadow-lg rounded-b-md'> 

            {!isLogin ? <SellerAccountForm/> : <SellerLoginForm/>}

            <div className='mt-10 space-y-2'>
                <h1 className='text-center text-sm font-medium'>Have Account ?</h1>
                <Button
                onClick={handleShowPage}
                fullWidth
                variant="outlined"
                sx={{
                    py: "11px",
                    bgcolor: "#E27E6A",
                    color: "white",
                    borderColor: "#E27E6A",
                }}
                >
                {isLogin ? "Register" : "Login"}
                </Button>


            </div>

        </section>
        <section className='hidden md:col-span-1 lg:col-span-2 md:flex justify-center items-center'>

            <div className='lg:w-full px-5 space-y-10'>
                <div className='space-y-2 font-bold text-center'>
                    <p className='text-4xl'>Join AptDeco Bussiness</p>
                    <p className='text-xl text-teal-500'>Boost your sales today</p>
                </div>
                <img src="https://res.cloudinary.com/dtlxpw3eh/image/upload/v1762946103/Becoming_an_online_seller_ndq5bx.jpg" alt="img" />
            </div>
        </section>

    </div>
  )
}

export default BecomeSeller