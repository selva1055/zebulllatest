import { Component, HostListener, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SharedataserviceService } from './services/sharedataservice.service';
import { ZebuodrGentrService } from './services/zebuodr-gentr.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatRadioChange } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Options } from 'selenium-webdriver/opera';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MarketstatusComponent } from './marketstatus/marketstatus.component';
// import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { IndexlistComponent } from './indexlist/indexlist.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// var keyVal;
export class AppComponent {
  _device_width = window.innerWidth;
  // @ViewChild() navniftyVal;
  title = 'zebuOrders';
  mktWatch: any = "mw";
  sfiwtch: any = "sfi";
  orderWatch: any = "os";
  depthWatch: any = "dp";
  _isMWCall: any;
  _isSensexCall: any;
  _isNiftyCall: any;
  _isPositionCall: any;
  _isHoldingCall: any;
  _isOrderCall: any;
  _count: Number = 15;
  _totalCount: Number = 0;
  myHandle = true;
  position;
  exchange: any;
  ordgenerator: FormGroup
  is_lmt: any;
  is_mkt: any;
  is_slMkt: boolean;
  is_nrml: boolean;
  is_slLmt: boolean;
  is_tralngstplss: boolean;
  is_target: boolean;
  is_stplss: boolean;
  is_dPriceVal: boolean;
  is_trigPriceVal: any;
  is_priceVal: boolean;
  is_qtyVal: any;
  is_mktType: any;
  _validity_ioc: boolean;
  _validity_day: boolean;
  currentFormControlName: string;
  bgColorBStype: any;
  orders: any;
  editedId: any;
  editInstrmnt: any;
  editInstrmntname: any;
  priceValue: String;
  triggerPric: any;
  pageType: any;
  day: boolean = true;
  ioc: boolean;
  _day: boolean;
  _ioc: boolean;
  retType: string = "DAY";
  cncvalid: boolean = false;
  minTick: number;
  bo_msg: boolean = false;
  change: any = '0.00';
  perchange: any = '0.00';
  tikprice: any = '0.00';
  // _Pre_tikprice: any = '0.00';
  menuToggle: boolean = false;
  tikLot: any;
  tikPrc: any;
  qty: number = 1;
  ltpprice: number = 0;
  chkPrc: boolean;
  prczro: boolean;
  thPrc: boolean;
  tlPrc: boolean;
  thPrczro: boolean;
  stplzero: boolean;
  trghPrc: boolean;
  trgetZero: boolean;
  trgstplss: boolean;
  qtyzro: boolean;
  is_mis: boolean;
  save: string;
  page: string;
  symName: any;
  hideDiscQty: boolean = false;
  exch: any;
  symtoken: any;
  nifname: any;
  nifPer: any;
  nifindexVal: any;
  nifindexChange: any;
  senxindexChange: any;
  senxindexVal: any;
  senxPer: any;
  senxname: any;
  profileName: string;
  avalbal: any = 0;
  mtm: any = 0;
  modScrip: any;
  _amo: boolean;
  _bo: boolean;
  _rlgr: boolean;
  _co: boolean;
  slHigh: boolean;
  slLess: boolean;
  trHigh: boolean;
  trLess: boolean;
  placedata: any[];
  modifyData: any;
  modifyOdrGenData: any;
  chkqty: boolean;
  chkTPrc: boolean;
  chktrgt: boolean;
  chkstp: boolean;
  chktstp: boolean;
  lotSize: number;
  lowPrice: any = '0.00';
  highPrice: any = '0.00';
  exchMsgOpen: boolean = false;
  profileOpen: boolean = false;
  settingsOpen: boolean = false;
  is_discloseQty: boolean = false;
  discTen: number;
  invalidOrder: boolean = false;
  chkDisc: boolean = false;
  scripobj: any;
  coTrig: any;
  _isConnect: boolean = false;
  isTrigCo: boolean = false;
  _isTogglePage: any = "main";
  indexTickData: any;
  trail20: boolean;
  tempscrpt: any;
  counterState = 'counter is ticking';
  months: any = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  secondCounter: number = 0;
  chkStatus: any;
  disconnectIntervel: any;
  retryInterval: any;
  feedstoreage: any;
  barIntervel: boolean = false;
  constructor(public fbuilder: FormBuilder,
    public dataService: SharedataserviceService,
    private snackBar: MatSnackBar,
    public odrServ: ZebuodrGentrService,
    public routeTo: Router,
    public dialog: MatDialog,
    //private bottomSheetRef: MatBottomSheetRef,
    public toastr: ToastrManager,
    private bottomSheet: MatBottomSheet) {
    this.ordgenerator = this.fbuilder.group({
      bstype: ['buy', Validators.required],
      complexty: ['regular', Validators.required],
      complextyType: ['day', Validators.required],
      position: ['mis', Validators.required],
      orderTypeSelect: ['L', Validators.required],
      quantity: ['0', Validators.required],
      priceVal: ['0', Validators.required],
      disqty: ['0', Validators.required],
      trigPriceVal: ['0', Validators.required],
      stplss: ['0', Validators.required],
      target: ['0', Validators.required],
      tralngstplss: ['0', Validators.required],
      mktType: ['day', Validators.required],
      discQty: ['0', Validators.required]
    });
    // this.ordgenerator = new FormGroup({
    //   bstype: new FormControl(['buy', Validators.required]),
    //   complexty: new FormControl(['regular', Validators.required]),
    //   complextyType: new FormControl(['day', Validators.required]),
    //   position: new FormControl(['mis', Validators.required]),
    //   orderTypeSelect: new FormControl(['L', Validators.required]),
    //   quantity: new FormControl(['0', Validators.required]),
    //   priceVal: new FormControl(['0', Validators.required]),
    //   disqty: new FormControl(['0', Validators.required]),
    //   trigPriceVal: new FormControl(['0', Validators.required]),
    //   stplss: new FormControl(['0', Validators.required]),
    //   target: new FormControl(['0', Validators.required]),
    //   tralngstplss: new FormControl(['0', Validators.required]),
    //   mktType: new FormControl(['day', Validators.required]),
    //   discQty: new FormControl(['0', Validators.required])
    // });
    if (sessionStorage.getItem("localMW") == null || sessionStorage.getItem("localMW") == undefined) {
      sessionStorage.setItem("localMW", JSON.stringify([]))
    }
    if (localStorage.getItem("_temp_socket_store") == null || localStorage.getItem("_temp_socket_store") == undefined) {
      localStorage.setItem("_temp_socket_store", JSON.stringify([]))
    }

    // this.feedstoreage = setInterval(()=>{
    //   if(localStorage.getItem("_feed_symbol_store") != null || localStorage.getItem("_feed_symbol_store") != undefined){
    //    var feeddata : any = JSON.parse(localStorage.getItem("_feed_symbol_store"));
    //    if(feeddata['triggersymbol']){
    //     this.dataService.reconnectSocket(true);
    //     feeddata['triggersymbol'] = false;
    //     localStorage.setItem("_feed_symbol_store",JSON.stringify(feeddata));
    //    }
    //   }
    // },100)

    this.disconnectIntervel = setInterval(() => {
      this._count = Number(this._count) - 1;
      if (this._count == 0 || this._count == 5 || this._count == 10) {
        // console.log(this._count +" -- "+ this._totalCount)
        // clearInterval(this.retryInterval);
        // this.dataService.reconnectSocket(true);
        //this._totalCount = Number(this._totalCount) + 1;
        // if(this._totalCount >=5){
        //   this.retryInterval = setInterval(() => {
        //     this._totalCount = 0;
        //   }, 300000);
        // }
      }
    }, 1000);
  }

  ngOnDestroy(){
    clearInterval(this.feedstoreage);
    clearInterval(this.disconnectIntervel);
  }

  resetposition() {
    document.getElementById("openModalButton").click();
    setTimeout(data => {
      this.position = { x: 0, y: 0 };
    }, 800);
    //Hide all error messages 
    this.qtyzro = false;
    this.prczro = false;
    this.thPrczro = false;
    this.stplzero = false;
    this.trgetZero = false;
    this.trgstplss = false;
    this.thPrc = false;
    this.tlPrc = false;
    this.chkPrc = false;
    this.slLess = false;
    this.slHigh = false;
    this.trLess = false;
    this.trHigh = false;
  }

  setVal(bsTyp, scrip, page) {
    // console.log(bsTyp, scrip, page)
    this.page = page;
    this.modifyOdrGenData = scrip;
    this.pageType = page;
    this.orders = scrip;
    this.save = "save";
    this.editedId = this.orders['id'];
    this.editInstrmntname = this.orders['trading_symbol'];
    this.ordgenerator.patchValue({ position: this.orders['pCode'] });
    this.ordgenerator.patchValue({ orderTypeSelect: this.orders['prctyp'] });
    this.ordgenerator.patchValue({ complexty: this.orders['complexty'] });
    this.ordgenerator.patchValue({ bstype: this.orders['transtype'] });
    this.ordgenerator.patchValue({ quantity: this.orders['qty'] });
    this.ordgenerator.patchValue({ priceVal: this.orders['price'] == '--' ? '0.00' : this.orders['price'] });
    this.ordgenerator.patchValue({ trigPriceVal: this.orders['trigPrice'] });
    this.priceValue = this.orders['price'] == '--' ? '0.00' : this.orders['price'];
    this.ordgenerator.patchValue({ stplss: this.orders['stopLoss'] == '--' ? '0.00' : this.orders['stopLoss'] });
    this.ordgenerator.patchValue({ target: this.orders['target'] == '--' ? '0.00' : this.orders['target'] });
    this.ordgenerator.patchValue({ tralngstplss: this.orders['trailing_stop_loss'] == '--' ? '0.00' : this.orders['trailing_stop_loss'] });
    // let tik = Number(scrip['ticksize']);
    // let multi = Number(scrip['multiplier']);
    // let preci = Number(scrip['decprec']);
    // this.tikPrc = (tik) / (multi * Math.pow(10, preci));
    this.formtypselect();
    document.getElementById("openModalButton").click();
  }

