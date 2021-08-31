import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFueltypeComponent } from './manage-fueltype.component';

describe('ManageFueltypeComponent', () => {
  let component: ManageFueltypeComponent;
  let fixture: ComponentFixture<ManageFueltypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageFueltypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFueltypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
