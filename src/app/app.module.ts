import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { AuthModule } from './auth/auth.module';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeModule } from './home/home.module';
import { NavigationModule } from './navigation/navigation.module';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';
import { RelationModule } from './relation/relation.module';



@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ForbiddenComponent
  ],
  imports: [
    AuthModule,
    NavigationModule,
    HomeModule,
    PostModule,
    RelationModule,
    ProfileModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DeviceDetectorModule.forRoot(),
    MatDialogModule,
    MatBottomSheetModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

}
