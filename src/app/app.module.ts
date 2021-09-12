import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { RecaptchaFormsModule, RecaptchaModule } from "ng-recaptcha";
import { DeviceDetectorModule } from 'ngx-device-detector';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { AuthModule } from './auth/auth.module';
import { ActivateUserComponent } from './components/activate-user/activate-user.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { FilterComponent } from './components/filter/filter.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { HeaderComponent } from './components/header/header.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { OptionsComponent } from './components/options/options.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostsHomepageSectionComponent } from './components/posts-homepage-section/posts-homepage-section.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { RelationDetailComponent } from './components/relation-detail/relation-detail.component';
import { RelationsHomepageSectionComponent } from './components/relations-homepage-section/relations-homepage-section.component';
import { RelationsModalContainerComponent } from './components/relations-modal-container/relations-modal-container.component';
import { ResetComponent } from './components/reset/reset.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    ProfileComponent,
    HomepageComponent,
    AddPostComponent,
    ForgotComponent,
    PostDetailComponent,
    RelationDetailComponent,
    OptionsComponent,
    ResetComponent,
    FilterComponent,
    EditPostComponent,
    RelationsModalContainerComponent,
    RelationsHomepageSectionComponent,
    PostsHomepageSectionComponent,
    ProfileEditComponent,
    ForbiddenComponent,
    ActivateUserComponent,
  ],
  imports: [
    AppRoutingModule,
    AuthModule,
    BrowserModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    TruncateModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule.withConfig({
      useColumnBasisZero: false,
      printWithBreakpoints: ['md', 'lt-lg', 'lt-xl', 'gt-sm', 'gt-xs']
    }),
    ScrollingModule,
    MatInputModule,
    FormsModule,
    DeviceDetectorModule.forRoot(),
    MatMenuModule,
    MatDialogModule,
    FontAwesomeModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
    MatAutocompleteModule,
    MatExpansionModule,
    NgbCollapseModule,
    MatBottomSheetModule,
    MatListModule,
    MatTabsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

}
