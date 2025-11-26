import React from 'react';
import { useNavigate } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu cho props
interface DecorCategoryCardProps {
  item: {
    name: string;
    imageUrl: string;
    categoryId: string;
    // thêm các trường khác nếu cần
  }
}

const DecorCategoryCard: React.FC<DecorCategoryCardProps> = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to products page with category filter
    navigate(`/products/${item.categoryId}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer rounded-lg bg-gray-100 p-4 group 
      border border-transparent transition-all 
      hover:border-black text-center hover:underline max-w-[150px]"
    > 
        {/* Sử dụng item.imageUrl và item.name từ props */}
        <img 
          className="object-contain h-10 mb-4 h-32 w-32 mx-auto" 
          src={item.imageUrl} 
          alt={item.name} 
        />
        <h2 className='text-sm font-semibold text-gray-700'>{item.name}</h2>
    </div>
  )
}

export default DecorCategoryCard