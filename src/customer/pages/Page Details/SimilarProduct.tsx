import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { clearSimilarProducts, fetchSimilarProducts } from '../../../State/customer/ProductSlice';
import ProductCard from '../Product/ProductCard';


const SimilarProduct = () => {
  const dispatch = useAppDispatch();
  const { product, similarProducts } = useAppSelector(store => store.product);

  useEffect(() => {
    if (product?.id) {
      // Fetch similar products from API (same category level 3)
      dispatch(fetchSimilarProducts({ productId: product.id, limit: 6 }));
    }
    
    // Cleanup when component unmounts or product changes
    return () => {
      dispatch(clearSimilarProducts());
    };
  }, [product?.id, dispatch]);

  if (similarProducts.length === 0) return null;

  return (
    <div className='grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 justify-between gap-4 gap-y-8'>
        {similarProducts.map((item) => (
            <ProductCard key={item.id} item={item} />
        ))}
    </div>
  )
}

export default SimilarProduct