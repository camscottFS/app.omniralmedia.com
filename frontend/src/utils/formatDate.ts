export const formatDate = (
  dateString: string,
  locale?: string,
  hours?: boolean
): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(hours && { hour: 'numeric', minute: 'numeric', hour12: true }),
  };

  return date.toLocaleDateString(locale, options);
};
