

const DealCard = () => {
  return (
   <div className="group relative h-[20rem] cursor-pointer overflow-hidden rounded-lg shadow-lg">
      <img
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        src="https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811575/qc_jawh94.avif"
        alt="Winter decor deal"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="mb-2 text-xl font-bold leading-tight">Winter decor</p>

        {/* --- PHẦN ĐƯỢC CẬP NHẬT --- */}
        {/* Container chính: Đẩy 2 khối con ra hai bên */}
        <div className="flex items-start justify-between">
          
          {/* Khối bên trái: Chứa 2 dòng text */}
          <div>
            <p className="text-xs">Sale up to</p>
            <p className="text-lg font-bold">40%</p>
          </div>

          {/* Khối bên phải: Nút "Shop now" */}
          <p className="text-sm font-semibold hover:underline">Shop now</p>

        </div>
      </div>
    </div>
  )
}

export default DealCard