import { Autocomplete, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface BecomeSellerFormStep4Props {
  formik: any;
}

const BecomeSellerFormStep4 = ({ formik }: BecomeSellerFormStep4Props) => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  // Local state for address parts
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const [streetAddress, setStreetAddress] = useState<string>("");

  // Fetch Provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/?depth=1');
        setProvinces(response.data);
      } catch (error) {
        console.error("Failed to fetch provinces", error);
      }
    };
    fetchProvinces();
  }, []);

  // Update Formik businessAddress whenever parts change
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard && streetAddress) {
      const fullAddress = `${streetAddress}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`;
      formik.setFieldValue('businessDetails.businessAddress', fullAddress);
    } else {
        // If any part is missing, we might still want to update or keep it empty
        // But validation requires it, so let's update it so validation fails if incomplete
        // actually, let's only update if we have at least something, or clear it if empty
        if (!streetAddress && !selectedProvince) {
             // formik.setFieldValue('businessDetails.businessAddress', "");
        }
    }
  }, [selectedProvince, selectedDistrict, selectedWard, streetAddress]);


  const handleProvinceChange = async (_event: any, newValue: any) => {
    setSelectedProvince(newValue);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);
    
    // Clear formik value if incomplete
    formik.setFieldValue('businessDetails.businessAddress', "");

    if (newValue?.code) {
      try {
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${newValue.code}?depth=2`);
        setDistricts(response.data.districts);
      } catch (error) {
        console.error("Failed to fetch districts", error);
      }
    }
  };

  const handleDistrictChange = async (_event: any, newValue: any) => {
    setSelectedDistrict(newValue);
    setSelectedWard(null);
    setWards([]);
    
    // Clear formik value if incomplete
    formik.setFieldValue('businessDetails.businessAddress', "");

    if (newValue?.code) {
      try {
        const response = await axios.get(`https://provinces.open-api.vn/api/d/${newValue.code}?depth=2`);
        setWards(response.data.wards);
      } catch (error) {
        console.error("Failed to fetch wards", error);
      }
    }
  };

  const handleWardChange = (_event: any, newValue: any) => {
    setSelectedWard(newValue);
    // Clear formik value if incomplete
    formik.setFieldValue('businessDetails.businessAddress', "");
  };
  
  const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setStreetAddress(event.target.value);
      // Clear formik value if incomplete logic handled in useEffect
  };

  return (
    <div className="space-y-5 flex flex-col gap-5 mb-4">
      
      {/* 1. Business Name */}
      <TextField
        fullWidth
        name="businessDetails.businessName"
        label="Business Name"
        value={formik.values.businessDetails.businessName}
        onChange={formik.handleChange}
        error={
          formik.touched.businessDetails?.businessName &&
          Boolean(formik.errors.businessDetails?.businessName)
        }
        helperText={
          formik.touched.businessDetails?.businessName &&
          formik.errors.businessDetails?.businessName
        }
      />

      {/* 2. Business Mobile */}
      <TextField
        fullWidth
        name="businessDetails.businessMobile"
        label="Business Mobile"
        value={formik.values.businessDetails.businessMobile}
        onChange={formik.handleChange}
        error={
          formik.touched.businessDetails?.businessMobile &&
          Boolean(formik.errors.businessDetails?.businessMobile)
        }
        helperText={
          formik.touched.businessDetails?.businessMobile &&
          formik.errors.businessDetails?.businessMobile
        }
      />

      {/* 3. Business Email */}
      <TextField
        fullWidth
        name="businessDetails.businessEmail"
        label="Business Email"
        value={formik.values.businessDetails.businessEmail}
        onChange={formik.handleChange}
        error={
          formik.touched.businessDetails?.businessEmail &&
          Boolean(formik.errors.businessDetails?.businessEmail)
        }
        helperText={
          formik.touched.businessDetails?.businessEmail &&
          formik.errors.businessDetails?.businessEmail
        }
      />

      {/* 4. Business Address (API Integrated) */}
      <Grid container spacing={2}>
          <Grid size={{xs:4}}>
            <Autocomplete
                options={provinces}
                getOptionLabel={(option) => option.name}
                value={selectedProvince}
                onChange={handleProvinceChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Province/City"
                        error={formik.touched.businessDetails?.businessAddress && !selectedProvince}
                    />
                )}
            />
          </Grid>
          <Grid size={{xs:4}}>
            <Autocomplete
                options={districts}
                getOptionLabel={(option) => option.name}
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedProvince}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="District"
                        error={formik.touched.businessDetails?.businessAddress && !selectedDistrict}
                    />
                )}
            />
          </Grid>
          <Grid size={{xs:4}}>
            <Autocomplete
                options={wards}
                getOptionLabel={(option) => option.name}
                value={selectedWard}
                onChange={handleWardChange}
                disabled={!selectedDistrict}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Ward"
                        error={formik.touched.businessDetails?.businessAddress && !selectedWard}
                    />
                )}
            />
          </Grid>
          <Grid size={{xs:12}}>
            <TextField
                fullWidth
                label="Street Address"
                value={streetAddress}
                onChange={handleStreetChange}
                error={formik.touched.businessDetails?.businessAddress && !streetAddress}
                helperText={formik.touched.businessDetails?.businessAddress && formik.errors.businessDetails?.businessAddress}
            />
          </Grid>
      </Grid>
      
      {/* Hidden field to display the concatenated address (Read Only) */}
      <TextField
        fullWidth
        name="businessDetails.businessAddress"
        label="Full Business Address (Auto-generated)"
        value={formik.values.businessDetails.businessAddress}
        InputProps={{
            readOnly: true,
        }}
        error={
          formik.touched.businessDetails?.businessAddress &&
          Boolean(formik.errors.businessDetails?.businessAddress)
        }
        helperText={
          formik.touched.businessDetails?.businessAddress &&
          formik.errors.businessDetails?.businessAddress
        }
      />

      {/* 5. Seller Name */}
      <TextField
        fullWidth
        name="sellerName"
        label="Seller Name"
        value={formik.values.sellerName}
        onChange={formik.handleChange}
        error={formik.touched.sellerName && Boolean(formik.errors.sellerName)}
        helperText={formik.touched.sellerName && formik.errors.sellerName}
      />

      {/* 6. Account Email (Login) */}
      <TextField
        fullWidth
        name="email"
        label="Account Email (Login)"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />

      {/* 7. Password */}
      <TextField
        fullWidth
        name="password"
        label="Password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />
    </div>
  );
};

export default BecomeSellerFormStep4;