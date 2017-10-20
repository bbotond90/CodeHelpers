
var TSStatistics = TSStatistics || {};
TSStatistics.Collections = TSStatistics.Collections || {};

/**
 * @description You can add names to this Collection
 * and it will keep track of the amounts of occurances of each.
 * You can add or remove occurances by using its names in the Collection.
 * If a name you are looking for is not in the array you will get an object that says it
 * contains 0 instance of this name. 
 * 
 * @requires TSStatistics.Models
 * 
 * @property {Obj as Associative Array} _Collection Serves as a local cache or db.
 * Please do not modify directly.
 * 
 */
TSStatistics.Collections.NameCounter = function () {
    this._Collection = {};
}

/**
 * @description Adds / Increment a name's counter by n
 * 
 * @param {string} name
 * @param {int} n Number of element to add. Deafult value is 1
 * 
 * @returns {TSStatistics.Models.NameCounterObject}
 */
TSStatistics.Collections.NameCounter.prototype.add = function (name, n) {

    //default to 1
    n = n ? n : 1;

    if (this._Collection[name]) {
        this._Collection[name] += n;
    }
    else {
        this._Collection[name] = n;
    }

    var nr = this._Collection[name];
    return new TSStatistics.Models.NameCounterObject(name, nr);
}

/**
 * @description Reduces the number of names by n in Collection. 
 * 
 * @param {string} name
 * @param {int} n Number of element to add. Deafult value is 1
 * 
 * @returns {TSStatistics.Models.NameCounterObject}
 */
TSStatistics.Collections.NameCounter.prototype.remove = function (name, n) {

    //default to 1
    n = n ? n : 1;

    var nr = 0;

    if (this._Collection[name]) {
        this._Collection[name] -= n;

        nr = this._Collection[name];

        // can't be less then 0
        if (nr < 0) {
            nr = 0;
            this._Collection[name] = nr;
        };

    }

    return new TSStatistics.Models.NameCounterObject(name, nr);
    
}

/**
 * @description Get infofrmation about an element.
 * If no element found in the Collection by 'name' it returns with an object with a Nr = 0
 * 
 * @param {string} name
 * 
 * @returns {TSStatistics.Models.NameCounterObject}
 */
TSStatistics.Collections.NameCounter.prototype.get = function (name) {
    var nr = this._Collection[name];
    
    // if the 'name' is not registered, set its number to zero.
    if (!nr) {
        nr = 0;
    }

    return new TSStatistics.Models.NameCounterObject(name, nr);

}

/**
 * Gets an array of NameCounterObject based on this._Collection
 * 
 * @returns {[]:TSStatistics.Models.NameCounterObject}
 */
TSStatistics.Collections.NameCounter.prototype.getAll = function () {
    var self = this;
    return Object.keys(this._Collection).map(function (name) {
        return self.get(name);
    });
}

/**
 * @description Returns an array of keys that has a Nr of more than 1
 * 
 * @returns {[]:string}
 */
TSStatistics.Collections.NameCounter.prototype.getAllKeys = function () {
    var self = this;
    return Object.keys(this._Collection).map(function (name) {
        return name;
    });
}

/**
 * @description Checks if a key is in the collection has a Nr bigger than 0
 * 
 * @param {string} key A key to check if available (has a Nr of greater than 0)
 * @returns {bool}
 */
TSStatistics.Collections.NameCounter.prototype.hasKey = function (key) {
    var self = this;
    return self.get(key).Nr > 0;
}


