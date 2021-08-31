import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRefuelTankComponent } from './manage-refuel-tank.component';

describe('ManageRefuelTankComponent', () => {
  let component: ManageRefuelTankComponent;
  let fixture: ComponentFixture<ManageRefuelTankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRefuelTankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRefuelTankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
