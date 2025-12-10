import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useAppDispatch, useAppSelector } from '../../../../State/Store';
import { fetchAllProducts } from '../../../../State/customer/ProductSlice';
import type { Product } from '../../../../types/ProductTypes';
import ProductCard from '../../Product/ProductCard';

const BestSeller = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector(store => store.product);
  const [bestSellerProducts, setBestSellerProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch products sorted by discount, only need top items
    dispatch(fetchAllProducts({ pageSize: 20, sort: 'discountPercent,desc' }));
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      // Sort by discount percentage and take top 12
      const sorted = [...products]
        .sort((a, b) => b.discountPercent - a.discountPercent)
        .slice(0, 12);
      
      setBestSellerProducts(sorted);
    }
  }, [products]);

  if (bestSellerProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-8 max-w-[110rem] mx-auto px-4 lg:px-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('home.bestSellers')}</h2>
      </div>
      
      {/* Swiper Component */}
      <Swiper
        modules={[Scrollbar]}
        scrollbar={{ draggable: true }}
        spaceBetween={24}
        slidesPerView={'auto'}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 16
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 24
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 24
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 24
          }
        }}
        className="!pb-8"
      >
        {bestSellerProducts.map((product) => (
          <SwiperSlide key={product.id} style={{ width: 'auto' }}>
            <ProductCard item={product} isBestSeller={true} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BestSeller;