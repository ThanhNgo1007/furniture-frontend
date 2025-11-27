import { useNavigate } from 'react-router-dom';

interface DealCardProps {
  categoryName: string;
  categoryId: string;
  discountPercent: number;
  imageUrl: string;
  parentCategoryId?: string;
}

const DealCard = ({ categoryName, categoryId, discountPercent, imageUrl, parentCategoryId }: DealCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to products page with category filter
    if (parentCategoryId) {
      navigate(`/products/${parentCategoryId}/${categoryId}`);
    } else {
      navigate(`/products/${categoryId}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative h-[20rem] cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-[1.02]"
    >
      <img
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        src={imageUrl}
        alt={categoryName}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="mb-2 text-xl font-bold leading-tight line-clamp-2">{categoryName}</p>

        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs">Sale up to</p>
            <p className="text-lg font-bold">{Math.round(discountPercent)}%</p>
          </div>

          <p className="text-sm font-semibold hover:underline">Shop now →</p>
        </div>
      </div>
    </div>
  );
};

export default DealCard;