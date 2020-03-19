import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseOwnersComponent } from './house-owners.component';

describe('HouseOwnersComponent', () => {
  let component: HouseOwnersComponent;
  let fixture: ComponentFixture<HouseOwnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseOwnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
