import { DateTime } from 'luxon';

export const formatDate = (
  dateString: string,
  locale: string = 'en',
  hours: boolean = false,
  timeZone: string = 'local'
): string => {
  const date = DateTime.fromISO(dateString, { locale });

  if (!date.isValid) {
    throw new Error('Invalid date format');
  }

  const zonedDate = date.setZone(timeZone);

  const format = hours ? "MMM d, yyyy 'at' h:mm a" : 'MMM d, yyyy';

  return zonedDate.toFormat(format);
};
