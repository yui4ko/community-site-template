
import { format } from 'date-fns';

/**
 * Treats a UTC Date object as if its UTC components were Local components.
 * This is used to display "Wall Clock" time regardless of the browser's timezone.
 * Example: Stored "18:30Z" -> Displayed "18:30" (even if browser is -8h)
 */
export const getWallClockDate = (date: Date | string) => {
    const d = new Date(date);
    // Construct a new date using UTC values as Local values
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes());
};

/**
 * Formats a date string preserving Wall Clock time.
 */
export const formatWallClock = (date: Date | string, formatStr: string) => {
    return format(getWallClockDate(date), formatStr);
};
