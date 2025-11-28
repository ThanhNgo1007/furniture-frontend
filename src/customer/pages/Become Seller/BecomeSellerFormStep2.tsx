import { Autocomplete, Box, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const BecomeSellerFormStep2 = ({ formik }: any) => {
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

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

    // Fetch Districts when Province is already selected (e.g. edit mode or reload)
    // For simplicity, we'll just handle the change events for now. 
    // If we needed to support pre-filled data, we'd need effects to load districts/wards based on names.

    const handleProvinceChange = async (_event: any, newValue: any) => {
        formik.setFieldValue('pickupAddress.city', newValue?.name || '');
        formik.setFieldValue('pickupAddress.locality', '');
        formik.setFieldValue('pickupAddress.ward', '');
        setDistricts([]);
        setWards([]);

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
        formik.setFieldValue('pickupAddress.locality', newValue?.name || '');
        formik.setFieldValue('pickupAddress.ward', '');
        setWards([]);

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
        formik.setFieldValue('pickupAddress.ward', newValue?.name || '');
    };

    return (
        <Box>
            <p className='text-xl font-bold text-center pb-5'>Pickup Details</p>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                    <Grid size={{xs:12}}>
                        <TextField
                            fullWidth
                            name="pickupAddress.name"
                            label="Name"
                            value={formik.values.pickupAddress.name}
                            onChange={formik.handleChange}
                            error={formik.touched.pickupAddress?.name && Boolean(formik.errors.pickupAddress?.name)}
                            helperText={formik.touched.pickupAddress?.name && formik.errors.pickupAddress?.name}
                        />
                    </Grid>
                    <Grid size={{xs:6}}>
                        <TextField
                            fullWidth
                            name="pickupAddress.mobile"
                            label="Mobile Number"
                            value={formik.values.pickupAddress.mobile}
                            onChange={formik.handleChange}
                            error={formik.touched.pickupAddress?.mobile && Boolean(formik.errors.pickupAddress?.mobile)}
                            helperText={formik.touched.pickupAddress?.mobile && formik.errors.pickupAddress?.mobile}
                        />
                    </Grid>

                    <Grid size={{xs:6}}>
                        <TextField
                            fullWidth
                            name="pickupAddress.pinCode"
                            label="Pin Code"
                            value={formik.values.pickupAddress.pinCode}
                            onChange={formik.handleChange}
                            error={formik.touched.pickupAddress?.pinCode && Boolean(formik.errors.pickupAddress?.pinCode)}
                            helperText={formik.touched.pickupAddress?.pinCode && formik.errors.pickupAddress?.pinCode}
                        />
                    </Grid>

                    {/* Address API Fields */}
                    <Grid size={{xs:4}}>
                        <Autocomplete
                            options={provinces}
                            getOptionLabel={(option) => option.name}
                            value={provinces.find(p => p.name === formik.values.pickupAddress.city) || null}
                            onChange={handleProvinceChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Province/City"
                                    error={formik.touched.pickupAddress?.city && Boolean(formik.errors.pickupAddress?.city)}
                                    helperText={formik.touched.pickupAddress?.city && formik.errors.pickupAddress?.city}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{xs:4}}>
                        <Autocomplete
                            options={districts}
                            getOptionLabel={(option) => option.name}
                            value={districts.find(d => d.name === formik.values.pickupAddress.locality) || null}
                            onChange={handleDistrictChange}
                            disabled={!formik.values.pickupAddress.city}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="District"
                                    error={formik.touched.pickupAddress?.locality && Boolean(formik.errors.pickupAddress?.locality)}
                                    helperText={formik.touched.pickupAddress?.locality && formik.errors.pickupAddress?.locality}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{xs:4}}>
                        <Autocomplete
                            options={wards}
                            getOptionLabel={(option) => option.name}
                            value={wards.find(w => w.name === formik.values.pickupAddress.ward) || null}
                            onChange={handleWardChange}
                            disabled={!formik.values.pickupAddress.locality}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Ward"
                                    error={formik.touched.pickupAddress?.ward && Boolean(formik.errors.pickupAddress?.ward)}
                                    helperText={formik.touched.pickupAddress?.ward && formik.errors.pickupAddress?.ward}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{xs:12}}>
                        <TextField
                            fullWidth
                            name="pickupAddress.address"
                            label="Street Address (House No, Building, Street)"
                            value={formik.values.pickupAddress.address}
                            onChange={formik.handleChange}
                            error={formik.touched.pickupAddress?.address && Boolean(formik.errors.pickupAddress?.address)}
                            helperText={formik.touched.pickupAddress?.address && formik.errors.pickupAddress?.address}
                        />
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}

export default BecomeSellerFormStep2