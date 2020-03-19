import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyagentsComponent } from './myagents.component';

describe('MyagentsComponent', () => {
  let component: MyagentsComponent;
  let fixture: ComponentFixture<MyagentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyagentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyagentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
