import { TextField } from '@mui/material';

interface BecomeSellerFormStep3Props {
  formik: any;
}

const BecomeSellerFormStep3 = ({ formik }: BecomeSellerFormStep3Props) => {
  return (
    <div className="space-y-5 flex flex-col gap-5 mb-4">
      <TextField
        fullWidth
        name="bankDetails.accountNumber"
        label="Account Number"
        value={formik.values.bankDetails.accountNumber}
        onChange={formik.handleChange}
        
        error={
          formik.touched.bankDetails?.accountNumber &&
          Boolean(formik.errors.bankDetails?.accountNumber)
        }
        helperText={
          formik.touched.bankDetails?.accountNumber &&
          formik.errors.bankDetails?.accountNumber
        }
      />

      <TextField
        fullWidth
        name="bankDetails.swiftCode"
        label="SWIFT Code"
        value={formik.values.bankDetails.swiftCode}
        onChange={formik.handleChange}
        
        error={
          formik.touched.bankDetails?.swiftCode &&
          Boolean(formik.errors.bankDetails?.swiftCode)
        }
        helperText={
          formik.touched.bankDetails?.swiftCode &&
          formik.errors.bankDetails?.swiftCode
        }
      />

      <TextField
        fullWidth
        name="bankDetails.accountHolderName"
        label="Account Holder Name"
        value={formik.values.bankDetails.accountHolderName}
        onChange={formik.handleChange}
        
        error={
          formik.touched.bankDetails?.accountHolderName &&
          Boolean(formik.errors.bankDetails?.accountHolderName)
        }
        helperText={
          formik.touched.bankDetails?.accountHolderName &&
          formik.errors.bankDetails?.accountHolderName
        }
      />
    </div>
  );
};

export default BecomeSellerFormStep3;
