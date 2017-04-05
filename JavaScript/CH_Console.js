var CH = CH || {};

//you can have it all at once from here
//useful when you want to control all of your loggers from one place.
CH.Console = function () {
    this.logDisabled = false;
    this.infoDisabled = false;
    this.warnDisabled = false;
    this.errorDisabled = false;
};

CH.Console.prototype.log = function (...args) {
    if (!this.logDisabled) console.log.apply(undefined, args);
}

CH.Console.prototype.info = function (...args) {
    if (!this.infoDisabled) console.info.apply(undefined, args);
}

CH.Console.prototype.warn = function (...args) {
    if (!this.warnDisabled) console.warn.apply(undefined, args);
}

CH.Console.prototype.error = function (...args) {
    if (!this.errorDisabled) console.error.apply(undefined, args);
}

//you can have them one by one
//useful when you want it to be able to disable from one scope only alone
//without affecting any other log funcionality
CH.Console.Log = function () {
    this.disabled = false;
};
CH.Console.Log.prototype.log = CH.Console.prototype.log;

CH.Console.Info = function () {
    this.disabled = false;
};
CH.Console.Info.prototype.info = CH.Console.prototype.info;

CH.Console.Warn = function () {
    this.disabled = false;
};
CH.Console.Warn.prototype.warn = CH.Console.prototype.warn;

CH.Console.Error = function () {
    this.disabled = false;
};
CH.Console.Error.prototype.error = CH.Console.prototype.error;

