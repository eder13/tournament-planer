class TimeHelper {
    static getCurrentUnixTimestampSeconds(): number {
        return Number((Date.now() / 1000).toFixed(0));
    }
}

export default TimeHelper;
