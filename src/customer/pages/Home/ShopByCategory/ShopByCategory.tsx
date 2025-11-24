
import RoomCategoryCard from './ShopByCategoryCard'; // Import the card component
// 1. Correctly import Swiper components and modules
import { Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';



// Sample data
const roomInspirations = [
  { name: 'Bedroom', image: 'https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811575/qc_jawh94.avif' },
  { name: 'Living room', image: 'https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811575/qc_jawh94.avif' },
  { name: 'Kitchen', image: 'https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811575/qc_jawh94.avif' },
  { name: 'Dining', image: 'https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811575/qc_jawh94.avif' },
  { name: 'Home office', image: 'https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811575/qc_jawh94.avif' },
  { name: 'Bathroom', image: 'https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811575/qc_jawh94.avif' },
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