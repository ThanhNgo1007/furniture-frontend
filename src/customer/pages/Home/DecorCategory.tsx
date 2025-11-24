import { useMemo } from 'react'; // 1. Import useMemo
import { useTranslation } from 'react-i18next'; // 2. Import useTranslation
import { decorCategory } from '../../../data/category/decor/decorCategory';
import DecorCategoryCard from './DecorCategoryCard';

const DecorCategory = () => {
  const { t } = useTranslation();

  // 3. TỐI ƯU: Sử dụng useMemo để dịch dữ liệu
  // Chỉ chạy lại hàm map này khi ngôn ngữ thay đổi (t thay đổi)
  const translatedDecorCategory = useMemo(() => {
    return decorCategory.map((category) => ({
      ...category,
      name: t(category.name), // Dịch tên cấp 1 (nếu cần hiển thị)
      levelTwoCategory: category.levelTwoCategory.map((item) => ({
        ...item,
        name: t(item.name) // Dịch tên item cấp 2 (Accent Pillows, Candles...)
      }))
    }));
  }, [t]); // Dependency là [t]

  return (
    <div className="flex flex-wrap justify-center py-5 gap-4 lg:px-20 border-b">
      {/* 4. Sử dụng dữ liệu đã được memoize */}
      {translatedDecorCategory[0]?.levelTwoCategory.map((item) => (
        <DecorCategoryCard key={item.categoryId} item={item} />
      ))}
    </div>
  )
}

export default DecorCategory;