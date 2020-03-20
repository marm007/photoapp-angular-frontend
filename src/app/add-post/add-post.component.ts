import { Component, OnInit } from '@angular/core';
import {ImageService} from '../image.service';

class ImageSnippet {
  pending = false;
  status = 'init';
  constructor(public src: string, public file: File) {
  }
}

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  selectedFile: ImageSnippet;

  imageAdded: boolean;

  constructor(private imageService: ImageService) {
    this.imageAdded = false;
  }

  ngOnInit(): void {
  }

  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.selectedFile.pending = true;
     /* this.imageService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {
          this.onSuccess();
        },
        (err) => {
          this.onError();
        });*/
    });

    reader.readAsDataURL(file);
  }

}
