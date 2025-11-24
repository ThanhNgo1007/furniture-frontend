import { decorCategory } from '../../../data/category/decor/decorCategory'
import HolidayCategoryCard from './HolidayCategoryCard'
// Giả sử đường dẫn file decorCategory.ts của bạn, hãy điều chỉnh nếu cần


const HolidayCategory = () => {
  return (
    <div className="flex flex-wrap justify-center py-5 gap-4 lg:px-20 border-b">
      {/* decorCategory là mảng, ta lấy phần tử đầu tiên [0] (Decor),
        sau đó truy cập vào levelTwoCategory để lấy danh sách sản phẩm 
      */}
      {decorCategory[0]?.levelTwoCategory.map((item) => (
        <HolidayCategoryCard key={item.categoryId} item={item} />
      ))}
    </div>
  )
}

export default HolidayCategory