import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FueltypeModalComponent } from './fueltype-modal.component';

describe('FueltypeModalComponent', () => {
  let component: FueltypeModalComponent;
  let fixture: ComponentFixture<FueltypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FueltypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FueltypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
