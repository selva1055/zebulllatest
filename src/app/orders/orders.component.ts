import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from '../app.component';
import { SharedataserviceService } from '../services/sharedataservice.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderPlacedConformationDialogBoxComponent } from '../order-placed-conformation-dialog-box/order-placed-conformation-dialog-box.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { WebsocketService } from '../services/websocket.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrdersComponent implements OnInit {
  displayedColumns = ['sno', 'transtype', 'instrument', 'pCode', 'qty', 'price', 'discqty', 'stopLoss', 'target', 'trailing_stop_loss', 'id', 'stat',];
  data: Element[] = [];
  dataSource: MatTableDataSource<any>;
  // dataSource: any;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;
  //Angular Table
  // displayedColumns = ['sno', 'transtype', 'instrument', 'exch', 'complexty', 'qty', 'price', 'discqty', 'stopLoss', 'target', 'trailing_stop_loss', 'pCode', 'id', 'stat'];
  dataOrder: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() editedOrders;
  ordgenerator: FormGroup;
  returnId: any;
  salt: any;
  orders: any;
  editInstrmnt: any;
  editQty: any;
  editprice: any;
  edittrstplss: any;
  edittarget: any;
  editstoploss: any;
  editltp: any;
  editedId: any;
  editbtn: boolean = true;
  odrStatus: boolean;
  ordStatus: string;
  ordStaus: string;
  ordreStaus: boolean;
  nestOrders: any;
  constructor(public actroute: ActivatedRoute,
    private spinnerService: NgxUiLoaderService,
    public odgenserv: ZebuodrGentrService,
    public toastr: ToastrManager,
    public routeTo: Router,
    public websocket: WebsocketService,
    public dialog: MatDialog,
    public odrServ: ZebuodrGentrService,
    public fbuilder: FormBuilder,
    public appComp: AppComponent,
    public dataService: SharedataserviceService) {
    this.dataService.ordersEdit.subscribe((res: boolean) => {
      if (res) {
        if (localStorage.getItem('editorders') != undefined || localStorage.getItem('editorders') != null) {
          this.orders = JSON.parse(localStorage.getItem('editorders'));
          this.dataSource = new MatTableDataSource(this.getOrderRows());
          localStorage.removeItem('editorders');
        }
      }
    });
  }

  ngOnInit() {
    this.savedOrder();
    this.spinnerService.start();
    this.returnId = this.actroute.snapshot.queryParams['userId'] || '/';
    this.salt = this.actroute.snapshot.queryParams['randomSalt'] || '/';
    var getusrOdrs = {
      "id": this.returnId,
      "salt": this.salt,
      "userSessionID": this.odrServ.getSessionToken(),
      "userId": this.odrServ.getUserId()
    }
    this.odrStatus = false
    this.odrServ.getOrderById(getusrOdrs).subscribe(data => {
      this.orders = JSON.parse(data);
      this.data = JSON.parse(data);
      this.dataSource = new MatTableDataSource(this.getRows());
      this.dataOrder = JSON.parse(data);
      for (let idx of this.dataOrder) {
        let indxId: number = this.dataOrder.indexOf(idx);
        this.dataOrder[indxId]['show'] = false;
      }
      this.spinnerService.stop();
    }, (err) => {
      console.log(err);
      if (err.error == "Unauthorized") {
        localStorage.clear();
        this.websocket.close();
        this.odrServ.unAuth(err);
        this.spinnerService.stop();
      }
    });
  }


  getRows() {
    const rows = [];
    this.data.forEach(element => rows.push(element, { detailRow: true, element }));
    return rows;
  }

  getOrderRows() {
    const rows = [];
    this.orders.forEach(element => rows.push(element, { detailRow: true, element }));
    return rows;
  }

  getDataOrderRows() {
    const rows = [];
    this.dataOrder.forEach(element => rows.push(element, { detailRow: true, element }));
    return rows;
  }


  /**
   * Function to delete and to open model to edit
   * @param id 
   * @param functype 
   */
  editOrder(id, functype) {
    if (functype == "edit") {
      localStorage.setItem("editorders", JSON.stringify(this.orders));
      for (let item of this.orders) {
        var idxid: number = this.orders.indexOf(item);
        if (this.orders[idxid]['id'] == id) {
          this.appComp.setVal(this.orders[idxid]['transtype'], this.orders[idxid], 'orderGenModify');
        }
      }
    } else {
      this.orders.map((item, i) => {
        if (item['id'] == id) {
          this.orders.splice(i, 1);
          this.dataSource = new MatTableDataSource(this.getOrderRows());
        }
      });

    }
  }

  /**
   * Function to save edited order in model
   * @param editedId 
   */
  savedOrder() {

    //data is received from appComponent to update values
    this.dataService.currentMsg.subscribe(data => {
      if (data) {
        this.orders.map(order => {
          if (order['id'] == data['id']) {
            order['transtype'] = data['data']['bstype'];//this.ordgenerator.value['bstype'];
            order['complexty'] = data['data']['complexty'];//this.ordgenerator.value['complexty'];
            order['prctyp'] = data['data']['orderTypeSelect'];//this.ordgenerator.value['orderTypeSelect'];
            order['pCode'] = data['data']['position'];//this.ordgenerator.value['position'];
            order['discqty'] = data['data']['disqty'];//this.ordgenerator.value['disqty'];
            order['trigPrice'] = data['data']['trigPriceVal'];//this.ordgenerator.value['trigPriceVal'];
            order['qty'] = data['data']['quantity'];//this.ordgenerator.value['quantity'];
            order['price'] = data['data']['priceVal'];//this.ordgenerator.value['priceVal'];
            order['stopLoss'] = data['data']['stplss'];//this.ordgenerator.value['stplss'];
            order['target'] = data['data']['target'];//this.ordgenerator.value['target'];
            order['trailing_stop_loss'] = data['data']['tralngstplss'];//this.ordgenerator.value['tralngstplss'];
            // order['symbol_id'] = data['data']['symbolId'];
          }
        })
      }
    })
  }

  orderAlreadyPlacedConformation() {
    if (localStorage.getItem('OrdersPlaceDetails') != null && localStorage.getItem('OrdersPlaceDetails') != undefined) {
      var verifyId: string = localStorage.getItem("OrdersPlaceDetails");
      if (verifyId == "userId=" + this.returnId + "&randomSalt=" + this.salt) {
        this.ordreStaus = true;
        const dialogRef = this.dialog.open(OrderPlacedConformationDialogBoxComponent, {
          width: '350px',
          height: '220px',
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result == 'Yes') {
            this.placeOrders();
          } else {
            this.refreshOrdersPlacedStatus();
          }
        });
      } else {
        this.placeOrders();
      }
    } else {
      this.placeOrders();
    }
  }

  /**
   * Function to Place Orders
   */
  placeOrders() {
    this.spinnerService.start();
    for (let idx of this.orders) {
      var idxnumber = this.orders.indexOf(idx);
      // if (this.orders[idxnumber]['complexty'] == 'bo') {
      //   this.orders[idxnumber]['complexty'] = 'BO';
      // }
      // if (this.orders[idxnumber]['complexty'] == 'co') {
      //   this.orders[idxnumber]['complexty'] == 'CO';
      // }
      // if (this.orders[idxnumber]['ret'] == 'day') {
      //   this.orders[idxnumber]['ret'] = 'DAY';
      // }
      delete this.orders[idxnumber]['ltp'];
      delete this.orders[idxnumber]['bodLotQty'];
    }
    this.orders.map((item, i) => {
      this.orders[i]["userId"] = this.odrServ.getUserId();
      this.orders[i]["userSessionID"] = this.odrServ.getSessionToken();
      this.orders[i]["userSettingDto"] = this.odrServ.getUserSettingDto();
    })
    this.odrServ.placeOdrs(this.orders).subscribe(data => {
      this.spinnerService.stop();
      if (data.length > 0) {
        for (let nestOrder of data) {
          for (let order of this.dataOrder) {
            var idxId: number = this.dataOrder.indexOf(order);
            if (nestOrder['NOrdNo'] != undefined || nestOrder['NOrdNo'] != null) {
              this.dataOrder[idxId]['NOrdNo'] = nestOrder['NOrdNo'];
            }
            if (nestOrder['nestOrderNumber'] != undefined || nestOrder['nestOrderNumber'] != null) {
              this.dataOrder[idxId]['NOrdNo'] = nestOrder['nestOrderNumber'];
            }
          }
        }
        if (data[0]['emsg'] == 'Session Expired') {
          // this.appComp.hideHeaderDetails();
          this.websocket.close();
          localStorage.clear();
          this.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        }
        if (data[0]['stat'] == 'Ok') {
          localStorage.setItem("OrdersPlaceDetails", "userId=" + this.returnId + "&randomSalt=" + this.salt);
          this.nestOrders = data;
          localStorage.setItem("NestOrder", JSON.stringify(this.dataOrder));
          this.odrStatus = true;
          this.editbtn = false;
          this.ordreStaus = true;
          this.refreshOrders();
        }
        if (data[0]['stat'] == 'Not_Ok') {
          this.toastr.errorToastr(data[0]['emsg']);
        }
        return this.dataOrder;
      }
    }, (err) => {
      console.log(err);
      if (err.error == "Unauthorized") {
        this.websocket.close();
        this.odrServ.unAuth(err);
        this.spinnerService.stop();
      }
    })
  }

  closeTab() {
    this.routeTo.navigateByUrl("home/main");
  }

  refreshOrders() {
    var jsonArray: any = [];
    this.nestOrders = JSON.parse(localStorage.getItem("NestOrder"));
    for (let nestIdx of this.nestOrders) {
      var nestOrIdx: number = this.nestOrders.indexOf(nestIdx);
      var jsonData = {
        "userId": this.odgenserv.getUserId(),
        "nestOrderNumber": this.nestOrders[nestOrIdx]['NOrdNo'],
        "userSessionID": this.odgenserv.getSessionToken(),
        "userSettingDto": this.odgenserv.getUserSettingDto()
      };
      jsonArray.push(jsonData);
    }
    this.odgenserv.orderMultipleHistory(jsonArray).subscribe(res => {
      for (let orderArray of res) {
        var nestIdx1: number = res.indexOf(orderArray);
        for (let orderObj of orderArray) {
          for (let placeOrd of this.dataOrder) {
            let placeId: number = this.dataOrder.indexOf(placeOrd);
            if (this.dataOrder[placeId]['NOrdNo'] == orderObj['nestordernumber']) {
              this.dataOrder[placeId]['stat'] = res[nestIdx1][0]['Status'];
            }
          }
        }
      }
      this.dataSource = new MatTableDataSource(this.getDataOrderRows());
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.websocket.close();
        // this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  refreshOrdersPlacedStatus() {

    var jsonArray: any = [];
    this.nestOrders = JSON.parse(localStorage.getItem("NestOrder"));
    for (let nestIdx of this.nestOrders) {
      var nestOrIdx: number = this.nestOrders.indexOf(nestIdx);
      for (let idx1 of this.dataOrder) {
        var idxId1: number = this.dataOrder.indexOf(idx1)
        if (this.dataOrder[idxId1]['id'] == this.nestOrders[nestOrIdx]['id']) {
          this.dataOrder[idxId1]['NOrdNo'] = this.nestOrders[nestOrIdx]['NOrdNo'];
        }
      }

      var jsonData = {
        "userId": this.odgenserv.getUserId(),
        "nestOrderNumber": this.nestOrders[nestOrIdx]['NOrdNo'],
        "userSessionID": this.odgenserv.getSessionToken(),
        "userSettingDto": this.odgenserv.getUserSettingDto()
      };
      jsonArray.push(jsonData);
    }
    this.odgenserv.orderMultipleHistory(jsonArray).subscribe(res => {
      this.odrStatus = true;
      this.editbtn = false;
      this.ordreStaus = true;
      for (let orderArray of res) {
        var nestIdx1: number = res.indexOf(orderArray);
        for (let orderObj of orderArray) {
          for (let placeOrd of this.dataOrder) {
            let placeId: number = this.dataOrder.indexOf(placeOrd);
            if (this.dataOrder[placeId]['NOrdNo'] == orderObj['nestordernumber']) {
              this.dataOrder[placeId]['stat'] = res[nestIdx1][0]['Status'];
            }
          }
        }
      }
      this.dataSource = new MatTableDataSource(this.getDataOrderRows());
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        this.websocket.close();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }
  // getDisplayedColumns(): string[] {
  //   const isMobile = this.currentDisplay === 'mobile';
  //   return this.columnDefinitions
  //     .filter(cd => !isMobile || cd.showMobile)
  //     .map(cd => cd.def);
  // }

  goToHomePage() {
    if (localStorage.getItem("currentUser") != undefined || localStorage.getItem("currentUser") != null && localStorage.getItem("sessionToken2") != undefined || localStorage.getItem("sessionToken2") != null) {
      this.routeTo.navigateByUrl('home');
    } else {
      this.routeTo.navigateByUrl('login');
    }
  }
}


