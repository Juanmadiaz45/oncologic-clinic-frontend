/**
 * Rounds duration up to the next 15-minute interval
 * @param duration Duration in minutes
 * @returns Duration rounded up to nearest 15-minute increment
 *
 * Examples:
 * - 35 minutes -> 45 minutes
 * - 92 minutes -> 105 minutes
 * - 15 minutes -> 15 minutes (already a multiple)
 * - 1 minute -> 15 minutes
 */
export const roundToNextQuarterHour = (duration: number): number => {
  const QUARTER_HOUR = 15;
  return Math.ceil(duration / QUARTER_HOUR) * QUARTER_HOUR;
};

/**
 * Calculates total appointment duration including buffer time and rounding
 * @param baseDuration Base duration of medical tasks in minutes
 * @param bufferPercentage Buffer percentage (default 5%)
 * @returns Final duration rounded to 15-minute intervals
 */
export const calculateAppointmentDuration = (
  baseDuration: number,
  bufferPercentage: number = 5
): number => {
  // Calculate duration including buffer
  const durationWithBuffer =
    baseDuration + Math.ceil(baseDuration * (bufferPercentage / 100));

  // Round up to next 15-minute interval
  return roundToNextQuarterHour(durationWithBuffer);
};

/**
 * Formats duration in minutes as HH:MM
 * @param minutes Duration in minutes
 * @returns Formatted string in "H:MM" or "HH:MM" format
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} min`;
  }

  return `${hours}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Provides detailed breakdown of duration calculation
 * @param baseDuration Base duration in minutes
 * @param bufferPercentage Buffer percentage
 * @returns Object containing calculation details
 */
export const getDurationBreakdown = (
  baseDuration: number,
  bufferPercentage: number = 15
) => {
  const bufferTime = Math.ceil(baseDuration * (bufferPercentage / 100));
  const durationWithBuffer = baseDuration + bufferTime;
  const finalDuration = roundToNextQuarterHour(durationWithBuffer);
  const additionalRounding = finalDuration - durationWithBuffer;

  return {
    baseDuration,
    bufferTime,
    durationWithBuffer,
    finalDuration,
    additionalRounding,
    formatted: formatDuration(finalDuration),
  };
};
