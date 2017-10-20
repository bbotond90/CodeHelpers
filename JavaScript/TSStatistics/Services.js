
; (function () {
    //use the global object if it is there
    var TSStatistics = window.TSStatistics || {};
    TSStatistics.Services = TSStatistics.Services || {};
    TSStatistics.Services.AJAX = TSStatistics.Services.AJAX || {};
    TSStatistics.Services.Helpers = TSStatistics.Services.Helpers || {};
    /**
     * @requires ToursDateSelector from \Scripts\App\ToursAppsCommon\DateSelector_DropDownWithTabs.js
     * @requires Moment.js
     */
    TSStatistics.Services.Helpers.OptionsData = TSStatistics.Services.Helpers.OptionsData || {};

    var _ajax = TSStatistics.Services.AJAX;
    // optiondata helper functions
    var _hod = TSStatistics.Services.Helpers.OptionsData;

    /**
     * @description Sends an Ajax request to the server to get a fresh result and returns
     * an object that has the same webCode. You then can call a callBack function on that object
     * 
     * @param {string} webCode
     * @param {string} destinationName 
     * @param {function(data)} callback callback function 
     */
    _hod.getOptionByWebCode = function (webCode, destinationName, callback) {
        _ajax.GetOptionsData(destinationName).success(function (data) {
            var o;

            for (var i = 0; i < data.length; i++) {
                if (data[i].WebCode == webCode) {
                    o = data[i];
                    break;
                }
            }

            callback(o);
        });
    }

    /**
     * @static
     * @param {string} destinationName _tsqm.DestinationName by default (if it is undefined).
     * Change it to null or empty string if you want to empty it.
     * 
     * If _tsqm.DestinationName is null then it will get an empty request, returning no result.
     * 
     * @returns {}
     */
    _ajax.GetOptionsData = function (destinationName) {

        if (destinationName === undefined || destinationName === null) {

            if (_tsqm && _tsqm.DestinationName) {
                destinationName = _tsqm.DestinationName;
            }
            else {
                destinationName = null;
            }

        }

        return $.get("/toursapp/GetDataForTSStatisticsJS", {
            destinationname: destinationName
        });

    }

    /**
     * @requires TSStatistics.Collections.NameCounter
     * 
     * @description Returns a TSStatistics.Collections.NameCounter instance
     *  with the counted webcodes 
     * It is using the UI's selected departure dates automatocally.
     * 
     * @param {[]:Backends.TourSearchData} optionsObject Collection to work on
     * @param {[]:string} onWebCodes Webcodes that we are interested in
     * @param {[]:int} onDurations Durations we are interested in
     * 
     * @returns {TSStatistics.Collections.NameCounter instance}
     */
    _hod.getToursNameCounterBy = function (optionsObject, onWebCodes, onDurations) {

        var counter = new TSStatistics.Collections.NameCounter();

        // using UI dates
        var options = _hod.getToursOptionsBy(optionsObject, onWebCodes, onDurations);

        options.forEach(function (e, index) {
            //used to check if a day is already added or not
            // because we want to count every day once by each Tour
            var pushedDaysCache = [];
            for (var i = 0; i < e.DeparturesKeys.length; i++) {

                var departure = e.Departures[e.DeparturesKeys[i]];

                if (onDurations.indexOf(departure.Duration) !== -1) {

                    // if it is added already, skip it
                    if (pushedDaysCache.indexOf(departure.Duration) === -1) {

                        pushedDaysCache.push(departure.Duration);
                        counter.add(departure.Duration);
                    }

                }

            }

        });

        return counter;
    }

    /**
     * @static
     * @description Gets an array of duration value by a given array of tour webcodes
     * It also checks what is available on the visible tours, restricted by all the
     * search filters.
     * It is using the UI's selected departure dates
     * 
     * @param {[]:Backends.TourSearchData} optionsObject Collection to work on
     * @param {[]:string} onWebCodes Webcodes that we are interested in
     * @param {bool} distinct If true, then the returned array will contain every
     * duration value once. If it is false or not defined it will repeat all 
     * durations as many times as it appears on screen so you can count it if you need.
     * 
     * @returns {[]:int}
     */
    _hod.getToursDurationsBy = function (optionsObject, onWebCodes, distinct, callerName) {

        //this feature is delayed in advance of travelByOptions
        //not finished and not tested yet
        
        return;

        // fixed no value for key exception
        // BUT: Comments are here if it would have any problems while
        // the project as a whole is not tested
        // The bug comes from TSStatistics.Tracker.prototype.getToursDurationsCounter

        //console.log("getToursDurationsBy CALLER MSG :", !!callerName ? callerName : "CALLER IS NOT SPECIFIED");

        if (distinct !== true) distinct = false;

        var durations = [];

        var options = _hod.getToursOptionsBy(optionsObject, onWebCodes);
        var result = options.forEach(function (e, i) {
            var parent = e;
            e.DeparturesKeys.forEach(function (key, j) {
                if (parent.Departures[key] === undefined) {
                    departureLog = {
                        msg: "",
                        key: key,
                        paramWebCodes: onWebCodes,
                        paramOptionsObject: optionsObject,
                        calculatedOptions: options,
                        departures: parent.Departures,
                        optionsIndex: i,
                        parentObject: parent,
                        parentDeparturesKeysIndex: j

                    };
                    departureLog.msg = "No value was assigned to key";
                    console.error(departureLog);

                }
                else {
                    //departureLog = {
                    //    msg: "Everything is OK here:",
                    //    key: key,
                    //    paramWebCodes: onWebCodes,
                    //    paramOptionsObject: optionsObject,
                    //    calculatedOptions: options,
                    //    departures: parent.Departures,
                    //    optionsIndex: i,
                    //    parentObject: parent,
                    //    parentDeparturesKeysIndex: j

                    //};
                    //console.log(departureLog);
                }

                var value = parent.Departures[key].Duration;
                if (!distinct || durations.indexOf(value) == -1)
                    durations.push(value);

            });
        });

        // for testing only now.
        return durations;
    };

    /**
     * @static
     * @description Selects only the relevant options by the visible tours.
     * It is using the UI's selected departure dates.
     * 
     * @requires ToursDateSelector from \Scripts\App\ToursAppsCommon\DateSelector_DropDownWithTabs.js
     * @requires Moment.js
     * 
     * @param {[]:Backends.TourSearchData} optionsObject
     * @param {[]:string} onWebCodes
     * 
     * @returns {[]:Backends.TourSearchData}
     */
    _hod.getToursOptionsBy = function (optionsObject, onWebCodes, onDurations, onTravelByOptions, onTourTypeOptions, onWarOptions) {

        if (!optionsObject || !onWebCodes) {
            console.warn("optionsObject and onWebCodes parameters required.");
            return;
        }

        var result = [];
        var selectedMomentDateRange = undefined;

        if (!ToursDateSelector.IsDatesOnDefault()) {
            selectedMomentDateRange = ToursDateSelector.getActiveDateRange();
            //console.warn("selectedMomentDateRange " + selectedMomentDateRange);
        }
        result = optionsObject.map(function (e, i) {
            // if it is a webcode we need
            var isWebCodePresent = onWebCodes.indexOf(e.WebCode) != -1;

            if (isWebCodePresent) {

                var departures = [];
                //filter by date on all dates (keys are dates in string format)
                for (var j = 0; j < e.Departures.length; j++) {

                    var value;

                    value = e.Departures[j];

                    // if there is a selected date we have to check for conditions
                    // so it is false at the beginning or true otherwhise.
                    //if it is true it means it is ok to have the values in the final selection.
                    var dateRangeCondition = !!selectedMomentDateRange ? false : true;


                    // if there is a custom daterange we have
                    // to take care about,
                    if (selectedMomentDateRange) {
                        var keyMoment = moment(e.Departures[j].DepartureDate);
                        var isBetween = keyMoment.isBetween(
                        selectedMomentDateRange[0],
                        selectedMomentDateRange[1]);                        

                        if (isBetween) {

                            // it is passed
                            dateRangeCondition = true;

                            // END OF SELECTED MONTH RANGE FILTER
                        }

                    }

                    // mustbe in daterange
                    var durationCondition = (
                            //not required to check by durations
                            !onDurations

                            //or if it is in the durations array
                            || onDurations.indexOf(value.Duration) !== -1);

                    // OR relations
                    var tourTypeOptionsCondition = true;

                    //if we have to match some condition 
                    if (!!onTourTypeOptions) {

                        //console.log({
                        //    "onTourTypeOptions": onTourTypeOptions
                        //});

                        //if "AllTOurs" is not present check for options
                        if (onTourTypeOptions.indexOf("AllTours") == -1) {

                            tourTypeOptionsCondition = false;

                            //we have to check if all match
                            //except if "Any" is in the list
                            for (var tIndex = 0; tIndex < onTourTypeOptions.length; tIndex++) {
                                //same like with "Luxuria", etc:
                                //travelByOptionsCondition = value["Luxuria"] === true
                                if (value[onTourTypeOptions[tIndex]] === undefined) {
                                    console.error(onTourTypeOptions[tIndex], "option is not in the cache object's option");
                                } else {
                                    var isNewTour = onTourTypeOptions[tIndex] === "NewTours";
                                    var isOptionOKHere = false;

                                    if (isNewTour) {
                                        isOptionOKHere = e.NewTour === true;
                                    } else {
                                        isOptionOKHere = value[onTourTypeOptions[tIndex]] === true;
                                    }
                                    
                                    // OR relation for travel by options is applied here
                                    tourTypeOptionsCondition = tourTypeOptionsCondition || isOptionOKHere;

                                }

                                //if any of the options are true
                                //no reason to continue to check
                                if (tourTypeOptionsCondition) {
                                    break;
                                }
                            }
                        } else { //if selected option is "Any"
                            tourTypeOptionsCondition = true;
                        }

                    }

                    // OR relations
                    var travelByOptionsCondition = true;

                    //if we have to match some condition 
                    if (!!onTravelByOptions) {
                        //if "Any" is not present check for options
                        if (onTravelByOptions.indexOf("Any") == -1) {
                            travelByOptionsCondition = false;

                            //we have to check if all match
                            //except if "Any" is in the list
                            for (var tIndex = 0; tIndex < onTravelByOptions.length; tIndex++) {
                                //same like with "Luxuria", etc:
                                //travelByOptionsCondition = value["Luxuria"] === true
                                if (value[onTravelByOptions[tIndex]] === undefined) {
                                    console.error(onTravelByOptions[tIndex], "option is not in the cache object's option");
                                } else {
                                    var isOptionOKHere = value[onTravelByOptions[tIndex]] === true;
                                    // OR relation for travel by options is applied here
                                    travelByOptionsCondition = travelByOptionsCondition || isOptionOKHere;

                                }                                

                                //if any of the options are true
                                //no reason to continue to check
                                if (travelByOptionsCondition) {
                                    break;
                                }
                            }
                        } else { //if selected option is "Any"
                            travelByOptionsCondition = true;
                        }

                    }

                    var warOptionsCondition = true;
                    if(!!onWarOptions){
                        if (onWarOptions.indexOf("AllWars") == -1) {
                            warOptionsCondition = false;

                            for (var wIndex = 0; wIndex < onWarOptions.length; wIndex++) {
                                if (value[onTravelByOptions[wIndex]] === undefined) {
                                    console.error(onTravelByOptions[wIndex], "option is not in the cache object's option");
                                } else {
                                    var isOptionOKHere = value[onTravelByOptions[wIndex]] === true;
                                    // OR relation for travel by options is applied here
                                    warOptionsCondition = warOptionsCondition || isOptionOKHere;

                                }

                                //if any of the options are true
                                //no reason to continue to check
                                if (warOptionsCondition) {
                                    break;
                                }
                            }
                        }
                    } else { //if selected option is "Any"
                        warOptionsCondition = true;
                    }
                    

                    if (dateRangeCondition && durationCondition && travelByOptionsCondition
                        && tourTypeOptionsCondition && warOptionsCondition) {

                        // save the result
                        departures.push(value);
                    }

                    //end of for loop
                }

                
                // Create a hard copy of e and replace its values.
                // cannot use e directly because it is a reference type
                // and changes the original object.
                // I had a few hours of challenge because of that ":/
                var resultObj = jQuery.extend(true, {}, e);

                resultObj.Departures = departures;


                return resultObj;
            }
                // if it is a tour webcode that we are not interested in
                // just return undefined
            else {
                return;
            }

        }).filter(function (e) {
            return e !== undefined;
        });

        //console.log("FINAL RESULT ----> ", result);

        return result;
    };

    /**
     * @static
     * @requires LH.Search.VisibleTourCodes
     * 
     * @returns {LH.Search.VisibleTourCodes} Probably of type []:string
     */
    _hod.getAvailableTourWebCodes = function () {
        return LH.Search.VisibleTourCodes;
    }

    // make the changes global
    window.TSStatistics = TSStatistics;
})();

