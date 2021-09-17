import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../auth/services/auth.service';
import { ImageSnippet } from '../../models/imageSnippet';
import { Post } from '../../models/post';
import { ImageType, prepareImage } from '../../restConfig';
import { PostsService } from '../../services/post/posts.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class PostEditComponent implements OnInit {

  selectedFile = new ImageSnippet(null, null);
  descriptionModel = { text: null };

  times = faTimes;
  errorMessage: string;

  canEdit = false;

  postToEdit: Post;

  constructor(private postService: PostsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userService.get(this.authService.userID)
        .subscribe(user => {
          this.canEdit = user.posts.indexOf(params.id) > -1;
          if (!this.canEdit) {
            this.router.navigate(['/']);
          } else {
            this.postService.get(params.id)
              .subscribe(postToEdit => {
                this.postToEdit = postToEdit;
                this.selectedFile = new ImageSnippet(prepareImage(postToEdit.image_meta.url, ImageType.LARGE));
                this.descriptionModel.text = postToEdit.description;
              });
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

  editPost() {
    this.selectedFile.pending = true;
    let image = null;
    let description = null;

    if (prepareImage(this.postToEdit.image_meta.url, ImageType.LARGE) !== this.selectedFile.src) {
      if (this.selectedFile.file.type === 'image/jpeg') {
        image = this.selectedFile.file;
      } else {
        this.onError();
        this.errorMessage = 'Bad file tye';
      }
    }

    if (this.descriptionModel.text !== this.postToEdit.description) {
      description = this.descriptionModel.text;
    }

    if (!image && !description) {
      this.snackBar.open('No changes were made!', null, {
        duration: 1500,
      });
      this.router.navigate(['post/'.concat(this.postToEdit.id)]);
      return;
    }

    this.postService.update(this.postToEdit.id, description, image).subscribe(
      (res: Post) => {
        this.snackBar.open('Changes have been saved!', null, {
          duration: 1500,
        });
        this.onSuccess();
        this.router.navigate(['post/'.concat(String(res.id))]);
      },
      (err) => {
        this.onError();
        this.errorMessage = err.error.detail ? err.error.detail : 'Something went wrong. Try again.';
      });


  }

}
