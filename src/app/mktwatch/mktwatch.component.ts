
import { Component, EventEmitter, OnInit, Output, OnDestroy, ViewChild, HostListener, Input } from '@angular/core';

import { AfterViewInit, ElementRef } from '@angular/core';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { WebsocketService } from '../services/websocket.service';
import { OrderhistorydialogComponent } from '../orderhistorydialog/orderhistorydialog.component';
// import { OrderCancelConfirmDialogBoxComponent } from '../OrderCancelConfirmdialogboxcomponent/OrderCancelConfirmdialogboxcomponent.component';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { interval } from 'rxjs';
import { SharedataserviceService } from '../services/sharedataservice.service';
import { DataTableDirective } from 'angular-datatables';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatCardModule } from '@angular/material/card';
import { TradingView } from "../../assets/charting_library/chart.js";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable } from 'rxjs';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import * as alertify from 'alertifyjs'
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SecurityinfoComponent } from '../securityinfo/securityinfo.component';
import { FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import 'rxjs/add/operator/map';
import { Datafeed } from '../chart/datafeed';
import { ChartingLibraryWidgetOptions, IChartingLibraryWidget, widget } from 'src/assets/charting_library/charting_library.min';
@Component({
  selector: 'app-mktwatch',
  templateUrl: './mktwatch.component.html',
  styleUrls: ['./mktwatch.component.scss'],


})

export class MktwatchComponent implements OnInit, OnDestroy, AfterViewInit {
  exchArray: any = [];
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
  isClicked = [];
  scripsmkt: any = [];
  showList: boolean;
  searchList: any;
  err: any;
  showDepLst: boolean;
  mwCall: any;
  mwListLength: Number;
  timeLeft: number = 60;
  interval;
  holdingvisible = false;
  mktWatch: any = "mw";
  sfiwtch: any = "sfi";
  orderWatch: any = "os";
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
  oldpwd: any;
  newpwd: any;
  confnewpwd: any;
  changepwdform: FormGroup;
  submitted = false;
  mktlistload: Boolean = false;
  oneTimeSubscribe: Boolean = true;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
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
  updateQuickTrade: boolean = false;
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
  quickTrades: any = [];
  constructor(public odgenserv: ZebuodrGentrService, private snackBar: MatSnackBar,
    public routeTo: Router, public appComp: AppComponent, private formBuilder: FormBuilder,
    private spinnerService: NgxUiLoaderService, public dialog: MatDialog,
    public dataService: SharedataserviceService,
    private changeDetector: ChangeDetectorRef,
    public toastr: ToastrManager, private elementRef: ElementRef, public odrServ: ZebuodrGentrService, public websocket: WebsocketService
  ) {
    //this.getPositions();
    // this.getHoldings();
    // this.getOrders("");
    // this.executeOrders();
    // this.getFunds();
    // this.getTradeBooks();
  }

  ngOnInit() {
    this.appComp._isTogglePage = 'main';
    var userId = this.odgenserv.getUserId();
    if (sessionStorage.getItem("localMW") != null || sessionStorage.getItem("localMW") != undefined) {
      var data = JSON.parse(sessionStorage.getItem("localMW"));
      for (let idx of data) {
        if (idx['UserId'] == userId) {
          this.scripsmkt = data['ScriptMKT'];
        }
      }
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
    //:TODO This should be changed to web socket based implementation
    interval(600000 * 60).subscribe(x => {
      // this.getPositions();
      // this.getFunds();
      // this.getHoldings();
    });
    this.spinnerService.start();
    this.getUserInfo();
    this.getExchangeMsg();//Exchange Message
    let exch = this.odgenserv.getUserSettingDto();
    this.exchArray = exch['exch'];
  }

  ngOnDestroy() {

  }
  ionViewDidEnter() {
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
  }

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
          self.orderCancel(param);
        }
      });
  }

  ngAfterViewInit() {
    this.renderChart();
    this.fetchMWlist();
    setInterval(() => {
      this.counter++;
      if (this.counter > 10) {
        this.counter = 0;
        this.sendMessage();
      }
    }, 1000);
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
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (mwResp['emsg'] == "No_MarketWatch " && mwResp['stat'] == "Not_Ok") {
        this.mwgrp1 = this.autoGenerateMWListKey();
        this.mwgrp2 = this.autoGenerateMWListKey();
        this.mwgrp3 = this.autoGenerateMWListKey();
        this.mwgrp4 = this.autoGenerateMWListKey();
        this.mwgrp5 = this.autoGenerateMWListKey();
        this.selectedItem = this.mwgrp1;
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
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
    this.callSocketConnMW();
  }


  autoGenerateMWListKey() {
    var text = "mwGrp";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 2; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  /** Fetching the list of scrips in that market watch */
  marktgrp(val) {
    this.mktlistload = true;
    this.selectedItem = val;
    var jsonScrips = {
      "userId": this.odgenserv.getUserId(),
      "mwName": val
    }
    this.odgenserv.fetchMScrp(jsonScrips).subscribe(scrpResp => {
      var mwLst = [];
      if (scrpResp['emsg'] == "Session Expired") {
        localStorage.clear();
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (scrpResp['stat'] == "Ok") {
        this.nomktwtc = false;
        this.scripsmkt = scrpResp['values'];
        //Stored Local storaged
        // var res = JSON.parse(sessionStorage.getItem("localMW"));
        // var localJson = {
        //   "UserId": this.odgenserv.getUserId(),
        //   "ScriptMKT": this.scripsmkt
        // }
        // res.push(localJson);
        // sessionStorage.setItem("localMW", JSON.stringify(res));
        console.log("MarketWatch OHCL ==>", this.scripsmkt)
        for (let x = this.scripsmkt.length - 1; x >= 0; x--) {
          if (this.scripsmkt[x]['Exchange'] == 'X') {
            this.scripsmkt.splice(x, 1);
          }
        }
        this.scripsmkt.map(item => {
          mwLst.push(item['ExchSeg'] + '|' + item['token']);
        })
        this.mwCall = mwLst.join("&");
        this.spinnerService.stop();
        this.mktload = false;
        this.mktlistload = false;
        this.callSocketConnMW();
        this.appComp.NavFeed(scrpResp);
      } else if (scrpResp['stat'] == "Not_Ok" && scrpResp['emsg'] == "Not able to Retrieve MarketWatch ") {
        this.mktlistload = false;
        this.nomktwtc = true;
        this.nomktmsg = scrpResp['emsg'];
        this.callSocketConnMW();
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  /**
   * WebSocket for market watch
   */
  callSocketConnMW() {
    var jsonSendObj = {
      "channel": "",
      "task": "cn",
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    this.odgenserv.mWatch.next(jsonSendObj);
    this.odgenserv.mWatch.subscribe(msg => {
      if (JSON.parse(msg)[0]['ak'] != undefined && JSON.parse(msg)[0]['ak'] == "ok" && JSON.parse(msg)[0]['task'] == "cn") {
        console.log("cn Connected");
        this.sendMessage();
      } else {
        var data = this.scripsmkt;
        var mesg = JSON.parse(msg);
        data.map((item, i) => {
          mesg.map((msgg, j) => {
            if (mesg[j]['name'] == "tm") {
              this.tValue = mesg[j]['tvalue'];
              this.counter = 0;
            }
            switch (this.mktWatch) {
              case "mw":
                if (data[i]['token'] == mesg[j]['tk'] && mesg[j]['ltt'] != 'NA') {

                  if (mesg[j]['ltp']) {
                    data[i]['prevLtp'] = data[i]['ltp'];
                    data[i]['ltp'] = mesg[j]['ltp'] == undefined ? '0' : mesg[j]['ltp'];
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
                  if (mesg[j]['name'] == 'sf') {
                    let prevLtp = document.getElementById('ltpBack_' + mesg[j]['tk']);
                    prevLtp.innerHTML;
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
                  if (document.getElementById('pers_' + mesg[j]['tk']) != null && mesg[j]['nc'] != undefined) {
                    document.getElementById('pers_' + mesg[j]['tk']).innerHTML = '(' + Number(mesg[j]['nc']).toFixed(2) + '%)';
                    if (mesg[j]['nc'] > 0) {
                      document.getElementById('pers_' + mesg[j]['tk']).style.color = 'green';
                    } else if (mesg[j]['nc'] < 0) {
                      document.getElementById('pers_' + mesg[j]['tk']).style.color = 'red';
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
                    if (mesg[j]['v']) {
                      data[i]['PrevVolume'] = data[i]['v'];
                      data[i]['v'] = mesg[j]['v'] == undefined ? '0' : mesg[j]['v'];
                    }
                    if (mesg[j]['v']) {
                      data[i]['Prevvolume'] = data[i]['v'];
                    }
                    if (mesg[j]['bp']) {
                      data[i]['bp'] = mesg[j]['bp']
                    }
                    if (mesg[j]['bno']) {
                      data[i]['bno'] = mesg[j]['bno']
                    }
                    if (mesg[j]['bq']) {
                      data[i]['bq'] = mesg[j]['bq']
                    }

                    if (mesg[j]['sp']) {
                      data[i]['sp'] = mesg[j]['sp']
                    }
                    if (mesg[j]['sno']) {
                      data[i]['sno'] = mesg[j]['sno']
                    }
                    if (mesg[j]['bs']) {
                      data[i]['bs'] = mesg[j]['bs']
                    }

                    if (mesg[j]['bp1']) {
                      data[i]['bp1'] = mesg[j]['bp1']
                    }
                    if (mesg[j]['bno1']) {
                      data[i]['bno1'] = mesg[j]['bno1']
                    }
                    if (mesg[j]['bq1']) {
                      data[i]['bq1'] = mesg[j]['bq1']
                    }

                    if (mesg[j]['sp1']) {
                      data[i]['sp1'] = mesg[j]['sp1']
                    }
                    if (mesg[j]['sno1']) {
                      data[i]['sno1'] = mesg[j]['sno1']
                    }
                    if (mesg[j]['bs1']) {
                      data[i]['bs1'] = mesg[j]['bs1']
                    }

                    if (mesg[j]['bp2']) {
                      data[i]['bp2'] = mesg[j]['bp2']
                    }
                    if (mesg[j]['bno2']) {
                      data[i]['bno2'] = mesg[j]['bno2']
                    }
                    if (mesg[j]['bq2']) {
                      data[i]['bq2'] = mesg[j]['bq2']
                    }
                    if (mesg[j]['sp2']) {
                      data[i]['sp2'] = mesg[j]['sp2']
                    }
                    if (mesg[j]['sno2']) {
                      data[i]['sno2'] = mesg[j]['sno2']
                    }
                    if (mesg[j]['bs2']) {
                      data[i]['bs2'] = mesg[j]['bs2']
                    }
                    if (mesg[j]['bp3']) {
                      data[i]['bp3'] = mesg[j]['bp3']
                    }
                    if (mesg[j]['bno3']) {
                      data[i]['bno3'] = mesg[j]['bno3']
                    }
                    if (mesg[j]['bq3']) {
                      data[i]['bq3'] = mesg[j]['bq3']
                    }
                    if (mesg[j]['sp3']) {
                      data[i]['sp3'] = mesg[j]['sp3']
                    }
                    if (mesg[j]['sno3']) {
                      data[i]['sno3'] = mesg[j]['sno3']
                    }
                    if (mesg[j]['bs3']) {
                      data[i]['bs3'] = mesg[j]['bs3']
                    }
                    if (mesg[j]['bp4']) {
                      data[i]['bp4'] = mesg[j]['bp4']
                    }
                    if (mesg[j]['bno4']) {
                      data[i]['bno4'] = mesg[j]['bno4']
                    }
                    if (mesg[j]['bq4']) {
                      data[i]['bq4'] = mesg[j]['bq4']
                    }

                    if (mesg[j]['sp4']) {
                      data[i]['sp4'] = mesg[j]['sp4']
                    }
                    if (mesg[j]['sno4']) {
                      data[i]['sno4'] = mesg[j]['sno4']
                    }
                    if (mesg[j]['bs4']) {
                      data[i]['bs4'] = mesg[j]['bs4']
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
                    if (mesg[j]['to'] != undefined) {
                      data[i]['v'] = mesg[j]['to'];
                    }
                    if (mesg[j]['ap']) {
                      data[i]['ap'] = mesg[j]['ap'];
                    }
                    //OPEN INTEREST                 
                    if (mesg[j]['oi']) {
                      this.openI = mesg[j]['oi'];
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
                      this.totalPrice = mesg[j]['to'];
                    }
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
                  if (document.getElementById('pers_' + mesg[j]['tk']) != null && mesg[j]['nc'] != undefined) {
                    document.getElementById('pers_' + mesg[j]['tk']).innerHTML = '(' + Number(mesg[j]['nc']).toFixed(2) + '%)';
                    if (mesg[j]['nc'] > 0) {
                      document.getElementById('pers_' + mesg[j]['tk']).style.color = 'green';
                    } else if (mesg[j]['nc'] < 0) {
                      document.getElementById('pers_' + mesg[j]['tk']).style.color = 'red';
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
        })
      }
      if (JSON.parse(msg)[0]['ak'] != undefined && JSON.parse(msg)[0]['ak'] == "ok" && JSON.parse(msg)[0]['task'] == this.sfiwtch) {
        this.orderWatchStream();
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
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
    var jsonSendObj = {
      "channel": this.mwCall,
      "task": this.mktWatch,
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    this.odgenserv.mWatch.next(jsonSendObj);
    var jsonSendObjj = {
      "channel": "nse_cm|Nifty 50&bse_cm|SENSEX",
      "task": this.sfiwtch,
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    this.odgenserv.mWatch.next(jsonSendObjj);
  }

  getsearchItems(e) {
    if (e.length >= 2) {
      if (e) {
        let searchJSON = { "symbol": ((e).trim()).toLocaleUpperCase() };
        this.odgenserv.symbsearch(searchJSON).subscribe(data => {
          this.showList = true;
          this.searchList = data;
        }, (err) => {
          if (err.error == "Unauthorized") {
            this.appComp.hideHeaderDetails();
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
          this.toastr.successToastr('Successfully added to the Market Watch List', 'Market Watch List', { showCloseButton: true });
          this.fetchMWlist();
          this.searchbox = "";
        } else {
          this.toastr.errorToastr('failed', 'Market Watch List', { showCloseButton: true });
          this.searchbox = "";
        }
      }, (err) => {
        if (err.error == "Unauthorized") {
          this.appComp.hideHeaderDetails();
          this.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        }

      });
      this.showList = false;
    } else {
      this.odgenserv.delMWscrip(token).subscribe(data => {
        this.toastr.successToastr('Deleted successfully', 'Market Watch List', { showCloseButton: true });
        this.fetchMWlist();
      }, (err) => {
        if (err.error == "Unauthorized") {
          this.appComp.hideHeaderDetails();
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
            item['bp'] = resp['BPrice1'];
            item['bp1'] = resp['BPrice2'];
            item['bp2'] = resp['BPrice3'];
            item['bp3'] = resp['BPrice4'];
            item['bp4'] = resp['BPrice5'];
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
            item['sp'] = resp['SPrice1'];
            item['sp1'] = resp['SPrice2'];
            item['sp2'] = resp['SPrice3'];
            item['sp3'] = resp['SPrice4'];
            item['sp4'] = resp['SPrice5'];
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
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    },
      (err) => {
        if (err.error == "Unauthorized") {
          this.routeTo.navigateByUrl('login');
        }
      });
  }

  //TO GET TTP VALUE IN DEPTH VIEW 
  getSecurityInfo(param) {
    let jsonObj = {
      "exch": param['Exchange'],
      "symbol": param['token'],
      "userId": this.odrServ.getUserId(),
      "userSessionID": this.odrServ.getSessionToken(),
    }
    this.odrServ.getSecurityInfo(jsonObj).subscribe(resp => {
      if (resp['stat'] == "Ok") {
        if (resp['ValueTradedToday'] != 'NA') {
          this.totalPrice = resp['ValueTradedToday'];
        } else {
          this.totalPrice = resp['ValueTradedToday'];
        }
      }
    },
      (err) => {
        if (err.error == "Unauthorized") {
          this.routeTo.navigateByUrl('login');
        }
      });
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
   * executes Order from appcontent when clicking buy/sell button
   */
  executeOrders() {
    this.dataService.ordersMsgShare.subscribe(data => {
      if (data) {
        this.getOrders("excuteOrders");
      }
    });
  }

  expandCurrentData(itemName) {
    // console.log('expandCurrentData' + itemName);
  }

  getPositions() {
    var getusrOdrs = {
      "ret": 'NET',
      "userSettingDto": this.odgenserv.getUserSettingDto(),
      "userId": this.odgenserv.getUserId()
    };
    this.odgenserv.positionAndHolding(getusrOdrs).subscribe(data => {
      if (data.emsg == "Session Expired") {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (Array.isArray(data)) {
        this.positionsvisible = true;
        this.position = data;
      } else if (data.stat == 'Not_Ok' && data.emsg == 'No Data' || data.stat == null || data.emsg == null || data.stat == undefined || data.emsg == undefined) {
        this.positionsvisible = false;
        this.position = [];
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });

  }

  //***Temp */
  getPositionsTemp() {
    var getusrOdrs = {
      "ret": 'NET',
      "userSettingDto": this.odgenserv.getUserSettingDto(),
      "userId": this.odgenserv.getUserId()
    };
    this.odgenserv.positionAndHoldingTemp(getusrOdrs).subscribe(data => {
      if (data.emsg == "Session Expired") {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (Array.isArray(data)) {
        this.positionsvisible = true;
        this.position = data;
      } else if (data.stat == 'Not_Ok' && data.emsg == 'No Data' || data.stat == null || data.emsg == null || data.stat == undefined || data.emsg == undefined) {
        this.positionsvisible = false;
        this.position = [];
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  //***Temp */
  getHoldingsTemp() {
    var getusrOdrs = {
      "ret": 'NET',
      "userSettingDto": this.odgenserv.getUserSettingDto(),
      "userId": this.odgenserv.getUserId()
    };
    this.odgenserv.holdingsTemp(getusrOdrs).subscribe(data => {
      if (data.emsg == 'Session Expired') {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (data.stat == 'Ok') {
        this.holdingvisible = true;
        let total = data.Totalval;
        this.holdingtotalvalue = total.TotalNSEHoldingValue;
        this.holdings = data.HoldingVal;
      } else if (data.stat == 'Not_Ok' && data.Emsg == 'No Data' || data.stat == null || data.emsg == null || data.stat == undefined || data.emsg == undefined) {
        this.holdingvisible = false;
        this.holdings = [];
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
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
    this.odgenserv.holding(getusrOdrs).subscribe(data => {
      if (data.emsg == 'Session Expired') {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (data.stat == 'Ok') {
        this.holdingvisible = true;
        let total = data.Totalval;
        this.holdingtotalvalue = total.TotalNSEHoldingValue;
        this.holdings = data.HoldingVal;
      } else if (data.stat == 'Not_Ok' && data.Emsg == 'No Data' || data.stat == null || data.emsg == null || data.stat == undefined || data.emsg == undefined) {
        this.holdingvisible = false;
        this.holdings = [];
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  //Temporary order book data
  getOrdersTemp() {
    var getusrOdrs = {
      "ret": 'NET',
      "userSettingDto": this.odgenserv.getUserSettingDto(),
      "userId": this.odgenserv.getUserId()
    };
    this.odgenserv.ordersTemp("").subscribe(data => {
      if (data.emsg == 'Session Expired') {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (Array.isArray(data)) {
        this.ordervisible = true;
        this.orders = data;
      } else if (data.stat == 'Not_Ok' && data.Emsg == 'No Data' || data.stat == null || data.emsg == null || data.stat == undefined || data.emsg == undefined) {
        this.ordervisible = false;
        this.holdings = [];
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  /**Method to fetch orders from server and render in UI **/
  getOrders(exOrders) {
    this.orders = [];
    this.openOrder = [];
    this.completedOrder = [];
    var jsonObj = {
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken(),
      "userSettingDto": this.odgenserv.getUserSettingDto()
    }
    this.odgenserv.ordersBook(jsonObj).subscribe(resp => {
      if (resp.emsg == "Session Expired") {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (Array.isArray(resp)) {
        this.ordervisible = true;
        for (let idx of resp) {
          if (idx.Status == "complete") {
            this.completedOrder.push(idx);
          } else if (idx.Status == "open") {
            this.openOrder.push(idx);
          }
          this.orders.push(idx);
        }
        this.spinnerService.stop();
       // this.referchReferenceList();
      } else if (resp.stat == 'Not_Ok' && resp.Emsg == 'No Data' || resp.stat == null || resp.emsg == null || resp.stat == undefined || resp.emsg == undefined) {
        this.ordervisible = false;
        this.holdings = [];
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
        this.odgenserv.unAuth(err);
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  /**
 * Function to get trade book list
 * @params
 * @returns
 * @author Selva
 * @on 27/06/2019
 */
  getTradeBooks() {
    this.tradebook = [];
    var jsonObj = {
      "userId": this.odgenserv.getUserId(),
      "userSettingDto": this.odgenserv.getUserSettingDto()
    }
    this.odgenserv.getTradeBook(jsonObj).subscribe(resp => {
      if (resp.length > 0) {
        this.tradebook = resp;
      }
      if (resp.emsg == "Session Expired") {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    }, (err) => {
      this.appComp.hideHeaderDetails();
      this.spinnerService.stop();
      this.routeTo.navigateByUrl('login');
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
        if (data[0]['stat'] == "Ok") {
          this.appComp.getFunds(data);
          this.funds = [];
          this.funds.push(data[0]);
        } else {
          this.funds = [];
          this.funds.push(data);
        }
        if (data[0]['stat'] == 'Not_Ok' && data[0]['emsg'] == "Session Expired") {
          this.appComp.hideHeaderDetails();
          this.funds = [];
          this.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        }
        if (data[0]['stat'] == 'Not_Ok') {
          return;
        }
        if (data[0]['emsg'] == "Session Expired") {
          this.appComp.hideHeaderDetails();
          this.funds = [];
          this.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        }
      } else {
        if (data['stat'] == 'Not_Ok') {
          return;
        }
        if (data['emsg'] == "Session Expired") {
          this.appComp.hideHeaderDetails();
          this.funds = [];
          this.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        }
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
  //   this.spinnerService.start();
  //   var jsonObj = {
  //     "userId" : this.odgenserv.getUserId(),
  //     "userSessionID" :this.odgenserv.getSessionToken(),
  //     "userSettingDto": this.odgenserv.getUserSettingDto()
  //   }
  //   this.odgenserv.ordersBook(jsonObj).subscribe(resp=>{
  //  //   console.log("OrdersBookResponse",resp);
  //     if(resp[0]['stat'] != "Not_Ok" && resp[0]['stat'] != "Session Expired"){
  //       this.orders = resp;
  //    //   console.log("orders---",orders);
  //     }else if(resp[0]['stat'] == "Not_Ok" && resp[0]['Emsg'] == "Session Expired"){
  //       localStorage.clear();
  //       this.routeTo.navigateByUrl('login');
  //     }
  //     this.spinnerService.stop();
  //   },(err)=>{
  //  //   console.log(err);
  //     this.odgenserv.unAuth(err);
  //     this.spinnerService.stop();
  //   })
  // }

  showToast(resptoast) {
    var rejcolor = resptoast['Status'] == 'rejected' ? 'red' : '#0496ff';
    var buysell = resptoast['Trantype'] == 'B' && resptoast['Prctype'] == 'sl-limit' ? 'SL Triggered - Bought' : resptoast['Trantype'] == 'B' && resptoast['Prctype'] == 'limit' ? 'Bought' : resptoast['Trantype'] == 'B' && resptoast['Prctype'] == 'sl-market' ? 'SL-M Bought' : resptoast['Trantype'] == 'B' && resptoast['Prctype'] == 'market' ? 'MKT Bought' : resptoast['Trantype'] == 'S' && resptoast['Prctype'] == 'sl-limit' ? 'SL Triggered - Sold' : resptoast['Trantype'] == 'S' && resptoast['Prctype'] == 'limit' ? 'Sold' : resptoast['Trantype'] == 'S' && resptoast['Prctype'] == 'sl-market' ? 'SL-M Sold' : 'MKT Sold';
    var bgColor = resptoast['Trantype'] == 'B' && (resptoast['Prctype'] == 'limit' || resptoast['Prctype'] == 'market') ? '#0496ff' : '#f65140';

    this.toastr.customToastr(
      "<div class='col-md-12 col-xs-12 fSize12' style='background-color:" + bgColor + ";'>" + buysell + "</div>"
      + "<div class='col-md-6 col-xs-6 fSize12' style='color:" + rejcolor + ";text-transform: capitalize;'>" + resptoast['Status'] + "</div><div class='col-md-6 col-xs-6 text-right fSize12' style='color:black;white-space:nowrap'>" + resptoast['OrderedTime'] + "</div>"
      + "<div class='col-md-12 col-xs-12 fSize10' style='color:black;text-align: justify;'>" + resptoast['RejReason'] + "</div>",
      null,
      {
        enableHTML: true,
        animate: 'slideFromRight',
        showCloseButton: false,
        dismiss: "click"
      }
    );
  }

  // Market Watch Drag and Drop List
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.scripsmkt, event.previousIndex, event.currentIndex);
    var userFetch = {
      'userId': this.odgenserv.getUserId(),
    }
    this.odgenserv.fetchMList(userFetch).subscribe(mwResp => {
      if (mwResp['emsg'] == "Session Expired") {
        this.appComp.hideHeaderDetails();
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
        this.appComp.hideHeaderDetails();
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
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
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
          width: '90%',
          height: '60%',
          data: data
        });
        dialogRef.afterClosed().subscribe(result => {

        });
      } else {
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
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
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      if (data.stat == "Not_Ok") {
        this.toastr.errorToastr(data.Emsg, '', { showCloseButton: true });
      }
      if (data.stat == "Ok") {
        this.getOrders("");
        this.toastr.successToastr(data.Emsg, '', { showCloseButton: true });
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
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

  /** It Fatch the Holding object form table, put the object value to app.compount **/
  goToHoldingAdd(object: any) {
    this.appComp.addAndExitHoldingMWList('buy', object, 'mktwatch');
  }

  /** It Fatch the Holding object form table, put the object value to app.compount **/
  goToHoldingExit(object: any) {
    this.appComp.addAndExitHoldingMWList('sell', object, 'mktwatch');
  }

  /** If any Changes to Orderlist, To Referch Posintion, Fund and holding Function  **/
  // referchReferenceList() {
  //   this.getPositions();
  //   this.getFunds();
  //   this.getHoldings();
  // }

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
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      this.userInfo.push(data);
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
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
        this.appComp.hideHeaderDetails();
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
        this.appComp.hideHeaderDetails();
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
    },
      (err) => {
        if (err.error == "Unauthorized") {
          this.appComp.hideHeaderDetails();
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

      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
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
    console.log(this.quickTrades)
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
   * @method methed to show Sceurity Infomation
   * @params script,index
   * @return --
   * @author Selva 
   * @on 25/06/2019
   */
  showSecurityInfo(scrip, index) {
    const dialogRef = this.dialog.open(SecurityinfoComponent, {
      width: '500px',
      height: '600px',
      data: scrip
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  closeItems() {
    if (this.showList != false) {
      setTimeout(() => {
        this.searchbox = "";
        this.searchList = [];
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
          this.getOrders("");
        }
        if (res.Emsg == "Session Expired") {
          this.appComp.hideHeaderDetails();
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
          this.getOrders("");
        }
        if (res.Emsg == "Session Expired") {
          this.appComp.hideHeaderDetails();
          this.routeTo.navigateByUrl('login');
        }
      }, (err) => {
        console.log(err.error)
      });
    }
  }

  getShowQuotes(scrip) {
    var jsonData = {
      "exch": scrip['Exchange'],
      "symbol": scrip['token'],
      "userId": this.odrServ.getUserId(),
      "userSessionID": this.odrServ.getSessionToken()
    }
    this.odgenserv.sendScriptTokenDepth(jsonData).subscribe(res => {
      console.log(res);
      if (res['emsg'] == "Session Expired") {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      this.scripsmkt.map(item => {
        if (res['stat'] != "Not_Ok") {
          if (scrip['TradSym'] == item['TradSym']) {
            item['lut'] = res['exchFeedTime'].split(' ')[1];
            item['ltq'] = res['LTQ'];
          }
        }
      })
    }, (err) => {
      console.log(err.error)
    });
  }

  /**
     * @method Method to set trading view chart
     * @params na
     * @return na
     * @author Babin 
     * @on 26-06-2019
     */
  renderChart() {
    // debugger;
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

  //Method to get Token key payin and payout
  getPayInPayOutTokenKey(payType) {
    var jsonData = {
    }
    this.odgenserv.payInpayOutConnToken(jsonData).subscribe(res => {
      console.log(res)
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
        this.appComp.hideHeaderDetails();
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
}
