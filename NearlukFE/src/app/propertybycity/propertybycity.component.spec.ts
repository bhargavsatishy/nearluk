import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertybycityComponent } from './propertybycity.component';

describe('PropertybycityComponent', () => {
  let component: PropertybycityComponent;
  let fixture: ComponentFixture<PropertybycityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertybycityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertybycityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
