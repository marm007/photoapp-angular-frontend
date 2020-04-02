import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationsHomepageSectionComponent } from './relations-homepage-section.component';

describe('RelationsHomepageSectionComponent', () => {
  let component: RelationsHomepageSectionComponent;
  let fixture: ComponentFixture<RelationsHomepageSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationsHomepageSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationsHomepageSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
