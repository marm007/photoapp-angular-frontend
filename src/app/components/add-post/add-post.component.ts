import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {Post} from '../../models/post';
import {ImageSnippet} from '../../models/imageSnippet';
import {PostsService} from '../../services/post/posts.service';



@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

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
    /*this.selectedFile = new ImageSnippet(null, null);;*/
  }

  public resetImage() {
    this.selectedFile = new ImageSnippet(null, null);

  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
     /* this.selectedFile.pending = true;
      this.selectedFile.status = 'fail';*/
      /*this.selectedFile.pending = true;
      this.alert = {type: 'alert-danger', message: 'Cos jest nie tak'};*/

    });

    reader.readAsDataURL(file);
  }

  uploadPost() {
    if (this.selectedFile.file.type === 'image/jpeg') {
    this.postService.add(this.selectedFile.file, this.descriptionModel.text).subscribe(
      (res: Post) => {
        this.onSuccess();
        this.router.navigate(['post/'.concat(String(res.id))]);
      },
      (err) => {
        console.log(err);
        this.onError();
        this.errorMessage = err.error.detail;
      });
    } else {
      this.onError();
      this.errorMessage = 'Bad file tye';
    }
  }

}
