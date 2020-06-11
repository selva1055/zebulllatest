import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
@Component({
  selector: 'app-marketstatus',
  templateUrl: './marketstatus.component.html',
  styleUrls: ['./marketstatus.component.scss']
})
export class MarketstatusComponent implements OnInit {
  [x: string]: any;
  bscarray: any;
  nscarray: any;
  mcxarray: any;
  constructor(public odgenserv: ZebuodrGentrService) {
    this.getMarketStatus();
  }

  ngOnInit() {
  }

  /**
 * @method methed to get Sceurity Infomation
 * @params script,index
 * @return --
 * @author Selva 
 * @on 25/06/2019
 */
  getMarketStatus() {
    let jsonData = {
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken()
    }
    this.odgenserv.getMarketstatus(jsonData).subscribe((res) => {
      if (res.emsg == "Session Expired"){
        this.routeTo.navigateByUrl('login');
      }
      else{     
      let result: any = res;
      this.bscarray = result['bse'];
      this.nscarray = result['nse'];
      this.mcxarray = result['mcx'];
    }}, (err) => {
      console.log(err.error)
      this.routeTo.navigateByUrl('login');
    })
  }
}
