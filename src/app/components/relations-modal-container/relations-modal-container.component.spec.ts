import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationsModalContainerComponent } from './relations-modal-container.component';

describe('RelationsModalContainerComponent', () => {
  let component: RelationsModalContainerComponent;
  let fixture: ComponentFixture<RelationsModalContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationsModalContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationsModalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
