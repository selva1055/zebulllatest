import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataTableDirective } from 'angular-datatables';

export interface DialogData {
  data: any;
}


@Component({
  selector: 'app-orderhistorydialog',
  templateUrl: './orderhistorydialog.component.html',
  styleUrls: ['./orderhistorydialog.component.scss']
})
export class OrderhistorydialogComponent implements OnInit {
  infoColumns: string[] = ['ExchTimeStamp', 'Status', 'Qty', 'filledShares', 'averageprice', 'Prc', 'exchangetimestamp', 'filldateandtime'];
  infoData: any;
  type: any = 'info';
  info: any;
  public modeselect = 'Domain';
  constructor(public dialogRef: MatDialogRef<OrderhistorydialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {


  }

  ngOnInit() {
    this.infoData = this.data;
    console.log(this.infoData[0])
  }

  goToBack(): void {
    this.dialogRef.close();
  }

  orderhistryType(type) {
    this.type = type;

  }

  closeModelBox(): void {
    this.dialogRef.close();
  }
}
