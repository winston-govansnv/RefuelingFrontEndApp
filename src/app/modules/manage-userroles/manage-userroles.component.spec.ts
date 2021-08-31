import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserrolesComponent } from './manage-userroles.component';

describe('ManageUserrolesComponent', () => {
  let component: ManageUserrolesComponent;
  let fixture: ComponentFixture<ManageUserrolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserrolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserrolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
