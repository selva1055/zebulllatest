import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketorderComponent } from './marketorder.component';

describe('MarketorderComponent', () => {
  let component: MarketorderComponent;
  let fixture: ComponentFixture<MarketorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
