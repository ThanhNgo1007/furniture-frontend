/* eslint-disable @typescript-eslint/no-unused-vars */
import StarIcon from '@mui/icons-material/Star';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Rating,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../State/Store';
import { fetchProductById } from '../../../../State/customer/ProductSlice';
import { fetchProductReviews } from '../../../../State/customer/reviewSlice';
import { formatVND } from '../../../../Util/formatCurrency';
import ReviewCard from './ReviewCard';

const REVIEWS_PER_PAGE = 5;

const Review = () => {
  const { t } = useTranslation();
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const { reviews, loading } = useAppSelector(store => store.review);
  const { product } = useAppSelector(store => store.product);
  
  const [visibleReviews, setVisibleReviews] = useState(REVIEWS_PER_PAGE);

  const location = useLocation();

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductReviews(Number(productId)));
      dispatch(fetchProductById(Number(productId) as any));
    }
  }, [dispatch, productId]);

  // Scroll to review if hash is present
  useEffect(() => {
    if (location.hash && reviews.length > 0) {
      const reviewId = location.hash.replace('#review-', '');
      const element = document.getElementById(`review-${reviewId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the review
        element.style.backgroundColor = '#f0f9ff';
        setTimeout(() => {
          element.style.backgroundColor = 'transparent';
          element.style.transition = 'background-color 2s';
        }, 2000);
      }
    }
  }, [location.hash, reviews]);

  // Calculate rating summary from actual reviews
  const ratingSummaryData = React.useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        overall: 0,
        totalCount: 0,
        breakdown: [
          { stars: 5, count: 0 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 0 },
          { stars: 1, count: 0 },
        ]
      };
    }

    // Count ratings
    const breakdown = [
      { stars: 5, count: 0 },
      { stars: 4, count: 0 },
      { stars: 3, count: 0 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 },
    ];

    reviews.forEach(review => {
      const starIndex = 5 - Math.floor(review.rating);
      if (starIndex >= 0 && starIndex < 5) {
        breakdown[starIndex].count++;
      }
    });

    // Calculate average
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const overall = reviews.length > 0 ? totalRating / reviews.length : 0;

    return {
      overall: Number(overall.toFixed(1)),
      totalCount: reviews.length,
      breakdown
    };
  }, [reviews]);

  const handleLoadMore = () => {
    setVisibleReviews((prevVisible) => prevVisible + REVIEWS_PER_PAGE);
  };

  const reviewsToShow = reviews.slice(0, visibleReviews);

  if (loading && reviews.length === 0) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className='p-5 lg:px-20 flex flex-col lg:flex-row gap-20'>
        {/* Section 1: Product Info */}
        <section className='w-full md:w-1/2 lg:w-[30%] space-y-2'>
            {product && (
              <>
                <img 
                  src={product.images?.[0] || ""} 
                  alt={product.title}
                  className="w-full rounded-lg"
                />
                <div>
                    <div>
                        <p className='font-bold text-xl'>{product.title}</p>
                        <p className='text-lg text-gray-600'>{product.category?.name}</p>
                    </div>
                    <div className='price font-bold text-3xl mt-5'>
                        <span>
                          {formatVND(product.sellingPrice || 0)}
                        </span>
                    </div>
                </div>
              </>
            )}
        </section>
        
        {/* Section 2: Reviews */}
        <section className='space-y-5 w-full'>
            {/* Rating Summary */}
            <Box>
              {/* Overall Rating */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Typography variant="h3" component="h2" fontWeight="bold">
                  {ratingSummaryData.overall}
                </Typography>
                <Rating 
                  value={ratingSummaryData.overall} 
                  precision={0.1} 
                  readOnly 
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {t('review.basedOn', { count: ratingSummaryData.totalCount })}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Breakdown */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {ratingSummaryData.breakdown.map((item) => {
                  const percentage = ratingSummaryData.totalCount > 0 
                    ? (item.count / ratingSummaryData.totalCount) * 100 
                    : 0;
                  
                  return (
                    <Grid container key={item.stars} alignItems="center" spacing={2}>
                      <Grid size={{xs: 2}} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography variant="body2" fontWeight="bold">{item.stars}</Typography>
                        <StarIcon sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary' }} />
                      </Grid>
                      
                      <Grid size={{xs: 8}}>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4, 
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: 'primary.main'
                            }
                          }}
                        />
                      </Grid>
                      
                      <Grid size={{xs: 2}} sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" color="text.secondary">{item.count}</Typography>
                      </Grid>
                    </Grid>
                  );
                })}
              </Box>
            </Box>
            
            <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
              {t('review.allReviews', { count: reviews.length })}
            </Typography>
            
            {/* Review List */}
            {reviews.length === 0 ? (
              <Box className="text-center py-10">
                <Typography variant="body1" color="text.secondary">
                  {t('review.noReviewsYet')}
                </Typography>
              </Box>
            ) : (
              <>
                {reviewsToShow.map((review) => (
                  <div key={review.id} className='space-y-3'>
                    <ReviewCard review={review} />
                    <Divider/>
                  </div>
                ))}

                {/* Load More Button */}
                {reviews.length > visibleReviews && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={handleLoadMore}
                      sx={{
                        borderRadius: '30px',
                        color: 'text.primary',
                        borderColor: 'grey.500',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        px: 4,
                        py: 1,
                        '&:hover': {
                          borderColor: 'black',
                          bgcolor: 'grey.100'
                        }
                      }}
                    >
                      {t('review.loadMore')}
                    </Button>
                  </Box>
                )}
              </>
            )}
        </section>
    </div>
  );
};

export default Review;