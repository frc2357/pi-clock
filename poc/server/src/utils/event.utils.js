const MILLIS_PER_HOUR = 1000 * 60 * 60

export const isClockInTimeTooOld = (now, clock_in) => {
    const age_millis = now - clock_in
    const allowed_age_millis = process.env.LONGEST_ALLOWED_SHIFT_HOURS * MILLIS_PER_HOUR
    return age_millis > allowed_age_millis
}