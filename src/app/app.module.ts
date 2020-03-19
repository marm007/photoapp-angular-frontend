import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PostsComponent } from './posts/posts.component';
import { RelationsComponent } from './relations/relations.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { TruncateModule } from '@yellowspot/ng-truncate';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import {MatMenuModule} from '@angular/material/menu';
import { LoginComponent } from './login/login.component';
import {MatDialogModule} from '@angular/material/dialog';
import { RegisterComponent } from './register/register.component';
import {RouterModule, Routes} from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { HomepageComponent } from './homepage/homepage.component';


const appRoutes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
  },
  { path: '',
    pathMatch: 'full',
    component: HomepageComponent,
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    RelationsComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    ProfileComponent,
    HomepageComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
