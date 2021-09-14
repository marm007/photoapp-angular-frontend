import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationModalComponent } from './modal.component';

describe('RelationsModalContainerComponent', () => {
  let component: RelationModalComponent;
  let fixture: ComponentFixture<RelationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
