import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ImageSnippet } from '../../models/imageSnippet';
import { Post } from '../../models/post';
import { PostsService } from '../../services/post/posts.service';

@Component({
  selector: 'app-post-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class PostAddComponent implements OnInit {

  selectedFile = new ImageSnippet(null, null);
  descriptionModel = {text: null};

  times = faTimes ;
  errorMessage: string;

  constructor(private postService: PostsService, private router: Router) {
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
  }

  public resetImage() {
    this.selectedFile = new ImageSnippet(null, null);

  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });

    reader.readAsDataURL(file);
  }

  uploadPost() {
    this.selectedFile.pending = true;
    if (this.selectedFile.file.type === 'image/jpeg') {
      this.postService.add(this.selectedFile.file, this.descriptionModel.text).subscribe(
      (res: Post) => {
        this.onSuccess();
        this.router.navigate(['post/'.concat(String(res.id))]);
      },
      (err) => {
        this.onError();
        this.errorMessage = err.error.detail ? err.error.detail : 'Something went wrong. Try again.';
      });
    } else {
      this.onError();
      this.errorMessage = 'Bad file tye';
    }
  }

}