  /**
   * func invoked from marketwatch buy/sell button on hover
   * @param bstype 
   */
  setmktVal(bsTyp, scrip, page) {
    // console.log(bsTyp, scrip, page)
    this.tempscrpt = scrip;
    this.getPricerange(scrip);
    if (page == 'orderModify') {
      this.chkStatus = scrip['Status'];
      this.is_qtyVal = null;
      this.is_priceVal = null;
      this.is_stplss = null;
      this.is_target = null;
      this.is_tralngstplss = null;
      this.is_discloseQty = null;
      this.is_trigPriceVal = null;
      this.modScrip = scrip;
      this.page = page;
      this.symName = scrip['Sym'];
      this.exchange = scrip['Exchange'];
      this.exch = scrip['Exchange'];
      this.priceValue = scrip['Prc'];
      this.symtoken = scrip['token'];
      this.ordgenerator.patchValue({ priceVal: scrip['Prc'] });
      this.editInstrmnt = scrip['Trsym'];
      if (scrip['InstName'] == 'OPTIDX' || scrip['InstName'] == 'OPTSTK' || scrip['InstName'] == 'OPTFUT' || scrip['InstName'] == 'OPTCUR') {
        let strike = scrip.strikePrice.split('.')[1] > 0 ? scrip.strikePrice : scrip.strikePrice.split('.')[0];
        this.editInstrmntname = scrip.Sym + ' ' + new Date(scrip['ExpDate']).getDate() + this.months[new Date(scrip['ExpDate']).getMonth()] + ' ' + Number(strike).toFixed(2) + ' ' + scrip['optionType'];
      } else if (scrip['InstName'].startsWith('FUT')) {
        this.editInstrmntname = scrip['Sym'] + ' ' + new Date(scrip['ExpDate']).getDate() + this.months[new Date(scrip['ExpDate']).getMonth()] + ' FUT';
      } else if (scrip['Exchange'] == 'NSE' || scrip['Exchange'] == 'BSE') {
        this.editInstrmntname = scrip['Trsym']
      }
      this.ordgenerator.patchValue({ bstype: scrip['Trantype'] == "B" ? 'buy' : 'sell' });
      if (scrip['Exseg'] == 'bse_cm' || scrip['Exseg'] == "nse_cm") {
        this.cncvalid = true;
      } else {
        this.cncvalid = false;
      }
      this.ordgenerator.patchValue({ position: 'mis' });
      if (scrip['Pcode'] == 'CO') {
        this.ordgenerator.patchValue({ complexty: 'co' });
      } else if (scrip['Pcode'] == 'BO') {
        this.ordgenerator.patchValue({ complexty: 'bo' });
      } else if (scrip['Pcode'] == 'MIS') {
        this.ordgenerator.patchValue({ position: 'mis' });
      } else if (scrip['Pcode'] == 'NRML') {
        this.ordgenerator.patchValue({ position: 'nrml' });
      } else if (scrip['Pcode'] == 'CNC') {
        this.ordgenerator.patchValue({ position: 'cnc' });
      } else if (scrip['Pcode'] == 'REGULAR') {
        this.ordgenerator.patchValue({ complexty: 'regular' });
      } else {
        this.ordgenerator.patchValue({ complexty: 'regular' });
      }
      // this.ordgenerator.patchValue({ complexty: scrip['Pcode'] == 'CO' ? 'co' : 'regular' || scrip['Pcode'] == 'BO' ? 'bo' : 'regular'});
      this.ordgenerator.patchValue({ orderTypeSelect: scrip['Prctype'] });
      this.ordgenerator.patchValue({ discQty: scrip['Dscqty'] })
      this.ordgenerator.patchValue({ quantity: scrip['Qty'] });
      if (scrip['Prctype'] == 'SL-M') {
        this.ordgenerator.patchValue({ trigPriceVal: scrip['Trgprc'] });
        //this.is_qtyVal = true;
        this.is_priceVal = true;
        this.is_stplss = true;
        this.is_target = true;
        this.is_tralngstplss = true;
        this.is_discloseQty = true;
      }
      if (scrip['Prctype'] == 'L') {
        this.ordgenerator.patchValue({ priceVal: scrip['Prc'] });
        this.ordgenerator.patchValue({ trigPriceVal: scrip['Trgprc'] });
        this.is_trigPriceVal = true;
        //this.is_qtyVal = true;
        this.is_stplss = true;
        this.is_target = true;
        this.is_tralngstplss = true;
        this.is_discloseQty = true;
      }

      if (scrip['Exchange'] !== "NFO") {
        this.ordgenerator.patchValue({ quantity: scrip['Qty'] });
        this.tikLot = Number(1);
        this.is_discloseQty = null;
      } else {
        this.ordgenerator.patchValue({ quantity: scrip['Qty'] });
        this.tikLot = Number(scrip['bqty']);
        this.is_discloseQty = true;
      }
      this.lotSize = Number(scrip['bqty']);

      this.save = 'Modify';
      // this.tikLot = Number(scrip['bqty']);

      let tik = Number(scrip['ticksize']);
      let multi = Number(scrip['multiplier']);
      let preci = Number(scrip['decprec']);
      this.tikPrc = (tik) / (multi * Math.pow(10, preci));

    } else if (page == 'optionchain') {
      this.scripobj = scrip;
      this.page = page;
      this.symName = scrip['symbolname'];
      if (scrip['ExchSeg'] == 'bse_cm' || scrip['ExchSeg'] == "nse_cm") {
        this.cncvalid = true;
      } else {
        this.cncvalid = false;
      }
      this.change = scrip['Change'];
      this.perchange = scrip['PerChange'];
      this.tikprice = scrip['ltp'];
      this.exch = scrip['Exchange'];
      this.exchange = scrip['Exchange'];
      this.priceValue = scrip['ltp'];
      this.symtoken = scrip['token'],
        this.ordgenerator.patchValue({ priceVal: scrip['ltp'] });
      this.editInstrmnt = scrip['TradSym'];
      if (scrip['Instrument'] == 'OPTIDX' || scrip['Instrument'] == 'OPTSTK' || scrip['Instrument'] == 'OPTFUT' || scrip['Instrument'] == 'OPTCUR') {
        let strike = scrip.strikeprice.split('.')[1] > 0 ? scrip.strikeprice : scrip.strikeprice.split('.')[0];
        this.editInstrmntname = scrip.symbolname + ' ' + new Date(scrip.Expiry).getDate() + this.months[new Date(scrip.Expiry).getMonth()] + ' ' + Number(strike).toFixed(2) + ' ' + scrip.optiontype;
      } else if (scrip['Instrument'].startsWith('FUT')) {
        this.editInstrmntname = scrip['symbolname'] + ' ' + new Date(scrip['Expiry']).getDate() + this.months[new Date(scrip.Expiry).getMonth()] + ' FUT';
      } else if (scrip['Exchange'] == 'NSE' || scrip['Exchange'] == 'BSE') {
        this.editInstrmntname = scrip['TradSym']
      }
      this.ordgenerator.patchValue({ bstype: bsTyp });
      this.ordgenerator.patchValue({ complexty: "regular" });
      this.ordgenerator.patchValue({ orderTypeSelect: "L" });
      this.ordgenerator.patchValue({ position: "mis" });
      // this.ordgenerator.patchValue({ quantity: scrip['bodlot'] });
      this.save = bsTyp;
      if (scrip['Exch'] !== "NFO") {
        this.ordgenerator.patchValue({ quantity: scrip['minQty'] });
        this.tikLot = Number(scrip['minQty']);
        this.is_discloseQty = null;
        this.hideDiscQty = true;
      } else {
        this.ordgenerator.patchValue({ quantity: scrip['bodlot'] });
        this.tikLot = Number(scrip['bodlot']);
        this.hideDiscQty = false;
      }
      // this.tikLot = Number(scrip['bodlot']);
      this.lotSize = Number(scrip['bodlot']);

      let tik = Number(scrip['tcksize']);
      let multi = Number(scrip['multiplier']);
      let preci = Number(scrip['decimalPrecision']);
      this.tikPrc = (tik) / (multi * Math.pow(10, preci));
    } else {
      this.scripobj = scrip;
      this.page = page;
      this.symName = scrip['symbolname'];
      if (scrip['ExchSeg'] == 'bse_cm' || scrip['ExchSeg'] == "nse_cm") {
        this.cncvalid = true;
      } else {
        this.cncvalid = false;
      }
      this.change = scrip['Change'];
      this.perchange = scrip['PerChange'];
      this.tikprice = scrip['ltp'];
      this.exch = scrip['Exchange'];
      this.exchange = scrip['Exchange'];
      this.priceValue = scrip['ltp'];
      this.symtoken = scrip['token'];
      this.ordgenerator.patchValue({ priceVal: scrip['ltp'] });
      this.ordgenerator.patchValue({ complextyType: 'day' })
      this.editInstrmnt = scrip['TradSym'];
      if (scrip['Instrument'] == 'OPTIDX' || scrip['Instrument'] == 'OPTSTK' || scrip['Instrument'] == 'OPTFUT' || scrip['Instrument'] == 'OPTCUR') {
        let strike = scrip.strikeprice.split('.')[1] > 0 ? scrip.strikeprice : scrip.strikeprice.split('.')[0];
        this.editInstrmntname = scrip.symbolname + ' ' + new Date(scrip.Expiry).getDate() + this.months[new Date(scrip.Expiry).getMonth()] + ' ' + Number(strike).toFixed(2) + ' ' + scrip.optiontype;
      } else if (scrip['Instrument'].startsWith('FUT')) {
        this.editInstrmntname = scrip['symbolname'] + ' ' + new Date(scrip['Expiry']).getDate() + this.months[new Date(scrip.Expiry).getMonth()] + ' FUT';
      } else if (scrip['Exchange'] == 'NSE' || scrip['Exchange'] == 'BSE') {
        this.editInstrmntname = scrip['TradSym']
      }
      this.ordgenerator.patchValue({ bstype: bsTyp });
      this.ordgenerator.patchValue({ complexty: "regular" });
      this.ordgenerator.patchValue({ orderTypeSelect: "L" });
      this.ordgenerator.patchValue({ position: "mis" });
      this.save = bsTyp;
      if (scrip['Exchange'] !== "NFO") {
        this.ordgenerator.patchValue({ quantity: scrip['minQty'] });
        this.tikLot = Number(scrip['minQty']);
        this.is_discloseQty = null;
        this.hideDiscQty = true;
      } else {
        this.ordgenerator.patchValue({ quantity: scrip['bodlot'] });
        this.tikLot = Number(scrip['bodlot']);
        this.hideDiscQty = false;
      }
      // this.tikLot = Number(scrip['bodlot']);
      this.lotSize = Number(scrip['bodlot']);

      let tik = Number(scrip['tcksize']);
      let multi = Number(scrip['multiplier']);
      let preci = Number(scrip['decimalPrecision']);
      this.tikPrc = (tik) / (multi * Math.pow(10, preci));
    }
    this.formtypselect();
    document.getElementById("openModalButton").click();
  }

  /**
 * func invoked from marketwatch buy/sell button on hover
 * @param bstype 
 */
  AddPositionMWList(bsTyp, scrip, page) {
    // console.log(bsTyp, scrip, page)
    this.getPositionPricerange(scrip);
    this.page = page;
    if (scrip['Instname'] == 'OPTIDX' || scrip['Instname'] == 'OPTSTK' || scrip['Instname'] == 'OPTFUT' || scrip['Instname'] == 'OPTCUR') {
      let strike = scrip.Stikeprc.split('.')[1] > 0 ? scrip.Stikeprc : scrip.Stikeprc.split('.')[0];
      this.editInstrmntname = scrip.Symbol + ' ' + new Date(scrip.Expdate).getDate() + this.months[new Date(scrip.Expdate).getMonth()] + ' ' + Number(strike).toFixed(2) + ' ' + scrip.Opttype;
    } else if (scrip['Instname'].startsWith('FUT')) {
      this.editInstrmntname = scrip['Symbol'] + ' ' + new Date(scrip['Expdate']).getDate() + this.months[new Date(scrip.Expdate).getMonth()] + ' FUT';
    } else if (scrip['Exchange'] == 'NSE' || scrip['Exchange'] == 'BSE') {
      this.editInstrmntname = scrip['Tsym']
    }
    this.symName = scrip['Symbol'];
    this.exch = scrip["Exchange"];
    this.priceValue = scrip["LTP"];
    this.symtoken = scrip["Token"];
    this.ordgenerator.patchValue({ priceVal: scrip["LTP"] });
    this.editInstrmnt = scrip['Tsym'];
    this.ordgenerator.patchValue({ bstype: bsTyp });
    if (scrip["Pcode"] == 'CO') {
      this.ordgenerator.patchValue({ complexty: scrip["Pcode"].toLowerCase() });
    } else {
      this.ordgenerator.patchValue({ complexty: "regular" });
    }
    this.ordgenerator.patchValue({ orderTypeSelect: "L" });
    if (scrip['Exchangeseg'] == 'bse_cm' || scrip['Exchangeseg'] == "nse_cm") {
      this.cncvalid = true;
    } else {
      this.cncvalid = false;
    }
    if (scrip['Pcode'] == 'CNC' || scrip['Pcode'] == 'MIS' || scrip['Pcode'] == 'NRML') {
      this.ordgenerator.patchValue({ position: scrip['Pcode'].toLowerCase() });
    } else {
      this.ordgenerator.patchValue({ position: "mis" });
    }

    if (scrip['Exchange'] !== "NFO") {
      this.ordgenerator.patchValue({ quantity: scrip['Netqty'].replace(/-/g, "") });
    } else {
      // this.ordgenerator.patchValue({ quantity: scrip['BLQty'] });
      this.ordgenerator.patchValue({ quantity: scrip['Netqty'].replace(/-/g, "") });
    }
    this.formtypselect();
    this.save = bsTyp;
    document.getElementById("openModalButton").click();
  }

