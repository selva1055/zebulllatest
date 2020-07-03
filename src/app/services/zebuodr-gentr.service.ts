import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { WebsocketService } from './websocket.service';
import * as pako from 'pako';
import { Router } from '@angular/router';
import { OdrstatusfeedService } from './odrstatusfeed.service';

@Injectable({
  providedIn: 'root'
})

export class ZebuodrGentrService {

  // Live url
  // WS_URL = "wss://restapi.zebull.in/NestHtml5MobileIBT/socket";//LIVE
  WS_URL = "wss://input.zebuetrade.com/NestHtml5MobileIBT/socket/stream";//LIVE NEW
  baseURL: string = "https://www.zebull.in/rest/MobullService/";
  // baseURL: string = "https://www.zebull.in/rest/ZebullService/";
  // baseURL: string = "http://192.168.1.66:8080/MobullService/";
  // baseURL: string = "http://rest.irongates.in/MobullService/";
  public static chartURL: string = "https://www.zebull.in/rest/MobullService/chart";

  // DEV url
  // WS_URL = "wss://restapi.zebull.in/NestHtml5MobileIBT/socket";//LIVE
  // baseURL: string = "http://rest.irongates.in/IronGates/";
  // public static chartURL: string = "http://rest.irongates.in/IronGates/chart";

  // DEV url
  // WS_URL = "wss://restapi.zebull.in/NestHtml5Mobile_NEWPRO/socket";//LIVE
  // WS_URL = "wss://restapi.zebull.in/NestHtml5MobileIBT/socket";//LIVE
  // baseURL = "http://uat.zebull.in/NestHtml5MobilePRONEW/";
  // baseURL: string = "http://zebu.irongates.in:8080/MobullService/";

  // baseURL: string = "http://rest.irongates.in:8080/MobullService/";
  // public static chartURL: string = "http://zebu.irongates.in:8080/MobullService/chart";

  // DEV url
  // WS_URL = 'wss://uat.zebull.in/NestHtml5Mobile/socket/stream';
  // // WS_URL = "wss://restapi.zebull.in/NestHtml5MobileIBT/socket";//LIVE
  // baseURL: string = "http://rest.irongates.in/IronGates/";
  // public static chartURL: string = "http://rest.irongates.in/IronGates/chart";

  // Local url
  // WS_URL = "wss://restapi.zebull.in/NestHtml5MobileIBT/socket";//LIVE
  // baseURL: string = "http://192.168.1.67:8080/MobullService/";
  // public static chartURL: string = "http://192.168.1.60:8080/MobullService/chart";

  post = "POST";
  get = "GET";

  headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
  getSearchDetails: string = "exchange/getSearchDetails";
  // getAdvanceSearchDetails: string = "exchange/getAdvSearchDetails";
  getAdvanceSearchDetails: string = "exchange/getScripForSearch";
  login: string = "customer/login";
  logout: string = "customer/logout";
  validate2fa: string = "customer/validAnswer";
  reset2Fa: string = "customer/saveAns";
  forgetPass: string = "customer/forgotPassword";
  insertOrders: string = "placeOrder/insertPlaceOrderRecords";
  getOrders: string = "placeOrder/getPlaceOrderRecordsByid";
  placeOrders: string = "placeOrder/executePlaceOrder";
  fetchOrders: string = "placeOrder/fetchOrderBook";
  sendTokenscrip: string = "ScripDetails/showQuotes";
  sendTokenscripDepth: string = "ScripDetails/getScripQuoteDetails";
  marketWatch: string = "marketWatch/fetchMWList";
  marketScrips: string = "marketWatch/fetchMWScrips";
  addtomktWatch: string = "marketWatch/addScripToMW";
  delMWScript: string = "marketWatch/deleteMWScrip";
  position: string = "positionAndHoldings/positionBook";
  holdings: string = "positionAndHoldings/holdings";
  funds: string = "limits/getRmsLimits";
  sortmwscrip: string = "marketWatch/sortMWScrip";
  unblock: string = "customer/unblockUser";
  orderhistory: string = "placeOrder/orderHistory";
  orderMultiplehistory: string = "placeOrder/orderHistory/ordGen";
  cancelorder: string = "placeOrder/cancelOrder";
  modifyOrdr: string = "placeOrder/modifyOrder";
  userInfo: string = "customer/accountDetails";
  changepassword: string = "customer/changePassword";
  exchMessage: string = "exchange/getExchangeMessage";
  priceRange: string = "ScripDetails/getPriceRange";
  positionConvert: string = "positionAndHoldings/positionConvertion";
  getmarketstatus: string = "ScripDetails/getMarketStatus";
  getsecurityinfo: string = "ScripDetails/getSecurityInfo";
  gettradebook: string = "placeOrder/fetchTradeBook";
  getexitcoorder: string = "placeOrder/exitCoverOrder";
  getexitboorder: string = "placeOrder/exitBracketOrder";
  getIndexList: string = "ScripDetails/getIndexDetails";
  customerLoginStatusEndpoint: string = "customer/getUserLoggedInStatus";
  customerKey: string = "customer/getEncryptionKey";
  encptLogin: string = "customer/webLogin";
  localLogin: string = "customer/localLogin";
  insertIndexDetails: string = "settings/insertIndexDetails";
  getIndexDetail: string = "settings/getIndexDetails";
  squreAllPostions: string = "positionAndHoldings/sqrOofPosition";
  generateapikey: string = "api/generateApiKey";
  getApiKey: string = "api/getApiKey";
  regenerateApiKey = "api/regenerateApiKey";
  holdingCloseValue: string = "positionAndHoldings/holdingDetails";
  positionAllSqrOff: string = "positionAndHoldings/positionSqrOff";
  //Payment
  payinAndPayoutToken: string = "GetOMSessionToken";
  payInUrl: string = "https://input.zebuetrade.com/PaymentGateway/Main/Hold_Funds";
  payOutUrl: string = "https://input.zebuetrade.com/PaymentGateway/Main/PayOut";
  payInPayOutUrl: string = "pay/getOMSessionToken";
  // encptLogin:string = "customer/eLogin";

  /**Quick Trade varible */
  setquickTrade: string = "settings/insertQTSettings";
  getquickTrade: string = "settings/getQTSettings";
  updatequickTrade: string = "settings/updateQTSettings";
  togglequickTrade: string = "settings/enableQTToggle";

  //***** */Temporary 
  positionHold: string = "positionAndHoldings/positionBookStatic";
  holdingHold: string = "positionAndHoldings/holdingsStatic";
  ordershold: string = "placeOrder/fetchOrderBookStatic"
  //****** */

  //Option Bees
  baseUrl_OB: string = "http://localhost:8081/OptionsShareMarketService/";
  getCloseMax: string = "maxpain/getClosestMaxPainValues"
  loadExpiry: string = "FNOInstrument/getExpiryDate";
  getFuture: string = "futures/getIndiceData";
  getPain: string = "maxpain/getPainStrike";
  getPcr: string = "pcrCalculation/getPcrCalculation";
  getStrike: string = "options/getStrike";
  getGlob: string = "optionsChain/getoptionchainpayoff";
  // chainLoader: string = "FNOInstrument/optionChain";
  scripSearch: string = "FNOInstrument/scripSearch";
  getStrategy: string = "userStrategy/getUserStrategy";
  getLegs: string = "userStrategy/getUserStrategyLegs";

  // Option chain
  optionChainId: string = "FNOInstrument/loadOptionScripData";
  optionChainExpiryDate: string = "FNOInstrument/getExpiryDate";
  optionChainTableUrl: string = "FNOInstrument/optionChainData";
  scripSearchURL: string = "FNOInstrument/loadScripSearch";
  getTokenURL: string = "FNOInstrument/loadToken";
  getScripQuotesURL: string = "ScripDetails/getScripQuoteDetails";
  tradeAlert: string = "more/getSecTradeAlert";

  symbols: string = "chart/symbols";

