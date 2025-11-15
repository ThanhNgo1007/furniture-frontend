import React from 'react';
import Slider from "react-slick";
import DealCard from './DealCard';

// Import CSS (đảm bảo bạn đã import ở file main.tsx hoặc App.tsx)
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";

const Deal = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6, // Hiển thị 6 slide trên màn hình lớn nhất
    slidesToScroll: 2, // Lướt 2 slide một lần
     autoplay: true,          // Bật tính năng tự động chuyển slide
    autoplaySpeed: 5000,     // Thời gian chờ giữa các lần chuyển (2000ms = 2 giây)
    pauseOnHover: true,      // Tạm dừng khi di chuột vào slider (khuyên dùng)
    responsive: [ // Cấu hình responsive
      {
        breakpoint: 1280, // Dưới 1280px
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 1024, // Dưới 1024px
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 768, // Dưới 768px
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640, // Dưới 640px
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className='py-5 max-w-[110rem] mx-auto px-8'>
      <p className='text-2xl font-bold'>Today's best deals</p>
      <Slider {...settings}>
        {/* Lặp và tạo ra các slide ở đây */}
        {[1, 1, 1, 1, 1, 1, 1, 1].map(() => (
          // Thêm một div bọc ngoài để tạo khoảng cách (padding)
          <div className="p-2"> 
            <DealCard />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Deal;