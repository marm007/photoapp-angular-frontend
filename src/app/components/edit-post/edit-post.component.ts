import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute, Router} from '@angular/router';
import {Post} from '../../models/post';
import {ImageSnippet} from '../../models/imageSnippet';
import {PostsService} from '../../services/post/posts.service';
import {UserService} from '../../services/user/user.service';
import {AuthService} from '../../services/auth/auth.service';




@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  selectedFile = new ImageSnippet(null, null);
  descriptionModel = {text: null};

  times = faTimes ;
  errorMessage: string;

  canEdit = false;

  constructor(private postService: PostsService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private authService: AuthService) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userService.get(this.authService.userID)
        .subscribe(user => {
          this.canEdit = user.posts.indexOf(params.id) > -1;
          if (!this.canEdit) {
            this.router.navigate(['not-found']);
          }
        });
    });
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

  editPost() {}

}
