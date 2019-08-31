function parseDate(val) {
    const n = Date.parse(val)
    if (!isNaN(n)) {
        return new Date(n)
    }
}

function toString(val) {
    if (val == null) {
        return val
    } else {
        return val.toString()
    }
}