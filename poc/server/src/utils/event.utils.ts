const MILLIS_PER_HOUR = 1000 * 60 * 60
const LONGEST_ALLOWED_SHIFT_HOURS = parseInt(process.env.LONGEST_ALLOWED_SHIFT_HOURS!, 10)

export const isClockInTimeTooOld = (now: Date, clock_in: Date) => {
    const age_millis = now.getTime() - clock_in.getTime()
    const allowed_age_millis = LONGEST_ALLOWED_SHIFT_HOURS * MILLIS_PER_HOUR
    return age_millis > allowed_age_millis
}