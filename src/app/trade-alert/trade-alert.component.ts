import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-trade-alert',
  templateUrl: './trade-alert.component.html',
  styleUrls: ['./trade-alert.component.scss']
})
export class TradeAlertComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<TradeAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public odgenserv: ZebuodrGentrService,
    public toastr: ToastrManager) {
    console.log(data);
  }

  ngOnInit() {
  }

  closeModelBox(): void {
    this.dialogRef.close();
  }

  //Method to subscribe to trade alert
  subscribeTradeAlert() {
    let price = $('#price').val();
    if (price != undefined && price != '') {
      this.dialogRef.close();
      let json = {
        "exch": this.data['Exchange'],
        "value": price,
        "direction": price <= this.data['ltp'] ? 'l' : 'g',
        "symbol": this.data['token']
      }
      this.odgenserv.getTradeAlert(json).subscribe(res => {
        if (res['stat'] == "Ok") {
          this.toastr.successToastr('Subscribed successfully. You will be notified when the price striked.', '', { showCloseButton: true });
        }
      }, (err) => {
        this.dialogRef.close();
      });
    } else {
      this.toastr.errorToastr('Please enter a price value.', '', { showCloseButton: true });
    }
  }
}
