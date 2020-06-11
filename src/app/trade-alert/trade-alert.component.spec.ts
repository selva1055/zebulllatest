import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeAlertComponent } from './trade-alert.component';

describe('TradeAlertComponent', () => {
  let component: TradeAlertComponent;
  let fixture: ComponentFixture<TradeAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
