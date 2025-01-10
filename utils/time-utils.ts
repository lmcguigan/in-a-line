export const convertSecsToMMSSString = (secs: number) => {
    let mins = Math.floor(secs / 60)
    let remainingSeconds = secs % 60
    if(secs > 3600){
        return 'Exceeds Duration'
    }
    return `${mins >= 10 ? mins : `0${mins}`}:${remainingSeconds >= 10 ? remainingSeconds : `0${remainingSeconds}`}`
}