  saveOrders(Id, e) {
    this.placedata = [];
    if (this.page == "mktwatch") {
      this.retType = this.ordgenerator.value['complextyType'].toString().toUpperCase();
      var placeOdr = {
        active_status: null,
        complexty: this.ordgenerator.value['complexty'],
        created_by: null,
        created_on: null,
        discqty: this.ordgenerator.value['discQty'],
        emsg: null,
        exch: this.exch,
        id: null,
        instrument: this.symName,
        link: null,
        master_id: 0,
        pCode: this.ordgenerator.value['complexty'] == 'co' ? 'CO' : this.ordgenerator.value['position'],
        prctyp: this.ordgenerator.value['orderTypeSelect'],
        price: this.ordgenerator.value['priceVal'],
        qty: this.ordgenerator.value['quantity'],
        reponse: null,
        ret: this.retType,
        // ret: this.ordgenerator.value['mktType'],
        salt: null,
        stat: null,
        stopLoss: this.ordgenerator.value['stplss'],
        symbol_id: this.symtoken,
        target: this.ordgenerator.value['target'],
        trading_symbol: this.editInstrmnt.trim(),
        trailing_stop_loss: this.ordgenerator.value['tralngstplss'] / this.tikPrc,
        transtype: this.ordgenerator.value['bstype'],
        trigPrice: this.ordgenerator.value['trigPriceVal'],
        updated_by: null,
        updated_on: null,
        userId: this.odrServ.getUserId(),
        userSessionID: this.odrServ.getSessionToken(),
        userSettingDto: this.odrServ.getUserSettingDto()
      }
      this.placedata.push(placeOdr);
      // this.orderPlace(placedata);
    } else if (this.page == "optionchain") {
      var placeOdr = {
        active_status: null,
        complexty: this.ordgenerator.value['complexty'],
        created_by: null,
        created_on: null,
        discqty: this.ordgenerator.value['discQty'],
        emsg: null,
        exch: this.exch,
        id: null,
        instrument: this.symName,
        link: null,
        master_id: 0,
        pCode: this.ordgenerator.value['complexty'] == 'co' ? 'CO' : this.ordgenerator.value['position'],
        prctyp: this.ordgenerator.value['orderTypeSelect'],
        price: this.ordgenerator.value['priceVal'],
        qty: this.ordgenerator.value['quantity'],
        reponse: null,
        ret: this.retType,
        // ret: this.ordgenerator.value['mktType'],
        salt: null,
        stat: null,
        stopLoss: this.ordgenerator.value['stplss'],
        symbol_id: this.symtoken,

        target: this.ordgenerator.value['target'],
        trading_symbol: this.editInstrmnt.trim(),
        trailing_stop_loss: this.ordgenerator.value['tralngstplss'] / this.tikPrc,
        transtype: this.ordgenerator.value['bstype'],
        trigPrice: this.ordgenerator.value['trigPriceVal'],
        updated_by: null,
        updated_on: null,
        userId: this.odrServ.getUserId(),
        userSessionID: this.odrServ.getSessionToken(),
        userSettingDto: this.odrServ.getUserSettingDto()
      }
      this.placedata.push(placeOdr);
      // this.orderPlace(placedata);
    } else if (this.page == "orderModify") {
      this.modifyData = {
        discqty: this.ordgenerator.value['discQty'],
        exch: this.modScrip['Exchange'],
        exchSeg: this.modScrip['Exseg'],
        pCode: this.ordgenerator.value['position'],
        prctyp: this.ordgenerator.value['orderTypeSelect'],
        price: this.ordgenerator.value['priceVal'],
        qty: this.ordgenerator.value['quantity'],
        symbol_id: this.symtoken,
        trading_symbol: this.editInstrmnt.trim(),
        transtype: this.ordgenerator.value['bstype'],
        trigPrice: this.ordgenerator.value['trigPriceVal'] == "" ? "0.00" : this.ordgenerator.value['trigPriceVal'],
        userId: this.odrServ.getUserId(),
        nestOrderNumber: this.modScrip['Nstordno'],
        account_id: this.modScrip['accountId'],
        scripToken: this.modScrip['token'],
        mktPro: this.modScrip['Mktpro'],
        s_prdt_ali: this.odrServ.getUserSettingDto().s_prdt_ali,
        filledQuantity: this.modScrip['Fillshares'],
        validity: this.modScrip['Validity']
      }
    } else if (this.page == "orderGenModify") {
      this.modifyOdrGenData['discqty'] = this.modifyOdrGenData['discqty'] == this.ordgenerator.value['discQty'] ? this.modifyOdrGenData['discqty'] : this.ordgenerator.value['discQty'];
      this.modifyOdrGenData['pCode'] = this.modifyOdrGenData['pCode'] == this.ordgenerator.value['position'] ? this.modifyOdrGenData['pCode'] : this.ordgenerator.value['position'];
      this.modifyOdrGenData['prctyp'] = this.modifyOdrGenData['prctyp'] == this.ordgenerator.value['orderTypeSelect'] ? this.modifyOdrGenData['prctyp'] : this.ordgenerator.value['orderTypeSelect'];
      this.modifyOdrGenData['price'] = this.modifyOdrGenData['price'] == this.ordgenerator.value['orderTypeSelect'] ? this.modifyOdrGenData['price'] : this.ordgenerator.value['priceVal'];
      this.modifyOdrGenData['qty'] = this.modifyOdrGenData['qty'] == this.ordgenerator.value['quantity'] ? this.modifyOdrGenData['qty'] : this.ordgenerator.value['quantity'];
      this.modifyOdrGenData['transtype'] = this.modifyOdrGenData['transtype'] == this.ordgenerator.value['bstype'] ? this.modifyOdrGenData['transtype'] : this.ordgenerator.value['bstype'];
      this.modifyOdrGenData['trigPrice'] = this.modifyOdrGenData['trigPrice'] == this.ordgenerator.value['trigPriceVal'] ? this.modifyOdrGenData['trigPrice'] : this.ordgenerator.value['trigPriceVal'];
      this.modifyOdrGenData['stopLoss'] = this.modifyOdrGenData['stopLoss'] == this.ordgenerator.value['stplss'] ? this.modifyOdrGenData['stopLoss'] : this.ordgenerator.value['stplss'];
      this.modifyOdrGenData['target'] = this.modifyOdrGenData['target'] == this.ordgenerator.value['target'] ? this.modifyOdrGenData['target'] : this.ordgenerator.value['target'];
      this.modifyOdrGenData['trailing_stop_loss'] = this.modifyOdrGenData['trailing_stop_loss'] == this.ordgenerator.value['tralngstplss'] ? this.modifyOdrGenData['trailing_stop_loss'] : this.ordgenerator.value['tralngstplss'];
    } else {
      this.dataService.broadcastData(Id, this.ordgenerator.value);
    }
    var tranType = this.ordgenerator.value['bstype']; //buy/sell
    var pcode = this.ordgenerator.value['position']; // mis/nrml
    var complexty = this.ordgenerator.value['complexty']; // regular/bo/co/amo
    var prctyp = this.ordgenerator.value['orderTypeSelect']; // l/mkt/sl/sl-m
    var priceVal = Number(this.ordgenerator.value['priceVal']);
    var trigPriceVal = Number(this.ordgenerator.value['trigPriceVal']);
    var stloss = Number(this.ordgenerator.value['stplss']);
    var trget = Number(this.ordgenerator.value['target']);
    var trlingstplss = Number(this.ordgenerator.value['tralngstplss'] / this.tikPrc);
    var qtyy = Number(this.ordgenerator.value['quantity']);
    var discQty = Number(this.ordgenerator.value['discQty']);
    if (this.page != "orderGenModify") {
      if (this.exch['Exchange'] == 'MCX') {
        this.discTen = Math.ceil(qtyy * (25 / 100));
      } else {
        this.discTen = Math.ceil(qtyy * (10 / 100));
      }
    }

    if (this.page == 'optionchain') {
      if (this.save == 'buy' && complexty == 'co') {
        this.coTrig = +this.scripobj['BestSellPrice'] - +(this.scripobj['BestSellPrice'] * 0.03);
        if (Number(trigPriceVal).toFixed(2) >= Number(this.coTrig).toFixed(2)) {
          this.isTrigCo = false;
        } else {
          this.isTrigCo = true;
          return false;
        }
      } else if (this.save == 'sell' && complexty == 'co') {
        //console.log(this.scripobj)
        this.coTrig = +this.scripobj['BestBuyPrice'] + +(this.scripobj['BestBuyPrice'] * 0.03);
        if (Number(trigPriceVal).toFixed(2) <= Number(this.coTrig).toFixed(2)) {
          this.isTrigCo = false;
        } else {
          this.isTrigCo = true;
          return false;
        }
      }
    }

    if (discQty == 0 || (discQty >= this.discTen && discQty <= qtyy)) {
      this.chkDisc = false;
      //return true;
    } else {
      this.chkDisc = true;
      return false;
    }
    if (complexty == 'bo') {
      if (stloss <= 0) {
        this.stplzero = true;
        return false;
      } else {
        this.stplzero = false;
      }
      if (trget <= 0) {
        this.trgetZero = true;
        return false;
      } else {
        this.trgetZero = false;
      }
    }
    if (qtyy < 0) {
      this.qtyzro = true;
      this.prczro = false;
      this.thPrczro = false;
      this.stplzero = false;
      this.trgetZero = false;
      this.trgstplss = false;
    } else if (priceVal < 0) {
      this.prczro = true;
      this.qtyzro = false;
      this.thPrczro = false;
      this.stplzero = false;
      this.trgetZero = false;
      this.trgstplss = false;
      return false;
    } else if (trigPriceVal < 0) {
      this.thPrczro = true;
      this.prczro = false;
      this.qtyzro = false;
      this.stplzero = false;
      this.trgetZero = false;
      this.trgstplss = false;
      return false;
    } else if (stloss < 0) {
      this.stplzero = true;
      this.thPrczro = false;
      this.prczro = false;
      this.qtyzro = false;
      this.trgetZero = false;
      this.trgstplss = false;

      return false;
    } else if (trget < 0) {
      this.trgetZero = true;
      this.stplzero = false;
      this.thPrczro = false;
      this.prczro = false;
      this.qtyzro = false;
      this.trgstplss = false;
      return false;
    } else if (trlingstplss < 0) {
      this.trgstplss = true;
      this.trgetZero = false;
      this.stplzero = false;
      this.thPrczro = false;
      this.prczro = false;
      this.qtyzro = false;

      return false;
    } else {

      this.qtyzro = false;
      this.prczro = false;
      this.thPrczro = false;
      this.stplzero = false;
      this.trgetZero = false;
      this.trgstplss = false;
      if (tranType == "buy") {
        if (complexty == 'regular' && prctyp == 'SL' && (pcode == 'mis' || pcode == 'nrml')) {
          if (trigPriceVal <= priceVal) {
            this.thPrc = false;
            this.tlPrc = false;
            if (this.page == "mktwatch") {
              this.orderPlace(this.placedata);
            } else if (this.page == "orderModify") {
              this.orderModify(this.modifyData);
            } else if (this.page == "orderGenModify") {
              this.ordersGenModify(this.modifyOdrGenData);
            } else if (this.page == "optionchain") {
              this.addBasketOrder(this.placedata);
            }
            this.resetposition();
          } else {
            this.thPrc = true;
            this.tlPrc = false;
            e.preventDefault();
          }
        }
        else if (complexty == 'bo' && prctyp == 'L' && pcode == 'mis') {
          let per = false;
          let per2 = false;
          // if (stloss < priceVal && stloss != 0) {
          //   this.slHigh = false;
          //   this.slLess = false;
          //   per2 = true;
          // } else {
          //   per = false;
          //   per2 = false;
          //   this.slLess = true;
          //   this.slHigh = false;
          // }

          // if (trget > priceVal) {
          //   this.trHigh = false;
          //   this.trLess = false;
          //   per = true;
          // } else {
          //   per = false;
          //   per2 = false;
          //   this.trLess = false;
          //   this.trHigh = true;
          // }

          // if (per && per2) {
          //   if (this.page == "mktwatch") {
          //     this.orderPlace(this.placedata);
          //   } else if (this.page == "orderModify") {
          //     this.orderModify(this.modifyData);
          //   }
          //   this.resetposition();

          // } else {
          //   e.preventDefault();
          // }
          if ((trlingstplss / this.tikPrc < 20) && trlingstplss != 0) {
            this.trail20 = true;
            this.minTick = this.tikPrc * 20;
            e.preventDefault();
          } else {
            if (this.page == "mktwatch") {
              this.orderPlace(this.placedata);
            } else if (this.page == "orderModify") {
              this.orderModify(this.modifyData);
            } else if (this.page == "orderGenModify") {
              this.ordersGenModify(this.modifyOdrGenData);
            } else if (this.page == "optionchain") {
              this.addBasketOrder(this.placedata);
            }
            this.resetposition();

          }
        } else if (complexty == 'bo' && prctyp == 'SL' && pcode == 'mis') {

          // if (trigPriceVal > priceVal) {
          //   this.thPrc = false;
          //   // this.tlPrc = true;
          //   this.thPrc = true;
          //   e.preventDefault();
          // }

          // if (trigPriceVal <= priceVal) {
          //   this.thPrc = false;
          //   this.tlPrc = false;
          //   if (this.page == "mktwatch") {
          //     this.orderPlace(this.placedata);
          //   } else if (this.page == "orderModify") {
          //     this.orderModify(this.modifyData);
          //   }
          //   this.resetposition();

          // } else {
          //   this.thPrc = true;
          //   this.tlPrc = false;
          //   e.preventDefault();
          // }
          if ((trlingstplss / this.tikPrc < 20) && trlingstplss != 0) {
            this.trail20 = true;
            this.minTick = this.tikPrc * 20;
            e.preventDefault();
          } else {
            if (this.page == "mktwatch") {
              this.orderPlace(this.placedata);
            } else if (this.page == "orderModify") {
              this.orderModify(this.modifyData);
            } else if (this.page == "orderGenModify") {
              this.ordersGenModify(this.modifyOdrGenData);
            } else if (this.page == "optionchain") {
              this.addBasketOrder(this.placedata);
            }
            this.resetposition();
          }
        } else if (complexty == 'co' && pcode == 'mis' && (prctyp == 'market' || prctyp == 'L')) {
          // if (trigPriceVal > priceVal) {
          //   this.thPrc = false;
          //   this.tlPrc = true;
          //   e.preventDefault();
          // }

          if (trigPriceVal <= priceVal) {
            this.thPrc = false;
            this.tlPrc = false;
            if (this.page == "mktwatch") {
              this.orderPlace(this.placedata);
            } else if (this.page == "orderModify") {
              this.orderModify(this.modifyData);
            } else if (this.page == "orderGenModify") {
              this.ordersGenModify(this.modifyOdrGenData);
            } else if (this.page == "optionchain") {
              this.addBasketOrder(this.placedata);
            }
            this.resetposition();

          } else {
            this.thPrc = true;
            this.tlPrc = false;
            e.preventDefault();
          }

        }
        else if (complexty == 'amo' && prctyp == 'SL' && (pcode == 'mis' || pcode == 'nrml')) {
          // if (trigPriceVal > priceVal) {
          //   this.thPrc = true;
          //   e.preventDefault();
          // } else {
          //   this.thPrc = false;
          // }

          if (trigPriceVal <= priceVal) {
            this.thPrc = false;
            this.tlPrc = false;
            if (this.page == "mktwatch") {
              this.orderPlace(this.placedata);
            } else if (this.page == "orderModify") {
              this.orderModify(this.modifyData);
            } else if (this.page == "orderGenModify") {
              this.ordersGenModify(this.modifyOdrGenData);
            } else if (this.page == "optionchain") {
              this.addBasketOrder(this.placedata);
            }
            this.resetposition();

          } else {
            this.thPrc = true;
            this.tlPrc = false;
            e.preventDefault();
          }

        } else {
          if (this.page == "mktwatch") {
            this.orderPlace(this.placedata);
          } else if (this.page == "orderModify") {
            this.orderModify(this.modifyData);
          } else if (this.page == "orderGenModify") {
            this.ordersGenModify(this.modifyOdrGenData);
          } else if (this.page == "optionchain") {
            this.addBasketOrder(this.placedata);
          }
          this.resetposition();
        }

      } else {
        if (complexty == 'regular' && prctyp == 'SL' && (pcode == 'mis' || pcode == 'nrml')) {

          // if (trigPriceVal < priceVal) {
          //   this.tlPrc = true;
          //   this.thPrc = false;
          //   e.preventDefault();
          // } else {
          //   this.tlPrc = false;
          //   this.thPrc = false;
          // }

          if (trigPriceVal >= priceVal) {
            this.thPrc = false;
            this.tlPrc = false;
            if (this.page == "mktwatch") {
              this.orderPlace(this.placedata);
            } else if (this.page == "orderModify") {
              this.orderModify(this.modifyData);
            } else if (this.page == "orderGenModify") {
              this.ordersGenModify(this.modifyOdrGenData);
            } else if (this.page == "optionchain") {
              this.addBasketOrder(this.placedata);
            }
            this.resetposition();

          } else {
            this.thPrc = false;
            this.tlPrc = true;
            e.preventDefault();
          }

        } else if (complexty == 'bo' && prctyp == 'L' && pcode == 'mis') {
          let per = false;
          let per2 = false;
          // if (stloss > priceVal && stloss != 0) {
          //   this.slHigh = false;
          //   this.slLess = false;
          //   per = true;
          // } else {
          //   per = false;
          //   this.slLess = false;
          //   this.slHigh = true;
          // }

          // if (trget < priceVal) {
          //   this.trHigh = false;
          //   this.trLess = false;
          //   per2 = true;
          // } else {
          //   per2 = false;
          //   this.trLess = true;
          //   this.trHigh = false;
          // }

          // if (per && per2) {
          //   if (this.page == "mktwatch") {
          //     this.orderPlace(this.placedata);
          //   } else if (this.page == "orderModify") {
          //     this.orderModify(this.modifyData);
          //   }
          //   this.resetposition();

          // } else {
          //   e.preventDefault();
          // }
          if ((trlingstplss / this.tikPrc < 20) && trlingstplss != 0) {
            this.trail20 = true;
            this.minTick = this.tikPrc * 20;
            e.preventDefault();
          } else {
            if (this.page == "mktwatch") {
              this.orderPlace(this.placedata);
            } else if (this.page == "orderModify") {
              this.orderModify(this.modifyData);
            } else if (this.page == "orderGenModify") {
              this.ordersGenModify(this.modifyOdrGenData);
            } else if (this.page == "optionchain") {
              this.addBasketOrder(this.placedata);
            }
            this.resetposition();
          }
        } else if (complexty == 'bo' && prctyp == 'SL' && pcode == 'mis') {
          // if (trigPriceVal < priceVal) {
          //   this.thPrc = false;
          //   this.tlPrc = true;
          //   e.preventDefault();
          // }

          // if (trigPriceVal >= priceVal) {
          //   this.thPrc = false;
          //   this.tlPrc = false;
          //   if (this.page == "mktwatch") {
          //     this.orderPlace(this.placedata);
          //   } else if (this.page == "orderModify") {
          //     this.orderModify(this.modifyData);
          //   }
          //   this.resetposition();

          // } else {
          //   this.thPrc = false;
          //   this.tlPrc = true;
          //   e.preventDefault();
          // }
          if ((trlingstplss / this.tikPrc < 20) && trlingstplss != 0) {
            this.trail20 = true;
            this.minTick = this.tikPrc * 20;
            e.preventDefault();
          } else {
            if (this.page == "mktwatch") {
              this.orderPlace(this.placedata);
            } else if (this.page == "orderModify") {
              this.orderModify(this.modifyData);
            } else if (this.page == "orderGenModify") {
              this.ordersGenModify(this.modifyOdrGenData);
            } else if (this.page == "optionchain") {
              this.addBasketOrder(this.placedata);
            }
            this.resetposition();
          }
        } else if (complexty == 'co' && pcode == 'mis' && (prctyp == 'market' || prctyp == 'L')) {
          // if (trigPriceVal < priceVal) {
          //   this.thPrc = false;
          //   this.tlPrc = true;
          //   e.preventDefault();
          // }

          if (trigPriceVal >= priceVal) {
            this.thPrc = false;
            this.tlPrc = false;
            if (this.page == "mktwatch") {
              this.orderPlace(this.placedata);
            } else if (this.page == "orderModify") {
              this.orderModify(this.modifyData);
            } else if (this.page == "orderGenModify") {
              this.ordersGenModify(this.modifyOdrGenData);
            } else if (this.page == "optionchain") {
              this.addBasketOrder(this.placedata);
            }
            this.resetposition();

          } else {
            this.thPrc = false;
            this.tlPrc = true;
            e.preventDefault();
          }

        } else if (complexty == 'amo' && prctyp == 'SL' && (pcode == 'mis' || pcode == 'nrml')) {

          // if (trigPriceVal < priceVal) {
          //   this.tlPrc = true;
          //   this.thPrc = false;
          //   e.preventDefault();
          // } else {
          //   this.tlPrc = false;
          //   this.thPrc = false;
          // }

          if (trigPriceVal >= priceVal) {
            this.thPrc = false;
            this.tlPrc = false;
            if (this.page == "mktwatch") {
              this.orderPlace(this.placedata);
            } else if (this.page == "orderModify") {
              this.orderModify(this.modifyData);
            } else if (this.page == "orderGenModify") {
              this.ordersGenModify(this.modifyOdrGenData);
            } else if (this.page == "optionchain") {
              this.addBasketOrder(this.placedata);
            }
            this.resetposition();

          } else {
            this.thPrc = false;
            this.tlPrc = true;
            e.preventDefault();
          }

        } else {
          if (this.page == "mktwatch") {
            this.orderPlace(this.placedata);
          } else if (this.page == "orderModify") {
            this.orderModify(this.modifyData);
          } else if (this.page == "orderGenModify") {
            this.ordersGenModify(this.modifyOdrGenData);
          } else if (this.page == "optionchain") {
            this.addBasketOrder(this.placedata);
          }

          this.resetposition();
        }

      }

    }
  }

