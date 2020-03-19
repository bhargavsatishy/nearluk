import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeOrganizationsComponent } from './large-organizations.component';

describe('LargeOrganizationsComponent', () => {
  let component: LargeOrganizationsComponent;
  let fixture: ComponentFixture<LargeOrganizationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LargeOrganizationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LargeOrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
