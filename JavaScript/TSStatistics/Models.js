/// <reference path="TSStatistics.js" />
/// <reference path="Collections/NameCounter.js" />

var TSStatistics = TSStatistics || {};
TSStatistics.Models = TSStatistics.Models || {};

/**
 * @class
 * @description Main model for TSStatistic
 * Holds tours information for tour search panel
 * 
 * @property {TSStatistics.Models.TourDuration} Duration
 * @property {TSStatistics.Models.PriceOptions} Prices
 * @property {TSStatistics.Models.TourTypeOptions} TourOptions
 * @property {TSStatistics.Collections.NameCounter} Sights Name Counter collection
 * @property {TSStatistics.Models.TravelOptions} TravelBy
 * @property {TSStatistics.Collections.NameCounter} TourExperiences Name Coounter Collection
 */
TSStatistics.Models.StatisticObject = function () {
    this.Duration = new TSStatistics.Models.TourDuration();
    this.Prices = new TSStatistics.Models.PriceOptions();
    this.TourOptions = new TSStatistics.Models.TourTypeOptions();
    this.Sights = new TSStatistics.Collections.NameCounter();
    this.TravelBy = new TSStatistics.Models.TravelOptions();
    this.TourExperiences = new TSStatistics.Collections.NameCounter();
}

/**
 * @class 
 * @description Holds how much tour is available on each tour option described
 * 
 * @param {int} newTour 0 by default
 * @param {int} door2door 0 by default
 * @param {int} specialOffer 0 by default
 * @param {int} singleRoom 0 by default
 * 
 * @property {int} NewToursNr nr of New Tours available
 * @property {int} Door2DoorNr nr of Tours available with "Door to Door" options
 * @property {int} SpecialOffersNr nr of Tours available with special offers
 * @property {int} SingleRoomNr nr of Tours available with single room option
 */
TSStatistics.Models.TourTypeOptions = function(newTour, door2door, specialOffer, singleRoom){
    this.NewToursNr = newTour ? newTour : 0;
    this.Door2DoorNr = door2door ? door2door : 0;
    this.SpecialOffersNr = specialOffer ? specialOffer : 0;
    this.SingleRoomNr = singleRoom ? singleRoom : 0;
}


/**
 * @class
 * @description Holds how much tour is available on each travel option described
 * 
 * @param {int} any 0 by default
 * @param {int} luxuria 0 by default
 * @param {int} silverService 0 by default
 * @param {int} executive 0 by default
 * @param {int} fly 0 by default
 * 
 * @property {int} LuxuriaNr Number of tours by Luxuria
 * @property {int} SilverServiceNr Number of tours by Silver Service
 * @property {int} ExecutiveNr Number of tours by Executive coach
 * @property {int} FlyNr Number of tours by Air (/ Fly)
 */
TSStatistics.Models.TravelOptions = function (luxuria, silverService, executive, fly) {
    this.LuxuriaNr = luxuria ? luxuria : 0;
    this.SilverServiceNr = silverService ? silverService : 0;
    this.ExecutiveNr = executive ? executive : 0;
    this.FlyNr = fly ? fly : 0;
}

/**
 * @class
 * @description Holds and counts statistics about Prices
 * 
 * @param {[]:int} prices Empty array is default
 * 
 * @property {[]:int} AllPrices
 */
TSStatistics.Models.PriceOptions = function (prices) {
    this.AllPrices = prices ? prices : [];
}
/**
 * @description Gets the cheapest price from AllPrices
 * 
 * @returns {int}
 */
TSStatistics.Models.PriceOptions.prototype.getMinPrice = function () {
    return Math.min.apply(null, this.AllPrices);
}
/**
 * @description Gets the most exepnsive price from AllPrices
 * 
 * @returns {int}
 */
TSStatistics.Models.PriceOptions.prototype.getMaxPrice = function () {
    return Math.max.apply(null, this.AllPrices);
}

/**
 * @class
 * @description gives statistic values about the tours duration
 * 
 * @param {[]:int} durations. Empty array is default.
 * 
 * @property {[]:int} AllDurations
 */
TSStatistics.Models.TourDuration = function (durations) {
    this.AllDurations = durations ? durations : [];
}
/**
 * @description Gets the shortest duration from AllDurations
 * 
 * @returns {int}
 */
TSStatistics.Models.TourDuration.prototype.getMinDuration = function () {
    return Math.min.apply(null, this.AllDurations);
}
/**
 * @description Gets the longest duration from AllDurations
 * 
 * @returns {int}
 */
TSStatistics.Models.TourDuration.prototype.getMaxDuration = function () {
    return Math.max.apply(null, this.AllDurations);
}



/**
 * @class Describes how much instance of this name is available from a given NameCounter collection
 * @param {string} name The name of the element
 * @param {int} nr The number of instance of this name
 * 
 * @property {string} Name The name of the element
 * @propert {int} Nr The number of instance of this name
 */
TSStatistics.Models.NameCounterObject = function (name, nr) {
    this.Name = name;
    this.Nr = nr;
}
