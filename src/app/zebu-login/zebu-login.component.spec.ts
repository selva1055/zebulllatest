import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZebuLoginComponent } from './zebu-login.component';

describe('ZebuLoginComponent', () => {
  let component: ZebuLoginComponent;
  let fixture: ComponentFixture<ZebuLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZebuLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZebuLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
