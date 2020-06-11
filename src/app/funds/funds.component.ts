import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedataserviceService } from '../services/sharedataservice.service';
import { Chart } from 'chart.js';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-funds',
  templateUrl: './funds.component.html',
  styleUrls: ['./funds.component.scss']
})

export class FundsComponent implements OnInit {
  funds: any = [];
  scripsmkt: any = [];
  userInfo: any[];
  exch: any;
  pCode: string;
  prctyp: string;
  exchMessage: any;
  public profile: any = [];
  counter: number = 0;
  showhidemore: boolean = false;
  showhide: boolean = false;
  PieChart: any = [];
  public context: CanvasRenderingContext2D;
  avalMargin: number = 0;
  marginUsed: number = 0;
  @ViewChild('myCanvas') myCanvas: ElementRef;
  constructor(public odgenserv: ZebuodrGentrService,
    public routeTo: Router, public appComp: AppComponent,
    private spinnerService: NgxUiLoaderService,
    public dataService: SharedataserviceService,
    public odrServ: ZebuodrGentrService,
    public toastr: ToastrManager,
  ) {
    if (localStorage.getItem("Fundsequity") != undefined || localStorage.getItem("Fundsequity") != null) {
      var fundsArray = JSON.parse(localStorage.getItem("Fundsequity"));
      this.funds.push(fundsArray);
    }
    this.getFunds();
  }

  ngOnInit() {
    var userId = this.odgenserv.getUserId();
    if (sessionStorage.getItem("localMW") != null || sessionStorage.getItem("localMW") != undefined) {
      var data = JSON.parse(sessionStorage.getItem("localMW"));
      for (let idx of data) {
        if (idx['UserId'] == userId) {
          this.scripsmkt = data['ScriptMKT'];
        }
      }
    }
  }

  /**
   * after connecting with MW sockets subscriptions to get data
   */
  sendMessage() {
    var jsonSendObj = {
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    this.odgenserv.mWatch.next(jsonSendObj);
    var jsonSendObjj = {
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    this.odgenserv.mWatch.next(jsonSendObjj);
  }

  /**Method to fetch funds **/
  getFunds() {
    var getusrOdrs = {
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken(),
      "userSettingDto": this.odgenserv.getUserSettingDto()
    };
    this.odgenserv.fund(getusrOdrs).subscribe(data => {
      this.spinnerService.stop();
      if (data.length != undefined) {
        for(let item in data){
          if (data[item]['stat'] == "Ok" && data[item]['segment'] == "ALL") {
            data.map(res => {
              res['coverOrderMarginPrsnt'] = Number(res['coverOrderMarginPrsnt']).toFixed(2);
              res['rmsIpoAmnt'] = Number(res['rmsIpoAmnt']).toFixed(2);
            });
            this.appComp.getFunds(data);
            localStorage.setItem("Fundsequity", JSON.stringify(data[item]));
            this.funds = [];
            this.funds.push(data[item]);
            console.log(this.funds);
            this.avalMargin = +data[item]['net'];
            this.marginUsed = +data[item]['brokeragePrsnt'];
          } 
          // else {
          //   this.funds = [];
          //   this.funds.push(data[item]);
          // }
          if (data[item]['stat'] == 'Not_Ok' && data[item]['emsg'] == "Session Expired" && data[item]['segment'] == "ALL") {
            this.appComp.hideHeaderDetails();
            this.funds = [];
            this.spinnerService.stop();
            this.routeTo.navigateByUrl('login');
          }
          if (data[item]['stat'] == 'Not_Ok') {
            return;
          }
          if (data[item]['emsg'] == "Session Expired") {
            this.appComp.hideHeaderDetails();
            this.funds = [];
            this.spinnerService.stop();
            this.routeTo.navigateByUrl('login');
          }
        }
        this.showPeachartBar(this.avalMargin,this.marginUsed);
      } else {
        if (data['stat'] == 'Not_Ok') {
          return;
        }
        if (data['emsg'] == "Session Expired") {
          this.appComp.hideHeaderDetails();
          this.funds = [];
          this.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        }
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  showPeachartBar(avalMargin,MarginUsed){
    var canvas = <HTMLCanvasElement>document.getElementById("canvas");
    var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.PieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Available Margin', 'Margin Used'],
        datasets: [{
          label: '# of Votes',
          pointHoverRadius: 5,
          data: [avalMargin, MarginUsed],
          backgroundColor: [
            'rgb(70, 191, 189)',
            'rgb(247, 70, 74)',
          ],
          borderColor: [
            'rgb(70, 191, 189)',
            'rgb(247, 70, 74)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        cutoutPercentage: 65,
      }
    });
  }

  /** If any Changes to Orderlist, To Refersh FundFunction  **/
  // referchReferenceList() {
  //   this.getFunds();
  // }

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
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
      this.userInfo.push(data);
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  openMorebutton(value) {
    this.showhidemore = !value;
  }
  openMorebtn(value) {
    this.showhide = !value;
  }

  //Method to get Token key payin and payout
  getPayInPayOutTokenKey(payType) {
    var jsonData = {
    }
    this.odgenserv.payInpayOutConnToken(jsonData).subscribe(res => {
      if (res['stat'] == 'Ok') {
        if (payType == 'Deposit') {
          var pUrl = this.odgenserv.payInUrl + ".jsp?sLoginId=" + this.odgenserv.getUserId() + "&token=" + res['SessionToken'] + "&sAccountId=" + this.odgenserv.getUserSettingDto().account_id;
          window.open(pUrl, '_blank');
        }
        if (payType == 'Withdraw') {
          var pUrl = this.odgenserv.payOutUrl + ".jsp?sLoginId=" + this.odgenserv.getUserId() + "&token=" + res['SessionToken'] + "&sAccountId=" + this.odgenserv.getUserSettingDto().account_id;
          window.open(pUrl, '_blank');
        }
      }
      if (res['stat'] == "Not_Ok") {
        this.toastr.errorToastr(res['emsg']);
      }
      if (res['stat'] == 'Session Expired') {
        this.appComp.hideHeaderDetails();
        this.spinnerService.stop();
        this.routeTo.navigateByUrl('login');
      }
    }, (err) => {
      console.log(err.error)
    });
  }
}
