import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnblockUserComponent } from './unblock-user.component';

describe('UnblockUserComponent', () => {
  let component: UnblockUserComponent;
  let fixture: ComponentFixture<UnblockUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnblockUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnblockUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
