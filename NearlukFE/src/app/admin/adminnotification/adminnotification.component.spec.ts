import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminnotificationComponent } from './adminnotification.component';

describe('AdminnotificationComponent', () => {
  let component: AdminnotificationComponent;
  let fixture: ComponentFixture<AdminnotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminnotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
