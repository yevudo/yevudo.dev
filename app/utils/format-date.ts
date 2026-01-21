export const formatDate = (dateStr: string, locale: string) => {
  const result = new Date(dateStr).toLocaleDateString(
    locale === 'uk' ? 'uk-UA' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
    }
  );
  return result.charAt(0).toUpperCase() + result.slice(1);
};
