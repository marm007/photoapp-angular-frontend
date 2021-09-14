import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-relation-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class RelationOptionsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RelationOptionsComponent>) { }

  ngOnInit(): void {
  }

  handleDelete() {
    this.dialogRef.close('delete');
  }

  handleClose() {
    this.dialogRef.close();
  }

}
