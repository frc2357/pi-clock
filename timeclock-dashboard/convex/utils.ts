const MILLIS_PER_HOUR = 60 * 60 * 1000;
const LONGEST_ALLOWED_SHIFT_HOURS = parseInt(
    process.env.LONGEST_ALLOWED_SHIFT_HOURS!,
    10
);

export const isClockInOutdated = (clock_in: number, now: number) => {
    const age = now - clock_in;
    const allowed_age = LONGEST_ALLOWED_SHIFT_HOURS * MILLIS_PER_HOUR;
    return age > allowed_age;
};