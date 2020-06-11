import { Component, OnInit, } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ZebuodrGentrService } from 'src/app/services/zebuodr-gentr.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-zebuodr-gentr',
  templateUrl: './zebuodr-gentr.component.html',
  styleUrls: ['./zebuodr-gentr.component.scss']
})
export class ZebuodrGentrComponent implements OnInit {

  public ordgenerator: FormGroup;
  public err: any;
  basketLists: any = [];
  showList: boolean;
  searchList: any;
  symData: boolean = false;
  symbol_id: any;
  symHead: any;
  symPrc: any;
  symexch: any;
  symdate: any;
  strikePrc: any;
  grpName: any;
  is_mis: boolean;
  is_rlgr: boolean;
  is_nrml: boolean;
  is_cnc: boolean;
  is_trigPriceVal: boolean;
  is_stplss: boolean;
  is_target: boolean;
  is_tralngstplss: boolean;
  is_priceVal: boolean;
  is_mkt: boolean;
  is_slMkt: boolean;
  is_slLmt: boolean;
  is_qtyVal: any;
  is_dPriceVal: any;
  is_lmt: boolean;
  is_bo: boolean;
  is_co: boolean;
  is_amo: boolean;
  cncvalid: boolean;
  slctdINST: any;
  bo_msg: boolean;
  minTick: number;
  submit: boolean = true;
  slctId: any;
  is_mktType: boolean;
  bgColorBStype: any;
  currentFormControlName: string;
  tikPrc: any;
  tikLot: any;
  chkPrc: boolean = false;
  showOpt: boolean = false;
  dqtyhqty: boolean;
  thPrc: boolean;
  tlPrc: boolean;
  stplPrc: boolean;
  trghPrc: boolean;
  thPrczro: boolean;
  trgstplss: boolean;
  trgetZero: boolean;
  stplzero: boolean;
  qtyzro: boolean;
  prczro: boolean;
  orderLink: any;
  copy: string = "Copy";
  searchbox: string;
  chkTPrc: boolean;
  chktrgt: boolean;
  chkstp: boolean;
  chktstp: boolean;
  chkqty: boolean;
  slLess: boolean;
  slHigh: boolean;
  trHigh: boolean;
  trLess: boolean;
  copied: boolean = false;
  orderType: string;
  perChange: any;
  price: any;
  trail20: boolean;
  bodLotQty: any;
  public searchExch = ["All", "NFO", "NSE", "CDS", "MCX", "BSE", "BCD", "BFO"];

  panelOpenState: boolean = true;
  bascutOrderCount: number;
  constructor(public formbuilder: FormBuilder, public routeTo: Router, public odgenserv: ZebuodrGentrService, private spinnerService: NgxUiLoaderService) {

  }
  ngAfterViewInit() {
    // this.sendMessage()
    // this.spinnerService.start();
    document.getElementById("searchFocus").focus();
    setTimeout(() => {
      if (window.innerWidth > 340) {
        this.panelOpenState = false;
      }
    }, 500);

  }

  ngOnInit() {
    this.formReset("");
    // this.sendMessage();
  }

  formReset(rst) {
    this.ordgenerator = this.formbuilder.group({
      bstype: ['buy', Validators.required],
      complexty: ['regular', Validators.required],
      position: ['mis', Validators.required],
      orderTypeSelect: ['L', Validators.required],
      quantity: ['1', Validators.required],
      priceVal: ['0', Validators.required],
      disqty: ['0', Validators.required],
      trigPriceVal: ['0', Validators.required],
      stplss: ['0', Validators.required],
      target: ['0', Validators.required],
      tralngstplss: ['0', Validators.required],
      mktType: ['day', Validators.required]
    });
    this.formtypselect();
    if (rst == 'rst') {
      this.symData = false;
      this.showOpt = false;
      this.searchbox = "";
      this.ngAfterViewInit();

    }
  }
  buysellType(bstype) {
    if (bstype == "buy") {
      this.currentFormControlName = "bstype";
      this.bgColorBStype = bstype;
    } else {
      this.bgColorBStype = bstype;
    }
    // this.showOpt = true;
    this.ordgenerator.value["bstype"] = bstype;
    this.formtypselect();
  }

