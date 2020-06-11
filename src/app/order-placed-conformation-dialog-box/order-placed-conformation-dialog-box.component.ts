import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import {ViewEncapsulation} from '@angular/core'; // and any other imports
export interface DialogData {
  data: any;
}

@Component({
  selector: 'app-order-placed-conformation-dialog-box',
  templateUrl: './order-placed-conformation-dialog-box.component.html',
  styleUrls: ['./order-placed-conformation-dialog-box.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class OrderPlacedConformationDialogBoxComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<OrderPlacedConformationDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  onNoClick(){
    this.dialogRef.close('No');
  }
  onYesClick(){
    this.dialogRef.close('Yes');
  }
}
