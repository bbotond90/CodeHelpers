/**
* Predicate for Array.prototype.get*Where
* @callback chGetWherePredicate
* @param {int} index
* @param {typeOfArrayElement} element
* @return {bool}
*/

/**
 * Helps to find a specific amount of indexes by predicate
 * @param {int} amountNr Number of elements needed
 * @param {chGetWherePredicate} predicate A function that matches the syntax bool function(sourceArrayItem)
 * @returns {chGetIndexesWhere.Result}
 */
Array.prototype.chGetIndexesWhere = function chGetIndexesWhere(amountNr, predicate) {
    var sourceArray = this;

    var result = new Array.prototype.chGetIndexesWhere.Result();
    result.remained = amountNr;

    for (var i = 0; i < sourceArray.length; i++) {
        if (result.remained < 1) break;
        if (predicate(i, sourceArray[i])) {
            result.indexes.push(i);
            result.found++;
            result.remained--;
        }
    }
    
    return result;
}

/**
* Return obejct model for getIndexesWhere
* @arg {array} indexes The found indexes
* @arg {int} remained The remaining element counter where we could not found a match
* @arg {int} found Number of matched items
*/
Array.prototype.chGetIndexesWhere.Result = function () {
    this.indexes = [];
    this.remained = 0;
    this.found = 0;
}

/**
 * Helps to find a specific amount of items by predicate
 * @param {int} amountNr Number of elements needed
 * @param {chGetWherePredicate} predicate A function that matches the syntax bool function(index, sourceArrayItem)
 * @returns {chGetIndexesWhere.Result}
 */
Array.prototype.chGetItemsWhere = function chGetItemsWhere(amountNr, predicate) {
    var sourceArray = this;

    var result = new Array.prototype.chGetItemsWhere.Result();
    result.remained = amountNr;

    for (var i = 0; i < sourceArray.length; i++) {
        if (result.remained < 1) break;
        if (predicate(i, sourceArray[i])) {
            result.items.push(sourceArray[i]);
            result.found++;
            result.remained--;
        }
    }

    return result;
}

/**
* Return obejct model for getItemsWhere
* @arg {array} indexes The found indexes
* @arg {int} remained The remaining element counter where we could not found a match
* @arg {int} found Number of matched items
*/
Array.prototype.chGetItemsWhere.Result = function () {
    this.items = [];
    this.remained = 0;
    this.found = 0;
}