  /**
   * ONchange Function for to disable particular fields value
   * 
   */
  formtypselect() {
    // console.log(this.ordgenerator.value);
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
    // var bstype = this.bgColorBStype 
    switch (bstype) {
      case 'buy':
        this.bgColorBStype = this.ordgenerator.value['bstype'];
        this.compxity();
        break;
      case 'sell':
        this.bgColorBStype = this.ordgenerator.value['bstype'];
        this.compxity();
    }
  }
  compxity() {
    var complexty = this.ordgenerator.value['complexty'];
    var position = this.ordgenerator.value['position'];
    var orderTypeSelect = this.ordgenerator.value['orderTypeSelect'];

    switch (complexty) {
      case "regular":
        this.bo_msg = false;
        this.is_mktType = null;
        switch (position) {
          case "mis":
            switch (orderTypeSelect) {
              case "L":
                this.is_nrml = null;
                this.is_trigPriceVal = true;
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
                this.ordgenerator.patchValue({ trigPriceVal: "" });
                this.is_stplss = true;
                this.ordgenerator.patchValue({ stplss: 0.00 });
                this.is_target = true;
                this.ordgenerator.patchValue({ target: 0.00 });
                this.is_tralngstplss = true;
                this.ordgenerator.patchValue({ tralngstplss: 0.00 });
                this.is_priceVal = null;
                this.is_dPriceVal = null;
                this.is_slLmt = null;
                this.is_slMkt = null;
                this.is_mkt = null;
                this.is_bo = null;
                this.is_co = null;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = null;
                break;
              case "MKT":
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
                this.is_bo = true;
                this.is_co = null;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = null;
                break;
              case "SL":
                this.is_qtyVal = null;
                this.is_trigPriceVal = null;
                this.is_priceVal = null;
                this.is_dPriceVal = null;
                this.is_stplss = true;
                this.ordgenerator.patchValue({ stplss: 0.00 });
                this.is_target = true;
                this.ordgenerator.patchValue({ target: 0.00 });
                this.is_tralngstplss = true;
                this.ordgenerator.patchValue({ tralngstplss: 0.00 });
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_mkt = null;
                this.is_nrml = null;
                this.is_slLmt = null;
                this.is_slMkt = null;
                this.is_bo = null;
                this.is_co = true;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = null;
                break;
              case "SL-M":
                this.is_nrml = null;
                this.is_mkt = null;
                this.is_slMkt = null;
                this.is_qtyVal = null;
                this.is_dPriceVal = null;
                this.is_trigPriceVal = null;
                this.is_stplss = true;
                this.is_bo = true;
                this.is_co = true;
                this.ordgenerator.patchValue({ stplss: "" });
                this.is_target = true;
                this.ordgenerator.patchValue({ target: "" });
                this.is_tralngstplss = true;
                this.ordgenerator.patchValue({ tralngstplss: "" });
                this.is_priceVal = true;
                this.ordgenerator.patchValue({ priceVal: "" });
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = null;
                break;
            }
            break; //mis
          case "nrml":
            switch (orderTypeSelect) {
              case "L":
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
                this.is_bo = null;
                this.is_co = null;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = null;
                break;
              case "MKT":
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
                this.is_bo = true;
                this.is_co = null;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = null;
                break;
              case "SL":
                this.is_bo = null;
                this.is_co = true;
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
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = null;
                break;
              case "SL-M":
                this.is_bo = true;
                this.is_co = true;
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
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = null;
                break;
            }
            break; //nrml
          case "cnc":
            switch (orderTypeSelect) {
              case "L":
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
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
                this.is_rlgr = null;
                this.is_bo = null;
                this.is_co = null;
                this.is_amo = null;
                this.is_cnc = null;
                break;
              case "MKT":
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
                this.is_rlgr = null;
                this.is_bo = true;
                this.is_co = null;
                this.is_amo = null;
                this.is_cnc = null;
                break;
              case "SL":
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
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_mkt = null;
                this.is_nrml = null;
                this.is_slLmt = null;
                this.is_slMkt = null;
                this.is_mis = null;
                this.is_rlgr = null;
                this.is_bo = null;
                this.is_co = true;
                this.is_amo = null;
                this.is_cnc = null;
                break;
              case "SL-M":
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
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_mis = null;
                this.is_rlgr = null;
                this.is_bo = true;
                this.is_co = true;
                this.is_amo = null;
                this.is_cnc = null;
                break;
            }
            break; //mis
        }
        break; // regular
      case "bo":
        this.bo_msg = true;
        this.is_mktType = true;
        switch (position) {
          case "mis":
            switch (orderTypeSelect) {
              case "L":
                this.is_bo = null;
                this.is_co = null;
                this.is_qtyVal = null;
                this.is_priceVal = null;
                this.is_dPriceVal = true;
                this.ordgenerator.patchValue({ disqty: "" });
                this.is_trigPriceVal = true;
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
                this.ordgenerator.patchValue({ trigPriceVal: "" });
                this.is_stplss = null;
                this.is_target = null;
                this.is_tralngstplss = null;
                this.is_slMkt = true;
                this.is_mkt = true;
                this.is_slLmt = null;
                this.is_nrml = true;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
              case "MKT":
                this.is_bo = null;
                this.is_co = null;
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
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
              case "SL":
                this.is_bo = null;
                this.is_co = true;
                this.is_nrml = true;
                this.is_mkt = true;
                this.is_slMkt = true;
                this.is_qtyVal = null;
                this.is_priceVal = null;
                this.is_dPriceVal = true;
                this.ordgenerator.patchValue({ disqty: "" });
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_trigPriceVal = null;
                this.is_stplss = null;
                this.is_target = null;
                this.is_tralngstplss = null;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
              case "SL-M":
                this.is_bo = null;
                this.is_co = null;
                this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                this.is_nrml = true;
                this.is_mkt = true;
                this.is_slMkt = true;
                this.is_qtyVal = null;
                this.ordgenerator.patchValue({ quantity: "" });
                this.is_priceVal = true;
                this.ordgenerator.patchValue({ priceVal: "" });
                this.is_dPriceVal = null;
                this.is_trigPriceVal = null;
                this.is_stplss = true;
                this.ordgenerator.patchValue({ stplss: "" });
                this.is_target = true;
                this.ordgenerator.patchValue({ target: "" });
                this.is_tralngstplss = true;
                this.ordgenerator.patchValue({ tralngstplss: "" });
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
            }
            break;
          case "nrml":
            switch (orderTypeSelect) {
              case "L":
                this.ordgenerator.patchValue({ position: "mis" });
                this.is_nrml = true;
                this.is_mkt = true;
                this.is_slMkt = true;
                this.is_bo = null;
                this.is_co = null;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
              case "MKT":
                this.is_bo = null;
                this.is_co = null;
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
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
              case "SL":
                this.ordgenerator.patchValue({ position: "mis" });
                this.is_slMkt = true;
                this.is_mkt = true;
                this.is_nrml = true;
                this.is_bo = null;
                this.is_co = null;
                this.is_qtyVal = null;
                this.is_priceVal = null;
                this.is_trigPriceVal = null;
                this.is_dPriceVal = true;
                this.ordgenerator.patchValue({ disqty: "" });
                this.is_stplss = null;
                this.is_target = null;
                this.is_tralngstplss = null;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
              case "SL-M":
                this.ordgenerator.patchValue({ position: "mis" });
                this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                this.is_nrml = true;
                this.is_mkt = true;
                this.is_slMkt = true;
                this.is_bo = null;
                this.is_co = null;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
            }
            break;
          case "cnc":
            switch (orderTypeSelect) {
              case "L":
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
                this.is_nrml = null;
                this.is_trigPriceVal = true;
                this.ordgenerator.patchValue({ trigPriceVal: "" });
                this.is_stplss = true;
                this.ordgenerator.patchValue({ stplss: "" });
                this.is_target = true;
                this.ordgenerator.patchValue({ target: "" });
                this.is_tralngstplss = true;
                this.ordgenerator.patchValue({ tralngstplss: "" });
                this.is_qtyVal = true;
                this.is_priceVal = null;
                this.is_dPriceVal = null;
                this.is_slLmt = null;
                this.is_slMkt = null;
                this.is_mkt = null;
                this.is_mis = null;
                this.is_rlgr = null;
                this.is_bo = null;
                this.is_co = null;
                this.is_amo = null;
                this.is_cnc = true;
                break;
              case "MKT":
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
                this.is_rlgr = null;
                this.is_bo = true;
                this.is_co = null;
                this.is_amo = null;
                this.is_cnc = true;
                break;
              case "SL":
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
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_mkt = null;
                this.is_nrml = null;
                this.is_slLmt = null;
                this.is_slMkt = null;
                this.is_mis = null;
                this.is_rlgr = null;
                this.is_bo = null;
                this.is_co = true;
                this.is_amo = null;
                this.is_cnc = true;
                break;
              case "SL-M":
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
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_mis = null;
                this.is_rlgr = null;
                this.is_bo = true;
                this.is_co = null;
                this.is_amo = null;
                this.is_cnc = true;
                break;
            }
            break; //mis
        }
        break;
      case "co":
        this.bo_msg = false;
        this.is_mktType = true;
        switch (position) {
          case "mis":
            switch (orderTypeSelect) {
              case "L":
                this.is_bo = null;
                this.is_co = null;
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
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_lmt = null;
                this.is_mkt = null;
                this.is_nrml = true;
                this.is_slLmt = true;
                this.is_slMkt = true;
                this.ordgenerator.patchValue({ position: "mis" });
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
              case "MKT":
                this.is_bo = true;
                this.is_co = null;
                this.is_nrml = true;
                this.is_slLmt = true;
                this.is_slMkt = true;
                this.is_qtyVal = null;
                this.is_priceVal = true;
                this.ordgenerator.patchValue({ priceVal: "" });
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_trigPriceVal = null;
                this.is_dPriceVal = true;
                this.ordgenerator.patchValue({ disqty: "" });
                this.is_stplss = true;
                this.ordgenerator.patchValue({ stplss: "" });
                this.is_target = true;
                this.ordgenerator.patchValue({ target: "" });
                this.is_tralngstplss = true;
                this.ordgenerator.patchValue({ tralngstplss: "" });
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
              case "SL":
                this.is_bo = null;
                this.is_co = null;
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
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
              case "SL-M":
                this.is_bo = null;
                this.is_co = null;
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
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
            }
            break;
          case "nrml":
            switch (orderTypeSelect) {
              case "L":
                this.is_bo = null;
                this.is_co = null;
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
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
              case "MKT":
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
                this.is_bo = null;
                this.is_co = null;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
              case "SL":
                this.ordgenerator.patchValue({ position: "mis" });
                this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                this.is_slLmt = true;
                this.is_lmt = null;
                this.is_mkt = null;
                this.is_slMkt = true;
                this.is_nrml = true;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
              case "SL-M":
                this.is_bo = null;
                this.is_co = null;
                this.ordgenerator.patchValue({ position: "mis" });
                this.ordgenerator.patchValue({ orderTypeSelect: "L" });
                this.is_lmt = null;
                this.is_mkt = null;
                this.is_slMkt = true;
                this.is_nrml = true;
                this.is_slLmt = true;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = true;
                break;
            }
            break;
          case "cnc":
            switch (orderTypeSelect) {
              case "L":
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
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
                this.is_rlgr = null;
                this.is_bo = null;
                this.is_co = null;
                this.is_amo = null;
                this.is_cnc = true;
                break;
              case "MKT":
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
                this.is_rlgr = null;
                this.is_bo = null;
                this.is_co = null;
                this.is_amo = null;
                this.is_cnc = true;
                break;
              case "SL":
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
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_mkt = null;
                this.is_nrml = null;
                this.is_slLmt = null;
                this.is_slMkt = null;
                this.is_mis = null;
                this.is_rlgr = null;
                this.is_bo = null;
                this.is_co = null;
                this.is_amo = null;
                this.is_cnc = null;
                this.is_cnc = true;
                break;
              case "SL-M":
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
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_mis = null;
                this.is_rlgr = null;
                this.is_bo = null;
                this.is_co = null;
                this.is_amo = null;
                this.is_cnc = true;
                break;
            }
            break; //mis
        }
        break;
      case "amo":
        this.bo_msg = false;
        this.is_mktType = null;
        switch (position) {
          case "mis":
            switch (orderTypeSelect) {
              case "L":
                this.is_bo = true;
                this.is_co = null;
                this.is_nrml = null;
                this.is_trigPriceVal = true;
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
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
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = null;
                break;
              case "MKT":
                this.is_bo = true;
                this.is_co = null;
                this.is_trigPriceVal = true;
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
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
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = null;
                break;
              case "SL":
                this.is_bo = null;
                this.is_co = null;
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
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_mkt = null;
                this.is_nrml = null;
                this.is_slLmt = null;
                this.is_slMkt = null;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = null;
                break;
              case "SL-M":
                this.is_bo = true;
                this.is_co = true;
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
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = null;
                break;
            }
            break;
          case "nrml":
            switch (orderTypeSelect) {
              case "L":
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
                this.is_bo = null;
                this.is_co = null;
                this.is_rlgr = null;
                this.is_amo = null;
                this.is_cnc = null;
                break;
              case "MKT":
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
                this.is_bo = null;
                this.is_co = null;
                this.is_rlgr = null;
                this.is_amo = null;
                this.is_cnc = null;
                break;
              case "SL":
                this.is_bo = null;
                this.is_co = null;
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
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = null;
                break;
              case "SL-M":
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
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_bo = null;
                this.is_co = null;
                this.is_amo = null;
                this.is_rlgr = null;
                this.is_cnc = null;
                break;
            }
            break;
          case "cnc":
            switch (orderTypeSelect) {
              case "L":
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
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
                this.is_rlgr = null;
                this.is_bo = null;
                this.is_co = null;
                this.is_amo = null;
                this.is_cnc = null;
                break;
              case "MKT":
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
                this.is_rlgr = null;
                this.is_bo = true;
                this.is_co = null;
                this.is_amo = null;
                this.is_cnc = null;
                break;
              case "SL":
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
                this.ordgenerator.patchValue({ priceVal: this.symPrc });
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_mkt = null;
                this.is_nrml = null;
                this.is_slLmt = null;
                this.is_slMkt = null;
                this.is_mis = null;
                this.is_rlgr = null;
                this.is_bo = null;
                this.is_co = true;
                this.is_amo = null;
                this.is_cnc = null;
                break;
              case "SL-M":
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
                this.ordgenerator.patchValue({ trigPriceVal: this.symPrc });
                this.is_mis = null;
                this.is_rlgr = null;
                this.is_bo = true;
                this.is_co = true;
                this.is_amo = null;
                this.is_cnc = null;
                break;
            }
            break; //mis
        }
        break;
    }
  }

