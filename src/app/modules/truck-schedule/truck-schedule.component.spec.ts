import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckScheduleComponent } from './truck-schedule.component';

describe('TruckScheduleComponent', () => {
  let component: TruckScheduleComponent;
  let fixture: ComponentFixture<TruckScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
