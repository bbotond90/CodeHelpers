/// <reference path="../Collections/NameCounter.js" />
/// <reference path="../Models.js" />
/// <reference path="../TSStatistics.js" />
var TrackerTest = TrackerTest || {};
var OptionsDataHelper = OptionsDataHelper || {};

var s = setTimeout(function () {

    (TrackerTest.GetExperienceIds = function () {
        console.log("TrackerTest.GetExperienceIds");

        var tracker = new TSStatistics.Tracker();
        var experienceCount = tracker.countTourExperiences();
        console.log("experienceCount = ", experienceCount);
    })();


    var AJAXServicesTest = AJAXServicesTest || {};

    (AJAXServicesTest.GetOptionsDataInItaly = function () {
        console.log("AJAXServicesTest.GetOptionsDataInItaly");

        var data = TSStatistics.Services.AJAX.GetOptionsData("italy");
        console.log("data in handrequested italy: ", data);
    })();




    

    (OptionsDataHelper.GetTourDurations = function () {


        var _hod = TSStatistics.Services.Helpers.OptionsData;

        var tracker = new TSStatistics.Tracker();
        var durations = tracker.getToursDurationsCounter().getAll();

        var counter = new TSStatistics.Collections.NameCounter();
        durations.forEach(function (e, i) {
            counter.add(e);
        });

        // make sure the tracker had enough time to get the data we need.
        setTimeout(function () {
            console.log("OptionsDataHelper.GetTourDurations");
            console.log(durations);
            console.log(counter.getAll());
            if (_hod.getAvailableTourWebCodes().length > 0) {
                console.log("Durations.length is > 0 ", !!durations && durations.length > 0);
            }
            else {
                console.log("Durations.length is = 0 ", !!durations && durations.length == 0);
            }
        },2000);

        

    })();

}, 3000);





