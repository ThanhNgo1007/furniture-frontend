import { Button, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../../config/Api";
import { fetchUserProfile } from "../../../State/AuthSlice";
import { useAppDispatch, useAppSelector } from "../../../State/Store";

const UserDetails = () => {
    const { user } = useAppSelector(store => store.auth);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [mobile, setMobile] = useState(user?.mobile || "");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ fullName: "", mobile: "" });

    const validateForm = () => {
        const newErrors = { fullName: "", mobile: "" };
        let isValid = true;

        if (!fullName.trim()) {
            newErrors.fullName = "Họ tên không được để trống";
            isValid = false;
        } else if (fullName.trim().length < 2) {
            newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
            isValid = false;
        }

        if (!mobile.trim()) {
            newErrors.mobile = "Số điện thoại không được để trống";
            isValid = false;
        } else if (!/^0\d{9,10}$/.test(mobile)) {
            newErrors.mobile = "Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0)";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await api.put("/api/users/profile", { fullName: fullName.trim(), mobile: mobile.trim() });
            
            if (response.status === 200) {
                // Refresh user data
                const jwt = localStorage.getItem("jwt");
                if (jwt) {
                    dispatch(fetchUserProfile({ jwt }));
                }
                setIsEditing(false);
                setErrors({ fullName: "", mobile: "" });
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFullName(user?.fullName || "");
        setMobile(user?.mobile || "");
        setErrors({ fullName: "", mobile: "" });
        setIsEditing(false);
    };

    return (
        <div className="flex justify-center py-10">
            <div className="w-full lg:w-[70%]">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-600">{t('account.personalDetails')}</h1>
                    {!isEditing && (
                        <Button variant="outlined" size="small" onClick={() => setIsEditing(true)}>
                            Chỉnh sửa
                        </Button>
                    )}
                </div>
                <div className="">
                    {/* Full Name */}
                    <div className="py-5">
                        <span className="font-semibold">{t('account.name')} : </span>
                        {isEditing ? (
                            <TextField
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                error={!!errors.fullName}
                                helperText={errors.fullName}
                                size="small"
                                fullWidth
                                sx={{ mt: 1 }}
                            />
                        ) : (
                            <span className="text-gray-600">{user?.fullName}</span>
                        )}
                    </div>

                    {/* Mobile */}
                    <div className="py-5">
                        <span className="font-semibold">{t('account.mobile')} : </span>
                        {isEditing ? (
                            <TextField
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                error={!!errors.mobile}
                                helperText={errors.mobile}
                                size="small"
                                fullWidth
                                sx={{ mt: 1 }}
                            />
                        ) : (
                            <span className="text-gray-600">{user?.mobile}</span>
                        )}
                    </div>

                    {/* Email (Read-only) */}
                    <div className="py-5">
                        <span className="font-semibold">{t('account.email')} : </span>
                        <span className="text-gray-600">{user?.email}</span>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-3 mt-4">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={20} /> : "Lưu"}
                            </Button>
                            <Button variant="outlined" onClick={handleCancel} disabled={loading}>
                                Hủy
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;