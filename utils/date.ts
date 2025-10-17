export function getEpochOfTheLastMomentOfTheDay(){
    const now: number = Date.now()
    const dateOfToday: Date = new Date(now)
    // return Math.floor(now / 100000) - 10
    return Math.floor(dateOfToday.setHours(23, 59, 59, 999) / 1000)
}