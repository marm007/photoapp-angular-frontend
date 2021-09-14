import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationRoutingModule } from './navigation.routing.module';
import { HeaderComponent } from './header/header.component';
import { FilterComponent } from './filter/filter.component';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [HeaderComponent, FilterComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatListModule,
    MatTabsModule,
    MatSliderModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatMenuModule,
    NavigationRoutingModule
  ],
  exports: [HeaderComponent]
})
export class NavigationModule { }
