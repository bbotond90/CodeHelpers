/// <reference path="../Collections/NameCounter.js" />
/// <reference path="../Models.js" />
/// <reference path="../TSStatistics.js" />
var NameCounterTest = NameCounterTest || {};

(NameCounterTest.getAll = function () {
    console.log("NameCounterTest.getAll");
    var t = new TSStatistics.Collections.NameCounter();
    t.add("hello");
    t.add("hello");
    t.add("bello");

    var NameCounterObjects = t.getAll();

    console.log("NameCounter length expected ", 2, ", ", NameCounterObjects.length == 2);
    console.log("NameCaounterObjects = ", NameCounterObjects);
})();

(NameCounterTest.get = function () {
    console.log("NameCounterTest.get");
    var t = new TSStatistics.Collections.NameCounter();
    t.add("hello");
    t.add("hello");
    t.add("bello");

    var hello = t.get("hello");
    var bello = t.get("bello");
    console.log("Should contain 2 hello, ", hello.Nr == 2, ",actual ", hello.Nr);
    console.log("Should contain 1 bello, ", bello.Nr == 1, ",actual ", bello.Nr);
})();

(NameCounterTest.addMultiple = function () {
    console.log("NameCounterTest.addMultiple");

    var t = new TSStatistics.Collections.NameCounter();
    t.add("hello", 2);
    t.add("hello", 4);
    t.add("bello", 3);

    var hello = t.get("hello");
    var bello = t.get("bello");
    console.log("Should contain 6 hello, ", hello.Nr == 6, ",actual ", hello.Nr);
    console.log("Should contain 3 bello, ", bello.Nr == 3, ",actual ", bello.Nr);
    
})();

(NameCounterTest.removeMultiple = function () {
    console.log("NameCounterTest.removeMultiple");

    var t = new TSStatistics.Collections.NameCounter();
    t.add("hello", 6);
    t.add("bello", 3);
    t.remove("hello", 3);
    t.remove("bello", 2);

    var hello = t.get("hello");
    var bello = t.get("bello");
    console.log("Should contain 3 hello, ", hello.Nr == 3, ",actual ", hello.Nr);
    console.log("Should contain 1 bello, ", bello.Nr == 1, ",actual ", bello.Nr);

})();

(NameCounterTest.getNonExistingObject = function () {
    console.log("NameCounterTest.getNonExistingObject");

    var t = new TSStatistics.Collections.NameCounter();
    var hello = t.get("hello");

    console.log("Should contain 0 hello, ", hello.Nr == 0, ",actual ", hello.Nr);

})();

(NameCounterTest.removeMoreThenWhatWeHad = function () {
    console.log("NameCounterTest.removeMoreThenWhatWeHad");

    var t = new TSStatistics.Collections.NameCounter();
    t.add("hello", 3);
    t.remove("hello", 6);
    var hello = t.get("hello");

    console.log("Should contain 0 hello, ", hello.Nr == 0, ",actual ", hello.Nr);

})();

(NameCounterTest.removeNonExistingObject = function () {
    console.log("NameCounterTest.removeNonExistingObject");

    var t = new TSStatistics.Collections.NameCounter();
    t.remove("hello", 6);
    var hello = t.get("hello");

    console.log("Should contain 0 hello, ", hello.Nr == 0, ",actual ", hello.Nr);

})();