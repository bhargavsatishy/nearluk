import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetareabycityComponent } from './getareabycity.component';

describe('GetareabycityComponent', () => {
  let component: GetareabycityComponent;
  let fixture: ComponentFixture<GetareabycityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetareabycityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetareabycityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
