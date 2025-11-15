import { Button, Step, StepLabel, Stepper } from '@mui/material';
import React, { useState } from 'react'
import BecomeSellerFormStep1 from './BecomeSellerFormStep1';
import { useFormik } from 'formik';
import BecomeSellerFormStep2 from './BecomeSellerFormStep2';
import BecomeSellerFormStep3 from './BecomeSellerFormStep3';
import BecomeSellerFormStep4 from './BecomeSellerFormStep4';

const steps = [
    'Tax Details & Mobile', 
    'Pickup Address', 
    'Bank Information', 
    'Supplier Info'];
    
const SellerAccountForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    
    const handleStep = (value: number) => () => {
      const nextStep = activeStep + value;
    
      if (activeStep === steps.length - 1 && value > 0) {
        // Đang ở bước cuối và bấm Next
        handleCreateAccount();
        return;
      }
    
      if (nextStep >= 0 && nextStep < steps.length) {
        setActiveStep(nextStep);
      }
    };
    
        const handleCreateAccount = () => {
            // Logic to create account
            console.log("Account Created");
        }

        const formik = useFormik({
            initialValues: {
                mobile: "",
                otp: "",
                MST: "",
            pickupAddress: {
                name: "",
                mobile: "",
                pinCode: "",
                address: "",
                city: "",
                state: "",
                locality: ""
            },
            bankDetails: {
                accountNumber: "",
                swiftCode: "",
                accountHolderName: "",
            },
            sellerName: "",
            email: "",
            businessDetails: {
                businessName: "",
                businessEmail: "",
                businessMobile: "",
                logo: "",
                banner: "",
                businessAddress: ""

            },
            password: "",
        },
        onSubmit: (values) => {
            console.log(values, "Form Submitted");

        },
    });
  return (
    <div>
        <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => ( 
                <Step sx={{color: "white",}} key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>
        <section className='mt-20 space-y-10'>
            <div>
                {activeStep == 0 ? <BecomeSellerFormStep1 formik={formik}/>:
                activeStep == 1 ? <BecomeSellerFormStep2 formik={formik}/>:
                activeStep == 2 ? <BecomeSellerFormStep3 formik={formik}/>:
                <BecomeSellerFormStep4 formik={formik}/>
                }
            </div>
            <div className='flex items-center justify-between'>
            <Button sx={{color: "white",}} onClick={handleStep(-1)} variant='contained' disabled={activeStep == 0}>
                Back
            </Button>
            <Button sx={{color: "white",}} onClick={handleStep(1)} variant='contained'>
                {activeStep == steps.length - 1?"Create Account" : "Next"}
            </Button>

        </div>
        </section>
    </div>
  )
}

export default SellerAccountForm