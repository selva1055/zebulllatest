import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityinfoComponent } from './securityinfo.component';

describe('SecurityinfoComponent', () => {
  let component: SecurityinfoComponent;
  let fixture: ComponentFixture<SecurityinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
