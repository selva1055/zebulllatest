import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DataTableDirective } from 'angular-datatables';
import { MatSort, MatTableDataSource } from '@angular/material';
import { SecurityinfoComponent } from '../securityinfo/securityinfo.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as alertify from 'alertifyjs'
import { OrderhistorydialogComponent } from '../orderhistorydialog/orderhistorydialog.component';
import { SharedataserviceService } from '../services/sharedataservice.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CancelOrderDialogComponent } from '../cancel-order-dialog/cancel-order-dialog.component';
import { CancelExitAllComponent } from '../cancel-exit-all/cancel-exit-all.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { WebsocketService } from '../services/websocket.service';

export const constanttabs = [
  { tabs: "Pending", img: "../assets/image/All.svg" },
  { tabs: "Completed", img: "../assets/image/Completed.svg" },
  { tabs: "All Orders", img: "../assets/image/Pending.svg" }
];

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  exitarray: any = [];
  orders: any = [];
  openOrder: any = [];
  tempOpenOrders: any = [];
  completedOrder: any = [];
  orderColumns: any = ['ExchOrdID', 'OrderedTime', 'Pcode', 'Trantype', 'Trsym', 'Cancelqty', 'Qty', 'Avgprc', 'Prc', 'Status'];
  sfiwtch: any = "sfi";
  months: any = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  temppositions: any = [];
  orderidx: number = 0;
  selectedIndex: number = 2;
  data: Element[] = [];
  dataSource: any = [];
  emptytablesegment: boolean = false;
  @ViewChild(DataTableDirective)
  dtOptions: DataTables.Settings = {};
  @ViewChild(MatSort) sort: MatSort;
  Pcode: string;
  showOverAllExit: boolean = false;
  orderstabss: string = 'Pending';
  ordertabs: any = constanttabs;
  totalorder: Number = 0;
  myModel: boolean;
  emptytable: boolean = false;
  pendingcheck: any;
  emptytablemsg: boolean = false;
  chnl: any;
  cancelObj: any;
  scpt: any = [];
  showDatafound: boolean = false;
  ordertype: any = "";
  constructor(public odgenserv: ZebuodrGentrService,
    public routeTo: Router,
    public dataService: SharedataserviceService,
    public appComp: AppComponent,
    public dialog: MatDialog,
    public socket: WebsocketService,
    public toastr: ToastrManager,
    private spinnerService: NgxUiLoaderService) {
    if (localStorage.getItem("OrderActiveTab") != undefined || localStorage.getItem("OrderActiveTab") != null) {
      this.selectedIndex = Number(localStorage.getItem("OrderActiveTab"));
    }
    this.getOrders();
    this.callSocketConnMW();
    this.dataService.ordersMsgShare.subscribe((res: boolean) => {
      if (res) {
        if (localStorage.getItem("OrderActiveTab") != undefined || localStorage.getItem("OrderActiveTab") != null) {
          this.selectedIndex = Number(localStorage.getItem("OrderActiveTab"));
        }
        this.getOrders();
      }
    })
  }

  ngOnInit() {
    if (localStorage.getItem("temp_orders") != null || localStorage.getItem("temp_orders") != undefined) {
      this.orders = JSON.parse(localStorage.getItem("temp_orders"));
      this.temppositions = this.orders;
      if (this.orders.length > 0) {
        this.emptytablesegment = true;
        this.emptytable = true;
        this.emptytablemsg = false;
        this.showDatafound = false;
        this.getorderssegment(this.selectedIndex);
      } else {
        this.emptytablesegment = true;
        this.emptytable = true;
        this.emptytablemsg = false;
      }
    }
    this.dataSource.sort = this.sort;
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
      if (Array.isArray(resp)) {
        this.orders = [];
        // this.selectedIndex = 2;
        this.emptytable = true;
        this.showDatafound = false;
        this.emptytablesegment = true;
        resp.map((item) => {
          scrip.push(item['Exseg'] + '|' + item['token']);
          if (item['Status'] === 'trigger Pending' || item['Status'] === 'open pending' || item['Status'] === 'validation pending' || item['Status'] === 'open') {
            // this.selectedIndex = 2;
            this.orders.push(item);
          }
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
        this.chnl = scrip.join("&");
        localStorage.setItem("temp_orders", JSON.stringify(resp));
        this.temppositions = [];
        this.temppositions = resp;
        this.getorderssegment(this.selectedIndex);
      } else if (resp.stat == 'Not_Ok' && resp.emsg == 'No Data' || resp.stat == null || resp.emsg == null || resp.stat == undefined || resp.emsg == undefined) {
        this.emptytable = false;
        this.emptytablemsg = false;
        this.emptytablesegment = false;
        this.showDatafound = true;
      } else if (resp.emsg == "Session Expired") {
        this.socket.close();
        this.routeTo.navigateByUrl('login');
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.socket.close();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  getRows() {
    const rows = [];
    this.data.forEach(element => rows.push(element, { detailRow: true, element }));
    return rows;
  }

  showSecurityInfo() {
    const dialogRef = this.dialog.open(SecurityinfoComponent, {
      width: '500px',
      height: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
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


  scripsPOrd(scrOrder, clicTyp) {
    switch (clicTyp) {
      case 'buy':
        this.appComp.setmktVal(clicTyp, scrOrder, 'mktwatch');
        break;
      case 'sell':
        this.appComp.setmktVal(clicTyp, scrOrder, 'mktwatch');
        break;
      // case 'del':
      //   this.setSelectVal(scrOrder, clicTyp);
      //   break;
      case 'modify':
        this.appComp.setmktVal(clicTyp, scrOrder, 'orderModify');
    }
  }

  cancelallcheckbox() {
    this.myModel = false;
  }

  getorderssegment(indexid) {
    localStorage.setItem("OrderActiveTab", indexid);
    this.myModel = false;
    this.emptytablemsg = false;
    this.exitarray = [];
    this.selectedIndex = indexid;
    if (indexid == 0) {
      this.openOrder = [];
      this.tempOpenOrders = [];
      this.temppositions.map((res) => {
        if (res['Status'] == 'trigger pending' || res['Status'] == 'open pending' || res['Status'] == 'validation pending' || res['Status'] == 'open') {
          // this.selectedIndex = 0;
          this.openOrder.push(res);
          this.tempOpenOrders.push(res);
        }
      });
      if (this.openOrder.length > 0) {
        this.ordertype = "";
        this.emptytable = true;
        this.emptytablemsg = false;
        this.emptytablesegment = true;
      } else {
        this.ordertype = "PENDING";
        this.emptytable = false;
        this.emptytablemsg = true;
        this.emptytablesegment = true;
      }
    } else if (indexid == 1) {
      this.completedOrder = [];
      this.temppositions.map((resp) => {
        if (resp['Status'] == 'complete') {
          this.completedOrder.push(resp);
        }
      });
      if (this.completedOrder.length > 0) {
        this.ordertype = "";
        this.emptytable = true;
        this.emptytablemsg = false;
        this.emptytablesegment = true;
      } else {
        this.ordertype = "COMPLETE"
        this.emptytable = false;
        this.emptytablemsg = true;
        this.emptytablesegment = true;
      }
    } else if (indexid == 2) {
      this.orders = [];
      this.orders = this.temppositions;
      if (this.orders.length > 0) {
        this.ordertype = "";
        this.emptytable = true;
        this.emptytablemsg = false;
        this.emptytablesegment = true;
      } else {
        this.ordertype = "ALL";
        this.emptytable = false;
        this.emptytablemsg = true;
        this.emptytablesegment = true;
      }
    }
  }

  selectPendingOrderCheck(event, index) {
    if (index == "" && event.checked) {
      this.exitarray = [];
      this.showOverAllExit = true;
      this.exitarray = this.tempOpenOrders;
    }
    if (index != "" && event.checked) {
      this.exitarray.push(index);
      if (this.exitarray.length > 0) {
        this.showOverAllExit = true;
      }
    }
    if (index != "" && !event.checked) {
      for (let idex of this.exitarray) {
        var idxid: number = this.exitarray.indexOf(idex);
        if (this.exitarray[idxid]['token'] == index['token'] && this.exitarray[idxid]['Nstordno'] == index['Nstordno']) {
          this.exitarray.splice(idxid, 1);
        }
      }
      if (this.exitarray.length > 0) {
        this.showOverAllExit = true;
      } else if (this.exitarray.length == 0) {
        this.showOverAllExit = false;
        this.myModel = false;
      }
    }
    if (index == "" && !event.checked) {
      this.showOverAllExit = false;
      this.exitarray = [];
    }
  }

  openAllOrderExitConfirmation() {
    const dialogRef = this.dialog.open(CancelExitAllComponent, {
      width: '600px',
      data: { data: this.exitarray },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showOverAllExit = false;
        this.getOrders();
      }
    });
  }

  callSocketConnMW() {
    this.dataService.indexTickDataObservable.subscribe((mesg) => {
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
    });
  }

  /**
 * after connecting with MW sockets subscriptions to get data
 */
  sendMessage() {
    var jsonSendObject = {
      "channel": this.chnl,
      "task": "os",
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    this.odgenserv.mWatch.next(jsonSendObject);
    var jsonSendObj = {
      "channel": this.chnl,
      "task": "mw",
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    this.odgenserv.mWatch.next(jsonSendObj);
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
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.socket.close();
        this.routeTo.navigateByUrl('login');
      }
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
        "userId": this.odgenserv.getUserId(),
        "userSessionID": this.odgenserv.getSessionToken(),
        "nestOrderNumber": elem.Nstordno,
        "s_prdt_ali": usersettings.s_prdt_ali,
      }
      this.odgenserv.getExitCOOrder(jsonData).subscribe(res => {
        if (res.stat == "Ok") {
          this.getOrders();
        }
        if (res.Emsg == "Session Expired") {
          this.socket.close();
          this.routeTo.navigateByUrl('login');
        }
      }, (err) => {
        if(err.error == "Unauthorized"){
          this.socket.close();
          this.routeTo.navigateByUrl('login');
        }
      });
    } else if (elem.Pcode == 'BO') {
      var jsonBoData = {
        "userId": this.odgenserv.getUserId(),
        "userSessionID": this.odgenserv.getSessionToken(),
        "status": elem.Status,
        "symbolOrderId": elem.SyomOrderId,
        "nestOrderNumber": elem.Nstordno
      }
      this.odgenserv.getExitBOOrder(jsonBoData).subscribe(res => {
        if (res.stat == "Ok") {
          this.getOrders();
        }
        if (res.Emsg == "Session Expired") {
          this.socket.close();
          this.routeTo.navigateByUrl('login');
        }
      }, (err) => {
        if(err.error == "Unauthorized"){
          this.socket.close();
          this.routeTo.navigateByUrl('login');
        }
      });
    }
  }
}