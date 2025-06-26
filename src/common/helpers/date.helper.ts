export function unixTimestampToDate(timestamp: string): Date {
  // Since we're now using milliseconds everywhere, no need to multiply by 1000
  return new Date(parseInt(timestamp) * 1000);
}
