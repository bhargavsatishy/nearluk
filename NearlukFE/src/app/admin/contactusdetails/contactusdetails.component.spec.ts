import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactusdetailsComponent } from './contactusdetails.component';

describe('ContactusdetailsComponent', () => {
  let component: ContactusdetailsComponent;
  let fixture: ComponentFixture<ContactusdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactusdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactusdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
