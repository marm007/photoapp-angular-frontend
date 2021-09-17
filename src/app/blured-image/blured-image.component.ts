import { Component, Input, OnInit } from '@angular/core';
import { PostMeta } from '../models/post';
import { ImageType, prepareImage } from '../restConfig';

@Component({
  selector: 'app-blured-image',
  templateUrl: './blured-image.component.html',
  styleUrls: ['./blured-image.component.css']
})
export class BluredImageComponent implements OnInit {

  @Input() meta: PostMeta;

  full: string;

  thumbnail: string;

  aspectRatio: number;

  isFullLoaded = false
  
  constructor() { }

  ngOnInit(): void {
    this.aspectRatio = (this.meta.height / this.meta.width) * 100;
    this.full = prepareImage(this.meta.url, ImageType.LARGE);
    this.thumbnail = prepareImage(this.meta.url, ImageType.THUMBNAIL);
  }

}
