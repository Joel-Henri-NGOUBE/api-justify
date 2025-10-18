/**
 * Calculates the gap of milliseconds elapsed since epoch and the current day at 23 h 59 m 59 s
 * @returns The result of that computation
 */
export function getEpochOfTheLastMomentOfTheDay(): number{
    const now: number = Date.now()
    const dateOfToday: Date = new Date(now)
    return Math.floor(dateOfToday.setHours(23, 59, 59, 999) / 1000)
}