  addBasketOrder(object) {
    this.dataService.shareBasketData(object[0]);
  }

  orderPlace(data) {
    this.odrServ.placeOrder(data).subscribe(dataresp => {
      dataresp.map(respItem => {
        if (respItem['stat'] == 'Ok') {
          this.dataService.excuteOrders(true);
          this.toastr.successToastr('Order placed Successfully', '', { showCloseButton: true });
        } else {
          this.toastr.errorToastr('Order failed', '', { showCloseButton: true });
        }
        if (respItem['emsg'] == "Session Expired") {
          localStorage.clear();
          this.routeTo.navigateByUrl('login');
        }
      })
    }, (err) => {
     // console.log("err", err.error)
      if (err.error == "Unauthorized") {
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  //Modify the selected order
  orderModify(obj) {
    this.odrServ.orderModify(obj).subscribe(dataresp => {
      if (dataresp['stat'] == 'Ok') {
        this.toastr.successToastr("Modified Sucessfully", '', { showCloseButton: true });
        this.dataService.excuteOrders(true);
      }
      if (dataresp['stat'] == 'Not_Ok') {
        this.toastr.errorToastr("Modify failed", '', { showCloseButton: true });
        this.dataService.excuteOrders(true);
      }
      if (dataresp['stat'] == "Session Expired") {
        localStorage.clear();
        this.routeTo.navigateByUrl('login');
      }
    }, (err) => {
    //  console.log("err", err.error)
      if (err.error == "Unauthorized") {
        this.routeTo.navigateByUrl('login');
      }
    });
  }

  ordersGenModify(obj) {
  //  console.log("orderGenModify", obj)
    var orderGen: any = JSON.parse(localStorage.getItem('editorders'));
    orderGen.map((item, index) => {
      if (item['id'] == obj['id']) {
        orderGen.splice(index, 1);
        orderGen.push(obj);
      }
    });
    localStorage.setItem('editorders', JSON.stringify(orderGen));
    this.dataService.ordersEditer(true);
  }

  getFunds(result) {
    this.avalbal = result[0].net;
    this.mtm = +result[0].unrealizedMtomPrsnt + +result[0].realizedMtomPrsnt;
  }


  /**
   * click functiion from model box buy/sell button 
   * @param bstype 
   */
  buysellType(bstype) {
    if (bstype == 'buy') {
      this.currentFormControlName = "bstype";
      this.bgColorBStype = bstype;
      if (this.page == "mktwatch") {
        this.save = bstype;
      } else {
        this.save = "save";
      }
    } else {
      this.bgColorBStype = bstype;
      if (this.page == "mktwatch") {
        this.save = bstype;
      } else {
        this.save = "save";
      }
    }
    this.ordgenerator.value["bstype"] = bstype;
    this.formtypselect();
  }

  formtypselectType(value) {
    if (value == "day") {
      this.retType = "DAY";
      this.is_discloseQty = null;
      if (this.exch == 'NFO' || this.exch == 'CDS' && value == 'day') {
        this.is_discloseQty = true;
      } else {
        this.is_discloseQty = null;
      }
    } else {
      this.retType = "IOC";
      this.is_discloseQty = true;
    }
  }

  radioChange(event) {
    // console.log(event);
    // console.log(event.value);
    // console.log(event.source);
    //this.filter['property'] = this.selected;
    //console.log(this.filter);
  }

  /**
 * ONchange Function for to disable particular fields value
 * validation for model
 */
  formtypselect() {
    this.qtyzro = false;
    this.chkqty = false;
    this.prczro = false;
    this.chkPrc = false;
    this.chkTPrc = false;
    this.thPrc = false;
    this.tlPrc = false;
    this.thPrczro = false;
    this.chkstp = false;
    this.stplzero = false;
    this.chktrgt = false;
    this.trghPrc = false;
    this.trgetZero = false;
    this.chktstp = false;
    this.trgstplss = false;
    this.slLess = false;
    this.slHigh = false;
    this.trLess = false;
    this.trHigh = false;
    this.trail20 = false;
    this.bgColorBStype = this.ordgenerator.value['bstype'];
    var bstype = this.ordgenerator.value['bstype'];
  //  console.log(bstype)
    switch (bstype) {
      case 'buy':
        this.bgColorBStype = this.ordgenerator.value['bstype'];
        this.setComplexity();
        break;
      case 'sell':
        this.bgColorBStype = this.ordgenerator.value['bstype'];
        this.setComplexity();
        break;
    }
  }


  setComplexity() {
    // console.log("this.page", this.page)
    var complexty = this.ordgenerator.value['complexty'];
    var position = this.ordgenerator.value['position'];
    var orderTypeSelect = this.ordgenerator.value['orderTypeSelect'];
    // console.log(complexty, position, orderTypeSelect)
    this.priceValue = this.priceValue.toString().replace(/,/g, "");
    switch (complexty) {
      case "regular":
        this.bo_msg = false;
        this.is_mktType = null;
        this._validity_day = null;
        switch (position) {
          case "mis":
            switch (orderTypeSelect) {
              case "L":
                if (this.page == "orderModify") {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this._validity_ioc = null;
                  this.is_mkt = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this._validity_ioc = null;
                  this.is_mkt = null;
                } else {
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.is_nrml = null;
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                  this._validity_ioc = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                  this.is_qtyVal = null;
                }

                break;
              case "MKT":
                if (this.page == "orderModify") {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this._validity_ioc = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this._validity_ioc = null;
                } else {
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = null;
                  this._amo = null;
                  this._validity_ioc = null;
                }
                break;
              case "SL":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mkt = null;
                  this._validity_ioc = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mkt = null;
                  this._validity_ioc = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                } else {
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mkt = null;
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = true;
                  this._amo = null;
                  this._validity_ioc = true;
                }

                break;
              case "SL-M":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  this._validity_ioc = null;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  this._validity_ioc = null;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                } else {
                  this.is_nrml = null;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  this._validity_ioc = null;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = true;
                  this._amo = null;
                }
                break;
            }
            break; //mis
          case "nrml":
            switch (orderTypeSelect) {
              case "L":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_trigPriceVal = true;
                  this._validity_ioc = null;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_mkt = null;
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_trigPriceVal = true;
                  this._validity_ioc = null;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_mkt = null;
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                } else {
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_mkt = null;
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this._validity_ioc = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = true;
                  this._amo = null;
                  if (this.exch == 'NFO' && this.ordgenerator.value["complextyType"] == 'day') {
                    this.is_discloseQty = true;
                  } else {
                    this.is_discloseQty = null;
                  }
                }
                break;
              case "MKT":
                if (this.page == "orderModify") {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this._validity_ioc = null;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                } else if (this.page == 'orderGenModify') {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this._validity_ioc = null;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                } else {
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this._validity_ioc = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = null;
                  this._amo = null;
                  if (this.exch == 'NFO' && this.ordgenerator.value["complextyType"] == 'day') {
                    this.is_discloseQty = true;
                  } else {
                    this.is_discloseQty = null;
                  }
                }
                break;
              case "SL":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this._validity_ioc = null;
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this._validity_ioc = null;
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                } else {
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                  this.is_nrml = null;
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this._validity_ioc = true;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = true;
                  this._amo = null;
                  if (this.exch == 'NFO' && this.ordgenerator.value["complextyType"] == 'day') {
                    this.is_discloseQty = true;
                  } else {
                    this.is_discloseQty = null;
                  }
                }
                break;
              case "SL-M":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this._validity_ioc = true;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this._validity_ioc = true;
                } else {
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = true;
                  this._amo = null;
                  this._validity_ioc = true;
                  if (this.exch == 'NFO' && this.ordgenerator.value["complextyType"] == 'day') {
                    this.is_discloseQty = true;
                  } else {
                    this.is_discloseQty = null;
                  }
                }
                break;
            }
            break; //nrml

          case "cnc":
            switch (orderTypeSelect) {
              case "L":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this._validity_ioc = null;
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mkt = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this._validity_ioc = null;
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                } else {
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.is_nrml = null;
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                  this._validity_ioc = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = true;
                  this._amo = null;
                }
                break;
              case "MKT":
                if (this.page == "orderModify") {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this._validity_ioc = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this._validity_ioc = null;
                } else {
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this._validity_ioc = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "SL":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mkt = null;
                  this._validity_ioc = true;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mkt = null;
                  this._validity_ioc = true;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                } else {
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this._validity_ioc = true
                  this.is_mkt = null;
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = true;
                  this._amo = null;
                }

                break;
              case "SL-M":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  this._validity_ioc = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  this._validity_ioc = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                } else {
                  this.is_nrml = null;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this._validity_ioc = true;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = true;
                  this._amo = null;
                }
                break;
            }
            break; //mis
        }
        break; // regular
      case "bo":
        this.is_mis = true;
        this.bo_msg = true;
        this._validity_ioc = true;
        this._validity_day = true;
        this.is_mktType = true;
        switch (position) {
          case "mis":
            switch (orderTypeSelect) {
              case "L":
                if (this.page == "orderModify") {
                  if (this.chkStatus == 'open') {
                    this.is_mis = true;
                    this.is_nrml = true;
                    this._rlgr = true;
                    this._bo = true;
                    this._co = true;
                    this._amo = true;
                    this.is_qtyVal = true;
                    this.is_priceVal = null;
                    this.is_dPriceVal = true;
                    // this.ordgenerator.patchValue({ disqty: "" });
                    this.is_trigPriceVal = true;
                    // this.ordgenerator.patchValue({ trigPriceVal: "" });
                    this.is_stplss = true;
                    this.is_target = true;
                    this.is_tralngstplss = true;
                    this.is_slMkt = true;
                    this.is_mkt = true;
                    this.is_slLmt = true;
                    this._validity_ioc = true;
                  } else if (this.chkStatus == "trigger pending") {
                    this.is_mis = true;
                    this.is_nrml = true;
                    this._rlgr = true;
                    this._bo = true;
                    this._co = true;
                    this._amo = true;
                    this.is_qtyVal = true;
                    this.is_priceVal = true;
                    this.is_dPriceVal = true;
                    // this.ordgenerator.patchValue({ disqty: "" });
                    this.is_trigPriceVal = null;
                    // this.ordgenerator.patchValue({ trigPriceVal: "" });
                    this.is_stplss = true;
                    this.is_target = true;
                    this.is_tralngstplss = true;
                    this.is_slMkt = true;
                    this.is_mkt = true;
                    this.is_slLmt = true;
                    this._validity_ioc = true;
                  } else {
                    this.is_mis = true;
                    this.is_nrml = true;
                    this._rlgr = true;
                    this._bo = true;
                    this._co = true;
                    this._amo = true;
                    this.is_qtyVal = true;
                    this.is_priceVal = true;
                    this.is_dPriceVal = true;
                    // this.ordgenerator.patchValue({ disqty: "" });
                    this.is_trigPriceVal = null;
                    // this.ordgenerator.patchValue({ trigPriceVal: "" });
                    this.is_stplss = true;
                    this.is_target = true;
                    this.is_tralngstplss = true;
                    this.is_slMkt = true;
                    this.is_mkt = true;
                    this.is_slLmt = true;
                    this._validity_ioc = true;
                  }
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = null;
                  this.is_target = null;
                  this.is_tralngstplss = null;
                  this.is_slMkt = true;
                  this.is_mkt = true;
                  this.is_slLmt = true;
                  this._validity_ioc = true;
                } else {
                  this.is_discloseQty = true;
                  this._validity_ioc = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = true;
                  this.ordgenerator.patchValue({ disqty: "" });
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = null;
                  this.is_target = null;
                  this.is_tralngstplss = null;
                  this.is_slMkt = true;
                  this.is_mkt = true;
                  this.is_slLmt = null;
                  this.is_nrml = true;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                  this.ordgenerator.patchValue({ target: 0.00 });
                  this.ordgenerator.patchValue({ tralngstplss: 0.00 });
                  this.ordgenerator.patchValue({ stplss: 0.00 });
                }

                break;
              case "MKT":
                if (this.page == "orderModify") {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_mkt = true;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_stplss = null;
                  this.is_target = null;
                  this.is_tralngstplss = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_mkt = true;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_stplss = null;
                  this.is_target = null;
                  this.is_tralngstplss = null;
                } else {
                  this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_nrml = true;
                  this.is_mkt = true;
                  this.is_slLmt = null;
                  this.is_slMkt = true;
                  this.is_dPriceVal = true;
                  this.ordgenerator.patchValue({ disqty: "" });
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_stplss = null;
                  this.is_target = null;
                  this.is_tralngstplss = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "SL":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_mkt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_trigPriceVal = null;
                  this.is_stplss = null;
                  this.is_target = null;
                  this.is_tralngstplss = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_mkt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_trigPriceVal = null;
                  this.is_stplss = null;
                  this.is_target = null;
                  this.is_tralngstplss = null;
                } else {
                  this.is_nrml = true;
                  this.is_mkt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = true;
                  this.ordgenerator.patchValue({ disqty: "" });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_trigPriceVal = null;
                  this.is_stplss = null;
                  this.is_target = null;
                  this.is_tralngstplss = null;
                  this._validity_ioc = true;
                  this.is_discloseQty = true;
                  this.is_mis = true;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                  this.ordgenerator.patchValue({ target: 0.00 });
                  this.ordgenerator.patchValue({ tralngstplss: 0.00 });
                  this.ordgenerator.patchValue({ stplss: 0.00 });
                }

                break;
              case "SL-M":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_mkt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = true;
                  // this.ordgenerator.patchValue({ quantity: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_dPriceVal = true;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_mkt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  // this.ordgenerator.patchValue({ quantity: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                } else {
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_nrml = true;
                  this.is_mkt = true;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  // this.ordgenerator.patchValue({ quantity: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }

                break;
            }
            break;
          case "nrml":
            switch (orderTypeSelect) {
              case "L":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  this.is_mkt = true;
                  this.is_slMkt = true;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  this.is_mkt = true;
                  this.is_slMkt = true;
                } else {
                  this.ordgenerator.patchValue({ position: "mis" });
                  this.is_nrml = true;
                  this.is_mkt = true;
                  this.is_slMkt = true;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "MKT":
                if (this.page == "orderModify") {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_mkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = null;
                  this.is_target = null;
                  this.is_tralngstplss = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_mkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = null;
                  this.is_target = null;
                  this.is_tralngstplss = null;
                } else {
                  this.ordgenerator.patchValue({ position: "mis" });
                  this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_nrml = true;
                  this.is_mkt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_dPriceVal = true;
                  this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = null;
                  this.is_target = null;
                  this.is_tralngstplss = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }

                break;
              case "SL":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  this.is_slMkt = true;
                  this.is_mkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = null;
                  this.is_target = null;
                  this.is_tralngstplss = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  this.is_slMkt = true;
                  this.is_mkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = null;
                  this.is_target = null;
                  this.is_tralngstplss = null;
                } else {
                  this.ordgenerator.patchValue({ position: "mis" });
                  this.is_slMkt = true;
                  this.is_mkt = true;
                  this.is_nrml = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = null;
                  this.is_target = null;
                  this.is_tralngstplss = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }

                break;
              case "SL-M":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_mkt = true;
                  this.is_slMkt = true;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_mkt = true;
                  this.is_slMkt = true;
                } else {
                  this.ordgenerator.patchValue({ position: "mis" });
                  this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_nrml = true;
                  this.is_mkt = true;
                  this.is_slMkt = true;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
            }
            break;
          case "cnc":
            switch (orderTypeSelect) {
              case "L":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                } else {
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.is_nrml = null;
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "MKT":
                if (this.page == "orderModify") {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                } else {
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "SL":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mkt = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mkt = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                } else {
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mkt = null;
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }

                break;
              case "SL-M":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                } else {
                  this.is_nrml = null;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
            }
            break; //mis
        }
        break;
      case "co":
        this._validity_ioc = true;
        this._validity_day = true;
        this.bo_msg = false;
        this.is_mktType = true;
        switch (position) {
          case "mis":
            switch (orderTypeSelect) {
              case "L":
                if (this.page == "orderModify") {
                  if (this.chkStatus == 'open') {
                    this.is_mis = true;
                    this.is_nrml = true;
                    this._rlgr = true;
                    this._bo = true;
                    this._co = true;
                    this._amo = true;
                    this.is_qtyVal = true;
                    this.is_priceVal = null;
                    this.is_trigPriceVal = true;
                    this.is_dPriceVal = true;
                    // this.ordgenerator.patchValue({ disqty: "" });
                    this.is_stplss = true;
                    // this.ordgenerator.patchValue({ stplss: "" });
                    this.is_target = true;
                    // this.ordgenerator.patchValue({ target: "" });
                    this.is_tralngstplss = true;
                    // this.ordgenerator.patchValue({ tralngstplss: "" });
                    // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                    // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                    this.is_lmt = null;
                    this.is_mkt = null;
                    this.is_nrml = true;
                    this.is_slLmt = true;
                    this.is_slMkt = true;
                    // this.ordgenerator.patchValue({ position: "mis" });
                  }
                  // else if (this.chkStatus == "trigger pending") {
                  //   this.is_mis = true;
                  //   this.is_nrml = true;
                  //   this._rlgr = true;
                  //   this._bo = true;
                  //   this._co = true;
                  //   this._amo = true;
                  //   this.is_qtyVal = true;
                  //   this.is_priceVal = true;
                  //   this.is_trigPriceVal = null;
                  //   this.is_dPriceVal = true;
                  //   // this.ordgenerator.patchValue({ disqty: "" });
                  //   this.is_stplss = true;
                  //   // this.ordgenerator.patchValue({ stplss: "" });
                  //   this.is_target = true;
                  //   // this.ordgenerator.patchValue({ target: "" });
                  //   this.is_tralngstplss = true;
                  //   // this.ordgenerator.patchValue({ tralngstplss: "" });
                  //   // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  //   // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  //   this.is_lmt = null;
                  //   this.is_mkt = null;
                  //   this.is_nrml = true;
                  //   this.is_slLmt = true;
                  //   this.is_slMkt = true;
                  //   // this.ordgenerator.patchValue({ position: "mis" });
                  // }
                  else {
                    this.is_mis = true;
                    this.is_nrml = true;
                    this._rlgr = true;
                    this._bo = true;
                    this._co = true;
                    this._amo = true;
                    this.is_qtyVal = true;
                    this.is_priceVal = true;
                    this.is_trigPriceVal = null;
                    this.is_dPriceVal = true;
                    // this.ordgenerator.patchValue({ disqty: "" });
                    this.is_stplss = true;
                    // this.ordgenerator.patchValue({ stplss: "" });
                    this.is_target = true;
                    // this.ordgenerator.patchValue({ target: "" });
                    this.is_tralngstplss = true;
                    // this.ordgenerator.patchValue({ tralngstplss: "" });
                    // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                    // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                    this.is_lmt = null;
                    this.is_mkt = null;
                    this.is_nrml = true;
                    this.is_slLmt = true;
                    this.is_slMkt = true;
                    // this.ordgenerator.patchValue({ position: "mis" });
                  }
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_lmt = null;
                  this.is_mkt = null;
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                } else {
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_lmt = null;
                  this.is_mkt = null;
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.ordgenerator.patchValue({ position: "mis" });
                  this._validity_ioc = true;
                  this.is_mis = true;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "MKT":
                if (this.page == "orderModify") {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                } else if (this.page == 'orderGenModify') {
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                } else {
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_mis = null;
                  this.is_discloseQty = true;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "SL":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_nrml = true;
                  this.is_mkt = null;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_nrml = true;
                  this.is_mkt = null;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                } else {
                  this.ordgenerator.patchValue({ position: "mis" });
                  this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_nrml = true;
                  this.is_mkt = null;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "SL-M":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_lmt = true;
                  this.is_mkt = true;
                  this.is_slMkt = true;
                  this.is_discloseQty = true;
                  this.is_slLmt = true;
                  this.is_nrml = true;
                  this.is_qtyVal = true;
                  this.is_priceVal = true;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_slMkt = true;
                  this.is_slLmt = true;
                  this.is_nrml = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                } else {
                  this.is_slMkt = true;
                  this.is_slLmt = true;
                  this.is_nrml = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
            }
            break;
          case "nrml":
            switch (orderTypeSelect) {
              case "L":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                } else {
                  this.ordgenerator.patchValue({ position: "mis" });
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "MKT":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                } else {
                  this.ordgenerator.patchValue({ position: "mis" });
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "SL":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_slLmt = true;
                  this.is_lmt = null;
                  this.is_mkt = null;
                  this.is_slMkt = true;
                  this.is_nrml = true;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_slLmt = true;
                  this.is_lmt = null;
                  this.is_mkt = null;
                  this.is_slMkt = true;
                  this.is_nrml = true;
                } else {
                  this.ordgenerator.patchValue({ position: "mis" });
                  this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_slLmt = true;
                  this.is_lmt = null;
                  this.is_mkt = null;
                  this.is_slMkt = true;
                  this.is_nrml = true;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "SL-M":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_lmt = null;
                  this.is_mkt = null;
                  this.is_slMkt = true;
                  this.is_nrml = true;
                  this.is_slLmt = true;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_lmt = null;
                  this.is_mkt = null;
                  this.is_slMkt = true;
                  this.is_nrml = true;
                  this.is_slLmt = true;
                } else {
                  this.ordgenerator.patchValue({ position: "mis" });
                  this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_lmt = null;
                  this.is_mkt = null;
                  this.is_slMkt = true;
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
            }
            break;
          case "cnc":
            switch (orderTypeSelect) {
              case "L":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ position: "mis" });
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ position: "mis" });
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                } else {
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.ordgenerator.patchValue({ position: "mis" });
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "MKT":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  // this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                } else {
                  this.ordgenerator.patchValue({ position: "mis" });
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_qtyVal = null;
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_trigPriceVal = null;
                  this.is_dPriceVal = true;
                  this.ordgenerator.patchValue({ disqty: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "SL":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_slLmt = true;
                  this.is_lmt = null;
                  this.is_mkt = null;
                  this.is_slMkt = true;
                  this.is_nrml = true;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_slLmt = true;
                  this.is_lmt = null;
                  this.is_mkt = null;
                  this.is_slMkt = true;
                  this.is_nrml = true;
                } else {
                  this.ordgenerator.patchValue({ position: "mis" });
                  this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_slLmt = true;
                  this.is_lmt = null;
                  this.is_mkt = null;
                  this.is_slMkt = true;
                  this.is_nrml = true;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "SL-M":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_lmt = null;
                  this.is_mkt = null;
                  this.is_slMkt = true;
                  this.is_nrml = true;
                  this.is_slLmt = true;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ position: "mis" });
                  // this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_lmt = null;
                  this.is_mkt = null;
                  this.is_slMkt = true;
                  this.is_nrml = true;
                  this.is_slLmt = true;
                } else {
                  this.ordgenerator.patchValue({ position: "mis" });
                  this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                  this.is_lmt = null;
                  this.is_mkt = null;
                  this.is_slMkt = true;
                  this.is_nrml = true;
                  this.is_slLmt = true;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
            }
            break; //mis
        }
        break;
      case "amo":
        this._validity_ioc = null;
        this._validity_day = null;
        this.bo_msg = false;
        this.is_mktType = null;
        switch (position) {
          case "mis":
            switch (orderTypeSelect) {
              case "L":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_nrml = null;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_nrml = null;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                } else {
                  this.is_mis = null;
                  this.is_nrml = null;
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                  this._validity_ioc = null;
                  this.is_discloseQty = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                }
                break;
              case "MKT":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_trigPriceVal = null;
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_nrml = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_trigPriceVal = null;
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_nrml = null;
                } else {
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "SL":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mkt = null;
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this._bo = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mkt = null;
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this._bo = null;
                } else {
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mkt = null;
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this._validity_ioc = null;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = null;
                }
                break;
              case "SL-M":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_nrml = null;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_nrml = null;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                } else {
                  this.is_nrml = null;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this._rlgr = null;
                  this._bo = true;
                  this._co = true;
                  this._amo = null;
                }
                break;
            }

            break;
          case "nrml":
            switch (orderTypeSelect) {
              case "L":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_mkt = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_mkt = null;
                } else {
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_mkt = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "MKT":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                } else {
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this._rlgr = null;
                  this._bo = true;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "SL":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                  this.is_nrml = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                  this.is_nrml = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                } else {
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                  this.is_nrml = null;
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this._rlgr = null;
                  this._bo = true;
                  this._co = true;
                  this._amo = null;
                }
                break;
              case "SL-M":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                } else {
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                }
                break;
            }

            break;
          case "cnc":
            switch (orderTypeSelect) {
              case "L":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                } else {
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.is_nrml = null;
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mkt = null;
                  this._rlgr = null;
                  this._bo = null;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "MKT":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_trigPriceVal = true;
                  // this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_slLmt = true;
                  this.is_slMkt = true;
                } else {
                  this.is_trigPriceVal = true;
                  this.ordgenerator.patchValue({ trigPriceVal: "" });
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = null;
                  this._amo = null;
                }
                break;
              case "SL":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mkt = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  // this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mkt = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                } else {
                  this.is_qtyVal = null;
                  this.is_trigPriceVal = null;
                  this.is_priceVal = null;
                  this.is_dPriceVal = null;
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.ordgenerator.patchValue({ priceVal: this.priceValue });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mkt = null;
                  this.is_nrml = null;
                  this.is_slLmt = null;
                  this.is_slMkt = null;
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = true;
                  this._amo = null;
                }
                break;
              case "SL-M":
                if (this.page == "orderModify") {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                } else if (this.page == 'orderGenModify') {
                  this.is_mis = true;
                  this.is_nrml = true;
                  this._rlgr = true;
                  this._bo = true;
                  this._co = true;
                  this._amo = true;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  // this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  // this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  // this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  // this.ordgenerator.patchValue({ priceVal: "" });
                  // this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                } else {
                  this.is_nrml = null;
                  this.is_mkt = null;
                  this.is_slMkt = null;
                  this.is_qtyVal = null;
                  this.is_dPriceVal = null;
                  this.is_trigPriceVal = null;
                  this.is_stplss = true;
                  this.ordgenerator.patchValue({ stplss: "" });
                  this.is_target = true;
                  this.ordgenerator.patchValue({ target: "" });
                  this.is_tralngstplss = true;
                  this.ordgenerator.patchValue({ tralngstplss: "" });
                  this.is_priceVal = true;
                  this.ordgenerator.patchValue({ priceVal: "" });
                  this.ordgenerator.patchValue({ trigPriceVal: this.priceValue });
                  this.is_mis = null;
                  this._rlgr = null;
                  this._bo = true;
                  this._co = true;
                  this._amo = null;
                }
                break;
            }

            break; //mis
        }
        break;
    }

    //.log(this.is_stplss, 'Stoploss');
  }

  /**
   * func to set data to navbar nifty and sensex Value
   */
  NavFeed(scrpResp) {
    //console.log(mwname)
    this.profileName = this.odrServ.getUserId();
    this.nifindexChange = scrpResp['indexvalues'][1]['indexChange'];
    this.nifindexVal = scrpResp['indexvalues'][1]['indexVal'];
    this.nifPer = scrpResp['indexvalues'][1]['indexPerChange'];
    this.nifname = scrpResp['indexvalues'][1]['indexName'];
    this.senxindexChange = scrpResp['indexvalues'][0]['indexChange'];
    this.senxindexVal = scrpResp['indexvalues'][0]['indexVal'];
    this.senxPer = scrpResp['indexvalues'][0]['indexPerChange'];
    this.senxname = scrpResp['indexvalues'][0]['indexName'];
  }

  /**
   * this is fuc receives data from market Wtach feed from line 291- 299 & same with depth feed
   * @param val 
   * @param ctype 
   * @param mtype 
   */
  receiveIndexVal(val, ctype, mtype) {
    //console.log(val+ " - "+ctype+" - "+mtype);
    switch (ctype) {
      case "iv":
        if (mtype == "Nifty 50") {
          this.nifindexVal = val;
        } else if (mtype == "SENSEX") {
          this.senxindexVal = val;
        }
        break;
      case "cng":
        if (mtype == "Nifty 50") {
          this.nifindexChange = val;
        } else if (mtype == "SENSEX") {
          this.senxindexChange = val;
        }
        break;
      case "nc":
        if (mtype == "Nifty 50") {
          this.nifPer = val;
        } else if (mtype == "SENSEX") {
          this.senxPer = val;
        }
        break;
    }
  }

  logout() {
    this.odrServ.zebuLogout().subscribe(res => {
      //.log("Logout successfully", res)
      if (res["stat"] == "Ok") {
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
  * func invoked from marketwatch buy/sell button on hover
  * @param bstype 
  */
  addAndExitHoldingMWList(bsTyp, scrip, page) {
  //  console.log(scrip);
    this.getHoldingPricerange(scrip);
    this.page = page;
    this.symName = scrip['Nsetsym'];
    if (scrip["ExchSeg1"] == 'NSE') {
      this.exch = scrip["ExchSeg1"];
    } else {
      this.exch = scrip["ExchSeg2"];
    }

    this.priceValue = scrip["Ltp"];
    if (scrip["ExchSeg1"] == 'NSE') {
      this.symtoken = scrip["Token1"];
    } else {
      this.symtoken = scrip["Token2"];
    }

    this.ordgenerator.patchValue({ priceVal: scrip["Ltp"] });
    if (scrip["ExchSeg1"] == 'NSE') {
      this.editInstrmnt = scrip['Nsetsym'];
      this.editInstrmntname = scrip['Nsetsym'];
    } else if (scrip["ExchSeg2"] == 'BSE') {
      this.editInstrmnt = scrip['Bsetsym'];
      this.editInstrmntname = scrip['Bsetsym'];
    }
    if (scrip['Exch2'] == 'bse_cm' || scrip['Exch1'] == "nse_cm") {
      this.cncvalid = true;
    } else {
      this.cncvalid = false;
    }
    if (scrip['Pcode'] == 'CNC' || scrip['Pcode'] == 'MIS' || scrip['Pcode'] == 'NRML') {
      this.ordgenerator.patchValue({ position: scrip['Pcode'].toLowerCase() });
    } else {
      this.ordgenerator.patchValue({ position: "mis" });
    }
    this.ordgenerator.patchValue({ bstype: bsTyp });
    this.ordgenerator.patchValue({ complexty: "regular" });
    this.ordgenerator.patchValue({ orderTypeSelect: "L" });
    if (scrip["ExchSeg1"] == 'NSE') {
      this.ordgenerator.patchValue({ quantity: scrip['Holdqty'] });
    } else {
      this.ordgenerator.patchValue({ quantity: scrip['SellableQty'] });
    }
    this.formtypselect();
    this.save = bsTyp;
    document.getElementById("openModalButton").click();
  }

  //Method to get price range
  getHoldingPricerange(param) {
   // console.log("param", param);
    let jsonObj = {
      "exch": param['ExchSeg1'] == 'NSE' ? param['ExchSeg1'] : param['ExchSeg2'],
      "symbol": param['ExchSeg1'] == 'NSE' ? param['Token1'] : param['Token2'],
      "userId": this.odrServ.getUserId(),
      "userSessionID": this.odrServ.getSessionToken(),
    }
 //   console.log(jsonObj)
    this.odrServ.getPriceRange(jsonObj).subscribe(data => {
      if (data['stat'] == "Ok") {
        this.lowPrice = (Number(data['lowercircuitlimit'].replace(',', ''))).toFixed(2);
        this.highPrice = (Number(data['highercircuitlimit'].replace(',', ''))).toFixed(2);
      }
    },
      (err) => {
      //  console.log("err", err.error)
        if (err.error == "Unauthorized") {
          this.hideHeaderDetails();
          this.routeTo.navigateByUrl('login');
        }

      });

  }

  checkTick(inputtyp) {
    var priceVal: any = this.ordgenerator.value['priceVal'];
    //.log(priceVal)
    var trigPriceVal = this.ordgenerator.value['trigPriceVal'];
    var qtyy = this.ordgenerator.value['quantity'];
    var trget = this.ordgenerator.value['target'];
    var stloss = this.ordgenerator.value['stplss'];
    var trlingstplss = this.ordgenerator.value['tralngstplss'];
    var discQty = Number(this.ordgenerator.value['discQty']);
    switch (inputtyp) {
      case "price":
        var price = this.floatSafeRemainder(parseFloat(priceVal.toString()), this.tikPrc);
        if (price != 0) {
          this.chkPrc = true;
        } else {
          this.chkPrc = false;
        }
        break;
      case "qty":
        var price = this.floatSafeRemainder(parseFloat(qtyy), this.tikLot);
        if (price != 0) {
          this.chkqty = true;
        } else {
          this.chkqty = false;
        }
        break;
      case "tprice":
        var price = this.floatSafeRemainder(parseFloat(trigPriceVal), this.tikPrc);
        if (price != 0) {
          this.chkTPrc = true;
        } else {
          this.chkTPrc = false;
        }
        break;
      case "target":
        var price = this.floatSafeRemainder(parseFloat(trget), this.tikPrc);
        if (price != 0) {
          this.chktrgt = true;
        } else {
          this.chktrgt = false;
        }
        break;
      case "stoploss":
        var price = this.floatSafeRemainder(parseFloat(stloss), this.tikPrc);
        if (price != 0) {
          this.chkstp = true;
        } else {
          this.chktrgt = false;
        }
        break;
      case "discQty":
        if (this.exch['Exchange'] == 'MCX') {
          this.discTen = Math.ceil(discQty * (25 / 100));
        } else {
          this.discTen = Math.ceil(discQty * (10 / 100));
        }

        if (discQty == 0 || (discQty >= this.discTen && discQty <= qtyy)) {
          this.chkDisc = false;
        } else {
          this.chkDisc = true;
          return false;
        }
        break;
    }
  }

  floatSafeRemainder(val, step) {
    var valDecCount = (val.toString().split('.')[1] || '').length;
    var stepDecCount = (step.toString().split('.')[1] || '').length;
    var decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    var valInt = parseInt(val.toFixed(decCount).replace('.', ''));
    var stepInt = parseInt(step.toFixed(decCount).replace('.', ''));
    return (valInt % stepInt) / Math.pow(10, decCount);
  }

  openDialog() {
 //   console.log("i am here");
  }

  hideHeaderDetails() {
    this.nifname = "";
  }

  //Method to get price range
  getPricerange(param) {
//    console.log("param", param);
    let jsonObj = {
      "exch": param['Exchange'],
      "symbol": param['token'],
      "userId": this.odrServ.getUserId(),
      "userSessionID": this.odrServ.getSessionToken(),
    }
//    console.log(jsonObj)
    this.odrServ.getPriceRange(jsonObj).subscribe(data => {
      if (data['stat'] == "Ok") {
        this.lowPrice = (Number(data['lowercircuitlimit'].replace(',', ''))).toFixed(2);
        this.highPrice = (Number(data['highercircuitlimit'].replace(',', ''))).toFixed(2);
      }
    },
      (err) => {
        console.log("err", err.error)
        if (err.error == "Unauthorized") {
          this.hideHeaderDetails();
          // this.odrServ.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        }

      });

  }

  //Method to get price range
  getPositionPricerange(param) {
  //  console.log("param", param);
    let jsonObj = {
      "exch": param['Exchange'],
      "symbol": param['Token'],
      "userId": this.odrServ.getUserId(),
      "userSessionID": this.odrServ.getSessionToken(),
    }
    //.log(jsonObj)
    this.odrServ.getPriceRange(jsonObj).subscribe(data => {
      if (data['stat'] == "Ok") {
        this.lowPrice = (Number(data['lowercircuitlimit'].replace(',', ''))).toFixed(2);
        this.highPrice = (Number(data['highercircuitlimit'].replace(',', ''))).toFixed(2);
      }
    },
      (err) => {
        console.log("err", err.error)
        if (err.error == "Unauthorized") {
          this.hideHeaderDetails();
          // this.odrServ.spinnerService.stop();
          this.routeTo.navigateByUrl('login');
        }

      });

  }

  toggleOpen(from) {
   // console.log(from);
    if (from == "ExchMessageOpen") {
      if (this.profileOpen == true) {
        document.getElementById('toggleProfile').click();
        //.log(document.getElementById('toggleProfile').dataset.target);
        setTimeout(() => {
          document.getElementById('toggleExch').dataset.target = "#main,#exchMsg,#profile";

          document.getElementById('toggleExch').click();
         // console.log(document.getElementById('toggleExch').dataset.target);
        }, 1000)
      }
      this.exchMsgOpen = true;
    }
    if (from == "profileOpen") {
      this.profileOpen = true;
      var settingsElement = document.getElementById("setting").classList;
      var profileElement = document.getElementById("profile").classList;
    }
    if (from == "settingsOpen") {
      this.settingsOpen = true;
      var settingsElement = document.getElementById("setting").classList;
      var profileElement = document.getElementById("profile").classList;
    }
  }

  toggleManualHideAndShow(page) {
    this._isTogglePage = page;
  }

  toggleClose(from) {
  //  console.log(from);
    if (from == "ExchMessagClose") {
      this.exchMsgOpen = false;
    } else if (from == "profileClose") {
      this.profileOpen = false;
    } else if (from == "settingsClose") {
      this.settingsOpen = false;
    }
  }

  showMarketStatus() {
    const dialogRef = this.dialog.open(MarketstatusComponent, {
      width: '400px',
      height: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
     // console.log('The dialog was closed');
    });
  }


  /**
   * @method methed to get Index details and popup dialog box
   * @params --
   * @return --
   * @author Selva 
   * @on 18/07/2019
   */
  openTickDataName(idxname, position) {
    //.log(idxname)
    var indexNames: any = [];
    var jsonData = {
      "userId": this.odrServ.getUserId(),
      "exch": "NSE"
    }
    this.odrServ.getIndexDetails(jsonData).subscribe(res => {
      if (res['stat'] == "Ok") {
        for (let idx in res['IndexDetail']) {
          if (!res['IndexDetail'][idx]['IndexName'].startsWith('\"', 0)) {
            if (res['IndexDetail'][idx]['IndexName'] != idxname) {
              indexNames.push(res['IndexDetail'][idx]);
            }
          }
        }
      }
    }, (err) => {
      console.log(err.error)
    });
    var jsonData = {
      "userId": this.odrServ.getUserId(),
      "exch": "BSE"
    }
    this.odrServ.getIndexDetails(jsonData).subscribe(res => {
     // console.log(res)
      if (res['stat'] == "Ok") {
        let all = res['IndexDetail']; let temp = [];
        for (let i in all) {
          if (!all[i]['IndexName'].startsWith('\"', 0)) {
            temp.push(all[i]);
          }
        }
        console.log(temp)
        for (let idex of temp) {
          indexNames.push(idex);
        }
      }
    }, (err) => {
      console.log(err.error)
    });

    const dialogRef = this.dialog.open(IndexlistComponent, {
      width: '350px',
      height: '450px',
      data: { "idxList": indexNames }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (position > 0) {
        this.senxname = result['IndexName'];
        this.senxindexVal = result['IndexValue'];
        this.senxindexChange = (Number(result['IndexChange']) / 100).toFixed(2);
      } else {
        this.nifname = result['IndexName'];
        this.nifindexVal = result['IndexValue'];
        this.nifindexChange = (Number(result['IndexChange']) / 100).toFixed(2);
      }
    });
  }

  toggleSideBarMenu() {
    this.menuToggle = !this.menuToggle;
  }

  callConnectionSocket() {
    var jsonSendObj = {
      "channel": "",
      "task": "cn",
      "acctid": this.odrServ.getUserId(),
      "user": this.odrServ.getUserId(),
      "token": this.odrServ.getSessionToken()
    };
    // console.log(jsonSendObj)
    this.odrServ.mWatch.next(jsonSendObj);
    
    // setInterval(()=>{
    //   var jsonSendhbObj = {
    //     "channel": "",
    //     "task": "hb",
    //     "acctid": this.odrServ.getUserId(),
    //     "user": this.odrServ.getUserId(),
    //     "token": this.odrServ.getSessionToken()
    //   };
    //   // console.log(jsonSendhbObj)
    //   this.odrServ.mWatch.next(jsonSendhbObj);
    // },10000) 
    
    this.odrServ.mWatch.subscribe(msg => {
      if (JSON.parse(msg)[0]['ak'] != undefined && JSON.parse(msg)[0]['ak'] == "ok" && JSON.parse(msg)[0]['task'] == "cn") {
        console.log("cn Connected");
        this._isConnect = true;
        this.sendSubscribeMessage();
      } else {
        console.log(msg);
      }
    });
  }


  sendSubscribeMessage() {
    if(localStorage.getItem("_feed_symbol_store") != null || localStorage.getItem("_feed_symbol_store") != undefined){
      var feeddata : any = JSON.parse(localStorage.getItem("_feed_symbol_store"));
      this._isMWCall = this._isMWCall +"&"+feeddata['symbol'];
     }
    //  console.log(this._isMWCall)
    //  console.log(this._is)
    setTimeout(() => {
      if (this._isMWCall != undefined || this._isMWCall != null) {
        var jsonSendObj = {
          "channel": this._isMWCall,
          "task": this.mktWatch,
          "acctid": this.odrServ.getUserId(),
          "user": this.odrServ.getUserId(),
          "token": this.odrServ.getSessionToken()
        };
        // console.log(jsonSendObj)
        this.odrServ.mWatch.next(jsonSendObj);
        var jsonSendDepthObj = {
          "channel": this._isMWCall,
          "task": this.depthWatch,
          "acctid": this.odrServ.getUserId(),
          "user": this.odrServ.getUserId(),
          "token": this.odrServ.getSessionToken()
        };
        // console.log(jsonSendDepthObj)
        this.odrServ.mWatch.next(jsonSendDepthObj);
        var jsonSendObject = {
          "channel": this._isMWCall,
          "task": this.orderWatch,
          "acctid": this.odrServ.getUserId(),
          "user": this.odrServ.getUserId(),
          "token": this.odrServ.getSessionToken()
        };
        this.odrServ.mWatch.next(jsonSendObject);
      }
      if (this._isSensexCall == undefined || this._isSensexCall == null || this._isNiftyCall == undefined || this._isNiftyCall == null) {
        var jsonSendObjj = {
          "channel": "nse_cm|Nifty 50&bse_cm|SENSEX",
          "task": this.sfiwtch,
          "acctid": this.odrServ.getUserId(),
          "user": this.odrServ.getUserId(),
          "token": this.odrServ.getSessionToken()
        };
        this.odrServ.mWatch.next(jsonSendObjj);
      }
      if (this._isSensexCall != undefined || this._isSensexCall != null) {
        var jsonSendObjsen = {
          "channel": this._isSensexCall == "SENSEX" ? "bse_cm|" + this._isSensexCall : "nse_cm|" + this._isSensexCall,
          "task": this.sfiwtch,
          "acctid": this.odrServ.getUserId(),
          "user": this.odrServ.getUserId(),
          "token": this.odrServ.getSessionToken()
        };
        this.odrServ.mWatch.next(jsonSendObjsen);
      }
      if (this._isNiftyCall != undefined || this._isNiftyCall != null) {
        var jsonSendObjjnifty = {
          "channel": this._isNiftyCall == "SENSEX" ? "bse_cm|" + this._isNiftyCall : "nse_cm|" + this._isNiftyCall,
          "task": this.sfiwtch,
          "acctid": this.odrServ.getUserId(),
          "user": this.odrServ.getUserId(),
          "token": this.odrServ.getSessionToken()
        };
        this.odrServ.mWatch.next(jsonSendObjjnifty);
      }
      if (this._isPositionCall != undefined || this._isPositionCall != null) {
        var jsonSendPosObj = {
          "channel": this._isPositionCall,
          "task": this.mktWatch,
          "acctid": this.odrServ.getUserId(),
          "user": this.odrServ.getUserId(),
          "token": this.odrServ.getSessionToken()
        };
        this.odrServ.mWatch.next(jsonSendPosObj);
      }
      if (this._isOrderCall != undefined || this._isOrderCall != null) {
        var jsonSendOrderObject = {
          "channel": this._isOrderCall,
          "task": this.orderWatch,
          "acctid": this.odrServ.getUserId(),
          "user": this.odrServ.getUserId(),
          "token": this.odrServ.getSessionToken()
        };
        this.odrServ.mWatch.next(jsonSendOrderObject);
      }
      if (this._isHoldingCall != undefined || this._isHoldingCall != null) {
        var jsonSendObjhold = {
          "channel": this._isHoldingCall,
          "task": this.mktWatch,
          "acctid": this.odrServ.getUserId(),
          "user": this.odrServ.getUserId(),
          "token": this.odrServ.getSessionToken()
        }
        this.odrServ.mWatch.next(jsonSendObjhold);
      }
    }, 800);
  }
}