  counter: number = 0;
  newarray: any
  public mWatch: Subject<any>;
  public odrstatusFeed: Subject<any>;
  newarray2: any;
  subscription: any;
  high: number = 0;
  low: number = 0;
  close: number = 0;
  open: number = 0;
  _tickopen: any;
  _tickclose: any;
  _tickhigh: any;
  _ticklow: any;
  _tickvolume: any;

  _tickopen_sf: any;
  _tickclose_sf: any;
  _tickhigh_sf: any;
  _ticklow_sf: any;
  _tickvolume_sf: any;

  _prev_resolution: any;
  _trade_time: any;
  _last_time: any;
  public optionChainFeed: Subject<any>;
  @Output() onVoted = new EventEmitter<any>();
  @Output() navchange: EventEmitter<any> = new EventEmitter();
  _connection_status: Number = 0;
  _temp_msg_store: any = [];
  constructor(
    public http: HttpClient,
    private wsService: WebsocketService,
    private statusfeed: OdrstatusfeedService,
    public routeTo: Router,
  ) {
    this.webSocketConnection();
    //this.getFeedLiveChartData();
  }

  webSocketConnection() {
    // this.mWatch = <Subject<any>>this.wsService
    //   .connect(this.WS_URL)
    //   .pipe(map((response: any, i): any => {
    //     var data = pako.inflate(atob(response.data));
    //     this.newarray = []
    //     for (var i = 0; i < data.length; i++) {
    //       this.newarray.push(String.fromCharCode(data[i]));
    //     }
    //     data = this.newarray.join('');
    //     if (data) {
    //       this.emitNavChangeEvent(data);
    //     } else {
    //       let jobj = {
    //         'stat': 'not_Ok',
    //         'time': new Date()
    //       };
    //       this.emitNavChangeEvent(jobj);
    //     }
    //     return data;
    //   }));

    // this.odrstatusFeed = <Subject<any>>this.statusfeed
    //   .connect(this.WS_URL)
    //   .pipe(map((response: any, i): any => {
    //     var statusdata = pako.inflate(atob(response.data));
    //     this.newarray2 = []
    //     for (var i = 0; i < statusdata.length; i++) {
    //       this.newarray2.push(String.fromCharCode(statusdata[i]));
    //     }
    //     statusdata = this.newarray2.join('');
    //     return statusdata;
    //   }));
  }


  webSocketConnect(jsonObj) {
    if (jsonObj == undefined || jsonObj == null) {
      var jsonSendObj = {
        "channel": "",
        "task": "cn",
        "acctid": this.getUserId(),
        "user": this.getUserId(),
        "token": this.getSessionToken()
      };
      this.mWatch.next(jsonSendObj);
    } else {
      this.mWatch.next(jsonObj);
    }
    this.mWatch.subscribe((msg) => {
      localStorage.setItem("tickdata", JSON.stringify(msg));
    });
  }

  getUserId() {
    var userId = atob(localStorage.getItem("currentUser"));
    return userId;
  }

  getSessionToken() {
    var tokenId = localStorage.getItem("tokenId");
    return tokenId;
  }

  getAuthHeaders() {
    return this.headers.append('Authorization', 'Bearer ' + this.getUserId() + ' ' + this.getSessionToken());
  }

  unAuth(err) {
    if (err['status'] != 200) {
      localStorage.clear();
      this.routeTo.navigateByUrl('login');
    }
  }

  getUserSettingDto() {
    var settings = JSON.parse(atob(localStorage.getItem('sessionToken2')));
    return settings;
  }

