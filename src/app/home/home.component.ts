import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit, Input, HostListener, } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject, interval } from 'rxjs';
import { map, elementAt } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as alertify from 'alertifyjs'
import { SecurityinfoComponent } from '../securityinfo/securityinfo.component';
import { FormControl } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import 'rxjs/add/operator/map';
import { Datafeed } from '../chart/datafeed';
import { ChartingLibraryWidgetOptions, IChartingLibraryWidget, widget } from 'src/assets/charting_library/charting_library.min';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedataserviceService } from '../services/sharedataservice.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { WebsocketService } from '../services/websocket.service';
import { DataTableDirective } from 'angular-datatables';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OrderhistorydialogComponent } from '../orderhistorydialog/orderhistorydialog.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MarketstatusComponent } from '../marketstatus/marketstatus.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomersupportComponent } from '../customersupport/customersupport.component';
import { IndexlistComponent } from '../indexlist/indexlist.component';
import { timingSafeEqual } from 'crypto';
import { TradeAlertComponent } from '../trade-alert/trade-alert.component';
import { DialogLogoutComponent } from '../dialog-logout/dialog-logout.component';
import { CIQ } from '../chartiq/js/chartiq';
import { HttpClient } from '@angular/common/http';
declare function customChangeSymbol(): any; 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  private userData: any;
  mwName: string;
  items: any;
  nifname: any;
  nifPer: any;
  nifindexVal: any;
  nifindexChange: any;
  senxindexChange: any;
  senxindexVal: any;
  senxPer: any;
  senxname: any;
  profileName: string;
  exchArray: any = [];
  tempSegment: any = [];
  selectedIndex: number = 1;
  public quickTradeForm: FormGroup;
  matSlideToggle;
  mwgrp5: string;
  mwgrp4: string;
  mwgrp3: string;
  mwgrp2: string;
  mwgrp1: string;
  subscription: any;
  timer: Boolean = true;
  selectedItem: any;
  bodLotQty: any;
  segmentfiltervalue: any = "All";
  isClicked = [];
  mwscrptname: any;
  scripsmkt: any = [];
  showList: boolean;
  searchList: any = [];
  err: any;
  showDepLst: boolean;
  percentSort: boolean = false;
  ExchSort: boolean = false;
  mwCall: any;
  mwListLength: Number;
  timeLeft: number = 60;
  interval;
  holdingvisible = false;
  mktWatch: any = "mw";
  sfiwtch: any = "sfi";
  orderWatch: any = "os";
  ordertiktoken: any;
  nomktmsg: any;
  nomktwtc: boolean;
  position: any;
  orders: any = [];
  openOrder: any = [];
  completedOrder: any = [];
  tradebook: any = [];
  step = 0;
  dataorders: any;
  holdings: any;
  funds: any = [];
  mwgrpList: any = [];
  panelOpenState = false;
  positionsvisible: boolean = false;
  ordervisible: boolean = false;
  holdingtotalvalue: number;
  navfeedonetimecall: boolean = true;
  oldpwd: any;
  newpwd: any;
  confnewpwd: any;
  changepwdform: FormGroup;
  submitted = false;
  mktlistload: Boolean = false;
  oneTimeSubscribe: Boolean = true;
  dtOptions: DataTables.Settings = {};
  asyncScriptTabs: any = [];
  showFilter: boolean = false;
  indexnamelist: any;
  currGp: number = 0;
  leftindexchart: any;
  rightindexchart: any;
  months: any = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  @ViewChild(DataTableDirective, { static: true } as any)
  dtElement: DataTableDirective;
  selected = new FormControl(0);
  orderInProgress: Boolean = false;
  orderColumns: string[] = ['Nstordno', 'Trantype', 'OrderedTime', 'Pcode', 'Prctype', 'Trsym', 'Qty', 'Prc', 'Trgprc', 'Status', 'Button'];
  TradeColumns: string[] = ['Nstordno', 'FillId', 'Trantype', 'Filltime', 'Pcode', 'Prctype', 'Trsym', 'Qty', 'Price', 'Status'];
  positionColumns: string[] = ['Tsym', 'Bqty', 'Netqty', 'Pcode', 'Exchange', 'Buyavgprc', 'Sellavgprc', 'BEP', 'LTP', 'realisedprofitloss', 'MtoM', 'Action'];
  holdingColumns: string[] = ['instrument', 'Qty', 'LTP', 'TotalValue', 'AvgValue', 'Action'];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  searchbox: string;
  mktload: boolean;
  userInfo: any[];
  exch: any;
  pCode: string;
  prctyp: string;
  exchMessage: any;
  quickTrade: any = [];
  loginDetails: any;
  public profile: any = [];
  sessionID: any;
  sPublicKey4: any;
  newPass: any;
  confPass: any;
  connectionTime: any = null;
  toggleOn: boolean = true;
  commonServ: any;
  lowPrice: any;
  highPrice: any;
  openI: any;
  totalPrice: any;
  sort: any;
  topIndexes: any;
  atoz: boolean = false;
  ltpSort: boolean = false;
  updateQuickTrade: boolean = false;
  favoriteSeason: string;
  ticktime: any = 0;
  filterlist: any = [
    { name: 'A-Z', select: true },
    { name: 'Percentage(%)', select: false },
    { name: 'LTP', select: false },
    { name: 'Exchange', select: false },
  ];
  private _symbol: ChartingLibraryWidgetOptions['symbol'] = 'INFY::NSE';
  private _interval: ChartingLibraryWidgetOptions['interval'] = 'D';
  // BEWARE: no trailing slash is expected in feed URL
  private _datafeedUrl = ZebuodrGentrService.chartURL;
  private _libraryPath: ChartingLibraryWidgetOptions['library_path'] = '/assets/charting_library/';
  private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
  private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
  private _containerId: ChartingLibraryWidgetOptions['container_id'] = 'tv_chart_container';
  private _tvWidget: IChartingLibraryWidget | null = null;
  tValue: any;
  private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = 'https://saveload.tradingview.com';
  router: any;
  indexNames: any = [];
  nifty50Name: any;
  ResponseVal: any = [];
  fiveMinInterval: any;

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

  counter: number = 0;
  reconnection: any = 0;
  reconnmsg: any = 0;
  quickTrades: any = [];
  scrpResp: any;
  constructor(private breakpointObserver: BreakpointObserver, public odgenserv: ZebuodrGentrService, private snackBar: MatSnackBar,
    public routeTo: Router, public appComp: AppComponent, private formBuilder: FormBuilder,
    private spinnerService: NgxUiLoaderService, public dialog: MatDialog,
    public dataService: SharedataserviceService,
    public http: HttpClient,
    private wsService: WebsocketService,
    private changeDetector: ChangeDetectorRef,
    public toastr: ToastrManager, private elementRef: ElementRef, public odrServ: ZebuodrGentrService, public websocket: WebsocketService
  ) {
    if (window.innerWidth > 720) {
      if (localStorage.getItem("currentUser") != undefined || localStorage.getItem("currentUser") != null) {
        this.routeTo.navigateByUrl('home');
      } else {
        this.routeTo.navigateByUrl('login');
      }
    } else {
      if (localStorage.getItem("currentUser") != undefined || localStorage.getItem("currentUser") != null) {
        this.routeTo.navigateByUrl('homes');
      } else {
        this.routeTo.navigateByUrl('login');
      }
    }
    this.openTickDataName();
    this.profileName = this.odrServ.getUserId();
    this.asyncScriptTabs = ['All'];
    let seg: any = this.odgenserv.getUserSettingDto()['exch'];
    seg.map(item => {
      this.asyncScriptTabs.push(item);
    });
    this.fetchMWlist();
    this.dataService.reconnectSocketConnection.subscribe(res => {
      if (res) {
        // this.callSocketConnMW();
        console.log("re subscibe")
        // this.appComp.sendSubscribeMessage();
        this.doRefresh();
        // this.odrServ.webSocketConnection();
        // setTimeout(() => {
        //   this.callSocketConnMW();          // this.reconnectmarktgrp(this.selectedItem);
        // }, 1000);
      }
    });
  }

  ngOnDestroy() {
    clearInterval(this.reconnection);
    clearInterval(this.fiveMinInterval);
  }

  ngOnInit() {
    this.appComp._isTogglePage = 'main';
   //var userId = this.odgenserv.getUserId();
    if (sessionStorage.getItem("currMwIndex") != null || sessionStorage.getItem("currMwIndex") != undefined) {
      this.currGp = JSON.parse(sessionStorage.getItem("currMwIndex"));
    }
    if (sessionStorage.getItem("currentGroup") != null || sessionStorage.getItem("currentGroup") != undefined) {
      this.selectedItem = JSON.parse(sessionStorage.getItem("currentGroup"));
    }
    if (sessionStorage.getItem("localMW") != null || sessionStorage.getItem("localMW") != undefined) {
      this.scripsmkt = JSON.parse(sessionStorage.getItem("localMW"));
    }

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      paging: false,
      scrollCollapse: true,
      searching: false,
      info: false,
      order: [[2, 'desc']]
    };
    this.spinnerService.start();
    this.getUserInfo();
    //this.getExchangeMsg();//Exchange Message
    let exch = this.odgenserv.getUserSettingDto();
    this.exchArray = exch['exch'];
  }

  // @HostListener('window:focus',['$event'])
  // onFocus(event: any):void{
  //   console.log(this.appComp._count)
  //  if(this.appComp._count <=  -5){
  //    this.doRefresh();
  //  }  
  // }

  @HostListener('window:blur', ['$event'])
  onBulr(event: any): void {
    if (this.appComp._count <= -5) {
      this.doRefresh();
      // this.callSocketConnMW();
    }
  }

  doRefresh() {
    this.odrServ.webSocketConnection();
    setTimeout(() => {
      this.reconnectmarktgrp(this.selectedItem);
    }, 1000);
  }

  //method to reorder market watch list 
  moveChecklist(ev) {
    let itemToMove = this.items.splice(ev.detail.from, 1)[0];
    this.items.splice(ev.detail.to, 0, itemToMove)
    ev.detail.complete();
  }

  // ionViewDidEnter() {
  //   for (let idx of this.exchArray) {
  //     this.quickTrades.push({
  //       "active_status": 0,
  //       "changed": false,
  //       "created_by": "",
  //       "created_on": "",
  //       "exchange_seg": idx,
  //       "id": 0,
  //       "order_type": "MKT",
  //       "product_type": "CNC",
  //       "qty": 1,
  //       "quickToggle": false,
  //       "total_amount": 0,
  //       "updated_by": "",
  //       "updated_on": "",
  //       "user_id": "",
  //     });
  //   }
  // }

  //Method for confirmation toastr
  openConfirmation(param) {
    let instrument = param['Trsym'];
    let exch = param['Exchange'];
    let price = param['Prc'];
    let ordr_id = param['Nstordno'];
    let product = param['Pcode'];
    let type = param['Prctype'];
    let qty = param['Qty'];
    let self = this;
    alertify.confirm(
      "<span class='editSym'>" + instrument + " " + "<span style = 'font-size : 12px'>" + '(' + exch + ')' + "</span>" + "</span>"
      + "<span class='price-range'>" + price + "</span>",
      '<div class="">'
      + '<div class="row" style = "padding: 3%">'
      + '<div style="float: left;">'
      + '<span style = "font-weight : bold">Order Id : </span>'
      + '<span>' + ordr_id + '</span>'
      + '</div>'
      + '<div style="float: right;">'
      + '<span style = "font-weight : bold">Quantity : </span>'
      + '<span>' + qty + '</span>'
      + ' </div>'
      + '</div>'

      + '<div class="row"  style = "padding: 3%">'
      + '<div style="float: left;">'
      + '<span style = "font-weight : bold">Product : </span>'
      + '<span>' + product + '</span>'
      + '</div>'
      + '<div style="float: right;">'
      + '<span style = "font-weight : bold">Type : </span>'
      + '<span>' + type + '</span>'
      + '</div>'
      + '</div>'
      + '</div>'
      ,

      function () { },
      function () { })
      .set({
        transition: 'zoom',
        modal: false,
        pinnable: false,
        closable: false,
        onok: function (closeEvent) {
          // self.orderCancel(param);
        }
      });
  }

  ngAfterViewInit() {
    this.fetchMWlist();
  }

  /** Fetches the MW list for teh user logged in
   * Default market watch is set
   */
  fetchMWlist() {
    var userFetch = {
      'userId': this.odgenserv.getUserId(),
    }
    this.odgenserv.fetchMList(userFetch).subscribe(mwResp => {
      this.mwgrpList = [];
      if (mwResp['emsg'] == "Session Expired") {
        this.toastr.errorToastr('failed', 'Session Expired', { showCloseButton: true });
        // this.appComp.hideHeaderDetails();
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (mwResp['emsg'] == "No_MarketWatch " && mwResp['stat'] == "Not_Ok") {
        this.mwgrp1 = this.autoGenerateMWListKey();
        this.mwgrp2 = this.autoGenerateMWListKey();
        this.mwgrp3 = this.autoGenerateMWListKey();
        this.mwgrp4 = this.autoGenerateMWListKey();
        this.mwgrp5 = this.autoGenerateMWListKey();
        if (sessionStorage.getItem("currentGroup") != null || sessionStorage.getItem("currentGroup") != undefined) {
          this.selectedItem = JSON.parse(sessionStorage.getItem("currentGroup"));
        } else {
          this.selectedItem = this.mwgrp1;
        }
        for (var i = 0; i < 5; i++) {
          if (i > 0) {
            this.mwgrpList.push('false');
          } else {
            this.mwgrpList.push('true');
          }
        }
      }
      if (mwResp['stat'] == "Ok") {
        if (mwResp['values'].length > 0 && mwResp['values'] != undefined) {
          this.mwListLength = mwResp['values'].length;
          for (var i = 0; i < 5; i++) {
            if (i > this.mwListLength) {
              this.mwgrpList.push('false');
            } else {
              this.mwgrpList.push('true');
            }
          }
        }
      }
      if (mwResp['stat'] == "Ok") {
        this.mwgrp1 = mwResp['values'][0] != null || mwResp['values'][0] != undefined ? mwResp['values'][0] : this.autoGenerateMWListKey();
        this.mwgrp2 = mwResp['values'][1] != null || mwResp['values'][1] != undefined ? mwResp['values'][1] : this.autoGenerateMWListKey();
        this.mwgrp3 = mwResp['values'][2] != null || mwResp['values'][2] != undefined ? mwResp['values'][2] : this.autoGenerateMWListKey();
        this.mwgrp4 = mwResp['values'][3] != null || mwResp['values'][3] != undefined ? mwResp['values'][3] : this.autoGenerateMWListKey();
        this.mwgrp5 = mwResp['values'][4] != null || mwResp['values'][4] != undefined ? mwResp['values'][4] : this.autoGenerateMWListKey();
        if (this.selectedItem != null || this.selectedItem != undefined) {
          this.marktgrp(this.selectedItem);
        } else {
          this.marktgrp(this.mwgrp1);
        }
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
    // this.callSocketConnMW();
  }


  autoGenerateMWListKey() {
    var text = "mwGrp";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 2; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  fooderMWGroup(event) {
    switch (event.index) {
      case 0:
        sessionStorage.setItem("currMwIndex", JSON.stringify(0));
        this.marktgrp(this.mwgrp1);
        break
      case 1:
        sessionStorage.setItem("currMwIndex", JSON.stringify(1));
        this.marktgrp(this.mwgrp2);
        break
      case 2:
        sessionStorage.setItem("currMwIndex", JSON.stringify(2));
        this.marktgrp(this.mwgrp3);
        break
      case 3:
        sessionStorage.setItem("currMwIndex", JSON.stringify(3));
        this.marktgrp(this.mwgrp4);
        break
      case 4:
        sessionStorage.setItem("currMwIndex", JSON.stringify(4));
        this.marktgrp(this.mwgrp5);
        break
      default:
        break;
    }
  }

  reconnectmarktgrp(val) {
    var jsonScrips = {
      "userId": this.odgenserv.getUserId(),
      "mwName": val
    }
    this.odgenserv.fetchMScrp(jsonScrips).subscribe(scrpResp => {
      if (scrpResp['emsg'] == "Session Expired") {
        this.toastr.errorToastr('failed', 'Session Expired', { showCloseButton: true });
        this.wsService.close();
        localStorage.clear();
        // this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (scrpResp['stat'] == "Ok") {
        this.spinnerService.stop();
        this.callSocketConnMW();
      } else if (scrpResp['stat'] == "Not_Ok" && scrpResp['emsg'] == "Not able to Retrieve MarketWatch ") {
        this.mktlistload = false;
        this.nomktwtc = true;
        this.nomktmsg = scrpResp['emsg'];
        this.callSocketConnMW();
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  /** Fetching the list of scrips in that market watch */
  marktgrp(val) {
    this.mktlistload = true;
    this.selectedItem = val;
    sessionStorage.setItem("currentGroup", JSON.stringify(this.selectedItem));
    var jsonScrips = {
      "userId": this.odgenserv.getUserId(),
      "mwName": val
    }
    this.odgenserv.fetchMScrp(jsonScrips).subscribe(scrpResp => {
      var mwLst = [];
      if (scrpResp['emsg'] == "Session Expired") {
        this.toastr.errorToastr('failed', 'Session Expired', { showCloseButton: true });
        localStorage.clear();
        this.wsService.close();
        // this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (scrpResp['stat'] == "Ok") {
        this.nomktwtc = false;
        this.scripsmkt = scrpResp['values'];
        localStorage.setItem("scripsmkt", JSON.stringify(this.scripsmkt));
        for (let x = this.scripsmkt.length - 1; x >= 0; x--) {
          if (this.scripsmkt[x]['Exchange'] == 'X') {
            this.scripsmkt.splice(x, 1);
          }
        }
        this.scripsmkt.map(item => {
          mwLst.push(item['ExchSeg'] + '|' + item['token']);
          item['prevLtp'] = item['ltp'];
          if (item['Instrument'] == 'OPTIDX' || item['Instrument'] == 'OPTSTK' || item['Instrument'] == 'OPTFUT' || item['Instrument'] == 'OPTCUR') {
            let strike = item.strikeprice.split('.')[1] > 0 ? item.strikeprice : item.strikeprice.split('.')[0];
            item['instrumentOptidx'] = item.symbolname + ' ' + new Date(item.Expiry).getDate() + this.months[new Date(item.Expiry).getMonth()] + ' ' + Number(strike).toFixed(2) + ' ' + item.optiontype;
          }
          if (item['Instrument'].startsWith('FUT')) {
            item['instrumentFut'] = item.symbolname + ' ' + new Date(item.Expiry).getDate() + this.months[new Date(item.Expiry).getMonth()] + ' FUT';
          }
        });
        this.scripsmkt.map(item => {
          mwLst.push(item['ExchSeg'] + '|' + item['token']);
        })
        this.mwCall = mwLst.join("&");
        this.appComp._isMWCall = mwLst.join("&");
        this.spinnerService.stop();
        this.mktload = false;
        this.mktlistload = false;
        if (this.navfeedonetimecall) {
          this.navfeedonetimecall = false;
          this.navFeed(scrpResp);
        }
        this.callSocketConnMW();
        localStorage.setItem("defaultIndex", JSON.stringify(scrpResp));
        this.dataService.indexTickData(scrpResp);
      }
      if (scrpResp['stat'] == "Not_Ok" && scrpResp['emsg'] == "Not able to Retrieve MarketWatch ") {
        this.mktlistload = false;
        this.nomktwtc = true;
        this.nomktmsg = scrpResp['emsg'];
        this.navFeed(scrpResp);
        this.callSocketConnMW();
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  /**
   * WebSocket for market watch
   */
  callSocketConnMW() {
    this.appComp.callConnectionSocket();
    this.odgenserv.mWatch.subscribe(msg => {
      let response = JSON.parse(msg);
      if (response.length > 0) {
        if (response[0]['ak'] != undefined && response[0]['ak'] == "ok" && response[0]['task'] == "cn") {
          this.appComp.sendSubscribeMessage();
        } else {
          this.appComp._count = 15;
          var data = this.scripsmkt;
          var mesg = response;
          this.dataService.indexTickData(mesg);
          for (let i in mesg) {
            if ((mesg[i]['tk'] == this.nifname) && (mesg[i]['iv'] != undefined) && (mesg[i]['nc'] != undefined) && (mesg[i]['cng'] != undefined)) {
              this.nifindexVal = Number(mesg[i]['iv']).toFixed(2);
              this.nifindexChange = (Number(mesg[i]['nc'])).toFixed(2);
              this.nifPer = (Number(mesg[i]['cng'])).toFixed(2);
            }
            if ((mesg[i]['tk'] == this.senxname) && (mesg[i]['iv'] != undefined) && (mesg[i]['nc'] != undefined) && (mesg[i]['cng'] != undefined)) {
              this.senxindexVal = Number(mesg[i]['iv']).toFixed(2);
              this.senxindexChange = (Number(mesg[i]['nc'])).toFixed(2);
              this.senxPer = (Number(mesg[i]['cng'])).toFixed(2);
            }
          }
          data.map((item, i) => {
            mesg.map((msgg, j) => {
              if (mesg[j]['name'] == "tm") {
                this.tValue = mesg[j]['tvalue'];
                // console.log(this.tValue)
                // this.ticktime = this.odgenserv.getCustomTime(mesg[j]['tvalue']);
              }
              switch (this.mktWatch) {
                case "mw":
                  if (data[i]['token'] == mesg[j]['tk'] && mesg[j]['ltt'] != 'NA') {
                    if (mesg[j]['ltp']) {
                      data[i]['prevLtp'] = data[i]['ltp'];
                      data[i]['ltp'] = mesg[j]['ltp'] == undefined ? '0' : mesg[j]['ltp'];
                    }
                    // if (data[i]['token'] == this.ordertiktoken) {
                    //   this.appComp.tikprice = mesg[j]['ltp'] == undefined ? '0' : mesg[j]['ltp'];
                    //   // this.appComp.pev_tikprice = this.appComp.tikprice;
                    //   if (mesg[j]['cng'] != undefined) {
                    //     this.appComp.change = Number(mesg[j]['cng'].replace(',', '')).toFixed(2);
                    //   }
                    //   if (mesg[j]['nc'] != undefined) {
                    //     this.appComp.perchange = Number(mesg[j]['nc'].replace(',', '')).toFixed(2);
                    //   }
                    // }
                    if (data[i]['token'] == this.ordertiktoken) {
                      this.appComp.tikprice = mesg[j]['ltp'] == undefined ? this.appComp.tikprice : mesg[j]['ltp'];
                      // console.log(this.appComp.tikprice, mesg[j]['ltp'] == undefined ? this.appComp.tikprice : mesg[j]['ltp'])
                      if (mesg[j]['nc'] != undefined) {
                        this.appComp.perchange = Number(mesg[j]['nc'].replace(',', '')).toFixed(2);
                      }
                      if (mesg[j]['cng'] != undefined) {
                        this.appComp.change = Number(mesg[j]['cng'].replace(',', '')).toFixed(2);
                      }
                    }
                    if (mesg[j]['v']) {
                      data[i]['PrevVolume'] = data[i]['v'];
                      data[i]['v'] = mesg[j]['v'] == undefined ? '0' : mesg[j]['v'];
                    }
                    if (mesg[j]['op']) {
                      data[i]['open'] = mesg[j]['op']
                    }
                    if (mesg[j]['h']) {
                      data[i]['high'] = mesg[j]['h'];
                    }
                    if (mesg[j]['lo']) {
                      data[i]['low'] = mesg[j]['lo'];
                    }
                    if (mesg[j]['c']) {
                      data[i]['close'] = mesg[j]['c'];
                    }
                    if (mesg[j]['oi']) {
                      // console.log(mesg[j]['oi'])
                      data[i]['oi'] = mesg[j]['oi'];
                      // this.openI = mesg[j]['oi'];
                    }
                    if (mesg[j]['name'] == 'sf') {
                      if (document.getElementById('ltpBack_' + mesg[j]['tk']) != null) {
                        var prevLtp = document.getElementById('ltpBack_' + mesg[j]['tk']).innerHTML;
                        if (mesg[j]['ltp'] > prevLtp) {
                          if (document.getElementById('ltpBack_' + mesg[j]['tk']) != null) {
                            document.getElementById('ltpBack_' + mesg[j]['tk']).classList.add('animate-background-green');
                            setTimeout(() => {
                              if (document.getElementById('ltpBack_' + mesg[j]['tk']) != null) {
                                document.getElementById('ltpBack_' + mesg[j]['tk']).classList.remove('animate-background-green');
                              }
                            }, 500);
                          }
                        } else if (mesg[j]['ltp'] < prevLtp) {
                          if (document.getElementById('ltpBack_' + mesg[j]['tk']) != null) {
                            document.getElementById('ltpBack_' + mesg[j]['tk']).classList.add('animate-background-red');
                            setTimeout(() => {
                              if (document.getElementById('ltpBack_' + mesg[j]['tk']) != null) {
                                document.getElementById('ltpBack_' + mesg[j]['tk']).classList.remove('animate-background-red');
                              }
                            }, 500);
                          }
                        } else if (mesg[j]['ltp'] == prevLtp && mesg[j]['v'] > data[i]['PrevVolume']) {
                          if (document.getElementById('ltpBack_' + mesg[j]['tk']) != null) {
                            document.getElementById('ltpBack_' + mesg[j]['tk']).classList.add('animate-background-green');
                            setTimeout(() => {
                              if (document.getElementById('ltpBack_' + mesg[j]['tk']) != null) {
                                document.getElementById('ltpBack_' + mesg[j]['tk']).classList.remove('animate-background-green');
                              }
                            }, 500);
                          }
                        }
                      }
                    }
                    if (document.getElementById('pers_' + mesg[j]['tk']) != null && mesg[j]['nc'] != undefined) {
                      document.getElementById('pers_' + mesg[j]['tk']).innerHTML = '(' + Number(mesg[j]['nc']).toFixed(2) + '%)';
                      if (mesg[j]['nc'] > 0) {
                        document.getElementById('pers_' + mesg[j]['tk']).style.color = 'green';
                      } else if (mesg[j]['nc'] < 0) {
                        document.getElementById('pers_' + mesg[j]['tk']).style.color = 'red';
                      } else {

                      }
                    }
                    if (document.getElementById('change_' + mesg[j]['tk']) != null && mesg[j]['cng'] != undefined) {
                      document.getElementById('change_' + mesg[j]['tk']).innerHTML = Number(mesg[j]['cng']).toFixed(2);
                      if (mesg[j]['cng'] > 0) {
                        document.getElementById('change_' + mesg[j]['tk']).style.color = 'green';
                      } else if (mesg[j]['cng'] < 0) {
                        document.getElementById('change_' + mesg[j]['tk']).style.color = 'red';
                      } else {

                      }
                    }
                  }
                  if (mesg[j]['tk'] == "Nifty 50" || mesg[j]['tk'] == "SENSEX") {
                    if (mesg[j]['iv']) {
                      this.appComp.receiveIndexVal(mesg[j]['iv'], "iv", mesg[j]['tk']);
                    }
                    if (mesg[j]['cng']) {
                      data[i]['cng'] = mesg[j]['cng']
                      this.appComp.receiveIndexVal(mesg[j]['cng'], "cng", mesg[j]['tk']);
                    }
                    if (mesg[j]['nc']) {
                      data[i]['nc'] = mesg[j]['nc']
                      this.appComp.receiveIndexVal(mesg[j]['cng'], "nc", mesg[j]['tk']);
                    }
                  }
                  break;
                case "dp":
                  if (mesg[j]['tk']) {
                    if (data[i]['token'] == mesg[j]['tk']) {
                      if (mesg[j]['ltp']) {
                        data[i]['prevLtp'] = data[i]['ltp'];
                        data[i]['ltp'] = mesg[j]['ltp']
                      }
                      if (data[i]['token'] == this.ordertiktoken) {
                        this.appComp.tikprice = mesg[j]['ltp'] == undefined ? this.appComp.tikprice : mesg[j]['ltp'];
                        // console.log(this.appComp.tikprice, mesg[j]['ltp'] == undefined ? this.appComp.tikprice : mesg[j]['ltp'])
                        if (mesg[j]['nc'] != undefined) {
                          this.appComp.perchange = Number(mesg[j]['nc'].replace(',', '')).toFixed(2);
                        }
                        if (mesg[j]['cng'] != undefined) {
                          this.appComp.change = Number(mesg[j]['cng'].replace(',', '')).toFixed(2);
                        }
                      }
                      if (mesg[j]['v']) {
                        data[i]['PrevVolume'] = data[i]['v'];
                        data[i]['v'] = mesg[j]['v'] == undefined ? '0' : mesg[j]['v'];
                      }
                      if (mesg[j]['v']) {
                        data[i]['Prevvolume'] = data[i]['v'];
                      }
                      if (mesg[j]['bp']) {
                        data[i]['bp'] = mesg[j]['bp'];
                      }
                      if (mesg[j]['bno']) {
                        data[i]['bno'] = mesg[j]['bno']
                      }
                      if (mesg[j]['bq']) {
                        if (mesg[j]['e'] == 'mcx_fo') {
                          data[i]['bq'] = this.bodLotQty != null ? Math.ceil(mesg[j]['bq'] / this.bodLotQty) : '0';
                        } else {
                          data[i]['bq'] = mesg[j]['bq']
                        }
                      }

                      if (mesg[j]['sp']) {
                        data[i]['sp'] = mesg[j]['sp']
                      }
                      if (mesg[j]['sno']) {
                        data[i]['sno'] = mesg[j]['sno']
                      }
                      if (mesg[j]['bs']) {
                        if (mesg[j]['e'] == 'mcx_fo') {
                          data[i]['bs'] = this.bodLotQty != null ? Math.ceil(mesg[j]['bs'] / this.bodLotQty) : '0';
                        } else {
                          data[i]['bs'] = mesg[j]['bs'];
                        }
                      }

                      if (mesg[j]['bp1']) {
                        data[i]['bp1'] = mesg[j]['bp1']
                      }
                      if (mesg[j]['bno1']) {
                        data[i]['bno1'] = mesg[j]['bno1']
                      }
                      if (mesg[j]['bq1']) {
                        if (mesg[j]['e'] == 'mcx_fo') {
                          data[i]['bq1'] = this.bodLotQty != null ? Math.ceil(mesg[j]['bq1'] / this.bodLotQty) : '0';
                        } else {
                          data[i]['bq1'] = mesg[j]['bq1']
                        }
                      }

                      if (mesg[j]['sp1']) {
                        data[i]['sp1'] = mesg[j]['sp1']
                      }
                      if (mesg[j]['sno1']) {
                        data[i]['sno1'] = mesg[j]['sno1']
                      }
                      if (mesg[j]['bs1']) {
                        if (mesg[j]['e'] == 'mcx_fo') {
                          data[i]['bs1'] = this.bodLotQty != null ? Math.ceil(mesg[j]['bs1'] / this.bodLotQty) : '0';
                        } else {
                          data[i]['bs1'] = mesg[j]['bs1'];
                        }
                      }

                      if (mesg[j]['bp2']) {
                        data[i]['bp2'] = mesg[j]['bp2']
                      }
                      if (mesg[j]['bno2']) {
                        data[i]['bno2'] = mesg[j]['bno2']
                      }
                      if (mesg[j]['bq2']) {
                        if (mesg[j]['e'] == 'mcx_fo') {
                          data[i]['bq2'] = this.bodLotQty != null ? Math.ceil(mesg[j]['bq2'] / this.bodLotQty) : '0';
                        } else {
                          data[i]['bq2'] = mesg[j]['bq2']
                        }
                      }
                      if (mesg[j]['sp2']) {
                        data[i]['sp2'] = mesg[j]['sp2']
                      }
                      if (mesg[j]['sno2']) {
                        data[i]['sno2'] = mesg[j]['sno2']
                      }
                      if (mesg[j]['bs2']) {
                        if (mesg[j]['e'] == 'mcx_fo') {
                          data[i]['bs2'] = this.bodLotQty != null ? Math.ceil(mesg[j]['bs2'] / this.bodLotQty) : '0';
                        } else {
                          data[i]['bs2'] = mesg[j]['bs2']
                        }
                      }
                      if (mesg[j]['bp3']) {
                        data[i]['bp3'] = mesg[j]['bp3']
                      }
                      if (mesg[j]['bno3']) {
                        data[i]['bno3'] = mesg[j]['bno3']
                      }
                      if (mesg[j]['bq3']) {
                        if (mesg[j]['e'] == 'mcx_fo') {
                          data[i]['bq3'] = this.bodLotQty != null ? Math.ceil(mesg[j]['bq3'] / this.bodLotQty) : '0';
                        } else {
                          data[i]['bq3'] = mesg[j]['bq3']
                        }
                      }
                      if (mesg[j]['sp3']) {
                        data[i]['sp3'] = mesg[j]['sp3']
                      }
                      if (mesg[j]['sno3']) {
                        data[i]['sno3'] = mesg[j]['sno3']
                      }
                      if (mesg[j]['bs3']) {
                        if (mesg[j]['e'] == 'mcx_fo') {
                          data[i]['bs3'] = this.bodLotQty != null ? Math.ceil(mesg[j]['bs3'] / this.bodLotQty) : '0';
                        } else {
                          data[i]['bs3'] = mesg[j]['bs3']
                        }
                      }
                      if (mesg[j]['bp4']) {
                        data[i]['bp4'] = mesg[j]['bp4']
                      }
                      if (mesg[j]['bno4']) {
                        data[i]['bno4'] = mesg[j]['bno4']
                      }
                      if (mesg[j]['bq4']) {
                        if (mesg[j]['e'] == 'mcx_fo') {
                          data[i]['bq4'] = this.bodLotQty != null ? Math.ceil(mesg[j]['bq4'] / this.bodLotQty) : '0';
                        } else {
                          data[i]['bq4'] = mesg[j]['bq4']
                        }
                      }

                      if (mesg[j]['sp4']) {
                        data[i]['sp4'] = mesg[j]['sp4']
                      }
                      if (mesg[j]['sno4']) {
                        data[i]['sno4'] = mesg[j]['sno4']
                      }
                      if (mesg[j]['bs4']) {
                        if (mesg[j]['e'] == 'mcx_fo') {
                          data[i]['bs4'] = this.bodLotQty != null ? Math.ceil(mesg[j]['bs4'] / this.bodLotQty) : '0';
                        } else {
                          data[i]['bs4'] = mesg[j]['bs4']
                        }
                      }
                      // if (mesg[j]['iv']) {
                      //   this.appComp.receiveIndexVal(mesg[j]['iv'], "iv", mesg[j]['tk']);
                      //  //  console.log('iv',mesg[j]['iv'])
                      // }
                      // if (mesg[j]['cng']) {
                      //   data[i]['cng'] = mesg[j]['cng']
                      //   this.appComp.receiveIndexVal(mesg[j]['cng'], "cng", mesg[j]['tk']);
                      // }
                      // if (mesg[j]['nc']) {
                      //   data[i]['nc'] = mesg[j]['nc']
                      //   this.appComp.receiveIndexVal(mesg[j]['cng'], "nc", mesg[j]['tk']);
                      // }
                      if (mesg[j]['tbq']) {
                        data[i]['tbq'] = mesg[j]['tbq']
                      }
                      if (mesg[j]['tsq']) {
                        data[i]['tsq'] = mesg[j]['tsq']
                      }
                      if (mesg[j]['ltt'] != undefined) {
                        if (mesg[j]['ltt'] != 'NA') {
                          data[i]['lasttradedtime'] = mesg[j]['ltt'];
                        }
                      }
                      if (mesg[j]['ltq'] != undefined) {
                        data[i]['ltq'] = mesg[j]['ltq']
                      }
                      // if (mesg[j]['to'] != undefined) {
                      //   this.totalPrice = mesg[j]['to'];
                      // }
                      if (mesg[j]['ap']) {
                        data[i]['ap'] = mesg[j]['ap'];
                      }
                      //OPEN INTEREST                 
                      if (mesg[j]['oi']) {
                        // console.log(mesg[j]['oi'])
                        data[i]['oi'] = mesg[j]['oi'];
                        // this.openI = mesg[j]['oi'];
                      }
                      // LOWER CIRCUIT LIMIT
                      if (mesg[j]['lcl']) {
                        this.lowPrice = mesg[j]['lcl'];
                      }
                      //HIGHER CIRCUIT LIMIT
                      if (mesg[j]['ucl']) {
                        this.highPrice = mesg[j]['ucl'];
                      }

                      if (mesg[j]['ValueTradedToday']) {
                        data[i]['ttv'] = 0.00;
                      }
                      if (document.getElementById('ltpBack_' + mesg[j]['tk']) != null) {
                        let prevLtp = document.getElementById('ltpBack_' + mesg[j]['tk']).innerHTML;
                        if (mesg[j]['ltp'] > prevLtp) {
                          if (document.getElementById('ltpBack_' + mesg[j]['tk']) != null) {
                            document.getElementById('ltpBack_' + mesg[j]['tk']).classList.add('animate-background-green');
                            setTimeout(() => {
                              if (document.getElementById('ltpBack_' + mesg[j]['tk']) != null) {
                                document.getElementById('ltpBack_' + mesg[j]['tk']).classList.remove('animate-background-green');
                              }
                            }, 500);
                          }
                        } else if (mesg[j]['ltp'] < prevLtp) {
                          if (document.getElementById('ltpBack_' + mesg[j]['tk']) != null) {
                            document.getElementById('ltpBack_' + mesg[j]['tk']).classList.add('animate-background-red');
                            setTimeout(() => {
                              if (document.getElementById('ltpBack_' + mesg[j]['tk']) != null) {
                                document.getElementById('ltpBack_' + mesg[j]['tk']).classList.remove('animate-background-red');
                              }
                            }, 500);
                          }
                        } else if (mesg[j]['ltp'] == prevLtp && mesg[j]['v'] > data[i]['PrevVolume']) {
                          if (document.getElementById('ltpBack_' + mesg[j]['tk']) != null) {
                            document.getElementById('ltpBack_' + mesg[j]['tk']).classList.add('animate-background-green');
                            setTimeout(() => {
                              if (document.getElementById('ltpBack_' + mesg[j]['tk']) != null) {
                                document.getElementById('ltpBack_' + mesg[j]['tk']).classList.remove('animate-background-green');
                              }
                            }, 500);
                          }
                        }
                      }
                    }
                    if (document.getElementById('pers_' + mesg[j]['tk']) != null && mesg[j]['nc'] != undefined) {
                      document.getElementById('pers_' + mesg[j]['tk']).innerHTML = '(' + Number(mesg[j]['nc']).toFixed(2) + '%)';
                      if (mesg[j]['nc'] > 0) {
                        document.getElementById('pers_' + mesg[j]['tk']).style.color = 'green';
                      } else if (mesg[j]['nc'] < 0) {
                        document.getElementById('pers_' + mesg[j]['tk']).style.color = 'red';
                      } else {
                      }
                    }
                    if (document.getElementById('change_' + mesg[j]['tk']) != null && mesg[j]['cng'] != undefined) {
                      document.getElementById('change_' + mesg[j]['tk']).innerHTML = Number(mesg[j]['cng']).toFixed(2);
                      if (mesg[j]['cng'] > 0) {
                        document.getElementById('change_' + mesg[j]['tk']).style.color = 'green';
                      } else if (mesg[j]['cng'] < 0) {
                        document.getElementById('change_' + mesg[j]['tk']).style.color = 'red';
                      } else {

                      }
                    }
                  }
                  if (mesg[j]['tk'] == "Nifty 50" || mesg[j]['tk'] == "SENSEX") {
                    if (mesg[j]['iv']) {
                      this.appComp.receiveIndexVal(mesg[j]['iv'], "iv", mesg[j]['tk']);

                    }
                    if (mesg[j]['cng']) {
                      data[i]['cng'] = mesg[j]['cng']
                      this.appComp.receiveIndexVal(mesg[j]['cng'], "cng", mesg[j]['tk']);
                    }
                    if (mesg[j]['nc']) {
                      data[i]['nc'] = mesg[j]['nc']
                      this.appComp.receiveIndexVal(mesg[j]['cng'], "nc", mesg[j]['tk']);
                    }
                  }
                  break;
                default:
                  break;
              }
            })
          });
          localStorage.setItem("scripsmkt", JSON.stringify(data));
          sessionStorage.setItem("localMW", JSON.stringify(data));
        }
        if (response[0]['ak'] != undefined && response[0]['ak'] == "ok" && response[0]['task'] == this.sfiwtch) {
          this.orderWatchStream();
        }
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  orderWatchStream() {
    var jsonSendObjj = {
      "channel": "",
      "task": this.orderWatch,
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    this.odgenserv.mWatch.next(jsonSendObjj);
  }

  /**
   * after connecting with MW sockets subscriptions to get data
   */
  sendMessage() {
    if (this.mktWatch != undefined || this.mktWatch != null) {
      var jsonSendObj = {
        "channel": this.mwCall,
        "task": this.mktWatch,
        "acctid": this.odgenserv.getUserId(),
        "user": this.odgenserv.getUserId(),
        "token": this.odgenserv.getSessionToken()
      };
      this.odgenserv.mWatch.next(jsonSendObj);
    }
    if (this.sfiwtch != undefined || this.sfiwtch != null) {
      var jsonSendObjj = {
        "channel": "nse_cm|Nifty 50&bse_cm|SENSEX",
        "task": this.sfiwtch,
        "acctid": this.odgenserv.getUserId(),
        "user": this.odgenserv.getUserId(),
        "token": this.odgenserv.getSessionToken()
      };
      this.odgenserv.mWatch.next(jsonSendObjj);
    }
    if (this.mwCall != undefined || this.mwCall != null) {
      var jsonSendObject = {
        "channel": this.mwCall,
        "task": "os",
        "acctid": this.odgenserv.getUserId(),
        "user": this.odgenserv.getUserId(),
        "token": this.odgenserv.getSessionToken()
      };
      this.odgenserv.mWatch.next(jsonSendObject);
    }
    if (this.sfiwtch != undefined || this.sfiwtch != null) {
      var jsonSendObjsen = {
        "channel": this.senxname == "SENSEX" ? "bse_cm|" + this.senxname : "nse_cm|" + this.senxname,
        "task": this.sfiwtch,
        "acctid": this.odgenserv.getUserId(),
        "user": this.odgenserv.getUserId(),
        "token": this.odgenserv.getSessionToken()
      };
      this.odgenserv.mWatch.next(jsonSendObjsen);
      var jsonSendObjjnifty = {
        "channel": this.nifname == "SENSEX" ? "bse_cm|" + this.nifname : "nse_cm|" + this.nifname,
        "task": this.sfiwtch,
        "acctid": this.odgenserv.getUserId(),
        "user": this.odgenserv.getUserId(),
        "token": this.odgenserv.getSessionToken()
      };
      this.odgenserv.mWatch.next(jsonSendObjjnifty);
    }
  }

  getsearchItems(e) {
    if (e.length >= 2) {
      if (e) {
        let searchJSON = {
          "symbol": ((e).trim()).toLocaleUpperCase(),
          "exchange": this.segmentfiltervalue == 'All' ? this.asyncScriptTabs : this.tempSegment
        };
        this.odgenserv.symbsearch(searchJSON).subscribe(data => {
          this.showList = true;
          for (let idx of data) {
            var indxid = data.indexOf(idx);
            data[indxid]['checked'] = false;
          }
          data.map(idex => {
            // if (idex['instrument_type'] == 'OPTIDX' || idex['instrument_type'] == 'OPTSTK' || idex['instrument_type'] == 'OPTFUT' || idex['instrument_type'] == 'OPTCUR') {
            //   let strike = idex.strike_price.split('.')[1] > 0 ? idex.strike_price : idex.strike_price.split('.')[0];
            //   idex['instrumentOptidx'] = idex['symbol'] + ' ' + new Date(idex['expiry_date']).getDate() + this.months[new Date(idex['expiry_date']).getMonth()] + ' ' + Number(strike).toFixed(2) + ' ' + idex['option_type'];
            // }
            // if (idex['instrument_type'] != undefined || idex['instrument_type'] != null) {
            //   if (idex['instrument_type'].startsWith('FUT')) {
            //     idex['instrumentFut'] = idex['symbol'] + ' ' + new Date(idex['expiry_date']).getDate() + this.months[new Date(idex['expiry_date']).getMonth()] + ' FUT';
            //   }
            // }
            this.scripsmkt.map(idex2 => {
              if (idex2['token'] == idex['token']) {
                idex['checked'] = true;
              }
            });
          });
          // console.log(data)
          this.searchList = data;
        }, (err) => {
          if (err.error == "Unauthorized") {
            // this.appComp.hideHeaderDetails();
            this.wsService.close();
            this.spinnerService.stop();
            this.routeTo.navigateByUrl('login');
          }
        });
      } else {
        this.showList = false;
      }
    } else {
      this.showList = false;
    }
  }

  setSelectVal(slctData, edit) {
    this.mktload = true;
    var token = {
      "userId": this.odgenserv.getUserId(),
      "mwName": this.selectedItem,
      "exch": slctData['exch'] != undefined ? slctData['exch'] : slctData['Exchange'],
      "symbol": slctData['token']
    }
    if (edit == "add") {
      this.odgenserv.addToMW(token).subscribe(data => {
        if (data.stat == "Ok" && data.Result == "success") {
          if (this.searchList.length > 0) {
            for (let idex of this.searchList) {
              var idxid: number = this.searchList.indexOf(idex);
              if (idex['symbol'] == slctData['symbol']) {
                this.searchList[idxid]['checked'] = false;
              }
            }
          }
          // this.toastr.successToastr('Successfully added to the Market Watch List', 'Market Watch List', { showCloseButton: true });
          this.fetchMWlist();
        } else {
          this.toastr.errorToastr('failed', 'Market Watch List', { showCloseButton: true });
          this.searchbox = "";
        }
      }, (err) => {
        if (err.error == "Unauthorized") {
          // this.appComp.hideHeaderDetails();
          this.wsService.close();
          this.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        }
      });
    } else {
      this.odgenserv.delMWscrip(token).subscribe(data => {
        // this.toastr.successToastr('Deleted successfully', 'Market Watch List', { showCloseButton: true });
        this.fetchMWlist();
      }, (err) => {
        if (err.error == "Unauthorized") {
          // this.appComp.hideHeaderDetails();
          this.wsService.close();
          this.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        }
      });
    }
  }

  /**
   * func to placescripsOrder/DelOrder from MKTList
   * @param scrOrder 
   * @param clicTyp 
   */
  scripsPOrd(scrOrder, clicTyp) {
    this.ordertiktoken = scrOrder['token'];
    switch (clicTyp) {
      case 'buy':
        this.appComp.setmktVal(clicTyp, scrOrder, 'mktwatch');
        break;
      case 'sell':
        this.appComp.setmktVal(clicTyp, scrOrder, 'mktwatch');
        break;
      case 'del':
        this.setSelectVal(scrOrder, clicTyp);
        break;
      case 'modify':
        this.appComp.setmktVal(clicTyp, scrOrder, 'orderModify');
    }
  }

  /**
   * func to show depth for clicked row
   * @param val 
   * @param i 
   * @param bstype
   */
  showDepth(val, i) {
    var previndex = i;
    this.scripsmkt.map((item) => {
      if (item['token'] == val['token']) {
        if (item['showDP']) {
          item['showDP'] = false;
          this.mktWatch = "mw";
          this.sendMessage();
        } else {
          item['showDP'] = true;
          this.mktWatch = "dp";
          this.sendMessage();
          this.getPricerange(val);
          this.getSecurityInfo(val);
          this.getShowQuotes(val);
        }
      }
    })
  }

  //TO GET THE PRICE RANGE FROM SERVICE 
  getPricerange(param) {
    let jsonObj = {
      "exch": param['Exchange'],
      "symbol": param['token'],
      "userId": this.odrServ.getUserId(),
      "userSessionID": this.odrServ.getSessionToken(),
    }
    this.odrServ.getPriceRange(jsonObj).subscribe(resp => {
      if (resp['stat'] == "Ok") {
        this.lowPrice = resp['lowercircuitlimit'];
        this.highPrice = resp['highercircuitlimit'];
        this.openI = resp['openinterest'];
        this.scripsmkt.map(item => {
          if (param['TradSym'] == item['TradSym']) {
            item['bno'] = resp['BOrders1'];
            item['bno1'] = resp['BOrders2'];
            item['bno2'] = resp['BOrders3'];
            item['bno3'] = resp['BOrders4'];
            item['bno4'] = resp['BOrders5'];
            item['bp'] =  +resp['BPrice1'].toString().replace(',','');
            item['bp'] = item['bp'].toFixed(2);
            item['bp1'] = +resp['BPrice2'].toString().replace(',','');
            item['bp1'] = item['bp1'].toFixed(2);
            item['bp2'] = +resp['BPrice3'].toString().replace(',','');
            item['bp2'] = item['bp2'].toFixed(2);
            item['bp3'] = +resp['BPrice4'].toString().replace(',','');
            item['bp3'] = item['bp3'].toFixed(2); 
            item['bp4'] = +resp['BPrice5'].toString().replace(',','');
            item['bp4'] = item['bp4'].toFixed(2)
            item['bq'] = resp['BQty1'];
            item['bq1'] = resp['BQty2'];
            item['bq2'] = resp['BQty3'];
            item['bq3'] = resp['BQty4'];
            item['bq4'] = resp['BQty5'];
            item['sno'] = resp['SOrders1'];
            item['sno1'] = resp['SOrders2'];
            item['sno2'] = resp['SOrders3'];
            item['sno3'] = resp['SOrders4'];
            item['sno4'] = resp['SOrders5'];
            item['sp'] = +resp['SPrice1'].toString().replace(',','');
            item['sp'] = item['sp'].toFixed(2);
            item['sp1'] = +resp['SPrice2'].toString().replace(',','');
            item['sp1'] = item['sp1'].toFixed(2);
            item['sp2'] = +resp['SPrice3'].toString().replace(',','');
            item['sp2'] = item['sp2'].toFixed(2);
            item['sp3'] = +resp['SPrice4'].toString().replace(',','');
            item['sp3'] = item['sp3'].toFixed(2);
            item['sp4'] = +resp['SPrice5'].toString().replace(',','');
            item['sp4'] = item['sp4'].toFixed(2);
            item['bs'] = resp['SQty1'];
            item['bs1'] = resp['SQty2'];
            item['bs2'] = resp['SQty3'];
            item['bs3'] = resp['SQty4'];
            item['bs4'] = resp['SQty5'];
            item['tbq'] = resp['totalbuyqty'];
            item['tsq'] = resp['totalsellqty'];
            item['v'] = resp['volume'];
            item['ap'] = resp['weightedavg'];
          }
        })
      }
      if (resp['emsg'] == "Session Expired") {
        this.toastr.errorToastr('failed', 'Session Expired', { showCloseButton: true });
        this.wsService.close();
        // this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.wsService.close();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  //TO GET TTP VALUE IN DEPTH VIEW 
  getSecurityInfo(param) {
    // console.log(param)
    let jsonObj = {
      "exch": param['Exchange'],
      "symbol": param['token'],
      "userId": this.odrServ.getUserId(),
      "userSessionID": this.odrServ.getSessionToken(),
    }
    this.odrServ.getSecurityInfo(jsonObj).subscribe(resp => {
      // console.log(this.scripsmkt)
      if (resp['stat'] == "Ok") {
        if (resp['ValueTradedToday'] != 'NA') {
          this.scripsmkt.map((res) => {
            if (param['token'] == res['token']) {
              res['ttv'] = resp['ValueTradedToday']
            }
          });
        } else {
          this.scripsmkt.map((res) => {
            if (param['token'] == res['token']) {
              res['ttv'] = resp['ValueTradedToday']
            }
          });
        }
      }
    },
      (err) => {
        if (err.error == "Unauthorized") {
          this.wsService.close();
          this.routeTo.navigateByUrl('login');
        }
      });
  }

  indexloadChart(indexchart) {
    console.log(indexchart)
    var defaultchart : string = localStorage.getItem("defaultchart");
    if(defaultchart != "tradeview"){
      var count = Object.keys(indexchart).length
      if (count > 4) {
        let exchange = indexchart['indexExch'].replace("_cm", "");
        if (exchange.toLowerCase() === 'mcx'
          || exchange.toLowerCase() === 'cds'
          || exchange.toLowerCase() === 'nfo') {
          this._symbol = indexchart['IndexName'] + "::" + exchange.toLocaleUpperCase() + "::" + "Index";
          localStorage.setItem('indexGraph', this._symbol);
        } else {
          this._symbol = indexchart['indexName'] + "::" + exchange.toLocaleUpperCase() + "::" + "Index";
          localStorage.setItem('indexGraph', this._symbol);
        }
        if (this.routeTo.url == '/home/main') {
          this.renderChart();
        } else {
          this.routeTo.navigateByUrl("home/main");
        }
      } else {
        let exchange = indexchart['IndexExch'].replace("_cm", "");
        if (exchange.toLowerCase() === 'mcx'
          || exchange.toLowerCase() === 'cds'
          || exchange.toLowerCase() === 'nfo') {
          this._symbol = indexchart['IndexName'] + "::" + exchange.toLocaleUpperCase() + "::" + "Index";
          localStorage.setItem('indexGraph', this._symbol);
        } else {
          this._symbol = indexchart['IndexName'] + "::" + exchange.toLocaleUpperCase() + "::" + "Index";
          localStorage.setItem('indexGraph', this._symbol);
        }
        if (this.routeTo.url == '/home/main') {
          this.renderChart();
        } else {
          this.routeTo.navigateByUrl("home/main");
        }
      }
    }else{
      let exgseg = indexchart['IndexExch']; 
      let exchange = indexchart['IndexExch'].replace("_cm", "");
      var data = {
        isCallIndex:true,
        symbol: indexchart['IndexName'].toUpperCase(),
        name: indexchart['IndexName'].toUpperCase(),
        exchDisp: exchange.toUpperCase()+"::index",
        symbolid: 0,
        exgseg: exgseg
      };
      this.getActiveIndexId(data);
    }
  }

  loadChart(val) {
    var defaultchart : string = localStorage.getItem("defaultchart");
    if(defaultchart == "tradeview"){
      var data = {
        isCallIndex:false,
        symbol: val['symbolname'],
        name: val['companyname'],
        exchDisp: val['Exchange'],
        symbolid: val['token'],
        exgseg:val['ExchSeg']
      };
      localStorage.setItem("_customSymbol",JSON.stringify(data));
      customChangeSymbol();
    }else{
      localStorage.setItem('currentGraph', JSON.stringify(val));
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
  }

  /**
   * Method to get index symbolId from service
   * @param data
   * @since Selvakumar K
   */
  getActiveIndexId(data){
    var jsonData = this.odgenserv.baseURL+"chart/symbols"+"?symbol="+ data['symbol']+"::"+data['exchDisp'];
    this.http.get(jsonData).subscribe((res)=>{
      console.log(res)
      var result : any = res;
      data['symbolid'] = result['ticker'];
      localStorage.setItem("_customSymbol",JSON.stringify(data));
      customChangeSymbol();
    },(err)=>{
      console.log(err.error)
    });
  }

  /**
   * executes Order from appcontent when clicking buy/sell button
   */
  executeOrders() {
    this.dataService.ordersMsgShare.subscribe(data => {
      if (data) {
        // this.getOrders("excuteOrders");
      }
    });
  }

  getUserInfo() {
    this.userInfo = [];
    let exch = [];
    let pcode = [];
    let prc = [];
    let seg = this.odgenserv.getUserSettingDto()['exch'];
    let code = this.odgenserv.getUserSettingDto()['pCode'];
    let typ = this.odgenserv.getUserSettingDto()['prctyp'];
    seg.map(item => {
      exch.push(item);
    });
    this.exch = exch.join(", ");
    code.map(item => {
      pcode.push(item);
    });
    this.pCode = pcode.join(", ");
    typ.map(item => {
      prc.push(item);
    });
    this.prctyp = prc.join(", ");
    var jsonData = {
      "accountId": this.odgenserv.getUserSettingDto().account_id,
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken(),
    };
    this.odgenserv.getUserInfo(jsonData).subscribe(data => {
      if (data.emsg == "Session Expired") {
        this.toastr.errorToastr('failed', 'Session Expired', { showCloseButton: true });
        // this.appComp.hideHeaderDetails();
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      this.userInfo.push(data);
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.changepwdform.controls; }

  goToSaveChangePassword() {
    var jsonData = {
      "newPassword": this.newpwd,
      "oldPassword": this.oldpwd,
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken(),
    };
    this.odgenserv.changePassword(jsonData).subscribe(data => {
      if (data.emsg == "Session Expired") {
        this.toastr.errorToastr('failed', 'Session Expired', { showCloseButton: true });
        // this.appComp.hideHeaderDetails();
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (data.stat == "Not_Ok") {
        this.toastr.errorToastr(data.emsg, '', { showCloseButton: true });
      }
      if (data.stat == "Ok") {
        this.toastr.successToastr(data.emsg, '', { showCloseButton: true });
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  // custom validator to check that two fields match
  // matchConfirmPassword(controlName: string, matchingControlName: string) {
  //   return (formGroup: FormGroup) => {
  //       const control = formGroup.controls[controlName];
  //       const matchingControl = formGroup.controls[matchingControlName];

  //       if (matchingControl.errors && !matchingControl.errors.mustMatch) {
  //           // return if another validator has already found an error on the matchingControl
  //           return;
  //       }

  //       // set error on matchingControl if validation fails
  //       if (control.value !== matchingControl.value) {
  //           matchingControl.setErrors({ mustMatch: true });
  //       } else {
  //           matchingControl.setErrors(null);
  //       }
  //   }
  // }

  //Method to get Exchange message
  getExchangeMsg() {
    let jsonObj = {
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken(),
      "exch": ''
    }
    this.odgenserv.getExchMsg(jsonObj).subscribe(data => {
      if (data['stat'] == "Ok") {
        this.exchMessage = data['Exchmsg'].split("/n");
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  //Method to convert position
  convertPosition(param) {
    let jsonObj = {
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken(),
      "branchId": this.odgenserv.getUserSettingDto().branch_id,
      "brokerName": this.odgenserv.getUserSettingDto().broker_name,
      "account_id": this.odgenserv.getUserSettingDto().account_id,
      "s_prdt_ali": this.odgenserv.getUserSettingDto().s_prdt_ali,
      "pCode": param.Pcode,
      "productToCode": param.Pcode == "NRML" ? "MIS" : "NRML",
      "exch": param.Exchange,
      "qty": param.Netqty,
      "tsym": param.Tsym,
      "transtype": param.Netqty > 0 ? 'B' : 'S',
      "tockenNo": param.Token,
      "type": param.Type
    }

    this.odgenserv.convertPosition(jsonObj).subscribe(data => {
      if (data['stat'] == "Not_Ok") {
        this.toastr.successToastr(data.emsg, '', { showCloseButton: true });
      } else {
        if (data['stat'] == "Ok") {
          this.toastr.successToastr(data['Result'], '', { showCloseButton: true });
        }
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  /**
   * @method methed to show Sceurity Infomation
   * @params script,index
   * @return --
   * @author Selva 
   * @on 25/06/2019
   */
  saveQuickTradeDetails() {
    for (let idx of this.quickTrades) {
      let idxId: number = this.quickTrades.indexOf(idx);
      this.quickTrades[idxId]['user_id'] = this.odrServ.getUserId();
    }
    this.odgenserv.saveQuickTradeSettings(this.quickTrades).subscribe(res => {
      if (res['stat'] == 'Ok') {
        this.toastr.successToastr(res['emsg'], '', { showCloseButton: true });
      }
    }, (err) => {
      console.log(err.error)
    });
  }

  /**
   * @method methed to update quick Trade settings
   * @params --
   * @return --
   * @author Selva 
   * @on 18/07/2019
   */
  updateQuickTradeDetails() {
    this.odgenserv.updateQuickTradeSettings(this.quickTrades).subscribe(res => {
      if (res['emsg'] == 'SUCCESS') {
        this.toastr.successToastr(res['emsg'], '', { showCloseButton: true });
      }
    }, (err) => {
      console.log(err.error)
    });
  }

  /**
 * @method methed to get Sceurity Infomation
 * @params script,index
 * @return --
 * @author Selva 
 * @on 25/06/2019
 */
  showSecurityInfo(scrip, index) {
    // let jsonData = {
    //   "exch": scrip['Exchange'],
    //   "symbol": scrip['token'],
    //   "userId": this.odgenserv.getUserId(),
    //   "userSessionID": this.odgenserv.getSessionToken()
    // }
    // this.odgenserv.getSecurityInfo(jsonData).subscribe((res) => {
    //   if (res.emsg == "Session Expired") {
    //     this.routeTo.navigateByUrl('login');
    //   } else {
    //     let result: any = res;
    // if (result['stat'] == 'Ok') {
    const dialogRef = this.dialog.open(SecurityinfoComponent, {
      width: '650px',
      height: '420px',
      data: scrip
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.routeTo.navigateByUrl('login');
      }
    });
    //   }
    // }
    // }, (err) => {
    //   console.log(err.error);
    //   this.routeTo.navigateByUrl('login');
    // })
  }

  /**
   * @method methed to show Sceurity Infomation
   * @params script,index
   * @return --
   * @author Selva 
   * @on 25/06/2019
   */
  // showSecurityInfo(scrip, index) {
  //   const dialogRef = this.dialog.open(SecurityinfoComponent, {
  //     width: '650px',
  //     height: '420px',
  //     data: scrip
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }

  closeItems() {
    if (this.showList != false) {
      setTimeout(() => {
        this.searchbox = "";
        this.searchList = [];
        this.showFilter = false;
      }, 300)
    }
    else {
      this.showList = false;
    }
  }

  /**
  * Method to change Quick Trade Price button change
  * @Paramer 
  * @Return
  * @Author Dhivya
  * @On 21/06/2019
  */
  priceTypeBtnChanges(exch, value) {
    for (let obj of this.quickTrades) {
      let idxId = this.quickTrades.indexOf(obj);
      if (obj.exchange_seg == exch) {
        this.quickTrades[idxId]['order_type'] = value;
        this.quickTrades[idxId]['changed'] = true;
      }
    }
  }

  /**
   * Method to change Quick Trade Price button change
   * @Paramer 
   * @Return
   * @Author Dhivya
   * @On 21/06/2019
   */
  productTypeBtnChanges(exch, value) {
    for (let obj of this.quickTrades) {
      let prodId = this.quickTrades.indexOf(obj);
      if (obj.exchange_seg == exch) {
        this.quickTrades[prodId]['product_type'] = value;
        this.quickTrades[prodId]['changed'] = true;
      }
    }
  }

  /**
   * Method to change Quick Trade quantity
   * @Paramer segment,event
   * @Return
   * @Author Selva
   * @On 21/06/2019
   */
  changeTradeQty(exch, value) {
    for (let obj of this.quickTrades) {
      let prodId = this.quickTrades.indexOf(obj);
      if (obj.exchange_seg == exch) {
        this.quickTrades[prodId]['qty'] = value;
        this.quickTrades[prodId]['changed'] = true;
      }
    }
  }

  /**
  * Method to quick trade disable and enable 
  * @Paramer 
  * @Return
  * @Author selva
  * @On 21/06/2019
  */
  toggleChange(event) {
    this.quickTrades = [];
    if (event.checked == true) {
      this.toggleOn = false;
      this.getQuickTradeDetails(event.checked);
    } else {
      this.toggleOn = true;
      this.getQuickTradeDetails(event.checked);
    }
  }

  /**
  * Method to get quick trade details to set value
  * @Paramer 
  * @Return
  * @Author selva
  * @On 21/06/2019
  */
  getQuickTradeDetails(event) {
    var jsonData = {
      "user_id": this.odrServ.getUserId(),
      "quickToggle": event,
    }
    this.odgenserv.getQuickTradeToggle(jsonData).subscribe(res => {
      if (res.length > 0) {
        this.updateQuickTrade = true;
        res.map(item => {
          this.quickTrades.push({
            "active_status": item['active_status'],
            "changed": item['changed'],
            "created_by": item['created_by'],
            "created_on": item['created_on'],
            "exchange_seg": item['exchange_seg'],
            "id": item['id'],
            "order_type": item['order_type'] == null ? "MKT" : item['order_type'],
            "product_type": item['product_type'] == null ? "CNC" : item['product_type'],
            "qty": item['qty'],
            "quickToggle": item['quickToggle'],
            "total_amount": item['total_amount'],
            "updated_by": item['updated_by'],
            "updated_on": item['updated_on'],
            "user_id": item['user_id'],
          });
        });
      } else {
        this.quickTrades = [];
        for (let idx of this.exchArray) {
          this.quickTrades.push({
            "active_status": 0,
            "changed": false,
            "created_by": "",
            "created_on": "",
            "exchange_seg": idx,
            "id": 0,
            "order_type": "MKT",
            "product_type": "CNC",
            "qty": 1,
            "quickToggle": false,
            "total_amount": 0,
            "updated_by": "",
            "updated_on": "",
            "user_id": "",
          });
        }
        this.updateQuickTrade = false;
      }
    }, (err) => {
      console.log(err.error)
    });
  }

  /**
  * Method to get quick trade details to set value
  * @Paramer 
  * @Return
  * @Author selva
  * @On 21/06/2019
  */
  exitBOCOOrder(elem) {
    let usersettings: any = this.odgenserv.getUserSettingDto()
    if (elem.Pcode == 'CO') {
      var jsonData = {
        "userId": this.odrServ.getUserId(),
        "userSessionID": this.odrServ.getSessionToken(),
        "nestOrderNumber": elem.Nstordno,
        "s_prdt_ali": usersettings.s_prdt_ali,
      }
      this.odgenserv.getExitCOOrder(jsonData).subscribe(res => {
        if (res.stat == "Ok") {
          // this.getOrders("");
        }
        if (res.Emsg == "Session Expired") {
          this.toastr.errorToastr('failed', 'Session Expired', { showCloseButton: true });
          this.wsService.close();
          // this.appComp.hideHeaderDetails();
          this.routeTo.navigateByUrl('login');
        }
      }, (err) => {
        console.log(err.error)
      });
    }
    if (elem.Pcode == 'BO') {
      var jsonBoData = {
        "userId": this.odrServ.getUserId(),
        "userSessionID": this.odrServ.getSessionToken(),
        "status": elem.Status,
        "symbolOrderId": elem.SyomOrderId,
        "nestOrderNumber": elem.Nstordno
      }
      this.odgenserv.getExitBOOrder(jsonBoData).subscribe(res => {
        if (res.stat == "Ok") {
          // this.getOrders("");
        }
        if (res.Emsg == "Session Expired") {
          this.toastr.errorToastr('failed', 'Session Expired', { showCloseButton: true });
          this.wsService.close();
          // this.appComp.hideHeaderDetails();
          this.routeTo.navigateByUrl('login');
        }
      }, (err) => {
        console.log(err.error)
      });
    }
  }

  /**
     * @method Method to set trading view chart
     * @params na
     * @return na
     * @author Babin 
     * @on 26-06-2019
     */
  renderChart() {
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
    const tvWidget = new widget(widgetOptions);
    this._tvWidget = tvWidget;
    tvWidget.onChartReady(() => {
    });
  }

  /**
     * @method Method to set trading view chart
     * @params na
     * @return na
     * @author Babin 
     * @on 26-06-2019
     */
  renderChartCall() {
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
    const tvWidget = new widget(widgetOptions);
    this._tvWidget = tvWidget;
    tvWidget.onChartReady(() => {
    });
    this.routeTo.navigateByUrl("main");
  }


  //Method to get Token key payin and payout
  getPayInPayOutTokenKey(payType) {
    var jsonData = {
    }
    this.odgenserv.payInpayOutConnToken(jsonData).subscribe(res => {
      if (res['stat'] == 'Ok') {
        if (payType == 'Deposit') {
          var pUrl = this.odgenserv.payInUrl + ".jsp?sLoginId=" + this.odgenserv.getUserId() + "&token=" + res['SessionToken'] + "&sAccountId=" + this.odgenserv.getUserSettingDto().account_id;
          window.open(pUrl, '_blank');
        }
        if (payType == 'Withdraw') {
          var pUrl = this.odgenserv.payOutUrl + ".jsp?sLoginId=" + this.odgenserv.getUserId() + "&token=" + res['SessionToken'] + "&sAccountId=" + this.odgenserv.getUserSettingDto().account_id;
          window.open(pUrl, '_blank');
        }
      }
      if (res['stat'] == "Not_Ok") {
        this.toastr.errorToastr(res['emsg']);
      }
      if (res['stat'] == 'Session Expired') {
        this.toastr.errorToastr('failed', 'Session Expired', { showCloseButton: true });
        // this.appComp.hideHeaderDetails();
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    }, (err) => {
      console.log(err.error)
    });
  }

  openQuickTradeSettings(value) {
    console.log(value)
  }

  /**
   * func to set data to navbar nifty and sensex Value
   */
  // navFeed(scrpResp) {
  //   this.getIndex(scrpResp);
  //   // this.scrpResp = scrpResp;
  //   // this.leftindexchart = scrpResp['indexvalues'][1];
  //   // this.rightindexchart = scrpResp['indexvalues'][0];
  //   // this.profileName = this.odrServ.getUserId();
  //   // this.nifindexChange = scrpResp['indexvalues'][1]['indexChange'];
  //   // this.nifindexVal = scrpResp['indexvalues'][1]['indexVal'];
  //   // this.nifPer = scrpResp['indexvalues'][1]['indexPerChange'];
  //   // this.nifname = scrpResp['indexvalues'][1]['indexName'];
  //   // this.senxindexChange = scrpResp['indexvalues'][0]['indexChange'];
  //   // this.senxindexVal = scrpResp['indexvalues'][0]['indexVal'];
  //   // this.senxPer = scrpResp['indexvalues'][0]['indexPerChange'];
  //   // this.senxname = scrpResp['indexvalues'][0]['indexName'];
  // }

  openNewTabCoEarn() {
    window.open("http://coearn.zebuetrade.com", "_blank");
  }

  openIronGatesDoc() {
    window.open("https://zebull.in/#/zebullDoc/intro", "_blank");
  }

  showMarketStatus() {
    // this.routeTo.navigateByUrl("/home/marketstatus");
    // const dialogRef = this.dialog.open(MarketstatusComponent, {
    //   width: '400px',
    //   height: '250px',
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  logout() {
    this.odrServ.zebuLogout().subscribe(res => {
      clearInterval(this.reconnection);
      clearInterval(this.reconnmsg);
      this.socketConnectionClose();
      localStorage.clear();
      if (res["stat"] == "Ok") {
        this.websocket.close();
        localStorage.clear();
        this.nifname = "";
        this.routeTo.navigate(["login"]);
      }
      if (res["emsg"] == "Session Expired") {
        this.wsService.close();
        localStorage.clear();
        this.nifname = "";
        this.routeTo.navigate(["login"]);
      }
    }, (err) => {
      if (err == "Unauthorized") {
        this.wsService.close();
        localStorage.clear();
        this.nifname = "";
        this.routeTo.navigate(["login"]);
      }
    });
  }


  // Market Watch Drag and Drop List
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.scripsmkt, event.previousIndex, event.currentIndex);
    var userFetch = {
      'userId': this.odgenserv.getUserId(),
    }
    this.odgenserv.fetchMList(userFetch).subscribe(mwResp => {
      if (mwResp['emsg'] == "Session Expired") {
        this.toastr.errorToastr('failed', 'Session Expired', { showCloseButton: true });
        this.wsService.close();
        // this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (mwResp['stat'] == "Ok") {
        this.mwgrp1 = mwResp['values'][0] != null || mwResp['values'][0] != undefined ? mwResp['values'][0] : "mwGrp1";
        this.mwgrp2 = mwResp['values'][1] != null || mwResp['values'][1] != undefined ? mwResp['values'][1] : "mwGrp2";
        this.mwgrp3 = mwResp['values'][2] != null || mwResp['values'][2] != undefined ? mwResp['values'][2] : "mwGrp3";
        this.mwgrp4 = mwResp['values'][3] != null || mwResp['values'][3] != undefined ? mwResp['values'][3] : "mwGrp4";
        this.mwgrp5 = mwResp['values'][4] != null || mwResp['values'][4] != undefined ? mwResp['values'][4] : "mwGrp5";
        this.marketWatchSortingList(this.mwgrp1);
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  marketWatchSortingList(mwgrp: String) {
    var sortArray: Array<string> = [];
    for (let i of this.scripsmkt) {
      sortArray.push(i.Exchange + "|" + i.token);
    }
    var excToken: String = sortArray.toString().replace(/,/g, "|");
    var getSortObj = {
      "mwName": mwgrp,
      "list": mwgrp + "|" + excToken,
      "userId": this.odgenserv.getUserId()
    };
    this.odgenserv.sortingMWList(getSortObj).subscribe(data => {
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  // openFilterScript() {
  //   // var element = document.getElementById("filter_id");
  //   // element.style.display = 'block';
  // }

  getCurrentScriptFilter(event) {
    var scripId: string = event['index'];
    this.tempSegment = [];
    for (let idx in this.asyncScriptTabs) {
      if (idx == scripId) {
        this.segmentfiltervalue = this.asyncScriptTabs[idx];
        this.tempSegment.push(this.segmentfiltervalue);
      }
    }
  }

  // function to remove array element
  remove_array_element(array, n) {
    var index = array.indexOf(n);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  }

  /**
  * @method methed to get Index details and popup dialog box
  * @params --
  * @return --
  * @author Selva 
  * @on 18/07/2019
  */
  openTickDataName() {
    var indexNames: any = [];
    var jsonData = {
      "userId": this.odrServ.getUserId(),
      "exch": "NSE"
    }
    this.odrServ.getIndexDetails(jsonData).subscribe(res => {
      if (res['stat'] == "Ok") {
        for (let idx in res['IndexDetail']) {
          if (!res['IndexDetail'][idx]['IndexName'].startsWith('\"', 0)) {
            res['IndexDetail'][idx]['IndexExch'] = 'nse_cm';
            indexNames.push(res['IndexDetail'][idx]);
          }
        }
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });

    var jsonData = {
      "userId": this.odrServ.getUserId(),
      "exch": "BSE"
    }
    this.odrServ.getIndexDetails(jsonData).subscribe(res => {
      if (res['stat'] == "Ok") {
        let all = res['IndexDetail']; let temp = [];
        for (let i in all) {
          if (!all[i]['IndexName'].startsWith('\"', 0)) {
            all[i]['IndexExch'] = 'bse_cm';
            temp.push(all[i]);
          }
        }
        temp.map(item => {
          if (item['IndexName'] == "SENSEX") {
            indexNames.push(item);
          }
        });
        this.indexnamelist = indexNames;
        localStorage.setItem("indexnamelist", JSON.stringify(indexNames));
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  showIndexList(position) {
    var indexlist: any = JSON.parse(localStorage.getItem("indexnamelist"));
    const dialogRef = this.dialog.open(IndexlistComponent, {
      width: '380px',
      height: '88%',
      data: { "idxList": indexlist, "position": position, "nifname": this.nifname, "senxname": this.senxname },
      position: { left: '0', top: '50px' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (position > 0) {
          this.rightindexchart = result;
          this.senxname = result['IndexName'];
          this.appComp._isSensexCall = result['IndexName'];
          this.senxindexVal = result['IndexValue'];
          this.senxindexChange = ((Number(result['IndexChange']) / (Number(result['IndexValue']) + Number(result['IndexChange']))) * 100).toFixed(2);
          var jsonSendObjj = {
            "channel": this.senxname == "SENSEX" ? "bse_cm|" + this.senxname : "nse_cm|" + this.senxname,
            "task": this.sfiwtch,
            "acctid": this.odgenserv.getUserId(),
            "user": this.odgenserv.getUserId(),
            "token": this.odgenserv.getSessionToken()
          };
          this.odgenserv.mWatch.next(jsonSendObjj);
        } else {
          this.leftindexchart = result;
          this.nifname = result['IndexName'];
          this.appComp._isNiftyCall = result['IndexName'];
          this.nifindexVal = result['IndexValue'];
          this.nifindexChange = ((Number(result['IndexChange']) / (Number(result['IndexValue']) + Number(result['IndexChange']))) * 100).toFixed(2)
          var jsonSendObjj = {
            "channel": this.nifname == "SENSEX" ? "bse_cm|" + this.nifname : "nse_cm|" + this.nifname,
            "task": this.sfiwtch,
            "acctid": this.odgenserv.getUserId(),
            "user": this.odgenserv.getUserId(),
            "token": this.odgenserv.getSessionToken()
          };
          this.odgenserv.mWatch.next(jsonSendObjj);
        }
      }
    });
  }

  openTickOnLoad(idxname, position) {
    var indexNames: any = [];
    var jsonData = {
      "userId": this.odrServ.getUserId(),
      "exch": "NSE"
    }
    this.odrServ.getIndexDetails(jsonData).subscribe(res => {
      if (res['stat'] == "Ok") {
        for (let idx in res['IndexDetail']) {
          if (!res['IndexDetail'][idx]['IndexName'].startsWith('\"', 0)) {
            if (res['IndexDetail'][idx]['IndexName'] != idxname) {
              indexNames.push(res['IndexDetail'][idx]);
              for (let idx of indexNames) {
                if (idx['IndexName'] == this.nifname && idx['IndexName'] == this.senxname) {
                  this.remove_array_element(idxname, idx);
                }
                if (idx['IndexName'] == this.senxname && idx['IndexName'] == this.nifname) {
                  this.remove_array_element(idxname, idx);
                }
              }
            }
          }
        }
      }
    }, (err) => {
      console.log(err.error)
    });
    var jsonData = {
      "userId": this.odrServ.getUserId(),
      "exch": "BSE"
    }
    this.odrServ.getIndexDetails(jsonData).subscribe(res => {
      if (res['stat'] == "Ok") {
        let all = res['IndexDetail']; let temp = [];
        for (let i in all) {
          if (!all[i]['IndexName'].startsWith('\"', 0)) {
            temp.push(all[i]);
          }
        }
        for (let idex of temp) {
          indexNames.push(idex);
        }
        this.indexnamelist = indexNames;
        for (let idx of indexNames) {
          if (idx['IndexName'] == this.nifname && idx['IndexName'] == this.senxname) {
            this.remove_array_element(idxname, idx);
          }
          if (idx['IndexName'] == this.senxname && idx['IndexName'] == this.nifname) {
            this.remove_array_element(idxname, idx);
          }
        }
        localStorage.setItem("indexnamelist", JSON.stringify(indexNames));
      }
      // this.getIndex();
    }, (err) => {
      console.log(err.error)
    });
  }

  openCustomerSupportDialog() {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    const dialogRef = this.dialog.open(CustomersupportComponent, {
      width: width < 411 ? "90% " : "50%",
      height: width < 411 ? "90% " : "47%",
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openNewWindowOptionChian() {
    window.open("/#/optionchain", '_blank');
  }

  openOrderGen() {
    window.open("/#/ordergen", '_blank');
  }

  /**
  * @method methed to set Index value
  * @params --
  * @return --
  * @author Selva 
  * @on 01/09/2019
  */
  navFeed(scrpResp) {
    if (Array.isArray(scrpResp['indexvalues'])) {
      this.scrpResp = scrpResp;
      this.leftindexchart = scrpResp['indexvalues'][1];
      this.rightindexchart = scrpResp['indexvalues'][0];
      this.profileName = this.odrServ.getUserId();
      this.nifindexChange = scrpResp['indexvalues'][1]['indexChange'];
      this.nifindexVal = scrpResp['indexvalues'][1]['indexVal'];
      this.nifPer = scrpResp['indexvalues'][1]['indexPerChange'];
      this.nifname = scrpResp['indexvalues'][1]['indexName'];
      this.senxindexChange = scrpResp['indexvalues'][0]['indexChange'];
      this.senxindexVal = scrpResp['indexvalues'][0]['indexVal'];
      this.senxPer = scrpResp['indexvalues'][0]['indexPerChange'];
      this.senxname = scrpResp['indexvalues'][0]['indexName'];
      this.appComp._isSensexCall = scrpResp['indexvalues'][0]['indexName'];
      this.appComp._isNiftyCall = scrpResp['indexvalues'][1]['indexName'];
    }
    this.indexnamelist = JSON.parse(localStorage.getItem("indexnamelist"));
    let jsonObj = {
      user_id: this.odgenserv.getUserId(),
    }
    this.odgenserv.getDetails(jsonObj).subscribe(resp => {
      this.spinnerService.stop();
      if (resp['emsg'] == "Session Expired") {
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (resp['stat'] == "Not_Ok") {
        if (Array.isArray(scrpResp['indexvalues'])) {
          this.scrpResp = scrpResp;
          this.leftindexchart = scrpResp['indexvalues'][1];
          this.rightindexchart = scrpResp['indexvalues'][0];
          this.profileName = this.odrServ.getUserId();
          this.nifindexChange = scrpResp['indexvalues'][1]['indexChange'];
          this.nifindexVal = scrpResp['indexvalues'][1]['indexVal'];
          this.nifPer = scrpResp['indexvalues'][1]['indexPerChange'];
          this.nifname = scrpResp['indexvalues'][1]['indexName'];
          this.senxindexChange = scrpResp['indexvalues'][0]['indexChange'];
          this.senxindexVal = scrpResp['indexvalues'][0]['indexVal'];
          this.senxPer = scrpResp['indexvalues'][0]['indexPerChange'];
          this.senxname = scrpResp['indexvalues'][0]['indexName'];
          this.appComp._isSensexCall = scrpResp['indexvalues'][0]['indexName'];
          this.appComp._isNiftyCall = scrpResp['indexvalues'][1]['indexName'];
        }
      }
      if (Array.isArray(resp)) {
        if (Array.isArray(scrpResp['indexvalues'])) {
          this.scrpResp = scrpResp;
          this.leftindexchart = scrpResp['indexvalues'][1];
          this.rightindexchart = scrpResp['indexvalues'][0];
          this.profileName = this.odrServ.getUserId();
          this.nifindexChange = scrpResp['indexvalues'][1]['indexChange'];
          this.nifindexVal = scrpResp['indexvalues'][1]['indexVal'];
          this.nifPer = scrpResp['indexvalues'][1]['indexPerChange'];
          this.nifname = scrpResp['indexvalues'][1]['indexName'];
          this.senxindexChange = scrpResp['indexvalues'][0]['indexChange'];
          this.senxindexVal = scrpResp['indexvalues'][0]['indexVal'];
          this.senxPer = scrpResp['indexvalues'][0]['indexPerChange'];
          this.senxname = scrpResp['indexvalues'][0]['indexName'];
          this.appComp._isSensexCall = scrpResp['indexvalues'][0]['indexName'];
          this.appComp._isNiftyCall = scrpResp['indexvalues'][1]['indexName'];
        }
        for (let idx of resp) {
          if (idx['position'] == 2) {
            if (Array.isArray(this.indexnamelist)) {
              for (let idxname of this.indexnamelist) {
                if (idxname['IndexName'] == idx['index_name']) {
                  this.rightindexchart = idxname;
                  this.senxPer = '0.00';
                  this.senxname = idxname['IndexName'];
                  this.appComp._isSensexCall = idxname['IndexName'];
                  this.senxindexVal = idxname['IndexValue'];
                  this.senxindexChange = ((Number(idxname['IndexChange']) / (Number(idxname['IndexValue']) + Number(idxname['IndexChange']))) * 100).toFixed(2);
                  localStorage.setItem("rightindex", this.senxname);
                }
              }
            }
          }
          if (idx['position'] == 1) {
            if (Array.isArray(this.indexnamelist)) {
              for (let idxname of this.indexnamelist) {
                if (idxname['IndexName'] == idx['index_name']) {
                  this.leftindexchart = idxname
                  this.nifPer = '0.00';
                  this.nifname = idxname['IndexName'];
                  this.appComp._isNiftyCall = idxname['IndexName'];
                  this.nifindexVal = idxname['IndexValue'];
                  this.nifindexChange = ((Number(idxname['IndexChange']) / (Number(idxname['IndexValue']) + Number(idxname['IndexChange']))) * 100).toFixed(2);
                  localStorage.setItem("leftindex", this.nifname);
                }
              }
            }
          }
        }
        // this.callSocketConnMW();
      } else {
        this.scrpResp = scrpResp;
        this.leftindexchart = scrpResp['indexvalues'][1];
        this.rightindexchart = scrpResp['indexvalues'][0];
        this.profileName = this.odrServ.getUserId();
        this.nifindexChange = scrpResp['indexvalues'][1]['indexChange'];
        this.nifindexVal = scrpResp['indexvalues'][1]['indexVal'];
        this.nifPer = scrpResp['indexvalues'][1]['indexPerChange'];
        this.nifname = scrpResp['indexvalues'][1]['indexName'];
        this.senxindexChange = scrpResp['indexvalues'][0]['indexChange'];
        this.senxindexVal = scrpResp['indexvalues'][0]['indexVal'];
        this.senxPer = scrpResp['indexvalues'][0]['indexPerChange'];
        this.senxname = scrpResp['indexvalues'][0]['indexName'];
        this.appComp._isNiftyCall = scrpResp['indexvalues'][1]['indexName'];
        this.appComp._isSensexCall = scrpResp['indexvalues'][0]['indexName'];
      }

    }, (err) => {
      if (err.error == "Unauthorized") {
        this.wsService.close();
        // this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    })
  }

  socketConnectionClose() {
    var jsonSendObj = {
      "channel": "",
      "task": "",
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    this.odgenserv.mWatch.next(jsonSendObj);
  }

  fillterByMarketWatchGroup(event) {
    console.log(event.target.textContent)
    var fillter = (event.target.textContent).trim();
    for (let idex of this.filterlist) {
      var idexid: number = this.filterlist.indexOf(idex);
      if (idex['name'] == fillter) {
        if (idex['name'] == 'A-Z') {
          if (idex['select']) {
            this.filterlist[idexid]['select'] = false;
            this.scripsmkt.sort((a, b) => a.TradSym.localeCompare(b.TradSym));
          } else {
            this.filterlist[idexid]['select'] = true;
            this.scripsmkt.sort((a, b) => b.TradSym.localeCompare(a.TradSym));
          }
        }
        if (idex['name'] == 'Percentage(%)') {
          if (idex['select']) {
            this.filterlist[idexid]['select'] = false;
            this.scripsmkt.sort((a, b) => a.PerChange.localeCompare(b.PerChange));
          } else {
            this.filterlist[idexid]['select'] = true;
            this.scripsmkt.sort((a, b) => b.PerChange.localeCompare(a.PerChange));
          }
        }
        if (idex['name'] == 'LTP') {
          if (idex['select']) {
            this.filterlist[idexid]['select'] = false;
            this.scripsmkt.sort((a, b) => a.ltp.localeCompare(b.ltp));
          } else {
            this.filterlist[idexid]['select'] = true;
            this.scripsmkt.sort((a, b) => b.ltp.localeCompare(a.ltp));
          }
        }
        if (idex['name'] == 'Exchange') {
          if (idex['select']) {
            this.filterlist[idexid]['select'] = false;
            this.scripsmkt.sort((a, b) => a.Exchange.localeCompare(b.Exchange));
          } else {
            this.filterlist[idexid]['select'] = true;
            this.scripsmkt.sort((a, b) => b.Exchange.localeCompare(a.Exchange));
          }
        }

      } else {
        this.filterlist[idexid]['select'] = false;
      }
    }
  }

  //Method to subscribe security trade alert
  getSecurityAlert(scrip) {
    const dialogRef = this.dialog.open(TradeAlertComponent, {
      width: '400px',
      data: scrip
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  getShowQuotes(scrip) {
    var jsonData = {
      "exch": scrip['Exchange'],
      "symbol": scrip['token'],
      "userId": this.odrServ.getUserId(),
      "userSessionID": this.odrServ.getSessionToken()
    }
    this.odgenserv.sendScriptTokenDepth(jsonData).subscribe(res => {
      if (res['emsg'] == "Session Expired") {
        // this.appComp.hideHeaderDetails();
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      this.scripsmkt.map(item => {
        if (res['stat'] != "Not_Ok") {
          if (scrip['TradSym'] == item['TradSym']) {
            item['lut'] = res['exchFeedTime'].split(' ')[1];
            item['ltq'] = res['LTQ'];
            this.bodLotQty = res['BodLotQty'];
          }
        }
      })
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.wsService.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  /**
 * @method methed to show Sceurity Infomation
 * @params script,index
 * @return --
 * @author Selva 
 * @on 25/06/2019
 */
  showLogoutAlert() {
    const dialogRef = this.dialog.open(DialogLogoutComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.websocket.close();
        localStorage.clear();
        this.routeTo.navigate(["login"]);
      }
    });
  }

  //open side menu
  openNav() {
    document.getElementById("mySidepanel").style.width = "250px";
  }

  //close side menu
  closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
  }
 }




