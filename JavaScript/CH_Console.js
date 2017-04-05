/**
* To disable set chLogDisabled = true in the calling context
* @function
*/
console.chLog = function (...args) {
    if (typeof chLogDisabled == 'undefined' || !chLogDisabled)
        console.log.apply(undefined, args);
}

/**
* To disable set chInfoDisabled = true in the calling context
* @function
*/
console.chInfo = function (...args) {
    if (typeof chInfoDisabled == 'undefined' || !chInfoDisabled)
        console.info.apply(undefined, args);
}

/**
* To disable set chWarnDisabled = true in the calling context
* @function
*/
console.chWarn = function (...args) {
    if (typeof chWarnDisabled == 'undefined' || !chWarnDisabled)
        console.warn.apply(undefined, args);
}

/**
* To disable set chErrorDisabled = true in the calling context
* @function
*/
console.chError = function (...args) {
    if (typeof chErrorDisabled == 'undefined' || !chErrorDisabled)
        console.error.apply(undefined, args);
}
