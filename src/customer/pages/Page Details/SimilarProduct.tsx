import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { fetchAllProducts } from '../../../State/customer/ProductSlice';
import type { Product } from '../../../types/ProductTypes';
import ProductCard from '../Product/ProductCard';


const SimilarProduct = () => {
  const dispatch = useAppDispatch();
  const { product, products } = useAppSelector(store => store.product);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (product?.category) {
      // Fetch products with the same category (prioritize categoryId)
      dispatch(fetchAllProducts({ 
        category: product.category.categoryId || product.category.name,
        pageSize: 6 
      }));
    }
  }, [product?.category?.name, dispatch]);

  useEffect(() => {
    if (products && product) {
      // Filter out the current product and limit to 6 items
      const filtered = products
        .filter(p => p.id !== product.id)
        .slice(0, 6);
      setSimilarProducts(filtered);
    }
  }, [products, product]);

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