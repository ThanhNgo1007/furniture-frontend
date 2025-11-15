import React from 'react';

import RoomCategoryCard from './ShopByCategoryCard'; // Import the card component
import bedImage from '@/assets/bed.jpg'; 
import diningImage from '@/assets/pic4.jpg';
import officeImage from '@/assets/home_office.jpg';
import bathImage from '@/assets/bath.jpg';
import livingImage from '@/assets/living.jpg';
import kitchenImage from '@/assets/dining.jpg';
// 1. Correctly import Swiper components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';



// Sample data
const roomInspirations = [
  { name: 'Bedroom', image: bedImage },
  { name: 'Living room', image: livingImage },
  { name: 'Kitchen', image: kitchenImage },
  { name: 'Dining', image: diningImage },
  { name: 'Home office', image: officeImage },
  { name: 'Bathroom', image: bathImage },
];

const RoomCategory = () => {
  return (
    <div className="py-8 max-w-[110rem] mx-auto px-4 lg:px-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Shop by category</h2>
      </div>
      
      {/* Swiper Component */}
      <Swiper
        modules={[Scrollbar]}
        scrollbar={{ draggable: true }}
        spaceBetween={24}
        slidesPerView={'auto'} // Shows partial slides
        className="!pb-8"
      >
        {/* 3. Loop and create a SwiperSlide for EACH card */}
        {roomInspirations.map((room) => (
          <SwiperSlide key={room.name} style={{ width: '280px' }}>
            <RoomCategoryCard name={room.name} image={room.image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RoomCategory;