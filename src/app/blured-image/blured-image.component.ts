import { Component, Input, OnInit } from '@angular/core';
import { IntersectionStatus } from './from-intersection-observer';
import { PostMeta } from '../models/post';
import { ImageType, prepareImage } from '../restConfig';

@Component({
  selector: 'app-blured-image',
  templateUrl: './blured-image.component.html',
  styleUrls: ['./blured-image.component.css']
})
export class BluredImageComponent implements OnInit {

  @Input() meta: PostMeta;

  visibilityStatus: IntersectionStatus = IntersectionStatus.Pending;
  intersectionStatus = IntersectionStatus;

  full: string;

  thumbnail: string;

  aspectRatio: number;

  isFullLoaded = false

  constructor() { }

  onVisibilityChanged(status: IntersectionStatus) {
    this.visibilityStatus = status;
  }

  ngOnInit(): void {
    this.aspectRatio = this.meta ? (this.meta.height / this.meta.width) * 100 : 80;
    this.full = this.meta ? prepareImage(this.meta.url, ImageType.LARGE) : '';
    this.thumbnail = this.meta ? prepareImage(this.meta.url, ImageType.THUMBNAIL) : '';
  }

}
