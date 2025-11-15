import React from 'react'

const Introduction = () => {
  return (
    // 1. Container chính
    // - py-16: Thêm padding trên và dưới
    // - max-w-4xl: Giới hạn chiều rộng tối đa (rất quan trọng)
    // - mx-auto: Tự động căn giữa theo chiều ngang
    // - px-4: Thêm lề hai bên trên màn hình nhỏ
    <div className='py-16 max-w-6xl pl-4 pr-4 lg:pl-40 lg:pr-10'>
        
        {/* 2. Tiêu đề */}
        <h2 className='text-2xl font-bold mb-6'> 
            Furniture and inspiration for a better everyday life at home
        </h2> 
        
        {/* 3. Khối chứa các đoạn văn */}
        {/* - space-y-6: Tự động thêm khoảng cách (margin-top) giữa các thẻ con */}
        <div className='space-y-6 text-gray-700'>
            <p className='text-sm leading-relaxed'> {/* 4. Thêm line-height */}
                Welcome to AptDeco, where you will always find affordable furniture, stylish home décor and innovative modern home solutions, as well as design inspiration and unique home ideas! 
                If you are online furniture shopping or if you are visiting a local Apt store near you, you can expect super low prices on a wide variety of exciting home essentials that are perfect for larger homes and small space living. 
                So what are you waiting for? Refresh your home with affordable options for the living room, bed, bath and beyond today!
            </p> 
            <p className='text-sm leading-relaxed'>
                If you want to save even more money when you are shopping at AptDeco, be sure to <a href="#" className="underline hover:text-gray-900">join AptDeco Family</a> so you can take advantage of our regular furniture sales, amazing deals on home furnishings and special offers on home accessories. 
                Get ready for big savings whether you are refreshing your space with small upgrades, like new curtains or sheets, or planning bigger home renovation projects, like remodeling your kitchen or doing a DIY bathroom makeover!
            </p>

        </div>
    </div>
  )
}

export default Introduction