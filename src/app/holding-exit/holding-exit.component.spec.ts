import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldingExitComponent } from './holding-exit.component';

describe('HoldingExitComponent', () => {
  let component: HoldingExitComponent;
  let fixture: ComponentFixture<HoldingExitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldingExitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
