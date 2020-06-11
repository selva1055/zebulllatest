// Copyright 2014-2018 by ChartIQ, Inc.
//
// Sample markers file
// This file contains functions which create sample markers.  There is a stylesheet which goes along with it as well.
// Usage: new MarkersSample(stxx);
//

(function (definition) {
    "use strict";

	if (typeof exports === "object" && typeof module === "object") {
		module.exports = definition(require('chartiq/js/chartiq'));
	} else if (typeof define === "function" && define.amd) {
		define(['chartiq/js/chartiq'], definition);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global);
	} else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for markersSample.js.");
	}

})(function(_exports){
	var CIQ=_exports.CIQ;

	var MarkersSample = function(stx){
		this.stx=stx;
	};

	MarkersSample.prototype.createMarkers=function(label, markerType){
		if(label==='abstract') return this.createAbstractMarker("helicopter");
		var stx=this.stx, l=stx.masterData.length;
		// An example of a data array to drive the marker creation
		var data=[];
		if(!markerType) markerType="Simple";
		if(l>=5) data.push({x:stx.masterData[l-5].DT, type:label, category:"news", headline:"This is a Marker for a News Item"});
		if(l>=15) data.push({x:stx.masterData[l-15].DT, type:label, category:"earningsUp", headline:"This is a Marker for Earnings (+)"});
		if(l>=25) data.push({x:stx.masterData[l-25].DT, type:label, category:"earningsDown", headline:"This is a Marker for Earnings (-)"});
		if(l>=35) data.push({x:stx.masterData[l-35].DT, type:label, category:"dividend", headline:"This is a Marker for Dividends"});
		if(l>=45) data.push({x:stx.masterData[l-45].DT, type:label, category:"filing", headline:"This is a Marker for a Filing"});
		if(l>=55) data.push({x:stx.masterData[l-55].DT, type:label, category:"split", headline:"This is a Marker for a Split"});

		var story="Like all ChartIQ markers, the object itself is managed by the chart, so when you scroll the chart the object moves with you. It is also destroyed automatically for you when the symbol is changed.";

		// Loop through the data and create markers
		for(var i=0;i<data.length;i++){
			var datum=data[i];
			datum.story=story;
			new CIQ.Marker({
				stx:stx,
				label:label,
				xPositioner:"date",
				x: datum.x,
				node: new CIQ.Marker[markerType](datum)
			});
		}
	};

	MarkersSample.prototype.createAbstractMarker=function(abstractType){
		var stx=this.stx;
		var abstract=$(".stx-marker.abstract", ".stx-marker-templates").clone();
		abstract.css({"z-index":"30","left":(0.4*stx.chart.width).toString()+"px"});
		new CIQ.Marker({
			stx: stx,
			xPositioner:"none",
			yPositioner:"above_candle",
			label: abstractType,
			permanent: true,
			chartContainer: true,
			node: abstract[0]
		});
	};

	MarkersSample.prototype.hideMarkers=function(){
		var stx=this.stx;
		CIQ.Marker.removeByLabel(stx, "circle");
		CIQ.Marker.removeByLabel(stx, "square");
		CIQ.Marker.removeByLabel(stx, "callout");
		CIQ.Marker.removeByLabel(stx, "helicopter");
	};

	MarkersSample.prototype.showMarkers=function(type, renderType){
		// Remove any existing markers
		this.hideMarkers();

		if (type) this.createMarkers(type, renderType);

		this.stx.draw();
	};

	_exports.MarkersSample = MarkersSample;

	return _exports;

});
