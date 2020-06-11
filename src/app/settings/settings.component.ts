import { Component, OnInit } from '@angular/core';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material';
// import { ConformationGenerateApikeyComponent } from '../conformation-generate-apikey/conformation-generate-apikey.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  newpwd: any;
  oldpwd: any;
  apikeys: any;
  apiAvailble: any;
  apiExpried: any;
  expriedapi: any = "";
  generateKeys: boolean = true;
  quickTrades: any = [];
  toggleOn: boolean = true;
  updateQuickTrade: boolean = false;
  confnewpwd: any;
  errormessage: any = "";
  Apimessage: boolean = false;
  exchArray: any = [];
  defaultchart: any;
  constructor(public odgenserv: ZebuodrGentrService,
    public dialog: MatDialog,
    private spinnerService: NgxUiLoaderService,
    public routeTo: Router,
    public toastr: ToastrManager) {
      this.getAPIKeys();
      if(localStorage.getItem("defaultchart") != undefined || localStorage.getItem("defaultchart") != null){
        this.defaultchart = localStorage.getItem("defaultchart");
      }
      console.log(this.defaultchart)
     }

  ngOnInit() {
  }

  goToSaveChangePassword() {
    var jsonData = {
      "newPassword": this.newpwd,
      "oldPassword": this.oldpwd,
      "preLogin": 'N',
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken(),
    };
    this.spinnerService.start();
    this.odgenserv.changePassword(jsonData).subscribe(data => {
      this.spinnerService.stop();
      if (data.emsg == "Session Expired") {
        this.routeTo.navigateByUrl('login');
      }
      if (data.stat == "Not_Ok") {
        this.toastr.errorToastr(data.emsg, '', { showCloseButton: true });
      }
      if (data.stat == "Ok") {
        this.toastr.successToastr(data['Result'], '', { showCloseButton: true });
      }
    }, (err) => {
      this.spinnerService.stop();
      if (err.error == "Unauthorized") {
        localStorage.clear();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  /**
  * Method to quick trade disable and enable 
  * @Paramer 
  * @Return
  * @Author selva
  * @On 21/06/2019
  */
  toggleChange(event) {
    this.quickTrades = [];
    if (event.checked == true) {
      this.toggleOn = false;
      this.getQuickTradeDetails(event.checked);
    } else {
      this.toggleOn = true;
      this.getQuickTradeDetails(event.checked);
    }
  }

  /**
  * Method to get quick trade details to set value
  * @Paramer 
  * @Return
  * @Author selva
  * @On 21/06/2019
  */
  getQuickTradeDetails(event) {
    var jsonData = {
      "user_id": this.odgenserv.getUserId(),
      "quickToggle": event,
    }
    this.odgenserv.getQuickTradeToggle(jsonData).subscribe(res => {
      if (res.length > 0) {
        this.updateQuickTrade = true;
        res.map(item => {
          this.quickTrades.push({
            "active_status": item['active_status'],
            "changed": item['changed'],
            "created_by": item['created_by'],
            "created_on": item['created_on'],
            "exchange_seg": item['exchange_seg'],
            "id": item['id'],
            "order_type": item['order_type'] == null ? "MKT" : item['order_type'],
            "product_type": item['product_type'] == null ? "CNC" : item['product_type'],
            "qty": item['qty'],
            "quickToggle": item['quickToggle'],
            "total_amount": item['total_amount'],
            "updated_by": item['updated_by'],
            "updated_on": item['updated_on'],
            "user_id": item['user_id'],
          });
        });
      } else {
        this.quickTrades = [];
        for (let idx of this.exchArray) {
          this.quickTrades.push({
            "active_status": 0,
            "changed": false,
            "created_by": "",
            "created_on": "",
            "exchange_seg": idx,
            "id": 0,
            "order_type": "MKT",
            "product_type": "CNC",
            "qty": 1,
            "quickToggle": false,
            "total_amount": 0,
            "updated_by": "",
            "updated_on": "",
            "user_id": "",
          });
        }
        this.updateQuickTrade = false;
      }
    }, (err) => {
      console.log(err.error)
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
          // this.getOrders("");
        }
        if (res.Emsg == "Session Expired") {
          // this.appComp.hideHeaderDetails();
          this.routeTo.navigateByUrl('login');
        }
      }, (err) => {
        console.log(err.error)
      });
    }
    if (elem.Pcode == 'BO') {
      var jsonBoData = {
        "userId": this.odgenserv.getUserId(),
        "userSessionID": this.odgenserv.getSessionToken(),
        "status": elem.Status,
        "symbolOrderId": elem.SyomOrderId,
        "nestOrderNumber": elem.Nstordno
      }
      this.odgenserv.getExitBOOrder(jsonBoData).subscribe(res => {
        if (res.stat == "Ok") {
          // this.getOrders("");
        }
        if (res.Emsg == "Session Expired") {
          // this.appComp.hideHeaderDetails();
          this.routeTo.navigateByUrl('login');
        }
      }, (err) => {
        console.log(err.error)
      });
    }
  }

  getShowQuotes(scrip) {
    var jsonData = {
      "exch": scrip['Exchange'],
      "symbol": scrip['token'],
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken()
    }
    this.odgenserv.sendScriptTokenDepth(jsonData).subscribe(res => {
      console.log(res);
      if (res['emsg'] == "Session Expired") {
        // this.appComp.hideHeaderDetails();
        // this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      // this.scripsmkt.map(item => {
      //   if (res['stat'] != "Not_Ok") {
      //     if (scrip['TradSym'] == item['TradSym']) {
      //       item['lut'] = res['exchFeedTime'].split(' ')[1];
      //       item['ltq'] = res['LTQ'];
      //     }
      //   }
      // })
    }, (err) => {
      console.log(err.error)
    });
  }

  generateApiKey() {
    var jsonData = {};
    this.spinnerService.start();
    this.odgenserv.generateAPIKey(jsonData).subscribe(res => {
      this.spinnerService.stop();
      if (res['emsg'] == 'SUCCESS') {
        // this.Apimessage = true;
        this.getAPIKeys();
      }
    },
      (err) => {
        this.spinnerService.stop();
        console.log(err.error)
      });
  }

  /**
 * Method to change Quick Trade Price button change
 * @Paramer 
 * @Return
 * @Author Dhivya
 * @On 31/10/2019
 */
  productTypeBtnChanges(exch, value) {
    for (let obj of this.quickTrades) {
      let prodId = this.quickTrades.indexOf(obj);
      if (obj.exchange_seg == exch) {
        this.quickTrades[prodId]['product_type'] = value;
        this.quickTrades[prodId]['changed'] = true;
      }
    }
  }

  /**
   * @method methed to update quick Trade settings
   * @params --
   * @return --
   * @author Dhivya 
   * @on 31/10/2019
   */
  updateQuickTradeDetails() {
    this.odgenserv.updateQuickTradeSettings(this.quickTrades).subscribe(res => {
      if (res['emsg'] == 'SUCCESS') {
        this.toastr.successToastr(res['emsg'], '', { showCloseButton: true });
      }
    }, (err) => {
      console.log(err.error)
    });
  }

  /**
   * Method to change Quick Trade quantity
   * @Paramer segment,event
   * @Return
   * @Author Dhivya
   * @On 31/10/2019
   */
  changeTradeQty(exch, value) {
    for (let obj of this.quickTrades) {
      let prodId = this.quickTrades.indexOf(obj);
      if (obj.exchange_seg == exch) {
        this.quickTrades[prodId]['qty'] = value;
        this.quickTrades[prodId]['changed'] = true;
      }
    }
  }

  /**
  * Method to change Quick Trade Price button change
  * @Paramer 
  * @Return
  * @Author Dhivya
  * @On 31/10/2019
  */
  priceTypeBtnChanges(exch, value) {
    for (let obj of this.quickTrades) {
      let idxId = this.quickTrades.indexOf(obj);
      if (obj.exchange_seg == exch) {
        this.quickTrades[idxId]['order_type'] = value;
        this.quickTrades[idxId]['changed'] = true;
      }
    }
  }

  /**
  * Method to clear password fields
  * @Paramer 
  * @Return
  * @Author Selva
  * @On 07/01/2020
  */
  goToResetPassword() {
    this.confnewpwd = "";
    this.newpwd = "";
    this.oldpwd = "";
  }

  changeCharts(event){
    var chart = event.value;
    localStorage.setItem("defaultchart",chart);
    this.routeTo.navigateByUrl('/home/main');
  }

  goToPasswordReaset(){
    this.routeTo.navigateByUrl("passReset");
  }

  getAPIKeys(){
    var jsonData = {}
    this.spinnerService.start();
    this.odgenserv.getAPIKeyService(jsonData).subscribe((res:any) => {
      this.spinnerService.stop();
      if(res['status'] == "Not_Ok" && res['available'] == false){
        this.errormessage = res['message'] != null ? res['message'] : ""; 
        this.apiAvailble = res['available'];
        this.apiExpried = res['expired'];
      }else if(res['status'] == "Ok"){
        this.generateKeys = false;
        this.errormessage = res['message'] != null ? res['message'] : ""; 
        this.apiAvailble = res['available'];
        this.apiExpried = res['expired'];
        this.apikeys = res['api_key'];
        this.expriedapi = res['expiry_date'] != null ? res['expiry_date'].split(" ")[0] : "";
      }
    },
      (err) => {
        console.log(err.error)
      });
  }

  getReGenerateAPIKeys(){
    var jsonData = {}
    this.spinnerService.start();
    this.odgenserv.regenerateAPIKeyService(jsonData).subscribe((res:any) => {
      this.spinnerService.stop();
      if (res['message'] == 'SUCCESS') {
        this.getAPIKeys();
      }
    },
      (err) => {
        this.spinnerService.stop();
        console.log(err.error)
      });
  }
}
