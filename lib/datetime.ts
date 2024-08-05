/**
 * Convert milliseconds to minutes and seconds
 * https://stackoverflow.com/a/21294619
 * @param millis
 */
export function millisToMinutesAndSeconds(millis: number) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseInt(seconds, 10) < 10 ? '0' : '') + seconds;
}


// Return 'DAY', 'EVENING', 'NIGHT' based on the current time
export const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour >= 0 && hour < 12) {
        return 'DAY'
    } else if (hour >= 12 && hour < 18) {
        return 'EVENING'
    } else {
        return 'NIGHT'
    }
}
