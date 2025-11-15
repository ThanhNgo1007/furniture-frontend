/* eslint-disable no-constant-condition */
import { Box, Button, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import OrderStepper from './OrderStepper';
import PaymentsIcon from '@mui/icons-material/Payments';

const OrderDetails = () => {
    const navigate=useNavigate();
  return (
    <Box className="space-y-5">
        <section className='flex flex-col gap-5 justify-center items-center'>
            <img className="w-[100px]" src={"https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811578/storklinta-6-drawer-dresser-white-anchor-1_fkmzra.avif"} alt="" />
            <div className='text-sm space-y-1 text-center'>
                <h1 className='font-bold'>Storklinta
                </h1>
                <p>6-drawer dresser, white/anchor/unlock function, 55 1/8x18 7/8x29 1/2"</p>

            </div>
            <div>
                <Button onClick={()=> navigate(`/review/${5}/create`)}>Write Review</Button>
            </div>

        </section>

        <section className='border-p5'>
            <OrderStepper orderStatus="SHIPPED"/>
        </section>
        <div className='border p-5'>
            <h1 className="font-bold pb-3">Delivery Address</h1>
            <div className="text-sm space-y-2">
                <div className="flex gap-5 font-medium">
                    <p>{"Ngo Huu Thanh"}</p>
                    <Divider flexItem orientation='vertical'/>
                    <p>09563643543</p>
                </div>
                <p>Nguyen Van Cu, Ninh Kieu, Can Tho</p>

            </div>

        </div>
        <div className='border space-y-4'>
            <div className="flex justify-between text-sm pt-5 px-5">
                <div className="space-y-1">
                    <p className='font-bold'>Total Item Price</p>
                    <p>You saved <span className='text-green-500 font-medium text-xs'>${699}.00 </span>
                    on this item</p>
                </div>
                <p className='font-medium'>$ {99}.00</p>
            </div>
            <div className="px-5">
                <div className='bg-teal-50 px-5 py-2 text-xs font-medium flex items-center gap-3'>
                    <PaymentsIcon/>
                    <p>Cash On Delivery</p>
                </div>
            </div>
            <Divider/>
            <div className='px-5 p-5'>
                <p className="text-xs"><strong>Sold By: </strong>{`Storklinta`}</p>
            </div>
            <div className='p-10'>
                <Button
                disabled={true}
                //  onClick={handleCancelOrder}
                color='error'
                sx={{py: "0.7rem"}}
                className=''
                variant='outlined'
                fullWidth
                >
                    {true?"Order Cancelled":"Cancel Order"}

                </Button>
            </div>

        </div>
        
    </Box>
  )
}

export default OrderDetails