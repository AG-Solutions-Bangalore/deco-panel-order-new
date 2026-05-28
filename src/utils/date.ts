export function parseDateParts(value: string) {
  const isoLikeMatch = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);

  if (isoLikeMatch) {
    return {
      day: isoLikeMatch[3],
      month: isoLikeMatch[2],
      year: isoLikeMatch[1],
    };
  }

  const slashOrDashMatch = value.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/);

  if (slashOrDashMatch) {
    return {
      day: slashOrDashMatch[1],
      month: slashOrDashMatch[2],
      year: slashOrDashMatch[3],
    };
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return {
    day: String(parsedDate.getDate()),
    month: String(parsedDate.getMonth() + 1),
    year: String(parsedDate.getFullYear()),
  };
}

export function formatDisplayDate(value?: string | Date | null) {
  if (!value) return "";

  const parts =
    value instanceof Date
      ? {
          day: String(value.getDate()),
          month: String(value.getMonth() + 1),
          year: String(value.getFullYear()),
        }
      : parseDateParts(value);

  if (!parts) return String(value);

  const day = parts.day.padStart(2, "0");
  const month = parts.month.padStart(2, "0");
  let year = parts.year;
  if (year.length === 2) {
    year = "20" + year;
  }
  year = year.padStart(4, "0");

  return `${day}-${month}-${year}`;
}
