import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelpriceModalComponent } from './fuelprice-modal.component';

describe('FuelpriceModalComponent', () => {
  let component: FuelpriceModalComponent;
  let fixture: ComponentFixture<FuelpriceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelpriceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelpriceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
