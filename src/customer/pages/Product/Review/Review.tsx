/* eslint-disable @typescript-eslint/no-unused-vars */
// 1. THÊM useState và Button
import React, { useState } from 'react'; 
import ReviewCard from './ReviewCard';
import { 
  Divider, 
  Box, 
  Typography, 
  Rating, 
  LinearProgress, 
  Grid,
  Button // Thêm Button
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

// Dữ liệu mẫu (Rating)
const ratingSummaryData = {
  overall: 4.1,
  totalCount: 177,
  breakdown: [
    { stars: 5, count: 115 },
    { stars: 4, count: 16 },
    { stars: 3, count: 12 },
    { stars: 2, count: 9 },
    { stars: 1, count: 25 },
  ]
};

// 2. TẠO DỮ LIỆU MẪU CHO TẤT CẢ REVIEW (ví dụ: 9 reviews)
// Trong dự án thật, bạn sẽ lấy mảng này từ API
const allReviews = [
  { id: 1, text: "Review 1" },
  { id: 2, text: "Review 2" },
  { id: 3, text: "Review 3" },
  { id: 4, text: "Review 4" },
  { id: 5, text: "Review 5" },
  { id: 6, text: "Review 6" },
  { id: 7, text: "Review 7" },
  { id: 8, text: "Review 8" },
  { id: 9, text: "Review 9" },
];

const REVIEWS_PER_PAGE = 5; // Hiển thị 5 review mỗi lần

const Review = () => {
  const totalReviews = ratingSummaryData.totalCount;

  // 3. THÊM STATE ĐỂ QUẢN LÝ SỐ LƯỢNG REVIEW HIỂN THỊ
  const [visibleReviews, setVisibleReviews] = useState(REVIEWS_PER_PAGE);

  // 4. HÀM XỬ LÝ KHI CLICK "LOAD MORE"
  const handleLoadMore = () => {
    setVisibleReviews((prevVisible) => prevVisible + REVIEWS_PER_PAGE);
  };

  // 5. TẠO MẢNG REVIEW SẼ HIỂN THỊ
  const reviewsToShow = allReviews.slice(0, visibleReviews);

  return (
    <div className='p-5 lg:px-20 flex flex-col lg:flex-row gap-20'>
        {/* Section 1: Product Info (Không đổi) */}
        <section className='w-full md:w-1/2 lg:w-[30%] space-y-2'>
            <img 
              src="https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811578/storklinta-6-drawer-dresser-white-anchor-1_fkmzra.avif" 
              alt="" 
            />
            <div>
                <div>
                    <p className='font-bold text-xl'>Stoklinta</p>
                    <p className='text-lg text-gray-600'>Dressers & storage drawers</p>
                </div>
                <div className='price font-bold text-3xl mt-5'>
                    <span>
                      $249<sup className='font-bold text-2xl'>.99</sup>
                    </span>
                    <span></span>
                </div>
            </div>
        </section>
        
        {/* Section 2: Reviews */}
        <section className='space-y-5 w-full'>
            
            {/* 3. BẮT ĐẦU KHỐI RATING SUMMARY (Code mới) */}
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
                  Based on {totalReviews} reviews
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Breakdown */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {ratingSummaryData.breakdown.map((item) => {
                  // Tính % của mỗi loại rating
                  const percentage = (item.count / totalReviews) * 100;
                  
                  return (
                    // Dùng Grid để căn chỉnh 3 cột (Số sao, thanh progress, số lượng)
                    <Grid container key={item.stars} alignItems="center" spacing={2}>
                      
                      {/* Cột 1: "5 ★" */}
                      <Grid size={{xs: 2}} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography variant="body2" fontWeight="bold">{item.stars}</Typography>
                        <StarIcon sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary' }} />
                      </Grid>
                      
                      {/* Cột 2: Thanh Progress */}
                      <Grid size={{xs: 8}}>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4, 
                            bgcolor: 'grey.200', // Màu nền thanh progress
                            '& .MuiLinearProgress-bar': {
                              bgcolor: 'primary.main' // Màu của thanh progress (giống trong hình)
                            }
                          }}
                        />
                      </Grid>
                      
                      {/* Cột 3: "115" */}
                      <Grid size={{xs: 2}} sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" color="text.secondary">{item.count}</Typography>
                      </Grid>
                    </Grid>
                  );
                })}
              </Box>
            </Box>
            {/* KẾT THÚC KHỐI RATING SUMMARY */}
            
            <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
              All Reviews ({allReviews.length})
            </Typography>
            
            {/* 6. DÙNG .map() TRÊN MẢNG 'reviewsToShow' */}
            {reviewsToShow.map((item) => (
              <div key={item.id} className='space-y-3'>
                <ReviewCard/>
                <Divider/>
              </div>
            ))}

            {/* 7. THÊM NÚT "LOAD MORE" CÓ ĐIỀU KIỆN */}
            {allReviews.length > visibleReviews && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  sx={{
                    borderRadius: '30px',
                    color: 'text.primary',
                    borderColor: 'grey.500',
                    fontWeight: 'bold',
                    textTransform: 'none', // Chữ "Load more" không bị VIẾT HOA
                    px: 4, // Padding ngang
                    py: 1, // Padding dọc
                    '&:hover': {
                      borderColor: 'black',
                      bgcolor: 'grey.100'
                    }
                  }}
                >
                  Load more
                </Button>
              </Box>
            )}
        </section>
    </div>
  );
};

export default Review;