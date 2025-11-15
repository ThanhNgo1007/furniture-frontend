/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// ✅ BƯỚC 1: Bỏ Scrollbar, chỉ giữ lại Navigation
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperCore } from 'swiper';


// Import component con và tất cả dữ liệu cần thiết
import RoomsSliderMenu from './RoomSliderMenu';
import { productsLevelTwo } from '../../../data/category/leveltwo/productsLevelTwo';
import { roomsLevelTwo } from '../../../data/category/leveltwo/roomsLevelTwo';
import { productsLevelThree } from '../../../data/category/levelthree/productsLevelThree';
import { useNavigate } from 'react-router-dom';

// Interface
interface CategoryItem {
    name: string;
    categoryId: string;
    parentCategoryId?: string;
}

interface MegaMenuProps {
    activeCategoryId: string | null;
}

const MegaMenu = ({ activeCategoryId }: MegaMenuProps) => {
    const navigate = useNavigate();

    const [selectedLevelTwoId, setSelectedLevelTwoId] = useState<string | null>(null);
    const swiperRef = useRef<SwiperCore | null>(null);

    useEffect(() => {
        if (activeCategoryId === 'products' && productsLevelTwo.length > 0) {
            setSelectedLevelTwoId(productsLevelTwo[0].categoryId);
        }
    }, [activeCategoryId]);

    useEffect(() => {
        if (swiperRef.current && selectedLevelTwoId) {
            const activeIndex = productsLevelTwo.findIndex(
                (cat) => cat.categoryId === selectedLevelTwoId
            );
            if (activeIndex !== -1) {
                swiperRef.current.slideTo(activeIndex, 300);
            }
        }
    }, [selectedLevelTwoId]);

    if (!activeCategoryId) {
        return null;
    }

    const selectedLevelTwoName = productsLevelTwo?.find(item => item.categoryId === selectedLevelTwoId)?.name;

    return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen bg-white border-t border-gray-200 shadow-lg z-20">
            {activeCategoryId === 'products' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-8">
                    {/* ✅ BƯỚC 2: Thêm class 'relative' vào wrapper để định vị các mũi tên */}
                    <div className="relative mb-8 border-b">
                        <Swiper
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            // Chỉ sử dụng Navigation
                            modules={[Navigation]}
                            spaceBetween={10}
                            slidesPerView={'auto'}
                            // ✅ BƯỚC 3: Cấu hình Navigation
                            navigation={{
                                nextEl: '.swiper-button-next-custom',
                                prevEl: '.swiper-button-prev-custom',
                            }}
                            className="px-12" // Thêm padding để các mục đầu/cuối không bị che bởi mũi tên
                        >
                            {productsLevelTwo.map((level2Cat) => (
                                <SwiperSlide key={level2Cat.categoryId} className="!w-auto">
                                    <button
                                        onClick={() => setSelectedLevelTwoId(level2Cat.categoryId)}
                                        className={`py-3 px-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors duration-200 ${
                                            selectedLevelTwoId === level2Cat.categoryId
                                                ? 'text-gray-900 border-gray-900'
                                                : 'text-gray-500 border-transparent hover:text-gray-900'
                                        }`}
                                    >
                                        {level2Cat.name}
                                    </button>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        
                        {/* ✅ BƯỚC 4: Thêm các phần tử HTML cho mũi tên tùy chỉnh */}
                        <div className="swiper-button-prev-custom"></div>
                        <div className="swiper-button-next-custom"></div>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        <div className="col-span-3">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Explore {selectedLevelTwoName}</h3>
                            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                                {productsLevelThree
                                    .filter(level3Cat => level3Cat.parentCategoryId === selectedLevelTwoId)
                                    .map(level3Cat => (
                                        <a
                                            key={level3Cat.categoryId}
                                            onClick={() => navigate(`/products/${level3Cat.categoryId}`)}
                                            className="text-sm text-gray-600 hover:underline cursor-pointer"
                                        >
                                            {level3Cat.name}
                                        </a>
                                    ))}
                            </div>
                        </div>
                        <div className="col-span-2 grid grid-cols-2 gap-4">
                           {/* ... các thẻ div quảng cáo ... */}
                        </div>
                    </div>
                </div>
            )}
            {activeCategoryId === 'rooms' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-8">
                    <div className="relative">
                        <RoomsSliderMenu data={roomsLevelTwo} />
                        <div className="swiper-button-prev-custom"></div>
                        <div className="swiper-button-next-custom"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MegaMenu;