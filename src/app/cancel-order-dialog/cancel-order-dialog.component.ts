import { Component, OnInit, Inject } from '@angular/core';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  data: any;
}
@Component({
  selector: 'app-cancel-order-dialog',
  templateUrl: './cancel-order-dialog.component.html',
  styleUrls: ['./cancel-order-dialog.component.scss']
})
export class CancelOrderDialogComponent implements OnInit {
  cancelOrder: any = [];
  instrument: any;
  cancelObj: any;
  errormeg: any = '';
  product: any;
  price: any;
  orderId: any;
  exchange: any;
  type: any;
  qty: any;
  displayedColumns: string[] = ['Nstordno', 'Trsym','Prctype', 'Qty', 'Prc'];

  constructor(
    public odgenserv: ZebuodrGentrService,
    public toastr: ToastrManager,
    public dialogRef: MatDialogRef<CancelOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public routeTo: Router
  ) { }

  ngOnInit() {
    this.cancelOrder.push(this.data['data']);
    // this.cancelObj = this.data['obj']
    this.instrument = this.cancelOrder['Trsym'];
    this.product = this.cancelOrder['Pcode'];
    this.price = this.cancelOrder['Prc'];
    this.orderId = this.cancelOrder['Nstordno'];
    this.exchange = this.cancelOrder['Exchange'];
    this.type = this.cancelOrder['Prctype'];
    this.qty = this.cancelOrder['Qty'];
    // let exch = this.cancelOrder['Exchange'];
    // let price = this.cancelOrder['Prc'];
    // let ordr_id = this.cancelOrder['Nstordno'];
    // let product = this.cancelOrder['Pcode'];
    // let type = this.cancelOrder['Prctype'];
    // let qty = this.cancelOrder['Qty'];
  }
  /**
   * @method Method to cancel orders
   * @params na
   * @return na
   * @author kalai 
   * @on 13-11-2019
   */
  orderCancel() {
    var jsonData = {
      "userId": this.odgenserv.getUserId(),
      "nestOrderNumber": this.cancelOrder.Nstordno,
      "trading_symbol": this.cancelOrder.Trsym,
      "exch": this.cancelOrder.Exchange,
      "userSessionID": this.odgenserv.getSessionToken(),
      "userSettingDto": this.odgenserv.getUserSettingDto()
    };
    this.odgenserv.cancelOrder(jsonData).subscribe(data => {
      if (data.emsg == "Session Expired") {
        this.dialogRef.close();
        this.routeTo.navigateByUrl('login');
      }
      if (data.stat == "Not_Ok") {
        this.toastr.errorToastr('failed', data['Emsg'], { showCloseButton: true });
        this.errormeg = data['emsg'];
        this.dialogRef.close(true);
      }
      if (data.stat == "Ok") {
        this.dialogRef.close(true);
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.dialogRef.close();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

}
