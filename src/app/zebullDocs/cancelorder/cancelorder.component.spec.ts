import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelorderComponent } from './cancelorder.component';

describe('CancelorderComponent', () => {
  let component: CancelorderComponent;
  let fixture: ComponentFixture<CancelorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
