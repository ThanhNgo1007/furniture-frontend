import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useAppDispatch, useAppSelector } from '../../../../State/Store';
import { fetchBestSellerProducts } from '../../../../State/customer/ProductSlice';
import ProductCard from '../../Product/ProductCard';

const BestSeller = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { bestSellerProducts, loading } = useAppSelector(store => store.product);

  useEffect(() => {
    // Fetch best seller products from API (sorted by sales volume)
    dispatch(fetchBestSellerProducts(12));
  }, [dispatch]);

  if (loading || bestSellerProducts.length === 0) {
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