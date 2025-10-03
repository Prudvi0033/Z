export function formatPostDate(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const formatPostDateTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formatted = formatter.format(date);

  // Handle Safari/Edge "Oct 3, 2025 at 9:56 PM"
  if (formatted.includes(" at ")) {
    const parts = formatted.split(" at ");
    return `${parts[1]} · ${parts[0]}`;
  }

  // Example from formatter: "Oct 3, 2025, 9:56 PM"
  const parts = formatted.split(", ");
  // ["Oct 3", "2025", "9:56 PM"]

  if (parts.length === 3) {
    const [monthDay, year, time] = parts;
    return `${time} · ${monthDay}, ${year}`;
  }

  return formatted; // fallback
};


