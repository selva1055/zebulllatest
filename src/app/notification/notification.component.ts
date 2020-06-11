// import { Component, OnInit, ViewChild } from '@angular/core';
// import { Router } from '@angular/router';
// import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';

// @Component({
//   selector: 'app-notification',
//   templateUrl: './notification.component.html',
//   styleUrls: ['./notification.component.scss']
// })
// export class NotificationComponent implements OnInit {
//   userInfo: any;
//   exch: any;
//   pCode: any;
//   prctyp: any;
//   constructor(public odgenserv: ZebuodrGentrService,public routeTo: Router) { }

//   ngOnInit() {
//     this.getUserInfo();
//   }
//   getUserInfo() {
//     this.userInfo = [];
//     let exch = [];
//     let pcode = [];
//     let prc = [];
//     let seg = this.odgenserv.getUserSettingDto()['exch'];
//     let code = this.odgenserv.getUserSettingDto()['pCode'];
//     let typ = this.odgenserv.getUserSettingDto()['prctyp'];
//     seg.map(item => {
//       exch.push(item);
//     });
//     this.exch = exch.join(", ");
//     code.map(item => {
//       pcode.push(item);
//     });
//     this.pCode = pcode.join(", ");
//     typ.map(item => {
//       prc.push(item);
//     });
//     this.prctyp = prc.join(", ");
//     var jsonData = {
//       "accountId": this.odgenserv.getUserSettingDto().account_id,
//       "userId": this.odgenserv.getUserId(),
//       "userSessionID": this.odgenserv.getSessionToken(),
//     };
//     this.odgenserv.getUserInfo(jsonData).subscribe(data => {
//       if (data.emsg == "Session Expired") {
//         // this.appComp.hideHeaderDetails();
//         // this.spinnerService.stop();
//         this.routeTo.navigateByUrl('zebulogin');
//       }
//       this.userInfo.push(data);
//     }, (err) => {
//       if (err.error == "Unauthorized") {
//         // this.appComp.hideHeaderDetails();
//         // this.spinnerService.stop();
//         this.routeTo.navigateByUrl('zebulogin');
//       }
//     });
//   }

// }


import { Component, EventEmitter, OnInit, Output, OnDestroy, ViewChild, HostListener, Input } from '@angular/core';

import { AfterViewInit, ElementRef } from '@angular/core';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { WebsocketService } from '../services/websocket.service';
import { OrderhistorydialogComponent } from '../orderhistorydialog/orderhistorydialog.component';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { interval } from 'rxjs';
import { SharedataserviceService } from '../services/sharedataservice.service';
import { DataTableDirective } from 'angular-datatables';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as alertify from 'alertifyjs'
import { SecurityinfoComponent } from '../securityinfo/securityinfo.component';
import { FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import 'rxjs/add/operator/map';
import { Datafeed } from '../chart/datafeed';
import { ChartingLibraryWidgetOptions, IChartingLibraryWidget, widget } from 'src/assets/charting_library/charting_library.min';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy, AfterViewInit {
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
  tValue: any;
  router: any;

  counter: number = 0;
  quickTrades: any = [];
  constructor(public odgenserv: ZebuodrGentrService, private snackBar: MatSnackBar,
    public routeTo: Router, public appComp: AppComponent, private formBuilder: FormBuilder,
    private spinnerService: NgxUiLoaderService, public dialog: MatDialog,
    public dataService: SharedataserviceService,
    private changeDetector: ChangeDetectorRef,
    public toastr: ToastrManager, private elementRef: ElementRef, public odrServ: ZebuodrGentrService, public websocket: WebsocketService
  ) {
  }

  ngOnInit() {
    // this.appComp._isTogglePage = 'main';
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
  
    this.spinnerService.start();
    this.getUserInfo();
    this.getExchangeMsg();//Exchange Message
    let exch = this.odgenserv.getUserSettingDto();
    this.exchArray = exch['exch'];
  }

  ngOnDestroy() {

  }


  ngAfterViewInit() {
    // this.renderChart();
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
    // this.callSocketConnMW();
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
      // if (scrpResp['stat'] == "Ok") {
      //   this.nomktwtc = false;
      //   this.scripsmkt = scrpResp['values'];
      //   console.log("MarketWatch OHCL ==>", this.scripsmkt)
      //   for (let x = this.scripsmkt.length - 1; x >= 0; x--) {
      //     if (this.scripsmkt[x]['Exchange'] == 'X') {
      //       this.scripsmkt.splice(x, 1);
      //     }
      //   }
      //   this.scripsmkt.map(item => {
      //     mwLst.push(item['ExchSeg'] + '|' + item['token']);
      //   })
      //   this.mwCall = mwLst.join("&");
      //   this.spinnerService.stop();
      //   this.mktload = false;
      //   this.mktlistload = false;
      //   // this.callSocketConnMW();
      //   this.appComp.NavFeed(scrpResp);
      // } 
      else if (scrpResp['stat'] == "Not_Ok" && scrpResp['emsg'] == "Not able to Retrieve MarketWatch ") {
        this.mktlistload = false;
        this.nomktwtc = true;
        this.nomktmsg = scrpResp['emsg'];
        // this.callSocketConnMW();
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
          // this.appComp.hideHeaderDetails();
          this.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        }
      });
  }

  }

