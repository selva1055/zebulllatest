import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
@Component({
  selector: 'app-securityinfo',
  templateUrl: './securityinfo.component.html',
  styleUrls: ['./securityinfo.component.scss']
})
export class SecurityinfoComponent implements OnInit {
  [x: string]: any;
  securityInfo: any = [];
  tikPrc: any;
  info: any;
  userId: any;
  constructor(
    public dialogRef: MatDialogRef<SecurityinfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public odgenserv: ZebuodrGentrService, ) {
    // this.info = data;
    this.showSecurityInfo(data)
    this.userId = this.odgenserv.getUserId();
  }

  ngOnInit() {
  }


  showSecurityInfo(scrip) {
    let jsonData = {
      "exch": scrip['Exchange'],
      "symbol": scrip['token'],
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken()
    }
    this.odgenserv.getSecurityInfo(jsonData).subscribe((res) => {
      if (res.emsg == "Session Expired") {
        this.dialogRef.close(true);
      } else {
        this.info = res;
      }
    }, (err) => {
      console.log(err.error);
      this.dialogRef.close(true);
    })
  }


  closeModelBox(): void {
    this.dialogRef.close();
  }
}