  getsearchItems(e) {
    if ((e.target.value).length > 1) {
      if (e.target.value) {
        let searchJSON = { "symbol": ((e.target.value).trim()).toLocaleUpperCase(), "exchange": this.searchExch };
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
    this.spinnerService.start();
    var token = {
      "exch": slctData['exch'],
      "symbol": slctData['token']
    }
    this.odgenserv.sendScriptToken(token).subscribe(resp => {
      this.showList = false;
      this.showOpt = true;
      this.symexch = slctData['exch'];
      this.slctId = slctData['id'];
      this.slctdINST = slctData['instrument_name'];
      this.symHead = slctData['symbol'];
      this.bodLotQty = resp['bodLotQty'];
      this.symbol_id = resp['symbol'];
      this.symPrc = resp['ltp'];
      this.perChange = resp['perChange'] == null ? '0' : resp['perChange'];
      this.price = resp['openPrice'] == null ? '0.00' : resp['openPrice'];
      this.ordgenerator.patchValue({ priceVal: this.symPrc });
      this.ordgenerator.patchValue({ trigPriceVal: "" });
      this.tikPrc = resp['calculatedTickSize'];
      this.tikLot = slctData['lot_size'];
      if (slctData['expiry_date'] != null) {
        this.symdate = new Date(Date.parse(slctData['expiry_date'])).toDateString().substring(3).trim();
      } else {
        this.symdate = slctData['expiry_date'];
      }
      if (resp['exch'] == 'NSE' || resp['exch'] == 'BSE') {
        this.cncvalid = true;
      } else {
        this.cncvalid = false;
      }
      this.strikePrc = slctData['strike_price'];
      this.grpName = slctData['group_name'];
      this.symData = true;
      this.submit = false;
      this.spinnerService.stop();
    }, (err) => {
      console.log(err.error);
      err.error;
      this.spinnerService.stop();
    })
  }

  /**
   * submit function 
   */
  OrderPlacer() {

    // var tranType = this.ordgenerator.value['bstype']; //buy/sell
    // var pcode = this.ordgenerator.value['position']; // mis/nrml
    // var complexty = this.ordgenerator.value['complexty']; // regular/bo/co/amo
    // var prctyp = this.ordgenerator.value['orderTypeSelect']; // l/mkt/sl/sl-m
    // var priceVal = this.ordgenerator.value['priceVal'];
    // var trigPriceVal = this.ordgenerator.value['trigPriceVal'];
    // var stloss = this.ordgenerator.value['stplss'];
    // var trget = this.ordgenerator.value['target'];
    // var trlingstplss = this.ordgenerator.value['tralngstplss'];
    // var qtyy = this.ordgenerator.value['quantity'];
    // var priceVl = this.ordgenerator.value['priceVal'];

    // if (tranType == "buy") {
    //   if (complexty == 'regular' && prctyp == 'sl-limit' && (pcode == 'mis' || pcode == 'nrml')) {
    //     // if (trigPriceVal > priceVal) {
    //     //   this.thPrc = true;
    //     //   return false;
    //     // } else {
    //     //   this.thPrc = false;
    //     // }

    //     if(trigPriceVal >= priceVal){
    //       this.thPrc = false;
    //       this.tlPrc = false;
    //     }else{
    //       this.thPrc = false;
    //       this.tlPrc = true;
    //     }

    //   } else if (complexty == 'bo' && prctyp == 'sl-limit' && pcode == 'mis') {

    //     if (trigPriceVal > priceVal) {
    //       this.thPrc = false;
    //       // this.tlPrc = true;
    //       this.thPrc = true;
    //       return false;
    //     }

    //   } else if (complexty == 'co' && pcode == 'mis' && (prctyp == 'market' || prctyp == 'limit')) {
    //     if (trigPriceVal > priceVal) {
    //       this.thPrc = false;
    //       this.tlPrc = true;
    //       return false;
    //     }

    //   }

    // } else {
    //   if (complexty == 'regular' && prctyp == 'sl-limit' && (pcode == 'mis' || pcode == 'nrml')) {

    //     if (trigPriceVal < priceVal) {
    //       this.tlPrc = true;
    //       this.thPrc = false;
    //       return false;
    //     } else {
    //       this.tlPrc = false;
    //       this.thPrc = false;
    //     }

    //   } else if (complexty == 'bo' && prctyp == 'sl-limit' && pcode == 'mis') {

    //     if (trigPriceVal < priceVal) {
    //       this.thPrc = false;
    //       this.tlPrc = true;
    //       return false;
    //     }

    //   } else if (complexty == 'co' && pcode == 'mis' && (prctyp == 'market' || prctyp == 'limit')) {
    //     if (trigPriceVal < priceVal) {
    //       this.thPrc = false;
    //       this.tlPrc = true;
    //       return false;
    //     }

    //   }

    // }
    var placedOrdr = {
      // "uid": "TN1SB7",
      // "actid": "TN1SB7",
      "symbol_id": this.symbol_id,
      "instrument": this.slctdINST,
      "trading_symbol": this.symexch == "NSE" || this.symexch == "BSE" ? this.symHead : this.slctdINST,
      "exch": this.symexch,
      "ltp": this.symPrc,
      "transtype": this.ordgenerator.value['bstype'],
      "complexty": this.ordgenerator.value['complexty'],
      "prctyp": this.ordgenerator.value['orderTypeSelect'],
      "pCode": this.ordgenerator.value['position'],
      "price": this.ordgenerator.value['priceVal'] == "" ? '--' : this.ordgenerator.value['priceVal'],
      "trigPrice": this.ordgenerator.value['trigPriceVal'] == "" ? '--' : this.ordgenerator.value['trigPriceVal'],
      "ret": this.ordgenerator.value['mktType'],
      "qty": this.ordgenerator.value['quantity'] == "" ? '--' : this.ordgenerator.value['quantity'],
      "discqty": this.ordgenerator.value['disqty'] == "" ? '--' : this.ordgenerator.value['disqty'],
      "stopLoss": this.ordgenerator.value['stplss'] == "" ? '--' : this.ordgenerator.value['stplss'].toFixed(2),
      "target": this.ordgenerator.value['target'] == "" ? '--' : this.ordgenerator.value['target'].toFixed(2),
      "trailing_stop_loss": this.ordgenerator.value['tralngstplss'] == "" ? '--' : this.ordgenerator.value['tralngstplss'],
      "bodLotQty": this.bodLotQty
    }
    console.log("placedOrdr", placedOrdr)
    this.basketLists.push(placedOrdr);
    if (this.bascutOrderCount < this.basketLists.length) {
      this.copied = false;
    }
  }

  generateURL() {
    this.odgenserv.odrInsert(this.basketLists).subscribe(data => {
      this.bascutOrderCount = this.basketLists.length;
      this.orderLink = data;
      this.copied = true;
    })
  }

  orderRst() {
    this.basketLists = [];
  }

  checkTick(inputtyp) {
    var tranType = this.ordgenerator.value['bstype']; //buy/sell
    var pcode = this.ordgenerator.value['position']; // mis/nrml
    var complexty = this.ordgenerator.value['complexty']; // regular/bo/co/amo
    var prctyp = this.ordgenerator.value['orderTypeSelect']; // l/mkt/sl/sl-m
    var priceVal = this.ordgenerator.value['priceVal'];
    var trigPriceVal = this.ordgenerator.value['trigPriceVal'];
    var qtyy = this.ordgenerator.value['quantity'];
    var trget = this.ordgenerator.value['target'];
    var stloss = this.ordgenerator.value['stplss'];
    var trlingstplss = this.ordgenerator.value['tralngstplss'];

    switch (inputtyp) {
      case "price":
        var price = this.floatSafeRemainder(parseFloat(priceVal), this.tikPrc);
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
      case "tstoploss":
        var price = this.floatSafeRemainder(parseFloat(trlingstplss), this.tikPrc);
        if (price != 0) {
          this.chktstp = true;
        } else {
          this.chktrgt = false;
        }
        break;
    }


    console.log("QtyTick", this.tikLot);
    // console.log("tickCal", this.ordgenerator.value['priceVal'] % this.tikPrc);
    // console.log("tickCal", (this.ordgenerator.value['priceVal']) % (this.tikPrc));
    // if(this.ordgenerator.value['priceVal'] % this.tikPrc != 0){
    //   this.chkPrc = true;
    // }else{
    //   this.chkPrc = false;
    // }
  }

  floatSafeRemainder(val, step) {
    var valDecCount = (val.toString().split('.')[1] || '').length;
    var stepDecCount = (step.toString().split('.')[1] || '').length;
    var decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    var valInt = parseInt(val.toFixed(decCount).replace('.', ''));
    var stepInt = parseInt(step.toFixed(decCount).replace('.', ''));
    return (valInt % stepInt) / Math.pow(10, decCount);
  }

  checkIfZero(e) {
    var tranType = this.ordgenerator.value['bstype']; //buy/sell
    var pcode = this.ordgenerator.value['position']; // mis/nrml
    var complexty = this.ordgenerator.value['complexty']; // regular/bo/co/amo
    var prctyp = this.ordgenerator.value['orderTypeSelect']; // l/mkt/sl/sl-m
    var priceVal = Number(this.ordgenerator.value['priceVal']);
    var trigPriceVal = Number(this.ordgenerator.value['trigPriceVal']);
    var stloss = Number(this.ordgenerator.value['stplss']);
    var trget = Number(this.ordgenerator.value['target']);
    var trlingstplss = Number(this.ordgenerator.value['tralngstplss']);
    var qtyy = Number(this.ordgenerator.value['quantity']);
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
      if (tranType == "buy") {
        if (complexty == 'regular' && prctyp == 'SL' && (pcode == 'mis' || pcode == 'nrml')) {
          if (trigPriceVal <= priceVal) {
            this.thPrc = false;
            this.tlPrc = false;
            this.OrderPlacer();
            this.formReset('rst');
          } else {
            this.thPrc = true;
            this.tlPrc = false;
            e.preventDefault();
          }
        } else if (complexty == 'bo' && prctyp == 'L' && pcode == 'mis') {
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
          if ((trlingstplss / this.tikPrc < 20) && trlingstplss != 0) {
            this.trail20 = true;
            this.minTick = this.tikPrc * 20;
            e.preventDefault();
          } else {
            this.OrderPlacer();
            this.trail20 = false;
            this.formReset('rst');
          }
          // // } else {
          // //   this.trail20 = false;
          // //   e.preventDefault();
          // }
        } else if (complexty == 'bo' && prctyp == 'SL' && pcode == 'mis') {
          if (trigPriceVal <= priceVal) {
            this.thPrc = false;
            this.tlPrc = false;
            if ((trlingstplss / this.tikPrc < 20) && trlingstplss != 0) {
              this.trail20 = true;
              this.minTick = this.tikPrc * 20;
              e.preventDefault();
            } else {
              this.OrderPlacer();
              this.trail20 = false;
              this.formReset('rst');
            }
          } else {
            this.trail20 = false;
            this.thPrc = true;
            this.tlPrc = false;
            e.preventDefault();
          }
        } else if (complexty == 'co' && pcode == 'mis' && (prctyp == 'market' || prctyp == 'limit')) {
          if (trigPriceVal <= priceVal) {
            this.thPrc = false;
            this.tlPrc = false;
            this.OrderPlacer();
            this.formReset('rst');
          } else {
            this.thPrc = true;
            this.tlPrc = false;
            e.preventDefault();
          }
        }
        else if (complexty == 'amo' && prctyp == 'SL' && (pcode == 'mis' || pcode == 'nrml')) {
          if (trigPriceVal <= priceVal) {
            this.thPrc = false;
            this.tlPrc = false;
            this.OrderPlacer();
            this.formReset('rst');
          } else {
            this.thPrc = true;
            this.tlPrc = false;
            e.preventDefault();
          }
        } else {
          this.OrderPlacer();
          this.formReset('rst');
        }
      } else {
        if (complexty == 'regular' && prctyp == 'SL' && (pcode == 'mis' || pcode == 'nrml')) {
          if (trigPriceVal >= priceVal) {
            this.thPrc = false;
            this.tlPrc = false;
            this.OrderPlacer();
            this.formReset('rst');
          } else {
            this.thPrc = false;
            this.tlPrc = true;
            e.preventDefault();
          }
        } else if (complexty == 'bo' && prctyp == 'limit' && pcode == 'mis') {
          let per = false;
          let per2 = false;
          if (stloss > priceVal && stloss != 0) {
            this.slHigh = false;
            this.slLess = false;
            per = true;
          } else {
            per = false;
            this.slLess = false;
            this.slHigh = true;
          }

          if (trget < priceVal) {
            this.trHigh = false;
            this.trLess = false;
            per2 = true;
          } else {
            per2 = false;
            this.trLess = true;
            this.trHigh = false;
          }

          if (per && per2) {
            this.OrderPlacer();
            this.formReset('rst');
          } else {
            e.preventDefault();
          }

        } else if (complexty == 'bo' && prctyp == 'SL' && pcode == 'mis') {
          if (trigPriceVal >= priceVal) {
            this.thPrc = false;
            this.tlPrc = false;
            this.OrderPlacer();
            this.formReset('rst');
          } else {
            this.thPrc = false;
            this.tlPrc = true;
            e.preventDefault();
          }

        } else if (complexty == 'co' && pcode == 'mis' && (prctyp == 'market' || prctyp == 'limit')) {
          if (trigPriceVal >= priceVal) {
            this.thPrc = false;
            this.tlPrc = false;
            this.OrderPlacer();
            this.formReset('rst');
          } else {
            this.thPrc = false;
            this.tlPrc = true;
            e.preventDefault();
          }
        } else if (complexty == 'amo' && prctyp == 'SL' && (pcode == 'mis' || pcode == 'nrml')) {
          if (trigPriceVal >= priceVal) {
            this.thPrc = false;
            this.tlPrc = false;
            this.OrderPlacer();
            this.formReset('rst');
          } else {
            this.thPrc = false;
            this.tlPrc = true;
            e.preventDefault();
          }
        } else {
          this.OrderPlacer();
          this.formReset('rst');
        }
      }
    }
  }

  copyLink(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.copy = "Copied";
  }

  deleteSelected(idx) {
    this.basketLists.splice(idx, 1);
  }

  openWhatsappShare(orderLink) {
    var info: any = [];
    for (let idxBesket of this.basketLists) {
      var Ttype: string = "";
      var target: number = 0;
      var stoploss: number = 0;
      if (idxBesket['transtype'] == 'buy') {
        target = +idxBesket['price'] + +idxBesket['target'];
        stoploss = +idxBesket['price'] - +idxBesket['stopLoss'];
        Ttype = 'BUY';
      } else {
        target = +idxBesket['price'] - +idxBesket['target'];
        stoploss = +idxBesket['price'] + +idxBesket['stopLoss'];
        Ttype = 'SELL';
      }
      if (idxBesket['complexty'] == 'bo') {
        var complex: string = 'BO';
        info.push(complex + ' - ' + Ttype + ' ' + idxBesket['trading_symbol'] + ' ' + idxBesket['qty'] + ' @ ' + idxBesket['price'] + ' Target: Rs.' + target.toFixed(2) + ' Stoploss: Rs.' + stoploss.toFixed(2));
      }
      if (idxBesket['complexty'] == 'co') {
        var complexCo: string = 'CO';
        var trgPrice: number = +idxBesket['trigPrice'];
        info.push(complexCo + ' - ' + Ttype + ' ' + idxBesket['trading_symbol'] + ' ' + idxBesket['qty'] + ' @ ' + idxBesket['price'] + ' Stoploss: Rs.' + trgPrice.toFixed(2));
      }
      if (idxBesket['complexty'] == 'regular') {
        info.push(Ttype + ' ' + idxBesket['trading_symbol'] + ' ' + idxBesket['qty'] + ' @ ' + idxBesket['price']);
      }
    }
    var url: any;
    if (window.innerWidth > 720) {
      url = "https://wa.me/?text=" + info.toString().replace(/,/g, " ") + ' Place your order with single click through - ' + encodeURIComponent(orderLink);
    } else {
      url = "whatsapp://send?text=" + info.toString().replace(/,/g, " ") + ' Place your order with single click through - ' + encodeURIComponent(orderLink);
    }
    window.open(url, "_blank");
  }

  openTelegramShare(orderLink) {
    var info: any = [];
    for (let idxBesket of this.basketLists) {
      var Ttype: string = "";
      var target: number = 0;
      var stoploss: number = 0;

      if (idxBesket['transtype'] == 'buy') {
        target = +idxBesket['price'] + +idxBesket['target'];
        stoploss = +idxBesket['price'] - +idxBesket['stopLoss'];
        // target = +idxBesket['target'] - +idxBesket['price'];
        // stoploss = +idxBesket['stopLoss'] - +idxBesket['price'];
        // totalValue = 'BUY @ ' + idxBesket['price'] + ' Traget ' + target + " Stoploss " + stoploss;
        Ttype = 'BUY';
      } else {
        // target = +idxBesket['target'] - +idxBesket['price'];
        // stoploss = +idxBesket['stopLoss'] - +idxBesket['price'];
        target = +idxBesket['price'] - +idxBesket['target'];
        stoploss = +idxBesket['price'] + +idxBesket['stopLoss'];
        // totalValue = 'SELL @ ' + idxBesket['price'] + ' Traget ' + target + " Stoploss " + stoploss;
        Ttype = 'SELL';
      }
      if (idxBesket['complexty'] == 'bo') {
        var complex: string = 'BO';
        var profit: any = +idxBesket['target'] * +(+idxBesket['qty'] * +idxBesket['bodLotQty']);
        var risk: any = +idxBesket['stopLoss'] * +(+idxBesket['qty'] * +idxBesket['bodLotQty']);
        info.push(complex + ' - ' + Ttype + ' ' + idxBesket['trading_symbol'] + ' ' + idxBesket['qty'] + ' @ ' + idxBesket['price'] + ' Target: Rs.' + target.toFixed(2) + ' Stoploss: Rs.' + stoploss.toFixed(2));
      }
      if (idxBesket['complexty'] == 'co') {
        var complexCo: string = 'CO';
        var trgPrice: number = +idxBesket['trigPrice'];
        var risk: any = +idxBesket['price'] - +idxBesket['trigPrice'] * +(+idxBesket['qty'] * +idxBesket['bodLotQty']);
        info.push(complexCo + ' - ' + Ttype + ' ' + idxBesket['trading_symbol'] + ' ' + idxBesket['qty'] + ' @ ' + idxBesket['price'] + ' Stoploss: Rs.' + trgPrice.toFixed(2));
      }
      if (idxBesket['complexty'] == 'regular') {
        info.push(Ttype + ' ' + idxBesket['trading_symbol'] + ' ' + idxBesket['qty'] + ' @ ' + idxBesket['price']);
      }
    }
    var url = "https://telegram.me/share/url?url=" + encodeURIComponent(orderLink) + "&text= - Place your order with single click through " + info.toString().replace(/,/g, " ");
    window.open(url, "_blank")
  }

  goToHomePage() {
    if (localStorage.getItem("currentUser") != undefined || localStorage.getItem("currentUser") != null && localStorage.getItem("sessionToken2") != undefined || localStorage.getItem("sessionToken2") != null) {
      this.routeTo.navigateByUrl('home');
    } else {
      this.routeTo.navigateByUrl('login');
    }
  }
}

