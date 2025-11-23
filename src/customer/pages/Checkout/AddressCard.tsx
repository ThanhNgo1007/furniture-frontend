// Đảm bảo bạn import đúng type Address
// Nếu chưa có file types, bạn có thể dùng any tạm thời, nhưng tốt nhất nên define type
import type { Address } from '../../../types/userTypes'

interface AddressCardProps {
  address: Address
}

const AddressCard = ({ address }: AddressCardProps) => {
  return (
    // Bỏ thẻ div bao ngoài có border và Radio, vì Checkout.tsx đã lo phần đó
    <div className='w-full space-y-3 pt-2'>
        {/* Hiển thị Tên */}
        <h1 className='font-semibold text-lg'>{address?.name}</h1>
        
        {/* Hiển thị Địa chỉ chi tiết */}
        <p className='text-gray-600'>
            {address?.address}, {address?.ward}, {address?.locality}, {address?.city} - {address?.pinCode}
        </p>
        
        {/* Hiển thị Số điện thoại */}
        <p>
            <strong>Mobile phone: </strong> {address?.mobile}
        </p>
    </div>
  )
}

export default AddressCard