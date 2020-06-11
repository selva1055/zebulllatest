import { Component, OnInit, Inject } from '@angular/core';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';

export interface DialogData {
  data: any;
}

@Component({
  selector: 'app-holding-exit',
  templateUrl: './holding-exit.component.html',
  styleUrls: ['./holding-exit.component.scss']
})
export class HoldingExitComponent implements OnInit {
  ExitPosition: any = [];
  qty: number;
  type: number;
  product: number;
  validity: number;
  price: number;
  symbol: any;
  confirmposition : boolean = true;
  tempArr: any;
  ExitArr: any = [];
  displayedColumns: string[] = ['Trantype', 'Tsym', 'Netqty', 'LTP', 'Pcode', 'Type'];

  constructor(public odgenserv: ZebuodrGentrService,
    public toastr: ToastrManager,
    private spinnerService: NgxUiLoaderService,
    public dialogRef: MatDialogRef<HoldingExitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public routeTo: Router
  ) { }

  ngOnInit() {
    this.ExitPosition = this.data['data'];
    for (let idx of this.ExitPosition) {
      let indexid: number = this.ExitPosition.indexOf(idx);
      if (idx['Type'] != undefined || idx['Type'] != null) {
        this.ExitPosition[indexid]['Type'] = this.ExitPosition[indexid]['Type'].replace("1", "");
      }
    }
  }

  /**
   * @method Method to Exit positions
   * @params na
   * @return na
   * @author kalai 
   * @on 04-11-2019
   */
  goToPositionExit(array) {
    this.spinnerService.start();
    this.odgenserv.squreAllPostion(array).subscribe(data => {
      this.spinnerService.stop();
      if (data['stat'] == "Not_Ok") {
        this.toastr.errorToastr(data['Emsg'], '', { showCloseButton: true });
      } else {
        this.toastr.successToastr("Square all tiggered", '', { showCloseButton: true });
        var res: boolean = false;
        if (Array.isArray(data)) {
          for (let index of data) {
            if (index['stat'] == 'Ok') {
              res = true;
            }
          }
        }
        this.confirmposition = true;
        this.dialogRef.close(res);
      }
    }, (err) => {
      this.spinnerService.stop();
    });
  }

  getPositions() {
    this.confirmposition = false;
    var array: any = [];
    var getusrOdrs = {
      "ret": 'NET',
      "userSettingDto": this.odgenserv.getUserSettingDto(),
      "userId": this.odgenserv.getUserId()
    };
    this.odgenserv.positionAndHolding(getusrOdrs).subscribe((data) => {
      // console.log(data)
      if (data.emsg == "Session Expired") {
        this.dialogRef.close(false);
      }
      if (Array.isArray(data)) {
        if (this.ExitPosition.length > 0) {
          for (let idx of data) {
            for (let index of this.ExitPosition) {
              if (idx['Token'] == index['Token'] && idx['Netqty'] != "0") {
                let jsonObj = {
                  "userId": this.odgenserv.getUserId(),
                  "pCode": index['Pcode'],
                  "exchSeg": index['Exchangeseg'],
                  "netQty": index['Netqty'],
                  "tockenNo": index['Token'],
                  "symbol": index['Tsym'],
                }
                array.push(jsonObj);
              }
            }
          }
          this.goToPositionExit(array);
        }
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.dialogRef.close(false);
      }
    });
  }

  closeConformOrder(){
    this.dialogRef.close(false);
  }

  goToDirectPositionExit() {
    var array : any = [];
    for (let index of this.ExitPosition) {
        let jsonObj = {
          "userId": this.odgenserv.getUserId(),
          "pCode": index['Pcode'],
          "exchSeg": index['Exchangeseg'],
          "netQty": index['Netqty'],
          "tockenNo": index['Token'],
          "symbol": index['Tsym'],
        }
        array.push(jsonObj);
      }
    this.spinnerService.start();
    this.odgenserv.squreAllPostion(array).subscribe(data => {
      this.spinnerService.stop();
      this.confirmposition = true;
      if (data['stat'] == "Not_Ok") {
        this.toastr.errorToastr(data['Emsg'], '', { showCloseButton: true });
      } else {
        this.toastr.successToastr("Square off triggered", '', { showCloseButton: true });
        var res: boolean = false;
        if (Array.isArray(data)) {
          for (let index of data) {
            if (index['stat'] == 'Ok') {
              res = true;
            }
          }
        }
        this.dialogRef.close(res);
      }
    }, (err) => {
      this.spinnerService.stop();
    });
  }
}
