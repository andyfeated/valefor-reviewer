export function getDailyWindowUTC() {
  const now = new Date();

  // Start at today's 12:00 UTC
  let start = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      12,
      0,
      0,
      0,
    ),
  );

  // If current time is before 12:00 UTC, use yesterday's 12:00 UTC
  if (now < start) {
    start = new Date(start.getTime() - 24 * 60 * 60 * 1000);
  }

  // End is 24 hours after start
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return { start, end };
}
