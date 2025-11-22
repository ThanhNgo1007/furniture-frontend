import { Outlet } from 'react-router-dom';
import Footer from '../../customer/components/Footer/Footer';
import Navbar from '../../customer/components/Navbar/Navbar';

const CustomerLayout = () => {
  return (
    <div>
      {/* Navbar và Footer chỉ xuất hiện trong Layout này */}
      <Navbar />
      
      {/* Outlet là nơi nội dung các trang con (Home, Product, Cart...) sẽ hiển thị */}
      <Outlet />
      
      <Footer />
    </div>
  );
};

export default CustomerLayout;