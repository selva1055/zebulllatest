import { Component, OnInit } from '@angular/core';
import { Promise } from '../chartiq/js/thirdparty/promise.min';
import { Template } from '../chartiq/js/thirdparty/@webcomponents/template';
import { Customelements } from '../chartiq/js/thirdparty/@webcomponents/custom-elements.min';
import { Nativeshim } from '../chartiq/js/thirdparty/@webcomponents/native-shim';
import { Html2canvas } from '../chartiq/js/thirdparty/html2canvas';
import { Perfectscrollbar } from '../chartiq/js/thirdparty/perfect-scrollbar.jquery';
import { CIQ } from '../chartiq/js/chartiq';
import { AddOns } from '../chartiq/js/addOns';
import { QuoteFeedSimulator } from '../chartiq/examples/feeds/quoteFeedSimulator';
import { SymbolLookupChartIQ } from '../chartiq/examples/feeds/symbolLookupChartIQ';
import { MarkersSample } from '../chartiq/examples/markers/markersSample';
import { TradeAnalyticsSample } from '../chartiq/examples/markers/tradeAnalyticsSample';
import { MarketDefinitionsSample } from '../chartiq/examples/markets/marketDefinitionsSample';
import { MarketSymbologySample } from '../chartiq/examples/markets/marketSymbologySample';
import { TranslationSample } from '../chartiq/examples/translations/translationSample';
import { ComponentUI } from '../chartiq/js/componentUI';
import { Components } from '../chartiq/js/components';
import { Sampletemplate } from '../chartiq/examples/templates/js/sample-template';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { Router } from '@angular/router';
import { SharedataserviceService } from '../services/sharedataservice.service';

declare const createChart: any;
declare var UIContext: any;
// declare const stxx : any;
@Component({
  selector: 'app-iqchart',
  templateUrl: './iqchart.component.html',
  styleUrls: ['./iqchart.component.scss']
})
export class IqchartComponent implements OnInit {
  ciq: any;
  high : number = 0;
  low : number = 0;
  close : number = 0;
  open : number = 0;
  _tickopen : any;
	_tickclose : any;
	_tickhigh : any;
  _ticklow : any;
  _tickvolume : any;

  _tickopen_sf : any;
	_tickclose_sf : any;
	_tickhigh_sf : any;
	_ticklow_sf : any;
  _tickvolume_sf : any;
  
  _prev_resolution: any;
  _trade_time : any;
  _last_time: any;
  constructor(private service: ZebuodrGentrService,
    public sharedata:SharedataserviceService,
    private routerTo:Router) {
     
  } 

  ngOnInit() {
    if(this.routerTo.url === "/iqchart"){
      document.getElementById("customheight").style.height = "100%";
    }else{
      document.getElementById("customheight").style.height = "60%";
    }
    createChart();
    this.getFeedLiveChartData();
  }

  goToFullPage(){
    window.open('https://zebull.in/#/iqchart' , '_blank');
    //window.open('http://localhost:4200/#/iqchart' , '_blank');
  }


