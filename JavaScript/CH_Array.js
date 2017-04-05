/**
* Predicate for Array.prototype.get*Where
* @callback chGetWherePredicate
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
    var resultIndexes = [];
    var remained = amountNr;

    for (var i = 0; i < sourceArray.length || remained < 1; i++) {
        if (predicate(sourceArray[i])) {
            resultIndexes.push(i);
            remained--;
        }
    }

    var result = new Array.prototype.chGetIndexesWhere.Result();
    result.indexes = resultIndexes;
    result.remained = remained;

    return result;
}

/**
* Return obejct model for getIndexesWhere
* @arg {array} indexes The found indexes
* @arg {int} remained The remaining element counter where we could not found a match
*/
Array.prototype.chGetIndexesWhere.Result = function () {
    this.indexes = [];
    this.remained = 0;
}

/**
 * Helps to find a specific amount of items by predicate
 * @param {int} amountNr Number of elements needed
 * @param {chGetWherePredicate} predicate A function that matches the syntax bool function(sourceArrayItem)
 * @returns {chGetIndexesWhere.Result}
 */
Array.prototype.chGgetItemsWhere = function chGetItemsWhere(amountNr, predicate) {
    var sourceArray = this;
    var resultItems = [];
    var remained = amountNr;

    for (var i = 0; i < sourceArray.length || remained < 1; i++) {
        if (predicate(sourceArray[i])) {
            resultItems.push(sourceArray[i]);
            remained--;
        }
    }

    var result = new Array.prototype.chGetItemsWhere.Result();
    result.items = resultItems;
    result.remained = remained;

    return result;
}

/**
* Return obejct model for getItemsWhere
* @arg {array} indexes The found indexes
* @arg {int} remained The remaining element counter where we could not found a match
*/
Array.prototype.chGetItemsWhere.Result = function () {
    this.items = [];
    this.remained = 0;
}