  /**
   * ajax func to  search items/symbol Name in oderGen page
   * @param jsonObj 
  **/
  symbsearch(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.getAdvanceSearchDetails, jsonObj, {
      headers: this.headers
    })
  }

  /**
   * ajax for login
   * @param jsonObj 
   */
  zebulog(jsonObj) {
    return this.http.post(this.baseURL + this.login, jsonObj, {
      headers: this.headers
    }).pipe(map(user => {
      if (user['stat'] == "Ok") {
        localStorage.setItem("currentUser", btoa(user['userId']));
        var lastclear = localStorage.getItem('tStamp');
        var time_now = ((new Date()).getTime()).toString();
        localStorage.setItem("tStamp", time_now);
        if ((parseInt(time_now) - parseInt(lastclear)) > 1000 * 60 * 60 * 24) {
          localStorage.clear();
          localStorage.setItem('tStamp', time_now);
        }
      }
      return user;
    }))
  }

  zebuvalidate2fa(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.validate2fa, jsonObj, {
      headers: this.headers
    }).pipe(map(user => {
      if (user['userSessionID']) {
        localStorage.setItem("currentUser", btoa(user['userId']));
        localStorage.setItem("tokenId", user['userSessionID']);
      }
      return user;
    }))
  }

  /**
 * ajax for login
 * @param jsonObj 
 */
  unblockUser(jsonObj) {
    return this.http.post(this.baseURL + this.unblock, jsonObj, {
      headers: this.headers
    }).pipe(map(user => {
      if (user['stat'] == "Ok") {
        localStorage.setItem("currentUser", btoa(user['userId']));
        var lastclear = localStorage.getItem('tStamp');
        var time_now = ((new Date()).getTime()).toString();
        localStorage.setItem("tStamp", time_now);
        if ((parseInt(time_now) - parseInt(lastclear)) > 1000 * 60 * 60 * 24) {
          localStorage.clear();
          localStorage.setItem('tStamp', time_now);
        }
      }
      return user;
    }))
  }

  //Method to reset Password pre login
  resetPasswordPreLogin(jsonObj) {
    return this.http.post(this.baseURL + this.changepassword, jsonObj, {
      headers: this.getAuthHeaders()
    }).pipe(map(user => {
      if (user['stat'] == "Ok") {
        localStorage.setItem("currentUser", btoa(user['userId']));
        var lastclear = localStorage.getItem('tStamp');
        var time_now = ((new Date()).getTime()).toString();
        localStorage.setItem("tStamp", time_now);
        if ((parseInt(time_now) - parseInt(lastclear)) > 1000 * 60 * 60 * 24) {
          localStorage.clear();
          localStorage.setItem('tStamp', time_now);
        }
      }
      return user;
    }))
  }

  zebuReset2fa(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.reset2Fa, jsonObj, {
      headers: this.headers
    })
  }

  odrInsert(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.insertOrders, jsonObj, {
      headers: this.headers,
      responseType: 'text'
    })
  }

  getOrderById(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.getOrders, jsonObj, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    })
  }

  orderModify(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.modifyOrdr, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  placeOrder(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.placeOrders, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  placeOdrs(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.placeOrders, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  sendScriptToken(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.sendTokenscrip, jsonObj, {
      headers: this.headers
    })
  }

  sendScriptTokenDepth(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.sendTokenscripDepth, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  ordersBook(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.fetchOrders, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  positionAndHolding(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.position, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  //*****temporary */
  positionAndHoldingTemp(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.positionHold, jsonObj, {})
  }
  //********** */


  //*****temporary */
  holdingsTemp(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.holdingHold, jsonObj, {})
  }

  ordersTemp(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.ordershold, {})
  }

  //********** */
  holding(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.holdings, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  fund(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.funds, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  fetchMList(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.marketWatch, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  fetchMScrp(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.marketScrips, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  forgotPass(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.forgetPass, jsonObj, {
      headers: this.headers
    })
  }

  addToMW(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.addtomktWatch, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }
  delMWscrip(jsonObj) {
    return this.http.post(this.baseURL + this.delMWScript, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }
  // fuction of Market Watch sorting list
  sortingMWList(jsonObj) {
    return this.http.post(this.baseURL + this.sortmwscrip, jsonObj, {
      headers: this.getAuthHeaders()
    })

  }

  getGlobalSearch(jsonObj): Observable<any> {
    return this.http.post(this.baseUrl_OB + this.getGlob, jsonObj, {
      headers: { 'Content-Type': 'application/json', "Authorization": 'Bearer ' + '2ckmhk1f1lo9fredf977nkcbbj' + " " + 4 }
    })
  }

  loadExpiryDates(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.loadExpiry, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getScripSearch(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.scripSearch, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getFutureData(jsonObj): Observable<any> {
    return this.http.post(this.baseUrl_OB + this.getFuture, jsonObj, {
      headers: { 'Content-Type': 'application/json', "Authorization": 'Bearer ' + '2ckmhk1f1lo9fredf977nkcbbj' + " " + 4 }
    })
  }

  getPainData(jsonObj): Observable<any> {
    return this.http.post(this.baseUrl_OB + this.getPain, jsonObj, {
      headers: { 'Content-Type': 'application/json', "Authorization": 'Bearer ' + '2ckmhk1f1lo9fredf977nkcbbj' + " " + 4 }
    })
  }

  getClosestMaxPain(jsonObj): Observable<any> {
    return this.http.post(this.baseUrl_OB + this.getCloseMax, jsonObj, {
      headers: { 'Content-Type': 'application/json', "Authorization": 'Bearer ' + '2ckmhk1f1lo9fredf977nkcbbj' + " " + 4 }
    })
  }

  getPCR(jsonObj): Observable<any> {
    return this.http.post(this.baseUrl_OB + this.getPcr, jsonObj, {
      headers: { 'Content-Type': 'application/json', "Authorization": 'Bearer ' + '2ckmhk1f1lo9fredf977nkcbbj' + " " + 4 }
    })
  }

  getStrikeData(): Observable<any> {
    return this.http.get(this.baseUrl_OB + this.getStrike, {
      headers: { 'Content-Type': 'application/json', "Authorization": 'Bearer ' + '2ckmhk1f1lo9fredf977nkcbbj' + " " + 4 }
    })
  }

  getStrategies(jsonObj): Observable<any> {
    return this.http.post(this.baseUrl_OB + this.getStrategy, jsonObj, {
      headers: { 'Content-Type': 'application/json', "Authorization": 'Bearer ' + '2ckmhk1f1lo9fredf977nkcbbj' + " " + 4 }
    })
  }

  getStrategyLegs(jsonObj): Observable<any> {
    return this.http.post(this.baseUrl_OB + this.getLegs, jsonObj, {
      headers: { 'Content-Type': 'application/json', "Authorization": 'Bearer ' + '2ckmhk1f1lo9fredf977nkcbbj' + " " + 4 }
    })
  }

  orderMultipleHistory(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.orderMultiplehistory, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  orderHistory(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.orderhistory, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  cancelOrder(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.cancelorder, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getUserInfo(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.userInfo, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  changePassword(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.changepassword, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getExchMsg(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.exchMessage, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  locallogin(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.localLogin, jsonObj, {
      headers: this.headers
    });
  }

  getIndex(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.insertIndexDetails, jsonObj, {
      headers: this.headers
    })
  }

  // insertIndex(jsonObj):Observable<any>{
  //   return this.http.post(this.baseURL + this.getIndexDetails,jsonObj,{
  //     headers: this.headers
  //   })
  // }	

  getDetails(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.getIndexDetail, jsonObj, {
      headers: this.headers
    })
  }

  getPriceRange(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.priceRange, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  // getSecurityInfo(jsonObj): Observable<any>{
  //   return this.http.post(this.baseURL + this.securityInfo, jsonObj, {
  //     headers: this.getAuthHeaders()
  //   })
  // }

  convertPosition(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.positionConvert, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getSecurityInfo(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.getsecurityinfo, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getMarketstatus(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.getmarketstatus, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getQuickTradeToggle(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.getquickTrade, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getTradeBook(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.gettradebook, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }
  getExpiry(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.optionChainExpiryDate, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }
  getExitCOOrder(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.getexitcoorder, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getExitBOOrder(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.getexitboorder, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  saveQuickTradeSettings(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.setquickTrade, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  updateQuickTradeSettings(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.updatequickTrade, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getIndexDetails(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.getIndexList, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getUserLoggedInStatus(jsonObj: any): Observable<any> {
    return this.http.post(
      this.baseURL + this.customerLoginStatusEndpoint,
      jsonObj, // JSON body
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  getEncryptKey(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.customerKey, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  encrpyUserLogin(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.encptLogin, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  payInpayOutConnToken(jsonObj): Observable<any> {
    return this.http.get(this.baseURL + this.payInPayOutUrl, {
      headers: this.getAuthHeaders()
    })
  }

  emitNavChangeEvent(data) {
    if (data.stat != null || data.stat != undefined) {
      console.log("Web socket stopped at ::: " + data.time)
    } else {
      this.navchange.next(data);
    }
  }

  getNavChangeEmitter() {
    return this.navchange;
  }

  getNavChangeEmitterFromChartIQ() {
    return this.navchange;
  }

  getFeedLiveChartData() {
    this.getNavChangeEmitterFromChartIQ().subscribe((res) => {
      var tickdata = JSON.parse(res);
      var chartIQSymbol = JSON.parse(localStorage.getItem("_feed_symbol_store"));
      var mwticker = chartIQSymbol['symbol'].split("|")[1];
      var indexticker = chartIQSymbol['symbolid'];
      var resolution = chartIQSymbol['oi'];
      for (let tik in tickdata) {
        if (tickdata[tik]['name'] == 'sf') {
          if (tickdata[tik]['ltt'] != undefined && tickdata[tik]['ltt'] != 'NA' &&
            tickdata[tik]['tk'] != undefined && tickdata[tik]['tk'] != 'NA' && tickdata[tik]['tk'] == mwticker) {
            const _isPrevious_sf = tickdata[tik]['op'] != undefined;
            if (_isPrevious_sf) {
              this._tickopen_sf = Number(tickdata[tik]['op']);
              this._tickclose_sf = Number(tickdata[tik]['c']);
              this._tickhigh_sf = Number(tickdata[tik]['h']);
              this._ticklow_sf = Number(tickdata[tik]['lo']);
              this._tickvolume_sf = Number(tickdata[tik]['v']);
            }
            let tempDate = tickdata[tik]['ltt'].split(" ");
            const [day, month, year] = tempDate[0].split("/")
            var date = new Date(month + "/" + day + "/" + year + " " + tempDate[1]);
            var _current_ms: any = date.getTime();

            // If change call one time resolutions
            if (resolution != this._prev_resolution || this._prev_resolution == undefined) {
              var _last_bar_data = JSON.parse(localStorage.getItem("_last_trade_time"));
              this._last_time = new Date(_last_bar_data['DT']).getTime() + (resolution * 60000);
              this._prev_resolution = resolution;
            }

            if (this._last_time <= _current_ms) {
              this._trade_time = this._last_time;
              this._last_time = _current_ms + (resolution * 60000);
            }

            var bardata: any;
            if (resolution == '1D') {
              if (_current_ms != undefined) {
                bardata = {
                  DT: _current_ms,
                  Open: this._tickopen_sf,
                  High: this._tickhigh_sf,
                  Low: this._ticklow_sf,
                  Close: Number(tickdata[tik]['ltp']),
                  Volume: this._tickvolume_sf
                }
              }
            } else {
              if (this._trade_time != undefined) {
                bardata = {
                  DT: this.formatDate(this._trade_time),
                  Open: Number(tickdata[tik]['ltp']),
                  High: Number(tickdata[tik]['ltp']),
                  Low: Number(tickdata[tik]['ltp']),
                  Close: Number(tickdata[tik]['ltp']),
                  Volume: Number(tickdata[tik]['ltp'])
                }
              }
            }
            if (bardata != undefined || bardata != null) {
              localStorage.setItem("_feed_bar_data", JSON.stringify(bardata));
            }
          }
        } else if (tickdata[tik]['name'] == 'if') {
          if (tickdata[tik]['tvalue'] != undefined && tickdata[tik]['tvalue'] != 'NA' && tickdata[tik]['tk'] != undefined && tickdata[tik]['tk'] != 'NA' && tickdata[tik]['tk'].toUpperCase() == indexticker) {
            const _isPrevious = tickdata[tik]['iov'] != undefined;
            if (_isPrevious) {
              this._tickopen = tickdata[tik]['iov'];
              this._tickclose = tickdata[tik]['ic'];
              this._tickhigh = tickdata[tik]['ihv'];
              this._ticklow = tickdata[tik]['ilv'];
              this._tickvolume = tickdata[tik]['iv'];
            }

            var _current_ms: any = new Date(tickdata[tik]['tvalue']).getTime();

            // If change call one time resolutions
            if (resolution != this._prev_resolution || this._prev_resolution == undefined) {
              var _last_bar_data = JSON.parse(localStorage.getItem("_last_trade_time"));
              this._last_time = new Date(_last_bar_data['DT']).getTime() + (resolution * 60000);
              this._prev_resolution = resolution;
            }
            // console.log(new Date(this._last_time), new Date(_current_ms))
            if (this._last_time <= _current_ms) {
              this._trade_time = this._last_time;
              this._last_time = _current_ms + (resolution * 60000);
            }

            var bardata: any;
            if (resolution == '1D') {
              if (tickdata[tik]['tvalue'] != undefined) {
                bardata = {
                  DT: tickdata[tik]['tvalue'],
                  Open: this._tickopen,
                  High: this._tickhigh,
                  Low: this._ticklow,
                  Close: Number(tickdata[tik]['iv']),
                  Volume: this._tickvolume
                }
              }
            } else {
              if (this._trade_time != undefined) {
                bardata = {
                  DT: this.formatDate(this._trade_time),
                  Open: Number(tickdata[tik]['iv']),
                  High: Number(tickdata[tik]['iv']),
                  Low: Number(tickdata[tik]['iv']),
                  Close: Number(tickdata[tik]['iv']),
                  Volume: Number(tickdata[tik]['iv'])
                }
              }
            }
            if (bardata != undefined || bardata != null) {
              localStorage.setItem("_feed_bar_data", JSON.stringify(bardata));
            }
          }
        }
      }
    });
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    var t = new Date(date),
      hours = '' + (t.getHours()),
      minuts = '' + t.getMinutes();
    // seconds = t.getSeconds();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    if (hours.length < 2)
      hours = '0' + hours;
    if (minuts.length < 2)
      minuts = '0' + minuts;

    var setdate = [year, month, day].join('-');
    var settime = [hours, minuts].join(':');
    return setdate + " " + settime;
  }


  //Methed to stop market Watch Connection
  stopSocketConnMW() {
    var jsonSendObj = {
      "channel": "",
      "task": null,
      "acctid": this.getUserId(),
      "user": this.getUserId(),
      "token": this.getSessionToken()
    };
    this.mWatch.next(jsonSendObj);
  }

  zebuLogout(): Observable<any> {
    return this.http.post(this.baseURL + this.logout, "", {
      headers: this.getAuthHeaders()
    });
  }

  optionChainTable(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.optionChainTableUrl, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getOptionChainLoader(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.optionChainId, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }
  getScripSearchData(jsonObj) {
    return this.http.post(this.baseURL + this.scripSearchURL, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }
  getToken(jsonObj) {
    return this.http.post(this.baseURL + this.getTokenURL, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }
  getscripQuotes(jsonObj) {
    return this.http.post(this.baseURL + this.getScripQuotesURL, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }
  getTradeAlert(jsonObj) {
    return this.http.post(this.baseURL + this.tradeAlert, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  squreAllPostion(jsonObj) {
    return this.http.post(this.baseURL + this.positionAllSqrOff, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  generateAPIKey(jsonObj) {
    return this.http.post(this.baseURL + this.generateapikey, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getAPIKeyService(jsonObj) {
    return this.http.post(this.baseURL + this.getApiKey, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  regenerateAPIKeyService(jsonObj) {
    return this.http.post(this.baseURL + this.regenerateApiKey, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  holdingCloseingService(jsonObj) {
    return this.http.post(this.baseURL + this.holdingCloseValue, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getSymbolId(jsonObj) {
    return this.http.post(this.baseURL + this.symbols, jsonObj, {
      headers: this.getAuthHeaders()
    })
  }

  getCustomTime(cusdate) {
    var time = cusdate.split(" ")[1];
    var date = cusdate.split(" ")[0];
    var year = date.split("/")[2];
    var month = date.split("/")[1];
    var day = date.split("/")[0];
    return new Date(year + "-" + month + "-" + day + "T" + time).getTime() + 1000;
  }

}