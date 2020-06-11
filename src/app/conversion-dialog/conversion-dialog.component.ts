import { Component, OnInit, Inject } from '@angular/core';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  data: any;
}

@Component({
  selector: 'app-conversion-dialog',
  templateUrl: './conversion-dialog.component.html',
  styleUrls: ['./conversion-dialog.component.scss']
})
export class ConversionDialogComponent implements OnInit {
  product: any;
  productTocode: any;
  position: any;
  bgColorBStype: any;
  pcode: any = "";
  convertcode: any = "";
  qty: string = "0";
  symbol: any;
  type: any;
  errormeg: any = "";
  constructor(
    public odgenserv: ZebuodrGentrService,
    public toastr: ToastrManager,
    public dialogRef: MatDialogRef<ConversionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public routeTo: Router) { }

  ngOnInit() {
    this.position = this.data['Data'];
    this.bgColorBStype = 'buy';
    this.symbol = this.position['Tsym'];
    if (this.position['Type'] != undefined || this.position['Type'] != null) {
      this.type = this.position['Type'].replace("1", "");
    }
    this.pcode = this.position['Pcode'];
    this.convertcode = (this.position['Exchange'] == 'NSE' || this.position['Exchange'] == 'BSE') ? (this.position['Pcode'] == "CNC" ? "MIS" : "CNC") : (this.position['Pcode'] == "NRML" ? "MIS" : "NRML");
    this.qty = this.position['Netqty'];
  }

  /**
   * @method Method to position conversion
   * @params na
   * @return na
   * @author kalai 
   * @on 02-11-2019
   */
  convertPosition() {
    console.log(this.qty)
    this.qty = (this.qty).toString().replace("-","");
    let jsonObj = {
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken(),
      "branchId": this.odgenserv.getUserSettingDto().branch_id,
      "brokerName": this.odgenserv.getUserSettingDto().broker_name,
      "account_id": this.odgenserv.getUserSettingDto().account_id,
      "s_prdt_ali": this.odgenserv.getUserSettingDto().s_prdt_ali,
      "pCode": this.position.Pcode,
      "productToCode": (this.position['Exchange'] == 'NSE' || this.position['Exchange'] == 'BSE') ? (this.position.Pcode == "CNC" ? "MIS" : "CNC") : (this.position.Pcode == "NRML" ? "MIS" : "NRML"),
      "exch": this.position.Exchange,
      "qty": this.qty,
      "tsym": this.position.Tsym,
      "transtype": this.position.Netqty > 0 ? 'B' : 'S',
      "tockenNo": this.position.Token,
      "type": this.position.Type == 'NET1' ? 'C' : 'D'
    }
    this.odgenserv.convertPosition(jsonObj).subscribe(data => {
      if (data['stat'] == "Not_Ok") {
        this.errormeg = data['emsg'];
      } else {
        if (data['stat'] == "Ok") {
          this.toastr.successToastr("Position Converted Successfully", '', { showCloseButton: true });
          this.dialogRef.close(true);
        }
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
