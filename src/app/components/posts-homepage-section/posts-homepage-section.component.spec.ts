import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsHomepageSectionComponent } from './posts-homepage-section.component';

describe('PostsHomepageSectionComponent', () => {
  let component: PostsHomepageSectionComponent;
  let fixture: ComponentFixture<PostsHomepageSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostsHomepageSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsHomepageSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
