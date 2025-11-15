import React, { useState, useEffect } from 'react';
import { Fab, Zoom, Box } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const BackToTopButton = () => {
  // 1. State để theo dõi xem nút có nên hiển thị hay không
  const [isVisible, setIsVisible] = useState(false);

  // 2. Hàm xử lý logic hiển thị
  const toggleVisibility = () => {
    // Nếu cuộn xuống quá 300px, thì hiển thị nút
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // 3. Hàm xử lý khi click: Cuộn lên đầu trang (mượt mà)
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // 4. useEffect để gán và dọn dẹp sự kiện 'scroll'
  useEffect(() => {
    // Thêm sự kiện 'scroll' khi component được mount
    window.addEventListener('scroll', toggleVisibility);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []); // Mảng rỗng đảm bảo effect này chỉ chạy 1 lần

  return (
    // 5. Dùng 'Zoom' để tạo hiệu ứng mờ/hiện
    <Zoom in={isVisible}>
      <Box
        onClick={scrollToTop}
        role="presentation"
        sx={{
          position: 'fixed', // Cố định vị trí
          bottom: 32,         // Cách đáy 32px
          right: 32,          // Cách phải 32px
          zIndex: 1000,       // Nổi lên trên mọi thứ
        }}
      >
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon sx={{color: 'white'}}/>
        </Fab>
      </Box>
    </Zoom>
  );
};

export default BackToTopButton;