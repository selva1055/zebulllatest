import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DataTableDirective } from 'angular-datatables';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as alertify from 'alertifyjs'
import { SharedataserviceService } from '../services/sharedataservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConversionDialogComponent } from '../conversion-dialog/conversion-dialog.component';
import { HoldingExitComponent } from '../holding-exit/holding-exit.component';
import { PostioninfoComponent } from '../postioninfo/postioninfo.component';
import { WebsocketService } from '../services/websocket.service';
import { ThrowStmt } from '@angular/compiler';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent implements OnInit {
  months: any = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  orders = [];
  exitarray: any = [];
  @ViewChild(DataTableDirective)
  dtOptions: DataTables.Settings = {};
  positionColumns: string[] = ['Token2', 'Tsym', 'Pcode', 'Bqty', 'Buyavgprc', 'Sellavgprc', 'LTP', 'MtoM', 'Instname'];
  Pcode: string;
  temppositions: any = [];
  position: any = [];
  totalvalue: any;
  emptytablesegment: boolean = false;
  totalvaluebefore: any = 0;
  totalvalueafter: any = '00';
  positionidx: number = 0;
  positionsvisible: boolean = false;
  seg: string = 'All';
  segmentlist: any = ['All', 'MCX', 'NFO', 'CDS'];
  positioncheck: boolean = false;
  emptytable: boolean = false;
  emptytablemsg: boolean = false;
  showOverAllExit: boolean = false;
  mwCallpos: any;
  showDatafound: boolean = false;
  sengmenttypes: any = "";
  counter: number = 0;
  reconnection: any = 0;
  reconnmsg: any = 0;
  onetimecall: boolean = true;
  constructor(public odgenserv: ZebuodrGentrService,
    public toastr: ToastrManager,
    public dataService: SharedataserviceService,
    public routeTo: Router,
    public websocket: WebsocketService,
    public dialog: MatDialog,
    public appComp: AppComponent) {
    // First call get orders ofter call get positions
    this.getOrders();
    this.callSocketConnMW();
    this.dataService.ordersMsgShare.subscribe((res: boolean) => {
      if (res) {
        this.getOrders();
        this.callSocketConnMW();
      }
    });
  }

  ngOnInit() {
    if (localStorage.getItem("positionArray") != null || localStorage.getItem("positionArray") != undefined) {
      var temparray: any = JSON.parse(localStorage.getItem("positionArray"));
      if (temparray.length > 0) {
        this.emptytable = true;
        this.emptytablesegment = true;
        this.emptytablemsg = false;
        temparray.forEach(element => {
          this.position.push(element);
        });
        this.totalvalue = 0.00;
        // this.position.map(item => {
        //   this.totalvalue = this.totalvalue + Number((item['MtoM']).toString().replace(/,/g, ''));
        // });
        // this.totalvalue = this.totalvalue.toFixed(2);
        // this.totalvaluebefore = this.totalvalue.toFixed(2).split(".")[0];
        // this.totalvalueafter = this.totalvalue.toFixed(2).split(".")[1];
      }
    }
  }

  getPositions() {
    var getusrOdrs = {
      "ret": 'NET',
      "userSettingDto": this.odgenserv.getUserSettingDto(),
      "userId": this.odgenserv.getUserId()
    };
    var scrip = [];
    this.odgenserv.positionAndHolding(getusrOdrs).subscribe(data => {
      if (data.emsg == "Session Expired") {
        this.websocket.close();
        this.routeTo.navigateByUrl('login');
      }
      if (Array.isArray(data)) {
        this.emptytable = true;
        this.emptytablemsg = false;
        this.emptytablesegment = true;
        this.positionsvisible = true;
        this.positioncheck = false;
        this.showDatafound = false;
        this.totalvalue = 0.00;
        data.map(item => {
          scrip.push(item['Exchangeseg'] + '|' + item['Token']);
          item['checked'] = false;
          this.totalvalue = this.totalvalue + Number((item['MtoM']).toString().replace(/,/g, ''));
          if (item['Instname'] == 'OPTIDX' || item['Instname'] == 'OPTSTK' || item['Instname'] == 'OPTFUT' || item['Instname'] == 'OPTCUR') {
            let strike = item.Stikeprc.split('.')[1] > 0 ? item.Stikeprc : item.Stikeprc.split('.')[0];
            item['instrumentOptidx'] = item.Symbol + ' ' + new Date(item.Expdate).getDate() + this.months[new Date(item.Expdate).getMonth()] + ' ' + Number(strike).toFixed(2) + ' ' + item.Opttype;
          }
          if (item['Instname'] != undefined || item['Instname'] != null) {
            if (item['Instname'].startsWith('FUT')) {
              item['instrumentFut'] = item.Symbol + ' ' + new Date(item.Expdate).getDate() + this.months[new Date(item.Expdate).getMonth()] + ' FUT';
            }
          }
          if (item['Exchange'] != 'CDS') {
            item['Buyavgprc'] = Number(item['Buyavgprc'].replace(",", "")).toFixed(2);
            item['Sellavgprc'] = Number(item['Sellavgprc'].replace(",", "")).toFixed(2);
            item['LTP'] = Number(item['LTP'].replace(",", "")).toFixed(2);
            item['MtoM'] = Number(item['MtoM'].replace(",", "")).toFixed(2);
          }
        });
        data.sort((a, b) => (a['Netqty'] == 0) ? 1 : -1);
        this.position = data;
        if (Array.isArray(data)) {
          this.emptytablesegment = true;
        } else {
          this.emptytablesegment = false;
        }
        this.mwCallpos = scrip.join('&');
        this.totalvalue = this.totalvalue.toFixed(2);
        // this.totalvaluebefore = this.totalvalue.toFixed(2).split(".")[0];
        // this.totalvalueafter = this.totalvalue.toFixed(2).split(".")[1];
        this.temppositions = data;
        localStorage.setItem("positionArray", JSON.stringify(data));
      } else {
        this.emptytablemsg = true;
        this.emptytable = false;
        this.positionsvisible = false;
        this.emptytablesegment = false;
        this.position = [];
      }
      if (data['stat'] == 'Not_Ok' && data['emsg'] == 'No Data' || data['stat'] == null || data['emsg'] == null || data['stat'] == undefined || data['emsg'] == undefined) {
        this.emptytablemsg = false;
        this.emptytable = false;
        this.showDatafound = true;
        this.emptytablesegment = false;
        this.positionsvisible = false;
        this.position = [];
      }
      if (Array.isArray(data)) {
        this.emptytablemsg = false;
        this.emptytable = true;
        this.showDatafound = false;
        this.positionsvisible = true;
        this.emptytablesegment = true;
        this.getPositionSegments(0);
      }
    }, (err) => {
      // this.spinnerService.stop()
      if (err.error == "Unauthorized") {
        this.websocket.close();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  getPositionSegments(event) {
    this.positionidx = event;
    for (let segidx in this.segmentlist) {
      if (segidx == event) {
        var segment = this.segmentlist[segidx];
        this.seg = segment;
        if (segment != 'All') {
          this.position = [];
          this.totalvalue = 0.00;
          for (let tmpseg of this.temppositions) {
            if (tmpseg['Exchange'] == segment) {
              this.totalvalue = this.totalvalue + Number((tmpseg['MtoM']).toString().replace(/,/g, ''));
              this.position.push(tmpseg);
            }
          }
          this.totalvalue = this.totalvalue.toFixed(2);
          if (this.position.length > 0) {
            this.sengmenttypes = ""
            this.emptytablesegment = true;
            this.emptytable = true;
            this.emptytablemsg = false;
          } else {
            this.sengmenttypes = segment;
            this.emptytablesegment = true;
            this.emptytable = false;
            this.emptytablemsg = true;
          }
        } else {
          this.position = this.temppositions;
          if (this.position.length > 0) {
            this.sengmenttypes = ""
            this.emptytablesegment = true;
            this.emptytable = true;
            this.emptytablemsg = false;
          } else {
            this.sengmenttypes = "ALL"
            this.emptytablesegment != true;
            this.emptytable != true;
            this.emptytablemsg != false;
          }
        }
      }
    }
  }

  selectHoldingCheckBox(event, index) {
    if (index == '' && event.checked) {
      this.exitarray = [];
      this.showOverAllExit = false;
      for (let object of this.position) {
        var indexid: number = this.position.indexOf(object);
        if (this.position[indexid]['Pcode'] == 'BO' || this.position[indexid]['Pcode'] == 'CO' || this.position[indexid]['Pcode'] == 'AMO' || this.position[indexid]['Netqty'] == 0) {
          this.position[indexid]['checked'] = false;
        } else {
          this.showOverAllExit = true;
          this.position[indexid]['checked'] = true;
          this.exitarray.push(object);
        }
      }
    } else if (index != "" && event.checked) {
      this.exitarray.push(index);
      if (this.exitarray.length > 0) {
        this.showOverAllExit = true;
      }
    } else if (index != "" && !event.checked) {
      for (let idex of this.exitarray) {
        var idxid: number = this.exitarray.indexOf(idex);
        if (this.exitarray[idxid]['token'] == index['token']) {
          this.exitarray.splice(idxid, 1);
          this.positioncheck = false;
        }
      }
      if (this.exitarray.length > 0) {
        this.showOverAllExit = true;
      } else if (this.exitarray.length == 0) {
        this.showOverAllExit = false;
        this.positioncheck = false;
      }
    } else if (index == "" && !event.checked) {
      this.showOverAllExit = false;
      for (let obj2 of this.position) {
        var indexid2: number = this.position.indexOf(obj2);
        if (this.position[indexid2]['Pcode'] == 'BO' || this.position[indexid2]['Pcode'] == 'CO' || this.position[indexid2]['Pcode'] == 'AMO' || this.position[indexid2]['Netqty'] == 0) {
          this.position[indexid2]['checked'] = false;
        } else {
          this.position[indexid2]['checked'] = false;
        }
      }
      this.exitarray = [];
    }
    // console.log(this.exitarray)
  }

  /** It Fatch the position object form table, put the object value to app.compount **/
  goToPositionAdd(object) {
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

  openAllPositionExitConfirmation() {
    this.showOverAllExit = false;
    const dialogRef = this.dialog.open(HoldingExitComponent, {
      width: '600px',
      data: { data: this.exitarray },
    });
    dialogRef.afterClosed().subscribe(result => {
      //if (result) {
        this.showOverAllExit = true;
        this.getPositions();
      //}
    });
    // this.showAllPositionExitConfir(this.exitarray);
  }


  exitAllPostion(arraylist) {
    var array: any = [];
    if (arraylist.length > 0) {
      for (let index of arraylist) {
        let jsonObj = {
          "userId": this.odgenserv.getUserId(),
          "pCode": index['Pcode'],
          "exchSeg": index['Exchangeseg'],
          "netQty": index['Netqty'],
          "tockenNo": index['Token'],
          "symbol": index['Symbol'],
        }
        array.push(jsonObj);
      }
    }
    this.odgenserv.squreAllPostion(array).subscribe(data => {
      if (data['stat'] == "Not_Ok") {
        this.toastr.successToastr(data['emsg'], '', { showCloseButton: true });
      } else if (data['stat'] == "Session Expired") {
        this.websocket.close();
        this.routeTo.navigateByUrl('login');
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.websocket.close();
        localStorage.clear();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  callSocketConnMW() {
    this.dataService.indexTickDataObservable.subscribe((mesg) => {
       //Tick for orderBook
       for (let j in mesg) {
        for (let o in this.orders) {
          if (mesg[j]['ltp'] != undefined && mesg[j]['ltp'] != null) {
            if (this.orders[o]['token'] == mesg[j]['tk'] && this.orders[o]['Trgprc'] != "00.00") {
              if (Number(mesg[j]['ltp']) >= Number(this.orders[o]['Trgprc']) && this.orders[o]['Status'] == "open" && this.orders[o]['Trantype'] == "S") {
                if(this.onetimecall){
                  this.onetimecall = false;
                  this.getOrders();
                }
              }
              if (Number(mesg[j]['ltp']) <= Number(this.orders[o]['Trgprc']) && this.orders[o]['Status'] == "open" && this.orders[o]['Trantype'] == "B") {
                if(this.onetimecall){
                  this.onetimecall = false;
                  this.getOrders();
                }
              }
              if (Number(mesg[j]['ltp']) <= Number(this.orders[o]['Trgprc']) && this.orders[o]['Status'] == "trigger pending" && this.orders[o]['Trantype'] == "S") {
                if(this.onetimecall){
                  this.onetimecall = false;
                  this.getOrders();
                }
              }
              if (Number(mesg[j]['ltp']) >= Number(this.orders[o]['Trgprc']) && this.orders[o]['Status'] == "trigger pending" && this.orders[o]['Trantype'] == "B") {
                if(this.onetimecall){
                  this.onetimecall = false;
                  this.getOrders();
                }
              }
            }
          }
        }
      }
   
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
                  this.position[k]['MtoM'] = +(Number((this.position[k]['MtoM']).toString().replace(/,/g, '')));
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

      if (this.position.length > 0) {
        this.totalvalue = 0.00;
        this.position.map(item => {
          this.totalvalue = this.totalvalue + Number((item['MtoM']).toString().replace(/,/g, ''));
        });
        this.totalvalue = this.totalvalue.toFixed(2)
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
    let scrip = [];
    this.odgenserv.ordersBook(jsonObj).subscribe(resp => {
      this.onetimecall = true;
      if (Array.isArray(resp)) {
        this.orders = resp
        this.getPositions();
      } else if (resp.stat == 'Not_Ok' && resp.emsg == 'No Data' || resp.stat == null || resp.emsg == null || resp.stat == undefined || resp.emsg == undefined) {

      } else if (resp.emsg == "Session Expired") {
        this.routeTo.navigateByUrl('login');
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  /**
 * after connecting with MW sockets subscriptions to get data
 */
  sendMessage() {
    var jsonSendObj = {
      "channel": this.mwCallpos,
      "task": "mw",
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    this.odgenserv.mWatch.next(jsonSendObj);
  }

  openPositionInfo(object) {
    // console.log(object)
    const dialogRef = this.dialog.open(PostioninfoComponent, {
      width: '600px',
      height: '430px',
      data: { data: object },
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
