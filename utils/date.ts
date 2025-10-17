export function getEpochOfTheLastMomentOfTheDay(){
    const now: number = Date.now()
    const dateOfToday: Date = new Date(now)
    return dateOfToday.setHours(23, 59, 59, 999)
}