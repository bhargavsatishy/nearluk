import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOwnersComponent } from './my-owners.component';

describe('MyOwnersComponent', () => {
  let component: MyOwnersComponent;
  let fixture: ComponentFixture<MyOwnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOwnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
