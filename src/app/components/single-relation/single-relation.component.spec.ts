import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRelationComponent } from './single-relation.component';

describe('SingleRelationComponent', () => {
  let component: SingleRelationComponent;
  let fixture: ComponentFixture<SingleRelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleRelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
