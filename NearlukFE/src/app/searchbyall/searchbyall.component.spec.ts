import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbyallComponent } from './searchbyall.component';

describe('SearchbyallComponent', () => {
  let component: SearchbyallComponent;
  let fixture: ComponentFixture<SearchbyallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchbyallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchbyallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
