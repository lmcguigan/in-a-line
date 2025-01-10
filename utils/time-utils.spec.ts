import { convertSecsToMMSSString } from "./time-utils"

describe('Testing the method that converts seconds into mm:ss', () => {
    it('should display leading zeros for times less than 60 seconds', () => {
        expect(convertSecsToMMSSString(3)).toBe('00:03')
        expect(convertSecsToMMSSString(15)).toBe('00:15')
    })
    it('should display the number of minutes with a leading zero for times greater than 60 seconds', () => {
        expect(convertSecsToMMSSString(62)).toBe('01:02')
        expect(convertSecsToMMSSString(932)).toBe('15:32')
    })
    it('should return Exceeds Duration if over 60 minutes', () => {
        expect(convertSecsToMMSSString(3600)).toBe('Exceeds Duration')
    })
})