export const formatDate = (dateString: string, locale?: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString(locale, options);
}