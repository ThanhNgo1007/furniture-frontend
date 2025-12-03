import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../State/Store';
import { fetchHomeCategories } from '../../../../State/customer/customerSlice';

const CategoryGrid = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { gridCategories } = useAppSelector(store => store.home);

  useEffect(() => {
    // Fetch home categories on mount
    dispatch(fetchHomeCategories());
  }, [dispatch]);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products/${categoryId}`);
  };

  // If no grid categories, don't render
  if (!gridCategories || gridCategories.length === 0) {
    return null;
  }

  // Ensure we have at least 5 categories for the grid layout
  // If less, we'll show what we have
  const displayCategories = gridCategories.slice(0, 5);

  return (
    <div className='grid gap-4 grid-rows-16 grid-cols-12 lg:h-[1000px] px-5 lg:px-40'>
      {displayCategories[0] && (
        <div 
          className='col-span-3 row-span-8 w-full h-full cursor-pointer'
          onClick={() => handleCategoryClick(displayCategories[0].categoryId)}
        >
          <img 
            className='w-full h-full object-cover rounded-md hover:opacity-90 transition-opacity' 
            src={displayCategories[0].image} 
            alt={displayCategories[0].name || 'Category'}
          />
        </div>
      )}
      
      {displayCategories[1] && (
        <div 
          className='col-span-3 row-span-10 w-full h-full cursor-pointer'
          onClick={() => handleCategoryClick(displayCategories[1].categoryId)}
        >
          <img 
            className='h-full w-full object-cover rounded-md hover:opacity-90 transition-opacity'
            src={displayCategories[1].image} 
            alt={displayCategories[1].name || 'Category'}
          />
        </div>
      )}
      
      {displayCategories[2] && (
        <div 
          className='col-span-6 row-span-18 w-full h-full cursor-pointer'
          onClick={() => handleCategoryClick(displayCategories[2].categoryId)}
        >
          <img 
            className='h-full w-full object-cover rounded-md hover:opacity-90 transition-opacity'
            src={displayCategories[2].image} 
            alt={displayCategories[2].name || 'Category'}
          />
        </div>
      )}
      
      {displayCategories[3] && (
        <div 
          className='col-span-3 row-span-10 w-full h-full cursor-pointer'
          onClick={() => handleCategoryClick(displayCategories[3].categoryId)}
        >
          <img 
            className='w-full h-full object-cover rounded-md hover:opacity-90 transition-opacity'
            src={displayCategories[3].image} 
            alt={displayCategories[3].name || 'Category'}
          />
        </div>
      )}
      
      {displayCategories[4] && (
        <div 
          className='col-span-3 row-span-8 w-full h-full cursor-pointer'
          onClick={() => handleCategoryClick(displayCategories[4].categoryId)}
        >
          <img 
            className='w-full h-full object-cover rounded-md hover:opacity-90 transition-opacity'
            src={displayCategories[4].image} 
            alt={displayCategories[4].name || 'Category'}
          />
        </div>
      )}
    </div>
  )
}

export default CategoryGrid