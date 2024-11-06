/**
 * A date without a set time of day.
 */
class Day{
    /**
     * Create a new Day object corresponding to the given year, month and date.
     * 
     * NOTE: `month` and `date` are both 1-indexed, meaning `Day(2024, 1, 1)` corresponds to January 1, 2024.
     * @param {number} year 
     * @param {number} month 
     * @param {number} date 
     */
    constructor(year, month, date){
        this.y = year;
        this.m = month;
        this.d = date;
    }

    /**
     * Get the Day of a JavaScript Date object, in UTC.
     * @param {Date} date a date
     * @returns the corresponding Day (in UTC)
     */
    static fromJSDateUTC(date){
        return new Day(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
    }

    /**
     * Create a new Day object.
     * @param {string} datestr a date string in the format "YYYY-MM-DD"
     */
    static fromString(datestr){
        return new Day(...datestr.split("-").map(x => parseInt(x)));
    }

    /**
     * Get today's (UTC) Day.
     * @returns a Day object
     */
    static todayUTC(){
        let now = new Date();
        return Day.fromJSDateUTC(now);
    }

    /**
     * Get Day corresponding to "in `days` days", counting from today's UTC date.
     * @param {number} days number of days to add
     * @returns the resulting Day object
     */
    static inUTC(days){
        let now = new Date();
        now.setUTCDate(now.getUTCDate() + days);
        return Day.fromJSDateUTC(now);
    }

    /**
     * Get the year component of this Day.
     * @returns a year number
     */
    getYear(){
        return this.y;
    }

    /**
     * Get the month component of this Day.
     * @returns a 1-indexed month number
     */
    getMonth(){
        return this.m;
    }

    /**
     * Get the date component of this Day.
     * @returns a 1-indexed date number
     */
    getDate(){
        return this.d;
    }

    /**
     * Check whether this day falls after another day.
     * @param {number} anotherday another day
     * @return {boolean} `true` if this > anotherday, otherwise `false`
     */
    after(anotherday){
        if(anotherday.y == this.y){
            if(anotherday.m == this.m){
                return anotherday.d > this.d;
            }

            return anotherday.m > this.m;
        }

        return anotherday.y > this.y;
    }

    /**
     * Copy this Day object.
     * @returns a copy of this Day
     */
    copy(){
        return new Day(this.y, this.m, this.d);
    }

    /**
     * Get a JavaScript {@link Date} corresponding to this day at midnight, local time.
     * @returns {Date} a JavaScript date object
     */
    toDate(){
        let date = this.toDateUTC();
        date.setTime(date.getTime() + date.getTimezoneOffset() * 60000);
        return date;
    }

    /**
     * Get a JavaScript {@link Date} representation of this day at midnight, UTC.
     * @returns {Date} a JavaScript date object
     */
    toDateUTC(){
        console.group(this.toString());
        return new Date(this.toString());
    }

    /**
     * Return the string representation of this Day.
     * @returns a string in the format `YYYY-MM-DD`
     */
    toString(){
        return String(this.y) + "-" + ("0" + String(this.m)).slice(-2) + "-" + ("0" + String(this.d)).slice(-2);
    }
    
    /**
     * Used by the JSON.stringify function to allow for JSON serialization
     * of Day objects.
     * @returns a string in the format `YYYY-MM-DD`
     * @see {@link toString} of which this function is essentially an alias
     */
    toJSON(){
        return this.toString();
    }
}

module.exports = Day;