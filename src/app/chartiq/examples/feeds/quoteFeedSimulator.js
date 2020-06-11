// -------------------------------------------------------------------------------------------
// Copyright 2012-2017 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------
// SAMPLE QUOTEFEED IMPLEMENTATION -- Connects charts to ChartIQ Simulator
///////////////////////////////////////////////////////////////////////////////////////////////////////////

(function (definition) {
	"use strict";

	if (typeof exports === "object" && typeof module === "object") {
		module.exports = definition();
	} else if (typeof define === "function" && define.amd) {
		define([], definition);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global);
	} else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for quoteFeedSimulator.js.");
	}
})(function(_exports){
	_exports = _exports || {};
	var quoteFeedSimulator=_exports.quoteFeedSimulator={}; // the quotefeed object
	var userid = localStorage.getItem("currentUser");
	var count = 0;
	var tempcb;
	var tickdata = 0;
	var tickinital = 0;
	setInterval(() => {
		tickdata++;
		tickinital++;
		if(tickdata > 5){
			if(tempcb){
				quoteFeedSimulator.fetchUpdateData("","","",tempcb);
			}
		}
	}, 200);

	// local, non-dependent implementation of XmlHttpRequest
	quoteFeedSimulator.postAjax=function (url, cb){
		var server=new XMLHttpRequest();
		server.open("GET", url);
		server.onload=function(){ cb(this.status, this.responseText); };
		server.onerror=function(){ cb(500); };
		server.send();
	};

	quoteFeedSimulator.maxTicks=50000;
	quoteFeedSimulator.url="https://www.zebull.in/rest/MobullService/chart/chartIQData";

	// called by chart to fetch initial data
	quoteFeedSimulator.fetchInitialData=function (symbol, suggestedStartDate, suggestedEndDate, params, cb) {
		count = 0;
		var deffDate = quoteFeedSimulator.checkEqualsDate(suggestedStartDate,suggestedEndDate);
		if(deffDate != ''){
			suggestedStartDate = deffDate;
		}
		if(localStorage.getItem("_feed_bar_data") != undefined || localStorage.getItem("_feed_bar_data") != null){
			localStorage.removeItem("_feed_bar_data");			
		}
		// Check for resolution day or minutes
		var resolution = "1D";	
		if(params['interval'] != "day"){
			resolution = params['period']
		}
		var chartSymbol = {isIndex: params.symbolObject['isCallIndex'], symbolid: symbol, oi: resolution,triggersymbol : true, symbol : params.symbolObject['exgseg'] + '|' + params.symbolObject['symbolid']};
		localStorage.setItem("_feed_symbol_store",JSON.stringify(chartSymbol));
		var queryUrl = this.url +
			"?symbol=" + +params['symbolObject']['symbolid'] +
			"&from=" + quoteFeedSimulator.formatDate(suggestedStartDate) +
			"&to=" + quoteFeedSimulator.formatDate(suggestedEndDate) +
			"&resolution=" + resolution +
			"&user=" + atob(userid) +
			"&exchange=" + params['symbolObject']['exchDisp'];   // using filter:true for after hours

		this.postAjax(queryUrl, function(status, response){
			// process the HTTP response from the datafeed
			if(status==200){ 
				// if successful response from datafeed
				var result = JSON.parse(response);
				if(result['stat'] == 'Not_Ok' && result['message'] == 'Data not found'){
					if(tickinital < 3){
						quoteFeedSimulator.nextCallBeforeDate(symbol, suggestedStartDate, suggestedEndDate, params, cb);
					}
				}else if(result['stat'] == "Ok"){
					tickinital = 0;
					var newQuotes = quoteFeedSimulator.formatChartData(result['result']);
					const finalBar = newQuotes[newQuotes.length - 1];
					localStorage.setItem("_last_trade_time",JSON.stringify(finalBar));
					cb({quotes:newQuotes, moreAvailable:true, attribution:{source:"simulator", exchange:"RANDOM"}}); // return the fetched data; init moreAvailable to enable pagination
				}
			} else { // else error response from datafeed
				cb({error:(response?response:status)});	// specify error in callback
			}
		});
	};

	// called by chart to fetch update data
	quoteFeedSimulator.fetchUpdateData=function (symbol, startDate, params, cb) {
		tempcb = cb; 
		var response = [];
		if(localStorage.getItem("_feed_bar_data") != undefined || localStorage.getItem("_feed_bar_data") != null){
			tickdata = 0;
			response.push(JSON.parse(localStorage.getItem("_feed_bar_data")));
			var newQuotes = quoteFeedSimulator.formatChartData(response);
			cb({quotes:newQuotes, attribution:{source:"simulator", exchange:"RANDOM"}}); // return the fetched data
		}
	};

	// called by chart to fetch pagination data
	quoteFeedSimulator.fetchPaginationData=function (symbol, suggestedStartDate, endDate, params, cb) {
		if(count <= 5){
			var sdate = new Date(suggestedStartDate);
			suggestedStartDate = new Date(sdate.setDate(sdate.getDate() - 2));
			var edate = new Date(endDate);
			endDate = new Date(edate.setDate(edate.getDate() - 1));
			// console.log(suggestedStartDate,endDate)
			var resolution = "1D";	
			if(params['interval'] != "day"){
				resolution = params['period']
			}
			var queryUrl = this.url +
				"?symbol=" + +params['symbolObject']['symbolid'] +
				"&from=" + quoteFeedSimulator.formatDate(suggestedStartDate) +
				"&to=" + quoteFeedSimulator.formatDate(endDate) +
				"&resolution=" + resolution +
				"&user=" + atob(userid) +
				"&exchange=" + params['symbolObject']['exchDisp'];   
			this.postAjax(queryUrl, function(status, response){
				// process the HTTP response from the datafeed
				if(status==200){ 
					// if successful response from datafeed
					var result = JSON.parse(response);
					if(result['stat'] == 'Not_Ok' && result['message'] == 'Data not found'){
						count++;
						quoteFeedSimulator.fetchPaginationData(symbol, suggestedStartDate, endDate, params, cb)
					}else 
					if(result['stat'] == "Ok"){
						count = 0;
						var newQuotes = quoteFeedSimulator.formatChartData(result['result']);
						cb({quotes:newQuotes, moreAvailable:new Date(suggestedStartDate).getTime()>0, attribution:{source:"simulator", exchange:"RANDOM"}}); // return fetched data (and set moreAvailable)
					}
				} else { 
					// else error response from datafeed
					cb({error:(response?response:status)});	// specify error in callback
				}
			});
		}
	};

	// utility function to format data for chart input; given simulator was designed to work with library, very little formatting is needed
	quoteFeedSimulator.formatChartData=function (response) {
		var feeddata=response;
		var newQuotes=[];
		for(var i=0;i<feeddata.length;i++){
			var newQuote={};
			newQuote.DT=new Date(feeddata[i].DT); // DT is a string in ISO format, make it a Date instance
			newQuote.Open=feeddata[i].Open;
			newQuote.High=feeddata[i].High;
			newQuote.Low=feeddata[i].Low;
			newQuote.Close=feeddata[i].Close;
			newQuote.Volume=feeddata[i].Volume;
			newQuotes.push(newQuote);
		}
		return newQuotes;
	};

	quoteFeedSimulator.formatDate=function(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
	
		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
	
		return [year, month, day].join('-');
	}

	quoteFeedSimulator.nextCallBeforeDate=function(symbol, suggestedStartDate, suggestedEndDate, params, cb) {
		var resolution = "1D";	
		if(params['interval'] != "day"){
			resolution = params['period']
		}
		switch(resolution){
			case '1D':
				suggestedEndDate = suggestedStartDate;
				var sdt = new Date(suggestedStartDate);
				suggestedStartDate = sdt.setDate(sdt.getDate() - 15);
				quoteFeedSimulator.fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, cb);
				break;
			case 1:
				suggestedEndDate = suggestedStartDate;
				var sdt = new Date(suggestedStartDate);
				suggestedStartDate = sdt.setDate(sdt.getDate() - 2);
				quoteFeedSimulator.fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, cb);
				break;
			case 5:
				suggestedEndDate = suggestedStartDate;
				var sdt = new Date(suggestedStartDate);
				suggestedStartDate = sdt.setDate(sdt.getDate() - 2);
				quoteFeedSimulator.fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, cb);
				break;
			case 10:
				suggestedEndDate = suggestedStartDate;
				var sdt = new Date(suggestedStartDate);
				suggestedStartDate = sdt.setDate(sdt.getDate() - 2);
				quoteFeedSimulator.fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, cb);
				break;
			case 15:
				suggestedEndDate = suggestedStartDate;
				var sdt = new Date(suggestedStartDate);
				suggestedStartDate = sdt.setDate(sdt.getDate() - 2);
				quoteFeedSimulator.fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, cb);
				break;
			case 30:
				suggestedEndDate = suggestedStartDate;
				var sdt = new Date(suggestedStartDate);
				suggestedStartDate = sdt.setDate(sdt.getDate() - 2);
				quoteFeedSimulator.fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, cb);
				break;
			case 60:
				suggestedEndDate = suggestedStartDate;
				var sdt = new Date(suggestedStartDate);
				suggestedStartDate = sdt.setDate(sdt.getDate() - 2);
				quoteFeedSimulator.fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, cb);
				break;
			default:
				break;
		}
	}

	quoteFeedSimulator.checkEqualsDate=function(sdate,edate){
		var sdate = quoteFeedSimulator.formatDate(sdate); 
		var edate = quoteFeedSimulator.formatDate(edate); 
		if(sdate == edate){
			var sdt = new Date(sdate);			
			return new Date(sdt.setDate(sdt.getDate() - 2));
		}
		return '';
	}
	
	return _exports;

});
