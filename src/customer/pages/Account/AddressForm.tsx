import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

interface AddressFormProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (address: any) => void;
  initialValues?: any;
  title: string;
}

interface Province {
    code: number;
    name: string;
}

interface District {
    code: number;
    name: string;
}

interface Ward {
    code: number;
    name: string;
}

const AddressFormSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    mobile: Yup.string().required("Mobile number is required").matches(/^[0]\d{9}$/, "Invalid mobile number"),
    pinCode: Yup.string().required("Pin code is required").matches(/^\d{5,6}$/, "Invalid pin code"),
    address: Yup.string().required("Address details are required"),
    city: Yup.string().required("District (Quận/Huyện) is required"),
    ward: Yup.string().required("Ward (Phường/Xã) is required"),
    locality: Yup.string().required("Province (Tỉnh/Thành phố) is required"),
});

const AddressForm = ({ open, handleClose, handleSubmit, initialValues, title }: AddressFormProps) => {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | string>("");
    const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | string>("");

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get("https://provinces.open-api.vn/api/?depth=1");
                setProvinces(response.data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        fetchProvinces();
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            mobile: "",
            pinCode: "",
            address: "",
            locality: "", 
            city: "",     
            ward: "",     
        },
        validationSchema: AddressFormSchema,
        onSubmit: (values) => {
            handleSubmit(values);
            handleClose();
        },
    });

    useEffect(() => {
        if (initialValues) {
            formik.setValues({
                name: initialValues.name || "",
                mobile: initialValues.mobile || "",
                pinCode: initialValues.pinCode || "",
                address: initialValues.address || "",
                locality: initialValues.locality || "",
                city: initialValues.city || "",
                ward: initialValues.ward || "",
            });
        } else {
            formik.resetForm();
        }
    }, [initialValues, open]);

    const handleProvinceChange = async (provinceCode: number) => {
        setSelectedProvinceCode(provinceCode);
        setSelectedDistrictCode(""); 
        setDistricts([]);
        setWards([]);
        
        const province = provinces.find(p => p.code === provinceCode);
        formik.setFieldValue("locality", province?.name || ""); 
        formik.setFieldValue("city", ""); 
        formik.setFieldValue("ward", ""); 

        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            setDistricts(response.data.districts);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const handleDistrictChange = async (districtCode: number) => {
        setSelectedDistrictCode(districtCode);
        setWards([]);

        const district = districts.find(d => d.code === districtCode);
        formik.setFieldValue("city", district?.name || ""); 
        formik.setFieldValue("ward", ""); 

        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            setWards(response.data.wards);
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };

    const handleWardChange = (wardCode: number) => {
        const ward = wards.find(w => w.code === wardCode);
        formik.setFieldValue("ward", ward?.name || "");
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth name="name" label="Name"
                                value={formik.values.name} onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth name="mobile" label="Mobile"
                                value={formik.values.mobile} onChange={formik.handleChange}
                                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                                helperText={formik.touched.mobile && formik.errors.mobile}
                            />
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth error={formik.touched.locality && Boolean(formik.errors.locality)}>
                                <InputLabel>Province / City</InputLabel>
                                <Select
                                    value={selectedProvinceCode}
                                    label="Province / City"
                                    onChange={(e) => handleProvinceChange(e.target.value as number)}
                                >
                                    {provinces.map((province) => (
                                        <MenuItem key={province.code} value={province.code}>
                                            {province.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.locality && formik.errors.locality && (
                                    <FormHelperText>{formik.errors.locality}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth error={formik.touched.city && Boolean(formik.errors.city)}>
                                <InputLabel>District</InputLabel>
                                <Select
                                    value={selectedDistrictCode}
                                    label="District"
                                    onChange={(e) => handleDistrictChange(e.target.value as number)}
                                    disabled={!selectedProvinceCode}
                                >
                                    {districts.map((district) => (
                                        <MenuItem key={district.code} value={district.code}>
                                            {district.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.city && formik.errors.city && (
                                    <FormHelperText>{formik.errors.city}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControl fullWidth error={formik.touched.ward && Boolean(formik.errors.ward)}>
                                <InputLabel>Ward</InputLabel>
                                <Select
                                    value={wards.find(w => w.name === formik.values.ward)?.code || ""}
                                    label="Ward"
                                    onChange={(e) => handleWardChange(e.target.value as number)}
                                    disabled={!selectedDistrictCode}
                                >
                                    {wards.map((ward) => (
                                        <MenuItem key={ward.code} value={ward.code}>
                                            {ward.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.ward && formik.errors.ward && (
                                    <FormHelperText>{formik.errors.ward}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth name="address" label="Address Details (Street, House No)"
                                multiline rows={2}
                                value={formik.values.address} onChange={formik.handleChange}
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                            />
                        </Grid>
                         <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth name="pinCode" label="Pin Code"
                                value={formik.values.pinCode} onChange={formik.handleChange}
                                error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                                helperText={formik.touched.pinCode && formik.errors.pinCode}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">Cancel</Button>
                <Button onClick={() => formik.handleSubmit()} variant="contained" sx={{ bgcolor: "#E27E6A" }}>
                    Save Address
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddressForm;
