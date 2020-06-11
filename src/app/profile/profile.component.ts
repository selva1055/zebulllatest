import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { WebsocketService } from '../services/websocket.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userInfo: any;
  exch: any;
  pCode: any;
  prctyp: any;
  constructor(public odgenserv: ZebuodrGentrService, public routeTo: Router) { }

  ngOnInit() {
    this.userInfo = localStorage.getItem("userInformation");
    this.getUserInfo();
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
        // this.appComp.hideHeaderDetails();
        // this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      this.userInfo.push(data);
      localStorage.setItem("userInformation", JSON.stringify(this.userInfo));
    }, (err) => {
      if (err.error == "Unauthorized") {
        // this.appComp.hideHeaderDetails();
        // this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

}
