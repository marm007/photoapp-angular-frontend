import {AfterContentInit, Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {faEllipsisH, faTimes} from '@fortawesome/free-solid-svg-icons';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DIALOG_MODE} from '../relations/relations.component';
import {ImageSnippet} from '../models/imageSnippet';
import {Relation} from '../models/relation';

interface DataRelation {
  relation: Relation;
  mode: DIALOG_MODE;
}

@Component({
  selector: 'app-single-relation',
  templateUrl: './single-relation.component.html',
  styleUrls: ['./single-relation.component.css']
})
export class SingleRelationComponent implements OnInit, AfterContentInit, OnDestroy {
  mode: DIALOG_MODE;
  relation: Relation;

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
              @Inject(MAT_DIALOG_DATA) public dataRelation: DataRelation) {
    console.log('CONSTRUCTOR');
    console.log(dataRelation);
    this.isDesktop = deviceService.isDesktop();
    this.mode = dataRelation.mode;
    this.relation = dataRelation.relation;
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
    clearInterval(this.interval);
  }

  handleAdd() {
    this.dialogRef.close(this.selectedFile.file);
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
        console.log(this.timeLeft)
      } else {
        this.handleClose();
      }
    }, 50);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
