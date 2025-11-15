import React, { useEffect, useState } from 'react';
import storage1 from '@/assets/storklinta-6-drawer-dresser-white-anchor.jpg';
import storage2 from '@/assets/storklinta-6-drawer-dresser-white-anchor-2.jpg';
import storage3 from '@/assets/storklinta-6-drawer-dresser-white-anchor-5.jpg';
import "./ProductCard.css";
import { Button } from '@mui/material';
import { Favorite, ModeComment } from '@mui/icons-material';
import { teal } from '@mui/material/colors';

const images = [storage1, storage2, storage3];

const ProductCard = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);


  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % images.length);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <>
      <div className='group p-4 relative'>
        <div 
          className='card'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            // setCurrentImage(0); // Optional
          }}
        >
          {images.map((item, index) => (
            <img
              key={index}
              className='card-media'
              src={item}
              style={{ transform: `translateX(${(index - currentImage) * 100}%)` }}
            />
          ))}
          {
            isHovered && <div className='indicator flex flex-col items-center space-y-2'>
              <div className='flex gap-5'>
                <Button variant="contained" color="secondary" >
                  <Favorite sx={{color:teal[300]}}/>
                </Button>
                <Button variant="contained" color="secondary" >
                  <ModeComment sx={{color:teal[300]}}/>
                </Button>
              </div>
            </div>
          }
        </div>
       <div className='details pt-3 space-y-2 group-hover-effect rounded-md'>
        {/* Phần tên và mô tả */}
        <div className='name'>
          <h1 className='text-lg font-bold uppercase'>Storklinta</h1>
          <p className='text-sm text-gray-600'>
            6-drawer dresser, white/anchor/unlock function, 55 1/8x18 7/8x29 1/2 "
          </p>
        </div>

        {/* --- BƯỚC 2: Cập nhật JSX hiển thị giá --- */}
        <div className='space-y-1'> {/* Bọc giá và % giảm giá trong 1 div */}
          {/* Hàng chứa giá bán và giá gốc */}
          <div className='flex items-baseline gap-3'>
            {/* Giá bán (màu đỏ) */}
            <div className='price font-bold text-xl'>
              <span>
                299
                <sup className='font-bold'>.99</sup>
              </span>
            </div>
            {/* Giá gốc (bị gạch) */}
            <div className='original-price text-base text-gray-500 line-through'>
              $399.00
            </div>
          </div>
          {/* Hàng chứa % giảm giá */}
          <div>
            <span className='bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded'>
                  30% OFF
            </span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductCard;