import { AfterContentInit, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { faEllipsisH, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from '../../auth/services/auth.service';
import { DialogMode } from '../../models/dialogMode';
import { ImageSnippet } from '../../models/imageSnippet';
import { Relation } from '../../models/relation';
import { addCorrectTime } from '../../restConfig';
import { RelationService } from '../../services/relation/relation.service';
import { RelationOptionsComponent } from '../options/options.component';

interface DataRelation {
  relation: Relation;
  mode: DialogMode;
}

@Component({
  selector: 'app-relation',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class RelationDetailComponent implements OnInit, AfterContentInit, OnDestroy {

  modelRelation: DataRelation;

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

  isDeleting = false;

  constructor(private dialogRef: MatDialogRef<RelationDetailComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dataRelation: DataRelation,
    private router: Router,
    private authService: AuthService,
    private relationService: RelationService,
    private deviceService: DeviceDetectorService) {

    this.isDesktop = deviceService.isDesktop();
    this.modelRelation = dataRelation;
    this.isOwner = this.modelRelation.relation.user.id === this.authService.userID;
  }

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {
    this.showRelation = true;
    this.setSize();

    if (this.modelRelation.mode === DialogMode.WATCH) {
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
    this.selectedFile.pending = true;
    if (this.selectedFile.file == null) {
      this.selectedFile.pending = false;
      this.dialogRef.close();
      return;
    }
    this.relationService.add(this.selectedFile.file).subscribe(
      (res: any) => {
        res.created = addCorrectTime(res.created);
        this.selectedFile.pending = false;
        this.dialogRef.close(res);
      },
      (err) => {
        this.selectedFile.pending = false;
        const errorMessage = err.error.detail ? err.error.detail : 'Something went wrong. Try again.';
        this.dialogRef.close();
      });
  }

  handleOptionsClick() {
    clearInterval(this.interval);
    const optionsDialogRef = this.dialog.open(RelationOptionsComponent, {
      autoFocus: false
    });

    optionsDialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.isDeleting = true;
        this.relationService.delete(this.modelRelation.relation.id)
          .subscribe(res => {
            this.isDeleting = false;
            this.dialogRef.close('deleted');
          });
      } else {
        this.startTimer();
      }
    });
  }

  handleWatchProfile() {
    this.handleClose();
    this.router.navigate(['/profile/'.concat(String(this.modelRelation.relation.user.id))]);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSize();
  }

  setSize() {
    const options = document.getElementById('s-relation-header-options').clientHeight;
    const header = document.getElementById('s-relation-header').clientHeight;

    const width = window.innerWidth;
    const height = window.innerHeight - options - header;

    this.innerWidth = this.isDesktop ? width / 2.0 : width * 0.95;
    this.innerHeight = this.isDesktop ? height * 0.6 : height * 0.4;
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
