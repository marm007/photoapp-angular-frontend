import { Component, OnInit } from '@angular/core';
import {Photo} from '../photo';
import {PhotoService} from '../photo.service';


@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {
  photos: Photo[];

  constructor(private photoService: PhotoService) { }

  ngOnInit(): void {
    this.getPhotos();
  }

  getPhotos(): void {
    this.photoService.getPhotos()
      .subscribe(photos => this.photos = photos);
  }

}
