////////////////////////////////////////////////////////////////////////////////////////////
//
// ChartIQ Study Calculator Module Example
// Demonstrates running ChartIQ Studies within Node.js
// To run: 'NODE_PATH=[path/to/license/root] node detailedExample.js' from the current directory
// If chartiq is installed as a package in node_modules, then setting NODE_PATH is not necessary
//
////////////////////////////////////////////////////////////////////////////////////////////

// Dependencies

// Require your chartiq charting license here (license should not be domain locked)
var ciq = require('chartiq/js/chartiq');
// Optionally require a market definition (for those studies that use it)
require('chartiq/examples/markets/marketDefinitionsSample');
// Require the StudyCalculator
var StudyCalculator = require('./study-calculator');

//Load example data, extract json part, and parse
var sampledata = require("chartiq/examples/data/STX_SAMPLE_5MIN.js");

for(var bar=0;bar<sampledata.length;bar++){
	var record=sampledata[bar];
	record.DT = new Date(record.Date);
	record.SPY=record.Close+Math.random()-0.5;  // For comparison studies
}

// Instantiate a StudyCalculator instance
var studyCalculator = new StudyCalculator(ciq.CIQ, {interval:5, symbolObject:{symbol:"IBM"}});

// Add Studies to fetch into the calculator, here we fetch 'em all with default inputs
// except for correlation which requires input
for(var libraryEntry in ciq.CIQ.Studies.studyLibrary){
	var inputs=null;
	if(libraryEntry=="correl") inputs={"Compare To":"SPY", "Period":14};
	studyCalculator.addStudy(libraryEntry, inputs);
}

// Simulate calculating studies upon receiving data 25 bars at a time
var RECORDS_TO_FETCH=25;
for(var lastIndex=0; lastIndex<sampledata.length; lastIndex+=RECORDS_TO_FETCH){
	var newlyFetchedRecords=sampledata.slice(lastIndex,lastIndex+RECORDS_TO_FETCH);
	studyCalculator.addData(newlyFetchedRecords);
	studyCalculator.calculate();
	// output the errors to the console
	/*
	var errors=studyCalculator.getErrors();
	for(var e in errors) console.log(errors[e]);
	*/
}

// Output calculation results to console.
var TEST_RESULT_RECORD=500;  // let's output the 500th record of the results
var results=studyCalculator.getResults(TEST_RESULT_RECORD);
for(var f in results) console.log(f+":"+results[f]);


