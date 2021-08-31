import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningReportModalComponent } from './planning-report-modal.component';

describe('PlanningReportModalComponent', () => {
  let component: PlanningReportModalComponent;
  let fixture: ComponentFixture<PlanningReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningReportModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
