/// <reference path="Models.js" />
/// <reference path="Collections/NameCounter.js" />
/// <reference path="../../ToursApp/TourSearch.js" />

;(function () {

    /**
    * @namespace
    */
    var TSStatistics = window.TSStatistics || {};
    
    /**
     * @namespace TSStatistics.Services.Helpers.OptionsData
     */
    var _hod = TSStatistics.Services.Helpers.OptionsData;
    window._hod = _hod;

    /**
     * @class
     * @requires JQuery 2
     * @requires TSStatistics.Models
     * @requires TSStatistics.Collections.NameCounter
     * @requires TourExperiences
     * @requires ToursDateSelector from \Scripts\App\ToursAppsCommon\DateSelector_DropDownWithTabs.js
     * @requires Moment.js
     * 
     * @description Can be hooked up to track changes on screen
     *  and counts the availability of each options
     *  available on the visible Tours.
     */
    TSStatistics.Tracker = function (visibleTourCodes) {

        //visibleTourCodes do nothing here at the moment

        this.Statistics = new TSStatistics.Models.StatisticObject();

        // TODO: hook up the logic here.
        //console.warn("Not finished");
    }

    /**
     * @description Calls all the UI update functions.
     * Use this function to update the UI
     * 
     * Hint: It is probably called in TourSearch.js
     * at the "GetToursListToShow" function's success callback.
     * 
     * @returns {void}
     */
    TSStatistics.Tracker.prototype.updateUI = function () {

        // start UI manipulation
        this.displayTourExperienceCounter();
        //this.displayTourDurationsCounter(); NOT FINISHED
        this.displayTravelOptionsCounter();
        this.displayTourTypeOptionsCounter();
        this.displayWarOptionsCounter();
    }

    /**
     * 
     * @static
     * @memberOf {object} TSStatistsics.Tracker Cached GetDataForTSStatisticsJS data from TourSearch.js
     */
    TSStatistics.Tracker.__TSOptionsCache__ = undefined;
    var _t = TSStatistics.Tracker;
    _t.prototype.HasTSOptionsCache = function () {
        return TSStatistics.Tracker.__TSOptionsCache__ !== undefined;
    };
    /**
     * 
     * @description Gets the back-end data collection for data querying as a database.
     * If a cache is already there we will use the cache then.
     * 
     * @returns {TSStatistics.Tracker.__TSOptionsCache__.__TSOptionsCache__} If undefined sends a get request to fetch with new data;
     */
    TSStatistics.Tracker.prototype.GetTSOptionsCollection = function (callback) {

        //TODO On Custom pages we have to obtain the page type (query options enum) and send a request
        // with the appropriate attributes probably to a new service


        var err = null;

        if (!callback) {
            return _t.__TSOptionsCache__;
        }

        var self = this;
        if (_t.__TSOptionsCache__ === undefined) {
            TSStatistics.Services.AJAX.GetOptionsData()
            .success(function (data) {
                _t.__TSOptionsCache__ = data;
                //console.log("SUCCESS", data);
                callback(err, data);
            })
            .fail(function (jqXHR, status, error) {
                console.error("ERROR: @ get TSStatistics cache component: " + error);
                _t.__TSOptionsCache__ = null;
                callback(error, undefined)
            });
        } else {
            callback(err, _t.__TSOptionsCache__);
        }

        
    }


    /**
     * 
     * @description Updates the "Duration" section on the TourSearch filter app
     * 
     * @returns {void}
     */
    TSStatistics.Tracker.prototype.displayTourDurationsCounter = function () {

        //TODO: By nature it is not enough to show how much of option is
        // availalbe on the screen, because it will display a flawed number.
        // If they going to select another option from the drop down, 
        // we have to deselect the value, and select another one.
        // So it is 2 step and we see only one step at once.
        //
        //To be able to show a correct number, we have to send a separate 
        //request to the serber with a specific tsqm object just for this
        //drop down list.

        //NOTE: it is the case at all drop down.

        return;

        this.getToursDurationsCounter(function (err, durationsCounter) {
            if (err) {
                console.error(err);
                return;
            }
            // logic here
        });
        //console.log("durationsCounter --> ", durationsCounter.getAll());
    }


    /**
     * @description Updates the "TOUR TYPES" 
     * (which options are actually Destination names
     *  marked as Experience types)
     *   section on the TourSearch filter app
     * 31 August 2016
     * 
     * @returns {void}
     */
    TSStatistics.Tracker.prototype.displayTourExperienceCounter = function () {
        var counter = this.countTourExperiences();
        var allIdsObj = counter.getAll();
        var counterAttrName = TourExperiences.appCounterAttrName;

        TourExperiences.setUICounterToZero();

        for (var i = 0; i < allIdsObj.length; i++) {
            TourExperiences.setUICounterOn(allIdsObj[i]);
        }
    }

    /**
    * 
    * Updates the "WAR TYPES"
    * 
    * @returns {void}
    */
    TSStatistics.Tracker.prototype.displayWarOptionsCounter = function () {
        this.getWarOptionsCounter(function (counter) {

            var keys = counter.getAllKeys();
            for (var i = 0; i < keys.length; i++) {
                var tbo = LH.Search.WarOptions;

                var displayAttributeIndex = tbo.getDisplayAttributeValueBy(keys[i]);
                var value = counter.get(keys[i]).Nr;

                tbo.setDisplayAttributeValue(displayAttributeIndex, value);
            }

        });
    }

    /**
     * @description Updates the "Filter Tours By" checkbox's (_tsqm.TourType) section on the TourSearch filter app
     * 14 September 2016
     * 
     * @returns {void}
     */
    TSStatistics.Tracker.prototype.displayTourTypeOptionsCounter = function () {
        this.getTourTypeOptionsCounter(function (counter) {

            var keys = counter.getAllKeys();
            for (var i = 0; i < keys.length; i++) {
                var tbo = LH.Search.TourTypeOptions;

                var displayAttributeIndex = tbo.getDisplayAttributeValueBy(keys[i]);
                var value = counter.get(keys[i]).Nr;

                tbo.setDisplayAttributeValue(displayAttributeIndex, value);
            }

        });
    };

    TSStatistics.Tracker.prototype.displayTravelOptionsCounter = function () {
        this.getTravelOptionsCounter(function (counter) {

            //console.log("display  travel by Counter ", counter);
            window.dc = counter;

            var keys = counter.getAllKeys();
            for (var i = 0; i < keys.length; i++) {
                var tbo = LH.Search.TravelByOptions;

                var displayAttributeIndex = tbo.getDisplayAttributeValueBy(keys[i]);
                var value = counter.get(keys[i]).Nr;

                tbo.setDisplayAttributeValue(displayAttributeIndex, value);
            }

        });

        
    }

    TSStatistics.Tracker.prototype.getWarOptionsCounter = function (callback) {
        var self = this;
        this.GetTSOptionsCollection(function (err, tsOptions) {
            if (err) {
                console.error(err);
            }
            if (!tsOptions) {
                console.error("Error, could not get tsOptions in GetTSOptionsCollection");
                return;
            }

            var counter = new TSStatistics.Collections.NameCounter();

            var webCodes = _hod.getAvailableTourWebCodes();

            //Namespace
            var tbModule = LH.Search.WarOptions;

            //get options to count //like "any", "luxuria", ...
            var allWarOptionsKeys = tbModule.getWarOptionsKeys();

            //handle name mismatches if any

            var backEndData = _hod.getToursOptionsBy(tsOptions, webCodes, undefined, undefined, undefined, allWarOptionsKeys);
            if (!backEndData) return;

            //fill counter
            //on each webCode ("backenddata")
            for (var i = 0; i < backEndData.length; i++) {
                // this counter restarts on each webCode, so it can help to count an option once / webCode
                // otherwise we would count departure dates not webcodes by options
                var counterHelper = new TSStatistics.Collections.NameCounter();

                window.testWarBe = backEndData;
                var j = 0;
                for (var prop in backEndData[i].BattlefieldInfo) {
                    var wars = backEndData[i].BattlefieldInfo;

                    for (var k = 0; k < allWarOptionsKeys.length; k++) {
                        if (allWarOptionsKeys[k] === "AllWars") {
                        }
                        else if (allWarOptionsKeys[k] === "Anniversaries") {
                            if (backEndData[i].BattlefieldInfo.Anniversary === true) {
                                if (counterHelper.get(allWarOptionsKeys[k]).Nr == 0) {
                                    counter.add(allWarOptionsKeys[k]);
                                    counterHelper.add(allWarOptionsKeys[k]);
                                }
                            }
                        }
                        else if (allWarOptionsKeys[k] === "OtherWars") {
                            if (backEndData[i].BattlefieldInfo.Other === true) {
                                if (counterHelper.get(allWarOptionsKeys[k]).Nr == 0) {
                                    counter.add(allWarOptionsKeys[k]);
                                    counterHelper.add(allWarOptionsKeys[k]);
                                }
                            }
                        }
                        else if (allWarOptionsKeys[k] === "WalkingTheBattlefields") {
                            if (backEndData[i].BattlefieldInfo.WalkingBattlefield === true) {
                                if (counterHelper.get(allWarOptionsKeys[k]).Nr == 0) {
                                    counter.add(allWarOptionsKeys[k]);
                                    counterHelper.add(allWarOptionsKeys[k]);
                                }
                            }
                        }
                        else {
                            if (wars[allWarOptionsKeys[k]] === true) {
                                if (counterHelper.get(allWarOptionsKeys[k]).Nr == 0) {
                                    counter.add(allWarOptionsKeys[k]);
                                    counterHelper.add(allWarOptionsKeys[k]);
                                }

                            }
                        }
                    }
                    j++;
                }

            }

            //console.log("ALL WAR COUNTER  ---> ", counter.getAll());
            callback(counter);

        });
    }

    TSStatistics.Tracker.prototype.getTourTypeOptionsCounter = function (callback) {
        var self = this;
        this.GetTSOptionsCollection(function (err, tsOptions) {
            if (err) {
                console.error(err);
            }
            if (!tsOptions) {
                console.error("Error, could not get tsOptions in GetTSOptionsCollection");
                return;
            }

            var counter = new TSStatistics.Collections.NameCounter();

            var webCodes = _hod.getAvailableTourWebCodes();

            //console.log("tour type options counter webCodes ", webCodes);

            //Namespace
            var tbModule = LH.Search.TourTypeOptions;

            //get options to count //like "any", "luxuria", ...
            var allTourTypeKeys = tbModule.getTourTypeOptionsKeys();

            //console.log("tour type options counter allTourTypeKeys ", allTourTypeKeys);

            //var selectedTourTypeKeys = tbModule.getSelectedTourTypeOptionsKeys();

            //Change to the custom name
            //CMS has incosistant naming conventions so that is why.
            var specialOffersIndex = allTourTypeKeys.indexOf("EbsoAvailable");
            if (specialOffersIndex !== -1) allTourTypeKeys[specialOffersIndex] = "SpecialOffer";
            var singleRoomSaverIndex = allTourTypeKeys.indexOf("SingleRooms");
            if (singleRoomSaverIndex !== -1) allTourTypeKeys[singleRoomSaverIndex] = "SingleRoomSaver";

            //console.log({
            //    msg: "tour type options counter backEndData parameters",
            //    tsOptions: tsOptions,
            //    webCodes: webCodes,
            //    allTourTypeKeys: allTourTypeKeys
            //});
            var backEndData = _hod.getToursOptionsBy(tsOptions, webCodes, undefined, undefined, allTourTypeKeys);
            if (!backEndData) return;
            

            //console.log("tour type options counter backEndData ", backEndData);
            //window.dbed = backEndData;

            //fill counter
            //on each webCode ("backenddata")
            for (var i = 0; i < backEndData.length; i++) {
                // this counter restarts on each webCode, so it can help to count an option once / webCode
                // otherwise we would count departure dates not webcodes by options
                var counterHelper = new TSStatistics.Collections.NameCounter();

                for (var j = 0; j < backEndData[i].Departures.length; j++) {
                    var departure = backEndData[i].Departures[j];

                    for (var k = 0; k < allTourTypeKeys.length; k++) {
                        if (allTourTypeKeys[k] === "NewTours") {
                            if (backEndData[i].NewTour === true) {
                                if (counterHelper.get(allTourTypeKeys[k]).Nr == 0) {
                                    counter.add(allTourTypeKeys[k]);
                                    counterHelper.add(allTourTypeKeys[k]);
                                }
                            }
                        } else {
                            if (departure[allTourTypeKeys[k]] === true) {
                                if (counterHelper.get(allTourTypeKeys[k]).Nr == 0) {
                                    counter.add(allTourTypeKeys[k]);
                                    counterHelper.add(allTourTypeKeys[k]);
                                }

                            }
                        }
                    }
                }

            }

            callback(counter);
        });

    }

    TSStatistics.Tracker.prototype.getTravelOptionsCounter = function (callback) {
        var self = this;
        // Luxuria
        // Silver Service
        // Executive
        // Fly
        this.GetTSOptionsCollection(function (err, tsOptions) {
            if (err) {
                console.error(err);
            }
            if (!tsOptions) {
                console.error("Error, could not get tsOptions in GetTSOptionsCollection");
                return;
            }

            var counter = new TSStatistics.Collections.NameCounter();
            // have to get <tour id,traveloption> key value pairs
            // on distinct tour ids from Cache
            // by each travel option based on selected date
            // and by available departure dates


            var webCodes = _hod.getAvailableTourWebCodes();

            //Namespace
            var tbModule = LH.Search.TravelByOptions;

            //get options to count //like "any", "luxuria", ...
            var allTravelByKeys = tbModule.getTravelByOptionsKeys();
            
            var selectedTravelByKeys = tbModule.getSelectedTravelByOptionsKeys();
            

            //Change to the custom name
            //CMS has incosistant naming conventions so that is why.
            var airPlaneIndex = selectedTravelByKeys.indexOf("AirPlane");
            if (airPlaneIndex !== -1) selectedTravelByKeys[airPlaneIndex] = "Flight";
            airPlaneIndex = allTravelByKeys.indexOf("AirPlane");
            if (airPlaneIndex !== -1) allTravelByKeys[airPlaneIndex] = "Flight";
            
            var backEndData = _hod.getToursOptionsBy(tsOptions, webCodes, undefined, allTravelByKeys);
            if (!backEndData) return;


            //on each webCode ("backenddata")
            for (var i = 0; i < backEndData.length; i++) {
                // this counter restarts on each webCode, so it can help to count an option once / webCode
                // otherwise we would count departure dates not webcodes by options
                var counterHelper = new TSStatistics.Collections.NameCounter();
                
                for (var j = 0; j < backEndData[i].Departures.length; j++) {
                    var departure = backEndData[i].Departures[j];

                    for (var k = 0; k < allTravelByKeys.length; k++) {
                        if (departure[allTravelByKeys[k]] === true) {
                            if (counterHelper.get(allTravelByKeys[k]).Nr == 0) {
                                counter.add(allTravelByKeys[k]);
                                counterHelper.add(allTravelByKeys[k]);
                            }
                            
                        }
                    }
                }

            }

            callback(counter);
        });
        
    }

    /**
     * @description Gets A NameCounter instance holding all counted durations from screen by the visible tours on UI.
     * 
     * @returns {TSStatistics.Collections.NameCounter instance} A NameCounter holding all counted durations from screen.
     */
    TSStatistics.Tracker.prototype.getToursDurationsCounter = function (callback) {

        this.GetTSOptionsCollection(function (err, tsOptions) {

            if (err) {
                console.error(err);
                callback(err, tourCounterByDuration);
                return;
            }

            // get an array of visible webcodes
            // it comes when a request was made to the server so just catch that array
            var webCodes = _hod.getAvailableTourWebCodes();

            //var durations = _hod.getToursDurationsBy(tsOptions, webCodes);
            //var logText = "CALLING getToursDurationsBy FROM TSStatistics.Tracker.prototype.getToursDurationsCounter";
            //console.log(logText);
            var durationsDistinct = _hod.getToursDurationsBy(tsOptions, webCodes, true, logText);
            //console.log("durations when distinct -> ",durationsDistinct.length, durationsDistinct);
            //console.log("all durations on screen -> ", durations.length, durations);

            // count the durations
            var tourCounterByDuration = _hod.getToursNameCounterBy(tsOptions, webCodes, durationsDistinct);

            callback(tourCounterByDuration);
        });
        
    }

    /**
     * @description Gets an array of price values by the visible tours on UI.
     * 
     * @returns {[]:int} An array of duration values
     */
    TSStatistics.Tracker.prototype.getPrices = function () {
        console.warn("Not implemented");
    }

    
    /**
     * @description Finds all TourExperiences and the occurances of each on the visible Tours
     * 
     * @returns {TSStatistics.Collections.NameCounter instance}
     */
    TSStatistics.Tracker.prototype.countTourExperiences = function () {

        var counter = new TSStatistics.Collections.NameCounter();

        var expIdsOnToursRaw = TourExperiences.getExperienceCodesFromVisibleTourBoxes();

        for (var i = 0; i < expIdsOnToursRaw.length; i++) {
            var experiences = expIdsOnToursRaw[i].experiences;
            for (var j = 0; j < experiences.length; j++) {
                counter.add(experiences[j]);
            }
        }

        return counter;
    }

    



})();
