import { TextField } from '@mui/material';

interface BecomeSellerFormStep4Props {
  formik: any;
}

const BecomeSellerFormStep4 = ({ formik }: BecomeSellerFormStep4Props) => {
  return (
    <div className="space-y-5 flex flex-col gap-5 mb-4">
      
      {/* 1. Business Name (Đã có) */}
      <TextField
        fullWidth
        name="businessDetails.businessName"
        label="Business Name"
        value={formik.values.businessDetails.businessName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.businessDetails?.businessName &&
          Boolean(formik.errors.businessDetails?.businessName)
        }
        helperText={
          formik.touched.businessDetails?.businessName &&
          formik.errors.businessDetails?.businessName
        }
      />

      {/* 2. MỚI: Business Mobile (Bạn đang thiếu cái này) */}
      <TextField
        fullWidth
        name="businessDetails.businessMobile"
        label="Business Mobile"
        value={formik.values.businessDetails.businessMobile}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.businessDetails?.businessMobile &&
          Boolean(formik.errors.businessDetails?.businessMobile)
        }
        helperText={
          formik.touched.businessDetails?.businessMobile &&
          formik.errors.businessDetails?.businessMobile
        }
      />

      {/* 3. MỚI: Business Email (Bạn đang thiếu cái này) */}
      <TextField
        fullWidth
        name="businessDetails.businessEmail"
        label="Business Email"
        value={formik.values.businessDetails.businessEmail}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.businessDetails?.businessEmail &&
          Boolean(formik.errors.businessDetails?.businessEmail)
        }
        helperText={
          formik.touched.businessDetails?.businessEmail &&
          formik.errors.businessDetails?.businessEmail
        }
      />

      {/* 4. MỚI: Business Address (Bạn đang thiếu cái này) */}
      <TextField
        fullWidth
        name="businessDetails.businessAddress"
        label="Business Address"
        value={formik.values.businessDetails.businessAddress}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.businessDetails?.businessAddress &&
          Boolean(formik.errors.businessDetails?.businessAddress)
        }
        helperText={
          formik.touched.businessDetails?.businessAddress &&
          formik.errors.businessDetails?.businessAddress
        }
      />

      {/* 5. Seller Name (Đã có) */}
      <TextField
        fullWidth
        name="sellerName"
        label="Seller Name"
        value={formik.values.sellerName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.sellerName && Boolean(formik.errors.sellerName)}
        helperText={formik.touched.sellerName && formik.errors.sellerName}
      />

      {/* 6. Account Email (Login) (Đã có) */}
      <TextField
        fullWidth
        name="email"
        label="Account Email (Login)"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />

      {/* 7. Password (Đã có) */}
      <TextField
        fullWidth
        name="password"
        label="Password"
        type="password" // Nên thêm type="password" để che mật khẩu
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />
    </div>
  );
};

export default BecomeSellerFormStep4;