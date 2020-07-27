import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRenewComponent } from './password-renew.component';

describe('PasswordRenewComponent', () => {
  let component: PasswordRenewComponent;
  let fixture: ComponentFixture<PasswordRenewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordRenewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
