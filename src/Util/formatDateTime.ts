/**
 * Timezone-aware date/time formatting utilities
 * All functions force Asia/Ho_Chi_Minh timezone to prevent display issues in production
 */

const VN_TIMEZONE = 'Asia/Ho_Chi_Minh';
const VN_LOCALE = 'vi-VN';

/**
 * Format date to Vietnamese format: DD/MM/YYYY
 * @param dateString - ISO date string or timestamp
 * @returns Formatted date string, e.g., "11/12/2025"
 */
export const formatDateVN = (dateString: string | number | undefined | null): string => {
  if (!dateString) return 'Chưa cập nhật';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Không hợp lệ';

    return new Intl.DateTimeFormat(VN_LOCALE, {
      timeZone: VN_TIMEZONE,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    return 'Lỗi định dạng';
  }
};

/**
 * Format time to Vietnamese format: HH:mm
 * @param dateString - ISO date string or timestamp
 * @returns Formatted time string, e.g., "14:05"
 */
export const formatTimeVN = (dateString: string | number | undefined | null): string => {
  if (!dateString) return 'Chưa cập nhật';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Không hợp lệ';

    return new Intl.DateTimeFormat(VN_LOCALE, {
      timeZone: VN_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  } catch (error) {
    return 'Lỗi định dạng';
  }
};

/**
 * Format datetime to Vietnamese format: HH:mm - DD/MM/YYYY
 * @param dateString - ISO date string or timestamp
 * @returns Formatted datetime string, e.g., "14:05 - 11/12/2025"
 */
export const formatDateTime = (dateString: string | number | undefined | null): string => {
  if (!dateString) return 'Chưa cập nhật';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Không hợp lệ';

    const time = formatTimeVN(dateString);
    const dateStr = formatDateVN(dateString);

    return `${time} - ${dateStr}`;
  } catch (error) {
    return 'Lỗi định dạng';
  }
};

/**
 * Format date with weekday: Thu, 11 Thg 12
 * @param dateString - ISO date string or timestamp
 * @returns Formatted date with weekday, e.g., "T4, 11 Thg 12"
 */
export const formatDateWithWeekday = (dateString: string | number | undefined | null): string => {
  if (!dateString) return 'Chưa cập nhật';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Không hợp lệ';

    return new Intl.DateTimeFormat(VN_LOCALE, {
      timeZone: VN_TIMEZONE,
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).format(date);
  } catch (error) {
    return 'Lỗi định dạng';
  }
};

/**
 * Format as relative time (e.g., "5 phút trước")
 * Uses Vietnam timezone to calculate differences
 */
export const formatRelativeTime = (dateString: string | number | undefined | null): string => {
  if (!dateString) return 'Chưa cập nhật';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Không hợp lệ';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;

    // Older than 7 days, show actual date
    return formatDateVN(dateString);
  } catch (error) {
    return 'Lỗi';
  }
};

/**
 * Check if two dates are on the same day (Vietnam timezone)
 */
export const isSameDay = (date1: string | number | Date, date2: string | number | Date): boolean => {
  try {
    const d1 = formatDateVN(date1 instanceof Date ? date1.getTime() : date1);
    const d2 = formatDateVN(date2 instanceof Date ? date2.getTime() : date2);
    return d1 === d2;
  } catch {
    return false;
  }
};

/**
 * Get today's date string for date input default value (YYYY-MM-DD)
 */
export const getTodayInputValue = (): string => {
  const now = new Date();
  // Convert to Vietnam timezone
  const vnDate = new Date(now.toLocaleString('en-US', { timeZone: VN_TIMEZONE }));

  const year = vnDate.getFullYear();
  const month = String(vnDate.getMonth() + 1).padStart(2, '0');
  const day = String(vnDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
