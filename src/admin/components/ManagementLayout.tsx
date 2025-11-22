import { Outlet } from 'react-router-dom';
import Navbar from '../../customer/components/Navbar/Navbar';

const ManagementLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar sẽ tự động chuyển sang chế độ rút gọn nhờ logic kiểm tra đường dẫn bên trong nó */}
      <Navbar />
      
      <div className="flex-grow">
        <Outlet />
      </div>
      
      {/* Không có Footer ở đây */}
    </div>
  );
};

export default ManagementLayout;