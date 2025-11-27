import { useEffect, useState } from 'react';
import Slider from "react-slick";
import { useAppDispatch, useAppSelector } from '../../../../State/Store';
import { fetchAllProducts } from '../../../../State/customer/ProductSlice';
import type { Product } from '../../../../types/ProductTypes';
import DealCard from './DealCard';

interface CategoryDeal {
  categoryName: string;
  categoryId: string;
  parentCategoryId?: string;
  avgDiscount: number;
  imageUrl: string;
}

const Deal = () => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector(store => store.product);
  const [topDeals, setTopDeals] = useState<CategoryDeal[]>([]);

  useEffect(() => {
    // Fetch all products to calculate discounts
    dispatch(fetchAllProducts({ pageSize: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      calculateTopDeals();
    }
  }, [products]);

  const calculateTopDeals = () => {
    // Group products by category level 3
    const categoryMap = new Map<string, { products: Product[], category: any }>();

    products.forEach(product => {
      if (product.category && product.category.level === 3 && product.discountPercent > 0) {
        const catId = product.category.categoryId;
        if (!categoryMap.has(catId)) {
          categoryMap.set(catId, {
            products: [],
            category: product.category
          });
        }
        categoryMap.get(catId)!.products.push(product);
      }
    });

    // Calculate average discount for each category
    const deals: CategoryDeal[] = [];
    categoryMap.forEach((value, key) => {
      const avgDiscount = value.products.reduce((sum, p) => sum + p.discountPercent, 0) / value.products.length;
      
      // Get a product image from this category
      const imageUrl = value.products[0]?.images[0] || 'https://via.placeholder.com/400x300';

      deals.push({
        categoryName: value.category.name,
        categoryId: value.category.categoryId,
        parentCategoryId: value.category.parentCategory?.categoryId,
        avgDiscount,
        imageUrl
      });
    });

    // Sort by discount and take top 10
    const sortedDeals = deals.sort((a, b) => b.avgDiscount - a.avgDiscount).slice(0, 10);
    setTopDeals(sortedDeals);
  };

  const settings = {
    dots: true,
    infinite: topDeals.length > 6,
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

  if (topDeals.length === 0) {
    return null; // Don't show section if no deals
  }

  return (
    <div className='py-5 max-w-[110rem] mx-auto px-8'>
      <p className='text-2xl font-bold mb-4'>Today's Best Deals</p>
      <Slider {...settings}>
        {topDeals.map((deal, index) => (
          <div key={`${deal.categoryId}-${index}`} className="p-2">
            <DealCard
              categoryName={deal.categoryName}
              categoryId={deal.categoryId}
              parentCategoryId={deal.parentCategoryId}
              discountPercent={deal.avgDiscount}
              imageUrl={deal.imageUrl}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Deal;