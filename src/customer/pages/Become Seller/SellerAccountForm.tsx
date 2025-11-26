// File: web_fe/src/seller/pages/Become Seller/SellerAccountForm.tsx

import { Button, Step, StepLabel, Stepper } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import BecomeSellerFormStep1 from './BecomeSellerFormStep1';
import BecomeSellerFormStep2 from './BecomeSellerFormStep2';
import BecomeSellerFormStep3 from './BecomeSellerFormStep3';
import BecomeSellerFormStep4 from './BecomeSellerFormStep4';
// Import Hook và Action
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../State/Store';
import { registerSeller } from '../../../State/seller/sellerAuthSlice';

const steps = [
    'Tax Details & Mobile', 
    'Pickup Address', 
    'Bank Information', 
    'Supplier Info'
];
    
const SellerAccountForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    // Khởi tạo Formik
    const formik = useFormik({
    initialValues: {
        sellerName: "",
        email: "",
        password: "",
        mobile: "",
        MST: "", // Khớp với @JsonProperty("MST")
        pickupAddress: {
            name: "",
            mobile: "",
            pinCode: "",
            address: "",
            city: "",
            ward: "",
            locality: ""
        },
        bankDetails: { // Khớp với @JsonProperty("bankDetails")
            accountNumber: "",
            accountHolderName: "",
            swiftCode: ""
        },
        businessDetails: { // Khớp với @JsonProperty("businessDetails")
            businessName: "", // Khớp với @JsonProperty("businessName")
            businessEmail: "",
            businessMobile: "",
            logo: "",
            banner: "",
            businessAddress: ""
        },
    },
    onSubmit: (values) => {
            // Hàm này sẽ được gọi khi submit form ở bước cuối
            handleCreateAccount(values);
        },
    });

    const handleCreateAccount = (values: any) => {
        dispatch(registerSeller(values))
            .unwrap()
            .then(() => {
                // SỬA: Truyền email qua state khi navigate
                navigate('/seller-verification-waiting', { state: { email: values.email } }); 
            })
            .catch((err: any) => {
                alert("Failed to create account.");
            });
    }

    const handleStep = (value: number) => () => {
      const nextStep = activeStep + value;
    
      // Nếu đang ở bước cuối và bấm Next -> Submit form
      if (activeStep === steps.length - 1 && value > 0) {
        formik.handleSubmit(); // Kích hoạt onSubmit của Formik
        return;
      }
    
      if (nextStep >= 0 && nextStep < steps.length) {
        setActiveStep(nextStep);
      }
    };

  return (
    <div>
        <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => ( 
                <Step sx={{color: "white"}} key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>
        <section className='mt-20 space-y-10'>
            {/* Truyền formik vào các Step components */}
            <div>
                {activeStep === 0 ? <BecomeSellerFormStep1 formik={formik}/>:
                activeStep === 1 ? <BecomeSellerFormStep2 formik={formik}/>:
                activeStep === 2 ? <BecomeSellerFormStep3 formik={formik}/>:
                <BecomeSellerFormStep4 formik={formik}/>
                }
            </div>
            
            <div className='flex items-center justify-between'>
                <Button sx={{color: "white"}} onClick={handleStep(-1)} variant='contained' disabled={activeStep === 0}>
                    Back
                </Button>
                <Button sx={{color: "white"}} onClick={handleStep(1)} variant='contained'>
                    {activeStep === steps.length - 1 ? "Create Account" : "Next"}
                </Button>
            </div>
        </section>
    </div>
  )
}

export default SellerAccountForm