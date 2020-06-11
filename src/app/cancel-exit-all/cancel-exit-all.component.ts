import { Component, OnInit, Inject } from '@angular/core';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';

export interface DialogData {
  data: any;
}

@Component({
  selector: 'app-cancel-exit-all',
  templateUrl: './cancel-exit-all.component.html',
  styleUrls: ['./cancel-exit-all.component.scss']
})
export class CancelExitAllComponent implements OnInit {
  Exitarray: any = [];
  qty: number;
  type: number;
  product: number;
  validity: number;
  price: number;
  symbol: any;
  tempArr: any;
  ExitArr: any = [];
  index: any;
  errormeg: any;
  displayedColumns: string[] = ['Trantype', 'Trsym', 'Qty', 'Pcode', 'Validity'];
  constructor(public odgenserv: ZebuodrGentrService,
    public toastr: ToastrManager,
    private spinnerService: NgxUiLoaderService,
    public dialogRef: MatDialogRef<CancelExitAllComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public routeTo: Router) { }

  ngOnInit() {
    this.Exitarray = this.data['data'];
    console.log(this.Exitarray)
    for (let idx of this.Exitarray) {
      let indexid: number = this.Exitarray.indexOf(idx);
      if (idx['Type'] != undefined || idx['Type'] != null) {
        this.Exitarray[indexid]['Type'] = this.Exitarray[indexid]['Type'].replace("1", "");
      }
    }
    console.log(this.Exitarray)
  }

  /**
   * @method Method to Exit Orders
   * @params na
   * @return na
   * @author kalai 
   * @on 14-11-2019
   */
  orderCancel() {
    let usersettings: any = this.odgenserv.getUserSettingDto();
    var array: any = [];
    if (this.Exitarray.length > 0) {
      for (let index of this.Exitarray) {
        if (index.Pcode == 'CO') {
          var jsonData = {
            "userId": this.odgenserv.getUserId(),
            "userSessionID": this.odgenserv.getSessionToken(),
            "nestOrderNumber": index.Nstordno,
            "s_prdt_ali": usersettings.s_prdt_ali,
          }
          array.push(jsonData);
          this.spinnerService.start();
          this.odgenserv.getExitCOOrder(jsonData).subscribe(res => {
            this.spinnerService.stop();
            if (res.stat == "Ok") {
              this.Exitarray = [];
              this.toastr.successToastr('Order Cancelled Successfully', 'Order Cancel', { showCloseButton: true });
              this.dialogRef.close(true);
            }
            if (res.Emsg == "Session Expired") {
              this.routeTo.navigateByUrl('login');
            }
          }, (err) => {
            this.spinnerService.stop();
            if (err.error == "Unauthorized") {
              this.dialogRef.close();
              this.routeTo.navigateByUrl('login');
            }
          });
        }else if (index.Pcode == 'BO') {
          var jsonBoData = {
            "userId": this.odgenserv.getUserId(),
            "userSessionID": this.odgenserv.getSessionToken(),
            "status": index.Status,
            "symbolOrderId": index.SyomOrderId,
            "nestOrderNumber": index.Nstordno
          }
          this.spinnerService.start();
          this.odgenserv.getExitBOOrder(jsonBoData).subscribe(res => {
            this.spinnerService.stop();
            if (res.stat == "Ok") {
              this.toastr.successToastr('Order Cancelled Successfully', 'Order Cancel', { showCloseButton: true });
              this.dialogRef.close(true);
            }
            if (res.Emsg == "Session Expired") {
              this.routeTo.navigateByUrl('login');
            }
          }, (err) => {
            this.spinnerService.stop();
            if (err.error == "Unauthorized") {
              this.dialogRef.close();
              this.routeTo.navigateByUrl('login');
            }
          });
        } else {
          var jsondata = {
            "userId": this.odgenserv.getUserId(),
            "nestOrderNumber": index.Nstordno,
            "trading_symbol": index.Trsym,
            "exch": index.Exchange,
            "userSessionID": this.odgenserv.getSessionToken(),
            "userSettingDto": this.odgenserv.getUserSettingDto()
          }
          this.spinnerService.start();
          this.odgenserv.cancelOrder(jsondata).subscribe(data => {
            this.spinnerService.stop();
            if (data.emsg == "Session Expired") {
              this.dialogRef.close();
              this.routeTo.navigateByUrl('login');
            }
            if (data.stat == "Not_Ok") {
              this.errormeg = data['emsg'];
            }
            if (data.stat == "Ok") {
              this.toastr.successToastr('Order Cancelled Successfully', 'Order Cancel', { showCloseButton: true });
              this.dialogRef.close(true);
            }
          }, (err) => {
            this.spinnerService.stop();
            if (err.error == "Unauthorized") {
              this.dialogRef.close();
              this.routeTo.navigateByUrl('login');
            }
          });
        }
      }
      this.spinnerService.stop();
    }
  }
  
  closeOrders(){
    this.Exitarray = [];
    this.dialogRef.close();
  }
}
