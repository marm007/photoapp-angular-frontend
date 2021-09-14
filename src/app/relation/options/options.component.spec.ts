import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationOptionsComponent } from './options.component';

describe('OptionsComponent', () => {
  let component: RelationOptionsComponent;
  let fixture: ComponentFixture<RelationOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
