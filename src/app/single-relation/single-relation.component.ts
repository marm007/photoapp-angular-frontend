import {AfterContentInit, Component, HostListener, Inject, OnInit} from '@angular/core';
import {faEllipsisH, faTimes} from '@fortawesome/free-solid-svg-icons';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DIALOG_MODE} from '../relations/relations.component';
import {ImageSnippet} from '../models/imageSnippet';

@Component({
  selector: 'app-single-relation',
  templateUrl: './single-relation.component.html',
  styleUrls: ['./single-relation.component.css']
})
export class SingleRelationComponent implements OnInit, AfterContentInit {
  isDesktop: boolean;

  innerWidth: any;
  innerHeight: any;

  closeIcon = faTimes;
  moreIcon = faEllipsisH;

  timeLeft = 100;
  interval;

  showRelation = false;

  selectedFile = new ImageSnippet(null, null);

  constructor(public dialogRef: MatDialogRef<SingleRelationComponent>,
              private deviceService: DeviceDetectorService,
              @Inject(MAT_DIALOG_DATA) public mode: DIALOG_MODE) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    console.log('CONSTRUCTOR');
    this.isDesktop = deviceService.isDesktop();
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    console.log(this.innerWidth);
    console.log(this.innerHeight);
    console.log('INIT');
  }

  ngAfterContentInit(): void {
    console.log('CONTENT');
    this.showRelation = true;
    if (this.mode === DIALOG_MODE.WATCH) {
      this.startTimer();
    }
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });

    reader.readAsDataURL(file);
  }

  handleClose() {
    this.dialogRef.close();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.handleClose();
      }
    }, 50);
  }
}
