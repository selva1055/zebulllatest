import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelExitAllComponent } from './cancel-exit-all.component';

describe('CancelExitAllComponent', () => {
  let component: CancelExitAllComponent;
  let fixture: ComponentFixture<CancelExitAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelExitAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelExitAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
