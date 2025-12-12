import { Button, Step, StepLabel, Stepper } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import BecomeSellerFormStep1 from './BecomeSellerFormStep1';
import BecomeSellerFormStep2 from './BecomeSellerFormStep2';
import BecomeSellerFormStep3 from './BecomeSellerFormStep3';
import BecomeSellerFormStep4 from './BecomeSellerFormStep4';
// Import Hook và Action
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../State/Store';
import { registerSeller } from '../../../State/seller/sellerAuthSlice';

const SellerAccountForm = () => {
    const { t } = useTranslation();
    const [activeStep, setActiveStep] = useState(0);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const steps = [
        t('becomeSeller.steps.taxMobile'), 
        t('becomeSeller.steps.pickupAddress'), 
        t('becomeSeller.steps.bankInfo'), 
        t('becomeSeller.steps.supplierInfo')
    ];
    
    const validationSchemas = [
        // Step 0: Tax & Mobile
        Yup.object({
            MST: Yup.string().required(t('becomeSeller.validation.mstRequired')),
            mobile: Yup.string()
                .required(t('becomeSeller.validation.mobileRequired'))
                .matches(/^[0-9]{10}$/, t('becomeSeller.validation.mobileFormat')),
        }),
        // Step 1: Pickup Address
        Yup.object({
            pickupAddress: Yup.object({
                name: Yup.string().required(t('becomeSeller.validation.nameRequired')),
                mobile: Yup.string()
                    .required(t('becomeSeller.validation.mobileRequired'))
                    .matches(/^[0-9]{10}$/, t('becomeSeller.validation.mobileFormat')),
                pinCode: Yup.string()
                    .required(t('becomeSeller.validation.pinCodeRequired'))
                    .matches(/^[0-9]{5}$/, t('becomeSeller.validation.pinCodeFormat')),
                address: Yup.string().required(t('becomeSeller.validation.addressRequired')),
                city: Yup.string().required(t('becomeSeller.validation.cityRequired')),
                ward: Yup.string().required(t('becomeSeller.validation.wardRequired')),
                locality: Yup.string().required(t('becomeSeller.validation.districtRequired')),
            }),
        }),
        // Step 2: Bank Info
        Yup.object({
            bankDetails: Yup.object({
                accountNumber: Yup.string().required(t('becomeSeller.validation.accountNumberRequired')),
                accountHolderName: Yup.string().required(t('becomeSeller.validation.accountHolderRequired')),
                swiftCode: Yup.string().required(t('becomeSeller.validation.swiftRequired')),
            }),
        }),
        // Step 3: Supplier Info
        Yup.object({
            sellerName: Yup.string().required(t('becomeSeller.validation.sellerNameRequired')),
            email: Yup.string().email(t('becomeSeller.validation.emailInvalid')).required(t('becomeSeller.validation.emailRequired')),
            password: Yup.string().required(t('becomeSeller.validation.passwordRequired')).min(6, t('becomeSeller.validation.passwordMin')),
            businessDetails: Yup.object({
                businessName: Yup.string().required(t('becomeSeller.validation.businessNameRequired')),
                businessEmail: Yup.string().email(t('becomeSeller.validation.emailInvalid')).required(t('becomeSeller.validation.businessEmailRequired')),
                businessMobile: Yup.string().required(t('becomeSeller.validation.businessMobileRequired')),
                businessAddress: Yup.string().required(t('becomeSeller.validation.businessAddressRequired')),
            }),
        }),
    ];
    
    // Khởi tạo Formik
    const formik = useFormik({
        initialValues: {
            sellerName: "",
            email: "",
            password: "",
            mobile: "",
            MST: "", 
            pickupAddress: {
                name: "",
                mobile: "",
                pinCode: "",
                address: "",
                city: "",
                ward: "",
                locality: ""
            },
            bankDetails: { 
                accountNumber: "",
                accountHolderName: "",
                swiftCode: ""
            },
            businessDetails: { 
                businessName: "", 
                businessEmail: "",
                businessMobile: "",
                logo: "",
                banner: "",
                businessAddress: ""
            },
        },
        validationSchema: validationSchemas[activeStep], // Dynamic schema based on step
        validateOnBlur: false, // Disable onBlur validation as requested
        validateOnChange: false, // Disable onChange validation as requested
        onSubmit: (values) => {
            handleCreateAccount(values);
        },
    });

    const handleCreateAccount = (values: any) => {
        dispatch(registerSeller(values))
            .unwrap()
            .then(() => {
                navigate('/seller-verification-waiting', { state: { email: values.email } }); 
            })
            .catch((err: any) => {
                console.error("Registration error:", err);
                // alert("Failed to create account."); // Removed alert
            });
    }

    const handleStep = (value: number) => async () => {
        const nextStep = activeStep + value;

        // Nếu bấm Back, không cần validate
        if (value < 0) {
            setActiveStep(nextStep);
            return;
        }

        // Nếu bấm Next hoặc Create Account -> Validate current step
        const errors = await formik.validateForm();
        
        // Check if there are errors relevant to the current step
        // We can check if the current schema produces errors
        // Or simply check if 'errors' object is not empty (since we set validationSchema dynamically)
        
        // However, validateForm validates against the CURRENT schema.
        // Since we update schema on render (via validationSchemas[activeStep]), 
        // formik.validateForm() will validate the current step's fields.
        
        if (Object.keys(errors).length > 0) {
            // Mark all fields as touched to show errors
            const touched: any = {};
            Object.keys(errors).forEach((key) => {
                const errorValue = (errors as any)[key];
                if (typeof errorValue === 'object' && errorValue !== null) {
                    touched[key] = {};
                    Object.keys(errorValue).forEach((nestedKey) => {
                        touched[key][nestedKey] = true;
                    });
                } else {
                    touched[key] = true;
                }
            });
            formik.setTouched(touched);
            return; // Stop if errors exist
        }

        // Nếu đang ở bước cuối và bấm Next (Create Account)
        if (activeStep === steps.length - 1 && value > 0) {
            formik.handleSubmit();
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
                    {t('becomeSeller.buttons.back')}
                </Button>
                <Button sx={{color: "white"}} onClick={handleStep(1)} variant='contained'>
                    {activeStep === steps.length - 1 ? t('becomeSeller.buttons.createAccount') : t('becomeSeller.buttons.next')}
                </Button>
            </div>
        </section>
    </div>
  )
}

export default SellerAccountForm