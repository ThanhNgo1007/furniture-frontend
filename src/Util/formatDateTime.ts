// Format datetime to Vietnamese format
export const formatDateTime = (dateString: string | undefined | null): string => {
  if (!dateString) return 'Chưa cập nhật';

  try {
    const date = new Date(dateString);

    // Check if valid date
    if (isNaN(date.getTime())) return 'Không hợp lệ';

    // Format: "14:05 - 05/12/2025"
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  } catch (error) {
    return 'Lỗi định dạng';
  }
};

// Format as relative time (e.g., "5 phút trước")
export const formatRelativeTime = (dateString: string | undefined | null): string => {
  if (!dateString) return 'Chưa cập nhật';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
  } catch (error) {
    return 'Lỗi';
  }
};
