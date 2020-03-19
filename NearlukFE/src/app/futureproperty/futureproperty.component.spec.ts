import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuturepropertyComponent } from './futureproperty.component';

describe('FuturepropertyComponent', () => {
  let component: FuturepropertyComponent;
  let fixture: ComponentFixture<FuturepropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuturepropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuturepropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
