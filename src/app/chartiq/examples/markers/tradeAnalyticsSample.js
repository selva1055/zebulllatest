// Copyright 2014-2019 by ChartIQ, Inc.
//
// Sample trade analytics with markers
// This file contains functions which create a sample implementation of post trade anaysis using markers.  This file is meant to be used in conjuction with the markersSample.js file by extending the functionality of MarkersSample. There is a stylesheet which goes along with it as well.
// Usage: new MarkersSample(stxx);
//
(function (definition) {
	"use strict";

	if (typeof exports === "object" && typeof module === "object") {
		module.exports = definition(require('chartiq/js/chartiq'), require('chartiq/examples/markers/markersSample'));
	} else if (typeof define === "function" && define.amd) {
		define(['chartiq/js/chartiq', 'chartiq/examples/markers/markersSample'], definition);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global);
	} else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for tradeAnalyticsSample.js.");
	}

})(function(_exports){
	const CIQ=_exports.CIQ;
	const MarkersSample=_exports.MarkersSample;

	MarkersSample.prototype.showMarkers=function(type, renderType){
		// Remove any existing markers
		CIQ.Marker.removeByLabel(this.stx, "trade");
		this.hideMarkers();

		if(type==='trade') this.showTradeAnalytics();
		else if (type) this.createMarkers(type, renderType);

		this.stx.draw();
	};

	MarkersSample.prototype.showTradeAnalytics=function(){
		var dataSegment = this.stx.chart.dataSegment;

		var beginTrade = new CIQ.Marker({
				stx:this.stx,
				label:"callout",
				xPositioner:"date",
				x: dataSegment[10].DT,
				node: new CIQ.Marker.Simple({
					type: "callout",
					headline: "Begin Trade Period",
					category: "analysis",
					story: "Starting Price: "+dataSegment[10].Close+"\n\
							Shares: 5000\n\
							Exchange: "+this.stx.chart.market.market_def.name
				})
			});
		var endTrade = new CIQ.Marker({
				stx:this.stx,
				label:"callout",
				xPositioner:"date",
				x: dataSegment[dataSegment.length-2].DT,
				node: new CIQ.Marker.Simple({
					type: "callout",
					headline: "End Trade Period",
					category:"analysis",
					story: "Ending Price: "+dataSegment[dataSegment.length-2].Close+"\n\
						Shares: 5000\n\
						Exchange: "+this.stx.chart.market.market_def.name
				})
			});

		this.createTradeMarkers(this.stx);
	};

	MarkersSample.prototype.createTradeMarkers=function() {
		var dataSegment = this.stx.chart.dataSegment;
		var story="Like all ChartIQ markers, the object itself is managed by the chart, so when you scroll the chart the object moves with you. It is also destroyed automatically for you when the symbol is changed.";
		for (var i=dataSegment.length-3; i>10;i=i-2) {
			var qt = dataSegment[i];
			new CIQ.Marker({
				stx: this.stx,
				label: "trade",
				xPositioner: "date",
				x: qt.DT,
				node: new CIQ.Marker.Performance({
					type: "circle",
					category:"trade",
					displayCategory:false,
					// displayStem: false,
					headline: "Executed at $"+qt.Close,
					story: story
				})
			});
		}
	};

	return _exports;
});
