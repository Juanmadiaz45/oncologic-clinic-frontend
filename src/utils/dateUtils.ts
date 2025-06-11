/**
 * Gets the current date in YYYY-MM-DD format in local time zone
 */
export const getTodayLocalDate = (): string => {
  const today = new Date();
  return formatDateToLocal(today);
};

/**
 * Gets tomorrow's date in YYYY-MM-DD format in local time zone
 */
export const getTomorrowLocalDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateToLocal(tomorrow);
};

/**
 * Gets a date N days from today in YYYY-MM-DD format
 */
export const getDaysFromToday = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDateToLocal(date);
};

/**
 * Converts a date to YYYY-MM-DD format while maintaining the local time zone
 */
export const formatDateToLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Converts a date in YYYY-MM-DD format to a Date object in the local time zone
 * Avoids time zone issues by creating the date at exactly 00:00 local time
 */
export const parseDateStringToLocal = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Format a date to display to the user in Spanish
 */
export const formatDateForDisplay = (dateString: string): string => {
  const date = parseDateStringToLocal(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format a date to show only the day of the week
 */
export const formatDayOfWeek = (dateString: string): string => {
  const date = parseDateStringToLocal(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
  });
};

/**
 * Checks if a date is in the past
 */
export const isDateInPast = (dateString: string): boolean => {
  const date = parseDateStringToLocal(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset at midnight to compare only dates
  date.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Check if a date is today
 */
export const isToday = (dateString: string): boolean => {
  return dateString === getTodayLocalDate();
};

/**
 * Check if a date is tomorrow
 */
export const isTomorrow = (dateString: string): boolean => {
  return dateString === getTomorrowLocalDate();
};

/**
 * Calculate the difference in days between two dates
 */
export const getDaysDifference = (fromDate: string, toDate: string): number => {
  const from = parseDateStringToLocal(fromDate);
  const to = parseDateStringToLocal(toDate);
  const diffTime = to.getTime() - from.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Gets the name of the month in Spanish
 */
export const getMonthName = (dateString: string): string => {
  const date = parseDateStringToLocal(dateString);
  return date.toLocaleDateString('es-ES', { month: 'long' });
};

/**
 * Combine a date with a time to create an ISO timestamp
 */
export const combineDateAndTime = (
  dateString: string,
  timeString: string
): string => {
  return `${dateString}T${timeString}:00`;
};

/**
 * Extracts only the date from an ISO timestamp (regardless of time zone)
 */
export const extractDateFromISO = (isoString: string): string => {
  return isoString.split('T')[0];
};

/**
 * Extract only the time from an ISO timestamp
 */
export const extractTimeFromISO = (isoString: string): string => {
  const timePart = isoString.split('T')[1];
  return timePart ? timePart.substring(0, 5) : '';
};

/**
 * Validates whether a string is a valid date in YYYY-MM-DD format
 */
export const isValidDateString = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = parseDateStringToLocal(dateString);
  return !isNaN(date.getTime());
};

/**
 * Get the first available business day to schedule appointments
 * By default, it's tomorrow, but you can configure it
 */
export const getMinimumAppointmentDate = (
  daysFromToday: number = 1
): string => {
  return getDaysFromToday(daysFromToday);
};

export const DATE_FORMATS = {
  INPUT: 'YYYY-MM-DD',
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_LONG: 'dddd, DD de MMMM de YYYY',
  TIME: 'HH:mm',
  DATETIME_ISO: 'YYYY-MM-DDTHH:mm:ss',
} as const;
