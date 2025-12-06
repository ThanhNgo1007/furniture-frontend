import { Avatar, Box, Grid, Rating } from '@mui/material';
import React from 'react';
import type { Review } from '../../../../State/customer/reviewSlice';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // Get first letter of user name for avatar
  const avatarLetter = review.user.fullName?.charAt(0).toUpperCase() || 'U';
  
  // Format date
  const formattedDate = new Date(review.createdAt).toLocaleDateString('vi-VN');

  return (
    <div id={`review-${review.id}`} className='justify-between flex'>
        <Grid container spacing={9}>
            <Grid size={{xs:1}}>
                <Box>
                    <Avatar className='text-white'
                    sx={{width:56, height:56, bgcolor: "#9155FD"}}>
                        {avatarLetter}
                    </Avatar>
                </Box>
            </Grid>
            
            <Grid size={{xs:9}}>
                <div className='space-y-2'>
                    <div>
                        <p className='font-semibold text-lg'>
                            {review.user.fullName}
                        </p>
                        <p className="opacity-70">{formattedDate}</p>
                    </div>
                    
                    <Rating
                      readOnly
                      value={review.rating}
                      precision={0.5}
                    />
                    
                    <p className="">{review.reviewText}</p>
                    
                    {/* Product Images */}
                    {review.productImages && review.productImages.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {review.productImages.map((img, index) => (
                          <img 
                            key={index} 
                            className="w-24 h-24 object-cover rounded border" 
                            src={img} 
                            alt={`Review image ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                </div>
            </Grid>
        </Grid>
    </div>
  )
}

export default ReviewCard