/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useState } from 'react'
import AddressCard from './AddressCard'
import AddressForm from './AddressForm';
import PricingCard from '../Cart/PricingCard';
import { Add } from '@mui/icons-material';
import { object } from 'yup';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const paymentGatewayList=[
    {
        value:"COD",
        image: "https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760982183/cod_tgv7da.jpg",
        label: ""
    },
]

const Checkout = () => {
const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
const [paymentGateway, setPaymentGateway] = useState("COD");
const handlePaymentChange = (event:any) => {
    setPaymentGateway(event.target.value);
}
  return (
    <>
    <div className='pt-10 px-5 sm:px-10 md:px-44
    lg:px-60 min-h-screen'>
        <div className="space-y-5 lg:space-y-0 lg:grid grid-cols-3
        lg:gap-9">

            <div className="col-span-2 space-y-5">

                <div className="flex justify-between items-center">

                    <h1 className='font-semibold text-lg'>Select Address</h1>
                    <Button
                    variant='outlined'
                    color='success'
                     onClick={handleOpen}>
                        Add new address
                    </Button>
                </div>
                <div className='text-md font-medium space-y-5'>
                    <p>Saved Addresses</p>
                    <div className='space-y-3'>
                        {[1,1,1].map((item)=><AddressCard/>)}
                    </div>

                </div>
                <div className='py-4 px-6 rounded-md border border-gray-200'>
                    <Button 
                    onClick={handleOpen}
                    color='success'>
                        <Add/>
                        Add new address
                    </Button>
                </div>
            </div>
            <div>
                <div>
                        <div className='space-y-3 p-5 border border-gray-200 rounded-md'>
                            <h1 className='font-medium pb-2 text-center'>Chose Payment Gateway</h1>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            className='flex justify-between pr-0'
                            onChange={handlePaymentChange}
                            value={paymentGateway}
                        >
                            {paymentGatewayList.map((item)=><FormControlLabel 
                            value={item.value} 
                            control={<Radio />} 
                            className='border border-gray-100 w-[45%] pr-2 rounded-md flex justify-center'
                            label={
                                <img className={`${item.value=="COD"?"w-20":""} object-cover`} src={item.image} alt={item.label} />
                            } />)}
                            
                        </RadioGroup>
                </div>
                </div>
                <div className='border rounded-md border-gray-100'>
            
                    <PricingCard/>
                    <div className='p-5'>
                        <Button
                        color='success'
                        fullWidth
                        variant='contained' 
                        sx={{py: "15px"}}>
                            Check out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <AddressForm/>
        </Box>
    </Modal>
    </>
  )
}

export default Checkout