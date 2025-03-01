export class TimeUtil {
    static readonly ONE_DAY_IN_MS = 86_400_000; 

    static isOlderThanOneDay(date: Date | string): boolean {
        return Date.now() - new Date(date).getTime() > this.ONE_DAY_IN_MS;
    }
}
