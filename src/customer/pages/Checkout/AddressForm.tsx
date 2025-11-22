import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../State/Store';

// Định nghĩa kiểu dữ liệu cho API địa chỉ
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
    pinCode: Yup.string().required("Pin code is required").matches(/^[1-9][0-9]{4}$/, "Invalid pin code"),
    address: Yup.string().required("Address details are required"),
    city: Yup.string().required("District (Quận/Huyện) is required"),
    ward: Yup.string().required("Ward (Phường/Xã) is required"),
    locality: Yup.string().required("Province (Tỉnh/Thành phố) is required"),
});

const AddressForm = ({ handleClose }: { handleClose: () => void }) => {
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(store => store);

    // State lưu danh sách địa chỉ từ API
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    // State lưu mã code để call API cấp con (Formik sẽ lưu Tên, còn state này lưu Code)
    const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | string>("");
    const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | string>("");

    // 1. Lấy danh sách Tỉnh/Thành phố khi component load
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

    // 2. Lấy danh sách Quận/Huyện khi chọn Tỉnh
    const handleProvinceChange = async (provinceCode: number) => {
        setSelectedProvinceCode(provinceCode);
        setSelectedDistrictCode(""); // Reset district code
        setDistricts([]);
        setWards([]);
        
        // Tìm tên tỉnh để lưu vào Formik
        const province = provinces.find(p => p.code === provinceCode);
        formik.setFieldValue("locality", province?.name || ""); 
        formik.setFieldValue("city", ""); // Reset city trong formik
        formik.setFieldValue("ward", ""); // Reset ward trong formik

        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            setDistricts(response.data.districts);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    // 3. Lấy danh sách Phường/Xã khi chọn Quận
    const handleDistrictChange = async (districtCode: number) => {
        setSelectedDistrictCode(districtCode);
        setWards([]);

        // Tìm tên huyện để lưu vào Formik
        const district = districts.find(d => d.code === districtCode);
        formik.setFieldValue("city", district?.name || ""); 
        formik.setFieldValue("ward", ""); // Reset ward

        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            setWards(response.data.wards);
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };

    // 4. Xử lý chọn Phường/Xã
    const handleWardChange = (wardCode: number) => {
        const ward = wards.find(w => w.code === wardCode);
        formik.setFieldValue("ward", ward?.name || "");
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            mobile: "",
            pinCode: "",
            address: "",
            locality: "", // Tỉnh
            city: "",     // Huyện
            ward: "",     // Xã
        },
        validationSchema: AddressFormSchema,
        onSubmit: (values) => {
            // Logic kiểm tra trùng lặp địa chỉ
            const isDuplicate = auth.user?.addresses?.some((item: any) => {
                return (
                    item.address.toLowerCase().trim() === values.address.toLowerCase().trim() &&
                    item.city.toLowerCase().trim() === values.city.toLowerCase().trim() &&
                    item.ward.toLowerCase().trim() === values.ward.toLowerCase().trim() &&
                    item.locality.toLowerCase().trim() === values.locality.toLowerCase().trim()
                );
            });

            if (isDuplicate) {
                alert("Địa chỉ này đã tồn tại!");
                return;
            }

            // Dispatch action (Lưu ý: bạn cần dùng action addAddress thay vì createOrder nếu chỉ thêm địa chỉ)
            // dispatch(addAddress(values)); 
            console.log("Submitting:", values);
            handleClose();
        },
    });

    return (
        <Box sx={{ max: "auto" }}>
            <p className='text-xl font-bold text-center pb-5'>Contact Details</p>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                    
                    {/* --- Tên và SĐT --- */}
                    <Grid size={{xs:12}}>
                        <TextField
                            fullWidth name="name" label="Name"
                            value={formik.values.name} onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </Grid>
                    <Grid size={{xs:6}}>
                        <TextField
                            fullWidth name="mobile" label="Mobile"
                            value={formik.values.mobile} onChange={formik.handleChange}
                            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                            helperText={formik.touched.mobile && formik.errors.mobile}
                        />
                    </Grid>
                    <Grid size={{xs:6}}>
                        <TextField
                            fullWidth name="pinCode" label="Pin Code (Optional)"
                            value={formik.values.pinCode} onChange={formik.handleChange}
                            error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                            helperText={formik.touched.pinCode && formik.errors.pinCode}
                        />
                    </Grid>

                    {/* --- 3 Dropdown địa chỉ Việt Nam --- */}
                    
                    {/* 1. Tỉnh / Thành phố (Mapping vào locality) */}
                    <Grid size={{xs:12}}>
                        <FormControl fullWidth error={formik.touched.locality && Boolean(formik.errors.locality)}>
                            <InputLabel>Province / City (Tỉnh/Thành phố)</InputLabel>
                            <Select
                                value={selectedProvinceCode}
                                label="Province / City (Tỉnh/Thành phố)"
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

                    {/* 2. Quận / Huyện (Mapping vào city) */}
                    <Grid size={{xs:6}}>
                        <FormControl fullWidth error={formik.touched.city && Boolean(formik.errors.city)}>
                            <InputLabel>District (Quận/Huyện)</InputLabel>
                            <Select
                                value={selectedDistrictCode}
                                label="District (Quận/Huyện)"
                                onChange={(e) => handleDistrictChange(e.target.value as number)}
                                disabled={!selectedProvinceCode} // Disable nếu chưa chọn Tỉnh
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

                    {/* 3. Phường / Xã (Mapping vào ward) */}
                    <Grid size={{xs:6}}>
                        <FormControl fullWidth error={formik.touched.ward && Boolean(formik.errors.ward)}>
                            <InputLabel>Ward (Phường/Xã)</InputLabel>
                            <Select
                                value={wards.find(w => w.name === formik.values.ward)?.code || ""}
                                label="Ward (Phường/Xã)"
                                onChange={(e) => handleWardChange(e.target.value as number)}
                                disabled={!selectedDistrictCode} // Disable nếu chưa chọn Quận
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

                    {/* --- Địa chỉ cụ thể --- */}
                    <Grid size={{xs:12}}>
                        <TextField
                            fullWidth
                            name="address"
                            label="Address Details (Số nhà, tên đường)"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            helperText={formik.touched.address && formik.errors.address}
                        />
                    </Grid>

                    <Grid size={{xs:12}}>
                        <Button fullWidth type='submit' variant='contained' sx={{ py: "14px", bgcolor: "teal" }}>
                            ADD ADDRESS
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default AddressForm