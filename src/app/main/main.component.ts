import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedataserviceService } from '../services/sharedataservice.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AfterViewInit, ElementRef } from '@angular/core';
import * as alertify from 'alertifyjs'
import 'rxjs/add/operator/map';
import { ChartingLibraryWidgetOptions, IChartingLibraryWidget, widget } from 'src/assets/charting_library/charting_library.min';
import { ZebuodrGentrService } from 'src/app/services/zebuodr-gentr.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Datafeed } from 'src/app/chart/datafeed';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material';
import { OrderhistorydialogComponent } from '../orderhistorydialog/orderhistorydialog.component';
import { CancelOrderDialogComponent } from '../cancel-order-dialog/cancel-order-dialog.component';
import { ConversionDialogComponent } from '../conversion-dialog/conversion-dialog.component';
import { CancelExitAllComponent } from '../cancel-exit-all/cancel-exit-all.component';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  private _symbol: ChartingLibraryWidgetOptions['symbol'] = 'NIFTY 50::NSE::Index';
  private _interval: ChartingLibraryWidgetOptions['interval'] = 'D';
  // BEWARE: no trailing slash is expected in feed URL
  private _datafeedUrl = ZebuodrGentrService.chartURL;
  private _libraryPath: ChartingLibraryWidgetOptions['library_path'] = '/assets/charting_library/';
  private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
  private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
  private _containerId: ChartingLibraryWidgetOptions['container_id'] = 'tv_chart_container';
  private _tvWidget: IChartingLibraryWidget | null = null;
  tValue: any;
  router: any;
  private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = 'https://saveload.tradingview.com';

  @Input()
  set symbol(symbol: ChartingLibraryWidgetOptions['symbol']) {
    this._symbol = symbol || this._symbol;
  }

  @Input()
  set intervalChart(interval1: ChartingLibraryWidgetOptions['interval']) {
    this._interval = interval1 || this._interval;
  }

  @Input()
  set datafeedUrl(datafeedUrl: string) {
    this._datafeedUrl = datafeedUrl || this._datafeedUrl;
  }

  @Input()
  set libraryPath(libraryPath: ChartingLibraryWidgetOptions['library_path']) {
    this._libraryPath = libraryPath || this._libraryPath;
  }

  @Input()
  set fullscreen(fullscreen: ChartingLibraryWidgetOptions['fullscreen']) {
    this._fullscreen = fullscreen || this._fullscreen;
  }

  @Input()
  set autosize(autosize: ChartingLibraryWidgetOptions['autosize']) {
    this._autosize = autosize || this._autosize;
  }

  @Input()
  set containerId(containerId: ChartingLibraryWidgetOptions['container_id']) {
    this._containerId = containerId || this._containerId;
  }
  months: any = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  mktload: boolean;
  holdingvisible: boolean = false;
  holdingvisiblemsg: boolean = false;
  positionsvisible: boolean = false;
  positionsvisiblemsg: boolean = false;
  fundvisible: boolean = false;
  fundvisiblemsg: boolean = false;
  ordervisible: boolean = false;
  ordervisiblemsg: boolean = false;
  holdingtotalvalue: number;
  totalvalue: any;
  position: any = [];
  holdings: any;
  orders: any = [];
  completedOrder: any = [];
  openOrder: any = [];
  funds: any = [];
  exchanges: any = [];
  sortingsegment: any = ['NSE', 'BSE', 'MCX', 'NFO', 'CDS'];
  defaultsegment: boolean = true;
  showList: boolean;
  chnl: any;
  scpt: any = [];
  mwCallpos: any;
  chnlHold: any;
  ticktime: any = 0;
  counter: number = 0;
  reconnection: any = 0;
  reconnmsg: any = 0;
  autosell : any = 0;
  autobuy : any = 0;
  defaultchart: any = 'tradeview';
  constructor(public odgenserv: ZebuodrGentrService,
    public routeTo: Router, public appComp: AppComponent,
    private spinnerService: NgxUiLoaderService,
    public dataService: SharedataserviceService,
    public websocket: WebsocketService,
    public toastr: ToastrManager,
    public dialog: MatDialog,
    public odrServ: ZebuodrGentrService) {
    this.getPositions();
    this.getOrders();
    this.getHoldings();
    this.getFunds();
    this.callSocketConnMW();
    this.exchanges = this.odgenserv.getUserSettingDto()['exch'];
    this.sortingsegment.map(res => {
      this.exchanges.map(resp => {
        if (res == resp && this.defaultsegment) {
          switch (resp) {
            case 'NSE':
              this.defaultsegment = false;
              this._symbol = "NIFTY 50::NSE::Index";
              break;
            case 'BSE':
              this.defaultsegment = false;
              this._symbol = "NIFTY 50::NSE::Index";
              break;
            case 'NFO':
              this.defaultsegment = false;
              this._symbol = "NIFTY 50::NSE::Index";
              break;
            case 'MCX':
              this.defaultsegment = false;
              this._symbol = "NIFTY 50::NSE::Index";
              break;
            case 'CDS':
              this.defaultsegment = false;
              this._symbol = "NIFTY 50::NSE::Index";
              break;
            default:
              break;
          }
        }
      });
    });
    // this.dataService.autoTrigger.subscribe((res:Boolean)=>{
    //   if(res){
    //     console.log("auto position")
    //     this.getPositions();
    //     this.getOrders();
    //   }
    // });
    this.dataService.ordersMsgShare.subscribe(res => {
      if (res) {
        console.log("auto position")
        this.getPositions();
        this.getOrders();
        // this.getHoldings();
        this.getFunds();
      }
    });
    if(localStorage.getItem("defaultchart") != undefined || localStorage.getItem("defaultchart") != null){
      this.defaultchart = localStorage.getItem("defaultchart");
    }else{
      localStorage.setItem("defaultchart",this.defaultchart);
    }
  }

  ngOnInit() {
      if (localStorage.getItem("temp_position") != null || localStorage.getItem("temp_position") != undefined) {
      this.position = JSON.parse(localStorage.getItem("temp_position"));
      if (this.position.length == 0) {
        this.positionsvisible = false;
        this.positionsvisiblemsg = true;
      } else {
        this.positionsvisible = true;
        this.positionsvisiblemsg = false;
      }
    }
    if (localStorage.getItem("temp_orders") != null || localStorage.getItem("temp_orders") != undefined) {
      this.orders = JSON.parse(localStorage.getItem("temp_orders"));
      if (this.orders.length == 0) {
        this.ordervisible = false;
        this.ordervisiblemsg = true;
      } else {
        this.ordervisible = true;
        this.ordervisiblemsg = false;
      }
    }
    if (localStorage.getItem("temp_funds") != null || localStorage.getItem("temp_funds") != undefined) {
      this.funds = JSON.parse(localStorage.getItem("temp_funds"));
      if (Array.isArray(this.funds)) {
        this.fundvisible = false;
        this.fundvisiblemsg = false;
      } else {
        this.fundvisible = true;
        this.fundvisiblemsg = false;
      }
    }
    if (localStorage.getItem("temp_holding") != null || localStorage.getItem("temp_holding") != undefined) {
      this.holdings = JSON.parse(localStorage.getItem("temp_holding"));
      if (this.holdings.length == 0) {
        this.holdingvisible = false;
        this.holdingvisiblemsg = true;
      } else {
        this.holdingvisible = true;
        this.holdingvisiblemsg = false;
      }
      this.holdings.map(item => {
        if (item['ExchSeg1'] == 'NSE') {
          item['NsetsymTemp'] = item['Nsetsym'].toString().replace("-EQ", "");
        }
      });
    }
    this.renderChart();
  }

  loadChart(val) {
    let exchange = val['Exchange'];
    if (exchange.toLowerCase() === 'mcx'
      || exchange.toLowerCase() === 'cds'
      || exchange.toLowerCase() === 'nfo') {
      this._symbol = val['TradSym'] + "::" + val['Exchange'];
    } else {
      this._symbol = val['symbolname'] + "::" + val['Exchange'];
    }
    this.renderChart();
  }

  /**
   * @method Method to set trading view chart
   * @params na
   * @return na
   * @author selva 
   * @on 26-06-2019
   */
  renderChart() {
    if (localStorage.getItem("indexGraph") != null || localStorage.getItem("indexGraph") != undefined) {
      this._symbol = localStorage.getItem("indexGraph");
      localStorage.removeItem("indexGraph")
    }
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: this._symbol,
      datafeed: new Datafeed(this._datafeedUrl, 10000, this.odgenserv, this.websocket),
      interval: this._interval,
      container_id: this._containerId,
      library_path: this._libraryPath,
      locale: 'en',
      fullscreen: this._fullscreen,
      autosize: this._autosize,
      disabled_features: ['timezone_menu', 'left_toolbar', 'timeframes_toolbar', 'header_compare', 'header_symbol_search'],
      charts_storage_url: this._chartsStorageUrl
    };
    console.log(widgetOptions)
    const tvWidget = new widget(widgetOptions);
    this._tvWidget = tvWidget;
    tvWidget.onChartReady(() => {
    });
  }

  getPositions() {
    var getusrOdrs = {
      "ret": 'NET',
      "userSettingDto": this.odgenserv.getUserSettingDto(),
      "userId": this.odgenserv.getUserId()
    };
    this.odgenserv.positionAndHolding(getusrOdrs).subscribe(data => {
      if (data.emsg == "Session Expired") {
        this.websocket.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (Array.isArray(data)) {
        this.autosell = 0;
        this.autobuy = 0;
        this.positionsvisible = true;
        this.positionsvisiblemsg = false;
        data.map(item => {
          if (item['Instname'] == 'OPTIDX' || item['Instname'] == 'OPTSTK' || item['Instname'] == 'OPTFUT' || item['Instname'] == 'OPTCUR') {
            let strike = item.Stikeprc.split('.')[1] > 0 ? item.Stikeprc : item.Stikeprc.split('.')[0];
            item['instrumentOptidx'] = item.Symbol + ' ' + new Date(item.Expdate).getDate() + this.months[new Date(item.Expdate).getMonth()] + ' ' + strike + ' ' + item.Opttype;
          }
          if (item['Instname'] != undefined || item['Instname'] != null) {
            if (item['Instname'].startsWith('FUT')) {
              item['instrumentFut'] = item.Symbol + ' ' + new Date(item.Expdate).getDate() + this.months[new Date(item.Expdate).getMonth()] + ' FUT';
            }
          }
        });
        data.sort((a, b) => (a['Netqty'] == 0) ? 1 : -1);
        this.position = data;
        if (this.position.length == 0) {
          this.positionsvisiblemsg = true;
          this.positionsvisible = false;
        } else {
          this.positionsvisiblemsg = false;
          this.positionsvisible = true;
        }
        var scrip: any = [];
        this.position.map(item => {
          scrip.push(item['Exchangeseg'] + '|' + item['Token']);
        })
        this.mwCallpos = scrip.join('&');
        // this.appComp._isPositionCall = scrip.join('&');
        this.appComp._isMWCall = scrip.join('&');
        localStorage.setItem("temp_position", JSON.stringify(this.position));
      } else if (data.stat == 'Not_Ok' && data.emsg == 'No Data' || data.stat == null || data.emsg == null || data.stat == undefined || data.emsg == undefined) {
        this.positionsvisible = false;
        this.positionsvisiblemsg = true;
        this.position = [];
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.websocket.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  /**Method to fetch holdings from server and render in UI **/
  getHoldings() {
    var getusrOdrs = {
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken(),
      "userSettingDto": this.odgenserv.getUserSettingDto()
    };
    var scrip = [];
    this.odgenserv.holding(getusrOdrs).subscribe(data => {
      if (Array.isArray(data['HoldingVal'])) {
        this.getCloseingValuesFromService(data['HoldingVal']);
      } else {
        this.holdingvisible = false;
        this.holdingvisiblemsg = true;
      }
      if (data.emsg == 'Session Expired') {
        // this.appComp.hideHeaderDetails();
        this.websocket.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (data.stat == 'Ok') {
        this.holdingvisible = true;
        this.holdingvisiblemsg = false;
        let total = data.Totalval;
        this.holdingtotalvalue = total.TotalNSEHoldingValue;
        this.holdings = data.HoldingVal;
        this.holdings.map(item => {
          if (item['ExchSeg1'] == 'NSE') {
            item['NsetsymTemp'] = item['Nsetsym'].toString().replace("-EQ", "");
            item['avgprice'] = "00.0";
            item['MTM'] = "0.00";
            scrip.push(item['Exch1'] + '|' + item['Token1']);
          }
          if (item['ExchSeg1'] == null && item['ExchSeg2'] == 'BSE') {
            item['avgprice'] = "00.0";
            item['MTM'] = "0.00";
            scrip.push(item['Exch2'] + '|' + item['Token2']);
          }
        });
        this.chnlHold = scrip.join("&");
        // this.appComp._isHoldingCall = scrip.join("&");
        this.appComp._isMWCall = scrip.join("&");
        localStorage.setItem("temp_holding", JSON.stringify(this.holdings));
      } else if (data['stat'] == 'Not_Ok' && data['Emsg'] == 'No Data' || data.stat == null || data.Emsg == null || data.stat == undefined || data.Emsg == undefined) {
        this.holdingvisible = false;
        this.holdingvisiblemsg = true;
        this.holdings = [];
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        this.websocket.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  /**Method to fetch orders from server and render in UI **/
  getOrders() {
    var jsonObj = {
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken(),
      "userSettingDto": this.odgenserv.getUserSettingDto()
    }
    this.odgenserv.ordersBook(jsonObj).subscribe(resp => {
      if (resp.emsg == "Session Expired") {
        // this.appComp.hideHeaderDetails();
        this.websocket.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (Array.isArray(resp)) {
        this.autosell = 0;
        this.autobuy = 0;
        this.ordervisible = true;
        this.ordervisiblemsg = false;
        resp.map(item => {
          if (item['InstName'] == 'OPTIDX' || item['InstName'] == 'OPTSTK' || item['InstName'] == 'OPTFUT' || item['InstName'] == 'OPTCUR') {
            let strike = item['strikePrice'].split('.')[1] > 0 ? item['strikePrice'] : item['strikePrice'].split('.')[0];
            item['instrumentOptidx'] = item['Sym'] + ' ' + new Date(item['ExpDate']).getDate() + this.months[new Date(item['ExpDate']).getMonth()] + ' ' + strike + ' ' + item['optionType'];
          }
          if (item['InstName'] != undefined || item['InstName'] != null) {
            if (item['InstName'].startsWith('FUT')) {
              item['instrumentFut'] = item['Sym'] + ' ' + new Date(item['ExpDate']).getDate() + this.months[new Date(item['ExpDate']).getMonth()] + ' FUT';
            }
          }
        });
        this.orders = resp;
        if (this.orders.length == 0) {
          this.ordervisible = false;
          this.ordervisiblemsg = true;
        } else {
          this.ordervisible = true;
          this.ordervisiblemsg = false;
        }
        this.orders.map(item => {
          this.scpt.push(item['Exseg'] + '|' + item['token']);
        })
        this.chnl = this.scpt.join("&");
        // this.appComp._isOrderCall = this.scpt.join("&");
        this.appComp._isMWCall = this.scpt.join("&");
        localStorage.setItem("temp_orders", JSON.stringify(this.orders));
        this.spinnerService.stop();
      } else if (resp.stat == 'Not_Ok' && resp.emsg == 'No Data' || resp.stat == null || resp.emsg == null || resp.stat == undefined || resp.emsg == undefined) {
        this.ordervisible = false;
        this.ordervisiblemsg = true;
        this.holdings = [];
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        this.websocket.close();
        this.odgenserv.unAuth(err);
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  /** If any Changes to Orderlist, To Referch Posintion, Fund and holding Function  **/
  // referchReferenceList() {
  //   console.log("call positions")
  //   this.getPositions();
  //   this.getFunds();
  //   this.getHoldings();
  // }

  /** It Fatch the Holding object form table, put the object value to app.compount **/
  goToHoldingAdd(object: any) {
    this.appComp.addAndExitHoldingMWList('buy', object, 'mktwatch');
  }

  /** It Fatch the Holding object form table, put the object value to app.compount **/
  goToHoldingExit(object: any) {
    this.appComp.addAndExitHoldingMWList('sell', object, 'mktwatch');
  }

  /** It Fatch the position object form table, put the object value to app.compount **/
  goToPositionAdd(object: any) {
    if (object.Netqty > 0) {
      this.appComp.AddPositionMWList('buy', object, 'mktwatch');
    } else {
      this.appComp.AddPositionMWList('sell', object, 'mktwatch');
    }
  }

  /** It Fatch the position object form table, put the object value to app.compount **/
  goToPositionExit(object: any) {
    if (object.Netqty > 0) {
      this.appComp.AddPositionMWList('sell', object, 'mktwatch');
    } else {
      this.appComp.AddPositionMWList('buy', object, 'mktwatch');
    }
  }

  convertPosition(param) {
    const dialogRef = this.dialog.open(ConversionDialogComponent, {
      width: '400px',
      data: { Data: param },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPositions();
      }
    });
  }

  /**Method to fetch funds **/
  getFunds() {
    var getusrOdrs = {
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken(),
      "userSettingDto": this.odgenserv.getUserSettingDto()
    };
    this.odgenserv.fund(getusrOdrs).subscribe(data => {
      this.spinnerService.stop();
      if (data.length != undefined) {
        for(let item in data){
        if (data[item]['stat'] == "Ok" && data[item]['segment'] == "ALL") {
          this.fundvisible = true;
          this.fundvisiblemsg = false;
          this.appComp.getFunds([data[item]]);
          localStorage.setItem("Fundsequity", JSON.stringify(data[item]));
          this.funds = [];
          this.funds.push(data[item]);
          localStorage.setItem("temp_funds", JSON.stringify(this.funds));
        } 
        if (data[item]['stat'] == 'Not_Ok' && data[item]['emsg'] == "Session Expired" && data[item]['segment'] == "ALL") {
          this.fundvisible = false;
          this.fundvisiblemsg = true;
          this.websocket.close();
          this.funds = [];
          this.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        } else if (data[item]['stat'] == 'Not_Ok') {
          this.fundvisible = false;
          this.fundvisiblemsg = true;
        } else if (data[item]['emsg'] == "Session Expired") {
          this.fundvisible = true;
          this.fundvisiblemsg = true;
          this.websocket.close();
          this.funds = [];
          this.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        }
      }
      } else {
        if (data['stat'] == 'Not_Ok') {
          this.fundvisible = false;
          this.fundvisiblemsg = true;
          // return;
        }
        if (data['emsg'] == "Session Expired") {
          // this.appComp.hideHeaderDetails();
          this.websocket.close();
          this.funds = [];
          this.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        }
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.websocket.close();
        // this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  /* Order Cancelation to server */
  orderCancel(object) {
    var jsonData = {
      "userId": this.odgenserv.getUserId(),
      "nestOrderNumber": object.Nstordno,
      "trading_symbol": object.Trsym,
      "exch": object.Exchange,
      "userSessionID": this.odgenserv.getSessionToken(),
      "userSettingDto": this.odgenserv.getUserSettingDto()
    };
    this.odgenserv.cancelOrder(jsonData).subscribe(data => {
      if (data.emsg == "Session Expired") {
        // this.appComp.hideHeaderDetails();
        this.websocket.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (data.stat == "Not_Ok") {
        this.toastr.errorToastr("Failed", '', { showCloseButton: true });
      }
      if (data.stat == "Ok") {
        this.getOrders();
        this.toastr.successToastr("Order Cancelled Successfully", '', { showCloseButton: true });
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        this.websocket.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  /**
 * func to placescripsOrder/DelOrder from MKTList
 * @param scrOrder 
 * @param clicTyp 
 */
  scripsPOrd(scrOrder, clicTyp) {
    switch (clicTyp) {
      case 'buy':
        this.appComp.setmktVal(clicTyp, scrOrder, 'mktwatch');
        break;
      case 'sell':
        this.appComp.setmktVal(clicTyp, scrOrder, 'mktwatch');
        break;
      case 'modify':
        this.appComp.setmktVal(clicTyp, scrOrder, 'orderModify');
    }
  }

  /* Open Order Info dialog box */
  openInfoDialog(object) {
    var jsonData = {
      "userId": this.odgenserv.getUserId(),
      "nestOrderNumber": object.Nstordno,
      "userSessionID": this.odgenserv.getSessionToken(),
      "userSettingDto": this.odgenserv.getUserSettingDto()
    };
    this.odgenserv.orderHistory(jsonData).subscribe(data => {
      if (data.length > 0) {
        const dialogRef = this.dialog.open(OrderhistorydialogComponent, {
          width: '800px',
          height: '430px',
          data: data
        });
        dialogRef.afterClosed().subscribe(result => {

        });
      } else {
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        this.websocket.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  getCloseingValuesFromService(holdinglist) {
    var closingArray = [];
    for (let index of holdinglist) {
      if (index['ExchSeg1'] == 'NSE') {
        var jsonData = {
          "exch": index["ExchSeg1"],
          "trading_symbol": index["Token1"]
        }
        closingArray.push(jsonData);
      }
      if (index['ExchSeg1'] == null && index['ExchSeg2'] == 'BSE') {
        var jsonData = {
          "exch": index["ExchSeg2"],
          "trading_symbol": index["Token2"]
        }
        closingArray.push(jsonData);
      }
    }
    this.odgenserv.holdingCloseingService(closingArray).subscribe(res => {
      var data: any = res;
      if (data['emsg'] == 'Session Expired') {
        this.websocket.close();
        this.routeTo.navigateByUrl('login');
      }
      data.map(idx => {
        this.holdings.map(item => {
          if (item['ExchSeg1'] == 'NSE') {
            if (item['Token1'] == idx['token']) {
              item['avgprice'] = idx['close'];
              item['MTM'] = ((+item['Ltp'] - item['avgprice']) * +item['SellableQty']).toFixed(2);
            }
          }
          if (item['ExchSeg1'] == null && item['ExchSeg2'] == 'BSE') {
            if (item['Token1'] == idx['token']) {
              item['avgprice'] = idx['close'];
              item['MTM'] = ((+item['Ltp'] - +item['avgprice']) * +item['SellableQty']).toFixed(2);
            }
          }
        });
      });
      localStorage.setItem("holdings", JSON.stringify(this.holdings))
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.websocket.close();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  callSocketConnMW() {
    this.dataService.indexTickDataObservable.subscribe((mesg) => {
      //Tick for postionBook
      for (let k in this.position) {
        for (let j in mesg) {
          if (mesg[j]['ltp'] != undefined && mesg[j]['ltp'] != null) {
            if (this.position[k]['Token'] == mesg[j]['tk']) {
              this.position[k]['LTP'] = mesg[j]['ltp'];
              if (this.position[k]['Exchange'] !== 'NFO') {
                if (this.position[k]['Netqty'] > 0) {
                  this.position[k]['MtoM'] = ((Number((this.position[k]['LTP']).replace(/,/g, '')) - Number((this.position[k]['NetBuyavgprc']).replace(/,/g, ''))) * (Number(this.position[k]['Netqty']) * Number(this.position[k]['BLQty']) * Number(this.position[k]['GeneralNumerator'])) / Number(this.position[k]['GeneralDenomenator'])) + Number((this.position[k]['realisedprofitloss']).replace(/,/g, ''));
                  this.position[k]['MtoM'] = this.position[k]['MtoM'].toFixed(2);
                } else if (this.position[k]['Netqty'] < 0) {
                  this.position[k]['MtoM'] = ((Number((this.position[k]['LTP']).replace(/,/g, '')) - Number((this.position[k]['NetSellavgprc']).replace(/,/g, ''))) * (Number(this.position[k]['Netqty']) * Number(this.position[k]['BLQty']) * Number(this.position[k]['GeneralNumerator'])) / Number(this.position[k]['GeneralDenomenator'])) + Number((this.position[k]['realisedprofitloss']).replace(/,/g, ''));
                  this.position[k]['MtoM'] = this.position[k]['MtoM'].toFixed(2);
                } else {
                  this.position[k]['MtoM'] = Number((this.position[k]['MtoM']).toString().replace(/,/g, ''));
                  this.position[k]['MtoM'] = this.position[k]['MtoM'].toFixed(2);
                }
              } else {
                if (this.position[k]['Netqty'] > 0) {
                  this.position[k]['MtoM'] = ((Number((this.position[k]['LTP']).replace(/,/g, '')) - Number((this.position[k]['NetBuyavgprc']).replace(/,/g, ''))) * (Number(this.position[k]['Netqty']) * Number(this.position[k]['GeneralNumerator'])) / Number(this.position[k]['GeneralDenomenator'])) + Number((this.position[k]['realisedprofitloss']).replace(/,/g, ''));
                  this.position[k]['MtoM'] = this.position[k]['MtoM'].toFixed(2);
                } else if (this.position[k]['Netqty'] < 0) {
                  this.position[k]['MtoM'] = ((Number((this.position[k]['LTP']).replace(/,/g, '')) - Number((this.position[k]['NetSellavgprc']).replace(/,/g, ''))) * (Number(this.position[k]['Netqty']) * Number(this.position[k]['GeneralNumerator'])) / Number(this.position[k]['GeneralDenomenator'])) + Number((this.position[k]['realisedprofitloss']).replace(/,/g, ''));
                  this.position[k]['MtoM'] = this.position[k]['MtoM'].toFixed(2);
                } else {
                  this.position[k]['MtoM'] = Number((this.position[k]['MtoM']).toString().replace(/,/g, ''));
                  this.position[k]['MtoM'] = this.position[k]['MtoM'].toFixed(2);
                }
              }
            }
          }
        }
      }

      // console.log(this.orders)
      // for (let k in this.orders) {
      //   for (let j in mesg) {
      //     if(this.orders[k]['token'] == mesg[j]['tk'])
      //     if(this.orders[k]['Status'] == 'open'){
      //       // if(mesg[j]['ltp'] >= this.orders[k]['Prc'] && this.orders[k]['Trantype'] == 'S' && this.autosell == 0){
      //       //   console.log("position called Sell")
      //       //   this.autosell++;
      //       //   this.dataService.autoRefresh(true);

      //       // }
      //       // if(mesg[j]['ltp'] <= this.orders[k]['Prc'] && this.orders[k]['Trantype'] == 'B' && this.autobuy == 0){
      //       //   console.log("position called Buy")
      //       //   this.autobuy++;
      //       //   this.dataService.autoRefresh(true);
      //       // }
      //     }
      //   }
      // }
      
      if (this.position.length > 0) {
        this.funds[0]['unrealizedMtomPrsnt'] = Number('0.00');
        this.funds[0]['realizedMtomPrsnt'] = Number('0.00');
        this.position.map(item => {
          if (Number(item['Netqty']) == 0) {
            this.funds[0]['realizedMtomPrsnt'] += Number(item['MtoM'].replace(',',''));
          } else {
            this.funds[0]['unrealizedMtomPrsnt'] += Number(item['MtoM'].replace(',',''));
          }
        });
      }

      //Tik for orderBook 
      for (let k in this.orders) {
        for (let j in mesg) {
          if (mesg[j]['ts'] != undefined && mesg[j]['ts'] != null && mesg[j]['name'] == 'osf') {
            if (this.orders[k]['Nstordno'] == mesg[j]['non']) {
              this.orders[k]['Prc'] = mesg[j]['ptf'];
              this.orders[k]['Trantype'] = mesg[j]['tt'];
              this.orders[k]['Pcode'] = mesg[j]['prod'];
              this.orders[k]['Qty'] = mesg[j]['qtf'];
              this.orders[k]['Status'] = mesg[j]['os'];
              this.orders[k]['Prctype'] = mesg[j]['pt'];
              this.orders[k]['Fillshares'] = mesg[j]['fs'];
              this.orders[k]['Trgprc'] = mesg[j]['trigprc'];
            }
          }
        }
      }

      // Tik data for holdings
      for (let k in this.holdings) {
        for (let j in mesg) {
          if (mesg[j]['ltp'] != undefined && mesg[j]['ltp'] != null) {
            if (this.holdings[k]['Token1'] == mesg[j]['tk']) {
              this.holdings[k]['LTnse'] = mesg[j]['ltp'];
              this.holdings[k]['LTbse'] = mesg[j]['ltp'];
              if (this.holdings[k]['PrvClose'] != undefined) {
                this.holdings[k]['todayMTM'] = Number((this.holdings[k]['LTnse'] - this.holdings[k]['PrvClose']) * this.holdings[k]['SellableQty']).toFixed(2);
              }
              this.holdings[k]['NSEHOldingValue'] = mesg[j]['ltp'] * this.holdings[k]['SellableQty'];
              this.holdings[k]['NSEHOldingValue'] = this.holdings[k]['NSEHOldingValue'].toFixed(2);
            } else if (this.holdings[k]['Token2'] == mesg[j]['tk']) {
              this.holdings[k]['LTbse'] = mesg[j]['ltp'];
              if (this.holdings[k]['PrvClose'] != undefined) {
                this.holdings[k]['todayMTM'] = Number((this.holdings[k]['LTbse'] - this.holdings[k]['PrvClose']) * this.holdings[k]['SellableQty']).toFixed(2);
              }
              this.holdings[k]['BSEHOldingValue'] = mesg[j]['ltp'] * this.holdings[k]['SellableQty'];
              this.holdings[k]['BSEHOldingValue'] = this.holdings[k]['BSEHOldingValue'].toFixed(2);
            }
          }
        }
      }
    });
  }

  /**
  * after connecting with MW sockets subscriptions to get data
  */
  sendMessage() {
    if (this.mwCallpos != undefined || this.mwCallpos != null) {
      var jsonSendObj = {
        "channel": this.mwCallpos,
        "task": "mw",
        "acctid": this.odgenserv.getUserId(),
        "user": this.odgenserv.getUserId(),
        "token": this.odgenserv.getSessionToken()
      };
      this.odgenserv.mWatch.next(jsonSendObj);
    }
    if (this.chnl != undefined || this.chnl != null) {
      var jsonSendObject = {
        "channel": this.chnl,
        "task": "os",
        "acctid": this.odgenserv.getUserId(),
        "user": this.odgenserv.getUserId(),
        "token": this.odgenserv.getSessionToken()
      };
      this.odgenserv.mWatch.next(jsonSendObject);
    }
    if (this.chnlHold != undefined || this.chnlHold != null) {
      var jsonSendObjhold = {
        "channel": this.chnlHold,
        "task": "mw",
        "acctid": this.odgenserv.getUserId(),
        "user": this.odgenserv.getUserId(),
        "token": this.odgenserv.getSessionToken()
      }
      this.odgenserv.mWatch.next(jsonSendObjhold);
    }
  }

  //Method To Open cancel order dialog
  openConfirmation(param) {
    const dialogRef = this.dialog.open(CancelExitAllComponent, {
      width: '600px',
      data: { data: param },

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getOrders();
      }
    });
  }
}