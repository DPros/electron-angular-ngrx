import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterionListComponent } from './criterion-list.component';

describe('CriterionListComponent', () => {
  let component: CriterionListComponent;
  let fixture: ComponentFixture<CriterionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriterionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriterionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
