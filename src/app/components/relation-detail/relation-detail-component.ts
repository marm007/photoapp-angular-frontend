import {AfterContentInit, Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {faEllipsisH, faTimes} from '@fortawesome/free-solid-svg-icons';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ImageSnippet} from '../../models/imageSnippet';
import {Relation} from '../../models/relation';
import {DialogMode} from '../../models/dialogMode';
import {AuthService} from '../../services/auth/auth.service';
import {OptionsComponent} from '../options/options.component';
import {RelationService} from '../../services/relation/relation.service';
import {Router} from '@angular/router';
import {Post} from '../../models/post';
import {environment} from '../../../environments/environment';
import {addCorrectTime, ImageType, prepareImage} from '../../restConfig';

interface DataRelation {
  relation: Relation;
  mode: DialogMode;
}

@Component({
  selector: 'app-single-relation',
  templateUrl: './relation-detail-component.html',
  styleUrls: ['./relation-detail-component.css']
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

  handleImageLoaded() {
    if (this.modelRelation.relation.imageLoaded) {
      return;
    }

    this.modelRelation.relation.image = this.modelRelation.relation.image.replace(ImageType.THUMBNAIL, '');
    this.modelRelation.relation.image = prepareImage(this.modelRelation.relation.image, ImageType.LARGE);
    this.modelRelation.relation.imageLoaded = true;
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
        res.user.meta.avatar = prepareImage(res.user.meta.avatar);
        res.image = prepareImage(res.image);
        res.created = addCorrectTime(res.created);
        this.selectedFile.pending = false;
        this.dialogRef.close(res);
      },
      (err) => {
        this.selectedFile.pending = false;
        const errorMessage = err.error.detail ? err.error.detail : 'Something went wrong. Try again.';
        console.log(errorMessage);
        this.dialogRef.close();
      });
  }

  handleOptionsClick() {
    clearInterval(this.interval);
    const optionsDialogRef = this.dialog.open(OptionsComponent, {
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
    this.innerHeight = this.isDesktop ? height * 0.7 : height * 0.5;
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
