import { Component, OnInit } from '@angular/core';
import { ZebuodrGentrService } from 'src/app/services/zebuodr-gentr.service';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss']
})
export class PublisherComponent implements OnInit {

  constructor(public service:ZebuodrGentrService) { }

  ngOnInit() {
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mainDiv").style.marginLeft = "250px";
  }

  buySingleShare(){
    var jsonData = [{
      "symbol_id":3045,
      "trading_symbol":"SBIN-EQ",
      "exch":"NSE",
      "ltp":151.40,
      "transtype":"buy",
      "complexty": "regular",
      "prctyp":"L",
      "pCode":"mis  ",
      "price":151.40,
      "trigPrice":"--",
      "ret":"day",
      "qty":1,
      "stopLoss":"--",
      "target":"--",
      "trailing_stop_loss":"--",
  }];
    this.service.odrInsert(jsonData).subscribe((res:any)=>{
      window.open(res, 'Win 1', 'width=780, height=500, top=80, left=200, resizable=1, status=no, menubar=no, toolbar=no, scrollbars=yes', true);
    },(err)=>{
      console.log()
    })
  }

  sellSingleShare(){
    var jsonData = [{
      "symbol_id":3045,
      "trading_symbol":"SBIN-EQ",
      "exch":"NSE",
      "ltp":152.40,
      "transtype":"sell",
      "complexty": "regular",
      "prctyp":"L",
      "pCode":"mis  ",
      "price":152.40,
      "trigPrice":"--",
      "ret":"day",
      "qty":1,
      "stopLoss":"--",
      "target":"--",
      "trailing_stop_loss":"--",
  }];
    this.service.odrInsert(jsonData).subscribe((res:any)=>{
      window.open(res, 'Win 1', 'width=780, height=500, top=80, left=200, resizable=1, status=no, menubar=no, toolbar=no, scrollbars=yes', true);
    },(err)=>{
      console.log()
    })
  }

  multipleShare(){
    var jsonData = [{
      "symbol_id":438,
      "trading_symbol":"BHEL-EQ",
      "exch":"NSE",
      "ltp":24.55,
      "transtype":"buy",
      "complexty": "regular",
      "prctyp":"SL",
      "pCode":"mis",
      "price":24.45,
      "trigPrice":"--",
      "ret":"day",
      "qty":1,
      "stopLoss":"--",
      "target":"--",
      "trailing_stop_loss":"--",
  },
  {
    "symbol_id":438,
    "trading_symbol":"BHEL-EQ",
    "exch":"NSE",
    "ltp":25.55,
    "transtype":"sell",
    "complexty": "regular",
    "prctyp":"SL",
    "pCode":"mis",
    "price":25.65,
    "trigPrice":"--",
    "ret":"day",
    "qty":1,
    "stopLoss":"--",
    "target":"--",
    "trailing_stop_loss":"--",
} ];
    this.service.odrInsert(jsonData).subscribe((res:any)=>{
      window.open(res, 'Win 1', 'width=780, height=500, top=80, left=200, resizable=1, status=no, menubar=no, toolbar=no, scrollbars=yes', true);
    },(err)=>{
      console.log()
    })
  }

    /* To copy Text from Textbox */
    copyInputMessage(inputElement){
      console.log(inputElement)
      // inputElement.select();
      // document.execCommand('copy');
      // inputElement.setSelectionRange(0, 0);
    }
}
