// TypeScript utility — date helpers
export function formatDate(date: Date, locale = 'en-GB'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

export function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
