import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnblockuserComponent } from './unblockuser.component';

describe('UnblockuserComponent', () => {
  let component: UnblockuserComponent;
  let fixture: ComponentFixture<UnblockuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnblockuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnblockuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
