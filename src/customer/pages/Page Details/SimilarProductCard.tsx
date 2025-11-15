import React from 'react'

const SimilarProductCard = () => {
  return (
    <div>
        <div className='group p-4 relative'>
        <div 
          className='card'

            // Optional: Reset về ảnh đầu tiên khi không hover nữa
            // setCurrentImage(0); 
        >
          
            <img
              className='card-media'
              src={"https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811578/storemolla-8-drawer-dresser-gray-brown-5_tr3nbd.avif"}
              alt=''
              // Sửa đổi transform để nó phụ thuộc vào state 'currentImage'
            />
        </div>
       <div className='details pt-3 space-y-2 group-hover-effect rounded-md'>
        {/* Phần tên và mô tả */}
        <div className='name'>
          <h1 className='text-lg font-bold uppercase'>Storklinta</h1>
          <p className='text-sm text-gray-600'>
            6-drawer dresser, white/anchor/unlock function, 55 1/8x18 7/8x29 1/2 "
          </p>
        </div>
        {/* Phần giá tiền */}
        <div className='flex items-baseline gap-3'>
            {/* Giá bán (màu đỏ) */}
            <div className='price font-bold text-xl'>
              <span>
                299
                <sup className='font-bold'>.99</sup>
              </span>
            </div>
            {/* Giá gốc (bị gạch) */}
            <div className='original-price text-base text-gray-500 line-through'>
              $399.00
            </div>
          </div>
          {/* Hàng chứa % giảm giá */}
          <div>
            <span className='bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded'>
                  30% OFF
            </span>
          </div>
      </div>
    </div>
    </div>
  )
}

export default SimilarProductCard