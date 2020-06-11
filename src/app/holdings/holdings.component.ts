import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DataTableDirective } from 'angular-datatables';
import { SharedataserviceService } from '../services/sharedataservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chart } from 'chart.js';
import { WebsocketService } from '../services/websocket.service';

export const constanttabs = [
  { tabs: "All", img: "../assets/image/All.svg" },
  { tabs: "NSE", img: "../assets/image/NSE.svg" },
  { tabs: "BSE", img: "../assets/image/BSE.svg" }
];

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrls: ['./holdings.component.scss']
})
export class HoldingsComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtOptions: DataTables.Settings = {};
  holdingColumns: string[] = ['Token1', 'instrument', 'Qty', 'LTP', 'AvgValue', 'TotalValue', 'MTM', 'LTysx'];
  holdingvisible = false;
  nsctotalvalue: any = 0.00;
  bsctotalvalue: any = 0.00;
  totalvalue: any = 0.00;
  totalvaluebefore: any = 0;
  totalvalueafter: any = '00';
  holdings: any;
  totalmtm: any = 0;
  holdingcheck: boolean = false;
  holdingsegment: any = constanttabs;
  tempTotalValue: any;
  holdingtotalvalue: number;
  tempHolding: any;
  emptytable: boolean = false;
  emptytablemsg: boolean = false;
  scripsmkt: any;
  totalHoldStock: number = 0;
  showDatafound: boolean = false;
  PieChart: any = [];
  chnlHold: any;
  public context: CanvasRenderingContext2D;
  counter: number = 0;
  reconnection: any = 0;
  reconnmsg: any = 0;
  constructor(public odgenserv: ZebuodrGentrService,
    public routeTo: Router,
    public dialog: MatDialog,
    public websocket: WebsocketService,
    public dataService: SharedataserviceService,
    public appComp: AppComponent) {
    this.getHoldings();
    this.dataService.ordersMsgShare.subscribe((res: boolean) => {
      if (res) {
        this.getHoldings();
        this.callSocketConnMW();
      }
    });
    this.callSocketConnMW();
  }

  ngOnInit() {
    if (localStorage.getItem("scripsmkt") != null || localStorage.getItem("scripsmkt") != undefined) {
      this.scripsmkt = JSON.parse(localStorage.getItem("scripsmkt"));
    }
    if (localStorage.getItem("holdings") != undefined || localStorage.getItem("holdings") != null) {
      var array: any = JSON.parse(localStorage.getItem("holdings"));
      this.holdings = [];
      if (array.length > 0) {
        this.emptytable = true;
        this.emptytablemsg = false;
        array.forEach(element => {
          this.holdings.push(element);
        });
      }
    }
  }

  getHoldings() {
    var getusrOdrs = {
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken(),
      "userSettingDto": this.odgenserv.getUserSettingDto()
    };
    this.odgenserv.holding(getusrOdrs).subscribe(data => {
      var scrip = [];
      if (Array.isArray(data['HoldingVal'])) {
        this.getCloseingValuesFromService(data['HoldingVal']);
      } else {
        this.holdingvisible = false;
        this.emptytablemsg = true;
      }
      if (data.emsg == 'Session Expired') {
        this.websocket.close();
        this.routeTo.navigateByUrl('login');
      }
      if (data.stat == 'Ok') {
        this.emptytable = true;
        this.holdingvisible = true;
        this.showDatafound = false;
        this.totalvaluebefore = 0;
        this.totalvalueafter = 0;
        this.totalmtm = 0;
        let total = data.Totalval;
        this.totalHoldStock = data.HoldingVal.length;
        this.holdingtotalvalue = total.TotalNSEHoldingValue;
        // this.holdings = data.HoldingVal;
        this.holdings.map(item => {
          if (item['ExchSeg1'] == 'NSE') {
            item['NsetsymTemp'] = item['Nsetsym'].toString().replace("-EQ", "");
            item['avgprice'] = "00.0";
            this.totalvalue += Number(item['NSEHOldingValue']);
            this.scripsmkt.map(index => {
              if (index['token'] == item['Token1']) {
                item['avgprice'] = index['close'];
                item['MTM'] = "0.00";
                scrip.push(item['Exch1'] + '|' + item['Token1']);
              }
            });
          }
          if (item['ExchSeg1'] == null && item['ExchSeg2'] == 'BSE') {
            this.totalvalue += Number(item['NSEHOldingValue']);
            item['avgprice'] = "00.0";
            this.scripsmkt.map(index => {
              if (index['token'] == item['Token2']) {
                item['avgprice'] = index['close'];
                item['MTM'] = "0.00";
                scrip.push(item['Exch2'] + '|' + item['Token2']);
              }
            });
          }
        });
        this.chnlHold = scrip.join("&");
        this.tempTotalValue = data.Totalval;
        this.tempHolding = data.HoldingVal;
        // var canvas = <HTMLCanvasElement>document.getElementById("canvas");
        // var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        // this.PieChart = new Chart(ctx, {
        //   type: 'pie',
        //   data: {
        //     labels: ['Average Value', 'MTM'],
        //     datasets: [{
        //       label: '# of Votes',
        //       pointHoverRadius: 5,
        //       data: [this.totalvalue, this.totalmtm],
        //       backgroundColor: [
        //         'rgb(70, 191, 189)',
        //         'rgb(247, 70, 74)',
        //       ],
        //       borderColor: [
        //         'rgb(70, 191, 189)',
        //         'rgb(247, 70, 74)',
        //       ],
        //       borderWidth: 1
        //     }]
        //   },
        //   options: {
        //     cutoutPercentage: 0,
        //   }
        // });   
        localStorage.setItem("holdings", JSON.stringify(this.holdings))
        this.nsctotalvalue = data['Totalval']['TotalNSEHoldingValue'];
        this.bsctotalvalue = data['Totalval']['TotalBSEHoldingValue'];
        this.totalvaluebefore = this.totalvalue.toFixed(2).split(".")[0];
        this.totalvalueafter = this.totalvalue.toFixed(2).split(".")[1];
      } else if (data.stat == 'Not_Ok' && data.Emsg == 'No Data' || data.stat == null || data.emsg == null || data.stat == undefined || data.emsg == undefined) {
        this.holdingvisible = false;
        this.showDatafound = true;
        this.holdings = [];
        this.emptytablemsg = false;
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.websocket.close();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  checkValue(event) {
    this.holdingcheck = event;
  }

  selectHoldingCheckBox(item) {
    console.log(item)
  }

  selectHoldingSegment(value) {
    var segment = this.holdingsegment[value['index']]['tabs'];
    var tempholdArray = [];
    this.totalvalue = "0.00";
    if (segment != 'All') {
      for (let idx of this.tempHolding) {
        if (idx['ExchSeg1'] == segment) {
          tempholdArray.push(idx);
        }
        if (idx['ExchSeg1'] == undefined || idx['ExchSeg1'] == null && idx['ExchSeg2'] == 'BSE') {
          tempholdArray.push(idx);
        }
      }
      this.totalvalue = Number('0.00');
      tempholdArray.map(item => {
        if (item['ExchSeg1'] == 'NSE') {
          item['NsetsymTemp'] = item['Nsetsym'].toString().replace("-EQ", "");
          this.totalvalue += Number(item['NSEHOldingValue']);
        }
        if (item['ExchSeg1'] == null && item['ExchSeg2'] == 'BSE') {
          this.totalvalue += Number(item['NSEHOldingValue']);
        }
      });
      this.totalvaluebefore = this.totalvalue.toFixed(2).split(".")[0];
      this.totalvalueafter = this.totalvalue.toFixed(2).split(".")[1];
      // if (segment == 'NSE') {
      //   this.totalvalue = Number(this.tempTotalValue['TotalNSEHoldingValue']).toFixed(2);
      // }
      // if (segment == 'BSE' && tempholdArray.length > 0) {
      //   this.totalvalue = Number(this.tempTotalValue['TotalBSEHoldingValue']).toFixed(2);
      // }
      this.holdings = [];
      this.holdings = tempholdArray;
    } else {
      // this.totalvalue = Number(this.tempTotalValue['TotalBSEHoldingValue']);
      // this.totalvalue += Number(this.tempTotalValue['TotalCSEHoldingValue']);
      // this.totalvalue += Number(this.tempTotalValue['TotalMCXHoldingValue']);
      // this.totalvalue += Number(this.tempTotalValue['TotalNSEHoldingValue']);
      // this.totalvalue += Number(this.tempTotalValue['TotalYSXHoldingValue']);
      // this.totalvalue = this.totalvalue.toFixed(2);
      this.totalvalue = Number('0.00');
      this.tempHolding.map(item => {
        if (item['ExchSeg1'] == 'NSE') {
          item['NsetsymTemp'] = item['Nsetsym'].toString().replace("-EQ", "");
          this.totalvalue += Number(item['NSEHOldingValue']);
        }
        if (item['ExchSeg1'] == null && item['ExchSeg2'] == 'BSE') {
          this.totalvalue += Number(item['NSEHOldingValue']);
        }
      });
      this.totalvaluebefore = this.totalvalue.toFixed(2).split(".")[0];
      this.totalvalueafter = this.totalvalue.toFixed(2).split(".")[1];
      this.holdings = this.tempHolding;
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
      this.totalmtm = 0;
      data.map(idx => {
        this.holdings.map(item => {
          if (item['ExchSeg1'] == 'NSE') {
            if (item['Token1'] == idx['token']) {
              item['avgprice'] = idx['close'].toFixed(2);
              item['MTM'] = ((+item['LTnse'] - item['avgprice']) * +item['SellableQty']).toFixed(2);
              this.totalmtm += +item['MTM'];
            }
          }
          if (item['ExchSeg1'] == null && item['ExchSeg2'] == 'BSE') {
            if (item['Token1'] == idx['token']) {
              item['avgprice'] = idx['close'].toFixed(2);
              item['MTM'] = ((+item['LTbse'] - +item['avgprice']) * +item['SellableQty']).toFixed(2);
              this.totalmtm += +item['MTM'];
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

  sendMessage() {
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