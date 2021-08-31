import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFuelpriceComponent } from './manage-fuelprice.component';

describe('ManageFuelpriceComponent', () => {
  let component: ManageFuelpriceComponent;
  let fixture: ComponentFixture<ManageFuelpriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageFuelpriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFuelpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
