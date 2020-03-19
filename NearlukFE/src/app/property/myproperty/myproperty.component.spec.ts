import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MypropertyComponent } from './myproperty.component';

describe('MypropertyComponent', () => {
  let component: MypropertyComponent;
  let fixture: ComponentFixture<MypropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MypropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MypropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
