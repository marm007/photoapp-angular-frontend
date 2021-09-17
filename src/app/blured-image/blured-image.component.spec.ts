import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BluredImageComponent } from './blured-image.component';

describe('BluredImageComponent', () => {
  let component: BluredImageComponent;
  let fixture: ComponentFixture<BluredImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BluredImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BluredImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
