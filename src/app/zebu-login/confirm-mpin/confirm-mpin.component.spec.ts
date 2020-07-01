import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMpinComponent } from './confirm-mpin.component';

describe('ConfirmMpinComponent', () => {
  let component: ConfirmMpinComponent;
  let fixture: ComponentFixture<ConfirmMpinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmMpinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmMpinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
