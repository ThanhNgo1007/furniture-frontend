import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Định nghĩa kiểu dữ liệu sẽ nhận vào
interface RoomItem {
    name: string;
    categoryId: string;
    imageUrl?: string;
}

interface RoomsSliderMenuProps {
    data: RoomItem[]; // Component sẽ nhận một mảng dữ liệu
}

const RoomsSliderMenu = ({ data }: RoomsSliderMenuProps) => {
  return (
    <div className="max-w-7xl mx-auto py-8 rooms-slider">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        slidesPerView={'auto'}
        spaceBetween={24}
        className="px-12"
      >
        {data.map((room) => (
          <SwiperSlide key={room.categoryId} className="!w-auto">
            <a href="#" className="flex flex-col items-center gap-3 group">
              {/* ✅ THAY ĐỔI TẠI ĐÂY: BỎ 'rounded-full' và thêm chiều cao/chiều rộng cụ thể */}
              <div className="w-48 h-32 flex items-center justify-center overflow-hidden"> 
                <img 
                    src={room.imageUrl} 
                    alt={room.name} 
                    // Bỏ 'rounded-full', giữ 'object-cover', thêm 'rounded-lg' cho bo góc nhẹ
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">{room.name}</span>
                <ArrowForwardIcon sx={{fontSize: 20}} />
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RoomsSliderMenu;