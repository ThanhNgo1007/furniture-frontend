import { useEffect, useState } from 'react';
import Slider from "react-slick";
import api from '../../../../config/Api';
import type { Deal } from '../../../../types/dealTypes';
import DealCard from './DealCard';

const DealComponent = () => {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await api.get('/api/deals');
      setDeals(response.data);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    }
  };

  const settings = {
    dots: true,
    infinite: deals.length > 6,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 525,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  if (deals.length === 0) {
    return null;
  }

  return (
    <div className='py-5 max-w-[110rem] mx-auto px-8'>
      <p className='text-2xl font-bold mb-4'>Today's Best Deals</p>
      <Slider {...settings}>
        {deals.map((deal, index: number) => (
          <div key={`${deal.id}-${index}`} className="p-2">
            <DealCard
              categoryName={deal.category.name || 'Deal'}
              categoryId={deal.category.categoryId}
              parentCategoryId={deal.category.parentCategoryId}
              discountPercent={deal.discount}
              imageUrl={deal.category.image}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default DealComponent;