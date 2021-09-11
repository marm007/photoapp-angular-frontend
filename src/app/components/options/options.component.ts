import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OptionsComponent>) { }

  ngOnInit(): void {
  }

  handleDelete() {
    this.dialogRef.close('delete');
  }

  handleClose() {
    this.dialogRef.close();
  }

}
