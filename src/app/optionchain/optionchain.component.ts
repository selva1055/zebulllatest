import { Component, OnInit } from '@angular/core';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MarketstatusComponent } from '../marketstatus/marketstatus.component';
import { MatDialog } from '@angular/material';
import { CustomersupportComponent } from '../customersupport/customersupport.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedataserviceService } from '../services/sharedataservice.service';
import { AppComponent } from '../app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';





@Component({
  selector: 'app-optionchain',
  templateUrl: './optionchain.component.html',
  styleUrls: ['./optionchain.component.scss']
})

export class OptionchainComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );
  dataSource: MatTableDataSource<any>;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  data: Element[] = [];
  myControl = new FormControl();
  totalfutstk: any = [];
  index: any = [];
  dataOrder: any = [];
  stock: any = [];
  optionChainTablelist: any = [];
  selectedStock: any;
  stockId: string;
  Instrument: any;
  expiryDateValue: any;
  nestOrders: any;
  ExpselectedDate: any;
  searchstock: any = "NIFTY";
  putList: any = [];
  callList: any = [];
  nifname: any;
  nifPer: any;
  nifindexVal: any;
  nifindexChange: any;
  senxindexChange: any;
  senxindexVal: any;
  senxPer: any;
  senxname: any;
  profileName: string;
  future_data: any;
  tempObj: any = [];
  dateData: any;
  selectedArray: any = [];
  exp_date: any;
  script: any;
  showList: boolean;
  searchList: any = [];
  loadScriptData: any;
  searchbox: string;
  futureIndex: string;
  futureStock: string;
  dateDisplay: any = [];
  ExpiryDate: any = [];
  selectedItem: any = "";
  callandputList: any = [];
  selectedOption: any = [];
  elements: any;
  DateInfo: any;
  scripData: any = [];
  arr3: any = [];
  chnl: any = [];
  ordertiktoken: any;
  changeText: boolean;
  scripToken: any;
  optionChainData: any = []
  TickData: any;
  currenttoken: any;
  chkstrikevalue: boolean = false;
  noData: boolean = false;
  ScripQuotes: any;
  idex: any;
  ltp: any;
  dd: any;
  //delta
  d1: any;
  d2: any;
  nearvalue: any;
  orders: any;
  nearbyvalue: any;
  basketLists: any = [];
  scricpCalls: any = [];
  scripsPuts: any = [];
  DateForm: FormGroup;
  formbuilder: FormBuilder;
  ParamDate: any = [];
  clearinter: any = 0;
  cur_ltp: any;
  returnId: any;
  scripQuotesToken: Object;
  Sprice: any = [];
  putprice: any = [];
  callPrice: any = [];
  constructor(
    public actroute: ActivatedRoute,
    private spinnerService: NgxUiLoaderService,
    public service: ZebuodrGentrService,
    public dialog: MatDialog,
    public toastr: ToastrManager,
    public dataService: SharedataserviceService,
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public appComp: AppComponent,
    public routeTo: Router, ) {
    this.changeText = false;

    this.dataService.indexBasketDataShare.subscribe(res => {

      if (res) {
        this.basketLists.push(res);
        localStorage.setItem("ShareBasket Data", JSON.stringify(this.basketLists));
      }
    })

    if (localStorage.getItem("defaultIndex") != undefined || localStorage.getItem("defaultIndex") != null) {
      var index = JSON.parse(localStorage.getItem("defaultIndex"));
      this.navFeed(index);
    }
    if (localStorage.getItem("tickdata") != null || localStorage.getItem("tickdata") != undefined) {
      this.clearinter = setInterval(() => {
        this.TickData = JSON.parse(localStorage.getItem("tickdata"));
        for (let i in this.TickData) {
          if ((this.TickData[i]['tk'] == this.nifname) && (this.TickData[i]['iv'] != undefined) && (this.TickData[i]['nc'] != undefined) && (this.TickData[i]['cng'] != undefined)) {
            this.nifindexVal = Number(this.TickData[i]['iv']).toFixed(2);
            this.nifindexChange = (Number(this.TickData[i]['nc'])).toFixed(2);
            this.nifPer = (Number(this.TickData[i]['cng'])).toFixed(2);
          } else if ((this.TickData[i]['tk'] == this.senxname) && (this.TickData[i]['iv'] != undefined) && (this.TickData[i]['nc'] != undefined) && (this.TickData[i]['cng'] != undefined)) {
            this.senxindexVal = Number(this.TickData[i]['iv']).toFixed(2);
            this.senxindexChange = (Number(this.TickData[i]['nc'])).toFixed(2);
            this.senxPer = (Number(this.TickData[i]['cng'])).toFixed(2);
          }
        }
      }, 500);
    }
  }

  ngOnInit() {
    if (localStorage.getItem("ShareBasket Data") != undefined || localStorage.getItem("ShareBasket Data") != null) {
      this.basketLists = JSON.parse(localStorage.getItem("ShareBasket Data"));
    }
    this.getSymbID();
    this.profileName = this.service.getUserId();
    this.DateForm = this.fb.group({
      countryControl: [''],
    });
  }

  /**
* Method to provide the values to the datalist
* @params --
* @return --
* @author kalai
* @on 19/09/2019
*/
  getSymbID() {
    this.service.getOptionChainLoader('').subscribe(resp => {
      if (resp['stat'] == "Not_Ok") {
        this.logout();
      } else {
        this.totalfutstk = [];
        for (let idxfud of resp['optIDx']) {
          this.totalfutstk.push(idxfud);
        }
        for (let idxstk of resp['optStk']) {
          this.totalfutstk.push(idxstk);
        }
      }

      this.OnStockSelect(this.searchstock);
    })
  }


  /**
  * Method to get the selected stock with id
  * @params --
  * @return --
  * @author kalai
  * @on 19/09/2019
  */
  OnStockSelect(currentStock) {
    this.Instrument = currentStock;
    if (currentStock == "NIFTY") {
      this.stockId = "OPTIDX";
    }
    else if (currentStock == "BANKNIFTY") {
      this.stockId = "OPTIDX";
    }
    else if (currentStock == "NIFTYIT") {
      this.stockId = "OPTIDX";
    }
    else {
      this.stockId = "OPTSTK";
    }
    var getExpiry = {
      "exch": "NFO",
      "instrument": this.stockId,
      "symbol_id": this.Instrument
    }
    this.service.getExpiry(getExpiry).subscribe(res => {
      if (res['stat'] == "Not_Ok") {
        this.logout();
      } else {
        this.getScripToken(); {
          this.ExpiryDate = res['LoadExp'];
          this.dateDisplay = res['LoadExp'];
          this.dateData = res['LoadExp'][0].value;
          this.DateForm.value['countryControl'] = res['LoadExp'][0]['value'];
          this.DateForm.get('countryControl').setValue(res['LoadExp'][0]['value']);

          this.idex = { "Value": res['LoadExp'][0]['value'], "Display": res['LoadExp'][0]['display'] }
        }
      }
    }, (err) => {
      console.log(err)
    })
  }

  /**
 * Method to get Token
 * @params --
 * @return --
 * @author kalai
 * @on 10/10/2019
 */
  getScripToken() {
    let jsonObj: any = {
      "symbol": this.Instrument,
      "exch": 'NSE'
    }
    this.service.getToken(jsonObj).subscribe(resp => {
      this.scripToken = resp;
      this.currenttoken = (this.scripToken['token']);
      if (localStorage.getItem("tickdata") != null || localStorage.getItem("tickdata") != undefined) {
        var disbleinter = setInterval(() => {
          var tickdata = JSON.parse(localStorage.getItem("tickdata"));
          for (let i in tickdata) {
            // console.log(tickdata[i]['tk']);
            if (this.currenttoken == tickdata[i]['tk']) {
              console.log("success");
              console.log(tickdata[i]['ltp']);
              this.ltp = (tickdata[i]['ltp']);
              console.log(this.ltp)
              clearInterval(disbleinter);
            }
          }
        }, 500);
      }
      this.getLtpToken();
    })
    // }
  }

  //Method to get the LTP from API service
  getLtpToken() {
    let jsonObj: any = {
      "symbol": this.currenttoken,
      "exch": 'NSE',
      "userId": this.service.getUserId(),
    }
    this.service.getscripQuotes(jsonObj).subscribe(resp => {
      this.scripQuotesToken = resp;
      this.cur_ltp = resp['LTP'];
      console.log(this.cur_ltp);
      this.ltp = resp['LTP'];
      this.getExpiryDate(this.idex, this.dd);
      this.getFuturePrice(this.idex, this.dd);
    })
  }

  logout() {
    this.service.zebuLogout().subscribe(res => {
      if (res["stat"] == "Ok") {
        this.toastr.errorToastr('failed', 'Session Expired', { showCloseButton: true });
        localStorage.clear();
        this.nifname = "";
        this.routeTo.navigateByUrl("login");
      }
      if (res["stat"] == "Session Expired") {
        localStorage.clear();
        this.nifname = "";
        this.routeTo.navigateByUrl("login");
      }
    });
  }


  /**
  * Method to get the Script token
  * @params --
  * @return --
  * @author kalai
  * @on 01/10/2019
  */
  getScripSearch() {
    var exDate, yr;
    if (this.dateDisplay != undefined) {
      this.dateDisplay.map(items => {
        if (items['value'] == this.dateData) {
          exDate = new Date(items['display']);
          yr = this.formatDateInMMM(exDate);
        }
      });
      if (this.dateDisplay.length < 3) {
        this.dd = yr['zz'];//stock
      } else {
        this.dd = yr['yy'];//future
      }
    }
    let jsonObj: any = {
      "searchFor": this.Instrument + this.dd,
      "exch": 'NFO'
    }
    this.service.getScripSearchData(jsonObj).subscribe(resp => {
      this.scripData = resp;
    })
  }

  //Format Date in DD MMM YYYY
  formatDateInMMM(DateInfo) {
    var monthNames = ["JAN", "FEB", "MAR",
      "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP",
      "OCT", "NOV", "DEC"];

    var date = new Date();
    var day = new Date(DateInfo).getDate();
    var monthIndex = new Date(DateInfo).getMonth();
    var year = new Date(DateInfo).getFullYear();
    let yy = year.toLocaleString().slice(-2) + monthNames[monthIndex];//future
    let zz = day + monthNames[monthIndex].toUpperCase();
    return { yy, zz };
  }

  /**
 * Method to get the inifity and sensex value in the header
 * @params --scrpResp
 * @return --
 * @author kalai
 * @on 19/09/2019
 */
  navFeed(scrpResp) {
    this.profileName = this.service.getUserId();
    this.nifindexChange = scrpResp['indexvalues'][1]['indexChange'];
    this.nifindexVal = scrpResp['indexvalues'][1]['indexVal'];
    this.nifPer = scrpResp['indexvalues'][1]['indexPerChange'];
    this.nifname = scrpResp['indexvalues'][1]['indexName'];
    this.senxindexChange = scrpResp['indexvalues'][0]['indexChange'];
    this.senxindexVal = scrpResp['indexvalues'][0]['indexVal'];
    this.senxPer = scrpResp['indexvalues'][0]['indexPerChange'];
    this.senxname = scrpResp['indexvalues'][0]['indexName'];
  }

  closeItems() {
    if (this.showList != false) {
      setTimeout(() => {
        this.searchbox = "";
        this.searchList = [];
      }, 300)
    }
    else {
      this.showList = false;
    }
  }

  showMarketStatus() {
    const dialogRef = this.dialog.open(MarketstatusComponent, {
      width: '400px',
      height: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openNewTabCoEarn() {
    window.open("http://coearn.zebuetrade.com", "_blank");
  }

  openIronGatesDoc() {
    window.open("https://zebull.in/zebullDoc/", "_blank");
  }

  openCustomerSupportDialog() {
    const dialogRef = this.dialog.open(CustomersupportComponent, {
      width: '500px',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  /**
     * func to placescripsOrder/DelOrder from MKTList
     * @param scrOrder 
     * @param clicTyp 
     */
  scripsPOrd(scrOrder, clicTyp, type) {
    var jsonData: any = [];
    this.scripData.map(item => {
      if (type == "call") {
        if (item['Tsym'] == scrOrder['strikeCall']) {
          item['ltp'] = scrOrder['callslasttradeprice'];
          item['decimalPrecision'] = 2;
          item['multiplier'] = 1;
          item['minQty'] = 1;
          item["ExchSeg"] = item['Exchange'],
            item["Exchange"] = item['Exch'],
            item['TradSym'] = item['Tsym'],
            item['bodlot'] = item['BodLotQty'],
            item['token'] = item['Symbol'],
            jsonData = item;
        }
      }
      if (type == "put") {
        if (item['Tsym'] == scrOrder['strikePut']) {
          item['ltp'] = scrOrder['putslasttradeprice'];
          item['decimalPrecision'] = 2;
          item['multiplier'] = 1;
          item['minQty'] = 1;
          item["ExchSeg"] = item['Exchange'],
            item["Exchange"] = item['Exch'],
            item['token'] = item['Symbol'],
            jsonData = item;
        }
      }
    });
    if (jsonData != "") {
      switch (clicTyp) {
        case 'buy':
          this.appComp.setmktVal(clicTyp, jsonData, 'optionchain');
          break;
        case 'sell':
          this.appComp.setmktVal(clicTyp, jsonData, 'optionchain');
          break;
        case 'modify':
          this.appComp.setmktVal(clicTyp, scrOrder, 'optionchain');
      }
    }
  }
  getnearsetvalue() {
    let tempNearVal = this.ltp;
    this.nearvalue = (Math.round(tempNearVal / 10) * 10);
    for (var idx in this.arr3) {
      if (this.arr3[idx]['callsstrikeprice'] < this.nearvalue) {
        this.nearbyvalue = this.arr3[idx]['callsstrikeprice'];
      }
    }
  }

  /**
 * @method methed to get Index details and popup dialog box
 * @params --
 * @return --
 * @author kalai
 * @on 19/09/2019
 */
  getExpiryDate(idex, exp) {
    var dateValue = this.idex['Value'];
    this.DateInfo = this.idex['Display'];
    var formatDate = this.formatDateInMMM(this.DateInfo);  //format date
    this.ParamDate = formatDate['zz'];
    this.DateInfo = idex.display;
    this.getScripSearch();
    let jsonObj: any = {
      "exch": "NFO",
      "instrument": this.stockId,
      "symbol_id": this.Instrument,
      "expiryDate": dateValue,
    }
    this.service.optionChainTable(jsonObj).subscribe(resp => {
      if (resp['stat'] == "Not_Ok") {
        this.logout();
      } else {
        let temp = [], temp2 = [];
        var scripCalls = resp['scripCalls']['scripscallData'];
        var scripsPuts = resp['scripsPuts']['scripsputsData'];
        this.arr3 = [];
        scripCalls.forEach((itm, i) => {
          this.arr3.push(Object.assign({}, itm, scripsPuts[i]));
        });
        for (var idx in this.arr3) {
          if ((this.arr3[idx]['callsstrikeprice'].toString().split(".")[1]) != 0) {
            this.arr3[idx]['chkstrikevalue'] = true;
          } else {
            this.arr3[idx]['chkstrikevalue'] = false;
          }
        }
        this.arr3.map(item => {
          if (!item['chkstrikevalue']) {
            item['callsstrikeprice'] = parseInt(item['callsstrikeprice']);
            item['putstrikeprice'] = parseInt(item['putstrikeprice']);
          }
        })

        for (var idx in this.arr3) {
          this.arr3[idx]['putstrikeprice'] = (this.arr3[idx]['putstrikeprice']);
          this.arr3[idx]['strikeCall'] = this.Instrument + exp + this.arr3[idx]['callsstrikeprice'] + "CE";
          this.arr3[idx]['strikePut'] = this.Instrument + exp + this.arr3[idx]['putstrikeprice'] + "PE";
        }
        let limit = Math.abs((this.arr3[0].callsstrikeprice - this.arr3[1].callsstrikeprice) * 7);
        for (let x in this.arr3) {
          if (this.arr3[x].callsstrikeprice >= Number(this.ltp) - limit && this.arr3[x].callsstrikeprice <= limit + Number(this.ltp)) {
            temp.push(this.arr3[x]);
          }
        }
        this.arr3 = temp;
        let sortingivalue = this.arr3;
        sortingivalue.sort((a, b) => parseFloat(a.callsstrikeprice) - parseFloat(b.callsstrikeprice));
        this.arr3 = sortingivalue;
        this.scripData.map(item => {
          if (item['Tsym'].split('.')[1] != undefined) {
            item['Tsym'] = item['Tsym'].split('.')[0] + '.' + item['Tsym'].split('.')[1].slice(0, -2) + '0' + item['Tsym'].split('.')[1].slice(-2);
          }
        })
        this.scripData.map(item => {
          this.arr3.map(item2 => {
            if (item['Symbol'].split(' ')[1] == undefined) {
              if (item['Tsym'] == item2['strikeCall']) {
                temp2.push(item);
                item2['tokenCall'] = item['Symbol'];
              } else if (item['Tsym'] == item2['strikePut']) {
                temp2.push(item);
                item2['tokenPut'] = item['Symbol'];
              }
            }
          })
        })
        // var callPrice = []; var putprice = [];
        console.log(this.arr3)
        this.arr3.map(item => {
          // this.callPrice.push(item['callsstrikeprice']);
          // this.putprice.push(item['putstrikeprice']);
          this.probability(item['callsstrikeprice'], 30, 90, 16.3);
          var callDelta = this.black_scholes('call', this.cur_ltp, item['callsstrikeprice'], 17, 15.93, 30);
          console.log(callDelta['Delta'],callDelta['theta'])
          item['callDelta'] = callDelta['Delta'];
          item['callTheta'] = callDelta['theta'];
          this.probability(item['putstrikeprice'], 30, 90, 16.3);
          var putDelta = this.black_scholes('put', this.cur_ltp, item['putstrikeprice'], 17, 15.93, 30)
          console.log(putDelta['Delta'],callDelta['theta'])
          item['putDelta'] = putDelta['Delta'].toFixed(2);
          item['putTheta'] = putDelta['theta'].toFixed(2);
        })
        // console.log(this.callPrice);
        // console.log(this.putprice);
        // for (let idx1 of this.callPrice) {
        //   console.log(idx1);
        //   var callidx : number = this.callPrice.indexOf(idx1);
        //   var response = this.probability(idx1, 30, 90, 16.3);
        //   console.log(response)
        //   var callDelta = this.black_scholes('call', this.cur_ltp, idx1, 17, 15.93, 30);
        //   console.log(callDelta)
        //   // this.callPrice[callidx]['callDelta'] = callDelta;
        // }
        // for (let idx2 of this.putprice) {
        //   var putidx : number = this.callPrice.indexOf(idx2);
        //   var response = this.probability(idx2, 30, 90, 16.3);
        //   console.log(response)
        //   var putDelta = this.black_scholes('put', this.cur_ltp, idx2, 17, 15.93, 30)
        //   console.log(putDelta)
        //   // this.putprice[putidx]['putDelta'] = putDelta;
        // }
        console.log(this.callPrice);
        console.log(this.putprice);

        console.log(this.arr3);
        if (this.arr3.length > 0) {
          let y = [];
          temp2.map(item => {
            y.push(item['Exchange'] + '|' + item['Symbol']);
          })
          this.chnl = y.join("&");
          this.getnearsetvalue();
        } else {
          this.noData = true;
        }
      }
    })
  }

   /**
 * @method methed to get Future price details
 * @params --
 * @return --
 * @author kalai
 * @on 19/10/2019
 */  getFuturePrice(idex, exp) {
    var dateValue = this.idex['Value'];
    this.DateInfo = this.idex['Display'];
    var formatDate = this.formatDateInMMM(this.DateInfo);  //format date
    this.ParamDate = formatDate['zz'];
    this.DateInfo = idex.display;
    this.getScripSearch();
    let jsonObj: any = {
      "exch": "NFO",
      "instrument": "FUTIDX",
      "symbol_id": this.Instrument,
      "expiryDate": dateValue,
    }
    this.service.optionChainTable(jsonObj).subscribe(resp => {
      if (resp['stat'] == "Not_Ok") {
        this.logout();
      } else {
        console.log("Future Options", resp);
      }
    })
  }

  getTickData() {
    if (localStorage.getItem("tickdata") != null || localStorage.getItem("tickdata") != undefined) {
      this.clearinter = setInterval(() => {
        this.TickData = JSON.parse(localStorage.getItem("tickdata"));
        console.log("TickData", this.TickData);
      }, 500);
    }
  }

  //Method to delete the basket orders
  deleteSelected(idx) {
    this.basketLists.splice(idx, 1);
  }

  //Method to Place Order List
  orderAlreadyPlacedConformation() {
    this.placeOrders();
  }

  /**
   * Function to Place Orders
   */
  placeOrders() {
    this.spinnerService.start();
    for (let idx of this.basketLists) {
      var idxnumber = this.basketLists.indexOf(idx);
      delete this.basketLists[idxnumber]['ltp'];
      delete this.basketLists[idxnumber]['bodLotQty'];
    }
    this.basketLists.map((item, i) => {
      this.basketLists[i]["userId"] = this.service.getUserId();
      this.basketLists[i]["userSessionID"] = this.service.getSessionToken();
      this.basketLists[i]["userSettingDto"] = this.service.getUserSettingDto();
    })
    this.service.placeOdrs(this.basketLists).subscribe(data => {
      this.spinnerService.stop();
      if (data.length > 0) {
        for (let nestOrder of data) {
          for (let order of this.dataOrder) {
            var idxId: number = this.dataOrder.indexOf(order);
            if (nestOrder['NOrdNo'] != undefined || nestOrder['NOrdNo'] != null) {
              this.dataOrder[idxId]['NOrdNo'] = nestOrder['NOrdNo'];
            }
            if (nestOrder['nestOrderNumber'] != undefined || nestOrder['nestOrderNumber'] != null) {
              this.dataOrder[idxId]['NOrdNo'] = nestOrder['nestOrderNumber'];
            }
          }
        }
        if (data[0]['emsg'] == 'Session Expired') {
          this.appComp.hideHeaderDetails();
          this.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        }
        if (data[0]['stat'] == 'Ok') {
          this.basketLists = [];
          localStorage.setItem("ShareBasket Data", JSON.stringify([]));
        }
        if (data[0]['stat'] == 'Not_Ok') {
          this.toastr.errorToastr(data[0]['emsg']);
        }
        return this.dataOrder;
      }
    }, (err) => {
      console.log(err);
      this.service.unAuth(err);
      this.spinnerService.stop();
    })
  }

  getDataOrderRows() {
    const rows = [];
    this.dataOrder.forEach(element => rows.push(element, { detailRow: true, element }));
    return rows;
  }


  ndist(z) {
    return (1.0 / (Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z);
    //??  Math.exp(-0.5*z*z)
  }

  N(z) {
    var b1 = 0.31938153;
    var b2 = -0.356563782;
    var b3 = 1.781477937;
    var b4 = -1.821255978;
    var b5 = 1.330274429;
    var p = 0.2316419;
    var c2 = 0.3989423;
    var a = Math.abs(z);
    if (a > 6.0) { return 1.0; }
    var t = 1.0 / (1.0 + a * p);
    var b = c2 * Math.exp((-z) * (z / 2.0));
    var n = ((((b5 * t + b4) * t + b3) * t + b2) * t + b1) * t;
    n = 1.0 - b * n;
    if (z < 0.0) { n = 1.0 - n; }
    return n;
  }


  /**
  * Method to Calculate the probability
  * @params ---price, target, days, volatility
  * @return --pbove, pbelow
  * @author kalai
  * @on 25/09/2019
  */
  probability(price, target, days, volatility) {
    var p = price;
    var q = target;
    var t = days / 365;
    var v = volatility;

    var vt = v * Math.sqrt(t);
    var lnpq = Math.log(q / p);

    this.d1 = lnpq / vt;

    var y = Math.floor(1 / (1 + .2316419 * Math.abs(this.d1)) * 100000) / 100000;
    var z = Math.floor(.3989423 * Math.exp(-((this.d1 * this.d1) / 2)) * 100000) / 100000;
    var y5 = 1.330274 * Math.pow(y, 5);
    var y4 = 1.821256 * Math.pow(y, 4);
    var y3 = 1.781478 * Math.pow(y, 3);
    var y2 = 0.356538 * Math.pow(y, 2);
    var y1 = 0.3193815 * y;
    var x = 1 - z * (y5 - y4 + y3 - y2 + y1);
    x = Math.floor(x * 100000) / 100000;

    if (this.d1 < 0) { x = 1 - x };

    var pabove = Math.floor(x * 1000) / 10;
    var pbelow = Math.floor((1 - x) * 1000) / 10;
    console.log(pabove, pbelow);
    this.ndist(z);
    this.N(z);

    return [[pbelow], [pabove]]
  }

  /**
   * Method to Calculate the delta value
   * @params --- call, S,r,v,t
   * @return --delta
   * @author kalai
   * @on 25/09/2019
   */
  black_scholes(type, S, X, r, v, t) {
    // debugger;
    // call = Boolean (to calc call, call=True, put: call=false)
    // S = stock prics, X = strike price, r = no-risk interest rate
    // v = volitility (1 std dev of S for (1 yr? 1 month?, you pick)
    // t = time to maturity

    // define some temp vars, to minimize function calls
    var sqt = Math.sqrt(t);
    var Nd2;  //N(d2), used often
    var nd1;  //n(d1), also used often
    var ert;  //e(-rt), ditto
    var delta;  //The delta of the option
    var theta;

    this.d1 = (Math.log(S / X) + r * t) / (v * sqt) + 0.5 * (v * sqt);
    this.d2 = this.d1 - (v * sqt);

    if (type == 'call') {
      delta = this.N(this.d1);
      Nd2 = this.N(this.d2);
      console.log("call delta", delta);
    } else { //put
      delta = -this.N(-this.d1);
      Nd2 = -this.N(-this.d2);
      console.log("put delta", delta)
    }

    ert = Math.exp(-r * t);
    nd1 = this.ndist(this.d1);

    // gamma = nd1 / (S * v * sqt);
    // vega = S * sqt * nd1;
    if (type == 'call') {
      theta = -(S * v * nd1) / (2 * sqt) - r * X * ert * Nd2;
      console.log("Calltheta", theta)
    } else {
      theta = -(S * v * nd1) / (2 * sqt) - r * X * ert * Nd2;
      console.log("puttheta", theta)
    }
    // rho = X * t * ert * Nd2;

    // return (S * delta - X * ert * Nd2);
    var res = {"Delta":delta,"theta":theta}
    return res;

  } //end of black_scholes




}



