import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewBatchesComponent } from './review-batches.component';

describe('ReviewBatchesComponent', () => {
  let component: ReviewBatchesComponent;
  let fixture: ComponentFixture<ReviewBatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewBatchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
