import {AfterContentInit, Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {faEllipsisH, faTimes} from '@fortawesome/free-solid-svg-icons';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ImageSnippet} from '../models/imageSnippet';
import {Relation} from '../models/relation';
import {DIALOG_MODE} from '../models/DIALOG_MODE';
import {AuthService} from '../services/auth/auth.service';

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
  isOwner: boolean;

  isDesktop: boolean;

  innerWidth: any;
  innerHeight: any;

  closeIcon = faTimes;
  moreIcon = faEllipsisH;

  timeLeft = 100.0;
  interval;

  showRelation = false;

  selectedFile = new ImageSnippet(null, null);

  constructor(public dialogRef: MatDialogRef<SingleRelationComponent>,
              private deviceService: DeviceDetectorService,
              @Inject(MAT_DIALOG_DATA) public dataRelation: DataRelation,
              private authService: AuthService) {
    this.isDesktop = deviceService.isDesktop();
    this.mode = dataRelation.mode;
    this.relation = dataRelation.relation;
    this.isOwner = this.relation.user.id === this.authService.userId;
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  ngAfterContentInit(): void {
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
        this.timeLeft -= 5;
      } else {
        this.handleClose();
      }
    }, 150);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
