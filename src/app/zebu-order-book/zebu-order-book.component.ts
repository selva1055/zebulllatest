import { Component, OnInit, Input } from '@angular/core';
import { ZebuodrGentrService } from 'src/app/services/zebuodr-gentr.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-zebu-order-book',
  templateUrl: './zebu-order-book.component.html',
  styleUrls: ['./zebu-order-book.component.scss']
})
export class ZebuOrderBookComponent implements OnInit {
  //MW
  mwgrp5: string;
  mwgrp4: string;
  mwgrp3: string;
  mwgrp2: string;
  mwgrp1: string;
  selectedItem: any;
  scripsmkt: any = [];
  showList: boolean;
  searchList: any;
  err: any;
  showDepLst: boolean;
  //table
  ordersBook: any;
  dtOptions: DataTables.Settings = {};
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  constructor(public odgenserv: ZebuodrGentrService, private spinnerService: NgxUiLoaderService, public routeTo: Router) { }

  ngOnInit() {

    this.spinnerService.start();
    var jsonObj = {
      "userId": this.odgenserv.getUserId(),
      "userSessionID": this.odgenserv.getSessionToken(),
      "userSettingDto": this.odgenserv.getUserSettingDto()
    }
    this.odgenserv.ordersBook(jsonObj).subscribe(resp => {
      console.log("OrdersBookResponse", resp);
      if (resp[0]['stat'] != "Not_Ok" && resp[0]['stat'] != "Session Expired") {
        this.ordersBook = resp;
      } else if (resp[0]['stat'] == "Not_Ok" && resp[0]['Emsg'] == "Session Expired") {
        localStorage.clear();
        this.routeTo.navigateByUrl('login');
      }
      this.dtTrigger.next();
      this.spinnerService.stop();
    }, (err) => {
      console.log(err);
      this.odgenserv.unAuth(err);
      this.spinnerService.stop();
    })

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      paging: false,
      searching: false,
      info: false,
      order: [[2, 'desc']]
    };

  }

  ngAfterViewInit() {
    this.fetchMWlist();
    var jsonSendObj = {
      "channel": "",
      "task": "cn",
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    // console.log("ViewINIT");
    this.odgenserv.mWatch.next(jsonSendObj);
    this.odgenserv.mWatch.subscribe(msg => {
      // console.log(JSON.parse(msg));
      // [{"ak":"ok","task":"cn","msg":"connected"}]
      if (JSON.parse(msg)[0]['ak'] == "ok" && JSON.parse(msg)[0]['task'] == "cn") {
        this.sendMessage();
      } else {
        // console.log(msg);
        var data = this.scripsmkt;
        var mesg = JSON.parse(msg)
        // console.clear();
        // console.log(data);
        data.map((item, i) => {
          mesg.map((msgg, j) => {
            // if (msgg[j]['ltt'] != 'NA') {

            if (data[i]['token'] == mesg[j]['tk'] && mesg[j]['ltt'] != 'NA') {
              data[i]['prevLtp'] = data[i]['ltp']
              data[i]['ltp'] = mesg[j]['ltp']

              if (mesg[j]['op']) {
                data[i]['open'] = mesg[j]['op']
                console.log('open', mesg[j]['op']);
              }
              if (mesg[j]['h']) {
                data[i]['high'] = mesg[j]['h'];
                console.log('high', mesg[j]['h']);
              }
              if (mesg[j]['lo']) {
                data[i]['low'] = mesg[j]['lo'];
                console.log("low", mesg[j]['lo']);
              }
              if (mesg[j]['c']) {
                data[i]['close'] = mesg[j]['c'];
                console.log("close", mesg[j]['c']);
              }
            }
            // }

          })
        })

      }

    })
  }
  sendMessage() {
    var jsonSendObj = {
      "channel": "nse_cm|1594&nse_cm|11536&nse_cm|3045",
      "task": "mw",
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    console.log("ViewINIT");
    this.odgenserv.mWatch.next(jsonSendObj);
  }

  fetchMWlist() {
    var userFetch = {
      'userId': this.odgenserv.getUserId(),
    }
    this.odgenserv.fetchMList(userFetch).subscribe(mwResp => {
      if (mwResp['stat'] == "Ok") {
        this.mwgrp1 = mwResp['values'][0] != null || mwResp['values'][0] != undefined ? mwResp['values'][0] : "mwGrp1";
        this.mwgrp2 = mwResp['values'][1] != null || mwResp['values'][1] != undefined ? mwResp['values'][1] : "mwGrp2";
        this.mwgrp3 = mwResp['values'][2] != null || mwResp['values'][2] != undefined ? mwResp['values'][2] : "mwGrp3";
        this.mwgrp4 = mwResp['values'][3] != null || mwResp['values'][3] != undefined ? mwResp['values'][3] : "mwGrp4";
        this.mwgrp5 = mwResp['values'][4] != null || mwResp['values'][4] != undefined ? mwResp['values'][4] : "mwGrp5";

        this.marktgrp(this.mwgrp1);
      } else {
        localStorage.clear();
        this.routeTo.navigateByUrl('login');

      }
    })
  }

  marktgrp(val) {
    this.selectedItem = val;
    var jsonScrips = {
      "userId": this.odgenserv.getUserId(),
      "mwName": val
    }
    this.odgenserv.fetchMScrp(jsonScrips).subscribe(scrpResp => {
      if (scrpResp['stat'] == "Ok") {
        this.scripsmkt = scrpResp['values'];
      } else {
        localStorage.clear();
        this.routeTo.navigateByUrl('login');
      }
    })

  }

  getsearchItems(e) {
    if (e.length >= 3) {
      if (e) {
        let searchJSON = { "symbol": ((e).trim()).toLocaleUpperCase() };
        this.odgenserv.symbsearch(searchJSON).subscribe(data => {
          this.showList = true;

          this.searchList = data;
        }, (err) => {
          console.log("err", err)
          this.err = err.error;

        })
      } else {
        this.showList = false;
      }
    } else {
      this.showList = false;
    }
  }
  setSelectVal(slctData) {
    console.log(slctData);
    // this.spinnerService.start();
    var token = {
      "exch": slctData['exch'],
      "symbol": slctData['token']
    }

    this.showList = false;

  }
  // this.odgenserv.webSocket(jsonSendObj)
  // }
  // subscribeMW(){
  //    var jsonSendObj = {
  //       "channel":"NSE|3432",
  //       "task":"mw",
  //       "acctid": "TN1SB8",
  //       "user":"TN1SB8",
  //       "token": "4776336722"
  //     };

  //     this.odgenserv.webSocket(jsonSendObj)
  //   }
  /**
   * func to placescripsOrder/DelOrder from MKTList
   * @param scrOrder 
   * @param clicTyp 
   */
  scripsPOrd(scrOrder, clicTyp) {
    console.log(scrOrder);
    switch (clicTyp) {
      case 'buy':
        console.log(clicTyp)
        break;
      case 'sell':
        console.log(clicTyp)
        break;
      case 'del':
        console.log(clicTyp)
        break;
    }
  }

  /**
   * func to show depth for clicked row
   * @param val 
   * @param i 
   */
  showDepth(val, i) {
    console.log("showD", val, i);
    this.scripsmkt.map((item) => {
      if (item['token'] == val['token']) {
        if (item['showDP']) {
          item['showDP'] = false

        } else {
          item['showDP'] = true;
        }
      }
    })

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.odgenserv.mWatch.unsubscribe();
    this.dtTrigger.unsubscribe();
  }

}
