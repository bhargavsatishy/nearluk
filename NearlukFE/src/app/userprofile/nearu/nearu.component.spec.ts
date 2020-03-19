import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NearuComponent } from './nearu.component';

describe('NearuComponent', () => {
  let component: NearuComponent;
  let fixture: ComponentFixture<NearuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NearuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
