import { NgModule } from '@angular/core';
import { IntersectionObserverDirective } from './intersection-observer.directive';
import { BluredImageComponent } from './blured-image.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [BluredImageComponent, IntersectionObserverDirective],
  imports: [CommonModule],
  exports: [BluredImageComponent]
})
export class BluredImageModule { }
