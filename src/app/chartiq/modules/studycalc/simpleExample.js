////////////////////////////////////////////////////////////////////////////////////////////
//
// ChartIQ Study Calculator Module Example
// Demonstrates running ChartIQ Studies within Node.js
// To run: 'NODE_PATH=[path/to/license/root] node simpleExample.js' from the current directory
// If chartiq is installed as a package in node_modules, then setting NODE_PATH is not necessary
//
////////////////////////////////////////////////////////////////////////////////////////////

const ciq = require('chartiq/js/chartiq').CIQ;
const StudyCalculator = require('./study-calculator');

const sampledata = [
	{"DT":new Date("2015-04-16 16:00"),"Close":152.11},	{"DT":new Date("2015-04-17 09:30"),"Close":151.79},
	{"DT":new Date("2015-04-17 09:35"),"Close":151.75},	{"DT":new Date("2015-04-17 09:40"),"Close":151.84},
	{"DT":new Date("2015-04-17 09:45"),"Close":151.95},	{"DT":new Date("2015-04-17 09:50"),"Close":152.07},
	{"DT":new Date("2015-04-17 09:55"),"Close":151.91},	{"DT":new Date("2015-04-17 10:00"),"Close":151.95},
	{"DT":new Date("2015-04-17 10:05"),"Close":151.98},	{"DT":new Date("2015-04-17 10:10"),"Close":151.73},
	{"DT":new Date("2015-04-17 10:15"),"Close":151.82},	{"DT":new Date("2015-04-17 10:20"),"Close":151.75},
	{"DT":new Date("2015-04-17 10:25"),"Close":151.73},	{"DT":new Date("2015-04-17 10:30"),"Close":151.82},
	{"DT":new Date("2015-04-17 10:35"),"Close":151.84},	{"DT":new Date("2015-04-17 10:40"),"Close":151.95},
	{"DT":new Date("2015-04-17 10:45"),"Close":152.03},	{"DT":new Date("2015-04-17 10:50"),"Close":152.03}
];

const studyCalculator=new StudyCalculator(ciq, {interval:5, symbolObject:{symbol:"IBM"}});
const maHandle=studyCalculator.addStudy("ma", {Period:5});

studyCalculator.addData(sampledata);
studyCalculator.calculate();

for(let record=0;record<sampledata.length;record++){
	const results=studyCalculator.getResults(record, maHandle);
	for(let f in results) console.log(sampledata[record].DT.toISOString()+"   "+f+":  "+results[f]);
}
