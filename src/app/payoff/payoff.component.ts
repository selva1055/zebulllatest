import { Component, OnInit, HostListener } from '@angular/core';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedataserviceService } from '../services/sharedataservice.service';

@Component({
  selector: 'app-payoff',
  templateUrl: './payoff.component.html',
  styleUrls: ['./payoff.component.scss']
})

// class resize{
//   @HostListener('window:resize', ['$event'])
//   sizeChange(event) {
//     console.log('size changed.', event);
//   }
// }

// export default new resize();
export class PayoffComponent implements OnInit {
  err: boolean;
  tempObj: any[];
  selectedArray: any[];
  payoffArray: any[];
  compData: any[];
  strategyLeg: any;
  strategyId: any;
  customer_id = 4;
  user_name = localStorage.getItem("userName");
  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    $("#tble_ht").css({"min-height":($("#topNav").height() + $("#topheader").height())*6.5,"height":"auto"});
    $("#optdata").css({"height":($("#tble_ht").height())-106});
    $("#third_col").css({"min-height":($("#topNav").height() + $("#topheader").height())*6.5});
    $("#slider").css({"width":$("#chartdiv").width()-77});
  }

  ex_dates_with_val: any;
  expiry_dates: any;  
  symbol: any = "NIFTY";
  selectedDate: any;
  ceUnwinding: any[];
  peUnwinding: any[];
  ceChangeInOi: any[];
  peChangeInOi: any[];
  highestCeOi: string;
  highestPeOi: string;
  ceBuildUp: any[];
  peBuildUp: any[];
  maxStrike: any;
  niftyVal: any;
  nifVal: number;
  optionChain: any;
  arr3: any[];
  scripChnl: string;
  optionChainTable: any[];
  
  constructor(public odgenserv: ZebuodrGentrService, 
    public routeTo: Router, public appComp: AppComponent, 
    private spinnerService: NgxUiLoaderService,
    public dataService :SharedataserviceService) { }

  ngOnInit() {
    this.symbolcheck();

    $("#t_note").hide();
    $("#position_div").hide();
    $("#tble_ht").css({"min-height":($("#topNav").height() + $("#topheader").height())*6.5,"height":"auto"});
    $("#optdata").css({"height":($("#tble_ht").height())-106});
    $("#third_col").css({"min-height":($("#topNav").height() + $("#topheader").height())*6.5});
    $("#slider").css({"width":$("#chartdiv").width()-77});
  }
  chngExp(opt) {
    this.selectedDate = opt;
    this.optionChainLoader();
    this.getFutureData();
    this.getPainData(); //MaxPain Value
    this.getPCRValue();//pcr value
  }

  symbolcheck(){
    this.symbol = $("input[name='symbol']:checked").val();		
    this.getOptionChainGlob();	
  }

  //global search
  getOptionChainGlob(){
    var jsonSendObj = {
      "name" : this.symbol, 
    }
    this.odgenserv.getGlobalSearch(jsonSendObj).subscribe(data =>{
      this.optionChain = data;
    	var orgData = [], orgData2 = [], options = '';
		for(var i = 0;i < this.optionChain.length; i++){
    		orgData.push({"instrument":this.optionChain[i].expiry_date+' '+this.optionChain[i].strike+' CE ',"pnl":0,"expiry_date":this.optionChain[i].expiry_date,"option_type":"CE","strike_price":this.optionChain[i].strike,"ask_price":this.optionChain[i].ce_ask_price,"ask_quantity":this.optionChain[i].ce_ask_quantity,"bid_price":this.optionChain[i].ce_bid_price,"bid_quantity":this.optionChain[i].ce_bid_quantity,"change_in_oi":this.optionChain[i].ce_change_in_oi,"delta":this.optionChain[i].ce_delta,"iv":this.optionChain[i].ce_iv,"ltp":this.optionChain[i].ce_ltp,"net_change":this.optionChain[i].ce_net_change,"oi":this.optionChain[i].ce_oi,"theta":this.optionChain[i].ce_theta,"volume":this.optionChain[i].ce_volume,"exit_price":0,"entry_price":this.optionChain[i].ce_ltp,lot_size:this.optionChain[i].lot_size,"symbol":this.optionChain[i].name});
    		orgData.push({"instrument":this.optionChain[i].expiry_date+' '+this.optionChain[i].strike+' PE ',"pnl":0,"expiry_date":this.optionChain[i].expiry_date,"option_type":"PE","strike_price":this.optionChain[i].strike,"ask_price":this.optionChain[i].pe_ask_price,"ask_quantity":this.optionChain[i].pe_ask_quantity,"bid_price":this.optionChain[i].pe_bid_price,"bid_quantity":this.optionChain[i].pe_bid_quantity,"change_in_oi":this.optionChain[i].pe_change_in_oi,"delta":this.optionChain[i].pe_delta,"iv":this.optionChain[i].pe_iv,"ltp":this.optionChain[i].pe_ltp,"net_change":this.optionChain[i].pe_net_change,"oi":this.optionChain[i].pe_oi,"theta":this.optionChain[i].pe_theta,"volume":this.optionChain[i].pe_volume,"exit_price":0,"entry_price":this.optionChain[i].pe_ltp,lot_size:this.optionChain[i].lot_size,"symbol":this.optionChain[i].name});
    		orgData2.push(this.optionChain[i].ce_ltp);
    		orgData2.push(this.optionChain[i].pe_ltp);
	    }
		for(var i = 0; i < orgData.length; i++){
			if(orgData2[i] != 0 ){
				options += '<option  value="'+orgData[i]['instrument']+'" data-ltp="'+orgData2[i]+'" data-legs="'+escape(JSON.stringify(orgData[i]))+'">'+orgData2[i]+'</option>';
				document.getElementById('radio_option').innerHTML = options; 
				document.getElementById('radio_option2').innerHTML = options; 
			}
		}

    this.loadExpiryDates();
    this.getUserStrategy();
		// getfutureGlobal();//get future for global
    })
  }
  /**
	* Loading all expiry dates
	*/
	loadExpiryDates(){
		var jsonSendObj = {
			"exch":"NFO",
			"symbol_id": this.symbol.toUpperCase(),
			"instrument":"OPTIDX"
			//Instrument = [FUTSTK, FUTIDX, FUTCUR, FUTCOM, OPTSTK, OPTCOM, OPTCUR, OPTIDX]; 
		}
		
    this.odgenserv.loadExpiryDates(jsonSendObj).subscribe(data =>{
				this.ex_dates_with_val = data;
        this.expiry_dates = [];	
        for(var i in data.LoadExp){
          this.expiry_dates.push(this.formatDateInMMM(new Date(this.ex_dates_with_val['LoadExp'][i].display))['x'])
        }
        this.selectedDate = this.expiry_dates[0];
				this.getFutureData();
				this.getPainData(); //MaxPain Value
        this.getPCRValue();//pcr value
        this.getStrikeData(); //strike data


				if(this.ex_dates_with_val['stat'] == "Ok"){
					this.optionChainLoader();
				}
		})
  }

  //optionChain loader
  optionChainLoader(){
    var ex_date = this.selectedDate, exp, eD;
		// let exp = formatDateInMMM(new Date(ex_dates_with_val['LoadExp'][1]['display']));
		console.log(ex_date);
		for(var i in this.ex_dates_with_val.LoadExp){
			if(ex_date == this.formatDateInMMM(new Date( this.ex_dates_with_val.LoadExp[i]['display']))['x']){
				exp = this.formatDateInMMM(new Date( this.ex_dates_with_val.LoadExp[i]['display']));
				eD = this.ex_dates_with_val.LoadExp[i].value;
			}
		}
    var jsonSendObj = {
      "exch": "NFO",
      "symbol_id" : this.symbol.toUpperCase(),
      "instrument" : "OPTIDX",
      "expiryDate" : eD
    };
    this.odgenserv.getOptionChainLoader(jsonSendObj).subscribe(data =>{
      var data1 = data;
      var scripCalls = data1['scripCalls']['scripscallData'];
      var scripsPuts = data1['scripsPuts']['scripsputsData'];
      this.arr3= [];
      scripCalls.forEach((itm, i) => {
        this.arr3.push(Object.assign({}, itm, scripsPuts[i]));
      });
      console.log("opt",this.arr3);
      for(var idx in this.arr3){
        this.arr3[idx]['callsstrikeprice'] = parseInt(this.arr3[idx]['callsstrikeprice'])
        this.arr3[idx]['putstrikeprice'] = parseInt(this.arr3[idx]['putstrikeprice'])
        this.arr3[idx]['strikeCall'] = this.symbol + exp['y'] + this.arr3[idx]['callsstrikeprice'] + "CE"
        this.arr3[idx]['strikePut'] = this.symbol + exp['y'] + this.arr3[idx]['putstrikeprice'] + "PE"
      }	
      if(this.arr3.length >0 ){
        this.loadScripSearch(exp);
      }
    })
  }

  loadScripSearch(exp){
    var jsonSendObj = {
			"exch": "NFO",
			"searchFor": this.symbol.toUpperCase() + exp['y'],
			"group": "XX",
    }
    this.odgenserv.getScripSearch(jsonSendObj).subscribe(data =>{
      if(data.stat == "Not_Ok"){
        this.err = false;
      }else{
        this.err = true;
        let x = data, y = [];
				for(var i in x){
					if(!x[i]['Tsym'].includes("FUT")){
						y.push(x[i]);
					}
				}
        var mwLst = [];

        y.map(item => {
          mwLst.push(item['Exchange'] + '|' + item['Symbol'])
        })
        this.scripChnl = mwLst.join("&");
        this.callSocketChain();
      }
      
    })
  }

  callSocketChain(){
    var jsonSendObj = {
      "channel": "",
      "task": "cn",
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    this.odgenserv.optionChainFeed.next(jsonSendObj);
    this.odgenserv.optionChainFeed.subscribe(msg => {
      if(msg != "[]"){
        if (JSON.parse(msg)[0]['ak'] == "ok" && JSON.parse(msg)[0]['task'] == "cn") {
          this.sendMessage();
        }else{
          let resultData = JSON.parse(msg);
          for(var idx in this.arr3){
	        	for(var indx in resultData){
	        		if(resultData[indx]['ts'] != undefined){
		        		if(resultData[indx]['ts'] == this.arr3[idx]['strikeCall']){
		        			if(resultData[indx]['bp'] != undefined){
										this.arr3[idx]['prevCallBuy'] = this.arr3[idx]['callsbestbuyprice']	        				
										this.arr3[idx]['callsbestbuyprice'] = resultData[indx]['bp']		        				
		        			}
		        			if(resultData[indx]['bq'] != undefined){
										this.arr3[idx]['callsbestbuysize'] = resultData[indx]['bq']		        				
		        			}
		        			if(resultData[indx]['sp'] != undefined){
		        				this.arr3[idx]['prevCallSell'] = this.arr3[idx]['callsbestsellprice']	 
										this.arr3[idx]['callsbestsellprice'] = resultData[indx]['sp']		        				
		        			}
		        			if(resultData[indx]['bs'] != undefined){
										this.arr3[idx]['callsbestsellsize'] = resultData[indx]['bs']		        				
		        			}
		        		}

		        		if(resultData[indx]['ts'] == this.arr3[idx]['strikePut']){
		        			if(resultData[indx]['bp'] != undefined){
		        				this.arr3[idx]['prevPutBuy'] = this.arr3[idx]['callsbestbuyprice']
										this.arr3[idx]['callsbestbuyprice'] = resultData[indx]['bp']		        				
		        			}
		        			if(resultData[indx]['bq'] != undefined){
										this.arr3[idx]['callsbestbuysize'] = resultData[indx]['bq']		        				
		        			}
		        			if(resultData[indx]['sp'] != undefined){
		        				this.arr3[idx]['prevPutSell'] = this.arr3[idx]['callsbestsellprice']
										this.arr3[idx]['callsbestsellprice'] = resultData[indx]['sp']		        				
		        			}
		        			if(resultData[indx]['bs'] != undefined){
										this.arr3[idx]['callsbestsellsize'] = resultData[indx]['bs']		        				
		        			}
		        		}	        			
	        		}
	        	}
	        }  
          this.optionChainTable = this.arr3;
          console.log(this.optionChainTable);
        }
      }
    })
  }

    /**
   * after connecting with MW sockets subscriptions to get data
   */
  sendMessage() {
    // console.log(this.mwCall+"&nse_cm|Nifty 50&bse_cm|SENSEX");
  
    var jsonSendObj = {
      "channel": this.scripChnl,
      "task": "mw",
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    this.odgenserv.optionChainFeed.next(jsonSendObj);
  }

  //User Strategies
  getUserStrategy(){
    var jsonSendObj = {
      "customer_id" : this.customer_id,
    	"symbol" : this.symbol.toUpperCase()
    }
    this.odgenserv.getStrategies(jsonSendObj).subscribe(data =>{
      console.log(data);
      $('#strategy').html("");
      for(var i in data){
        $('#strategy').append('<option id="strategy'+i+'" value="'+data[i].strategy_id +'">'+data[i].strategy_name+'</option>');
      }
      this.chngpayoff(data);
    })
  }

  chngpayoff(par){
    this.tempObj = [];
    this.selectedArray = [];
    this.payoffArray = [];
    this.compData = [];
    if(par.type == "change"){
      $('#chartdiv').show();
      $('#slider').show();
      $('#p_details').show();
      $('#aapl').hide();
      par = undefined;
    }else{
      var locpayVal = localStorage.getItem("payoffVal") == "" ? null : localStorage.getItem("payoffVal") ;
      if(locpayVal != null ){
        
        $('#chartdiv').show();
        $('#slider').show();
        $('#p_details').show();
        $('#aapl').hide();
      }else if($("#strategy").val() != null){				
        $('#chartdiv').show();
        $('#slider').show();
        $('#p_details').show();
        $('#aapl').hide();
      }else{
        $('#chartdiv').hide();
        $('#slider').hide();
        $('#p_details').hide();
        $('#aapl').show();
      }
    }
    var payVal = localStorage.getItem("payoffVal") == "" ? null : JSON.parse(localStorage.getItem("payoffVal")) ;
    if((par != undefined && payVal != null )||( par != null && payVal != null)){
      for(var i in par){
        if(payVal.strategy_name == par[i].strategy_name){
          $('#strategy').val(par[i].strategy_id);
          this.strategyId = par[i].strategy_id ;
        }else{
          $('#strategy').val(par[0].strategy_id);
          this.strategyId = par[0].strategy_id ;
        }
      }
    }else{		  
      this.strategyId = $('#strategy').val();
    }

    var data = {
        "customer_id" : this.customer_id ,
        "strategy_id" : parseInt(this.strategyId),
      };
    this.getStrategyLegs(data);
  }

  getStrategyLegs(par){
    // var jsonSendObj = {
		// 	"customer_id": 4 ,
		// 	"strategy_id": parseInt(par[0].strategy_id)
    // };
    this.odgenserv.getStrategyLegs(par).subscribe(data =>{
      console.log(data);
      this.strategyLeg = data;
      for(var i in this.strategyLeg){
        this.strategyLeg[i].entry_qty = this.strategyLeg[i].entry_qty -this.strategyLeg[i].exit_qty;
        this.payoffArray.push(this.strategyLeg[i].instrument+" "+this.strategyLeg[i].entry_price+" "+this.strategyLeg[i].entry_qty+" "+this.strategyLeg[i].iv+" "+this.strategyLeg[i].lot_size);
      }
      // diagramPay(this.payoffArray);
      this.payoffArray = [];
      this.tempObj = this.strategyLeg;
      this.payoffTable();
      // getNetCreditDebit(tempObj);
      // getCompletedPositions(tempObj);
      // totPnl(tempObj);
      // for(var i in tempObj){
      //   if(tempObj[i].entry_qty == 0){
      //     $("#position_div").show();
      //   }
      // }
      // for(idy in strategyLeg){
      //   selectedArray.push(strategyLeg[idy].symbol+" "+strategyLeg[idy].instrument);
      // }
    })
  }

  payoffTable(){
    var table1=$('#table1').DataTable( {
      // "scrollY":$("#tble_ht").height()-211,
      "scrollX":true,
        "scrollCollapse": true,
        responsive: true,
        paging: false,
        ordering: false,
        info: false,
        searching: false,
        "data": this.tempObj,
        "autoWidth": false,
        "destroy" : true,
        "createdRow": function( row, data, dataIndex){          
            if( data['entry_qty'] == 0){
                $(row).css('background','#8080801a');
            }
        },
        rowCallback: function(row, data, index){
            if(data["entry_qty"] == 0){
              $(row).find('td').css('color', 'grey');
            }
          
                if((data["net_change"]<0 && data["entry_qty"] != 0) || data["ltp"] < 0){
                  if(data["entry_qty"] == 0){
                    $(row).find('td:eq(3)').css('color', 'grey');                  		                        	
                  }else{
                    $(row).find('td:eq(3)').css('color', 'red');
                  }
                    $(row).find('td:eq(3)').css('color', 'red');
                }else if((data["net_change"]>0 && data["entry_qty"] != 0) || data["ltp"] > 0){
                  if(data["entry_qty"] == 0){
                    $(row).find('td:eq(3)').css('color', 'grey');                  		                        	
                  }else{
                    $(row).find('td:eq(3)').css('color', 'green');
                  }
                }
    
                if(data["pnl"]<0 && data["entry_qty"] != 0){
                    $(row).find('td:eq(4)').css('color', 'red');
                }else if(data["pnl"]>0 && data["entry_qty"] != 0){
                    $(row).find('td:eq(4)').css('color', 'green');
                };
    
              },
      
        columns: [
    
                { "data": "instrument","width":"10%"},
                { "data": "entry_qty"},
                { "data": "entry_price" ,render: $.fn.dataTable.render.number(',', '.', 2)},
                { "data": "ltp" ,render: $.fn.dataTable.render.number(',', '.', 2)},
                { "data": "exit_price" ,render: $.fn.dataTable.render.number(',', '.', 2)},
                { "data": "pnl" },
                { "data": "iv"},
                { "data": "delta"},
                { "data": "theta"},
                { "data": null,
              "className": "left",
              "defaultContent": '<i class="fa fa-trash" aria-hidden="true"></i>',
              "orderable": false,
              "width" : "6px"
            }
            ],
      "columnDefs": [
                {
                    "targets": [ 4 ],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [5],
                    "render": function (data, type, full) {
                      if(full.option_type == undefined){
                        data = (data * full.lot_size).toFixed(2);
                      }else{
                          data = (data * full.lot_size).toFixed(2);
                      }
                    return data;
                    }
                },
                // {
                //     "targets": [6],
                //     "render": function (data, type, full) {
                //         return (data*full.lot_size).toFixed(2);
                //     }
                // },
                {
                    "targets": [7],
                    "render": function (data, type, full) {
                      if(full.option_type == "CE"){
                        if(full.trade_type == "BUY"){
                          return (Math.abs(data)*full.lot_size).toFixed(2);
                        }else{
                          return ((Math.abs(data)*full.lot_size)*(-1)).toFixed(2);
                        }
                      }else if(full.option_type == "PE"){
                        if(full.trade_type == "BUY"){
                          return ((Math.abs(data)*full.lot_size)*(-1)).toFixed(2);
                        }else{
                          return (Math.abs(data)*full.lot_size).toFixed(2);
                        }
                      }else if(full.option_type == undefined){
                        if(full.trade_type == "BUY"){
                          return (Math.abs(data)*full.lot_size).toFixed(2);
                        }else{
                          return ((Math.abs(data)*full.lot_size)*(-1)).toFixed(2);                        			
                        }
                      }
                    }
                },
                {
                    "targets": [8],
                    "render": function (data, type, full) {
                        if(full.trade_type == "BUY"){
                           return ((Math.abs(data)*full.lot_size)*(-1)).toFixed(2);
                        }else{
                           return (Math.abs(data)*full.lot_size).toFixed(2);
                        }
                    }
                }
            ],
    
            });
    
      if(this.tempObj.length == 0 ){
        $(".dataTables_scroll").hide();
          $("#tot_details").hide();
          $("#position_div").hide();
          $("#t_note").show();
          $("#execute").hide();
      }
  }

  getFutureData(){
    var i = this.selectedDate,ex_date;
    var j = i.substring(i.length-7,i.length-4);
    for(var k in this.expiry_dates){
      if(this.expiry_dates[k].includes(j)){
        ex_date = this.expiry_dates[k];
      }
    }
    var jsonSendObj = {
    "underlying" : this.symbol,
    "expiry_date" : ex_date
    }
    this.odgenserv.getFutureData(jsonSendObj).subscribe(data =>{
      console.log(data);
      $('#future_price1').html(" "+(Number(data.last_price).toFixed(2)));
				$('#future_price').html(Number(data.last_price).toFixed(2));
				var d = data.pc_change ;
				var pcChange = (d > 0) ? "<i style='color : green'>"+d + "%" +"</i>" : "<i style='color : red'>"+d +"%"+"</i>" ;

				$('#futPC1').html("("+"  "+ pcChange + ")");

				// future_data = data;
				// future_data.entry_qty = 0;
    })
  }

  getPainData(){
    var jsonSendObj = {
      "symbol" : this.symbol,
      "expiryDate" : this.formatDate(this.selectedDate)
      }
      this.odgenserv.getPainData(jsonSendObj).subscribe(data =>{
        this.closestmaxPainData(data);
      })
  }

  closestmaxPainData(par){
    this.maxStrike = par.strike;
    var jsonSendObj = {
      "strike" : this.maxStrike,
      "symbol" : this.symbol,
      "expiry_string" : this.selectedDate
      }
    this.odgenserv.getClosestMaxPain(jsonSendObj).subscribe(data =>{
      this.calculateMaxValue(data);
    })
  }

  calculateMaxValue(raw){
    this.ceUnwinding = [];
    this.peUnwinding = [];
		this.ceChangeInOi = [];
		this.peChangeInOi = [];
		this.highestCeOi = "";
		this.highestPeOi = "";
		this.ceBuildUp = [];
    this.peBuildUp = [];
    let ceOi = [], peOi = [], ceMap = {}, peMap = {}, ceoiMap = {}, peoiMap = {}, ceMaxValue, peMaxValue;
    if (this.ceUnwinding.length <= 0 && this.peUnwinding.length <= 0) {
      var data = raw;
      for (var i = 0; i < data.length; i++) {
        var strikes = data[i].strike;
        ceOi.push(data[i].ce_oi);
        peOi.push(data[i].pe_oi);
        this.ceChangeInOi.push(data[i].ce_change_in_oi);
        ceMap[data[i].ce_change_in_oi] = strikes;
        this.peChangeInOi.push(data[i].pe_change_in_oi);
        peMap[data[i].pe_change_in_oi] = strikes;
        ceoiMap[data[i].ce_oi.toLocaleString('en-IN')] = strikes;
        peoiMap[data[i].pe_oi.toLocaleString('en-IN')] = strikes;

      }
      ceMaxValue = Math.max.apply(null, ceOi).toLocaleString('en-IN');
      peMaxValue = Math.max.apply(null, peOi).toLocaleString('en-IN');
      var sortCeChangeOi = this.ceChangeInOi.sort(this.sortNumber);
      var sortPeChangeOi = this.peChangeInOi.sort(this.sortNumber);
      this.highestCeOi = ceoiMap[ceMaxValue];
      this.highestPeOi = peoiMap[peMaxValue];
      this.ceUnwinding = [];
      this.peUnwinding = [];
      for (var i = 0; i < 2; i++) {
        if (sortCeChangeOi[i] < 0) {
          this.ceUnwinding.push(ceMap[sortCeChangeOi[i]]);
        } else {
          this.ceUnwinding.push("NA")
        }
        if (sortPeChangeOi[i] < 0) {
          this.peUnwinding.push(peMap[sortPeChangeOi[i]]);
        } else {
          this.peUnwinding.push("NA")
        }
      }
      var count = sortCeChangeOi.length;
      for (var i = 1; i < 3; i++) {
        if (sortCeChangeOi[count - i] > 0) {
          this.ceBuildUp.push(ceMap[sortCeChangeOi[count - i]]);
        } else {
          this.ceBuildUp.push("NA")
        }
        if (sortPeChangeOi[count - i] > 0) {
          this.peBuildUp.push(peMap[sortPeChangeOi[count - i]]);
        } else {
          this.peBuildUp.push("NA")
        }
      }
      this.setValues(this.maxStrike,this.ceUnwinding, this.peUnwinding, this.highestCeOi, this.highestPeOi,
          this.ceBuildUp, this.peBuildUp);
    }
  }

  // Function to set Values for maxstrike ,HighestUnderLyingCE, HighestUnderLyingPE, highestCeOi,highestPeOi
  setValues(maxstrike,ceUnwinding, peUnwinding, highestCeOi, highestPeOi,ceBuildUp, peBuildUp){
    $('#_maxpain').html(maxstrike);
    $('#_peUnwinding').html(peUnwinding[0]+", "+peUnwinding[1]);
    $('#_ceUnwinding').html(ceUnwinding[0]+", "+ceUnwinding[1]);
    $('#_highestCeOi').html(highestCeOi);
    $('#_highestPeOi').html(highestPeOi);
    $('#_ceBuildUp').html(ceBuildUp[0]+", "+ceBuildUp[1]);
    $('#_peBuildUp').html(peBuildUp[0]+", "+peBuildUp[1]);
  }

  //get PCR
  getPCRValue(){
    var jsonSendObj = {
      "symbol" : this.symbol,
       "expiry_string" : this.selectedDate
      }
    this.odgenserv.getPCR(jsonSendObj).subscribe(data =>{
      $("#_pcrVal").html(data);
    })
  }

   //get Strike
   getStrikeData(){
    var jsonSendObj = {
      "symbol" : this.symbol,
       "expiry_string" : this.selectedDate
      }
    this.odgenserv.getStrikeData().subscribe(data =>{
      console.log(data);
      var indexLTP = 1;
			if (this.symbol.toUpperCase() == 'BANKNIFTY' || this.symbol.toUpperCase() == 'Banknifty (M)') {			
				indexLTP = 4;
				
				this.niftyVal =  data.data[indexLTP].lastPrice;
				var pch = data.data[indexLTP].pChange;
				var sch = pch + '%' ;
				var chStr = (pch > 0) ? "<i style='color : green'>"+sch+"</i>" : "<i style='color : red'>"+sch+"</i>" ;
				
				var niff = data.data[indexLTP].lastPrice.replace(/\,/g,"");
				this.nifVal = Math.round(niff/100)*100;
				$('#_pchnge').html("("+chStr+")");
				$('#_nifteeVal').html(niff);
				$('#chgnif').html("BANKNIFTY");
			}else{

				
				this.niftyVal =  data.data[indexLTP].lastPrice;
				var pch = data.data[indexLTP].pChange;
				var sch = pch + '%';
				var chStr = (pch > 0) ? "<i style='color : green'>"+sch+"</i>" : "<i style='color : red'>"+sch+"</i>"  
				var niff = data.data[indexLTP].lastPrice.replace(/\,/g,"");
				this.nifVal = Math.round(niff/100)*100;
				
				$('#chgnif').html("NIFTY");
				$('#_nifteeVal').html(niff);
				$('#_pchnge').html("("+chStr+")");
			}
    })
  }


  //Format Date in DD MMM YYYY
  formatDateInMMM(date) {
  var monthNames = ["JAN","FEB","MAR",
	                  "APR","MAY","JUN",
	                  "JUL","AUG","SEP",
	                  "OCT","NOV","DEC"];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var x, y, z;
  x = day + '' + monthNames[monthIndex] + '' + year;//for yyyy
  y = day + '' + monthNames[monthIndex] + '' + year.toLocaleString().slice(-2);//for yy
  z = year.toLocaleString().slice(-2) + monthNames[monthIndex];//for scrip search
  return {x,y,z}; 
}

  //Function to format date in (yyyy-mm-dd);
  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  //sort number
  sortNumber(a, b) {
    return a - b;
  }

  logOutUser(){
    localStorage.removeItem("sessionId");
    localStorage.removeItem("custId");
    localStorage.removeItem("userName");
    window.open("index.html","_self");
  }
  
  // if($(window).width() == 320){
  //   $("#tble_ht").css({"min-height":($("#topNav").height() + $("#topheader").height())*5,"height":"auto"});
  //   $("#optdata").css({"height":($("#tble_ht").height())-106});
  //   $("#third_col").css({"min-height":($("#topNav").height() + $("#topheader").height())*5});
  // }
  
  // if($(window).width() == 768){
  //   $("#tble_ht").css({"min-height":($("#topNav").height() + $("#topheader").height())*7,"height":"auto"});
  //   $("#optdata").css({"height":($("#tble_ht").height())-106});
  //   $("#third_col").css({"min-height":($("#topNav").height() + $("#topheader").height())*6.5});
  // }
}
