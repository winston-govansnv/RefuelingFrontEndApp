import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchRecordComponent } from './batch-record.component';

describe('BatchRecordComponent', () => {
  let component: BatchRecordComponent;
  let fixture: ComponentFixture<BatchRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
