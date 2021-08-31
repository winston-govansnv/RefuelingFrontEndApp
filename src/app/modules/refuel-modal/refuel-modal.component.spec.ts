import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefuelModalComponent } from './refuel-modal.component';

describe('RefuelModalComponent', () => {
  let component: RefuelModalComponent;
  let fixture: ComponentFixture<RefuelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefuelModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefuelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