  getFeedLiveChartData(){
    this.sharedata.indexTickDataObservable.subscribe((res)=>{
      var tickdata = res;
      var chartIQSymbol = JSON.parse(localStorage.getItem("_feed_symbol_store"));
      var mwticker = chartIQSymbol['symbol'].split("|")[1];
      var indexticker = chartIQSymbol['symbolid'];
      var resolution = chartIQSymbol['oi'];
      for(let tik in tickdata){
        if (tickdata[tik]['name'] == 'sf') {
        	if (tickdata[tik]['ltt'] != undefined && tickdata[tik]['ltt'] != 'NA' &&
        		tickdata[tik]['tk'] != undefined && tickdata[tik]['tk'] != 'NA' && tickdata[tik]['tk'] == mwticker) {
              const _isPrevious_sf = tickdata[tik]['op'] != undefined;
              if(_isPrevious_sf){
                this._tickopen_sf = Number(tickdata[tik]['op']);
                this._tickclose_sf = Number(tickdata[tik]['c']);
                this._tickhigh_sf = Number(tickdata[tik]['h']);
                this._ticklow_sf = Number(tickdata[tik]['lo']);
                this._tickvolume_sf = Number(tickdata[tik]['v']);
              }
              let tempDate = tickdata[tik]['ltt'].split(" ");
              const [day, month, year] = tempDate[0].split("/");
              var date = new Date(month + "/" + day + "/" + year + " " + tempDate[1]);
              var _current_ms : any = date.getTime();
              
              // If change call one time resolutions
              if(resolution != this._prev_resolution || this._prev_resolution == undefined){
                var _last_bar_data = JSON.parse(localStorage.getItem("_last_trade_time"));  
                this._last_time = new Date(_last_bar_data['DT']).getTime() + (resolution * 60000);
                this._prev_resolution = resolution;
              }

              if(this._last_time <= _current_ms){
                this._trade_time = this._last_time;
                this._last_time = _current_ms + (resolution * 60000);
              }

              var bardata : any;
              if(resolution == '1D'){
                if(_current_ms != undefined){
                  bardata = {
                    DT : _current_ms,
                    Open : this._tickopen_sf,
                    High : this._tickhigh_sf,
                    Low : this._ticklow_sf,
                    Close : Number(tickdata[tik]['ltp']),
                    Volume : this._tickvolume_sf
                  } 
                }
              }else{
                if(this._trade_time != undefined){
                  bardata = {
                    DT : this.formatDate(this._trade_time),
                    Open : Number(tickdata[tik]['ltp']),
                    High : Number(tickdata[tik]['ltp']),
                    Low : Number(tickdata[tik]['ltp']),
                    Close : Number(tickdata[tik]['ltp']),
                    Volume : Number(tickdata[tik]['ltp'])
                  } 
                }
              }
            if(bardata != undefined || bardata != null){
              localStorage.setItem("_feed_bar_data",JSON.stringify(bardata));
            }
        }
      }else if(tickdata[tik]['name'] == 'if'){
        if (tickdata[tik]['tvalue'] != undefined && tickdata[tik]['tvalue'] != 'NA' && tickdata[tik]['tk'] != undefined && tickdata[tik]['tk'] != 'NA' && tickdata[tik]['tk'].toUpperCase() == indexticker) {
          const _isPrevious = tickdata[tik]['iov'] != undefined;
          if(_isPrevious){
            this._tickopen = tickdata[tik]['iov'];
            this._tickclose = tickdata[tik]['ic'];
            this._tickhigh = tickdata[tik]['ihv'];
            this._ticklow = tickdata[tik]['ilv'];
            this._tickvolume = tickdata[tik]['iv'];
          }

          var _current_ms : any = new Date(tickdata[tik]['tvalue']).getTime();
        
          // If change call one time resolutions
          if(resolution != this._prev_resolution || this._prev_resolution == undefined){
            var _last_bar_data = JSON.parse(localStorage.getItem("_last_trade_time"));  
            this._last_time = new Date(_last_bar_data['DT']).getTime() + (resolution * 60000);
            this._prev_resolution = resolution;
          }
          // console.log(new Date(this._last_time), new Date(_current_ms))
          if(this._last_time <= _current_ms){
            this._trade_time = this._last_time;
            this._last_time = _current_ms + (resolution * 60000);
          }

          var bardata : any;
          if(resolution == '1D'){
            if(tickdata[tik]['tvalue'] != undefined){
            bardata = {
                DT : tickdata[tik]['tvalue'],
                Open : this._tickopen,
                High : this._tickhigh,
                Low : this._ticklow,
                Close : Number(tickdata[tik]['iv']),
                Volume : this._tickvolume
              } 
            }
          }else{
            if(this._trade_time != undefined){
              bardata = {
                DT : this.formatDate(this._trade_time),
                Open : Number(tickdata[tik]['iv']),
                High : Number(tickdata[tik]['iv']),
                Low : Number(tickdata[tik]['iv']),
                Close : Number(tickdata[tik]['iv']),
                Volume : Number(tickdata[tik]['iv'])
              } 
            }
          }
          if(bardata != undefined || bardata != null){
            localStorage.setItem("_feed_bar_data",JSON.stringify(bardata));
          }
        }
      }
		}
    });
  }

  formatDate(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
      year = d.getFullYear();
    
      var t = new Date(date),
			hours = '' + (t.getHours()),
			minuts = '' + t.getMinutes();
      // seconds = t.getSeconds();

      if (month.length < 2) 
        month = '0' + month;
      if (day.length < 2) 
        day = '0' + day;

      if (hours.length < 2) 
      hours = '0' + hours;
      if (minuts.length < 2) 
      minuts = '0' + minuts;
    
    var setdate = [year, month, day].join('-'); 
    var settime = [hours,minuts].join(':'); 
		return setdate + " " + settime;
	}
}
