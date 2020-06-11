import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-customersupport',
  templateUrl: './customersupport.component.html',
  styleUrls: ['./customersupport.component.scss']
})
export class CustomersupportComponent implements OnInit {
  public dialog: MatDialog
  constructor() {  
  }   

  ngOnInit() {
  } 
  closeModelBox() {
    // this.dialogRef.close();
  }
  
}
