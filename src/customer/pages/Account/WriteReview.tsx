/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Alert, Box, Button, CircularProgress, Rating, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchOrderById, fetchOrderItemById } from '../../../State/customer/orderSlice';
import { createReview, resetReviewState } from '../../../State/customer/reviewSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { uploadToCloudinary } from '../../../Util/uploadToCloudinary';

const WriteReview = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { orderId, orderItemId, productId } = useParams();
    
    const { currentOrder, orderItem } = useAppSelector(store => store.order);
    const { loading, error, success } = useAppSelector(store => store.review);
    
    const [rating, setRating] = useState<number>(5);
    const [reviewText, setReviewText] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);

    const MAX_CHARS = 500;
    const MAX_IMAGES = 3;

    useEffect(() => {
        if (orderId && orderItemId) {
            dispatch(fetchOrderById({ orderId: Number(orderId), jwt: localStorage.getItem('jwt') || '' }));
            dispatch(fetchOrderItemById({ orderItemId: Number(orderItemId), jwt: localStorage.getItem('jwt') || '' }));
        }
    }, [dispatch, orderId, orderItemId]);

    useEffect(() => {
        if (success) {
            // Show success message and navigate back after 2 seconds
            setTimeout(() => {
                navigate(`/account/order/${orderId}/${orderItemId}`);
                dispatch(resetReviewState());
            }, 2000);
        }
    }, [success, navigate, orderId, orderItemId, dispatch]);

    // Upload images to Cloudinary
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        if (images.length + files.length > MAX_IMAGES) {
            alert(t('review.maxImagesError', { max: MAX_IMAGES }));
            return;
        }

        setUploadingImage(true);
        
        try {
            // Upload all selected images to Cloudinary
            const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
            const uploadedUrls = await Promise.all(uploadPromises);
            
            // Filter out any failed uploads (undefined/null)
            const validUrls = uploadedUrls.filter((url: string | undefined) => url) as string[];
            
            setImages([...images, ...validUrls]);
        } catch (error) {
            console.error('Error uploading images:', error);
            alert(t('review.uploadError'));
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (reviewText.trim().length < 10) {
            alert(t('review.minCharsError'));
            return;
        }

        if (productId) {
            dispatch(createReview({
                productId: Number(productId),
                request: {
                    reviewText: reviewText.trim(),
                    reviewRating: rating,
                    productImages: images,
                    orderId: Number(orderId),
                }
            }));
        }
    };

    const handleCancel = () => {
        navigate(`/account/order/${orderId}/${orderItemId}`);
    };

    if (!orderItem || !currentOrder) {
        return (
            <Box className="flex justify-center items-center min-h-screen">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="min-h-screen bg-gray-50 py-8">
            <Box className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <Box className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <Typography variant="h5" className="font-bold mb-4">
                        {t('review.writeReview')}
                    </Typography>
                    
                    {/* Product Info */}
                    <Box className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <img 
                            src={orderItem.product.images[0]} 
                            alt={orderItem.product.title}
                            className="w-20 h-20 object-cover rounded"
                        />
                        <Box>
                            <Typography className="font-medium">{orderItem.product.title}</Typography>
                            <Typography variant="body2" className="text-gray-600">
                                {t('review.orderNumber')}: {currentOrder.orderId}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Review Form */}
                <Box className="bg-white rounded-lg shadow-sm p-6">
                    {/* Rating */}
                    <Box className="mb-6">
                        <Typography className="font-medium mb-2">{t('review.rating')}</Typography>
                        <Rating
                            name="product-rating"
                            value={rating}
                            onChange={(_, newValue) => {
                                setRating(newValue || 5);
                            }}
                            size="large"
                        />
                    </Box>

                    {/* Review Text */}
                    <Box className="mb-6">
                        <Typography className="font-medium mb-2">{t('review.yourReview')}</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            value={reviewText}
                            onChange={(e) => {
                                if (e.target.value.length <= MAX_CHARS) {
                                    setReviewText(e.target.value);
                                }
                            }}
                            placeholder={t('review.reviewPlaceholder')}
                            variant="outlined"
                        />
                        <Box className="flex justify-end mt-1">
                            <Typography 
                                variant="body2" 
                                className={reviewText.length >= MAX_CHARS ? 'text-red-500' : 'text-gray-500'}
                            >
                                {reviewText.length}/{MAX_CHARS}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Image Upload */}
                    <Box className="mb-6">
                        <Typography className="font-medium mb-2">
                            {t('review.addImages')} ({images.length}/{MAX_IMAGES})
                        </Typography>
                        
                        {/* Image Previews */}
                        {images.length > 0 && (
                            <Box className="flex gap-2 mb-4 flex-wrap">
                                {images.map((img, index) => (
                                    <Box key={index} className="relative">
                                        <img 
                                            src={img} 
                                            alt={`Review ${index + 1}`}
                                            className="w-24 h-24 object-cover rounded border"
                                        />
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <CloseIcon fontSize="small" />
                                        </button>
                                    </Box>
                                ))}
                            </Box>
                        )}
                        
                        {/* Upload Button */}
                        {images.length < MAX_IMAGES && (
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={uploadingImage ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                                disabled={uploadingImage}
                            >
                                {t('review.uploadImage')}
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                />
                            </Button>
                        )}
                    </Box>

                    {/* Error/Success Messages */}
                    {error && (
                        <Alert severity="error" className="mb-4">
                            {error}
                        </Alert>
                    )}
                    
                    {success && (
                        <Alert severity="success" className="mb-4">
                            {t('review.successMessage')}
                        </Alert>
                    )}

                    {/* Action Buttons */}
                    <Box className="flex gap-3 justify-end">
                        <Button
                            variant="outlined"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading || reviewText.trim().length < 10}
                        >
                            {loading ? <CircularProgress size={24} /> : t('review.submitReview')}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default WriteReview;
